"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
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
} from "lucide-react";

const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function EditArticlePage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const { toast } = useToast();
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
      // const response = await fetch(`/api/article/${params.id}`);
      const response = await fetch(`http://192.168.0.207:5000/article/${id}`);
      if (!response.ok) throw new Error("Article not found");
      const data = await response.json();
      // setArticle(data.article);
      setArticle(data);
      setEditorContent(data.content || "");
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to fetch article",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!article || !article.title || !article.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/article/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: article.title,
          // content: article.content,
          content: editorContent,
          status: article.status,
          metadata: {
            ...article.metadata,
            updatedAt: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to update article");

      toast({
        title: "Success",
        description: "Article updated successfully",
      });

      // Redirect to articles list
      router.push("/admin/articles");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive",
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
