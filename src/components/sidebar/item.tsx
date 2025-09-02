"use client";

import {
  type LucideIcon,
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn-ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn-ui/tooltip";

// Color mapping for sidebar items
const itemColors = {
  "users": {
    accent: "bg-teal-500",
    hoverAccent: "group-hover:bg-teal-600",
    textAccent: "text-teal-500",
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    dotColor: "before:bg-teal-400",
    ringColor: "group-hover:ring-teal-400"
  },
  "bank": {
    accent: "bg-orange-500",
    hoverAccent: "group-hover:bg-orange-600",
    textAccent: "text-orange-500",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    dotColor: "before:bg-orange-400",
    ringColor: "group-hover:ring-orange-400"
  }
};

export function SideBarItem({
  item,
  section = "settings"
}: {
  item: {
    name: string;
    url: string;
    icon: LucideIcon;
  };
  section?: string;
}) {
  // Get color scheme based on section with type assertion
  const colorScheme = (itemColors as Record<string, {
    accent: string;
    hoverAccent: string;
    textAccent: string;
    iconBg: string;
    dotColor: string;
    ringColor: string;
  }>)[section] || itemColors.users;

  return (
    <TooltipProvider>
      <SidebarMenu>
        <SidebarMenuItem>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton 
                asChild
                className="group relative light:hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors "
                tooltip={item.name}
              >
                <a 
                  href={item.url} 
                  className={`
                    relative 
                    before:absolute before:left-1 before:top-1/2 before:h-1.5 before:w-1.5 
                    before:rounded-full ${colorScheme.dotColor} before:-translate-y-1/2 
                    before:opacity-0 hover:before:opacity-100 before:transition-opacity
                    pl-4 group light:hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md 
                    transition-all duration-200
                  `}
                >
                  <div className={`
                    flex items-center justify-center rounded-md 
                    ${colorScheme.iconBg} p-1 transition-colors
                    group-hover:ring-1 group-hover:ring-opacity-50 ${colorScheme.ringColor}
                  `}>
                    <item.icon className={`size-4 ${colorScheme.textAccent}`} />
                  </div>
                  <span className={`
                    font-medium ${colorScheme.textAccent}
                    transition-all duration-200
                  `}>
                    {item.name}
                  </span>
                </a>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {item.name}
            </TooltipContent>
          </Tooltip>
        </SidebarMenuItem>
      </SidebarMenu>
    </TooltipProvider>
  );
}
