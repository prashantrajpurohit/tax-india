"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAbility } from "@/hooks/use-ability";
import { MenuItem } from "@/types/types";
import { useSelector } from "react-redux";
import { StoreRootState } from "@/reduxstore/redux-store";

interface Navitems {
  items: MenuItem[];
}

export function NavMain({ items }: Navitems) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { ability } = useAbility();
  // const notificationsCount = useSelector(
  //   (state: StoreRootState) => state.data?.userdata?.user?.notificationsCount
  // );
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  const handleClick = (item: MenuItem, parentPath: string | null) => {
    navigate(item.path);
    if (!item?.path.includes(parentPath as string)) {
      setOpenCollapsible(null);
    }
  };

  const HasNoChild = (item: MenuItem) => {
    if (ability?.can("read", item.subject)) {
      const IconComponent = item.icon;
      return (
        <SidebarMenuItem>
          <SidebarMenuButton
            style={{ cursor: "pointer" }}
            onClick={() => handleClick(item, null)}
            tooltip={item.title}
            isActive={!!(item.path === pathname)}
          >
            <IconComponent />
            <span>{item.title}</span>
            {/* {item.subject == "notifications" &&
              (notificationsCount ?? 0) > 0 && (
                <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium leading-none text-red-100 bg-red-600">
                  {notificationsCount}
                </span>
              )} */}
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }
  };

  const HaveChild = (item: MenuItem) => {
    if (ability?.can("read", item.subject)) {
      const IconComponent = item.icon;
      const isOpen = openCollapsible === item.title;
      return (
        <Collapsible
          style={{ cursor: "pointer" }}
          key={item.title}
          asChild
          open={isOpen}
          onOpenChange={(open: boolean) =>
            setOpenCollapsible(open ? item.title : null)
          }
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                style={{ cursor: "pointer" }}
                isActive={pathname.includes(item.path)}
              >
                <IconComponent />
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <SidebarMenuSub className="ml-4 border-l border-sidebar-border pl-4 py-1">
                {item?.children?.map((subItem) => (
                  <SidebarMenuSubItem
                    key={subItem.title}
                    onClick={() => handleClick(subItem, item.path)}
                  >
                    <SidebarMenuSubButton
                      isActive={!!(subItem.path === pathname)}
                      className="w-full justify-start gap-3 px-2 py-1.5 h-auto text-sm hover:bg-sidebar-accent rounded-md transition-colors"
                    >
                      <subItem.icon />
                      <span className="truncate">{subItem.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {items.map((item) => (
              <Fragment key={item?.title}>
                {!!item.children?.length ? HaveChild(item) : HasNoChild(item)}
              </Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
