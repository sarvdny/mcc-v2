"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDashboardStore } from "@/stores/dashboardStore";
import { FullScreenAuthLoader } from "./FullScreenAuthLoader";

export interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, authInitialized, isAuthLoading, checkAuth } =
    useDashboardStore();

  useEffect(() => {
    if (!authInitialized) {
      checkAuth();
    }
  }, [authInitialized, checkAuth]);

  const isLoginRoute = pathname === "/login";

  useEffect(() => {
    if (!authInitialized || isAuthLoading) return;
    if (!isAuthenticated && !isLoginRoute) {
      router.replace('/login');
    } else if (isAuthenticated && isLoginRoute) {
      router.replace('/');
    }
  }, [authInitialized, isAuthLoading, isAuthenticated, isLoginRoute, router]);

  // 1. Initial boot or session verification in progress
  if (!authInitialized || isAuthLoading) {
    return <FullScreenAuthLoader message="Verifying session..." />;
  }

  // 2. Unauthenticated officer attempting to access protected command routes
  if (!isAuthenticated && !isLoginRoute) {
    return <FullScreenAuthLoader message="Redirecting to login..." />;
  }

  // 3. Authenticated officer attempting to access /login route
  if (isAuthenticated && isLoginRoute) {
    return (
      <FullScreenAuthLoader
        message="Redirecting to command center..."
        subMessage="Active Government Officer Session Detected..."
      />
    );
  }

  // 4. Session resolved and route permission granted
  return <>{children}</>;
};

export default AuthGate;
