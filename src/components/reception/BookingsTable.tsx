import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type BookingStatus = "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
type GuestType = "individual" | "corporate" | "vip" | "group";

interface Booking {
  id: string;
  booking_ref: string;
  check_in_date: string;
  check_out_date: string;
  status: BookingStatus;
  total_amount: number;
  amount_paid: number;
  adults: number;
  children: number;
  guests: {
    id: string;
    full_name: string;
    guest_type: GuestType;
  } | null;
  rooms: {
    id: string;
    room_number: string;
  } | null;
}

interface BookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
}

const statusConfig: Record<BookingStatus, { className: string; label: string }> = {
  pending: { className: "bg-warning/10 text-warning border-warning/30", label: "Pending" },
  confirmed: { className: "bg-info/10 text-info border-info/30", label: "Confirmed" },
  checked_in: { className: "bg-success/10 text-success border-success/30", label: "Checked In" },
  checked_out: { className: "bg-muted text-muted-foreground border-border", label: "Checked Out" },
  cancelled: { className: "bg-destructive/10 text-destructive border-destructive/30", label: "Cancelled" },
};

const guestTypeConfig: Record<GuestType, string> = {
  individual: "",
  corporate: "bg-navy/10 text-navy",
  vip: "bg-accent/10 text-accent",
  group: "bg-info/10 text-info",
};

export function BookingsTable({ bookings, isLoading }: BookingsTableProps) {
  const queryClient = useQueryClient();

  const checkOutMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");

      // Update booking status
      const { error: bookingError } = await (supabase as any)
        .from("bookings")
        .update({ status: "checked_out" })
        .eq("id", bookingId);

      if (bookingError) throw bookingError;

      // Update room status to cleaning
      if (booking.rooms?.id) {
        const { error: roomError } = await (supabase as any)
          .from("rooms")
          .update({ status: "cleaning" })
          .eq("id", booking.rooms.id);

        if (roomError) throw roomError;
      }
    },
    onSuccess: () => {
      toast.success("Guest checked out successfully!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      toast.error("Failed to check out: " + error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No bookings found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Booking Ref</TableHead>
          <TableHead>Guest Name</TableHead>
          <TableHead>Room</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Check-in</TableHead>
          <TableHead>Check-out</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell className="font-mono text-sm">
              {booking.booking_ref}
            </TableCell>
            <TableCell className="font-medium">
              {booking.guests?.full_name || "—"}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="font-mono">
                {booking.rooms?.room_number || "—"}
              </Badge>
            </TableCell>
            <TableCell>
              {booking.guests && (
                <Badge
                  variant="secondary"
                  className={guestTypeConfig[booking.guests.guest_type]}
                >
                  {booking.guests.guest_type}
                </Badge>
              )}
            </TableCell>
            <TableCell>
              {format(new Date(booking.check_in_date), "MMM dd, yyyy")}
            </TableCell>
            <TableCell>
              {format(new Date(booking.check_out_date), "MMM dd, yyyy")}
            </TableCell>
            <TableCell>
              <Badge className={statusConfig[booking.status].className}>
                {statusConfig[booking.status].label}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <span className="font-medium">${booking.total_amount}</span>
                {booking.amount_paid < booking.total_amount && (
                  <span className="text-warning ml-1">
                    (Paid: ${booking.amount_paid})
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                View
              </Button>
              {booking.status === "checked_in" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => checkOutMutation.mutate(booking.id)}
                  disabled={checkOutMutation.isPending}
                >
                  Check-out
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
