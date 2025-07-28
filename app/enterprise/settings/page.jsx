"use client"; // Enables React Server Components to use client-side features like hooks

// Import necessary hooks and UI components
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useAuth } from "@/components/providers/custom_auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Settings,
  CreditCard,
  UserPlus,
  UserCheck,
  Building2,
} from "lucide-react";

// Define items for the sidebar navigation
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

// Component for enterprise settings page
export default function EnterpriseSettings() {
  // State to hold various company settings
  const auth = useAuth();
  const [settings, setSettings] = useState({
    theme: "system",
    language: "english",
    emailNotifications: true,
    jobAlerts: true,
    candidateUpdates: true,
    marketingEmails: false,
    twoFactorAuth: true,
    currentPlan: "business",
  });
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generic handler to update settings
  const handleSettingChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

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
  }, [auth]);

  if (!auth) {
    return (
      <p className="text-center mt-10 text-lg">
        You must be signed in to access the Job Listings page.
      </p>
    );
  }

  const { user, loading } = auth;

  // Debug: Log the user object to see what data we have
  console.log(
    "User object in Job Listings page:",
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
        You must be signed in to access the Job Listings page.
      </p>
    );
  }

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />} // Sidebar for navigation
      userRole="enterprise" // Role for context if needed
      // userName="Jane Smith"                         // Displayed user info
      // userEmail="jane@acmecorp.com"
      userName={userName}
      userEmail={userEmail}
    >
      {/* Main content container */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-3xl font-bold">Company Settings</h1>
          <p className="text-muted-foreground">
            Manage your organization's preferences and account settings
          </p>
        </div>

        {/* Subscription & Billing Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription & Billing
            </CardTitle>
            <CardDescription>
              Manage your subscription plan and billing information
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Plan Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Plan Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="currentPlan">Current Plan</Label>
                <Select
                  value={settings.currentPlan}
                  onValueChange={(value) =>
                    handleSettingChange("currentPlan", value)
                  }
                >
                  <SelectTrigger id="currentPlan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter ($99/month)</SelectItem>
                    <SelectItem value="business">
                      Business ($299/month)
                    </SelectItem>
                    <SelectItem value="enterprise">
                      Enterprise ($999/month)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Your current subscription plan
                </p>
              </div>

              {/* Billing button */}
              <div className="flex items-end">
                <Button>Manage Billing</Button>
              </div>
            </div>

            {/* Plan Features Info Box */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Business Plan Features
              </h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Up to 25 active job postings</li>
                <li>• Advanced candidate filtering</li>
                <li>• AI-powered candidate matching</li>
                <li>• Interview scheduling tools</li>
                <li>• 5 admin users</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Team Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Team Management
            </CardTitle>
            <CardDescription>
              Manage team members and their permissions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* You can list and manage team members here */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Recruiter</p>
                </div>
                <Button variant="outline" size="sm">
                  Edit Access
                </Button>
              </div>

              {/* Add more team members in a similar block */}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
