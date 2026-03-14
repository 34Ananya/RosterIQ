import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Upload,
  Users,
  BrainCircuit,
  FlaskConical,
  Settings
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
    description: "Overview and recent activity"
  },
  {
    title: "Roster Upload",
    href: "/rosters/upload",
    icon: Upload,
    description: "Upload CSV/XLSX rosters"
  },
  {
    title: "Providers",
    href: "/providers",
    icon: Users,
    description: "Explore normalized provider records"
  },
  {
    title: "AI Agent",
    href: "/agent",
    icon: BrainCircuit,
    description: "Chat and structured insights"
  },
  {
    title: "Evaluations",
    href: "/evaluations",
    icon: FlaskConical,
    description: "Run fixed scenarios and score"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Workspace + preferences"
  }
];

