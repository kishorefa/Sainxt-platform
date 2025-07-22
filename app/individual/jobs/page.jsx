"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  Sparkles,
  Brain,
  BrainCircuit,
  GraduationCap,
  BookOpen,
  Target,
  Award,
  Video,
  X,
  RefreshCw,
  Cpu,
  Database,
  BarChart2,
  Code,
  Zap,
  Server,
  Layers,
  Shield,
  Cloud,
  GitBranch,
  Cpu as CpuIcon,
  Bot,
  Network,
  MessageSquare,
  Eye,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/JobCard";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/providers/custom_auth-provider";
import { aiSpecializations, trendingSkills } from "@/data/jobsData";

const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: Sparkles },
  { title: "Profile Builder", href: "/individual/profile", icon: BookOpen },
  { title: "AI101", href: "/individual/introductory-training", icon: BookOpen },
  {
    title: "Thought Leadership",
    href: "/individual/thought-leadership",
    icon: BookOpen,
  },
  {
    title: "View Jobs",
    href: "/individual/jobs",
    icon: BrainCircuit,
    active: true,
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [activeSpecialization, setActiveSpecialization] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();
  const auth = useAuth();

  const isLoading = isJobsLoading || isProfileLoading;

  // Fetch jobs from Arbeitnow API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsJobsLoading(true);
        const response = await fetch("/api/arbeitnow");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setIsJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (typeof window === "undefined") {
          setIsProfileLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          setIsProfileLoading(false);
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
        if (auth.setUser) {
          auth.setUser((prev) => ({
            ...prev,
            ...data,
            first_name: data.first_name || prev?.first_name,
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.push("/auth/login");
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [auth, router]);

  const experienceLevels = [
    { id: "all", label: "All Levels" },
    { id: "fresher", label: "Fresher (0-2 years)" },
    { id: "internship", label: "Internship" },
    { id: "mid-level", label: "Mid-Level (2-5 years)" },
    { id: "experienced", label: "Experienced (5+ years)" },
  ];

  const filteredJobs = jobs.filter((job) => {
    if (!job) return false;

    const matchesSearch =
      (job.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (job.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      job.skills?.some((skill) =>
        skill?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      false ||
      job.aiFocus?.some((focus) =>
        focus?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      false;
    const matchesLocation =
      !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesJobType = !jobTypeFilter || job.type === jobTypeFilter;
    const matchesSpecialization =
      activeSpecialization === "all" ||
      (job.aiFocus || []).some((focus) =>
        focus.toLowerCase().includes(activeSpecialization)
      );
    const matchesExperience =
      experienceFilter === "all" ||
      job.experienceLevel === experienceFilter ||
      (experienceFilter === "fresher" && job.experienceLevel === "internship");

    return (
      matchesSearch &&
      matchesLocation &&
      matchesJobType &&
      matchesSpecialization &&
      matchesExperience
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-neon-coral" />
      </div>
    );
  }

  const userName = userProfile?.first_name || userProfile?.name || "User";
  const userEmail = userProfile?.email || "";

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName={userName}
      userEmail={userEmail}
      className="!p-0 bg-gradient-to-b from-deep-navy/5 to-white"
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-deep-navy to-indigo-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/ai-pattern.png')] bg-cover bg-center"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-coral to-aqua-blue">
              AI & ML Career Opportunities
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Discover cutting-edge AI and Machine Learning roles at top tech
              companies worldwide. Your dream job in artificial intelligence is
              just a search away.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-1 shadow-xl">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-white/70" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Job title, company, or AI specialization"
                    className="pl-10 h-14 text-lg bg-white/5 border-0 text-white placeholder-white/70 focus-visible:ring-2 focus-visible:ring-white/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  className="h-14 px-8 text-lg bg-gradient-to-r from-neon-coral to-aqua-blue hover:from-neon-coral/90 hover:to-aqua-blue/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  onClick={() => {}}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* AI Specializations */}
            <div className="bg-white rounded-2xl shadow-enterprise p-6 border border-soft-gray">
              <h3 className="font-semibold text-lg text-deep-navy mb-4 flex items-center">
                <BrainCircuit className="h-5 w-5 mr-2 text-neon-coral" />
                AI Specializations
              </h3>
              <div className="space-y-2">
                {aiSpecializations.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() =>
                      setActiveSpecialization(
                        spec.id === "all" ? "all" : spec.name.toLowerCase()
                      )
                    }
                    className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center transition-all ${
                      (activeSpecialization === "all" && spec.id === "all") ||
                      (spec.id !== "all" &&
                        activeSpecialization === spec.name.toLowerCase())
                        ? "bg-gradient-to-r from-neon-coral/5 to-aqua-blue/5 border border-neon-coral/20 text-neon-coral font-medium"
                        : "hover:bg-gray-50 text-deep-navy/80"
                    }`}
                  >
                    <spec.icon className="h-5 w-5 mr-3" />
                    {spec.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending AI Skills */}
            <div className="bg-white rounded-2xl shadow-enterprise p-6 border border-soft-gray">
              <h3 className="font-semibold text-lg text-deep-navy mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-electric-orange" />
                Trending AI Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingSkills.map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(skill.name)}
                    className="px-3 py-1.5 text-sm rounded-full bg-gray-50 hover:bg-gray-100 text-deep-navy/80 hover:text-neon-coral transition-colors border border-gray-200 hover:border-neon-coral/30"
                  >
                    {skill.name}
                    <span className="ml-1 text-xs text-gray-500">
                      {skill.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level Filter */}
            <div className="bg-white rounded-2xl shadow-enterprise p-6 border border-soft-gray">
              <h3 className="font-semibold text-lg text-deep-navy mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-neon-coral" />
                Experience Level
              </h3>
              <div className="space-y-2">
                {experienceLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setExperienceFilter(level.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center transition-all ${
                      experienceFilter === level.id
                        ? "bg-gradient-to-r from-neon-coral/5 to-aqua-blue/5 border border-neon-coral/20 text-neon-coral font-medium"
                        : "hover:bg-gray-50 text-deep-navy/80"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Active Filters */}
            {(searchTerm ||
              locationFilter ||
              jobTypeFilter ||
              activeSpecialization !== "all" ||
              experienceFilter !== "all") && (
              <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-soft-gray/50 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-deep-navy/70 mr-2">
                    Active filters:
                  </span>

                  {searchTerm && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <span className="text-sm text-deep-navy">
                        Search: {searchTerm}
                      </span>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="ml-2 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {locationFilter && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <MapPin className="w-3.5 h-3.5 text-deep-navy/60 mr-1" />
                      <span className="text-sm text-deep-navy">
                        {locationFilter}
                      </span>
                      <button
                        onClick={() => setLocationFilter("")}
                        className="ml-1.5 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {jobTypeFilter && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <Briefcase className="w-3.5 h-3.5 text-deep-navy/60 mr-1" />
                      <span className="text-sm text-deep-navy">
                        {jobTypeFilter}
                      </span>
                      <button
                        onClick={() => setJobTypeFilter("")}
                        className="ml-1.5 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {activeSpecialization !== "all" && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <Brain className="w-3.5 h-3.5 text-neon-coral mr-1" />
                      <span className="text-sm text-deep-navy">
                        {aiSpecializations.find(
                          (s) => s.id === activeSpecialization
                        )?.name || activeSpecialization}
                      </span>
                      <button
                        onClick={() => setActiveSpecialization("all")}
                        className="ml-1.5 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {experienceFilter !== "all" && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <GraduationCap className="w-3.5 h-3.5 text-aqua-blue mr-1" />
                      <span className="text-sm text-deep-navy">
                        {experienceLevels.find((l) => l.id === experienceFilter)
                          ?.label || experienceFilter}
                      </span>
                      <button
                        onClick={() => setExperienceFilter("all")}
                        className="ml-1.5 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setLocationFilter("");
                      setJobTypeFilter("");
                      setActiveSpecialization("all");
                      setExperienceFilter("all");
                    }}
                    className="ml-auto flex items-center text-sm text-neon-coral hover:text-neon-coral/80 transition-colors font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Job Listings */}
            <div className="space-y-6">
              {filteredJobs.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-deep-navy">
                      {filteredJobs.length}{" "}
                      {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
                    </h2>
                    <div
                      className="flex items-center
                    "
                    >
                      <span className="text-sm text-deep-navy/70 mr-2">
                        Sort by:
                      </span>
                      <select
                        className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-neon-coral/50 focus:border-neon-coral/30"
                        defaultValue="relevance"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="newest">Newest</option>
                        <option value="salary-high">Salary: High to Low</option>
                        <option value="salary-low">Salary: Low to High</option>
                      </select>
                    </div>
                  </div>

                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-enterprise border border-soft-gray/50">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-neon-coral/10 to-aqua-blue/10 mb-4">
                    <Briefcase className="h-8 w-8 text-deep-navy/70" />
                  </div>
                  <h3 className="text-xl font-medium text-deep-navy mb-2">
                    No matching jobs found
                  </h3>
                  <p className="text-deep-navy/70 max-w-md mx-auto mb-6">
                    We couldn't find any jobs matching your criteria. Try
                    adjusting your search or filters.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      className="border-neon-coral/30 text-neon-coral hover:bg-neon-coral/5 hover:border-neon-coral/50"
                      onClick={() => {
                        setSearchTerm("");
                        setLocationFilter("");
                        setJobTypeFilter("");
                        setActiveSpecialization("all");
                      }}
                    >
                      Clear all filters
                    </Button>
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-neon-coral to-aqua-blue hover:from-neon-coral/90 hover:to-aqua-blue/90"
                      onClick={() => {
                        setSearchTerm("AI");
                      }}
                    >
                      Show View Jobs
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
