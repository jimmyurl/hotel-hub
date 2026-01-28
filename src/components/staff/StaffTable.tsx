import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Shield, UserCheck, UserX } from "lucide-react";
import { AppRole } from "@/contexts/AuthContext";
import { format } from "date-fns";

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

interface StaffTableProps {
  staff: StaffMember[];
  isLoading: boolean;
  onEditProfile: (staff: StaffMember) => void;
  onEditRoles: (staff: StaffMember) => void;
}

const roleColors: Record<AppRole, string> = {
  manager: "bg-primary text-primary-foreground",
  reception: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  restaurant: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
  bar: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  inventory: "bg-green-500/20 text-green-700 dark:text-green-300",
  accounts: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
};

export function StaffTable({
  staff,
  isLoading,
  onEditProfile,
  onEditRoles,
}: StaffTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No staff members found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Member</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Hire Date</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar_url ?? undefined} />
                    <AvatarFallback>
                      {member.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.full_name}</span>
                </div>
              </TableCell>
              <TableCell>
                {member.phone || (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {member.hire_date ? (
                  format(new Date(member.hire_date), "MMM d, yyyy")
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {member.roles.length > 0 ? (
                    member.roles.map((role) => (
                      <Badge
                        key={role}
                        variant="secondary"
                        className={roleColors[role]}
                      >
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No roles assigned
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {member.is_active ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-700 dark:text-green-300"
                  >
                    <UserCheck className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-red-500/20 text-red-700 dark:text-red-300"
                  >
                    <UserX className="h-3 w-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditRoles(member)}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Roles
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditProfile(member)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
