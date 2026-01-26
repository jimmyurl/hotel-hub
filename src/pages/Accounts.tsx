import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, CreditCard, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";
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

const mockTransactions = [
  { id: 1, description: "Room Payment - Room 102", type: "income", category: "Rooms", amount: 150000, method: "Cash", date: "2025-01-26" },
  { id: 2, description: "Restaurant Sales", type: "income", category: "Restaurant", amount: 85000, method: "M-Pesa", date: "2025-01-26" },
  { id: 3, description: "Supplier Payment - Fresh Foods Ltd", type: "expense", category: "Supplies", amount: 450000, method: "Bank Transfer", date: "2025-01-26" },
  { id: 4, description: "Bar Sales", type: "income", category: "Bar", amount: 62000, method: "Card", date: "2025-01-26" },
  { id: 5, description: "Utility Bills - Electricity", type: "expense", category: "Utilities", amount: 280000, method: "Bank Transfer", date: "2025-01-25" },
  { id: 6, description: "Corporate Payment - ABC Corp", type: "income", category: "Corporate", amount: 1500000, method: "Bank Transfer", date: "2025-01-25" },
];

const Accounts = () => {
  const totalIncome = mockTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = mockTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-3xl font-bold">Accounts & Finance</h1>
          <p className="text-muted-foreground">Track revenue, expenses, and financial records</p>
        </div>
        <div className="flex gap-3">
          <Button className="gradient-gold text-navy-dark shadow-gold hover:opacity-90">
            <TrendingUp className="mr-2" size={18} />
            Record Income
          </Button>
          <Button variant="outline">
            <TrendingDown className="mr-2" size={18} />
            Record Expense
          </Button>
        </div>
      </motion.div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6 gradient-gold text-navy-dark"
        >
          <div className="flex items-center gap-3 mb-4">
            <Wallet size={24} />
            <span className="font-medium">Today's Balance</span>
          </div>
          <p className="text-4xl font-serif font-bold">TZS {((totalIncome - totalExpense) / 1000).toFixed(0)}K</p>
          <p className="text-sm opacity-70 mt-2">Net cash flow today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <ArrowUpRight size={20} />
            </div>
            <span className="font-medium text-muted-foreground">Total Income</span>
          </div>
          <p className="text-3xl font-serif font-bold text-success">
            TZS {(totalIncome / 1000).toFixed(0)}K
          </p>
          <p className="text-sm text-muted-foreground mt-2">From all sources</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
              <ArrowDownRight size={20} />
            </div>
            <span className="font-medium text-muted-foreground">Total Expenses</span>
          </div>
          <p className="text-3xl font-serif font-bold text-destructive">
            TZS {(totalExpense / 1000).toFixed(0)}K
          </p>
          <p className="text-sm text-muted-foreground mt-2">Operating costs</p>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-elevated"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">Recent Transactions</h2>
          <Button variant="outline" size="sm">
            <FileText className="mr-2" size={16} />
            Export
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        tx.type === "income" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {tx.type === "income" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    </div>
                    <span className="font-medium">{tx.description}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{tx.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-muted-foreground" />
                    <span className="text-sm">{tx.method}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-mono font-semibold ${
                      tx.type === "income" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}TZS {tx.amount.toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default Accounts;
