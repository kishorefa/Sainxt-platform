"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { useAuth } from "@/components/providers/custom_auth-provider"

const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: Clock },
  { title: "Profile Builder", href: "/individual/profile", icon: FileText },
  { title: "AI101", href: "/individual/introductory-training", icon: BookOpen },
  { title: "Thought Leadership", href: "/individual/thought-leadership", icon: BookOpen, active: true },
  { title: "View Jobs", href: "/individual/jobs", icon: BookOpen },
]

const ThoughtLeadershipArticlePage = ({ params }) => {
  const router = useRouter()
  const { user, setUser } = useAuth()
  const [articleContent, setArticleContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const articleId = params.articleId

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/article/get-content/${articleId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch article')
        }
        const article = await response.json()
        setArticleContent(article.content)
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [articleId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neon-coral border-t-transparent" />
      </div>
    )
  }

  return (
    <DashboardLayout
      title="Thought Leadership Article"
      description="Read the full article"
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName={user?.name || 'User'}
      userEmail={user?.email || ''}
      className="!p-0 bg-gradient-to-b from-deep-navy/5 to-white"
    >
      <div className="space-y-8 p-8">
        <Button
          variant="outline"
          className="mb-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Button>
        
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-4">
              {article?.title || "Article Title"}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: articleContent || "" }} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default ThoughtLeadershipArticlePage
