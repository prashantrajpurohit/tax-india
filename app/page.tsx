"use client"
import BlankLayout from "@/components/blank-layout";
import FallbackSpinner from "@/components/reusableComponents/Fallback";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()
  const auth = useAuth();

  const getHomeRoute = (role: string) => {
    if (role === "super-admin") {
      return "/dashboard"
    } else if (role === "staff") {
      return "/404"
    } else {
      return "/401"
    }
  }


  useEffect(() => {
    if (auth.user?.role) {
      router.replace(getHomeRoute(auth.user?.role?.value))
    }else{
       router.replace("/login")
    }
  }, [router, auth.user?.role?.value])

  return (
    <BlankLayout>
    <FallbackSpinner/>
    </BlankLayout>
  );
}
