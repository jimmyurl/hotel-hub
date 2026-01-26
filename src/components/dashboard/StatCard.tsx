import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "gold" | "navy";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "card-elevated p-6 relative overflow-hidden",
        variant === "gold" && "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20",
        variant === "navy" && "gradient-navy text-primary-foreground"
      )}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <Icon size={128} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              variant === "default" && "bg-accent/10 text-accent",
              variant === "gold" && "gradient-gold text-navy-dark shadow-gold",
              variant === "navy" && "bg-primary-foreground/20 text-primary-foreground"
            )}
          >
            <Icon size={24} />
          </div>
          {trend && (
            <span
              className={cn(
                "text-sm font-medium px-2 py-1 rounded-full",
                trend.isPositive
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
          )}
        </div>

        <h3
          className={cn(
            "text-sm font-medium mb-1",
            variant === "navy" ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-3xl font-serif font-bold",
            variant === "navy" ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {value}
        </p>
        {subtitle && (
          <p
            className={cn(
              "text-xs mt-1",
              variant === "navy" ? "text-primary-foreground/60" : "text-muted-foreground"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
