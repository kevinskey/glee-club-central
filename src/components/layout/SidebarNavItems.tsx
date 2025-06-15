
import {
  LayoutDashboard,
  ListChecks,
  Calendar,
  User2,
  Users,
  Settings,
  Package,
  Sliders,
} from "lucide-react"

import { NavItem } from "@/types"

export const SidebarNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "treasurer", "section_leader", "member"],
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: ListChecks,
    roles: ["admin", "treasurer", "section_leader", "member"],
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
    roles: ["admin", "treasurer", "section_leader", "member"],
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User2,
    roles: ["admin", "treasurer", "section_leader", "member"],
  },
  {
    title: "Members",
    href: "/members",
    icon: Users,
    roles: ["admin", "treasurer"],
  },
  {
    title: "Store",
    href: "/store",
    icon: Package,
    roles: ["admin", "treasurer", "merchandise_manager", "section_leader", "member"],
  },
  {
    title: "Slider Console",
    href: "/admin/slider-console",
    icon: Sliders,
    roles: ["admin"],
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Settings,
    roles: ["admin"],
  },
]
