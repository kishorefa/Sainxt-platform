"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Play,
  Clock,
  CheckCircle,
  Star,
  Brain,
  Code,
  BarChart3,
  Download,
  RotateCcw,
  ArrowRight,
} from "lucide-react"

// Sidebar items
const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: TrendingUp },
  { title: "Profile Builder", href: "/individual/profile", icon: User },
  { title: "Skills & Experience", href: "/individual/skills", icon: Target },
  { title: "Assessments", href: "/individual/assessments", icon: BookOpen },
 // { title: "Certificates", href: "/individual/certificates", icon: Award },
  { title: "Training Programs", href: "/individual/training", icon: BookOpen, badge: "New" },
 // { title: "Internships", href: "/individual/internships", icon: Briefcase },
]

// Assessments data
const skillAssessments = [
  {
    id: 1,
    title: "AI/ML Fundamentals",
    description: "Comprehensive assessment of AI and Machine Learning concepts",
    duration: "45 minutes",
    difficulty: "Intermediate",
    score: 78,
    status: "completed",
    icon: Brain,
    color: "bg-purple-500",
    completedAt: "2024-01-20",
    skillLevel: "intermediate",
    retakeAvailable: true,
  },
  {
    id: 2,
    title: "Python Programming",
    description: "Test your Python coding skills with real-world problems",
    duration: "60 minutes",
    difficulty: "Intermediate",
    score: 85,
    status: "completed",
    icon: Code,
    color: "bg-blue-500",
    completedAt: "2024-01-18",
    skillLevel: "intermediate",
    retakeAvailable: true,
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    description: "Evaluate your understanding of data science concepts",
    duration: "50 minutes",
    difficulty: "Beginner",
    score: null,
    status: "available",
    icon: BarChart3,
    color: "bg-green-500",
    completedAt: null,
    skillLevel: null,
    retakeAvailable: false,
  },
  {
    id: 4,
    title: "Advanced Machine Learning",
    description: "Deep dive into advanced ML algorithms and techniques",
    duration: "90 minutes",
    difficulty: "Advanced",
    score: null,
    status: "locked",
    icon: Brain,
    color: "bg-red-500",
    completedAt: null,
    skillLevel: null,
    retakeAvailable: false,
  },
]

// Mock Tests
const mockTests = [
  {
    id: 1,
    title: "Technical Interview Prep",
    description: "Practice coding questions commonly asked in interviews",
    questions: 15,
    duration: "90 minutes",
    attempts: 2,
    bestScore: 82,
    lastAttempt: "2024-01-19",
  },
  {
    id: 2,
    title: "AI/ML Interview Questions",
    description: "Prepare for machine learning focused interviews",
    questions: 20,
    duration: "120 minutes",
    attempts: 0,
    bestScore: null,
    lastAttempt: null,
  },
  {
    id: 3,
    title: "System Design for ML",
    description: "Practice designing machine learning systems",
    questions: 5,
    duration: "60 minutes",
    attempts: 1,
    bestScore: 75,
    lastAttempt: "2024-01-15",
  },
]

// Helpers
const getStatusBadge = (status, score) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800">Completed {score ? `(${score}%)` : ""}</Badge>
    case "available":
      return <Badge className="bg-blue-100 text-blue-800">Available</Badge>
    case "locked":
      return <Badge variant="secondary">Locked</Badge>
    default:
      return null
  }
}

const getDifficultyColor = (difficulty) => {
  return {
    Beginner: "text-green-600",
    Intermediate: "text-yellow-600",
    Advanced: "text-red-600",
  }[difficulty] || "text-gray-600"
}

const getSkillLevelBadge = (level) => {
  if (!level) return null
  const config = {
    beginner: { icon: "🟢", color: "bg-green-100 text-green-800" },
    intermediate: { icon: "🟡", color: "bg-yellow-100 text-yellow-800" },
    expert: { icon: "🔴", color: "bg-red-100 text-red-800" },
  }
  const item = config[level]
  return item ? <Badge className={item.color}>{item.icon} {level.charAt(0).toUpperCase() + level.slice(1)}</Badge> : null
}

export default function AssessmentsPage() {
  const completed = skillAssessments.filter((a) => a.status === "completed")
  const averageScore = completed.length > 0
    ? Math.round(completed.reduce((sum, a) => sum + (a.score || 0), 0) / completed.length)
    : 0

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName="John Doe"
      userEmail="john@example.com"
    >
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/individual">Individual</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Assessment Center</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assessment Center</h1>
            <p className="text-muted-foreground">Test your skills, get AI-powered feedback, and earn certificates</p>
          </div>
          <Button size="lg" asChild>
            <a href="/individual/assessment/skill-test">
              <Brain className="mr-2 h-5 w-5" />
              Take AI/ML Assessment
            </a>
          </Button>
        </div>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Your Assessment Progress</CardTitle>
            <CardDescription>Track your skill development across different domains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div><div className="text-3xl font-bold text-blue-600">{completed.length}</div><p className="text-sm text-muted-foreground">Completed</p></div>
              <div><div className="text-3xl font-bold text-green-600">{averageScore}%</div><p className="text-sm text-muted-foreground">Average Score</p></div>
              <div><div className="text-3xl font-bold text-purple-600">{completed.length}</div><p className="text-sm text-muted-foreground">Certificates Earned</p></div>
              <div><div className="text-3xl font-bold text-orange-600">{skillAssessments.filter((a) => a.status === "available").length}</div><p className="text-sm text-muted-foreground">Available</p></div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="skills">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skills">Skill Assessments</TabsTrigger>
            <TabsTrigger value="mock">Mock Tests</TabsTrigger>
            <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
          </TabsList>

          {/* Skill Assessments Tab */}
          <TabsContent value="skills">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillAssessments.map((a) => {
                const Icon = a.icon
                return (
                  <Card key={a.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3 items-center">
                          <div className={`w-12 h-12 ${a.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="text-white h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{a.title}</CardTitle>
                            <CardDescription>{a.description}</CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(a.status, a.score)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{a.duration}</span>
                          </div>
                          <div className={getDifficultyColor(a.difficulty)}>{a.difficulty}</div>
                        </div>
                        {getSkillLevelBadge(a.skillLevel)}
                      </div>

                      {a.score && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Your Score</span>
                            <span className="font-medium">{a.score}%</span>
                          </div>
                          <Progress value={a.score} className="h-2" />
                        </div>
                      )}

                      <div className="flex gap-2">
                        {a.status === "available" && (
                          <Button className="flex-1" asChild>
                            <a href="/individual/assessment/skill-test">
                              <Play className="mr-2 h-4 w-4" /> Start
                            </a>
                          </Button>
                        )}
                        {a.status === "completed" && (
                          <>
                            <Button variant="outline" className="flex-1" asChild>
                              <a href="/individual/assessment/results">View Results</a>
                            </Button>
                            {a.retakeAvailable && (
                              <Button variant="outline"><RotateCcw className="h-4 w-4" /></Button>
                            )}
                            <Button variant="outline"><Download className="h-4 w-4" /></Button>
                          </>
                        )}
                        {a.status === "locked" && (
                          <Button variant="outline" className="flex-1" disabled>Complete Prerequisites</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Mock Tests Tab */}
          <TabsContent value="mock">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTests.map((test) => (
                <Card key={test.id}>
                  <CardHeader>
                    <CardTitle>{test.title}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-muted-foreground">Questions:</span> <div className="font-medium">{test.questions}</div></div>
                      <div><span className="text-muted-foreground">Duration:</span> <div className="font-medium">{test.duration}</div></div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>Attempts: <span className="font-medium">{test.attempts}/3</span></div>
                      {test.bestScore && <div>Best: <span className="font-medium">{test.bestScore}%</span></div>}
                    </div>

                    {test.lastAttempt && (
                      <div className="text-sm text-muted-foreground">Last attempt: {new Date(test.lastAttempt).toLocaleDateString()}</div>
                    )}

                    <Button className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      {test.attempts > 0 ? "Retake Test" : "Start Mock Test"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Feedback & Guidance
                </CardTitle>
                <CardDescription>Personalized insights to help you improve your skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Strengths */}
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Strengths Identified</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          You excel in data visualization and statistical analysis.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="p-4 border rounded-lg bg-orange-50">
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-900">Areas for Improvement</h4>
                        <p className="text-sm text-orange-700 mt-1">
                          Improve evaluation metrics and deep learning frameworks knowledge.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-green-900">Recommended Next Steps</h4>
                        <ul className="text-sm text-green-700 mt-1 space-y-1">
                          <li>• Complete the Machine Learning Fundamentals assessment</li>
                          <li>• Enroll in a Deep Learning course</li>
                          <li>• Practice on Kaggle datasets</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  Get Detailed AI Analysis
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
