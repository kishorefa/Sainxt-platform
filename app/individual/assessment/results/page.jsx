"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Download,
  Star,
  CheckCircle,
  ArrowRight,
  Brain,
  Trophy,
  Users,
  BarChart3,
  Lightbulb,
  MapPin,
  Clock,
} from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: TrendingUp },
  { title: "Profile Builder", href: "/individual/profile", icon: User },
  { title: "Skills & Experience", href: "/individual/skills", icon: Target },
  { title: "Assessments", href: "/individual/assessments", icon: BookOpen },
  { title: "Certificates", href: "/individual/certificates", icon: Award },
  { title: "Training Programs", href: "/individual/training", icon: BookOpen, badge: "New" },
  { title: "Internships", href: "/individual/internships", icon: Briefcase },
]

// Mock assessment results
const assessmentResults = {
  overallScore: 78,
  skillLevel: "intermediate", // beginner, intermediate, expert
  mcqScore: 80,
  codingScore: 75,
  completedAt: "2024-01-20T10:30:00Z",
  timeSpent: "38 minutes",
  categoryScores: [
    { category: "Machine Learning Fundamentals", score: 85, maxScore: 100 },
    { category: "Data Processing", score: 75, maxScore: 100 },
    { category: "Model Evaluation", score: 70, maxScore: 100 },
    { category: "Tools & Libraries", score: 80, maxScore: 100 },
    { category: "Problem Solving", score: 75, maxScore: 100 },
  ],
  strengths: [
    "Strong understanding of ML fundamentals",
    "Good grasp of Python programming",
    "Solid knowledge of data structures",
  ],
  improvements: ["Model evaluation techniques", "Advanced algorithms implementation", "Statistical analysis methods"],
}

const skillLevelConfig = {
  beginner: {
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: "🟢",
    title: "Beginner",
    description: "You're just starting your AI/ML journey",
    range: "0-40%",
  },
  intermediate: {
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: "🟡",
    title: "Intermediate",
    description: "You have a solid foundation in AI/ML concepts",
    range: "41-80%",
  },
  expert: {
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: "🔴",
    title: "Expert",
    description: "You have advanced knowledge and skills",
    range: "81-100%",
  },
}

const recommendations = {
  beginner: {
    programs: [
      {
        title: "AI 101 Fundamentals",
        description: "Start with the basics of artificial intelligence",
        duration: "4 weeks",
        level: "Beginner",
        type: "Course",
        action: "Enroll Now",
        featured: true,
      },
      {
        title: "Python for AI",
        description: "Learn Python programming for AI applications",
        duration: "3 weeks",
        level: "Beginner",
        type: "Course",
        action: "Enroll Now",
        featured: false,
      },
    ],
    nextSteps: [
      "Complete AI 101 Fundamentals course",
      "Practice with basic Python exercises",
      "Join beginner study groups",
      "Read introductory AI/ML books",
    ],
  },
  intermediate: {
    programs: [
      {
        title: "Machine Learning Level 1",
        description: "Dive deeper into machine learning algorithms",
        duration: "6 weeks",
        level: "Intermediate",
        type: "Training",
        action: "Register Now",
        featured: true,
      },
      {
        title: "Data Science Bootcamp",
        description: "Comprehensive data science training program",
        duration: "8 weeks",
        level: "Intermediate",
        type: "Bootcamp",
        action: "Apply Now",
        featured: false,
      },
    ],
    nextSteps: [
      "Register for ML Level 1 training",
      "Work on real-world projects",
      "Join intermediate communities",
      "Start building a portfolio",
    ],
  },
  expert: {
    programs: [
      {
        title: "Advanced AI Research",
        description: "Cutting-edge AI research and development",
        duration: "12 weeks",
        level: "Expert",
        type: "Research",
        action: "Apply Now",
        featured: true,
      },
      {
        title: "Mentor Program",
        description: "Mentor junior developers and students",
        duration: "Ongoing",
        level: "Expert",
        type: "Mentoring",
        action: "Join Now",
        featured: false,
      },
    ],
    nextSteps: [
      "Apply for research positions",
      "Lead AI/ML projects",
      "Mentor junior developers",
      "Contribute to open source",
    ],
  },
}

const learningRoadmap = {
  beginner: [
    {
      phase: "Foundation",
      duration: "1-2 months",
      topics: ["Python Basics", "Math Fundamentals", "AI Overview"],
      status: "current",
    },
    {
      phase: "Core Concepts",
      duration: "2-3 months",
      topics: ["Machine Learning Basics", "Data Processing", "Simple Algorithms"],
      status: "upcoming",
    },
    {
      phase: "Practical Application",
      duration: "2-3 months",
      topics: ["Project Work", "Tool Mastery", "Portfolio Building"],
      status: "upcoming",
    },
  ],
  intermediate: [
    {
      phase: "Advanced Algorithms",
      duration: "2-3 months",
      topics: ["Deep Learning", "Neural Networks", "Advanced ML"],
      status: "current",
    },
    {
      phase: "Specialization",
      duration: "3-4 months",
      topics: ["Computer Vision", "NLP", "Reinforcement Learning"],
      status: "upcoming",
    },
    {
      phase: "Professional Development",
      duration: "3-4 months",
      topics: ["Industry Projects", "Research", "Leadership"],
      status: "upcoming",
    },
  ],
  expert: [
    {
      phase: "Research & Innovation",
      duration: "Ongoing",
      topics: ["Cutting-edge Research", "Novel Algorithms", "Publications"],
      status: "current",
    },
    {
      phase: "Leadership",
      duration: "Ongoing",
      topics: ["Team Leadership", "Mentoring", "Strategic Planning"],
      status: "current",
    },
    {
      phase: "Industry Impact",
      duration: "Ongoing",
      topics: ["Consulting", "Speaking", "Open Source Contributions"],
      status: "upcoming",
    },
  ],
}

export default function AssessmentResultsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const currentLevel = assessmentResults.skillLevel // ✅ Fixed line
  const levelConfig = skillLevelConfig[currentLevel]
  const currentRecommendations = recommendations[currentLevel]
  const currentRoadmap = learningRoadmap[currentLevel]

  return (
        <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName="John Doe"
      userEmail="john@example.com"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/individual">Individual</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/individual/assessments">Assessments</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Assessment Results</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Assessment Complete!</h1>
            <p className="text-muted-foreground">Great job! Here are your personalized results and recommendations.</p>
          </div>
        </div>

        {/* Skill Level Card */}
        <Card className={`border-l-4 ${levelConfig.borderColor} ${levelConfig.bgColor}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{levelConfig.icon}</div>
                <div>
                  <h2 className={`text-2xl font-bold ${levelConfig.textColor}`}>{levelConfig.title}</h2>
                  <p className="text-muted-foreground">{levelConfig.description}</p>
                  <Badge variant="outline" className="mt-1">
                    Score: {assessmentResults.overallScore}% ({levelConfig.range})
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - assessmentResults.overallScore / 100)}`}
                      className={levelConfig.textColor}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">{assessmentResults.overallScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="roadmap">Learning Roadmap</TabsTrigger>
            <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Assessment Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Assessment Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Time Spent</span>
                    <span className="text-sm font-medium">{assessmentResults.timeSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">
                      {new Date(assessmentResults.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>MCQ Questions</span>
                      <span className="font-medium">{assessmentResults.mcqScore}%</span>
                    </div>
                    <Progress value={assessmentResults.mcqScore} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Coding Challenge</span>
                      <span className="font-medium">{assessmentResults.codingScore}%</span>
                    </div>
                    <Progress value={assessmentResults.codingScore} className="h-2" />
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium">Overall Score</span>
                      <span className="font-bold text-lg">{assessmentResults.overallScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Unlocked Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentRecommendations.programs.slice(0, 2).map((program, index) => (
                    <Button
                      key={index}
                      variant={program.featured ? "default" : "outline"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      {program.featured && <Star className="mr-2 h-4 w-4" />}
                      {program.action}
                    </Button>
                  ))}
                  <Button variant="outline" className="w-full" size="sm">
                    <MapPin className="mr-2 h-4 w-4" />
                    View Learning Roadmap
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Category Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
                <CardDescription>Detailed breakdown of your performance across different topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessmentResults.categoryScores.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-sm font-medium">{category.score}%</span>
                      </div>
                      <Progress value={category.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recommended Programs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Recommended Programs
                  </CardTitle>
                  <CardDescription>Programs tailored to your {levelConfig.title.toLowerCase()} level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentRecommendations.programs.map((program, index) => (
                    <Card key={index} className={program.featured ? "border-blue-500 bg-blue-50" : ""}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{program.title}</h4>
                              {program.featured && <Badge className="bg-blue-100 text-blue-800">Recommended</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{program.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{program.duration}</span>
                              </div>
                              <Badge variant="outline">{program.level}</Badge>
                              <Badge variant="secondary">{program.type}</Badge>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full mt-4" variant={program.featured ? "default" : "outline"}>
                          {program.action}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    Recommended Next Steps
                  </CardTitle>
                  <CardDescription>Actions to accelerate your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentRecommendations.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-700">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  Your Learning Roadmap
                </CardTitle>
                <CardDescription>
                  A personalized learning path based on your {levelConfig.title.toLowerCase()} level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentRoadmap.map((phase, index) => (
                    <div key={index} className="relative">
                      {index < currentRoadmap.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                      )}
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            phase.status === "current"
                              ? "bg-blue-500 text-white"
                              : phase.status === "completed"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {phase.status === "completed" ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <span className="font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{phase.phase}</h3>
                            {phase.status === "current" && <Badge>Current Phase</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">Duration: {phase.duration}</p>
                          <div className="flex flex-wrap gap-2">
                            {phase.topics.map((topic, topicIndex) => (
                              <Badge key={topicIndex} variant="outline">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6">
                  Start Learning Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-green-500" />
                    Your Strengths
                  </CardTitle>
                  <CardDescription>Areas where you performed well</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assessmentResults.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-orange-500" />
                    Areas for Improvement
                  </CardTitle>
                  <CardDescription>Focus areas to enhance your skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assessmentResults.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <Target className="h-5 w-5 text-orange-600" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>Personalized insights based on your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Learning Strategy</h4>
                    <p className="text-sm text-blue-700">
                      Based on your {levelConfig.title.toLowerCase()} level, we recommend focusing on hands-on projects
                      while strengthening your theoretical foundation. Your strong performance in fundamentals suggests
                      you're ready for more advanced topics.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Career Path Suggestion</h4>
                    <p className="text-sm text-purple-700">
                      Consider specializing in machine learning engineering or data science roles. Your coding skills
                      and conceptual understanding make you well-suited for technical implementation roles.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Study Plan</h4>
                    <p className="text-sm text-green-700">
                      Dedicate 2-3 hours per week to structured learning, with 60% practical projects and 40% theory.
                      Join study groups and participate in coding challenges to accelerate your progress.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="flex-1 sm:flex-none">
                <BookOpen className="mr-2 h-5 w-5" />
                Start Recommended Program
              </Button>
              <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                <Users className="mr-2 h-5 w-5" />
                Join Study Group
              </Button>
              <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                <Download className="mr-2 h-5 w-5" />
                Download Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
