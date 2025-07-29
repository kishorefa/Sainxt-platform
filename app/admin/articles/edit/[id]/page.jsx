"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import 'quill/dist/quill.snow.css';
import {
  TrendingUp,
  Users,
  Building2,
  BarChart3,
  DollarSign,
  Settings,
  Shield,
  FileText,
  CheckCircle,
} from "lucide-react";

const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function EditArticlePage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  // toast is already imported from react-toastify;
  const [article, setArticle] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);

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

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://192.168.0.207:5000/api/article/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Article not found. The article may have been deleted or the ID might be incorrect.");
        } else {
          throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`);
        }
      }
      const data = await response.json();
      console.log("Fetched article data:", data);
      setArticle({
        ...data,
        article_id: data.article_id || id, // Ensure article_id is set
        title: data.title || "",
        content: data.content || "",
        status: data.status || "draft",
        metadata: data.metadata || {}
      });
      setEditorContent(data.content || "");
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch article", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!article || !article.title || !editorContent) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://192.168.0.207:5000/api/article/update-content/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: article.title,
            content: editorContent,
            status: article.status || "draft",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Update error:", errorData);
        throw new Error(
          errorData.detail || `Failed to update article: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Update successful:", result);

      toast.success(`Article "${article.title}" has been updated successfully`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect to articles list after a short delay
      setTimeout(() => {
        router.push("/admin/articles");
      }, 1000);
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error(error.message || "Failed to update article. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="admin"
        userName="Admin User"
        userEmail="admin@sainxt.com"
      >
        <div className="p-6">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-coral"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="admin"
        userName="Admin User"
        userEmail="admin@sainxt.com"
      >
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-deep-navy">Error</h2>
            <p className="text-text-gray">{error}</p>
            <Button
              onClick={() => router.push("/admin/articles")}
              className="mt-4"
            >
              Back to Articles
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="admin"
      userName="Admin User"
      userEmail="admin@sainxt.com"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-deep-navy">Edit Article</h2>
            <p className="text-sm text-text-gray">Update article details</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/articles/view/${params.id}`)}
          >
            View Article
          </Button>
        </div>

        {article && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={article.title}
                onChange={(e) =>
                  setArticle((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter article title"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>

              <TiptapEditor
                value={editorContent}
                onChange={(val) => setEditorContent(val)}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={article.status}
                onChange={(e) =>
                  setArticle((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full p-2 border border-soft-gray rounded-md bg-surface-primary focus:ring-aqua-blue focus:border-aqua-blue"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <span className="animate-spin">Loading...</span>
                  Updating
                </>
              ) : (
                "Update Article"
              )}
            </Button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
