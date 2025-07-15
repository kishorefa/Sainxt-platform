"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Menu, Search, Settings, User, Moon, Sun, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { LogoutButton } from "@/components/auth/logout"

export function DashboardLayout({ children, sidebar, userRole, userName, userEmail }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const getRoleConfig = (role) => {
    switch (role) {
      case "admin":
        return {
          color: "bg-neon-coral/10 text-neon-coral border-neon-coral/20",
          gradient: "from-neon-coral to-electric-orange",
          icon: "⚡",
        }
      case "enterprise":
        return {
          color: "bg-aqua-blue/10 text-aqua-blue border-aqua-blue/20",
          gradient: "from-aqua-blue to-neon-coral",
          icon: "🏢",
        }
      default:
        return {
          color: "bg-electric-orange/10 text-electric-orange border-electric-orange/20",
          gradient: "from-electric-orange to-aqua-blue",
          icon: "🚀",
        }
    }
  }

  const getProfilePath = () => {
    switch (userRole) {
      case "admin":
        return "/admin/profile"
      case "enterprise":
        return "/enterprise/profile"
      default:
        return "/individual/profile"
    }
  }

  const getSettingsPath = () => {
    switch (userRole) {
      case "admin":
        return "/admin/settings"
      case "enterprise":
        return "/enterprise/settings"
      default:
        return "/individual/settings"
    }
  }

  const roleConfig = getRoleConfig(userRole)

  return (
    <div className="min-h-screen bg-surface-secondary relative">
      <div className="absolute inset-0 bg-ai-circuit opacity-20" />

      <header className="sticky top-0 z-50 border-b border-soft-gray/50 backdrop-blur-md bg-surface-primary/90 supports-[backdrop-filter]:bg-surface-primary/80">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Link href={`/${userRole}/dashboard`} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-deep-navy rounded-xl flex items-center justify-center relative overflow-hidden">
                <Sparkles className="h-6 w-6 text-aqua-blue" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-aqua-blue/20 to-transparent animate-data-flow" />
              </div>
              <span className="font-bold text-xl text-deep-navy">Jobraze</span>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center px-6">
            <div className="w-full max-w-sm relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-10 w-full border-soft-gray focus:border-aqua-blue focus:ring-aqua-blue/20 bg-surface-tertiary/50 backdrop-blur-sm focus-enterprise"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative hover:bg-neon-coral/10 transition-colors">
              <Bell className="h-5 w-5 text-deep-navy" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-neon-coral text-white animate-ai-pulse">
                3
              </Badge>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-aqua-blue/10 transition-colors"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-deep-navy" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-deep-navy" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-neon-coral/10 transition-colors">
                  <Avatar className="h-10 w-10 border-2 border-transparent bg-gradient-to-r from-neon-coral to-aqua-blue p-0.5">
                    <div className="w-full h-full bg-surface-primary rounded-full flex items-center justify-center">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={userName || 'User'} />
                      <AvatarFallback className="bg-gradient-to-r from-neon-coral to-aqua-blue text-white font-semibold">
                        {(() => {
                          try {
                            if (!userName || typeof userName !== 'string') return 'U';
                            return userName
                              .split(' ')
                              .filter(Boolean)
                              .map(n => n[0]?.toUpperCase() || '')
                              .join('')
                              .substring(0, 2);
                          } catch (e) {
                            return 'U';
                          }
                        })()}
                      </AvatarFallback>
                    </div>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 border-soft-gray bg-surface-primary/95 backdrop-blur-md"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium leading-none text-deep-navy">{userName}</p>
                    <p className="text-xs leading-none text-text-gray">{userEmail}</p>
                    <Badge className={`w-fit mt-1 ${roleConfig?.color || 'bg-gray-100 text-gray-800'} border`}>
                      {roleConfig?.icon && <span className="mr-1">{roleConfig.icon}</span>}
                      {userRole ? 
                        (userRole.charAt(0).toUpperCase() + userRole.slice(1)) : 
                        'User'
                      }
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-soft-gray" />
                <DropdownMenuItem asChild className="hover:bg-neon-coral/10 transition-colors">
                  <Link href={getProfilePath()}>
                    <User className="mr-2 h-4 w-4 text-deep-navy" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-aqua-blue/10 transition-colors">
                  <Link href={getSettingsPath()}>
                    <Settings className="mr-2 h-4 w-4 text-deep-navy" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-soft-gray" />
                <DropdownMenuItem asChild>
                  <LogoutButton
                    variant="ghost"
                    className="w-full justify-start cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-surface-primary/90 backdrop-blur-md border-r border-soft-gray transform transition-transform duration-200 ease-in-out
            md:relative md:translate-x-0 md:z-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex flex-col h-full pt-16 md:pt-0 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-surface-primary/50 to-surface-primary/80 pointer-events-none" />
            <div className="relative z-10">{sidebar}</div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-deep-navy/20 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] relative bg-gray-50 dark:bg-gray-900">
          <div className="flex-1 overflow-y-auto relative z-10">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </div>
          <div className="fixed top-1/4 right-4 w-32 h-32 bg-gradient-to-r from-neon-coral/20 to-aqua-blue/20 rounded-full animate-ai-pulse pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
          <div
            className="fixed bottom-1/4 left-4 w-24 h-24 bg-gradient-to-r from-aqua-blue/20 to-electric-orange/20 rounded-full animate-ai-pulse pointer-events-none mix-blend-multiply dark:mix-blend-screen"
            style={{ animationDelay: "2s" }}
          />
        </main>
      </div>
    </div>
  )
}