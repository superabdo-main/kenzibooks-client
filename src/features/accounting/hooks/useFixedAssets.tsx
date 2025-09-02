"use client";

import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";
import { FixedAsset } from "@/types/fixed-assets.type";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";

interface AssetsResponse {
  data: FixedAsset[];
  isOk: boolean;
  status: number;
  error: string | null;
}

export const useFixedAssets = () => {
  const { session } = useAuth();
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);

  const { data, error, isLoading, mutate } = useSWR<AssetsResponse>(
    session?.accessToken && organizationId ? `/fixed-assets/findmany/${organizationId}` : null,
    session?.accessToken ? swrAuthenticatedFetcher(session?.accessToken!) : null,
  );

  return {
    assets: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}; 