import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  base_rate: number;
}

interface CheckInDialogProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const checkInSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  id_type: z.string().optional(),
  id_number: z.string().optional(),
  guest_type: z.enum(["individual", "corporate", "vip", "group"] as const),
  check_out_date: z.string().min(1, "Check-out date is required"),
  adults: z.coerce.number().min(1, "At least 1 adult required"),
  children: z.coerce.number().min(0),
  special_requests: z.string().optional(),
});

type CheckInFormValues = z.infer<typeof checkInSchema>;

export function CheckInDialog({ room, open, onOpenChange }: CheckInDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      id_type: "",
      id_number: "",
      guest_type: "individual",
      check_out_date: "",
      adults: 1,
      children: 0,
      special_requests: "",
    },
  });

  const checkInMutation = useMutation({
    mutationFn: async (values: CheckInFormValues) => {
      if (!room) throw new Error("No room selected");

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
      const checkIn = new Date();
      const checkOut = new Date(values.check_out_date);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = nights * room.base_rate;

      // Create booking
      const { error: bookingError } = await (supabase as any)
        .from("bookings")
        .insert({
          booking_ref: `VPH-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          room_id: room.id,
          guest_id: guest.id,
          check_in_date: checkIn.toISOString().split("T")[0],
          check_out_date: values.check_out_date,
          status: "checked_in",
          total_amount: totalAmount,
          adults: values.adults,
          children: values.children,
          special_requests: values.special_requests || null,
        });

      if (bookingError) throw bookingError;

      // Update room status
      const { error: roomError } = await (supabase as any)
        .from("rooms")
        .update({ status: "occupied" })
        .eq("id", room.id);

      if (roomError) throw roomError;
    },
    onSuccess: () => {
      toast.success("Guest checked in successfully!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to check in guest: " + error.message);
    },
  });

  const onSubmit = async (values: CheckInFormValues) => {
    setIsSubmitting(true);
    await checkInMutation.mutateAsync(values);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Check-in to Room {room?.room_number}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="id_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input placeholder="ID number" {...field} />
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
                name="check_out_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-out Date *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        min={new Date().toISOString().split("T")[0]}
                        {...field} 
                      />
                    </FormControl>
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
                      <Input type="number" min={1} {...field} />
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
                      <Input type="number" min={0} {...field} />
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

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="gradient-gold text-navy-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Complete Check-in"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
