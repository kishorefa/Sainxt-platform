"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, Sparkles } from "lucide-react";

export function SidebarNav({ items }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-neon-coral to-aqua-blue rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-deep-navy">Navigation</h2>
            <p className="text-xs text-text-gray">Your command center</p>
          </div>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 px-4 transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-neon-coral/10 to-aqua-blue/10 text-deep-navy border border-neon-coral/20 shadow-enterprise"
                      : "hover:bg-gradient-to-r hover:from-neon-coral/5 hover:to-aqua-blue/5 text-text-gray hover:text-deep-navy"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-coral to-aqua-blue rounded-r-full" />
                  )}

                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-neon-coral to-aqua-blue text-white shadow-lg"
                        : "bg-deep-navy/5 text-deep-navy/60 group-hover:bg-gradient-to-r group-hover:from-neon-coral/20 group-hover:to-aqua-blue/20 group-hover:text-deep-navy"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="flex-1 text-left font-medium">
                    {item.title}
                  </span>

                  {item.badge && (
                    <Badge className="ml-2 bg-electric-orange text-white text-xs animate-ai-pulse">
                      {item.badge}
                    </Badge>
                  )}

                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-neon-coral" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
