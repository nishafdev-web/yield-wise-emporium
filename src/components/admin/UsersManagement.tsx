import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, Search, RefreshCw, UserCheck } from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";
import { StatusDot } from "./DashboardOverview";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  created_at: string;
}

interface UserWithRole extends Profile {
  role: "admin" | "user";
}

export function UsersManagement() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const [{ data: profilesData, error: profilesError }, { data: rolesData, error: rolesError }] =
        await Promise.all([
          supabase.from("profiles").select("*").order("created_at", { ascending: false }),
          supabase.from("user_roles").select("user_id, role"),
        ]);

      if (profilesError) throw profilesError;
      if (rolesError) throw rolesError;

      const rolesMap = new Map(rolesData?.map((r) => [r.user_id, r.role]) || []);
      const usersWithRoles: UserWithRole[] = (profilesData || []).map((profile) => ({
        ...profile,
        role: (rolesMap.get(profile.id) as "admin" | "user") || "user",
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const { status } = useRealtime("users-management", [
    {
      table: "profiles",
      onInsert: (newProfile) => {
        setUsers((prev) => [{ ...newProfile, role: "user" }, ...prev]);
        toast({ title: "👤 New User Registered", description: newProfile.email });
      },
      onUpdate: (updated) => {
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
        );
      },
      onDelete: (deleted) => {
        setUsers((prev) => prev.filter((u) => u.id !== deleted.id));
        toast({ title: "User Removed", variant: "destructive" });
      },
    },
    {
      table: "user_roles",
      onChange: fetchUsers,
    },
  ]);

  const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
    setUpdatingRole(userId);
    try {
      const { data: existing } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      let error;
      if (existing) {
        ({ error } = await supabase.from("user_roles").update({ role: newRole }).eq("user_id", userId));
      } else {
        ({ error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole }));
      }

      if (error) throw error;

      await supabase.from("events").insert({
        actor_user_id: (await supabase.auth.getUser()).data.user?.id,
        verb: "changed_role",
        object_type: "user",
        object_id: userId,
        metadata: { new_role: newRole },
      });

      toast({ title: "✅ Role Updated", description: `User role set to "${newRole}"` });
      await fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUpdatingRole(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.full_name?.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.city?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <CardTitle>Users Management</CardTitle>
          <StatusDot status={status} />
          <Badge variant="secondary">{users.length} total</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-56"
            />
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No users found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="animate-in fade-in transition-all">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {user.role === "admin" && <UserCheck className="h-4 w-4 text-primary" />}
                      {user.full_name || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell className="text-sm">{user.phone || "—"}</TableCell>
                  <TableCell className="text-sm">{user.city || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={user.role}
                      onValueChange={(v: "admin" | "user") => handleRoleChange(user.id, v)}
                      disabled={updatingRole === user.id}
                    >
                      <SelectTrigger className="w-28">
                        {updatingRole === user.id ? (
                          <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
