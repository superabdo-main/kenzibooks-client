"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LanguagesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps extends React.HTMLAttributes<HTMLButtonElement> {
  isCompact?: boolean;
  collapsed?: boolean;
}

export function LanguageSwitcher({
  className,
  isCompact: isCompactProp,
  collapsed,
  ...props
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  
  // After mounting, we have access to the locale
  React.useEffect(() => setMounted(true), []);
  
  const isEnglish = mounted && locale === "en";
  
  // Use either the prop if provided, or determine from collapsed state
  const isCompact = isCompactProp !== undefined 
    ? isCompactProp 
    : collapsed;
  
  const handleLocaleChange = () => {
    router.replace(pathname, { locale: isEnglish ? "ar" : "en" });
  };
  
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
      onClick={handleLocaleChange}
      className={cn(
        "flex w-full items-center transition-all rounded-lg",
        isCompact 
          ? "px-2 py-2 flex-col justify-center bg-none" 
          : "px-4 py-3 justify-between gap-3",
        "light:text-slate-800 dark:text-slate-200",
        className
      )}
      type="button"
      aria-label={`Switch to ${isEnglish ? "Arabic" : "English"} language`}
      {...props}
    >
      {!isCompact && (
        <>
          <div className="flex items-center space-x-3">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
              "bg-slate-300 dark:bg-slate-700 text-blue-600 dark:text-blue-300"
            )}>
              <LanguagesIcon className="size-5" />
            </div>
            <span className="text-sm font-medium ">
              {isEnglish ? "English" : "العربية"}
            </span>
          </div>
          <div className={cn(
            "flex h-5 w-9 items-center rounded-full transition-colors px-0.5",
            "bg-slate-300 dark:bg-slate-700"
          )}>
            <span
              className={cn(
                "size-4 rounded-full transition-transform duration-200",
                isEnglish 
                  ? "translate-x-0 bg-blue-500" 
                  : "translate-x-4 bg-blue-300"
              )}
            />
          </div>
        </>
      )}

      {isCompact && (
        <div className={cn(
          "flex flex-col items-center justify-center",
          "relative w-9 h-9 rounded-lg transition-colors",
          "bg-slate-300 dark:bg-slate-700 text-blue-600 dark:text-blue-300"
        )}>
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div 
              className={cn(
                "absolute inset-0 transform transition-transform duration-500", 
                isEnglish ? "translate-y-0" : "translate-y-full"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400  opacity-20" />
            </div>
            <div 
              className={cn(
                "absolute inset-0 transform transition-transform duration-500", 
                isEnglish ? "translate-y-full" : "translate-y-0"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 opacity-20" />
            </div>
          </div>
          <div className="z-10">
            <LanguagesIcon className="size-5" />
          </div>
        </div>
      )}
    </button>
  );
} 