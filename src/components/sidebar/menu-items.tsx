"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn-ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/shadcn-ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn-ui/tooltip";

// Color mapping based on section labels
const sectionColors = {
  analytics: {
    accent: "bg-blue-500",
    hoverAccent: "group-hover:bg-blue-600",
    textAccent: "text-blue-500",
    iconBg: "bg-blue-100",
    dotColor: "before:bg-blue-400",
  },
  "Business Analytics": {
    accent: "bg-blue-500",
    hoverAccent: "group-hover:bg-blue-600",
    textAccent: "text-blue-500",
    iconBg: "bg-blue-100",
    dotColor: "before:bg-blue-400",
  },
  products: {
    accent: "bg-emerald-500",
    hoverAccent: "group-hover:bg-emerald-600",
    textAccent: "text-emerald-500",
    iconBg: "bg-emerald-100",
    dotColor: "before:bg-emerald-400",
  },
  "Warehouse Management": {
    accent: "bg-emerald-500",
    hoverAccent: "group-hover:bg-emerald-600",
    textAccent: "text-emerald-500",
    iconBg: "bg-emerald-100",
    dotColor: "before:bg-emerald-400",
  },
  procurement: {
    accent: "bg-amber-500",
    hoverAccent: "group-hover:bg-amber-600",
    textAccent: "text-amber-500",
    iconBg: "bg-amber-100",
    dotColor: "before:bg-amber-400",
  },
  "Procurement Management": {
    accent: "bg-amber-500",
    hoverAccent: "group-hover:bg-amber-600",
    textAccent: "text-amber-500",
    iconBg: "bg-amber-100",
    dotColor: "before:bg-amber-400",
  },
  inventory: {
    accent: "bg-emerald-500",
    hoverAccent: "group-hover:bg-emerald-600",
    textAccent: "text-emerald-500",
    iconBg: "bg-emerald-100",
    dotColor: "before:bg-emerald-400",
  },
  vendors: {
    accent: "bg-amber-500",
    hoverAccent: "group-hover:bg-amber-600",
    textAccent: "text-amber-500",
    iconBg: "bg-amber-100",
    dotColor: "before:bg-amber-400",
  },
  documentation: {
    accent: "bg-purple-500",
    hoverAccent: "group-hover:bg-purple-600",
    textAccent: "text-purple-500",
    iconBg: "bg-purple-100",
    dotColor: "before:bg-purple-400",
  },
  "Support Resources": {
    accent: "bg-purple-500",
    hoverAccent: "group-hover:bg-purple-600",
    textAccent: "text-purple-500",
    iconBg: "bg-purple-100",
    dotColor: "before:bg-purple-400",
  },
  settings: {
    accent: "bg-gray-500",
    hoverAccent: "group-hover:bg-gray-600",
    textAccent: "text-gray-500",
    iconBg: "bg-gray-100",
    dotColor: "before:bg-gray-400",
  },
  sales: {
    accent: "bg-pink-500",
    hoverAccent: "group-hover:bg-pink-600",
    textAccent: "text-pink-500",
    iconBg: "bg-pink-100",
    dotColor: "before:bg-pink-400",
  },
  customers: {
    accent: "bg-blue-500",
    hoverAccent: "group-hover:bg-blue-600",
    textAccent: "text-blue-500",
    iconBg: "bg-blue-100",
    dotColor: "before:bg-blue-400",
  },
  expenses: {
    accent: "bg-red-500",
    hoverAccent: "group-hover:bg-red-600",
    textAccent: "text-red-500",
    iconBg: "bg-red-100",
    dotColor: "before:bg-red-400",
  },
  hr: {
    accent: "bg-teal-500",
    hoverAccent: "group-hover:bg-teal-600",
    textAccent: "text-teal-500",
    iconBg: "bg-teal-100",
    dotColor: "before:bg-teal-400",
  },
  "Taxes Management": {
    accent: "bg-yellow-500",
    hoverAccent: "group-hover:bg-yellow-600",
    textAccent: "text-yellow-500",
    iconBg: "bg-yellow-100",
    dotColor: "before:bg-yellow-400",
  },
  accounting: {
    accent: "bg-indigo-500",
    hoverAccent: "group-hover:bg-indigo-600",
    textAccent: "text-indigo-500",
    iconBg: "bg-indigo-100",
    dotColor: "before:bg-indigo-400",
  },
};

export function MenuItems({
  label,
  items,
}: {
  label: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  // Get color scheme based on label with type assertion
  const colorScheme = (
    sectionColors as Record<
      string,
      {
        accent: string;
        hoverAccent: string;
        textAccent: string;
        iconBg: string;
        dotColor: string;
      }
    >
  )[label] || {
    accent: "bg-slate-500",
    hoverAccent: "group-hover:bg-slate-600",
    textAccent: "text-slate-500",
    iconBg: "bg-slate-100",
    dotColor: "before:bg-slate-400",
  };

  return (
    <TooltipProvider>
      <SidebarGroup>
        {/* <SidebarGroupLabel className={`${colorScheme.textAccent} font-medium`}>{label}</SidebarGroupLabel> */}
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="group relative light:hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                  >
                    {item.icon && (
                      <div
                        className={`flex items-center justify-center rounded-md ${colorScheme.iconBg} p-1 transition-colors`}
                      >
                        <item.icon
                          className={`size-4 ${colorScheme.textAccent}`}
                        />
                      </div>
                    )}
                    <span className="font-medium">{item.title}</span>
                    <ChevronRight
                      className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ${colorScheme.textAccent}`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuSubButton
                              asChild
                              className={`group relative before:absolute before:left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:rounded-full ${colorScheme.dotColor} before:-translate-y-1/2 before:opacity-0 hover:before:opacity-100 before:transition-opacity pl-4`}
                            >
                              <a
                                href={subItem.url}
                                className="light:hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                              >
                                {subItem.icon && (
                                  <div
                                    className={`flex items-center justify-center rounded-md  p-1 transition-colors`}
                                  >
                                    <subItem.icon
                                      className={`size-3.5 ${colorScheme.textAccent}`}
                                    />
                                  </div>
                                )}
                                <span className="font-medium ">
                                  {subItem.title}
                                </span>
                              </a>
                            </SidebarMenuSubButton>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="font-medium">
                            {subItem.title}
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </TooltipProvider>
  );
}
