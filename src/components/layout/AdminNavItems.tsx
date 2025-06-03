
import { 
  Calendar, 
  Users, 
  FileText, 
  Image, 
  Settings, 
  ShoppingCart, 
  BarChart3,
  Palette,
  Presentation
} from "lucide-react";

export const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
  },
  {
    title: "Calendar",
    url: "/admin/calendar",
    icon: Calendar,
  },
  {
    title: "Members",
    url: "/admin/members",
    icon: Users,
  },
  {
    title: "Hero Manager",
    url: "/admin/hero-manager",
    icon: Image,
  },
  {
    title: "Slide Designer",
    url: "/admin/slide-design",
    icon: Presentation,
  },
  {
    title: "Media Library",
    url: "/admin/media",
    icon: Image,
  },
  {
    title: "News Ticker",
    url: "/admin/news-ticker",
    icon: FileText,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Design Studio",
    url: "/admin/design-studio",
    icon: Palette,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Announcements",
    url: "/admin/announcements",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];
