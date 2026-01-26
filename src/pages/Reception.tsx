import { motion } from "framer-motion";
import { BedDouble, UserPlus, LogOut, Search, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockGuests = [
  { id: 1, name: "John Doe", room: "102", checkIn: "2025-01-24", checkOut: "2025-01-28", status: "checked-in", type: "Individual" },
  { id: 2, name: "Jane Smith", room: "104", checkIn: "2025-01-25", checkOut: "2025-01-27", status: "checked-in", type: "Individual" },
  { id: 3, name: "ABC Corporation", room: "201", checkIn: "2025-01-20", checkOut: "2025-01-30", status: "checked-in", type: "Corporate" },
  { id: 4, name: "VIP Guest", room: "204", checkIn: "2025-01-26", checkOut: "2025-01-30", status: "checked-in", type: "VIP" },
  { id: 5, name: "Tourist Group", room: "206", checkIn: "2025-01-26", checkOut: "2025-01-26", status: "checking-out", type: "Group" },
  { id: 6, name: "Business Traveler", room: "103", checkIn: "2025-01-27", checkOut: "2025-01-29", status: "reserved", type: "Individual" },
];

const Reception = () => {
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
          <p className="text-muted-foreground">Manage guest check-ins, check-outs, and reservations</p>
        </div>
        <div className="flex gap-3">
          <Button className="gradient-gold text-navy-dark shadow-gold hover:opacity-90">
            <UserPlus className="mr-2" size={18} />
            New Check-in
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2" size={18} />
            Reservations
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Rooms", value: "30", icon: BedDouble, color: "bg-navy/10 text-navy" },
          { label: "Occupied", value: "24", icon: UserPlus, color: "bg-accent/10 text-accent" },
          { label: "Available", value: "4", icon: BedDouble, color: "bg-success/10 text-success" },
          { label: "Check-outs Today", value: "5", icon: LogOut, color: "bg-info/10 text-info" },
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

      {/* Guest List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-elevated"
      >
        <div className="p-6 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-serif text-xl font-semibold">Current Guests</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input placeholder="Search guests..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter size={18} />
              </Button>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest Name</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockGuests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {guest.room}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      guest.type === "VIP"
                        ? "bg-accent/10 text-accent"
                        : guest.type === "Corporate"
                        ? "bg-navy/10 text-navy"
                        : ""
                    }
                  >
                    {guest.type}
                  </Badge>
                </TableCell>
                <TableCell>{guest.checkIn}</TableCell>
                <TableCell>{guest.checkOut}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      guest.status === "checked-in"
                        ? "bg-success/10 text-success border-success/30"
                        : guest.status === "checking-out"
                        ? "bg-warning/10 text-warning border-warning/30"
                        : "bg-info/10 text-info border-info/30"
                    }
                  >
                    {guest.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                  {guest.status === "checked-in" && (
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Check-out
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default Reception;
