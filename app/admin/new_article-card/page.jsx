"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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

export default function NewArticleCardPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const router = useRouter();

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
    { title: "Articles", href: "/admin/articles", icon: FileText },
    {
      title: "Article Cards",
      href: "/admin/article-cards",
      icon: FileText,
      active: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !image) {
      toast.error("Please fill in all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const res = await fetch(
        "http://localhost:5000/api/article/article_card",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || "Failed to create article card.");
        return;
      }

      toast.success("🎉 Article card created successfully!");

      setTitle("");
      setDescription("");
      setImage(null);
      // Optionally redirect:
      // router.push("/admin/article-cards");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="admin"
      userName="Admin User"
      userEmail="admin@sainxt.com"
    >
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-deep-navy">
          Add New Article Card
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border p-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>

        {/* ✅ Live Preview */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Live Preview
          </h3>

          <Card className="w-full max-w-xl">
            {image && (
              <Image
                src={URL.createObjectURL(image)}
                alt="Card Image Preview"
                width={600}
                height={300}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            )}
            <CardHeader>
              <CardTitle>{title || "Card Title"}</CardTitle>
              <CardDescription>
                {description || "Card description will appear here."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                This is a real-time preview of your card before submitting.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 🎉 Toast messages */}
        {/* <ToastContainer position="down-center" autoClose={3000} /> */}
      </div>
    </DashboardLayout>
  );
}
