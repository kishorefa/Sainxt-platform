'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { 
  TrendingUp, 
  Briefcase, 
  Users, 
  Calendar, 
  UserCheck, 
  Building2, 
  Settings as SettingsIcon,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import JDForm from "@/components/enterprise/jd-interview/JDForm"

// Define sidebar items for the enterprise section
const sidebarItems = [
  { title: "Dashboard", href: "/enterprise/dashboard", icon: TrendingUp },
  { title: "Job Listings", href: "/enterprise/jobs", icon: Briefcase },
  { title: "Candidates", href: "/enterprise/candidates", icon: Users },
  { title: "Interviews", href: "/enterprise/interviews", icon: Calendar },
  { title: "Analytics", href: "/enterprise/analytics", icon: TrendingUp },
  { title: "JD Interview", href: "/enterprise/jd-interview", icon: UserCheck },
  { title: "AI Review", href: "/enterprise/ai-review", icon: Calendar },
  { title: "Settings", href: "/enterprise/settings", icon: Building2 },
];

export default function JDInterviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [isDevMode, setIsDevMode] = useState(process.env.NODE_ENV === 'development');
  
  // In development, use the Vite dev server, in production use the built files
  const iframeSrc = isDevMode 
    ? 'http://localhost:5173/dashboard' 
    : '/interview';

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="enterprise"
      userName="Interview User"
      userEmail="interview@example.com"
    >
      <div className="flex flex-col h-full">
        
        
        <div className="flex-1 p-6 pt-4">
          <div className="bg-white rounded-lg shadow h-full overflow-hidden">
          
<JDForm/>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
