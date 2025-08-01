"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, Printer, TrendingUp, User as UserIcon, Target, BookOpen, Settings } from "lucide-react"

function ReadinessReportContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userData] = useState({
    name: "John Doe",
    email: "john.doe@example.com"
  })
  const [reportData, setReportData] = useState({
    evaluation: {
      skill_pathway: [],
      recommendations: [],
      gap_analysis: {}
    },
    scores: {
      profile_score: 0,
      qualification_score: 0,
      skill_score: 0,
      soft_skills_score: 0,
      overall_score: 0
    }
  })

  const sidebarItems = [
    { title: "Dashboard", href: "/individual/dashboard", icon: TrendingUp },
    { title: "Profile Builder", href: "/individual/profile", icon: UserIcon },
    { title: "Skills & Experience", href: "/individual/skills", icon: Target },
    { title: "Assessments", href: "/individual/assessments", icon: BookOpen },
    { title: "Readiness Report", href: "/individual/readiness-report", icon: TrendingUp, active: true },
    { title: "Settings", href: "/individual/settings", icon: Settings },
  ]

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const mockData = {
          scores: {
            profile_score: 4.9,
            qualification_score: 3.8,
            skill_score: 5.0,
            soft_skills_score: 4.6,
            overall_score: 4.6
          },
          evaluation: {
            gap_analysis: {
              strengths: ['Strong technical skills'],
              weaknesses: ['Could enhance qualifications']
            },
            recommendations: [
              { name: 'Advanced Certifications', description: 'Pursue advanced certifications' }
            ],
            skill_pathway: [
              { skill: 'React', level: 'Intermediate' }
            ]
          }
        }
        setReportData(mockData)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load report data')
        setIsLoading(false)
      }
    }

    fetchReportData()
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="individual"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="individual"
      >
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Report</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName={userData.name}
      userEmail={userData.email}
    >
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Readiness Report</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive analysis of your skills and readiness
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(reportData.scores).map(([key, value]) => (
            <Card key={key} className="p-4">
              <CardTitle className="text-sm font-medium text-gray-500">
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </CardTitle>
              <CardDescription className="text-2xl font-bold">
                {typeof value === 'number' ? value.toFixed(1) : value}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function ReadinessReport() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    }>
      <ReadinessReportContent />
    </Suspense>
  )
}