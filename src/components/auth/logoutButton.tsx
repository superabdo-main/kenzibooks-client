// src/components/auth/LogoutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { useManagementStore } from "@/stores/management.store";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export default function LogoutButton({
  variant = "outline",
  size = "md",
  showIcon = true,
  showText = true,
  className = "",
}: LogoutButtonProps) {
  const { setManagedOrganization } = useManagementStore();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Clear managed organization
      setManagedOrganization("");
      
      // Perform logout
      await signOut();
      
      // Redirect to signin page
      router.push("/auth/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      // You might want to show a toast notification here
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Variant classes
  const variantClasses = {
    default: "bg-red-600 hover:bg-red-700 text-white border-transparent",
    outline: "border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700",
    ghost: "text-red-600 hover:bg-red-50 hover:text-red-700 border-transparent",
    destructive: "bg-red-600 hover:bg-red-700 text-white border-transparent",
  };

  // Icon size based on button size
  const iconSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-5 h-5",
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg border font-medium
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {isLoggingOut ? (
        <Loader2 className={`${iconSize[size]} animate-spin`} />
      ) : (
        showIcon && <LogOut className={iconSize[size]} />
      )}
      {showText && (
        <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
      )}
    </button>
  );
}

// Alternative versions for different use cases:

// Icon-only version for minimal UI
export function LogoutIconButton({ className = "" }: { className?: string }) {
  return (
    <LogoutButton
      variant="ghost"
      size="sm"
      showIcon={true}
      showText={true}
      className={`rounded-full p-2 ${className}`}
    />
  );
}

// Dropdown menu item version
export function LogoutMenuItem({ className = "" }: { className?: string }) {
  return (
    <LogoutButton
      variant="ghost"
      size="sm"
      showIcon={true}
      showText={true}
      className={`w-full justify-start rounded-none hover:bg-red-50 ${className}`}
    />
  );
}

// Sidebar version
export function LogoutSidebarButton({ className = "" }: { className?: string }) {
  return (
    <LogoutButton
      variant="ghost"
      size="md"
      showIcon={true}
      showText={true}
      className={`w-full justify-start ${className}`}
    />
  );
}