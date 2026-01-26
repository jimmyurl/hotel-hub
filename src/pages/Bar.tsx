import { motion } from "framer-motion";
import { Wine, Plus, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockBarOrders = [
  { id: 1, location: "Table 8", items: ["Safari Lager x3", "Kilimanjaro x2"], total: 25000, status: "served" },
  { id: 2, location: "Bar Counter", items: ["Whiskey Double", "Gin Tonic"], total: 45000, status: "preparing" },
  { id: 3, location: "Room 201", items: ["Wine Bottle - Red", "Snacks"], total: 120000, status: "pending" },
];

const topSelling = [
  { name: "Safari Lager", sold: 45, stock: 80 },
  { name: "Kilimanjaro", sold: 38, stock: 60 },
  { name: "Tusker", sold: 32, stock: 45 },
  { name: "Serengeti", sold: 28, stock: 50 },
  { name: "Red Wine", sold: 15, stock: 25 },
];

const Bar = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-3xl font-bold">Bar</h1>
          <p className="text-muted-foreground">Manage beverage sales and stock</p>
        </div>
        <Button className="gradient-gold text-navy-dark shadow-gold hover:opacity-90">
          <Plus className="mr-2" size={18} />
          New Order
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Sales", value: "TZS 420K", icon: TrendingUp, color: "bg-success/10 text-success" },
          { label: "Orders", value: "28", icon: Wine, color: "bg-accent/10 text-accent" },
          { label: "Active Shift", value: "Day Shift", icon: Clock, color: "bg-info/10 text-info" },
          { label: "Low Stock Items", value: "3", icon: Wine, color: "bg-destructive/10 text-destructive" },
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
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-serif font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6"
        >
          <h2 className="font-serif text-xl font-semibold mb-4">Active Orders</h2>
          <div className="space-y-4">
            {mockBarOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl border border-border hover:border-accent/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center">
                      <Wine className="text-navy" size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{order.location}</p>
                      <p className="text-xs text-muted-foreground">Order #{order.id}</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      order.status === "served"
                        ? "bg-success/10 text-success"
                        : order.status === "preparing"
                        ? "bg-accent/10 text-accent"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  {order.items.join(", ")}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold">
                    TZS {order.total.toLocaleString()}
                  </span>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Selling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-6"
        >
          <h2 className="font-serif text-xl font-semibold mb-4">Top Selling Today</h2>
          <div className="space-y-4">
            {topSelling.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.sold} / {item.stock} units
                  </span>
                </div>
                <Progress value={(item.sold / item.stock) * 100} className="h-2" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Bar;
