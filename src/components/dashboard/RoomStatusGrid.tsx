import { motion } from "framer-motion";
import { BedDouble, User, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type RoomStatus = "available" | "occupied" | "reserved" | "maintenance";

interface Room {
  number: string;
  type: string;
  status: RoomStatus;
  guest?: string;
  checkOut?: string;
}

const mockRooms: Room[] = [
  { number: "101", type: "Standard", status: "available" },
  { number: "102", type: "Standard", status: "occupied", guest: "John Doe", checkOut: "Today" },
  { number: "103", type: "Deluxe", status: "reserved" },
  { number: "104", type: "Deluxe", status: "occupied", guest: "Jane Smith", checkOut: "Tomorrow" },
  { number: "105", type: "Suite", status: "available" },
  { number: "106", type: "Standard", status: "maintenance" },
  { number: "201", type: "Deluxe", status: "occupied", guest: "Corporate Guest", checkOut: "Jan 28" },
  { number: "202", type: "Suite", status: "available" },
  { number: "203", type: "Standard", status: "reserved" },
  { number: "204", type: "Deluxe", status: "occupied", guest: "VIP Guest", checkOut: "Jan 30" },
  { number: "205", type: "Suite", status: "available" },
  { number: "206", type: "Standard", status: "occupied", guest: "Tourist", checkOut: "Today" },
];

const statusConfig: Record<RoomStatus, { color: string; icon: typeof BedDouble; label: string }> = {
  available: { color: "bg-success/10 border-success/30 text-success", icon: BedDouble, label: "Available" },
  occupied: { color: "bg-accent/10 border-accent/30 text-accent", icon: User, label: "Occupied" },
  reserved: { color: "bg-info/10 border-info/30 text-info", icon: Clock, label: "Reserved" },
  maintenance: { color: "bg-muted border-border text-muted-foreground", icon: Sparkles, label: "Maintenance" },
};

export function RoomStatusGrid() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif font-semibold">Room Status</h2>
          <p className="text-sm text-muted-foreground">Real-time room availability</p>
        </div>
        <div className="flex gap-4">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="flex items-center gap-2 text-xs">
              <div className={cn("w-3 h-3 rounded-full", config.color.split(" ")[0])} />
              <span className="text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
        {mockRooms.map((room, index) => {
          const config = statusConfig[room.status];
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={room.number}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1",
                config.color
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif font-bold text-lg">{room.number}</span>
                <StatusIcon size={16} />
              </div>
              <span className="text-xs opacity-70">{room.type}</span>
              {room.guest && (
                <p className="text-xs mt-2 truncate font-medium">{room.guest}</p>
              )}
              {room.checkOut && (
                <p className="text-xs opacity-60">Out: {room.checkOut}</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
