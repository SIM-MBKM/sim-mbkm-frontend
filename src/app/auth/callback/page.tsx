"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const handleCallback = () => {
      const token = searchParams.get("access_token");
      const userString = searchParams.get("user");
      const error = searchParams.get("error");
      const success = searchParams.get("success");

      console.log("Callback params:", { token, userString, error, success });

      if (error) {
        setStatus("error");
        setTimeout(() => {
          router.push("/login?error=" + error);
        }, 2000);
        return;
      }

      // Check for success (could be "1" or "true")
      if ((success === "1" || success === "true") && token && userString) {
        try {
          const user = JSON.parse(atob(userString));

          console.log("Decoded user:", user);

          // Store auth data
          localStorage.setItem("auth_token", token);
          localStorage.setItem("user", JSON.stringify(user));

          setStatus("success");

          // Redirect to dashboard
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } catch (e) {
          console.error("Failed to decode user data:", e);
          setStatus("error");
          setTimeout(() => {
            router.push("/login?error=invalid_response");
          }, 2000);
        }
      } else {
        console.log("Missing required parameters");
        setStatus("error");
        setTimeout(() => {
          router.push("/login?error=missing_data");
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          {status === "loading" && (
            <div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#013880] mx-auto mb-4"></div>
              <p>Processing authentication...</p>
            </div>
          )}

          {status === "success" && (
            <div>
              <div className="text-green-500 text-4xl mb-4">✓</div>
              <p className="text-green-600">Login successful! Redirecting...</p>
            </div>
          )}

          {status === "error" && (
            <div>
              <div className="text-red-500 text-4xl mb-4">✗</div>
              <p className="text-red-600">
                Authentication failed. Redirecting...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
