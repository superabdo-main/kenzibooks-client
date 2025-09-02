"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Crown,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/shadcn-ui/sidebar";
import * as React from "react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useManagementStore } from "@/stores/management.store";

export function UserButton({
  user,
  className,
}: {
  user: {
    name: string | undefined;
    email: string | undefined;
    avatar: string | undefined;
  };
  className?: string;
}) {
  const sidebar = useSidebar();
  const { isMobile } = sidebar;
  const t = useTranslations("UserMenu");
  const { setManagedOrganization } = useManagementStore();

  // sidebar.open is true when the sidebar is expanded, false when collapsed
  const isCompact = !sidebar.open;

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "rounded-lg transition-all",
                isCompact
                  ? "light:bg-slate-200 dark:bg-slate-800 px-2 py-2 justify-center"
                  : "light:bg-slate-200 light:hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-3",
                className
              )}
            >
              {!isCompact ? (
                <>
                  <Avatar className="h-8 w-8 rounded-md border-2 border-slate-300 dark:border-slate-700">
                    <AvatarImage src={user.avatar!} alt={user.name!} />
                    <AvatarFallback className="rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                      {user.name?.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-slate-600 dark:text-slate-400">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-slate-600 dark:text-slate-400" />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Avatar className="h-8 w-8 rounded-md border-2 border-slate-300 dark:border-slate-700">
                    <AvatarImage src={user.avatar!} alt={user.name!} />
                    <AvatarFallback className="rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                      {user.name?.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar!} alt={user.name!} />
                  <AvatarFallback className="rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                    {user.name?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles className="text-amber-500" />
                {t("upgrade")}
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="text-indigo-500" />
                {t("account")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="text-emerald-500" />
                {t("billing")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="text-amber-500" />
                {t("notifications")}
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setManagedOrganization("")}>
              <Crown className="text-blue-500" />
              {t("changeOrgnaization")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="text-red-500" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
