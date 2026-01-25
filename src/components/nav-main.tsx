"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/sidebar";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAbility } from "@/hooks/use-ability";
import { MenuItem } from "@/types/types";
import { Separator } from "@/ui/separator";

interface Navitems {
  items: MenuItem[];
}

export function NavMain({ items }: Navitems) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { ability } = useAbility();

  const renderMenuItem = (item: MenuItem, isLast: boolean) => {
    if (!ability?.can("read", item.subject)) return null;

    const IconComponent = item.icon;
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          onClick={() => navigate(item.path)}
          tooltip={item.title}
          isActive={pathname === item.path}
        >
          <IconComponent />
          <span>{item.title}</span>
        </SidebarMenuButton>
        {!isLast && <Separator className="mt-2" />}
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="gap-2 py-1">
          {items.map((item, index) => (
            <Fragment key={item.title}>
              {renderMenuItem(item, index === items.length - 1)}
            </Fragment>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
