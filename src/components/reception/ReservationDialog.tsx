import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type RoomStatus = "available" | "occupied" | "reserved" | "maintenance" | "cleaning";
type RoomType = "standard" | "deluxe" | "suite" | "executive";

interface Room {
  id: string;
  room_number: string;
  room_type: RoomType;
  floor: number;
  base_rate: number;
  status: RoomStatus;
}

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reservationSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email").max(255).optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  id_type: z.string().optional(),
  id_number: z.string().max(50).optional(),
  guest_type: z.enum(["individual", "corporate", "vip", "group"] as const),
  room_id: z.string().min(1, "Please select a room"),
  check_in_date: z.date({ required_error: "Check-in date is required" }),
  check_out_date: z.date({ required_error: "Check-out date is required" }),
  adults: z.coerce.number().min(1, "At least 1 adult required").max(10),
  children: z.coerce.number().min(0).max(10),
  special_requests: z.string().max(500).optional(),
}).refine((data) => data.check_out_date > data.check_in_date, {
  message: "Check-out must be after check-in",
  path: ["check_out_date"],
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

const roomTypeLabels: Record<RoomType, string> = {
  standard: "Standard",
  deluxe: "Deluxe",
  suite: "Suite",
  executive: "Executive",
};

export function ReservationDialog({ open, onOpenChange }: ReservationDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available rooms
  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms-available"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("rooms")
        .select("*")
        .in("status", ["available", "cleaning"])
        .order("room_number");

      if (error) throw error;
      return (data || []) as Room[];
    },
    enabled: open,
  });

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      id_type: "",
      id_number: "",
      guest_type: "individual",
      room_id: "",
      adults: 1,
      children: 0,
      special_requests: "",
    },
  });

  const selectedRoomId = form.watch("room_id");
  const checkInDate = form.watch("check_in_date");
  const checkOutDate = form.watch("check_out_date");

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  
  // Calculate total
  const calculateTotal = () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) return 0;
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return nights > 0 ? nights * selectedRoom.base_rate : 0;
  };

  const reservationMutation = useMutation({
    mutationFn: async (values: ReservationFormValues) => {
      // Create guest
      const { data: guest, error: guestError } = await (supabase as any)
        .from("guests")
        .insert({
          full_name: values.full_name,
          email: values.email || null,
          phone: values.phone || null,
          id_type: values.id_type || null,
          id_number: values.id_number || null,
          guest_type: values.guest_type,
        })
        .select()
        .single();

      if (guestError) throw guestError;

      // Calculate nights and total
      const nights = Math.ceil(
        (values.check_out_date.getTime() - values.check_in_date.getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalAmount = nights * (selectedRoom?.base_rate || 0);

      // Create booking with confirmed status
      const { error: bookingError } = await (supabase as any)
        .from("bookings")
        .insert({
          booking_ref: `VPH-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          room_id: values.room_id,
          guest_id: guest.id,
          check_in_date: format(values.check_in_date, "yyyy-MM-dd"),
          check_out_date: format(values.check_out_date, "yyyy-MM-dd"),
          status: "confirmed",
          total_amount: totalAmount,
          adults: values.adults,
          children: values.children,
          special_requests: values.special_requests || null,
        });

      if (bookingError) throw bookingError;

      // Update room status to reserved
      const { error: roomError } = await (supabase as any)
        .from("rooms")
        .update({ status: "reserved" })
        .eq("id", values.room_id);

      if (roomError) throw roomError;
    },
    onSuccess: () => {
      toast.success("Reservation created successfully!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["rooms-available"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to create reservation: " + error.message);
    },
  });

  const onSubmit = async (values: ReservationFormValues) => {
    setIsSubmitting(true);
    await reservationMutation.mutateAsync(values);
    setIsSubmitting(false);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Create New Reservation
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Room Selection */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-4">
              <h3 className="font-medium">Room & Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="room_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Room *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.room_number} - {roomTypeLabels[room.room_type]} (${room.base_rate}/night)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="check_in_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-in Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "MMM dd, yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="check_out_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-out Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "MMM dd, yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date <= (checkInDate || new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {selectedRoom && checkInDate && checkOutDate && (
                <div className="flex items-center justify-between p-3 rounded-md bg-background border">
                  <span className="text-sm text-muted-foreground">
                    {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} night(s) × ${selectedRoom.base_rate}
                  </span>
                  <span className="font-serif font-bold text-lg">
                    Total: ${calculateTotal()}
                  </span>
                </div>
              )}
            </div>

            {/* Guest Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Guest Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guest_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                          <SelectItem value="group">Group</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="id_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                          <SelectItem value="national_id">National ID</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adults *</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={10} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="children"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Children</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={10} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="special_requests"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Special Requests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requests or notes..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="gradient-gold text-navy-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Reservation"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
