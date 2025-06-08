"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Hash, Shield, ChevronDown, Edit3, Check, X, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoles, useUpdateUserRole } from "@/lib/api/hooks";
import type { User as UserType, UserRole } from "@/lib/api/services";
import useToast from "@/lib/api/hooks/use-toast";

interface UserCardProps {
  user: UserType;
  isSelected: boolean;
  onToggleSelect: () => void;
  currentUserRole?: string;
}

export function UserCard({ user, isSelected, onToggleSelect, currentUserRole }: UserCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(user.role);

  const { data: rolesData } = useRoles();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();
  const { toast } = useToast();

  const roles = rolesData?.data || [];
  const isAdmin = currentUserRole === "ADMIN";
  const canEdit = isAdmin && user.role !== "ADMIN"; // Admins can't edit other admins

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400";
      case "DOSEN PEMBIMBING":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      case "DOSEN PEMONEV":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400";
      case "LO-MBKM":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400";
      case "MITRA":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400";
      case "MAHASISWA":
        return "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const handleSaveRole = async () => {
    if (selectedRole === user.role) {
      setIsEditing(false);
      return;
    }

    try {
      await updateRole({
        userId: user.id,
        role: selectedRole,
      });

      toast({
        title: "Role Updated",
        description: `${user.name}'s role has been updated to ${selectedRole}`,
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });

      setSelectedRole(user.role); // Reset to original role
    }
  };

  const handleCancelEdit = () => {
    setSelectedRole(user.role);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className={`overflow-hidden border-2 transition-all ${isSelected ? "border-primary/50" : "border-border"}`}>
        <CardContent className="p-0">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={onToggleSelect}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.name.role}>
                                  {role.name.role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" onClick={handleSaveRole} disabled={isUpdating}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getRoleColor(user.role)}>
                            <Shield className="h-3 w-3 mr-1" />
                            {user.role}
                          </Badge>
                          {canEdit && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setIsEditing(true)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Hash className="h-3.5 w-3.5" />
                        <span>{user.nrp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpanded(!expanded)}
                  className="h-8 w-8 transition-all duration-300"
                >
                  <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden border-t"
              >
                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                        User Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <User className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Mail className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">{user.email}</p>
                            <p className="text-sm text-muted-foreground">Email Address</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Hash className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">{user.nrp}</p>
                            <p className="text-sm text-muted-foreground">NRP/Identifier</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                        Role & Permissions
                      </h4>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border bg-background/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="font-medium">Current Role</span>
                          </div>
                          <Badge variant="outline" className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </div>

                        {!canEdit && user.role === "ADMIN" && (
                          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Protected Account</span>
                            </div>
                            <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
                              Admin accounts cannot be modified by other admins
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
