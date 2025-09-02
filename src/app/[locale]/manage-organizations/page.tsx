"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Users,
  Settings,
  Plus,
  Crown,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Footer } from "@/components/landing/Footer";
import { LogoutIconButton } from "@/components/auth/logoutButton";
import { useManagementStore } from "@/stores/management.store";
import { useOrganizationsStore } from "@/stores/organizations.store";
import { getErrorMessage } from "@/lib/api";
import { useTranslations } from "next-intl";

interface Organization {
  id: string;
  name: string;
  memberCount: number;
  isOwner: boolean;
  subscription: {
    isDemo: boolean;
    isActive: boolean;
    period: number;
    expiresAt: string;
  };
  icon: string | null;
}

interface OrganizationCardProps {
  organization: Organization;
  onManage: (organization: Organization) => void;
  onSettings?: (organizationId: string) => void;
  generateColor: (name: string) => string;
  getInitials: (name: string) => string;
  index: number;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization: org,
  onManage,
  onSettings,
  generateColor,
  getInitials,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations("OrganizationManager");
  const commonT = useTranslations("Common");
  const isAdmin = org.isOwner;
  const router = useRouter();

  // Determine if organization access is allowed based on subscription status
  const subscriptionExpired = !org.subscription.isActive;
  const isDemo = org.subscription.isDemo;
  const allowAccess = !subscriptionExpired || isDemo;

  return (
    <div
      className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-white/40 transform hover:-translate-y-2 hover:scale-[1.02] animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

      <div className="relative p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-2xl shadow-lg overflow-hidden transform transition-transform duration-300 ${isHovered ? "scale-110 rotate-3" : ""}`}
              >
                {org.icon ? (
                  <img
                    src={org.icon}
                    alt={`${org.name} icon`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full ${generateColor(org.name)} flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br from-current to-transparent`}
                  >
                    {getInitials(org.name)}
                  </div>
                )}
              </div>
              {org.isOwner && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-xl mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {org.name}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm transition-all duration-300 ${
                    org.isOwner
                      ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 shadow-lg"
                      : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 shadow-lg"
                  }`}
                >
                  {org.isOwner ? t("card.ownerBadge") : t("card.memberBadge")}
                </span>
              </div>
            </div>
          </div>

          {onSettings && isAdmin && (
            <button
              onClick={() => onSettings(org.id)}
              className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-xl transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:scale-110"
              aria-label={`Settings for ${org.name}`}
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-800">
                {org.memberCount}
              </span>
              <p className="text-sm text-slate-500">
                {t("card.members", { count: org.memberCount })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            {org.subscription.isActive ? (
              <>
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">{commonT("active")}</span>
              </>
            ) : org.subscription.isDemo ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">{t("card.demo")}</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500">
                  {t("card.expired")}
                </span>
              </>
            )}
          </div>
        </div>

        {!allowAccess ? (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {t("card.subscriptionExpired")}
          </div>
        ) : null}

        <button
          onClick={() => (allowAccess ? onManage(org) : router.push("/plans"))}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform $"hover:scale-105 hover:shadow-xl" ${
            org.isOwner
              ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {allowAccess
              ? t("card.manageButton")
              : t("card.subscriptionRequired")}
            {allowAccess && <Sparkles className="w-5 h-5" />}
          </span>
        </button>

        {/* Subscription info */}
        <div className="mt-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            {allowAccess ? t("card.active") : t("card.demoMode")}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {t("card.expiredOn", {
                date: new Date(org.subscription.expiresAt).toLocaleDateString(),
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner: React.FC = () => {
  const t = useTranslations("OrganizationManager");

  return (
    <div className="flex flex-col items-center justify-center h-[400px]">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500 shadow-lg"></div>

        {/* Inner ring */}
        <div className="absolute inset-2 w-12 h-12 border-4 border-purple-200 rounded-full animate-spin border-t-purple-500 animate-reverse-spin"></div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          {t("loading")}
        </h3>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
          <span
            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></span>
          <span
            className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></span>
        </div>
      </div>
    </div>
  );
};

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  const t = useTranslations("OrganizationManager");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md border border-red-200">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <RefreshCw className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {t("error.title")}
        </h2>
        <p className="text-red-500 mb-6 leading-relaxed">{error}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
        >
          <RefreshCw className="w-5 h-5" />
          {t("error.retry")}
        </button>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ onCreateOrganization: () => void }> = ({
  onCreateOrganization,
}) => {
  const t = useTranslations("OrganizationManager");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-pink-200/30 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("emptyState.title")}
            </h2>
            <p className="text-slate-500 text-center mb-8">
              {t("emptyState.subtitle")}
            </p>
          </div>
          <LogoutIconButton />
        </div>

        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-2xl animate-fade-in">
            <div className="mb-12 relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500">
                <Building2 className="w-16 h-16 text-white" />
              </div>

              <h2 className="text-5xl font-bold text-slate-800 mb-6 leading-tight">
                {t("emptyState.heading")}
              </h2>
              <p className="text-slate-600 mb-6">
                {t("emptyState.description")}
              </p>
            </div>

            <div className="space-y-6">
              <button
                onClick={onCreateOrganization}
                className="group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-4 mx-auto relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <Plus className="w-7 h-7 relative z-10" />
                <span className="relative z-10">{t("emptyState.cta")}</span>
                <Sparkles className="w-6 h-6 relative z-10 animate-pulse" />
              </button>

              <p className="text-xs text-slate-500 text-center mt-6">
                {t("emptyState.footer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HasOwnedOrgnaization = ({
  handleCreateOrganization,
  isLoading,
}: {
  handleCreateOrganization: () => void;
  isLoading: boolean;
}) => {
  const t = useTranslations("OrganizationManager");
  const { organizations } = useOrganizationsStore();
  const check = organizations.some((org) => org.isOwner);
  if (!check && !isLoading) {
    return (
      <button
        onClick={handleCreateOrganization}
        className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        <Plus className="w-6 h-6 relative z-10" />
        <span className="relative z-10">{t("createButton")}</span>
      </button>
    );
  }
};

const OrganizationManager: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setManagedOrganization } = useManagementStore();
  const { organizations, isLoading, error, fetchOrganizations, clearError } =
    useOrganizationsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "owner" | "member">(
    "all"
  );
  const t = useTranslations("OrganizationManager");

  // Memoized utility functions to prevent unnecessary re-renders
  const utils = useMemo(
    () => ({
      generateColor: (name: string): string => {
        const colors = [
          "bg-gradient-to-br from-red-500 to-pink-500",
          "bg-gradient-to-br from-blue-500 to-cyan-500",
          "bg-gradient-to-br from-green-500 to-emerald-500",
          "bg-gradient-to-br from-yellow-500 to-orange-500",
          "bg-gradient-to-br from-purple-500 to-violet-500",
          "bg-gradient-to-br from-pink-500 to-rose-500",
          "bg-gradient-to-br from-indigo-500 to-blue-500",
          "bg-gradient-to-br from-teal-500 to-green-500",
        ];

        const hash = name
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
      },

      getInitials: (name: string): string => {
        return name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .join("")
          .substring(0, 2);
      },
    }),
    []
  );

  // Filter organizations based on search and filter
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch = org.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterType === "all" ||
        (filterType === "owner" && org.isOwner) ||
        (filterType === "member" && !org.isOwner);

      return matchesSearch && matchesFilter;
    });
  }, [organizations, searchTerm, filterType]);

  // Stable fetch function with proper dependencies
  const fetchData = useCallback(async () => {
    if (
      status === "authenticated" &&
      session?.user?.id &&
      session?.accessToken
    ) {
      try {
        await fetchOrganizations({
          userId: session.user.id,
          accessToken: session.accessToken,
        });
      } catch (err) {
        console.error("Error fetching organizations:", err);
      }
    }
  }, [status, session?.user?.id, session?.accessToken, fetchOrganizations]);

  // Effect to fetch data when session is ready
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Clear error when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);

  // Event handlers
  const handleManageOrganization = useCallback(
    (organization: Organization) => {
      setManagedOrganization(organization);
      router.push("/dashboard");
    },
    [setManagedOrganization, router]
  );

  const handleCreateOrganization = useCallback(() => {
    router.push("/manage-organizations/create");
  }, []);

  const handleOrganizationSettings = useCallback((organizationId: string) => {
    router.push(`/manage-organizations/settings?id=${organizationId}`);
  }, []);

  const handleRetry = useCallback(() => {
    clearError();
    fetchData();
  }, [clearError, fetchData]);

  // Show error state
  if (error) {
    return (
      <ErrorDisplay error={getErrorMessage(error)} onRetry={handleRetry} />
    );
  }

  // Show empty state
  if (!isLoading && organizations.length === 0) {
    return <EmptyState onCreateOrganization={handleCreateOrganization} />;
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12 flex-col lg:flex-row gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
                {t("title")}
              </h1>
              {/* <p className="text-slate-600 text-xl">{t("emptyState.cta")}</p> */}
            </div>

            <div className="flex items-center gap-4">
              <HasOwnedOrgnaization
                handleCreateOrganization={handleCreateOrganization}
                isLoading={isLoading}
              />
              <LogoutIconButton />
            </div>
          </div>

          {/* Search and Filter Bar */}
          {!isLoading && organizations.length > 0 && (
            <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t("filters.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-black"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-slate-500" />
                  <select
                    value={filterType}
                    onChange={(e) =>
                      setFilterType(
                        e.target.value as "all" | "owner" | "member"
                      )
                    }
                    className="text-black px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="all" className="text-black">
                      All Organizations
                    </option>
                    <option value="owner" className="text-black">
                      Owned by Me
                    </option>
                    <option value="member" className="text-black">
                      Member
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {filteredOrganizations.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredOrganizations.map((org, index) => (
                    <OrganizationCard
                      key={org.id}
                      organization={org}
                      onManage={handleManageOrganization}
                      onSettings={handleOrganizationSettings}
                      generateColor={utils.generateColor}
                      getInitials={utils.getInitials}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-600 mb-2">
                    No organizations found
                  </h3>
                  <p className="text-slate-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="h-[400px]" />
      <Footer />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(3deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-3deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }

        @keyframes reverse-spin {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .animate-reverse-spin {
          animation: reverse-spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default OrganizationManager;
