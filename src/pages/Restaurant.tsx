import { motion } from "framer-motion";
import { UtensilsCrossed, Plus, Clock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mockOrders = [
  { id: 1, table: "Table 3", items: ["Grilled Fish", "Rice", "Salad"], total: 45000, status: "preparing", time: "12:30 PM" },
  { id: 2, table: "Table 5", items: ["Chicken Curry", "Chapati x2"], total: 32000, status: "ready", time: "12:25 PM" },
  { id: 3, table: "Room 102", items: ["Breakfast Set", "Coffee"], total: 28000, status: "served", time: "8:00 AM" },
  { id: 4, table: "Table 1", items: ["Beef Steak", "Wine"], total: 85000, status: "preparing", time: "12:35 PM" },
  { id: 5, table: "Table 7", items: ["Vegetable Soup", "Bread"], total: 18000, status: "pending", time: "12:40 PM" },
];

const statusConfig = {
  pending: { color: "bg-muted text-muted-foreground", icon: Clock },
  preparing: { color: "bg-accent/10 text-accent", icon: Clock },
  ready: { color: "bg-success/10 text-success", icon: Check },
  served: { color: "bg-info/10 text-info", icon: Check },
  cancelled: { color: "bg-destructive/10 text-destructive", icon: X },
};

const Restaurant = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-3xl font-bold">Restaurant</h1>
          <p className="text-muted-foreground">Manage food orders and kitchen operations</p>
        </div>
        <Button className="gradient-gold text-navy-dark shadow-gold hover:opacity-90">
          <Plus className="mr-2" size={18} />
          New Order
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Orders", value: "42", color: "bg-accent/10 text-accent" },
          { label: "Pending", value: "5", color: "bg-muted text-muted-foreground" },
          { label: "Preparing", value: "8", color: "bg-warning/10 text-warning" },
          { label: "Today's Revenue", value: "TZS 580K", color: "bg-success/10 text-success" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-elevated p-4"
          >
            <div className={`inline-block px-3 py-1 rounded-lg text-xs font-medium mb-2 ${stat.color}`}>
              {stat.label}
            </div>
            <p className="text-2xl font-serif font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Active Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-serif text-xl font-semibold mb-4">Active Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockOrders.map((order, index) => {
            const config = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <UtensilsCrossed className="text-accent" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">{order.table}</p>
                      <p className="text-xs text-muted-foreground">{order.time}</p>
                    </div>
                  </div>
                  <Badge className={cn("flex items-center gap-1", config.color)}>
                    <StatusIcon size={12} />
                    {order.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="text-sm text-muted-foreground">
                      • {item}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-serif font-bold text-lg">
                    TZS {order.total.toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <Button size="sm" variant="outline">
                        Start
                      </Button>
                    )}
                    {order.status === "preparing" && (
                      <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                        Ready
                      </Button>
                    )}
                    {order.status === "ready" && (
                      <Button size="sm" className="bg-info text-info-foreground hover:bg-info/90">
                        Serve
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Restaurant;
