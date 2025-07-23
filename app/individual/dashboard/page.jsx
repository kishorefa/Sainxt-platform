"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, isTokenExpired, refreshToken, clearAuthTokens } from "@/lib/auth";
import { customFetch } from "@/lib/auth-interceptor";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useAuth } from "@/components/providers/custom_auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  User,
  BookOpen,
  Award,
  Briefcase,
  Target,
  TrendingUp,
  Download,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Calendar,
  Brain,
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: TrendingUp },
  { title: "Profile Builder", href: "/individual/profile", icon: User },
  //{ title: "Skills & Experience", href: "/individual/skills", icon: Target },
  //{ title: "Assessments", href: "/individual/assessments", icon: BookOpen },
  //{ title: "Certificates", href: "/individual/certificates", icon: Award },
  // { title: "Training Programs", href: "/individual/training", icon: BookOpen, badge: "New" },
  //{ title: "Internships", href: "/individual/internships", icon: Briefcase },
  { title: "AI101", href: "/individual/introductory-training", icon: BookOpen },
  {
    title: "Thought Leadership",
    href: "/individual/thought-leadership",
    icon: Brain,
  },
  { title: "View Jobs", href: "/individual/jobs", icon: Briefcase },
];

const skillsData = [
  { name: "Machine Learning", level: 85, category: "Technical", trend: "up" },
  { name: "Python Programming", level: 92, category: "Technical", trend: "up" },
  { name: "Data Analysis", level: 78, category: "Technical", trend: "stable" },
  { name: "Communication", level: 88, category: "Soft Skills", trend: "up" },
  { name: "Problem Solving", level: 90, category: "Soft Skills", trend: "up" },
];

const recentActivities = [
  {
    id: 1,
    type: "assessment",
    title: "Completed Python Assessment",
    description: "Scored 85% - Great job!",
    timestamp: "2 hours ago",
    icon: CheckCircle,
    color: "text-aqua-blue",
    bgColor: "bg-aqua-blue/10",
  },
  {
    id: 2,
    type: "training",
    title: "Nominated for AI 101 Training",
    description: "Training starts next week",
    timestamp: "1 day ago",
    icon: Star,
    color: "text-electric-orange",
    bgColor: "bg-electric-orange/10",
  },
  {
    id: 3,
    type: "application",
    title: "Applied for Data Science Internship",
    description: "Application under review",
    timestamp: "3 days ago",
    icon: Briefcase,
    color: "text-neon-coral",
    bgColor: "bg-neon-coral/10",
  },
  {
    id: 4,
    type: "certificate",
    title: "Earned Data Analysis Certificate",
    description: "Certificate is ready for download",
    timestamp: "1 week ago",
    icon: Award,
    color: "text-aqua-blue",
    bgColor: "bg-aqua-blue/10",
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "AI 101 Training Session",
    date: "Tomorrow",
    time: "2:00 PM",
    type: "Training",
    color: "bg-aqua-blue",
  },
  {
    id: 2,
    title: "Mock Interview Practice",
    date: "Friday",
    time: "10:00 AM",
    type: "Assessment",
    color: "bg-neon-coral",
  },
  {
    id: 3,
    title: "Career Guidance Session",
    date: "Next Monday",
    time: "3:00 PM",
    type: "Mentoring",
    color: "bg-electric-orange",
  },
];

export default function IndividualDashboard() {
  const router = useRouter();
  const auth = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle unauthorized events (e.g., when token refresh fails)
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('Unauthorized access detected, redirecting to login');
      router.push('/auth/login');
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Only run on client side
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        const token = getToken();
        if (!token) {
          console.log('No authentication token found, redirecting to login');
          router.push('/auth/login');
          return;
        }

        // Check if token is expired and try to refresh it
        if (isTokenExpired()) {
          try {
            console.log('Token expired, attempting to refresh...');
            const newTokens = await refreshToken();
            if (!newTokens?.access_token) {
              throw new Error('Failed to refresh token');
            }
            console.log('Token refreshed successfully');
          } catch (error) {
            console.error('Token refresh failed:', error);
            clearAuthTokens();
            window.dispatchEvent(new Event('unauthorized'));
            return;
          }
        }
        
        console.log('Fetching user profile...');
        const response = await customFetch('/api/user/profile', {
          method: 'GET'
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched user profile:', data);
        setUserProfile(data);
        
        // Update the auth context with the full user data
        if (auth.setUser) {
          auth.setUser(prev => ({
            ...prev,
            ...data,
            first_name: data.first_name || prev?.first_name
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.message.includes('401') || error.message.includes('403')) {
          window.dispatchEvent(new Event('unauthorized'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [auth]);

  // Check for auth and token only on client side
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Show loading state during server-side rendering
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-coral"></div>
      </div>
    );
  }

  if (!auth || !localStorage.getItem('token')) {
    // Show loading state while redirecting
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-coral"></div>
        <p className="text-center text-lg text-gray-600">
          Redirecting to login...
        </p>
      </div>
    );
  }

  const { user, loading } = auth;

  // Debug: Log the user object to see what data we have
  console.log('User object in dashboard:', JSON.stringify(user, null, 2));
  
  // Check localStorage directly as well
  let storedUser = null;
  if (typeof window !== 'undefined') {
    storedUser = localStorage.getItem('jobraze-user');
    console.log('Stored user in localStorage (raw):', storedUser);
    try {
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      console.log('Parsed user from localStorage:', parsedUser);
      console.log('Available keys in user object:', Object.keys(parsedUser || {}));
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
  }

  // Get display name with priority: userProfile > auth.user > localStorage
  const getDisplayName = () => {
    // First check the fetched user profile
    if (userProfile?.first_name) return userProfile.first_name;
    if (userProfile?.name) return userProfile.name.split(' ')[0];
    
    // Then check the auth context
    if (user?.first_name) return user.first_name;
    if (user?.name) return user.name.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    
    // Finally check localStorage as fallback
    try {
      const storedUser = typeof window !== 'undefined' && localStorage.getItem('jobraze-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser.first_name || parsedUser.name?.split(' ')[0] || parsedUser.email?.split('@')[0];
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
    
    return 'User';
  };
  
  const userName = getDisplayName();
  const userEmail = userProfile?.email || user?.email || "user@example.com";
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading user data...</div>;
  }

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading...</p>;
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-lg">
        You must be signed in to access the dashboard.
      </p>
    );
  }

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      // userName="John Doe"
      // userEmail="john@example.com"
      userName={userName}
      userEmail={userEmail}
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/individual"
                className="text-text-gray hover:text-neon-coral"
              >
                Individual
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-deep-navy">
                Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-deep-navy">
              Welcome back, {userName}
            </h1>
            <p className="text-text-gray">
              Continue building your AI-powered career profile and unlock new
              opportunities with momentum
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-soft-gray text-deep-navy hover:bg-surface-secondary"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Profile
            </Button>
            <Button
              size="sm"
              className="bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200"
            >
              <Target className="mr-2 h-4 w-4" />
              Complete Profile
            </Button>
          </div>
        </div>

        {/* Profile Completion Card */}
        <Card className="border-l-4 border-l-neon-coral card-ai-enhanced">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-deep-navy">
                  <Target className="h-5 w-5 text-neon-coral" />
                  Profile Completion Score
                </CardTitle>
                <CardDescription className="text-text-gray">
                  Complete your profile to unlock more opportunities and build
                  momentum
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-neon-coral">78%</div>
                <Badge className="bg-electric-orange/10 text-electric-orange border-electric-orange/20">
                  Good Progress
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={78} className="h-3 bg-surface-tertiary" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-aqua-blue" />
                  <span className="text-deep-navy">Basic Info</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-aqua-blue" />
                  <span className="text-deep-navy">Skills</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-electric-orange" />
                  <span className="text-deep-navy">Experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-electric-orange" />
                  <span className="text-deep-navy">Certifications</span>
                </div>
              </div>
              <Button className="w-full bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200">
                Complete Missing Sections
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-surface-tertiary">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-surface-primary data-[state=active]:text-deep-navy"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="data-[state=active]:bg-surface-primary data-[state=active]:text-deep-navy"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="data-[state=active]:bg-surface-primary data-[state=active]:text-deep-navy"
            >
              Activities
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="data-[state=active]:bg-surface-primary data-[state=active]:text-deep-navy"
            >
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Skills Assessment */}
              <Card className="hover:shadow-enterprise-lg transition-shadow card-ai-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-deep-navy">
                    <Brain className="h-5 w-5 text-neon-coral" />
                    AI Skills Assessment
                  </CardTitle>
                  <CardDescription className="text-text-gray">
                    Test your AI knowledge and get personalized feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-deep-navy">
                      Current Level
                    </span>
                    <Badge className="bg-neon-coral/10 text-neon-coral border-neon-coral/20">
                      Intermediate
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-deep-navy">Machine Learning</span>
                        <span className="font-medium text-neon-coral">85%</span>
                      </div>
                      <Progress
                        value={85}
                        className="h-2 bg-surface-tertiary"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-deep-navy">Data Science</span>
                        <span className="font-medium text-aqua-blue">72%</span>
                      </div>
                      <Progress
                        value={72}
                        className="h-2 bg-surface-tertiary"
                      />
                    </div>
                  </div>
                  <Button className="w-full bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200">
                    Take Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Training Programs */}
              <Card className="hover:shadow-enterprise-lg transition-shadow card-enterprise">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-deep-navy">
                    <BookOpen className="h-5 w-5 text-aqua-blue" />
                    Training Programs
                  </CardTitle>
                  <CardDescription className="text-text-gray">
                    Enhance your skills with AI-powered training
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-aqua-blue/20 rounded-lg bg-aqua-blue/5">
                      <div>
                        <p className="font-medium text-deep-navy">
                          AI 101 Fundamentals
                        </p>
                        <p className="text-sm text-text-gray">Beginner Level</p>
                      </div>
                      <Badge className="bg-aqua-blue/10 text-aqua-blue border-aqua-blue/20">
                        Nominated
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-soft-gray rounded-lg">
                      <div>
                        <p className="font-medium text-deep-navy">ML Level 1</p>
                        <p className="text-sm text-text-gray">Intermediate</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-soft-gray text-text-gray"
                      >
                        Available
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-soft-gray text-deep-navy hover:bg-surface-secondary"
                  >
                    View All Programs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Certificates */}
              <Card className="hover:shadow-enterprise-lg transition-shadow card-enterprise">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-deep-navy">
                    <Award className="h-5 w-5 text-electric-orange" />
                    My Certificates
                  </CardTitle>
                  <CardDescription className="text-text-gray">
                    Download and share your achievements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-soft-gray rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-aqua-blue/10 rounded-lg flex items-center justify-center">
                          <Award className="h-5 w-5 text-aqua-blue" />
                        </div>
                        <div>
                          <p className="font-medium text-deep-navy">
                            Python Basics
                          </p>
                          <p className="text-sm text-text-gray">Completed</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-soft-gray text-deep-navy hover:bg-surface-secondary"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-soft-gray rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-electric-orange/10 rounded-lg flex items-center justify-center">
                          <Award className="h-5 w-5 text-electric-orange" />
                        </div>
                        <div>
                          <p className="font-medium text-deep-navy">
                            Data Analysis
                          </p>
                          <p className="text-sm text-text-gray">Completed</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-soft-gray text-deep-navy hover:bg-surface-secondary"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-soft-gray text-deep-navy hover:bg-surface-secondary"
                  >
                    View All Certificates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card className="card-enterprise">
              <CardHeader>
                <CardTitle className="text-deep-navy">
                  Skills Overview
                </CardTitle>
                <CardDescription className="text-text-gray">
                  Track your skill development across different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skillsData.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-deep-navy">
                            {skill.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs border-soft-gray text-text-gray"
                          >
                            {skill.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-deep-navy">
                            {skill.level}%
                          </span>
                          {skill.trend === "up" && (
                            <TrendingUp className="h-3 w-3 text-aqua-blue" />
                          )}
                        </div>
                      </div>
                      <Progress
                        value={skill.level}
                        className="h-2 bg-surface-tertiary"
                      />
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6 bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200">
                  Take Skills Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card className="card-enterprise">
              <CardHeader>
                <CardTitle className="text-deep-navy">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-text-gray">
                  Your latest achievements and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-4 border border-soft-gray rounded-lg hover:bg-surface-secondary transition-colors"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.bgColor}`}
                        >
                          <Icon className={`h-5 w-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-deep-navy">
                            {activity.title}
                          </p>
                          <p className="text-sm text-text-gray">
                            {activity.description}
                          </p>
                        </div>
                        <span className="text-sm text-text-gray">
                          {activity.timestamp}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="card-enterprise">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-deep-navy">
                  <Calendar className="h-5 w-5 text-aqua-blue" />
                  Upcoming Events
                </CardTitle>
                <CardDescription className="text-text-gray">
                  Your scheduled training sessions and assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border border-soft-gray rounded-lg hover:bg-surface-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 ${event.color} rounded-lg flex items-center justify-center`}
                        >
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-deep-navy">
                            {event.title}
                          </p>
                          <p className="text-sm text-text-gray">
                            {event.date} at {event.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-soft-gray text-text-gray"
                        >
                          {event.type}
                        </Badge>
                        <Button
                          size="sm"
                          className="bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200"
                        >
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-soft-gray text-deep-navy hover:bg-surface-secondary"
                >
                  View Full Calendar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}