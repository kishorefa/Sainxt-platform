"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton({ variant = "ghost", className, children }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)

    // Simulate logout process
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Clear stored data
    localStorage.removeItem("jobraze-user")
    sessionStorage.removeItem("jobraze-session")

    // Redirect to login
    router.push("/auth/login")
  }

  return (
    <Button variant={variant} className={className} onClick={handleLogout} disabled={isLoggingOut}>
      {children || (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Log out"}
        </>
      )}
    </Button>
  )
}
