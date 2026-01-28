import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StaffTable } from "@/components/staff/StaffTable";
import { StaffRoleDialog } from "@/components/staff/StaffRoleDialog";
import { StaffProfileDialog } from "@/components/staff/StaffProfileDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, UserPlus } from "lucide-react";
import { AppRole } from "@/contexts/AuthContext";

interface StaffMember {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  hire_date: string | null;
  avatar_url: string | null;
  is_active: boolean;
  roles: AppRole[];
}

export default function StaffManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const staffWithRoles: StaffMember[] = profiles.map((profile) => ({
        ...profile,
        roles: roles
          .filter((r) => r.user_id === profile.user_id)
          .map((r) => r.role as AppRole),
      }));

      return staffWithRoles;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<StaffMember> }) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.updates.full_name,
          phone: data.updates.phone,
          hire_date: data.updates.hire_date,
          is_active: data.updates.is_active,
        })
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      toast({ title: "Profile updated successfully" });
      setProfileDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateRolesMutation = useMutation({
    mutationFn: async (data: { user_id: string; roles: AppRole[] }) => {
      // Delete existing roles
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", data.user_id);

      if (deleteError) throw deleteError;

      // Insert new roles
      if (data.roles.length > 0) {
        const { error: insertError } = await supabase.from("user_roles").insert(
          data.roles.map((role) => ({
            user_id: data.user_id,
            role,
          }))
        );

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      toast({ title: "Roles updated successfully" });
      setRoleDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating roles",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredStaff = staffMembers?.filter((staff) =>
    staff.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditProfile = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setProfileDialogOpen(true);
  };

  const handleEditRoles = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setRoleDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Staff Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage staff profiles and department roles
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredStaff?.length ?? 0} staff members
        </div>
      </div>

      <StaffTable
        staff={filteredStaff ?? []}
        isLoading={isLoading}
        onEditProfile={handleEditProfile}
        onEditRoles={handleEditRoles}
      />

      <StaffRoleDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        staff={selectedStaff}
        onSave={(roles) => {
          if (selectedStaff) {
            updateRolesMutation.mutate({
              user_id: selectedStaff.user_id,
              roles,
            });
          }
        }}
        isLoading={updateRolesMutation.isPending}
      />

      <StaffProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        staff={selectedStaff}
        onSave={(updates) => {
          if (selectedStaff) {
            updateProfileMutation.mutate({
              id: selectedStaff.id,
              updates,
            });
          }
        }}
        isLoading={updateProfileMutation.isPending}
      />
    </div>
  );
}
