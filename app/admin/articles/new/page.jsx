"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // ✅ required
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/custom_auth-provider";
import { Label } from "@/components/ui/label";
import { toast } from 'react-toastify';
// import TiptapEditor from "@/components/TiptapEditor"; // ✅ Replace Mantine import

import {
  TrendingUp,
  Users,
  Building2,
  BarChart3,
  DollarSign,
  Settings,
  Shield,
  FileText,
} from "lucide-react";

const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
  ssr: false,
});

export default function NewArticlePage() {
  const auth = useAuth();
  const [articleId, setArticleId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // HTML content
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [image, setImage] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const status = "published"; // Default status

  // Fetch articles for dropdown
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://192.168.0.207:5000/api/article-cards/dropdown', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching articles:', error);
        toast({
          title: "Error",
          description: "Failed to load articles. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
    fetchUserProfile();
  }, [toast]);

  // Update title when article is selected
  useEffect(() => {
    if (articleId) {
      const selectedArticle = articles.find(article => article.article_id === articleId);
      if (selectedArticle) {
        setTitle(selectedArticle.title);
      }
    }
  }, [articleId, articles]);

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
      title: "New Article Card",
      href: "/admin/new_article-card",
      icon: FileText,
    },
  ];

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

  const resetForm = () => {
    setArticleId("");
    setTitle("");
    setContent("");
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!articleId || !title || !content) {
      toast.error("Please fill in all required fields", {
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
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("article_id", articleId);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch("http://192.168.0.207:5000/api/article/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit article");

      // Show success message at top center
      toast.success("Article Published Successfully! Your article is now live.", {
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
      
      // Reset form fields
      resetForm();
      
      // Reset file input if it exists
      const fileInput = document.getElementById('image');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      toast.error(err.message || "Failed to submit article", {
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
      setIsSubmitting(false);
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
  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="admin"
      userName={userName}
      userEmail={userEmail}
      // userName="Admin User"
      // userEmail="admin@sainxt.com"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-deep-navy">New Article</h2>
            <p className="text-sm text-text-gray">Create a new article</p>
          </div>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/admin/articles")}
          >
            Back to Articles
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="articleId">Select Article</Label>
            <div className="relative">
              <select
                id="articleId"
                value={articleId}
                onChange={(e) => setArticleId(e.target.value)}
                className="block w-full rounded-lg border border-soft-gray bg-surface-primary py-2.5 pl-4 pr-10 text-sm text-foreground shadow-sm transition-colors focus:border-aqua-blue focus:outline-none focus:ring-2 focus:ring-aqua-blue/30 disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:opacity-70"
                required
                disabled={isLoading}
              >
                <option value="" className="text-text-gray">Select an article...</option>
                {articles.map((article) => (
                  <option 
                    key={article.article_id} 
                    value={article.article_id}
                    className="text-foreground hover:bg-aqua-blue/10"
                  >
                    {article.title} ({article.article_id})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg 
                  className="h-5 w-5 text-text-gray" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 011.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
            {isLoading && <p className="text-sm text-muted-foreground mt-1">Loading articles...</p>}
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <TiptapEditor value={content} onChange={setContent} />
          </div>

          <div>
            <Label htmlFor="image">Upload Image (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

<Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <span className="animate-spin">Loading...</span> Submitting
              </>
            ) : (
              "Submit Article"
            )}
          </Button>
        </form>

        {content && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-2">Preview</h3>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
