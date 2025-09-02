"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@heroui/react";
import { useManagementStore } from "@/stores/management.store";

export default function ProtectedRoute({
  children,
  //   requireAdmin = false,
}: {
  children: React.ReactNode;
  //   requireAdmin?: boolean;
}) {
  const { status } = useAuth();
  const router = useRouter();
  const { managedOrganization } = useManagementStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return; // Keep loading state while auth is still loading
    }

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      // Check if managedOrganization is properly initialized
      if (!managedOrganization || managedOrganization === undefined) {
        router.push("/manage-organizations");
        return;
      }
      // Only set loading to false when everything is properly initialized
      setLoading(false);
    }
  }, [status, managedOrganization, router]);

  // Show loading while auth is loading OR while we're checking organization
  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner
          variant="wave"
          color="warning"
          className="h-12 w-12"
          label="Loading..."
        />
      </div>
    );
  }

  // Don't render children if we're about to redirect
  if (status === "unauthenticated" || 
      (status === "authenticated" && (!managedOrganization || managedOrganization === undefined))) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner
          variant="wave"
          color="warning"
          className="h-12 w-12"
          label="Redirecting..."
        />
      </div>
    );
  }

  return <>{children}</>;
}