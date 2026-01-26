import { motion } from "framer-motion";
import { Building2, Plus, CreditCard, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockCorporates = [
  { id: 1, name: "ABC Corporation", creditLimit: 5000000, balance: 2500000, terms: "Net 30", status: "active", lastPayment: "2025-01-15" },
  { id: 2, name: "XYZ Industries", creditLimit: 3000000, balance: 2800000, terms: "Net 15", status: "warning", lastPayment: "2025-01-05" },
  { id: 3, name: "Government Agency", creditLimit: 10000000, balance: 4500000, terms: "Net 60", status: "active", lastPayment: "2025-01-20" },
  { id: 4, name: "NGO Foundation", creditLimit: 2000000, balance: 1800000, terms: "Net 30", status: "overdue", lastPayment: "2024-12-20" },
  { id: 5, name: "Mining Company Ltd", creditLimit: 8000000, balance: 1200000, terms: "Net 45", status: "active", lastPayment: "2025-01-22" },
];

const Corporate = () => {
  const totalOutstanding = mockCorporates.reduce((sum, c) => sum + c.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-3xl font-bold">Corporate Accounts</h1>
          <p className="text-muted-foreground">Manage credit customers and corporate billing</p>
        </div>
        <div className="flex gap-3">
          <Button className="gradient-gold text-navy-dark shadow-gold hover:opacity-90">
            <Plus className="mr-2" size={18} />
            Add Corporate
          </Button>
          <Button variant="outline">
            <FileText className="mr-2" size={18} />
            Generate Invoices
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Outstanding", value: `TZS ${(totalOutstanding / 1000000).toFixed(1)}M`, icon: CreditCard, color: "bg-accent/10 text-accent" },
          { label: "Active Accounts", value: "5", icon: Building2, color: "bg-success/10 text-success" },
          { label: "Overdue Payments", value: "2", icon: AlertCircle, color: "bg-destructive/10 text-destructive" },
          { label: "This Month Received", value: "TZS 8.5M", icon: CreditCard, color: "bg-info/10 text-info" },
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

      {/* Corporate Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-elevated"
      >
        <div className="p-6 border-b border-border">
          <h2 className="font-serif text-xl font-semibold">Corporate Clients</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Credit Limit</TableHead>
              <TableHead>Outstanding</TableHead>
              <TableHead>Credit Usage</TableHead>
              <TableHead>Terms</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCorporates.map((corp) => {
              const usagePercent = (corp.balance / corp.creditLimit) * 100;
              return (
                <TableRow key={corp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center">
                        <Building2 className="text-navy" size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{corp.name}</p>
                        <p className="text-xs text-muted-foreground">Last payment: {corp.lastPayment}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">TZS {corp.creditLimit.toLocaleString()}</TableCell>
                  <TableCell className="font-mono font-semibold">TZS {corp.balance.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="w-32 space-y-1">
                      <Progress 
                        value={usagePercent} 
                        className={`h-2 ${usagePercent > 80 ? "[&>div]:bg-destructive" : usagePercent > 50 ? "[&>div]:bg-warning" : "[&>div]:bg-success"}`}
                      />
                      <p className="text-xs text-muted-foreground">{usagePercent.toFixed(0)}% used</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{corp.terms}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        corp.status === "active"
                          ? "bg-success/10 text-success"
                          : corp.status === "warning"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {corp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Invoice</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default Corporate;
