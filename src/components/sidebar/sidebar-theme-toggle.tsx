"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/shadcn-ui/sidebar";

interface SidebarThemeToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  isCompact?: boolean;
}

export function SidebarThemeToggle({
  className,
  isCompact: isCompactProp,
  ...props
}: SidebarThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const sidebar = useSidebar();
  
  // After mounting, we have access to the theme
  React.useEffect(() => setMounted(true), []);
  
  const isDarkTheme = mounted && theme === "dark";
  
  // Use either the prop if provided, or determine from sidebar state
  // sidebar.open is true when the sidebar is expanded, false when collapsed
  const isCompact = isCompactProp !== undefined 
    ? isCompactProp 
    : sidebar && !sidebar.open;
  
  if (!mounted) {
    return (
      <div className={cn(
        "w-full relative transition-all duration-300 ease-spring py-2 select-none",
        className
      )}>
        <div className="h-10 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 animate-pulse"/>
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
      className={cn(
        "flex w-full items-center transition-all rounded-lg",
        isCompact 
          ? "px-2 py-2 flex-col justify-center bg-none" 
          : "px-4 py-3 justify-between gap-3",
        isDarkTheme
          ? "text-slate-200"
          : "text-slate-800",
        className
      )}
      type="button"
      aria-label={`Switch to ${isDarkTheme ? "light" : "dark"} theme`}
      {...props}
    >
      {!isCompact && (
        <>
          <div className="flex items-center space-x-3">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
              isDarkTheme 
                ? "bg-slate-700 text-amber-300" 
                : "bg-slate-300 text-amber-600"
            )}>
              {isDarkTheme ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
            </div>
            <span className="text-sm font-medium">
              {isDarkTheme ? "Dark" : "Light"} Mode
            </span>
          </div>
          <div className={cn(
            "flex h-5 w-9 items-center rounded-full transition-colors px-0.5",
            isDarkTheme ? "bg-slate-700" : "bg-slate-300"
          )}>
            <span
              className={cn(
                "size-4 rounded-full transition-transform duration-200",
                isDarkTheme 
                  ? "translate-x-4 bg-amber-300" 
                  : "translate-x-0 bg-amber-500"
              )}
            />
          </div>
        </>
      )}

      {isCompact && (
        <div className={cn(
          "flex flex-col items-center justify-center",
          "relative w-9 h-9 rounded-lg transition-colors",
          isDarkTheme 
            ? "bg-slate-700 text-amber-300" 
            : "bg-slate-300 text-amber-600"
        )}>
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div 
              className={cn(
                "absolute inset-0 transform transition-transform duration-500", 
                isDarkTheme ? "translate-y-0" : "translate-y-full"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 opacity-20" />
            </div>
            <div 
              className={cn(
                "absolute inset-0 transform transition-transform duration-500", 
                isDarkTheme ? "translate-y-full" : "translate-y-0"
              )}
            >
              {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 opacity-20" /> */}
            </div>
          </div>
          <div className="z-10">
            {isDarkTheme ? 
              <MoonIcon className="size-5" /> : 
              <SunIcon className="size-5" />
            }
          </div>
        </div>
      )}
    </button>
  );
} 