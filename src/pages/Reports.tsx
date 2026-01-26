import { motion } from "framer-motion";
import { BarChart3, Download, Calendar, TrendingUp, Users, BedDouble, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyData = [
  { month: "Jan", revenue: 28500000, expenses: 18200000 },
  { month: "Feb", revenue: 32100000, expenses: 19800000 },
  { month: "Mar", revenue: 29800000, expenses: 17500000 },
  { month: "Apr", revenue: 35200000, expenses: 21000000 },
  { month: "May", revenue: 38500000, expenses: 22800000 },
  { month: "Jun", revenue: 42000000, expenses: 24500000 },
];

const departmentData = [
  { name: "Rooms", value: 45, color: "hsl(220, 45%, 20%)" },
  { name: "Restaurant", value: 30, color: "hsl(38, 90%, 50%)" },
  { name: "Bar", value: 15, color: "hsl(200, 80%, 50%)" },
  { name: "Corporate", value: 10, color: "hsl(150, 60%, 40%)" },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Business insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="mr-2" size={18} />
            Date Range
          </Button>
          <Button className="gradient-gold text-navy-dark shadow-gold hover:opacity-90">
            <Download className="mr-2" size={18} />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Monthly Revenue", value: "TZS 42M", change: "+12%", icon: TrendingUp, positive: true },
          { label: "Occupancy Rate", value: "78%", change: "+5%", icon: BedDouble, positive: true },
          { label: "Guest Count", value: "245", change: "+18%", icon: Users, positive: true },
          { label: "F&B Revenue", value: "TZS 15M", change: "+8%", icon: UtensilsCrossed, positive: true },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-elevated p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="text-accent" size={20} />
              <span className={`text-xs font-medium ${stat.positive ? "text-success" : "text-destructive"}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-serif font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 card-elevated p-6"
        >
          <h2 className="font-serif text-xl font-semibold mb-6">Revenue vs Expenses (2025)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(220, 15%, 45%)", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "hsl(220, 15%, 45%)", fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000000}M`}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 15%, 88%)",
                    borderRadius: "0.75rem",
                  }}
                  formatter={(value: number) => [`TZS ${(value / 1000000).toFixed(1)}M`, ""]}
                />
                <Bar dataKey="revenue" fill="hsl(38, 90%, 50%)" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="hsl(220, 45%, 20%)" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue by Department */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-6"
        >
          <h2 className="font-serif text-xl font-semibold mb-6">Revenue by Department</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 15%, 88%)",
                    borderRadius: "0.75rem",
                  }}
                  formatter={(value: number) => [`${value}%`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {departmentData.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                  <span className="text-sm">{dept.name}</span>
                </div>
                <span className="text-sm font-semibold">{dept.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-elevated p-6"
      >
        <h2 className="font-serif text-xl font-semibold mb-4">Quick Reports</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Daily Sales Report",
            "Occupancy Report",
            "Staff Performance",
            "Inventory Summary",
            "Corporate Statements",
            "Cash Flow Report",
            "P&L Statement",
            "Outstanding Balances",
          ].map((report, index) => (
            <Button key={report} variant="outline" className="justify-start h-auto py-3">
              <BarChart3 className="mr-2 text-accent" size={18} />
              {report}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
