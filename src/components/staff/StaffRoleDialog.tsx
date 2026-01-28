import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Shield } from "lucide-react";
import { AppRole } from "@/contexts/AuthContext";

interface StaffMember {
  id: string;
  user_id: string;
  full_name: string;
  roles: AppRole[];
}

interface StaffRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
  onSave: (roles: AppRole[]) => void;
  isLoading: boolean;
}

const availableRoles: { value: AppRole; label: string; description: string }[] = [
  { value: "manager", label: "Manager", description: "Full access to all departments and settings" },
  { value: "reception", label: "Reception", description: "Access to front desk and room management" },
  { value: "restaurant", label: "Restaurant", description: "Access to restaurant operations" },
  { value: "bar", label: "Bar", description: "Access to bar operations" },
  { value: "inventory", label: "Inventory", description: "Access to stock and inventory management" },
  { value: "accounts", label: "Accounts", description: "Access to financial records and reports" },
];

export function StaffRoleDialog({
  open,
  onOpenChange,
  staff,
  onSave,
  isLoading,
}: StaffRoleDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);

  useEffect(() => {
    if (staff) {
      setSelectedRoles(staff.roles);
    }
  }, [staff]);

  const toggleRole = (role: AppRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = () => {
    onSave(selectedRoles);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Manage Roles
          </DialogTitle>
          <DialogDescription>
            Assign department roles to {staff?.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {availableRoles.map((role) => (
            <div
              key={role.value}
              className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={role.value}
                checked={selectedRoles.includes(role.value)}
                onCheckedChange={() => toggleRole(role.value)}
              />
              <div className="space-y-1">
                <Label
                  htmlFor={role.value}
                  className="font-medium cursor-pointer"
                >
                  {role.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {role.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Roles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
