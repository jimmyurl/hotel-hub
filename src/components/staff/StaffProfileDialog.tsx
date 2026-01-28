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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, User } from "lucide-react";

interface StaffMember {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  hire_date: string | null;
  is_active: boolean;
}

interface StaffProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
  onSave: (updates: Partial<StaffMember>) => void;
  isLoading: boolean;
}

export function StaffProfileDialog({
  open,
  onOpenChange,
  staff,
  onSave,
  isLoading,
}: StaffProfileDialogProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    hire_date: "",
    is_active: true,
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        full_name: staff.full_name,
        phone: staff.phone ?? "",
        hire_date: staff.hire_date ?? "",
        is_active: staff.is_active,
      });
    }
  }, [staff]);

  const handleSave = () => {
    onSave({
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim() || null,
      hire_date: formData.hire_date || null,
      is_active: formData.is_active,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update staff member information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, full_name: e.target.value }))
              }
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hire_date">Hire Date</Label>
            <Input
              id="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, hire_date: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Inactive staff cannot access the system
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_active: checked }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !formData.full_name.trim()}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
