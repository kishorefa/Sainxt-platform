"use client";

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { toast } from 'react-toastify';
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
  ArrowUpDown,
  Eye,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/custom_auth-provider";
// Alert dialog components removed
import {
  TrendingUp,
  Users,
  Building2,
  BarChart3,
  DollarSign,
  Settings,
  Shield,
} from "lucide-react";

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {title || "Confirm Action"}
          </h3>
          <p className="text-gray-600 mb-6">
            {message || "Are you sure you want to proceed?"}
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminArticlesPage() {
  const router = useRouter();
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
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

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
        console.warn("No authentication token found");
        setIsLoadingProfile(false);
        return;
      }

      console.log(
        "Fetching admin user profile with token:",
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
      const response = await fetch("http://192.168.0.207:5000/article/list");
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

  // Updated handleDelete to show modal instead of window.confirm
  const handleDelete = async (articleId) => {
    setArticleToDelete(articleId);
    setShowDeleteModal(true);
  };

  // New function to handle the actual deletion
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      // Delete article card
      const cardRes = await fetch(
        `http://192.168.0.207:5000/api/admin/article-card/${articleToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!cardRes.ok) {
        const error = await cardRes.json();
        throw new Error(error.detail || "Failed to delete article card");
      }

      // Show success toast with the same styling as your new article page
      toast.success("Article Deleted Successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          margin: '20px auto',
          maxWidth: '500px',
          borderRadius: '8px',
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }
      });

      // Refresh the articles list to reflect the deletion
      await fetchArticles();
      
    } catch (error) {
      console.error("Delete error:", error);
      
      // Show error toast with consistent styling
      toast.error(error.message || "Failed to delete article", {
        position: "top-center",
        style: {
          margin: '20px auto',
          maxWidth: '500px',
          borderRadius: '8px',
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca'
        }
      });
    } finally {
      // Close modal and reset state
      setShowDeleteModal(false);
      setArticleToDelete(null);
    }
  };

  // Function to close modal without deleting
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
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

      const response = await fetch("http://192.168.0.207:5000/api/article/submit", {
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
      router.push(`/admin/articles/edit/${article.article_id}`)
    }
  >
    <Pencil className="h-4 w-4" />
  </Button>

  {/* Delete - This is now a SEPARATE button, not nested */}
  <Button
    variant="ghost"
    size="icon"
    onClick={() => handleDelete(article.article_id)}
  >
    <Trash2 className="h-4 w-4 text-red-500" />
  </Button>
</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article and its card? This action cannot be undone."
      />
    </DashboardLayout>
  );
}