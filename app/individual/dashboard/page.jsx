"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
} from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: TrendingUp },
  { title: "Profile Builder", href: "/individual/profile", icon: User },
  //{ title: "Skills & Experience", href: "/individual/skills", icon: Target },
  //{ title: "Assessments", href: "/individual/assessments", icon: BookOpen },
  //{ title: "Certificates", href: "/individual/certificates", icon: Award },
 // { title: "Training Programs", href: "/individual/training", icon: BookOpen, badge: "New" },
  //{ title: "Internships", href: "/individual/internships", icon: Briefcase },
  { title: "AI101", href: "/individual/introductory-training", icon: BookOpen },
  { title: "Thought Leadership", href: "/individual/thought-leadership", icon: Brain },
  { title: "View Jobs", href: "/individual/jobs", icon: Briefcase },
]

const skillsData = [
  { name: "Machine Learning", level: 85, category: "Technical", trend: "up" },
  { name: "Python Programming", level: 92, category: "Technical", trend: "up" },
  { name: "Data Analysis", level: 78, category: "Technical", trend: "stable" },
  { name: "Communication", level: 88, category: "Soft Skills", trend: "up" },
  { name: "Problem Solving", level: 90, category: "Soft Skills", trend: "up" },
]

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
]

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
]

export default function IndividualDashboard() {
  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName="John Doe"
      userEmail="john@example.com"
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/individual" className="text-text-gray hover:text-neon-coral">
                Individual
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-deep-navy">Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-deep-navy">Welcome back, John!</h1>
            <p className="text-text-gray">
              Continue building your AI-powered career profile and unlock new opportunities with momentum
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-soft-gray text-deep-navy hover:bg-surface-secondary">
              <Download className="mr-2 h-4 w-4" />
              Export Profile
            </Button>
            <Button size="sm" className="bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200">
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
                  Complete your profile to unlock more opportunities and build momentum
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
                    <span className="text-sm font-medium text-deep-navy">Current Level</span>
                    <Badge className="bg-neon-coral/10 text-neon-coral border-neon-coral/20">Intermediate</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-deep-navy">Machine Learning</span>
                        <span className="font-medium text-neon-coral">85%</span>
                      </div>
                      <Progress value={85} className="h-2 bg-surface-tertiary" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-deep-navy">Data Science</span>
                        <span className="font-medium text-aqua-blue">72%</span>
                      </div>
                      <Progress value={72} className="h-2 bg-surface-tertiary" />
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
                        <p className="font-medium text-deep-navy">AI 101 Fundamentals</p>
                        <p className="text-sm text-text-gray">Beginner Level</p>
                      </div>
                      <Badge className="bg-aqua-blue/10 text-aqua-blue border-aqua-blue/20">Nominated</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-soft-gray rounded-lg">
                      <div>
                        <p className="font-medium text-deep-navy">ML Level 1</p>
                        <p className="text-sm text-text-gray">Intermediate</p>
                      </div>
                      <Badge variant="outline" className="border-soft-gray text-text-gray">
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
                  <CardDescription className="text-text-gray">Download and share your achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-soft-gray rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-aqua-blue/10 rounded-lg flex items-center justify-center">
                          <Award className="h-5 w-5 text-aqua-blue" />
                        </div>
                        <div>
                          <p className="font-medium text-deep-navy">Python Basics</p>
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
                          <p className="font-medium text-deep-navy">Data Analysis</p>
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
                <CardTitle className="text-deep-navy">Skills Overview</CardTitle>
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
                          <span className="font-medium text-deep-navy">{skill.name}</span>
                          <Badge variant="outline" className="text-xs border-soft-gray text-text-gray">
                            {skill.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-deep-navy">{skill.level}%</span>
                          {skill.trend === "up" && <TrendingUp className="h-3 w-3 text-aqua-blue" />}
                        </div>
                      </div>
                      <Progress value={skill.level} className="h-2 bg-surface-tertiary" />
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
                <CardTitle className="text-deep-navy">Recent Activity</CardTitle>
                <CardDescription className="text-text-gray">Your latest achievements and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-4 border border-soft-gray rounded-lg hover:bg-surface-secondary transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.bgColor}`}>
                          <Icon className={`h-5 w-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-deep-navy">{activity.title}</p>
                          <p className="text-sm text-text-gray">{activity.description}</p>
                        </div>
                        <span className="text-sm text-text-gray">{activity.timestamp}</span>
                      </div>
                    )
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
                        <div className={`w-10 h-10 ${event.color} rounded-lg flex items-center justify-center`}>
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-deep-navy">{event.title}</p>
                          <p className="text-sm text-text-gray">
                            {event.date} at {event.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-soft-gray text-text-gray">
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
  )
}
