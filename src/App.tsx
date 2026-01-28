import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Reception from "./pages/Reception";
import Restaurant from "./pages/Restaurant";
import Bar from "./pages/Bar";
import Inventory from "./pages/Inventory";
import Corporate from "./pages/Corporate";
import Accounts from "./pages/Accounts";
import Reports from "./pages/Reports";
import StaffManagement from "./pages/StaffManagement";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
            </Route>

            {/* Staff Management - Manager only */}
            <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
              <Route element={<MainLayout />}>
                <Route path="/staff" element={<StaffManagement />} />
              </Route>
            </Route>

            {/* Reception - Manager or Reception role */}
            <Route element={<ProtectedRoute allowedRoles={["reception"]} />}>
              <Route element={<MainLayout />}>
                <Route path="/reception" element={<Reception />} />
              </Route>
            </Route>

            {/* Restaurant - Manager or Restaurant role */}
            <Route element={<ProtectedRoute allowedRoles={["restaurant"]} />}>
              <Route element={<MainLayout />}>
                <Route path="/restaurant" element={<Restaurant />} />
              </Route>
            </Route>

            {/* Bar - Manager or Bar role */}
            <Route element={<ProtectedRoute allowedRoles={["bar"]} />}>
              <Route element={<MainLayout />}>
                <Route path="/bar" element={<Bar />} />
              </Route>
            </Route>

            {/* Inventory - Manager or Inventory role */}
            <Route element={<ProtectedRoute allowedRoles={["inventory"]} />}>
              <Route element={<MainLayout />}>
                <Route path="/inventory" element={<Inventory />} />
              </Route>
            </Route>

            {/* Corporate & Accounts - Manager or Accounts role */}
            <Route element={<ProtectedRoute allowedRoles={["accounts"]} />}>
              <Route element={<MainLayout />}>
                <Route path="/corporate" element={<Corporate />} />
                <Route path="/accounts" element={<Accounts />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
