
import { 
  Calendar, 
  Users, 
  FileText, 
  Image, 
  Settings, 
  ShoppingCart, 
  BarChart3, 
  Upload,
  UserPlus,
  FileUp
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
    title: "Member Upload",
    url: "/admin/member-upload",
    icon: UserPlus,
  },
  {
    title: "Fan Upload",
    url: "/admin/fan-upload",
    icon: FileUp,
  },
  {
    title: "Hero Manager",
    url: "/admin/hero-manager",
    icon: Image,
  },
  {
    title: "Media Uploader",
    url: "/admin/media-uploader",
    icon: Upload,
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
