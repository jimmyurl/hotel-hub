import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BedDouble, UserPlus, LogOut, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomGrid } from "@/components/reception/RoomGrid";
import { BookingsTable } from "@/components/reception/BookingsTable";
import { CheckInDialog } from "@/components/reception/CheckInDialog";

type RoomStatus = "available" | "occupied" | "reserved" | "maintenance" | "cleaning";
type RoomType = "standard" | "deluxe" | "suite" | "executive";
type BookingStatus = "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
type GuestType = "individual" | "corporate" | "vip" | "group";

interface Room {
  id: string;
  room_number: string;
  room_type: RoomType;
  floor: number;
  base_rate: number;
  status: RoomStatus;
  amenities: string[];
  notes: string | null;
}

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

const Reception = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch rooms
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("rooms")
        .select("*")
        .order("room_number");

      if (error) throw error;
      return (data || []) as Room[];
    },
  });

  // Fetch active bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("bookings")
        .select(`
          *,
          guests (id, full_name, guest_type),
          rooms (id, room_number)
        `)
        .in("status", ["pending", "confirmed", "checked_in"])
        .order("check_in_date", { ascending: false });

      if (error) throw error;
      return (data || []) as Booking[];
    },
  });

  // Calculate stats
  const stats = {
    total: rooms.length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    available: rooms.filter((r) => r.status === "available").length,
    checkoutsToday: bookings.filter(
      (b) =>
        b.status === "checked_in" &&
        b.check_out_date === new Date().toISOString().split("T")[0]
    ).length,
  };

  const handleRoomClick = (room: Room) => {
    if (room.status === "available") {
      setSelectedRoom(room);
      setCheckInOpen(true);
    }
  };

  // Filter bookings by search
  const filteredBookings = bookings.filter(
    (b) =>
      b.booking_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guests?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.rooms?.room_number.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-3xl font-bold">Reception</h1>
          <p className="text-muted-foreground">
            Manage guest check-ins, check-outs, and reservations
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="gradient-gold text-navy-dark shadow-gold hover:opacity-90"
            onClick={() => {
              const availableRoom = rooms.find((r) => r.status === "available");
              if (availableRoom) {
                setSelectedRoom(availableRoom);
                setCheckInOpen(true);
              }
            }}
          >
            <UserPlus className="mr-2" size={18} />
            New Check-in
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Rooms", value: stats.total, icon: BedDouble, color: "bg-navy/10 text-navy" },
          { label: "Occupied", value: stats.occupied, icon: UserPlus, color: "bg-accent/10 text-accent" },
          { label: "Available", value: stats.available, icon: BedDouble, color: "bg-success/10 text-success" },
          { label: "Check-outs Today", value: stats.checkoutsToday, icon: LogOut, color: "bg-info/10 text-info" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-elevated p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-serif font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rooms">Room Status</TabsTrigger>
            <TabsTrigger value="bookings">Current Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms">
            <RoomGrid
              rooms={rooms}
              onRoomClick={handleRoomClick}
              isLoading={roomsLoading}
            />
          </TabsContent>

          <TabsContent value="bookings">
            <div className="card-elevated">
              <div className="p-6 border-b border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="font-serif text-xl font-semibold">
                    Active Bookings
                  </h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={16}
                      />
                      <Input
                        placeholder="Search bookings..."
                        className="pl-9 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter size={18} />
                    </Button>
                  </div>
                </div>
              </div>

              <BookingsTable
                bookings={filteredBookings}
                isLoading={bookingsLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Check-in Dialog */}
      <CheckInDialog
        room={selectedRoom}
        open={checkInOpen}
        onOpenChange={setCheckInOpen}
      />
    </div>
  );
};

export default Reception;
