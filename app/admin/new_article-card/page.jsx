"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useAuth } from "@/components/providers/custom_auth-provider";
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
  const auth = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

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
    fetchUserProfile();
  }, []);



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
    { title: "Article Cards", href: "/admin/new_article-card", icon: FileText },
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
    formData.append("category", category);

    try {
      const res = await fetch(
        "http://192.168.0.207:5000/api/article/article_card",
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

  

  const availableCategories = [
    "Artificial Intelligence",
    "Machine Learning",
    "NLP",
    "Computer Vision",
    "Deep Learning",
    // "Cloud Computing",
    // "Cybersecurity",
    // "Data Science",
    // "Web Development",
  ];

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="admin"
      // userName="Admin User"
      // userEmail="admin@sainxt.com"
      userName={userName}
      userEmail={userEmail}
    >
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-deep-navy">
          Add New Article Card
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <select
            className="w-full border p-2 rounded text-gray-700"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

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
              <CardDescription className="mt-2 text-sm text-gray-600 italic">
                Category: {category || "Not selected"}
              </CardDescription>
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
