import { motion } from "framer-motion";
import { Package, Plus, AlertTriangle, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockInventory = [
  { id: 1, name: "Rice (25kg)", category: "Food", stock: 15, minStock: 10, unit: "bags", lastPurchase: "2025-01-20", status: "ok" },
  { id: 2, name: "Cooking Oil (20L)", category: "Food", stock: 8, minStock: 5, unit: "jerrycans", lastPurchase: "2025-01-18", status: "ok" },
  { id: 3, name: "Safari Lager", category: "Beverage", stock: 24, minStock: 50, unit: "crates", lastPurchase: "2025-01-22", status: "low" },
  { id: 4, name: "Bed Sheets", category: "Housekeeping", stock: 30, minStock: 20, unit: "sets", lastPurchase: "2025-01-15", status: "ok" },
  { id: 5, name: "Chicken (kg)", category: "Food", stock: 12, minStock: 20, unit: "kg", lastPurchase: "2025-01-25", status: "low" },
  { id: 6, name: "Toilet Paper", category: "Housekeeping", stock: 5, minStock: 15, unit: "packs", lastPurchase: "2025-01-10", status: "critical" },
];

const recentMovements = [
  { item: "Rice (25kg)", type: "in", quantity: 10, department: "Store", date: "2025-01-25" },
  { item: "Safari Lager", type: "out", quantity: 5, department: "Bar", date: "2025-01-25" },
  { item: "Chicken (kg)", type: "out", quantity: 8, department: "Restaurant", date: "2025-01-25" },
  { item: "Bed Sheets", type: "out", quantity: 4, department: "Housekeeping", date: "2025-01-24" },
];

const Inventory = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage stock, purchases, and issuing</p>
        </div>
        <div className="flex gap-3">
          <Button className="gradient-gold text-navy-dark shadow-gold hover:opacity-90">
            <Plus className="mr-2" size={18} />
            New Purchase
          </Button>
          <Button variant="outline">
            <Package className="mr-2" size={18} />
            Issue Stock
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: "156", color: "bg-navy/10 text-navy" },
          { label: "Low Stock", value: "8", color: "bg-warning/10 text-warning" },
          { label: "Critical", value: "3", color: "bg-destructive/10 text-destructive" },
          { label: "This Month Purchases", value: "TZS 4.2M", color: "bg-success/10 text-success" },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 card-elevated"
        >
          <div className="p-6 border-b border-border">
            <h2 className="font-serif text-xl font-semibold">Stock Levels</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Min. Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.stock} {item.unit}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.minStock} {item.unit}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.status === "ok"
                          ? "bg-success/10 text-success"
                          : item.status === "low"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {item.status === "ok" ? "OK" : item.status === "low" ? "Low" : "Critical"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        {/* Recent Movements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-6"
        >
          <h2 className="font-serif text-xl font-semibold mb-4">Recent Movements</h2>
          <div className="space-y-4">
            {recentMovements.map((movement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                <div
                  className={`p-2 rounded-lg ${
                    movement.type === "in" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}
                >
                  {movement.type === "in" ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{movement.item}</p>
                  <p className="text-xs text-muted-foreground">
                    {movement.type === "in" ? "Received" : `To ${movement.department}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {movement.type === "in" ? "+" : "-"}{movement.quantity}
                  </p>
                  <p className="text-xs text-muted-foreground">{movement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Inventory;
