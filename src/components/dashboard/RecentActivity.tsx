import { motion } from "framer-motion";
import { BedDouble, UtensilsCrossed, Wine, CreditCard, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "check-in" | "check-out" | "restaurant" | "bar" | "payment";
  description: string;
  amount?: number;
  time: string;
}

const mockActivities: Activity[] = [
  { id: "1", type: "check-in", description: "John Doe checked into Room 102", time: "5 min ago" },
  { id: "2", type: "restaurant", description: "Table 5 - Lunch order placed", amount: 45000, time: "12 min ago" },
  { id: "3", type: "payment", description: "Corporate payment received - ABC Ltd", amount: 1500000, time: "25 min ago" },
  { id: "4", type: "bar", description: "Bar Order #45 completed", amount: 28000, time: "32 min ago" },
  { id: "5", type: "check-out", description: "Guest checked out - Room 105", time: "1 hour ago" },
  { id: "6", type: "restaurant", description: "Table 3 - Dinner reservation confirmed", time: "1.5 hours ago" },
];

const typeConfig = {
  "check-in": { icon: UserPlus, color: "text-success bg-success/10" },
  "check-out": { icon: BedDouble, color: "text-info bg-info/10" },
  "restaurant": { icon: UtensilsCrossed, color: "text-accent bg-accent/10" },
  "bar": { icon: Wine, color: "text-navy-light bg-navy/10" },
  "payment": { icon: CreditCard, color: "text-success bg-success/10" },
};

export function RecentActivity() {
  return (
    <div className="card-elevated p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif font-semibold">Recent Activity</h2>
          <p className="text-sm text-muted-foreground">Latest transactions & events</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity, index) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={cn("p-2 rounded-lg", config.color)}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              {activity.amount && (
                <span className="text-sm font-semibold text-success">
                  TZS {activity.amount.toLocaleString()}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
