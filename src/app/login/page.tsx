"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { authService } from "@/lib/api/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for error from OAuth callback
    const error = searchParams.get("error");
    if (error) {
      setErrors((prev) => ({ ...prev, email: getErrorMessage(error) }));
    }
  }, [searchParams]);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "oauth_failed":
        return "OAuth authentication failed. Please try again.";
      case "invalid_response":
        return "Invalid response from authentication server.";
      case "missing_data":
        return "Missing authentication data. Please try again.";
      default:
        return "Authentication failed. Please try again.";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check what provider this email uses
      const identity = await authService.identityCheck({
        email: formData.email,
      });

      if (identity === "google") {
        // Redirect to your backend's Google OAuth
        window.location.href = `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/google/redirect`;
      } else if (identity === "its") {
        // Redirect to your backend's Microsoft OAuth (for ITS domains)
        window.location.href = `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/its/redirect`;
      } else {
        setErrors({
          ...errors,
          email: "Email not found or unsupported provider",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ ...errors, email: "Failed to check email provider" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Direct redirect to your backend's Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/google/redirect`;
  };

  const handleITSLogin = async () => {
    setIsLoading(true);
    // Direct redirect to your backend's Microsoft OAuth endpoint (for ITS)
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/its/redirect`;
  };

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
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
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
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !formData.email}
                className="w-full bg-[#013880] hover:bg-[#012660] text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Checking..." : "Continue"}
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
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#013880] focus:border-transparent transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                Google
              </Button>

              {/* ITS Login */}
              <Button
                type="button"
                variant="outline"
                onClick={handleITSLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#013880] focus:border-transparent transition-colors duration-200"
              >
                <div className="w-5 h-5 mr-2 relative">
                  {/* <Image src="/images/its-logo.png" alt="ITS Logo" fill className="object-contain" /> */}
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11.4 24H0V12.6h11.4V24z" fill="#F25022" />
                    <path d="M24 24H12.6V12.6H24V24z" fill="#00A4EF" />
                    <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#7FBA00" />
                    <path d="M24 11.4H12.6V0H24v11.4z" fill="#FFB900" />
                  </svg>
                </div>
                ITS
              </Button>
            </div>

            {/* Sign up link -- If Needed */}
            {/* <div className="text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link
                href="/register"
                className="text-[#013880] hover:text-[#012660] font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
