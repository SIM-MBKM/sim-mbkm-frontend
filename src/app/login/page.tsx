"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/lib/redux/roleSlice";
import useToast from "@/lib/api/hooks/use-toast";
import { useLogin, useIdentityCheck, useOAuthRedirect, useUserRole } from "@/lib/api/hooks";

// Redirects
const ROLE_ROUTES: Record<UserRole, string> = {
  MAHASISWA: "/dashboard/mahasiswa",
  "DOSEN PEMBIMBING": "/dashboard/dosen-pembimbing",
  ADMIN: "/dashboard/admin",
  "LO-MBKM": "/dashboard/lo-mbkm",
  "DOSEN PEMONEV": "/dashboard/dosen-pemonev",
  MITRA: "/dashboard/mitra",
} as const;

const useLoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const setError = (field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const clearErrors = () => {
    setErrors({ email: "" });
  };

  return {
    formData,
    errors,
    handleInputChange,
    setError,
    clearErrors,
  };
};

// Temporarily disable auto-redirect for debugging
const useAuthRedirect = () => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false); // Set to false to skip loading

  // Commented out to prevent redirect loops during development
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      router.replace("/dashboard");
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  return { isCheckingAuth };
};

const useOAuthErrorHandler = () => {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  const getErrorMessage = (error: string) => {
    const errorMap: Record<string, string> = {
      oauth_failed: "OAuth authentication failed. Please try again.",
      invalid_response: "Invalid response from authentication server.",
      missing_data: "Missing authentication data. Please try again.",
    };

    return errorMap[error] || "Authentication failed. Please try again.";
  };
};

const useEmailAuth = () => {
  const { toast } = useToast();
  const identityCheckMutation = useIdentityCheck();
  const oauthRedirectMutation = useOAuthRedirect();

  const checkEmailAndRedirect = async (email: string, setError: (field: string, message: string) => void) => {
    if (!email.trim()) {
      setError("email", "Email is required");
      return;
    }

    try {
      const identity = await identityCheckMutation.mutateAsync({ email });

      if (identity === "google" || identity === "sso") {
        await oauthRedirectMutation.mutateAsync({ provider: identity });
      } else {
        setError("email", "Email not found or unsupported provider");
      }
    } catch (error) {
      console.error("Email provider check failed:", error);
      setError("email", "Failed to check email provider");
      toast({
        title: "Email Check Error",
        description: "Failed to verify email provider",
        variant: "destructive",
      });
    }
  };

  return {
    checkEmailAndRedirect,
    isChecking: identityCheckMutation.isLoading || oauthRedirectMutation.isLoading,
  };
};

export default function LoginPage() {
  const { isCheckingAuth } = useAuthRedirect();
  const { formData, errors, handleInputChange, setError } = useLoginForm();

  // Use your existing login hook
  const loginMutation = useLogin();

  const { checkEmailAndRedirect, isChecking } = useEmailAuth();
  const oauthRedirectMutation = useOAuthRedirect();

  // Handle OAuth errors from URL params
  useOAuthErrorHandler();

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#013880] mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Handle email form submission
  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await checkEmailAndRedirect(formData.email, setError);
  };

  // Handle direct OAuth buttons
  const handleOAuthRedirect = async (provider: "google" | "sso") => {
    try {
      await oauthRedirectMutation.mutateAsync({ provider });
    } catch (error) {
      console.error(`${provider} OAuth redirect failed:`, error);
    }
  };

  // Get loading state from any of the auth operations
  const isLoading = isChecking || loginMutation.isLoading || oauthRedirectMutation.isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Sign in</h1>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="sr-only">Login Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Login Form */}
            <form onSubmit={onEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#013880] focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !formData.email.trim()}
                className="w-full bg-[#013880] hover:bg-[#012660] text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? "Checking..." : "Continue"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Login Options */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthRedirect("google")}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#013880] focus:border-transparent transition-colors duration-200"
              >
                <GoogleIcon />
                Google
              </Button>

              {/* ITS Login */}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthRedirect("sso")}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#013880] focus:border-transparent transition-colors duration-200"
              >
                <ITSIcon />
                ITS
              </Button>
            </div>

            {/* Show login mutation errors if any */}
            {loginMutation.error && (
              <div className="text-sm text-red-600 text-center">
                {loginMutation.error.message || "Login failed. Please try again."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Icon components
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const ITSIcon = () => (
  <div className="w-5 h-5 mr-2 relative">
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.4 24H0V12.6h11.4V24z" fill="#F25022" />
      <path d="M24 24H12.6V12.6H24V24z" fill="#00A4EF" />
      <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#7FBA00" />
      <path d="M24 11.4H12.6V0H24v11.4z" fill="#FFB900" />
    </svg>
  </div>
);
