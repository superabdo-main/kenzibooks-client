"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/shadcn-ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface NavSubItem {
  name: string;
  href: string;
  description?: string;
}

interface NavItem {
  name: string;
  href: string;
  subItems?: NavSubItem[];
}

const useNavItems = (): NavItem[] => {
  return useMemo(
    () => [
      {
        name: "Welcome",
        href: "#hello",
      },
      {
        name: "Why KenziBooks",
        href: "#key-differentiators",
      },
      { name: "Features", href: "#features" },
      { name: "Resources", href: "#resources" },
      { name: "Pricing", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
    ],
    []
  );
};

export function Navigation() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const navItems = useNavItems();
  const { data: session, status } = useSession();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (mobileMenuOpen) setActiveSubmenu(null);
  };

  const toggleSubmenu = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name);
  };

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setActiveSubmenu(null);
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAllMenus();
      }
    },
    [closeAllMenus]
  );

  return (
    <div onKeyDown={handleKeyDown}>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${"bg-white shadow-sm"}`}
        role="banner"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md"
              onClick={closeAllMenus}
              aria-label="KenziBooks Home"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">KB</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                KenziBooks
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <a
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                      activeSubmenu === item.name
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    } transition-colors`}
                  >
                    {item.name}
                  </a>
                </div>
              ))}
            </nav>

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              {status === "unauthenticated" && (
                <Button
                  onClick={() => router.push("/auth/signin")}
                  variant="outline"
                  size="sm"
                >
                  Sign In
                </Button>
              )}
              {status === "authenticated" && (
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm text-white transition-colors"
                    onClick={() => router.push("/manage-organizations")}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-sm text-white transition-colors"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <div key={item.name} className="mb-1">
                    <button
                      type="button"
                      onClick={() =>
                        item.subItems
                          ? toggleSubmenu(item.name)
                          : closeAllMenus()
                      }
                      className="w-full flex justify-between items-center px-3 py-3 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                      aria-expanded={
                        item.subItems ? activeSubmenu === item.name : undefined
                      }
                      aria-controls={
                        item.subItems
                          ? `mobile-submenu-${item.name}`
                          : undefined
                      }
                    >
                      {item.name}
                      {item.subItems && (
                        <ChevronDown
                          className={`ml-2 h-4 w-4 transition-transform ${
                            activeSubmenu === item.name
                              ? "transform rotate-180"
                              : ""
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </button>

                    {item.subItems && activeSubmenu === item.name && (
                      <motion.div
                        key={`submenu-${item.name}`}
                        id={`mobile-submenu-${item.name}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-1 space-y-1 overflow-hidden"
                        role="region"
                        aria-label={`${item.name} submenu`}
                      >
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg hover:text-blue-600 transition-colors"
                            onClick={closeAllMenus}
                          >
                            <p className="font-medium">{subItem.name}</p>
                            {subItem.description && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {subItem.description}
                              </p>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}

                <div className="pt-2 border-t border-gray-100 mt-2 space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/auth/signin")}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm text-white transition-colors"
                    onClick={() => router.push("/auth/signup")}
                  >
                    Get Started
                  </Button>
                </div>

                <div className="pt-2 border-t border-gray-100 mt-3 flex justify-center"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="h-16" />
    </div>
  );
}
