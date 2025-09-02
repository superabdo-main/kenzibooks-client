"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Command,
  Store,
  ClipboardList,
  Settings2,
  FileText,
  Warehouse,
  Users,
  ShoppingCart,
  HelpCircle,
  PackageIcon,
  PersonStanding,
  File,
  DollarSign,
  DollarSignIcon,
  CheckCircle,
  UserCheck,
  Receipt,
  Percent,
  UserCog,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  Banknote,
} from "lucide-react";

import { LanguageSwitcher } from "./language-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/shadcn-ui/sidebar";

import { MenuItems } from "./menu-items";

import { SideBarItem } from "./item";

import { UserButton } from "../user/user-button";

import { SidebarThemeToggle } from "./sidebar-theme-toggle";

import { useSidebar } from "@/components/shadcn-ui/sidebar";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useUserAccess } from "@/hooks/useUserAccess";

// Color schemes for different sections
const colorSchemes = {
  analytics: {
    accent: "bg-blue-500",
    hoverAccent: "group-hover:bg-blue-600",
    textAccent: "text-blue-500",
    iconBg: "bg-blue-100",
  },
  warehouse: {
    accent: "bg-emerald-500",
    hoverAccent: "group-hover:bg-emerald-600",
    textAccent: "text-emerald-500",
    iconBg: "bg-emerald-100",
  },
  procurement: {
    accent: "bg-amber-500",
    hoverAccent: "group-hover:bg-amber-600",
    textAccent: "text-amber-500",
    iconBg: "bg-amber-100",
  },
  financial: {
    accent: "bg-teal-500",
    hoverAccent: "group-hover:bg-teal-600",
    textAccent: "text-teal-500",
    iconBg: "bg-teal-100",
  },
  support: {
    accent: "bg-purple-500",
    hoverAccent: "group-hover:bg-purple-600",
    textAccent: "text-purple-500",
    iconBg: "bg-purple-100",
  },
  settings: {
    accent: "bg-gray-500",
    hoverAccent: "group-hover:bg-gray-600",
    textAccent: "text-gray-500",
    iconBg: "bg-gray-100",
  },
  sales: {
    accent: "bg-pink-500",
    hoverAccent: "group-hover:bg-pink-600",
    textAccent: "text-pink-500",
    iconBg: "bg-pink-100",
  },
  customers: {
    accent: "bg-blue-500",
    hoverAccent: "group-hover:bg-blue-600",
    textAccent: "text-blue-500",
    iconBg: "bg-blue-100",
  },
  expenses: {
    accent: "bg-red-500",
    hoverAccent: "group-hover:bg-red-600",
    textAccent: "text-red-500",
    iconBg: "bg-red-100",
  },
  payrolls: {
    accent: "bg-teal-500",
    hoverAccent: "group-hover:bg-teal-600",
    textAccent: "text-teal-500",
    iconBg: "bg-teal-100",
  },
  taxes: {
    accent: "bg-yellow-500",
    hoverAccent: "group-hover:bg-yellow-600",
    textAccent: "text-yellow-500",
    iconBg: "bg-yellow-100",
  },
  accounting: {
    accent: "bg-indigo-500",
    hoverAccent: "group-hover:bg-indigo-600",
    textAccent: "text-indigo-500",
    iconBg: "bg-indigo-100",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { managedOrganization } = useManagementStore();
  const { session } = useAuth();
  const tr_names = useTranslations("Breadcrumbs");
  const tr_labels = useTranslations("Labels");
  const tr_subscription = useTranslations("Subscription");
  const sidebar = useSidebar();
  const isCollapsed = !sidebar.open;

  // User permissions hook
  const { canView, isOrgOwner, isLoading } = useUserAccess();
  const [isClient, setIsClient] = useState(false);

  // Check subscription status
  const subscriptionExpired =
    managedOrganization?.subscription &&
    !managedOrganization.subscription.isActive;
  const isDemo = managedOrganization?.subscription?.isDemo;
  const allowAccess = !subscriptionExpired || isDemo;

  // Set isClient to true on component mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate subscription status message and color
  const getSubscriptionStatus = () => {
    if (!managedOrganization?.subscription) {
      return {
        label: tr_subscription("unknown"),
        className: "text-gray-500",
        icon: Clock,
      };
    }

    if (isDemo) {
      return {
        label: tr_subscription("demoMode"),
        className:
          "bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent",
        icon: Sparkles,
      };
    }

    if (subscriptionExpired) {
      return {
        label: tr_subscription("expired"),
        className: "text-red-500",
        icon: AlertTriangle,
      };
    }

    // Active subscription
    const expiresAt = new Date(managedOrganization.subscription.expiresAt);
    const daysLeft = Math.ceil(
      (expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      label:
        daysLeft <= 7
          ? tr_subscription("expiringIn", { days: daysLeft })
          : tr_subscription("activePlan"),
      className:
        daysLeft <= 7
          ? "text-orange-500"
          : "bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent",
      icon: daysLeft <= 7 ? Calendar : CheckCircle,
    };
  };

  const subscriptionStatus = getSubscriptionStatus();

  // Production-ready navigation data
  const data = {
    user: {
      name: session?.user?.username!,
      email: session?.user?.email!,
      avatar: undefined,
    },
    navMain: [
      {
        title: tr_labels("analytics"),
        url: "#",
        icon: BarChart3,
        isActive: true,
        colorScheme: colorSchemes.analytics,
        items: [
          {
            title: tr_names("dashboard"),
            url: "/dashboard",
            icon: BarChart3,
          },
          {
            title: tr_names("reports"),
            url: "/dashboard/reports",
            icon: FileText,
          },
        ],
      },
      {
        title: tr_labels("sales_and_revenue"),
        url: "#",
        icon: ShoppingCart,
        colorScheme: colorSchemes.sales,
        items: [
          {
            title: tr_names("sales"),
            url: "/dashboard/sales",
            icon: ShoppingCart,
          },
          {
            title: tr_names("invoices"),
            url: "/dashboard/invoices",
            icon: FileText,
          },
          {
            title: tr_names("revenue"),
            url: "/dashboard/revenue",
            icon: DollarSign,
          },
          {
            title: tr_names("credit note"),
            url: "/dashboard/credit-note",
            icon: PackageIcon,
          },
          {
            title: tr_names("estimated sale"),
            url: "/dashboard/estimated-sale",
            icon: ClipboardList,
          },
        ],
      },
      {
        title: tr_labels("purchases_and_procurement"),
        url: "#",
        icon: ShoppingCart,
        colorScheme: colorSchemes.procurement,
        items: [
          {
            title: tr_names("purchases"),
            url: "/dashboard/purchases",
            icon: ShoppingCart,
          },
          {
            title: tr_names("bills"),
            url: "/dashboard/bills",
            icon: FileText,
          },
          {
            title: tr_names("debit-notes"),
            url: "/dashboard/debit-notes",
            icon: FileText,
          },
          {
            title: tr_names("purchase-estimate"),
            url: "/dashboard/purchase-estimate",
            icon: ClipboardList,
          },
          {
            title: tr_names("suppliers"),
            url: "/dashboard/suppliers",
            icon: Users,
          },
        ],
      },
      {
        title: tr_labels("inventory_management"),
        url: "#",
        icon: PackageIcon,
        colorScheme: colorSchemes.warehouse,
        items: [
          {
            title: tr_names("products"),
            url: "/dashboard/products",
            icon: PackageIcon,
          },
          {
            title: tr_names("categories"),
            url: "/dashboard/categories",
            icon: ClipboardList,
          },
          {
            title: tr_names("warehouses"),
            url: "/dashboard/warehouses",
            icon: Warehouse,
          },
        ],
      },
      {
        title: tr_labels("customers"),
        url: "#",
        icon: Users,
        colorScheme: colorSchemes.customers,
        items: [
          {
            title: tr_names("customers"),
            url: "/dashboard/customers",
            icon: PersonStanding,
          },
        ],
      },
      {
        title: tr_labels("expenses_and_costs"),
        url: "#",
        icon: DollarSign,
        colorScheme: colorSchemes.expenses,
        items: [
          {
            title: tr_names("expenses"),
            url: "/dashboard/expenses",
            icon: DollarSignIcon,
          },
          {
            title: tr_names("running expenses"),
            url: "/dashboard/running-expenses",
            icon: CheckCircle,
          },
          {
            title: tr_names("expense categories"),
            url: "/dashboard/expense-categories",
            icon: FileText,
          },
          {
            title: tr_names("expense subcategories"),
            url: "/dashboard/expense-subcategories",
            icon: PackageIcon,
          },
        ],
      },
      {
        title: tr_labels("human_resources"),
        url: "#",
        icon: UserCheck,
        colorScheme: colorSchemes.payrolls,
        items: [
          {
            title: tr_names("employees"),
            url: "/dashboard/employees",
            icon: UserCheck,
          },
          {
            title: tr_names("payrolls"),
            url: "/dashboard/payrolls",
            icon: Receipt,
          },
        ],
      },
      {
        title: tr_labels("financial_accounting"),
        url: "#",
        icon: DollarSign,
        colorScheme: colorSchemes.accounting,
        items: [
          {
            title: tr_names("coa"),
            url: "/dashboard/coa",
            icon: DollarSign,
          },
          {
            title: tr_names("fixed-assets"),
            url: "/dashboard/fixed-assets",
            icon: DollarSign,
          },
          {
            title: tr_names("sales-taxes"),
            url: "/dashboard/sales-tax",
            icon: Percent,
          },
        ],
      },
    ],
  };

  // Only show sections when permissions are loaded
  if (!isClient || isLoading) {
    return (
      <Sidebar collapsible="icon" variant="inset" {...props}>
        <SidebarHeader className="border-b border-slate-200 dark:border-slate-800">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Loading...</span>
                  <span className="truncate text-xs bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-medium">
                    DEMO PLAN
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar>
    );
  }

  // Define sections with their feature names for permissions check
  const sections = [
    {
      id: "analytics",
      title: tr_labels("business_analytics"),
      colorClass: "border-blue-500",
      feature: "charts",
      items: [data.navMain[0]],
    },
    {
      id: "sales",
      title: tr_labels("sales_and_revenue"),
      colorClass: "border-pink-500",
      feature: "sales",
      items: [data.navMain[1]],
    },
    {
      id: "procurement",
      title: tr_labels("purchases_and_procurement"),
      colorClass: "border-amber-500",
      feature: "purchases",
      items: [data.navMain[2]],
    },
    {
      id: "inventory",
      title: tr_labels("inventory_management"),
      colorClass: "border-emerald-500",
      feature: "warehouses",
      items: [data.navMain[3]],
    },
    {
      id: "customers",
      title: tr_labels("customers"),
      colorClass: "border-blue-500",
      feature: "customers",
      items: [data.navMain[4]],
    },
    {
      id: "expenses",
      title: tr_labels("expenses_and_costs"),
      colorClass: "border-red-500",
      feature: "expenses",
      items: [data.navMain[5]],
    },
    {
      id: "hr",
      title: tr_labels("human_resources"),
      colorClass: "border-teal-500",
      feature: "payrolls",
      items: [data.navMain[6]],
    },
    {
      id: "accounting",
      title: tr_labels("financial_accounting"),
      colorClass: "border-indigo-500",
      feature: "charts",
      items: [data.navMain[7]],
    },
  ];

  // If subscription expired and not in demo mode, show restricted sidebar
  if (!allowAccess) {
    return (
      <Sidebar collapsible="icon" variant="inset" {...props}>
        <SidebarHeader className="border-b border-slate-200 dark:border-slate-800">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-md">
                  <AlertTriangle className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {managedOrganization?.name}
                  </span>
                  <span className="truncate text-xs text-red-500 font-medium flex items-center gap-1">
                    <AlertTriangle className="size-3" />
                    {tr_subscription("expired")}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="py-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mx-4">
            <h3 className="font-medium text-red-600 mb-1">
              {tr_subscription("accessRestricted")}
            </h3>
            <p className="text-sm text-red-500">
              {tr_subscription("subscriptionExpired")}
            </p>
            <div className="mt-3">
              <button className="w-full py-2 px-3 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                {tr_subscription("renewSubscription")}
              </button>
            </div>
          </div>
        </SidebarContent>

        <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 py-2">
          <UserButton user={data.user} className="mt-1" />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {managedOrganization?.name}
                </span>
                <span
                  className={`truncate text-xs font-medium flex items-center gap-1 ${subscriptionStatus.className}`}
                >
                  <subscriptionStatus.icon className="size-3" />
                  {subscriptionStatus.label}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="py-2">
        {/* Show subscription warning if it's expiring soon */}
        {managedOrganization?.subscription?.isActive &&
          !isDemo &&
          new Date(managedOrganization.subscription.expiresAt).getTime() -
            new Date().getTime() <
            7 * 24 * 60 * 60 * 1000 && (
            <div className="mx-4 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-amber-700 font-medium">
                    {tr_subscription("expiringTitle")}
                  </p>
                  <p className="text-amber-600 text-xs mt-1">
                    {tr_subscription("expiringDescription", {
                      date: new Date(
                        managedOrganization.subscription.expiresAt
                      ).toLocaleDateString(),
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

        {sections.map((section) => (
          // Only render section if user has view permission or is org owner
          // (canView(section.feature) || isOrgOwner) && (
          <div key={section.id} className="space-y-1 py-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className={`border-l-4 ${section.colorClass} pl-2`}>
                {section.title}
              </span>
            </h2>
            <MenuItems items={section.items} label={section.id} />
          </div>
          // )
        ))}

        {/* Always show the system section */}
        <div className="mt-2 space-y-1 py-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className="border-l-4 border-gray-500 pl-2">System</span>
          </h2>
          {/* Show User Management only to org owners */}
          <SideBarItem
            item={{
              name: tr_names("bank statement"),
              icon: Banknote,
              url: "/dashboard/bank-statement",
            }}
            section="bank"
          />
          {isOrgOwner && (
            <SideBarItem
              item={{
                name: tr_names("users"),
                icon: UserCog,
                url: "/dashboard/users",
              }}
              section="users"
            />
          )}
          {/* <SideBarItem
            item={{ name: tr_names("settings"), icon: Settings2, url: "#" }}
            section="settings"
          />
          <SideBarItem
            item={{ name: tr_names("help"), icon: HelpCircle, url: "#" }}
            section="help"
          /> */}
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 py-2">
        <div className="space-y-2 ">
          <SidebarMenu>
            <SidebarMenuItem>
              <LanguageSwitcher collapsed={isCollapsed} />
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarThemeToggle />
            </SidebarMenuItem>
          </SidebarMenu>

          <UserButton user={data.user} className="mt-1" />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
