"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/providers/custom_auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Users,
  Building2,
  BarChart3,
  Settings,
  DollarSign,
  TrendingUp,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const sidebarItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: TrendingUp },
  { title: "User Management", href: "/admin/users", icon: Users },
  { title: "Enterprise Accounts", href: "/admin/enterprises", icon: Building2 },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Pricing & Plans", href: "/admin/pricing", icon: DollarSign },
  { title: "System Settings", href: "/admin/settings", icon: Settings },
  { title: "Security", href: "/admin/security", icon: Shield },
  { title: "Articles", href: "/admin/articles", icon: FileText },
  {
    title: "Article Cards",
    href: "/admin/new_article-card",
    icon: FileText,
    // active: true,
  },
];

export default function UsersPage() {
  const auth = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState({
    admin: [],
    individual: [],
    enterprise: [],
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("jobraze-user");
 
      // If not authenticated, redirect to login
      if (!token || !user) {
        router.replace("/auth/login");
      }
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        console.warn(
          "No authentication token found (user likely unauthenticated)"
        );
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserProfile(data);

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

  // Get display name with priority: userProfile > auth.user > localStorage
  const getDisplayName = () => {
    // First check the fetched user profile
    if (userProfile?.first_name) return userProfile.first_name;
    if (userProfile?.name) return userProfile.name.split(" ")[0];

    // Then check the auth context
    if (auth.user?.first_name) return auth.user.first_name;
    if (auth.user?.name) return auth.user.name.split(" ")[0];
    if (auth.user?.email) return auth.user.email.split("@")[0];

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

    return "Admin";
  };

  const userName = getDisplayName();
  const userEmail =
    userProfile?.email || auth.user?.email || "admin@sainxt.com";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }



  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const getUserTypeBadge = (type) => {
    const typeMap = {
      admin: { label: "Admin", className: "bg-red-500/10 text-red-600" },
      individual: {
        label: "Individual",
        className: "bg-blue-500/10 text-blue-600",
      },
      enterprise: {
        label: "Enterprise",
        className: "bg-purple-500/10 text-purple-600",
      },
    };

    const typeInfo = typeMap[type] || {
      label: type,
      className: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.className} capitalize`}
      >
        {typeInfo.label}
      </span>
    );
  };

  const renderUserTable = (userList, emptyMessage = "No users found") => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (userList.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.map((user) => (
            <TableRow key={user._id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {user.firstName} {user.lastName}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {user.email}
                </div>
              </TableCell>
              <TableCell>{getUserTypeBadge(user.userType)}</TableCell>
              <TableCell>
                {user.phone ? (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {user.phone}
                  </div>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(user.createdAt)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="admin"
      userName={userName}
      userEmail={userEmail}
    >
      <div className="min-h-screen bg-surface-secondary relative overflow-hidden py-8 px-4">
        {/* AI Circuit Background */}
        <div className="absolute inset-0 bg-ai-circuit opacity-30" />

        {/* Floating AI Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-aqua-blue/20 to-neon-coral/20 rounded-full animate-ai-pulse" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-neon-coral/20 to-electric-orange/20 rounded-full animate-ai-pulse" />

        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-deep-navy">
                User Management
              </h1>
              <p className="text-text-gray">Manage all users in the system</p>
            </div>
            <Button
              onClick={() => router.push("/admin/create")}
              className="bg-gradient-to-r from-aqua-blue to-electric-orange hover:opacity-90 transition-opacity"
            >
              Create New Admin
            </Button>
          </div>

          <Card className="card-ai-enhanced shadow-enterprise-lg">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center px-6 pt-6">
                <TabsList className="bg-surface-secondary">
                  <TabsTrigger
                    value="all"
                    className="flex items-center gap-2 data-[state=active]:bg-aqua-blue/10 data-[state=active]:text-aqua-blue"
                  >
                    <Users className="h-4 w-4" />
                    All Users (
                    {users.individual.length +
                      users.enterprise.length +
                      users.admin.length}
                    )
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin"
                    className="flex items-center gap-2 data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500"
                  >
                    <Shield className="h-4 w-4" />
                    Admins ({users.admin.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="individual"
                    className="flex items-center gap-2 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500"
                  >
                    <User className="h-4 w-4" />
                    Individuals ({users.individual.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="enterprise"
                    className="flex items-center gap-2 data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-500"
                  >
                    <Users className="h-4 w-4" />
                    Enterprises ({users.enterprise.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="pt-6 bg-white/50 backdrop-blur-sm">
                <TabsContent value="all">
                  {renderUserTable(
                    [...users.admin, ...users.individual, ...users.enterprise],
                    "No users found in the system."
                  )}
                </TabsContent>
                <TabsContent value="admin">
                  {renderUserTable(users.admin, "No admin users found.")}
                </TabsContent>
                <TabsContent value="individual">
                  {renderUserTable(
                    users.individual,
                    "No individual users found."
                  )}
                </TabsContent>
                <TabsContent value="enterprise">
                  {renderUserTable(
                    users.enterprise,
                    "No enterprise users found."
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
