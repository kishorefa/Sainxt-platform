"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useAuth } from "@/components/providers/custom_auth-provider";
import {
  TrendingUp,
  Briefcase,
  Users,
  Calendar,
  UserCheck,
  Building2,
  Settings as SettingsIcon,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import JDForm from "@/components/enterprise/jd-interview/JDForm";

// Define sidebar items for the enterprise section
const sidebarItems = [
  { title: "Dashboard", href: "/enterprise/dashboard", icon: TrendingUp },
  { title: "Job Listings", href: "/enterprise/jobs", icon: Briefcase },
  { title: "Candidates", href: "/enterprise/candidates", icon: Users },
  { title: "Interviews", href: "/enterprise/interviews", icon: Calendar },
  { title: "Analytics", href: "/enterprise/analytics", icon: TrendingUp },
  { title: "JD Interview", href: "/enterprise/jd-interview", icon: UserCheck },
  { title: "AI Review", href: "/enterprise/ai-review", icon: Calendar },
  { title: "Settings", href: "/enterprise/settings", icon: Building2 },
];

export default function JDInterviewPage() {
  const auth = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [isDevMode, setIsDevMode] = useState(
    process.env.NODE_ENV === "development"
  );

  // In development, use the Vite dev server, in production use the built files
  const iframeSrc = isDevMode
    ? "http://localhost:5173/dashboard"
    : "/interview";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Only run on client side
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          setIsLoading(false);
          return;
        }

        console.log(
          "Fetching user profile with token:",
          token.substring(0, 10) + "..."
        );

        const response = await fetch("http://192.168.0.207:5000/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("Profile response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched user profile:", data);
        setUserProfile(data);

        // Update the auth context with the full user data
        if (auth.setUser) {
          auth.setUser((prev) => ({
            ...prev,
            ...data,
            first_name: data.first_name || prev?.first_name,
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (!auth) {
    return (
      <p className="text-center mt-10 text-lg">
        You must be signed in to access the JD Interview page.
      </p>
    );
  }

  const { user, loading } = auth;

  // Debug: Log the user object to see what data we have
  console.log(
    "User object in JD Interview page:",
    JSON.stringify(user, null, 2)
  );

  // Check localStorage directly as well
  let storedUser = null;
  if (typeof window !== "undefined") {
    storedUser = localStorage.getItem("jobraze-user");
    console.log("Stored user in localStorage (raw):", storedUser);
    try {
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      console.log("Parsed user from localStorage:", parsedUser);
      console.log(
        "Available keys in user object:",
        Object.keys(parsedUser || {})
      );
    } catch (e) {
      console.error("Error parsing stored user:", e);
    }
  }

  // Get display name with priority: userProfile > auth.user > localStorage
  const getDisplayName = () => {
    // First check the fetched user profile
    if (userProfile?.first_name) return userProfile.first_name;
    if (userProfile?.name) return userProfile.name.split(" ")[0];

    // Then check the auth context
    if (user?.first_name) return user.first_name;
    if (user?.name) return user.name.split(" ")[0];
    if (user?.email) return user.email.split("@")[0];

    // Finally check localStorage as fallback
    try {
      const storedUser =
        typeof window !== "undefined" && localStorage.getItem("jobraze-user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return (
          parsedUser.first_name ||
          parsedUser.name?.split(" ")[0] ||
          parsedUser.email?.split("@")[0]
        );
      }
    } catch (e) {
      console.error("Error parsing stored user:", e);
    }

    return "User";
  };

  const userName = getDisplayName();
  const userEmail = userProfile?.email || user?.email || "user@company.com";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading user data...
      </div>
    );
  }

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading...</p>;
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-lg">
        You must be signed in to access the JD Interview page.
      </p>
    );
  }

  const handleIframeLoad = () => {
    // Additional iframe loading logic can go here if needed
  };

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="enterprise"
      userName={userName}
      userEmail={userEmail}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 p-6 pt-4">
          <div className="bg-white rounded-lg shadow h-full overflow-hidden">
            <JDForm />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
