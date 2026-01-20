"use client";

import * as React from "react";
import {
  Home,
  User,
  FolderOpen,
  GraduationCap,
  FileText,
  Gamepad2,
} from "lucide-react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useScrollSection } from "@/hooks";
import { NAV_ITEMS } from "@/data";

const ICON_MAP: Record<string, React.ReactNode> = {
  hero: <Home className="h-5 w-5" />,
  about: <User className="h-5 w-5" />,
  projects: <FolderOpen className="h-5 w-5" />,
  education: <GraduationCap className="h-5 w-5" />,
  blogs: <FileText className="h-5 w-5" />,
  fun: <Gamepad2 className="h-5 w-5" />,
};

export function Navigation() {
  const sectionIds = NAV_ITEMS.map((item) => item.href);
  const activeSection = useScrollSection(sectionIds);

  const dockItems = NAV_ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    icon: ICON_MAP[item.id],
    href: item.href,
    isActive: activeSection === item.href,
  }));

  return (
    <>
      <FloatingDock items={dockItems} />
      <ThemeToggleFixed />
    </>
  );
}

function ThemeToggleFixed() {
  return (
    <div className="fixed right-4 top-4 z-50 md:right-6 md:top-6">
      <ThemeToggle />
    </div>
  );
}
