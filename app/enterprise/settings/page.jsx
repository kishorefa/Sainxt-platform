"use client" // Enables React Server Components to use client-side features like hooks

// Import necessary hooks and UI components
import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Settings,
  CreditCard,
  UserPlus
} from "lucide-react"

// Define items for the sidebar navigation
const sidebarItems = [
  { title: "Dashboard", href: "/enterprise/dashboard", icon: TrendingUp },
  { title: "Job Listings", href: "/enterprise/jobs", icon: Briefcase },
  { title: "Candidates", href: "/enterprise/candidates", icon: Users },
  { title: "Interviews", href: "/enterprise/interviews", icon: Calendar },
  { title: "Analytics", href: "/enterprise/analytics", icon: TrendingUp },
  { title: "Settings", href: "/enterprise/settings", icon: Settings },
]

// Component for enterprise settings page
export default function EnterpriseSettings() {
  // State to hold various company settings
  const [settings, setSettings] = useState({
    theme: "system",
    language: "english",
    emailNotifications: true,
    jobAlerts: true,
    candidateUpdates: true,
    marketingEmails: false,
    twoFactorAuth: true,
    currentPlan: "business",
  })

  // Generic handler to update settings
 const handleSettingChange = (key, value) => {
  setSettings({
    ...settings,
    [key]: value,
  })
}

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />} // Sidebar for navigation
      userRole="enterprise"                         // Role for context if needed
      userName="Jane Smith"                         // Displayed user info
      userEmail="jane@acmecorp.com"
    >
      {/* Main content container */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-3xl font-bold">Company Settings</h1>
          <p className="text-muted-foreground">
            Manage your organization's preferences and account settings
          </p>
        </div>

        {/* Subscription & Billing Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription & Billing
            </CardTitle>
            <CardDescription>
              Manage your subscription plan and billing information
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Plan Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Plan Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="currentPlan">Current Plan</Label>
                <Select
                  value={settings.currentPlan}
                  onValueChange={(value) => handleSettingChange("currentPlan", value)}
                >
                  <SelectTrigger id="currentPlan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter ($99/month)</SelectItem>
                    <SelectItem value="business">Business ($299/month)</SelectItem>
                    <SelectItem value="enterprise">Enterprise ($999/month)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Your current subscription plan
                </p>
              </div>

              {/* Billing button */}
              <div className="flex items-end">
                <Button>Manage Billing</Button>
              </div>
            </div>

            {/* Plan Features Info Box */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Business Plan Features</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Up to 25 active job postings</li>
                <li>• Advanced candidate filtering</li>
                <li>• AI-powered candidate matching</li>
                <li>• Interview scheduling tools</li>
                <li>• 5 admin users</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Team Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Team Management
            </CardTitle>
            <CardDescription>
              Manage team members and their permissions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* You can list and manage team members here */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Recruiter</p>
                </div>
                <Button variant="outline" size="sm">
                  Edit Access
                </Button>
              </div>

              {/* Add more team members in a similar block */}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
