"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  Bookmark,
  FileSearch,
  LayoutDashboard,
  Search,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/app/sv-se/dashboard", icon: LayoutDashboard },
  { label: "Sök", href: "/app/sv-se/sok", icon: Search },
  { label: "Sparade sökningar", href: "/app/sv-se/sparade-sokningar", icon: Bookmark },
  { label: "Bevakningar", href: "/app/sv-se/bevakningar", icon: BellRing },
  { label: "Bevakade upphandlingar", href: "/app/sv-se/bevakade-upphandlingar", icon: FileSearch },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  return (
    <aside
      className={cn(
        "relative flex h-full border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width] duration-200 ease-in-out",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex h-full w-full flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-3 py-4">
          <span className={cn("text-xs font-semibold uppercase tracking-wide text-muted-foreground", collapsed && "sr-only")}>
            Navigering
          </span>
          {!isMobile && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? "Expandera sidomenyn" : "Minimera sidomenyn"}
            >
              {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2 pb-6">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const highlighted = hovered ? hovered === item.href : active;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  highlighted
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-0",
                )}
                aria-label={item.label}
                title={collapsed ? item.label : undefined}
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    highlighted
                      ? "text-accent-foreground"
                      : "text-muted-foreground group-hover:text-accent-foreground",
                  )}
                />
                <span
                  className={cn(
                    "ml-3 inline-flex whitespace-nowrap opacity-100 transition-opacity duration-150",
                    collapsed && "hidden",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
