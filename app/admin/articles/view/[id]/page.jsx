"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Pencil, Trash2, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { TrendingUp, Users, Building2, BarChart3, DollarSign, Settings, Shield, FileText } from "lucide-react"

export default function ArticleViewPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const sidebarItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: TrendingUp },
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Enterprise Accounts", href: "/admin/enterprises", icon: Building2 },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { title: "Pricing & Plans", href: "/admin/pricing", icon: DollarSign },
    { title: "System Settings", href: "/admin/settings", icon: Settings },
    { title: "Security", href: "/admin/security", icon: Shield },
    { title: "Articles", href: "/admin/articles", icon: FileText, active: true },
  ]

  useEffect(() => {
    fetchArticle()
  }, [])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/article/${params.id}`)
      if (!response.ok) throw new Error('Article not found')
      const data = await response.json()
      setArticle(data.article)
    } catch (error) {
      setError(error.message)
      toast({
        title: "Error",
        description: "Failed to fetch article",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="admin"
        userName="Admin User"
        userEmail="admin@sainxt.com"
      >
        <div className="p-6">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-coral"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="admin"
        userName="Admin User"
        userEmail="admin@sainxt.com"
      >
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-deep-navy">Error</h2>
            <p className="text-text-gray">{error}</p>
            <Button
              onClick={() => router.push('/admin/articles')}
              className="mt-4"
            >
              Back to Articles
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="admin"
      userName="Admin User"
      userEmail="admin@sainxt.com"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-deep-navy">View Article</h2>
            <p className="text-sm text-text-gray">Preview and manage article content</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/articles/edit/${params.id}`)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`/articles/${article.article_id}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Live
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{article.title}</CardTitle>
              <Badge
                className={`px-2 py-1 ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
              >
                {article.status}
              </Badge>
            </div>
            <CardDescription>
              Created by {article.author} on {new Date(article.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
