"use client";

import React, { useMemo } from "react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { HomeIcon, ChevronRightIcon, PackageIcon, Percent, ShieldAlert, Banknote, Settings2 } from "lucide-react";

import {
  BarChart3,
  ClipboardList,
  FileText,
  Warehouse,
  Users,
  ShoppingCart,
  HelpCircle,
} from "lucide-react";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { useTranslations } from "next-intl";

// FIXME: fix broken routes at edit categories
// TODO: fix slug dynamic routes (remove from breadcrumbs)

// Define route configuration with icons and labels
const routeConfig: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    parent?: string;
  }
> = {
  dashboard: {
    label: "Dashboard",
    icon: BarChart3,
  },
  reports: {
    label: "Reports",
    icon: FileText,
    parent: "dashboard",
  },
  analytics: {
    label: "Analytics",
    icon: BarChart3,
  },
  products: {
    label: "Products",
    icon: PackageIcon,
    parent: "warehouse",
  },
  "new-product": {
    label: "New Product",
    icon: PackageIcon,
    parent: "products",
  },
  "edit-product": {
    label: "Edit Product",
    icon: PackageIcon,
    parent: "products",
  },
  categories: {
    label: "Categories",
    icon: ClipboardList,
    parent: "warehouse",
  },
  "edit-category": {
    label: "Edit Category",
    icon: ClipboardList,
    parent: "categories",
  },
  "import-products": {
    label: "Import Products",
    icon: ShoppingCart,
    parent: "products",
  },
  purchases: {
    label: "Purchases",
    icon: ShoppingCart,
  },
  "new-purchase": {
    label: "New Purchase",
    icon: ShoppingCart,
    parent: "purchases",
  },
  "edit-purchase": {
    label: "Edit Purchase",
    icon: ShoppingCart,
    parent: "purchases",
  },
  "process-payment": {
    label: "Process Payment",
    icon: ShoppingCart,
    parent: "purchases",
  },
  bills: {
    label: "Bills",
    icon: FileText,
    parent: "purchases",
  },
  "new-bill": {
    label: "New Bill",
    icon: FileText,
    parent: "bills",
  },
  "edit-bill": {
    label: "Edit Bill",
    icon: FileText,
    parent: "bills",
  },
  "debit-notes": {
    label: "Debit Notes",
    icon: FileText,
  },
  "new-debit-note": {
    label: "New Debit Note",
    icon: FileText,
    parent: "debit-notes",
  },
  "edit-debit-note": {
    label: "Edit Debit Note",
    icon: FileText,
    parent: "debit-notes",
  },
  "purchase estimate": {
    label: "Purchase Estimates",
    icon: ClipboardList,
  },
  "new-purchase-estimate": {
    label: "New Purchase Estimate",
    icon: ClipboardList,
    parent: "purchase-estimate",
  },
  "edit-purchase-estimate": {
    label: "Edit Purchase Estimate",
    icon: ClipboardList,
    parent: "purchase-estimate",
  },
  warehouses: {
    label: "Warehouses",
    icon: Warehouse,
  },
  "new-warehouse": {
    label: "New Warehouse",
    icon: Warehouse,
  },
  "edit-warehouse": {
    label: "Edit Warehouse",
    icon: Warehouse,
  },
  storage: {
    label: "Storage & Warehouses",
    icon: Warehouse,
    parent: "warehouse",
  },
  suppliers: {
    label: "Suppliers",
    icon: Users,
    // parent: "vendors",
  },
  "new-supplier": {
    label: "New Supplier",
    icon: Users,
    parent: "suppliers",
  },
  "edit-supplier": {
    label: "Edit Supplier",
    icon: Users,
    parent: "suppliers",
  },
  "import-suppliers": {
    label: "Import Suppliers",
    icon: Users,
    parent: "suppliers",
  },
  customers: {
    label: "Customers",
    icon: Users,
  },
  "new-customer": {
    label: "New Customer",
    icon: Users,
    parent: "customers",
  },
  "edit-customer": {
    label: "Edit Customer",
    icon: Users,
    parent: "customers",
  },
  sales: {
    label: "Sales",
    icon: ShoppingCart,
  },
  "new-sale": {
    label: "New Sale",
    icon: ShoppingCart,
    parent: "sales",
  },
  "edit-sale": {
    label: "Edit Sale",
    icon: ShoppingCart,
    parent: "sales",
  },
  invoices: {
    label: "Invoices",
    icon: ShoppingCart,
  },
  "new-invoice": {
    label: "New Invoice",
    icon: ShoppingCart,
    parent: "invoices",
  },
  "edit-invoice": {
    label: "Edit Invoice",
    icon: ShoppingCart,
    parent: "invoices",
  },
  "credit note": {
    label: "Credit Notes",
    icon: ShoppingCart,
  },
  "new-credit-note": {
    label: "New Credit Note",
    icon: ShoppingCart,
    parent: "credit note",
  },
  "edit-credit-note": {
    label: "Edit Credit Note",
    icon: ShoppingCart,
    parent: "credit note",
  },
  "estimated sale": {
    label: "Estimated Sales",
    icon: ShoppingCart,
  },
  "new-estimated-sale": {
    label: "New Estimated Sale",
    icon: ShoppingCart,
    parent: "estimated sale",
  },
  "edit-estimated-sale": {
    label: "Edit Estimated Sale",
    icon: ShoppingCart,
    parent: "estimated sale",
  },
  employees: {
    label: "Employees",
    icon: Users,
  },
  "create-employee": {
    label: "Create Employee",
    icon: Users,
    parent: "employees",
  },
  "edit-employee": {
    label: "Edit Employee",
    icon: Users,
    parent: "employees",
  },
  payrolls: {
    label: "Payrolls",
    icon: Users,
  },
  "pay": {
    label: "Pay",
    icon: Users,
    parent: "payrolls",
  },
  'sales-taxes': {
    label: "Sales Taxes",
    icon: Percent,
  },
  "fixed-assets": {
    label: "Fixed Assets",
    icon: Warehouse,
  },
  "new-asset": {
    label: "New Asset",
    icon: Warehouse,
    parent: "fixed-assets",
  },
  "coa": {
    label: "Chart of Accounts",
    icon: Warehouse,
  },
  "access-denied": {
    label: "Access Denied",
    icon: ShieldAlert,
  },
  "revenue": {
    label: "Revenue",
    icon: Banknote 
  },
  "bank-statement": {
    label: "Bank Statement",
    icon: Banknote
  },
  settings: {
    label: "Settings",
    icon: Settings2,
  },
  help: {
    label: "Help & Support",
    icon: HelpCircle,
  },
};

interface BreadcrumbsPath {
  key: string;
  label: string;
  icon?: React.ElementType;
  path: string;
}

interface AppBreadcrumbsProps {
  className?: string;
}

export function AppBreadcrumbs({ className }: AppBreadcrumbsProps) {
  const pathname = usePathname();
  const tr = useTranslations("Breadcrumbs");

  // Generate breadcrumb items based on the current pathname
  const breadcrumbItems = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    // Add locale prefix if present
    const localePrefix =
      pathname.startsWith("/ar") || pathname.startsWith("/en")
        ? `/${pathSegments[0]}`
        : "";

    // Start with the home page as the first breadcrumb
    const items: BreadcrumbsPath[] = [
      {
        key: "home",
        label: "Home",
        icon: HomeIcon,
        path: localePrefix || "/",
      },
    ];

    // For segments without locale
    const segments = localePrefix ? pathSegments.slice(1) : pathSegments;

    // Build the breadcrumbs path
    let currentPath = localePrefix;

    segments.forEach((segment) => {
      currentPath += `/${segment}`;

      // Try to find this segment in our route config
      const routeInfo = routeConfig[segment] || {
        label:
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
        icon: FileText,
      };

      items.push({
        key: segment,
        label: routeInfo.label,
        icon: routeInfo.icon,
        path: currentPath,
      });
    });

    return items;
  }, [pathname]);

  // If we only have the home breadcrumb, don't show breadcrumbs
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <div className={cn("py-2 px-4", className)}>
      <Breadcrumbs
        separator={<ChevronRightIcon className="w-3.5 h-3.5 text-gray-400" />}
        className="text-sm"
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const Icon = item.icon;

          return (
            <BreadcrumbItem
              key={item.key}
              href={!isLast ? item.path : undefined}
              isCurrent={isLast}
              className={cn(
                "flex items-center gap-1.5",
                isLast ? "text-foreground font-medium" : "text-gray-500"
              )}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tr(item.label.toLocaleLowerCase() as any)}</span>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}
