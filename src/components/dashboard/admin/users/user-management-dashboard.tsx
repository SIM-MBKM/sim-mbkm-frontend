"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Search, Edit, Shield, Mail, User, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogOverlay } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserAPI } from "@/lib/api/providers/user-provider";
import { useCurrentUser, useUserRole, useUpdateUser, useUpdateUserRole } from "@/lib/api/hooks";
import type { UserRole } from "@/lib/api/services";
import type { UserAlt as UserType } from "@/lib/api/services";
import useToast from "@/lib/api/hooks/use-toast";

// Define getRoleBadgeVariant as a utility function outside of components
const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "destructive";
    case "LO-MBKM":
      return "default";
    case "DOSEN PEMBIMBING":
      return "secondary";
    case "DOSEN PEMONEV":
      return "secondary";
    case "MAHASISWA":
      return "outline";
    case "MITRA":
      return "default";
    default:
      return "secondary";
  }
};

interface UserEditDialogProps {
  user: UserType;
  currentUserRole?: string;
  onClose: () => void;
  onSuccess: () => void;
}

function UserEditDialog({ user, currentUserRole, onClose, onSuccess }: UserEditDialogProps) {
  const { toast } = useToast();
  const updateUser = useUpdateUser();
  const updateUserRole = useUpdateUserRole();
  const { setFormSubmitting } = useUserAPI();

  const [formData, setFormData] = useState({
    nrp: user.nrp || "",
    role: user.role_name || "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const canEditRole = currentUserRole === "ADMIN" || currentUserRole === "LO-MBKM";
  const canEditUser = currentUserRole === "ADMIN" || currentUserRole === "LO-MBKM";

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (canEditUser && formData.nrp.trim().length > 0 && formData.nrp.trim().length < 3) {
      errors.nrp = "NRP must be at least 3 characters long";
    }

    if (canEditRole && !formData.role) {
      errors.role = "Role is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const hasChanges = useMemo(() => {
    return formData.nrp !== (user.nrp || "") || formData.role !== (user.role_name || "");
  }, [formData, user]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      toast({
        title: "No Changes",
        description: "No changes were made to the user.",
        variant: "default",
      });
      onClose();
      return;
    }

    setFormSubmitting(true);

    try {
      const promises = [];

      // Update user NRP if changed and user has permission
      if (canEditUser && formData.nrp !== (user.nrp || "")) {
        promises.push(
          updateUser.mutateAsync({
            userId: user.auth_user_id,
            userData: {
              nrp: formData.nrp.trim() || undefined,
            },
          })
        );
      }

      // Update role if changed and user has permission
      if (canEditRole && formData.role !== (user.role_name || "")) {
        promises.push(
          updateUserRole.mutateAsync({
            userId: user.auth_user_id,
            role: formData.role,
          })
        );
      }

      await Promise.all(promises);

      toast({
        title: "Success",
        description: "User updated successfully",
        variant: "success",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const isSubmitting = updateUser.isPending || updateUserRole.isPending;

  return (
    <>
      <DialogOverlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Edit className="h-5 w-5" />
            Edit User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mb-6">
          {/* Read-only user information */}
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">Email</Label>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.email || "No Email"}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">User ID</Label>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">{user.auth_user_id}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">Current Role</Label>
              <Badge variant={getRoleBadgeVariant(user.role_name || "")} className="text-xs">
                {user.role_name || "No Role"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {canEditUser && (
            <div className="space-y-2">
              <Label htmlFor="nrp">NRP</Label>
              <Input
                id="nrp"
                value={formData.nrp}
                onChange={(e) => setFormData((prev) => ({ ...prev, nrp: e.target.value }))}
                placeholder="Enter NRP"
                className="bg-white dark:bg-gray-800"
                disabled={isSubmitting}
              />
              {formErrors.nrp && <p className="text-sm text-red-600 dark:text-red-400">{formErrors.nrp}</p>}
            </div>
          )}

          {canEditRole && (
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <SelectItem value="MAHASISWA">MAHASISWA</SelectItem>
                  <SelectItem value="DOSEN PEMBIMBING">DOSEN PEMBIMBING</SelectItem>
                  <SelectItem value="DOSEN PEMONEV">DOSEN PEMONEV</SelectItem>
                  <SelectItem value="LO-MBKM">LO-MBKM</SelectItem>
                  <SelectItem value="MITRA">MITRA</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.role && <p className="text-sm text-red-600 dark:text-red-400">{formErrors.role}</p>}
            </div>
          )}

          {!canEditUser && !canEditRole && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>You don't have permission to edit this user.</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            {(canEditUser || canEditRole) && (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !hasChanges}
                className="min-w-[120px]"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </>
  );
}

interface UserCardProps {
  user: UserType;
  currentUserRole?: string;
  onUserUpdated: () => void;
}

function UserCard({ user, currentUserRole, onUserUpdated }: UserCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUserUpdated = () => {
    onUserUpdated();
    setDialogOpen(false);
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate text-gray-900 dark:text-gray-100">{user.email || "No Email"}</h3>
                <Badge variant={getRoleBadgeVariant(user.role_name || "")} className="text-xs">
                  {user.role_name || "No Role"}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {user.nrp && (
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>{user.nrp}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <UserEditDialog
              user={user}
              currentUserRole={currentUserRole}
              onClose={handleDialogClose}
              onSuccess={handleUserUpdated}
            />
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserManagementDashboard() {
  const { data: currentUser } = useCurrentUser();
  const { data: userRole } = useUserRole();
  const {
    users,
    isLoading,
    usersPagination,
    changePage,
    changePerPage,
    currentPerPage,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    refreshUsers,
    userStats,
  } = useUserAPI();

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // The provider will handle the filter update automatically
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleRoleFilterChange = useCallback(
    (value: string) => {
      setRoleFilter(value);
    },
    [setRoleFilter]
  );

  const handleUserUpdated = useCallback(() => {
    refreshUsers();
  }, [refreshUsers]);

  const currentUserRoleString = userRole?.data?.role;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage user roles and permissions across the platform</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Filters and Search */}
      <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800"
                />
              </div>

              <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="MAHASISWA">Mahasiswa</SelectItem>
                  <SelectItem value="DOSEN PEMBIMBING">Dosen Pembimbing</SelectItem>
                  <SelectItem value="DOSEN PEMONEV">Dosen Pemonev</SelectItem>
                  <SelectItem value="LO-MBKM">LO-MBKM</SelectItem>
                  <SelectItem value="MITRA">Mitra Lapangan</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">Total: {usersPagination.totalItems} users</div>
          </div>
        </CardContent>
      </Card>

      {/* User Cards */}
      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : users && users.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {users.length} of {usersPagination.totalItems} users
            </div>
            <Button variant="outline" onClick={refreshUsers} size="sm">
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {users.map((user, index) => (
              <motion.div
                key={user.auth_user_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <UserCard user={user} currentUserRole={currentUserRoleString} onUserUpdated={handleUserUpdated} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {usersPagination.totalPages > 1 && (
            <Card className="mt-6 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                    <Select
                      value={currentPerPage.toString()}
                      onValueChange={(value) => changePerPage(Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-20 bg-white dark:bg-gray-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changePage(usersPagination.currentPage - 1)}
                      disabled={!usersPagination.hasPrevPage}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, usersPagination.totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === usersPagination.currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => changePage(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changePage(usersPagination.currentPage + 1)}
                      disabled={!usersPagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Page {usersPagination.currentPage} of {usersPagination.totalPages}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">No Users Found</h3>
            <p className="text-gray-600 dark:text-gray-400">There are no users matching your criteria.</p>
            <Button variant="outline" onClick={refreshUsers} className="mt-4">
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
