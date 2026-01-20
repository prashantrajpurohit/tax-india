import { MenuItem } from "@/types/types";
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Users,
  Truck,
  Plus,
  Eye,
  FileText,
  Receipt,
  PlusCircle,
  Mail,
  Shield,
  DollarSign,
  File,
  Bell,
} from "lucide-react";

export const routeConfig: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    subject: "dashboard",
  },
  {
    title: "Parent",
    icon: Truck,
    subject: "parent",
    path: "/parent",
    children: [
      {
        title: "Child",
        path: "/parent/Child",
        icon: Plus,
        subject: "parent",
      },
      {
        title: "Child",
        path: "/parent/Child",
        icon: Eye,
        subject: "parent",
      },
    ],
  },

  {
    title: "Users",
    path: "/user",
    icon: Users,
    subject: "user",
  },
];
