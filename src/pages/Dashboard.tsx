import { motion } from "framer-motion";
import {
  BedDouble,
  TrendingUp,
  Users,
  Wallet,
  Calendar,
  Coffee,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RoomStatusGrid } from "@/components/dashboard/RoomStatusGrid";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-hero rounded-2xl p-8 text-primary-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <h1 className="font-serif text-4xl font-bold mb-2">
            Welcome to Victorious Perch
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-xl">
            Your complete hotel management system. Track rooms, orders, finances,
            and guests all in one place.
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <BedDouble className="text-accent" size={24} />
                <div>
                  <p className="text-2xl font-serif font-bold">85%</p>
                  <p className="text-xs text-primary-foreground/70">Occupancy</p>
                </div>
              </div>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Users className="text-accent" size={24} />
                <div>
                  <p className="text-2xl font-serif font-bold">24</p>
                  <p className="text-xs text-primary-foreground/70">Active Guests</p>
                </div>
              </div>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-accent" size={24} />
                <div>
                  <p className="text-2xl font-serif font-bold">8</p>
                  <p className="text-xs text-primary-foreground/70">Check-outs Today</p>
                </div>
              </div>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Coffee className="text-accent" size={24} />
                <div>
                  <p className="text-2xl font-serif font-bold">42</p>
                  <p className="text-xs text-primary-foreground/70">Orders Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Revenue"
          value="TZS 2.8M"
          subtitle="From all departments"
          icon={Wallet}
          trend={{ value: 12.5, isPositive: true }}
          variant="gold"
        />
        <StatCard
          title="Room Revenue"
          value="TZS 1.5M"
          subtitle="8 rooms occupied"
          icon={BedDouble}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="F&B Revenue"
          value="TZS 980K"
          subtitle="Restaurant & Bar"
          icon={Coffee}
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatCard
          title="Pending Invoices"
          value="TZS 4.2M"
          subtitle="5 corporate accounts"
          icon={TrendingUp}
          trend={{ value: 3.1, isPositive: false }}
          variant="navy"
        />
      </div>

      {/* Room Status */}
      <RoomStatusGrid />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
