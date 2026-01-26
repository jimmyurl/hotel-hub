import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", rooms: 850000, restaurant: 420000, bar: 180000 },
  { name: "Tue", rooms: 720000, restaurant: 380000, bar: 220000 },
  { name: "Wed", rooms: 950000, restaurant: 510000, bar: 290000 },
  { name: "Thu", rooms: 1100000, restaurant: 480000, bar: 260000 },
  { name: "Fri", rooms: 1350000, restaurant: 620000, bar: 380000 },
  { name: "Sat", rooms: 1500000, restaurant: 750000, bar: 450000 },
  { name: "Sun", rooms: 1200000, restaurant: 580000, bar: 320000 },
];

export function RevenueChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif font-semibold">Weekly Revenue</h2>
          <p className="text-sm text-muted-foreground">Revenue breakdown by department</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-navy" />
            <span className="text-xs text-muted-foreground">Rooms</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-xs text-muted-foreground">Restaurant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-info" />
            <span className="text-xs text-muted-foreground">Bar</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRooms" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(220, 45%, 20%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(220, 45%, 20%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRestaurant" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 90%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38, 90%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(220, 15%, 45%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(220, 15%, 88%)" }}
            />
            <YAxis
              tick={{ fill: "hsl(220, 15%, 45%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(220, 15%, 88%)" }}
              tickFormatter={(value) => `${value / 1000000}M`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 15%, 88%)",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 20px -2px hsl(220 30% 15% / 0.08)",
              }}
              formatter={(value: number) => [`TZS ${value.toLocaleString()}`, ""]}
            />
            <Area
              type="monotone"
              dataKey="rooms"
              stroke="hsl(220, 45%, 20%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRooms)"
            />
            <Area
              type="monotone"
              dataKey="restaurant"
              stroke="hsl(38, 90%, 50%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRestaurant)"
            />
            <Area
              type="monotone"
              dataKey="bar"
              stroke="hsl(200, 80%, 50%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBar)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
