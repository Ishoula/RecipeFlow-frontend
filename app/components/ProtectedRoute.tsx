"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/lib/auth-store";
import { RecipeListPageSkeleton } from "@/app/components/Skeletons";

export function ProtectedRoute({
  children,
  fallback = <RecipeListPageSkeleton />,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, hasInitialized, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (hasInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [hasInitialized, isAuthenticated, router]);

  if (!hasInitialized || !isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
