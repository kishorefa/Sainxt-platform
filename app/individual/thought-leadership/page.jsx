"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/custom_auth-provider";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  BookOpen,
  FileText,
  Video,
  ArrowRight,
  Clock,
  Calendar,
  Tag,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight as ArrowRightIcon,
} from "lucide-react";
import { AICarousel } from "@/components/ui/AICarousel";
import axios from "axios";
import ArticleCards from "@/components/ui/ArticleCards";

const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: Clock },
  { title: "Profile Builder", href: "/individual/profile", icon: FileText },
  { title: "AI101", href: "/individual/introductory-training", icon: BookOpen },
  {
    title: "Thought Leadership",
    href: "/individual/thought-leadership",
    icon: BookOpen,
    active: true,
  },
  { title: "View Jobs", href: "/individual/jobs", icon: BookOpen },
];

// const articles = [
//   {
//     id: "article1",
//     title: "The Future of AI in Healthcare",
//     excerpt:
//       "Exploring how artificial intelligence is revolutionizing healthcare delivery and patient outcomes.",
//     category: "AI in Healthcare",
//     readTime: "8 min read",
//     date: "May 15, 2024",
//     image:
//       "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     tags: ["AI", "Healthcare", "Innovation"],
//     featured: true,
//   },
//   {
//     id: 1,
//     title: "Machine Learning Model Interpretability",
//     excerpt:
//       "Understanding and explaining complex machine learning models for better decision making.",
//     category: "Machine Learning",
//     readTime: "6 min read",
//     date: "June 2, 2024",
//     image:
//       "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80://images.unsplash.com/photo-1563986768494-4dee2763ff33?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     tags: ["Machine Learning", "Interpretability", "AI Ethics"],
//   },
//   {
//     id: 2,
//     title: "Ethical AI: Challenges and Solutions",
//     excerpt:
//       "Addressing the ethical implications of AI and strategies for responsible development.",
//     category: "AI Ethics",
//     readTime: "7 min read",
//     date: "June 10, 2024",
//     image:
//       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     tags: ["Ethics", "Responsible AI", "Governance"],
//   },
//   {
//     id: 3,
//     title: "Deep Learning for Natural Language Processing",
//     excerpt:
//       "Advancements in NLP and how deep learning is transforming language understanding.",
//     category: "NLP",
//     readTime: "9 min read",
//     date: "June 18, 2024",
//     image:
//       "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     tags: ["NLP", "Deep Learning", "AI"],
//   },
//   {
//     id: 4,
//     title: "Computer Vision in Autonomous Vehicles",
//     excerpt:
//       "How computer vision is enabling the next generation of self-driving cars.",
//     category: "Computer Vision",
//     readTime: "5 min read",
//     date: "June 25, 2024",
//     image:
//       "https://images.unsplash.com/photo-1526378722484-bd91ca387e75?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     tags: ["Computer Vision", "Autonomous Vehicles", "AI"],
//   },
//   {
//     id: 5,
//     title: "Reinforcement Learning: Beyond Games",
//     excerpt:
//       "Practical applications of reinforcement learning in real-world scenarios.",
//     category: "Reinforcement Learning",
//     readTime: "7 min read",
//     date: "July 1, 2024",
//     image:
//       "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", // Reinforcement learning - robot learning
//     tags: ["Reinforcement Learning", "AI Applications", "Machine Learning"],
//   },
// ];

const ThoughtLeadershipPage = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [featuredArticles, setFeaturedArticles] = useState([]);

  // Fetch user profile
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
          router.push("/auth/login");
          return;
        }

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

        // Update the auth context with the full user data
        if (setUser) {
          setUser((prev) => ({
            ...prev,
            ...data,
            first_name: data.first_name || prev?.first_name,
            name: data.name || data.first_name || prev?.name || "User",
          }));
        }

        // Set visible after successful profile fetch
        setIsVisible(true);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback to demo user if there's an error but we still want to show the UI
        setIsVisible(true);
        setUser({
          email: "demo@example.com",
          name: "Demo User",
          role: "individual",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [setUser, router]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/get-all-articles/")
      .then((res) => {
        const rawArticles = res.data.articles || [];

        // Optional: Log to verify what’s coming
        console.log("Fetched articles:", rawArticles);

        // Normalize and build data:image URLs
        const normalized = rawArticles.map((a) => ({
          id: a.article_id || a._id || null,
          title: a.title || "No title",
          description: a.description || "No description",
          content_type: a.content_type || "image/jpeg", // Default MIME type
          filename: a.filename || "default.jpg",
          tags: Array.isArray(a.tags) ? a.tags : [],
          imageUrl: a.image
            ? `data:${a.content_type || "image/jpeg"};base64,${a.image}`
            : null,
        }));

        setFeaturedArticles(normalized);
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
      });
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (activeTab === "all") return matchesSearch;
    return (
      matchesSearch &&
      article.category.toLowerCase() === activeTab.toLowerCase()
    );
  });

  const categories = [...new Set(articles.map((article) => article.category))];
  useEffect(() => {
    axios
      .get("http://localhost:5000/get-all-articles/") // adjust if using different port
      .then((res) => {
        setArticles(res.data.articles);
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neon-coral border-t-transparent" />
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Thought Leadership"
      description="Insights, research, and thought leadership on Data Science and AI/ML"
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName={
        user?.name || userProfile?.name || userProfile?.first_name || "User"
      }
      userEmail={user?.email || userProfile?.email || ""}
      className="!p-0 bg-gradient-to-b from-deep-navy/5 to-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* AI Articles Carousel */}
        <div className="rounded-2xl overflow-hidden">
          <AICarousel items={featuredArticles} />
        </div>

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-deep-navy to-graphite-gray text-white p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/[0.05]" />
          <div className="relative z-10 max-w-3xl">
            <Badge className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <BookOpen className="mr-2 h-4 w-4" />
              Latest Insights
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Thought Leadership in AI & Data Science
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Discover cutting-edge research, industry trends, and expert
              perspectives on artificial intelligence and machine learning.
            </p>
            <div
              className="relative max-w-xl
            "
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles, topics, or authors..."
                className="pl-10 pr-4 py-6 rounded-xl border-0 bg-white/10 text-white placeholder:text-gray-300 focus-visible:ring-2 focus-visible:ring-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="overflow-x-auto pb-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-transparent p-0 h-auto w-full justify-start border-b border-gray-200 dark:border-gray-800 rounded-none">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-coral rounded-none px-4 py-3 font-medium text-gray-500 dark:text-gray-400 data-[state=active]:text-deep-navy dark:data-[state=active]:text-white"
              >
                All Articles
              </TabsTrigger>
              {categories.map((category, index) => (
                <TabsTrigger
                  key={index}
                  value={category}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-coral rounded-none px-4 py-3 font-medium text-gray-500 dark:text-gray-400 data-[state=active]:text-deep-navy dark:data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Featured Article */}
        {filteredArticles.some((article) => article.featured) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/90 to-transparent z-10" />
            <div className="relative w-full h-96 overflow-hidden">
              <Image
                src={articles[0].imageUrl}
                // src={`data:image/jpeg;base64,${articles.image_raw}`}
                alt={articles[0].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/800x400/1e40af/ffffff?text=${encodeURIComponent(
                    articles[0].title
                  )}`;
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 p-8 z-20 max-w-2xl">
              <Badge className="mb-3 bg-neon-coral/20 text-neon-coral border-neon-coral/20 hover:bg-neon-coral/30">
                Featured Article
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {articles[0].title}
              </h2>
              <p className="text-gray-200 mb-4">{articles[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> {articles[0].readTime}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> {articles[0].date}
                </span>
              </div>
              <Button className="bg-neon-coral text-white hover:bg-electric-orange">
                Read Article <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles
            .filter((article) => !article.featured)
            .map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="h-full overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
                  {/* <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> */}
                  {/* {articles.length === 0 ? (
                      <p>No articles found.</p>
                    ) : (
                      articles.map((article, index) => (
                        <div
                          key={index}
                          className="bg-white shadow-md p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                        >
                          <h2 className="text-lg font-bold mb-2">
                            {article.title}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {article.content?.slice(0, 100)}...
                          </p>
                          <div className="mt-2">
                            <span
                              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                article.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : article.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {article.status || "pending"}
                            </span>
                          </div>
                        </div>
                      ))
                    )} */}
                  {/* </div> */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/400x200/1e40af/ffffff?text=${encodeURIComponent(
                          article.title
                        )}`;
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-deep-navy hover:bg-white">
                        {article.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {article.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-semibold text-deep-navy dark:text-white group-hover:text-neon-coral transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {/* {article.tags.map((tag, i) => ( */}
                      {(Array.isArray(article.tags) ? article.tags : []).map(
                        (tag, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            {tag}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="text-neon-coral p-0 hover:bg-transparent group-hover:underline"
                      onClick={() =>
                        // router.push(
                        //   `/individual/thought-leadership/${article.id}`
                        // )
                        router.push(
                          `/individual/thought-leadership/${article.article_id}`
                        )
                      } // ← this line is required
                    >
                      Read more{" "}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
        </div>

        {/* AI Articles Carousel with ArticleCards */}
        {/* <div className="rounded-2xl overflow-hidden">
          <ArticleCards articles={featuredArticles} />
        </div> */}

        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
              No articles found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default ThoughtLeadershipPage;
