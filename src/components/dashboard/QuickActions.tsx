import { motion } from "framer-motion";
import { UserPlus, ShoppingCart, Receipt, FileText, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { icon: UserPlus, label: "New Check-in", color: "gradient-gold text-navy-dark shadow-gold" },
  { icon: ShoppingCart, label: "New Order", color: "bg-accent/10 text-accent hover:bg-accent/20" },
  { icon: Receipt, label: "Create Invoice", color: "bg-success/10 text-success hover:bg-success/20" },
  { icon: FileText, label: "Daily Report", color: "bg-info/10 text-info hover:bg-info/20" },
  { icon: Calendar, label: "Reservations", color: "bg-navy/10 text-navy hover:bg-navy/20" },
  { icon: Package, label: "Stock Alert", color: "bg-warning/10 text-warning hover:bg-warning/20" },
];

export function QuickActions() {
  return (
    <div className="card-elevated p-6">
      <div className="mb-6">
        <h2 className="text-xl font-serif font-semibold">Quick Actions</h2>
        <p className="text-sm text-muted-foreground">Common tasks at your fingertips</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant="ghost"
              className={`w-full h-auto flex-col gap-2 p-4 ${action.color} transition-all duration-300 hover:-translate-y-1`}
            >
              <action.icon size={24} />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
