import { motion } from "framer-motion";
import { BedDouble, User, Clock, Sparkles, Brush } from "lucide-react";
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
  amenities: string[];
  notes: string | null;
}

interface RoomGridProps {
  rooms: Room[];
  onRoomClick: (room: Room) => void;
  isLoading?: boolean;
}

const statusConfig: Record<RoomStatus, { color: string; icon: typeof BedDouble; label: string }> = {
  available: { color: "bg-success/10 border-success/30 text-success", icon: BedDouble, label: "Available" },
  occupied: { color: "bg-accent/10 border-accent/30 text-accent", icon: User, label: "Occupied" },
  reserved: { color: "bg-info/10 border-info/30 text-info", icon: Clock, label: "Reserved" },
  maintenance: { color: "bg-muted border-border text-muted-foreground", icon: Sparkles, label: "Maintenance" },
  cleaning: { color: "bg-warning/10 border-warning/30 text-warning", icon: Brush, label: "Cleaning" },
};

const typeLabels: Record<RoomType, string> = {
  standard: "Standard",
  deluxe: "Deluxe",
  suite: "Suite",
  executive: "Executive",
};

export function RoomGrid({ rooms, onRoomClick, isLoading }: RoomGridProps) {
  if (isLoading) {
    return (
      <div className="card-elevated p-6">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Group rooms by floor
  const roomsByFloor = rooms.reduce((acc, room) => {
    const floor = room.floor;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div key={status} className="flex items-center gap-2 text-xs">
            <div className={cn("w-3 h-3 rounded-full", config.color.split(" ")[0])} />
            <span className="text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Rooms by Floor */}
      {Object.entries(roomsByFloor)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([floor, floorRooms]) => (
          <div key={floor} className="card-elevated p-6">
            <h3 className="font-serif font-semibold mb-4">Floor {floor}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
              {floorRooms
                .sort((a, b) => a.room_number.localeCompare(b.room_number))
                .map((room, index) => {
                  const config = statusConfig[room.status];
                  const StatusIcon = config.icon;

                  return (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => onRoomClick(room)}
                      className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1",
                        config.color
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif font-bold text-lg">{room.room_number}</span>
                        <StatusIcon size={16} />
                      </div>
                      <span className="text-xs opacity-70">{typeLabels[room.room_type]}</span>
                      <p className="text-xs mt-1 font-medium">${room.base_rate}/night</p>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        ))}
    </div>
  );
}
