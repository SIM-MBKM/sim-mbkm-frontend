"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Crown, Badge as BadgeIcon, Copy, Check, Eye, EyeOff, Edit, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import your hook and User interface
import { useGetUserDatasAlt } from "@/lib/api/hooks/use-query-hooks";
import type { UserAlt, UserAlt2, User as UserType } from "@/lib/api/services/user-service";

// Security utility functions
const maskUserId = (userId: string): string => {
  if (!userId) return "****";
  return `${userId.slice(0, 8)}-****-****-****-${"*".repeat(12)}`;
};

const getDisplayUserId = (userId: string): string => {
  if (!userId) return "Unknown";
  return `User-${userId.slice(-8)}`;
};

// Role color mapping
const getRoleColor = (role: string) => {
  console.log("huhu", role);
  switch (role.toUpperCase()) {
    case "ADMIN":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "DOSEN PEMBIMBING":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "DOSEN PEMONEV":
      return "bg-green-100 text-green-800 border-green-200";
    case "LO-MBKM":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "MAHASISWA":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "MITRA":
      return "bg-pink-100 text-pink-800 border-pink-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Secure copy functionality with masking
function SecureCopyButton({
  text,
  label,
  masked = false,
  originalText,
}: {
  text: string;
  label: string;
  masked?: boolean;
  originalText?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = masked && originalText ? originalText : text;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleVisibility = () => {
    setShowOriginal(!showOriginal);
  };

  return (
    <div className="flex items-center gap-1">
      {masked && (
        <Button variant="ghost" size="sm" onClick={toggleVisibility} className="h-6 px-2 text-xs">
          {showOriginal ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={handleCopy} className="h-6 px-2 text-xs">
        {copied ? (
          <>
            <Check className="h-3 w-3 mr-1" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 mr-1" />
            Copy {label}
          </>
        )}
      </Button>
    </div>
  );
}

// User info card component
function UserInfoCard({ userData }: { userData: UserAlt2 }) {
  const [showFullUserId, setShowFullUserId] = useState(false);

  const initials = userData.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const displayUserId = showFullUserId ? userData.auth_user_id : getDisplayUserId(userData.auth_user_id);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {initials}
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-6 w-full">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{userData.name}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={`${getRoleColor(userData.role)} border font-medium px-3 py-1`}>
                    <Crown className="h-4 w-4 mr-2" />
                    {userData.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Email */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors min-h-[80px]">
                  <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <p className="font-semibold text-gray-900 text-sm truncate">{userData.email || "No email"}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <SecureCopyButton text={userData.email || ""} label="Email" />
                  </div>
                </div>

                {/* Secure User ID */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors min-h-[80px]">
                  <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">User ID</p>
                    <p className="font-semibold text-gray-900 font-mono text-sm">{displayUserId}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <SecureCopyButton
                      text={displayUserId}
                      label="ID"
                      masked={!showFullUserId}
                      originalText={userData.auth_user_id}
                    />
                  </div>
                </div>

                {/* NRP */}
                {userData.nrp && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors min-h-[80px]">
                    <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                      <BadgeIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">NRP</p>
                      <p className="font-semibold text-gray-900 text-sm">{userData.nrp}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <SecureCopyButton text={userData.nrp} label="NRP" />
                    </div>
                  </div>
                )}

                {/* Role Details */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors min-h-[80px]">
                  <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                    <Crown className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Role</p>
                    <p className="font-semibold text-gray-900 text-sm">{userData.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Security & Privacy</p>
                <p className="text-sm text-blue-700 mt-1">
                  Data anda dilindungi sesuai dengan kebijakan privasi yang ada.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Quick stats component
function QuickStats({ userData }: { userData: UserAlt2 }) {
  const joinDate = new Date().toLocaleDateString(); // You can replace this with actual join date
  const accountAge = "Active"; // You can calculate this based on creation date

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
            <div className="text-sm font-medium text-gray-500">Active Account</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">✓</div>
            <div className="text-sm font-medium text-gray-500">Verified Profile</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{userData.role}</div>
            <div className="text-sm font-medium text-gray-500">Current Role</div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// Main profile component
export function UserProfile() {
  const { data: userData, isLoading, error } = useGetUserDatasAlt();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="text-center space-y-4">
              <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>

            {/* Main card skeleton */}
            <Card className="bg-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-8">
                  <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-6">
                    <div className="space-y-3">
                      <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="h-20 bg-gray-200 rounded"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats skeleton */}
            <div className="grid grid-cols-3 gap-6">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="bg-white max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-6">
              <Shield className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Profile</h2>
            <p className="text-gray-600 mb-6">There was an error loading your profile information.</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = userData?.data;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold text-gray-900">User Profile</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">View and manage your account information securely</p>
        </motion.div>

        {/* User Info Section */}
        <UserInfoCard userData={user} />

        {/* Quick Stats */}
        <QuickStats userData={user} />
      </div>
    </div>
  );
}
