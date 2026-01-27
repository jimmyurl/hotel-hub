import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mb-6"
        >
          <ShieldX className="w-12 h-12 text-destructive" />
        </motion.div>

        <h1 className="text-3xl font-serif font-bold text-foreground mb-3">
          Access Denied
        </h1>
        <p className="text-muted-foreground mb-8">
          You don't have permission to access this page. Please contact your manager
          if you believe this is an error.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link to="/">
              <Home size={18} />
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild className="gradient-gold text-navy-dark">
            <Link to="/" onClick={() => window.history.back()}>
              <ArrowLeft size={18} />
              Go Back
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
