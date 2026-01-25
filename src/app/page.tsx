"use client";
import BlankLayout from "@/components/blank-layout";
import FallbackSpinner from "@/components/reusableComponents/Fallback";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const auth = useAuth();

  const getHomeRoute = (role: string) => {
    if (role === "admin") {
      return "/dashboard";
    } else if (role === "staff") {
      return "/404";
    } else {
      return "/401";
    }
  };

  useEffect(() => {
    if (auth?.user?.role) {
      navigate(getHomeRoute(auth?.user?.role), { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, auth?.user?.role]);

  return (
    <BlankLayout>
      <FallbackSpinner />
    </BlankLayout>
  );
}
