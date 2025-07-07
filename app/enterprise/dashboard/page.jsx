"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Building2,
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Plus,
  Eye,
  UserCheck,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  MoreHorizontal,
  UserCheckIcon
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/enterprise/dashboard", icon: TrendingUp },
  { title: "Job Listings", href: "/enterprise/jobs", icon: Briefcase },
  { title: "Candidates", href: "/enterprise/candidates", icon: Users },
  { title: "Interviews", href: "/enterprise/interviews", icon: Calendar },
  { title: "Analytics", href: "/enterprise/analytics", icon: TrendingUp },
  { title: "JD Interview", href: "/enterprise/jd-interview", icon: UserCheckIcon },
  { title: "AI Review", href: "/enterprise/ai-review", icon: Calendar },

  { title: "Settings", href: "/enterprise/settings", icon: Building2 },
];

const kpiData = [
  {
    title: "Active Jobs",
    value: "12",
    change: "+2",
    changeType: "increase",
    period: "from last month",
    icon: Briefcase,
  },
  {
    title: "Total Applications",
    value: "247",
    change: "+18%",
    changeType: "increase",
    period: "from last month",
    icon: Users,
  },
  {
    title: "Interviews This Week",
    value: "8",
    change: "-2",
    changeType: "decrease",
    period: "from last week",
    icon: Calendar,
  },
  {
    title: "Hires This Month",
    value: "5",
    change: "+25%",
    changeType: "increase",
    period: "from last month",
    icon: UserCheck,
  },
];

const recentJobs = [
  {
    id: 1,
    title: "Senior Data Scientist",
    department: "Engineering",
    applications: 24,
    status: "active",
    postedDate: "2024-01-15",
    priority: "high",
    location: "San Francisco, CA",
  },
  {
    id: 2,
    title: "ML Engineer",
    department: "AI/ML",
    applications: 18,
    status: "active",
    postedDate: "2024-01-12",
    priority: "medium",
    location: "Remote",
  },
  {
    id: 3,
    title: "Product Manager",
    department: "Product",
    applications: 31,
    status: "closed",
    postedDate: "2024-01-08",
    priority: "low",
    location: "New York, NY",
  },
  {
    id: 4,
    title: "Frontend Developer",
    department: "Engineering",
    applications: 15,
    status: "draft",
    postedDate: "2024-01-16",
    priority: "medium",
    location: "Austin, TX",
  },
];

const upcomingInterviews = [
  {
    id: 1,
    candidate: "Sarah Johnson",
    position: "Senior Data Scientist",
    time: "2:00 PM",
    type: "Technical",
    interviewer: "John Smith",
    status: "confirmed",
  },
  {
    id: 2,
    candidate: "Michael Chen",
    position: "ML Engineer",
    time: "3:30 PM",
    type: "Behavioral",
    interviewer: "Jane Doe",
    status: "pending",
  },
  {
    id: 3,
    candidate: "Emily Davis",
    position: "Data Analyst",
    time: "4:00 PM",
    type: "Final Round",
    interviewer: "Bob Wilson",
    status: "confirmed",
  },
];

const getStatusBadge = (status) => {
  const statusConfig = {
    active: { variant: "default", label: "Active" },
    closed: { variant: "secondary", label: "Closed" },
    draft: { variant: "outline", label: "Draft" },
    confirmed: { variant: "default", label: "Confirmed" },
    pending: { variant: "secondary", label: "Pending" },
  };

  const config = statusConfig[status] || statusConfig.active;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getPriorityBadge = (priority) => {
  const priorityConfig = {
    high: { className: "bg-red-100 text-red-800", label: "High" },
    medium: { className: "bg-yellow-100 text-yellow-800", label: "Medium" },
    low: { className: "bg-green-100 text-green-800", label: "Low" },
  };

  const config = priorityConfig[priority] || priorityConfig.medium;
  return <Badge className={config.className}>{config.label}</Badge>;
};

export default function EnterpriseDashboard() {
  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="enterprise"
      userName="Jane Smith"
      userEmail="jane@company.com"
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/enterprise">Enterprise</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your hiring pipeline.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {kpi.changeType === "increase" ? (
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    <span className={kpi.changeType === "increase" ? "text-green-600" : "text-red-600"}>
                      {kpi.change}
                    </span>
                    <span className="ml-1">{kpi.period}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
            <TabsTrigger value="interviews">Today's Interviews</TabsTrigger>
            <TabsTrigger value="analytics">Quick Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Job Postings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Job Postings</CardTitle>
                    <CardDescription>Your latest job listings and their performance</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentJobs.slice(0, 3).map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{job.title}</h4>
                            {getPriorityBadge(job.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {job.department} • {job.location}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {job.applications} applications
                            </span>
                            <span className="text-muted-foreground">Posted {job.postedDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {getStatusBadge(job.status)}
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Jobs ({recentJobs.length})
                  </Button>
                </CardContent>
              </Card>

              {/* Today's Interviews */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Today's Interviews</CardTitle>
                    <CardDescription>Scheduled interviews for today</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium truncate">{interview.candidate}</h4>
                            <p className="text-sm text-muted-foreground truncate">{interview.position}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{interview.time}</span>
                              <Badge variant="outline" className="text-xs">
                                {interview.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(interview.status)}
                          <Button size="sm">Join</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Interviews
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Pipeline Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Hiring Pipeline Overview</CardTitle>
                <CardDescription>Track candidates through your hiring process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    { stage: "Applied", count: 247, color: "bg-blue-500" },
                    { stage: "Screening", count: 89, color: "bg-yellow-500" },
                    { stage: "Interview", count: 34, color: "bg-orange-500" },
                    { stage: "Final Round", count: 12, color: "bg-purple-500" },
                    { stage: "Hired", count: 5, color: "bg-green-500" },
                  ].map((stage) => (
                    <div key={stage.stage} className="text-center">
                      <div className={`w-full h-2 ${stage.color} rounded-full mb-2`} />
                      <div className="text-2xl font-bold">{stage.count}</div>
                      <div className="text-sm text-muted-foreground">{stage.stage}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Job Postings</CardTitle>
                <CardDescription>Manage and track all your job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{job.title}</h4>
                          {getPriorityBadge(job.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {job.department} • {job.location}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.applications} applications
                          </span>
                          <span className="text-muted-foreground">Posted {job.postedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getStatusBadge(job.status)}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interview Schedule</CardTitle>
                <CardDescription>All scheduled interviews for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium">{interview.candidate}</h4>
                          <p className="text-sm text-muted-foreground">{interview.position}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {interview.time}
                            </span>
                            <span>with {interview.interviewer}</span>
                            <Badge variant="outline">{interview.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(interview.status)}
                        <Button size="sm">Join Interview</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Trends</CardTitle>
                  <CardDescription>Applications received over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    Chart placeholder - Application trends over the last 30 days
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Jobs</CardTitle>
                  <CardDescription>Jobs with the most applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentJobs.slice(0, 3).map((job, index) => (
                      <div key={job.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{job.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{job.applications} applications</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  
    </DashboardLayout>
  )
}
