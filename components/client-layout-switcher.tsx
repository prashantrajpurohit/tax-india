"use client";
import { AbilityProvider, defaultACLObj } from "@/config/contexts/acl-context";
import { AuthProvider } from "@/config/contexts/auth-context";
import BlankLayout from "@/components/blank-layout";
import UserLayout from "@/components/user-layout";
import { routeConfig } from "@/navigation/navigation";
import { ACLObj } from "@/types/types";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import RouteProgress from "./route-progress";
import { Toaster } from "../ui/sonner";
import { useSelector } from "react-redux";
import { StoreRootState } from "@/reduxstore/redux-store";

export default function ClientLayoutSwitcher({
  children,
}: {
  children: React.ReactNode;
}) {
  const ROLE = useSelector(
    (state: StoreRootState) => state?.data?.userdata?.user?.role?.value
  );
  const pathname = usePathname();
  const config = useMemo(() => {
    return routeConfig.find((item: any) => pathname.startsWith(item.path)) as
      | ACLObj
      | undefined;
  }, [pathname, ROLE]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 10,
          },
        },
      })
  );

  const aclConfig = config ?? defaultACLObj;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AbilityProvider aclAbilities={aclConfig}>
          <RouteProgress />
          {!!config ? (
            <UserLayout>{children}</UserLayout>
          ) : (
            <BlankLayout>{children}</BlankLayout>
          )}
          <Toaster closeButton position="top-right" richColors />
        </AbilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
