import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { SidebarInset, SidebarProvider } from "@/components/shadcn-ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { AppBreadcrumbs } from "@/components/breadcrumbs";

import AppHeader from "@/components/header";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { SubscriptionGuard } from "@/components/auth/SubscriptionGuard";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: `%s - Dashboard`,
  },
  description: "Dashboard",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SubscriptionGuard>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <AppBreadcrumbs />
            <div className="lg:p-10 p-2">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </SubscriptionGuard>
    </ProtectedRoute>
  );
}
