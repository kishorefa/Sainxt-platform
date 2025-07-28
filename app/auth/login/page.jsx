"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/custom_auth-provider";
// import jwt_decode from "jwt-decode";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Chrome,
  Github,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { setAuthTokens } from "@/lib/auth";

// Set up auto token refresh
const setupAutoRefresh = (expiresIn) => {
  // Refresh token 5 minutes before it expires
  const refreshTime = (expiresIn - 300) * 1000;
  
  // Clear any existing refresh timeout
  if (window.refreshTimeout) {
    clearTimeout(window.refreshTimeout);
  }
  
  window.refreshTimeout = setTimeout(async () => {
    try {
      const data = await refreshToken();
      // Set up next refresh
      setupAutoRefresh(data.expires_in || 3600);
    } catch (error) {
      console.error('Auto refresh failed:', error);
      // On failure, clear auth and redirect to login
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('unauthorized'));
      }
    }
  }, refreshTime);
};

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const validateForm = () => {
    const newErrors = { email: "", password: "", general: "" };
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({ email: "", password: "", general: "" });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // FastAPI backend URL - running on port 5000
      const apiUrl = "http://192.168.0.207:5000";
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, userType: "admin" }),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        // Handle specific error messages from the backend
        if (response.status === 401) {
          setErrors((prev) => ({
            ...prev,
            general: data.detail || "Invalid credentials",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            general: data.detail || "An error occurred. Please try again.",
          }));
        }
        throw new Error(data.detail || "Login failed");
      }

      // Save tokens using our auth utility
      setAuthTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in || 3600 // Default to 1 hour if not provided
      });

      try {
        const payload = JSON.parse(atob(data.access_token.split(".")[1]));
        const userData = {
          id: payload.id,
          email: payload.email,
          userType: payload.userType,
          name: payload.name || data.first_name || payload.email.split("@")[0],
          first_name: data.first_name || payload.name?.split(" ")[0] || payload.email.split("@")[0],
          // Include any other user data from the login response
          ...data.user,
        };

        // Store the complete user data in localStorage
        localStorage.setItem("jobraze-user", JSON.stringify(userData));

        // Force refresh the auth context
        if (window.refreshUser) {
          window.refreshUser();
        }
        
        // Set up auto token refresh
        setupAutoRefresh(data.expires_in || 3600);
      } catch (err) {
        console.error("Error processing login response:", err);
      }

      // Redirect based on user type
      setTimeout(() => {
        if (data.userType === "enterprise") {
          router.push("/enterprise/dashboard");
        } else if (data.userType === "individual") {
          router.push("/individual/dashboard");
        } else if (data.userType === "admin") {
          router.push("/admin/dashboard");
        }
      }, 100); // 100ms is enough

      toast.success("Login successful!");
    } catch (error) {
      // Only show toast for unexpected errors (not validation errors)
      if (!errors.email && !errors.password && !errors.general) {
        toast.error(error.message || "An error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary relative overflow-hidden flex items-center justify-center p-4">
      {/* AI Circuit Background */}
      <div className="absolute inset-0 bg-ai-circuit opacity-30" />

      {/* Floating AI Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-aqua-blue/20 to-neon-coral/20 rounded-full animate-ai-pulse" />
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-neon-coral/20 to-electric-orange/20 rounded-full animate-ai-pulse" />

      <Card className="w-full max-w-md relative z-10 card-ai-enhanced shadow-enterprise-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-deep-navy rounded-xl flex items-center justify-center relative overflow-hidden">
              <Sparkles className="h-7 w-7 text-aqua-blue" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-aqua-blue/20 to-transparent animate-data-flow" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-deep-navy">
            Welcome to Jobraze
          </CardTitle>
          <CardDescription className="text-center text-text-gray">
            Sign in to your account to continue your AI-powered career journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="email" className="text-deep-navy font-medium">
                  Email
                </Label>
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className={`pl-10 bg-surface-tertiary border-${
                    errors.email ? "red-500" : "soft-gray"
                  } focus:border-aqua-blue focus:ring-aqua-blue/20 focus-enterprise`}
                  aria-invalid={!!errors.email}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-deep-navy font-medium"
                >
                  Password
                </Label>
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={`pl-10 pr-10 bg-surface-tertiary border-${
                    errors.password ? "red-500" : "soft-gray"
                  } focus:border-aqua-blue focus:ring-aqua-blue/20 focus-enterprise`}
                  aria-invalid={!!errors.password}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-text-gray hover:text-deep-navy"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-aqua-blue hover:text-neon-coral transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-soft-gray" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-primary px-2 text-text-gray">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full border-soft-gray text-deep-navy hover:bg-surface-secondary hover:border-aqua-blue transition-all duration-200"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full border-soft-gray text-deep-navy hover:bg-surface-secondary hover:border-aqua-blue transition-all duration-200"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-text-gray w-full">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-aqua-blue hover:text-neon-coral transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
