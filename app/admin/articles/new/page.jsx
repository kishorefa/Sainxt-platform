"use client"

import { useState } from 'react'
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { TrendingUp, Users, Building2, BarChart3, DollarSign, Settings, Shield, FileText } from "lucide-react"

export default function NewArticlePage() {
  const [articleId, setArticleId] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('draft')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!articleId || !title || !content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/article/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          article_id: articleId,
          title,
          content,
          status
        }).toString(),
      })

      if (!response.ok) throw new Error('Failed to submit article')
      
      toast({
        title: "Success",
        description: "Article submitted successfully",
      })
      
      // Redirect to articles list
      window.location.href = '/admin/articles'
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit article",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
            <h2 className="text-2xl font-bold text-deep-navy">New Article</h2>
            <p className="text-sm text-text-gray">Create a new article</p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/admin/articles'}
          >
            Back to Articles
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="articleId">Article ID</Label>
            <Input
              id="articleId"
              value={articleId}
              onChange={(e) => setArticleId(e.target.value)}
              placeholder="Enter unique article ID"
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter article content..."
              className="min-h-[200px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-soft-gray rounded-md bg-surface-primary focus:ring-aqua-blue focus:border-aqua-blue"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">Loading...</span>
                Submitting
              </>
            ) : (
              'Submit Article'
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  )
}
