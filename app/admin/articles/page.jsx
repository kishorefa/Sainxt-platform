"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileText,
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  Loader2,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/custom_auth-provider";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  TrendingUp,
  Users,
  Building2,
  BarChart3,
  DollarSign,
  Settings,
  Shield,
} from "lucide-react";

export default function AdminArticlesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams(); // ✅ this is synchronous
  const auth = useAuth();
  const id = params.id; // ✅ access it directly
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "updatedAt",
    direction: "desc",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const sidebarItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: TrendingUp },
    { title: "User Management", href: "/admin/users", icon: Users },
    {
      title: "Enterprise Accounts",
      href: "/admin/enterprises",
      icon: Building2,
    },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { title: "Pricing & Plans", href: "/admin/pricing", icon: DollarSign },
    { title: "System Settings", href: "/admin/settings", icon: Settings },
    { title: "Security", href: "/admin/security", icon: Shield },
    {
      title: "Articles",
      href: "/admin/articles",
      icon: FileText,
      active: true,
    },
    {
      title: "Article Cards",
      href: "/admin/new_article-card",
      icon: FileText,
      // active: true,
    },
  ];

  useEffect(() => {
    fetchArticles();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Only run on client side
      if (typeof window === "undefined") {
        setIsLoadingProfile(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        setIsLoadingProfile(false);
        return;
      }

      console.log(
        "Fetching admin user profile with token:",
        token.substring(0, 10) + "..."
      );

      const response = await fetch("http://localhost:5000/api/user/profile", {
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
      console.log("Fetched admin user profile:", data);
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
      console.error("Error fetching admin user profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/article/list");
      const data = await response.json();
      console.log("Fetched articles:", data);
      // Ensure `data.articles` is an array
      setArticles(Array.isArray(data.articles) ? data.articles : []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/article/${articleId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete article");

      toast({
        title: "Success",
        description: "Article deleted successfully",
      });

      setDeleteDialogOpen(false);
      fetchArticles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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

    return "Admin User";
  };

  const userName = getDisplayName();
  const userEmail =
    userProfile?.email || auth.user?.email || "admin@sainxt.com";

  // Check authentication
  if (!auth) {
    return (
      <p className="text-center mt-10 text-lg">
        You must be signed in to access the admin articles page.
      </p>
    );
  }

  const { user, loading: authLoading } = auth;

  // Debug: Log the user object to see what data we have
  console.log("Admin user object:", JSON.stringify(user, null, 2));

  // Check localStorage directly as well
  let storedUser = null;
  if (typeof window !== "undefined") {
    storedUser = localStorage.getItem("jobraze-user");
    console.log("Stored admin user in localStorage (raw):", storedUser);
    try {
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      console.log("Parsed admin user from localStorage:", parsedUser);
      console.log(
        "Available keys in admin user object:",
        Object.keys(parsedUser || {})
      );
    } catch (e) {
      console.error("Error parsing stored admin user:", e);
    }
  }

  if (isLoadingProfile || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading user data...
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-lg">
        You must be signed in to access the admin articles page.
      </p>
    );
  }

  // const filteredArticles = articles.filter((article) =>
  const filteredArticles = (articles || []).filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const key = sortConfig.key;
    const direction = sortConfig.direction;
    return direction === "asc"
      ? a[key] > b[key]
        ? 1
        : -1
      : a[key] < b[key]
      ? 1
      : -1;
  });

  const handleSubmit = async (article) => {
    try {
      const formData = new FormData();
      formData.append("article_id", article.article_id);
      formData.append("title", article.title);
      formData.append("content", article.content);
      formData.append("status", "published");

      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Submission failed");

      toast({
        title: "Success",
        description: `Article "${article.title}" submitted`,
      });

      fetchArticles(); // refresh
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit article",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="admin"
      // userName="Admin User"
      // userEmail="admin@sainxt.com"
      userName={userName}
      userEmail={userEmail}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-deep-navy">Articles</h2>
            <p className="text-sm text-text-gray">Manage your articles</p>
          </div>
          <Button
            variant="default"
            size="lg"
            onClick={() => router.push("/admin/articles/new")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button
            variant="outline"
            onClick={() =>
              setSortConfig({
                key: sortConfig.key === "updatedAt" ? "createdAt" : "updatedAt",
                direction: sortConfig.direction === "asc" ? "desc" : "asc",
              })
            }
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortConfig.key === "updatedAt" ? "Updated" : "Created"}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-neon-coral" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedArticles.map((article) => (
                <TableRow key={article._id}>
                  <TableCell>{article.title || "Untitled"}</TableCell>
                  <TableCell>
                    <Badge
                      className={`px-2 py-1 ${
                        article.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {article.status || "draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{article.author || "Admin"}</TableCell>
                  <TableCell>
                    {article.updatedAt
                      ? new Date(article.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    {/* View */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/articles/view/${article._id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* Edit */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        // router.push(`/admin/articles/edit/${article._id}`)
                        router.push(
                          `/admin/articles/edit/${article.article_id}`
                        )
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setArticleToDelete(article._id);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                article.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(articleToDelete)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
