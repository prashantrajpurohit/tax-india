"use client";
import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/sidebar";
import { routeConfig } from "@/navigation/navigation";
import { Separator } from "@/ui/separator";
import { useSelector } from "react-redux";
import { StoreRootState } from "@/reduxstore/redux-store";

const data = {
  user: {
    name: "aakash",
    email: "aakash@example.com",
    avatar: "",
  },
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: routeConfig,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const role = useSelector(
    (state: StoreRootState) => state?.data?.userdata?.user?.role,
  );
  const roleValue = typeof role === "string" ? role : role?.value;
  const isRetailer = roleValue === "retailer";
  const retailerAllowedPaths = new Set([
    "/dashboard",
    "/profile",
    "/itr-application",
    "/pan-application",
    "/gst-application",
    "/credit-card-application",
    "/print-pvc",
    "/aadhar-change",
    "/download-voter-card",
    "/find-pan-card",
    "/find-aadhar-card",
    "/ledger-users",
    "/fund-request",
    "/change-password",
  ]);
  const navMain = isRetailer
    ? data.navMain.filter((item) => retailerAllowedPaths.has(item.path))
    : data.navMain;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <span className="w-full flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="logo"
                  className="h-10 w-auto object-contain group-data-[collapsible=icon]:h-8"
                />
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
