"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useManagementStore } from "@/stores/management.store";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { swrAuthenticatedFetcher } from "@/lib/swrFetcher";

interface SubscriptionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface SubscriptionResponse {
  id: string;
  name: string;
  isOwner: boolean;
  subscription: {
    isDemo: boolean;
    isActive: boolean;
    period: number;
    expiresAt: string;
  };
}

export const SubscriptionGuard = ({
  children,
  fallback,
}: SubscriptionGuardProps) => {
  const router = useRouter();
  const t = useTranslations("Subscription");
  const { data: session, status } = useSession();
  const { managedOrganization, setManagedOrganization } = useManagementStore();

  // Fetch subscription data using useSWR
  const {
    data: subscriptionData,
    error: subscriptionError,
    isLoading,
    mutate,
  } = useSWR<SubscriptionResponse>(
    managedOrganization && session?.accessToken && session?.user?.id
      ? `/organization/subscription/${managedOrganization.id}/${session.user.id}`
      : null,
    session?.accessToken ? swrAuthenticatedFetcher(session.accessToken) : null,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      onSuccess: (data) => {
        if (data) {
          // Update the organization in store with fresh subscription data
          if (managedOrganization) {
            setManagedOrganization({
              ...managedOrganization,
              subscription: data.subscription,
              isOwner: data.isOwner,
            });
          }
        }
      },
    }
  );

  // Get subscription status from latest data or current stored data
  const subscription =
    subscriptionData?.subscription || managedOrganization?.subscription;
  const subscriptionExpired = subscription && !subscription.isActive;
  const isDemo = subscription?.isDemo;
  const allowAccess = !subscriptionExpired || isDemo;

  useEffect(() => {
    // If no organization is selected, redirect to organization selection
    if (!managedOrganization && status !== "loading") {
      router.push("/manage-organizations");
      return;
    }

    // If subscription is expired and not in demo mode, redirect to subscription page
    if (subscription && subscriptionExpired && !isDemo) {
      // For now, we'll redirect to organization management
      router.push("/manage-organizations");
    }
  }, [
    managedOrganization,
    subscriptionExpired,
    isDemo,
    router,
    status,
    subscription,
  ]);

  // Loading state when there's no organization data yet or we're loading session
  if (!managedOrganization || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-10 h-10 text-blue-600">
            <RefreshCcw />
          </div>
          <p className="mt-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  // Show fallback or default expired subscription message
  if (!allowAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-center text-red-600">
            {t("accessRestricted")}
          </h2>
          <p className="mb-6 text-gray-600 text-center">
            {t("subscriptionExpired")}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/manage-organizations")}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              {t("backToOrganizations")}
            </button>

            <button
              onClick={() => mutate()} // Manually refresh subscription data
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              {t("refreshSubscription")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
