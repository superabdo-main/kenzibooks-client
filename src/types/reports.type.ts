// Financial Report Types
export interface ProfitAndLossReport {
  startDate: string;
  endDate: string;
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  expenses: number;
  netProfit: number;
}

export interface BalanceSheetReport {
  assets: {
    inventory: number;
    fixedAssets: number;
    totalAssets: number;
  };
  liabilities: {
    accountsPayable: number;
    totalLiabilities: number;
  };
  equity: number;
  accounts: Record<string, any[]>;
}

export interface CashFlowReport {
  startDate: string;
  endDate: string;
  cashInflow: number;
  cashOutflow: number;
  netCashFlow: number;
}

// Sales Report Types
export interface SalesSummaryReport {
  startDate: string;
  endDate: string;
  salesByType: {
    type: string;
    _sum: { grandTotal: number };
    _count: { id: number };
  }[];
  salesByStatus: {
    status: string;
    _sum: { grandTotal: number };
    _count: { id: number };
  }[];
  totals: {
    count: number;
    subTotal: number;
    taxes: number;
    discount: number;
    grandTotal: number;
  };
}

export interface TopProductsReport {
  startDate: string;
  endDate: string;
  topProducts: {
    id: string;
    name: string;
    sku: string | null;
    salePrice: number;
    quantitySold: number;
    totalSales: number;
  }[];
}

export interface CustomerSalesReport {
  startDate: string;
  endDate: string;
  topCustomers: {
    id: string;
    name: string;
    email: string;
    salesCount: number;
    totalAmount: number;
  }[];
}

// Inventory Report Types
export interface InventorySummaryReport {
  totalInventory: {
    productCount: number;
    totalQuantity: number;
    costValue: number;
    retailValue: number;
    potentialProfit: number;
  };
  inventoryByCategory: {
    category: {
      id: string;
      name: string;
    };
    productCount: number;
    totalQuantity: number;
    costValue: number;
    retailValue: number;
    potentialProfit: number;
  }[];
  inventoryByWarehouse: {
    warehouse: {
      id: string;
      name: string;
    };
    productCount: number;
    totalQuantity: number;
    costValue: number;
    retailValue: number;
    potentialProfit: number;
  }[];
}

export interface LowStockReport {
  threshold: number;
  products: {
    id: string;
    name: string;
    sku: string | null;
    barcode: string | null;
    quantity: number;
    purchasePrice: number;
    salePrice: number;
    category: {
      name: string;
    } | null;
    warehouse: {
      name: string;
    } | null;
  }[];
  count: number;
}

// Tax Report Type
export interface TaxReport {
  startDate: string;
  endDate: string;
  totalTaxCollected: number;
  taxesByType: {
    tax: {
      id: string;
      name: string;
      rate: number;
      description: string | null;
    };
    products: {
      id: string;
      name: string;
      salePrice: number;
    }[];
    totalTaxableAmount: number;
  }[];
}

// Dashboard Report Types
export interface DashboardStatsReport {
  profit: {
    value: number;
    trend: number;
  };
  totalSales: {
    value: number;
    trend: number;
  };
  totalPurchase: {
    value: number;
    trend: number;
  };
  products: {
    value: number;
    trend: number;
  };
  invoices: {
    value: number;
    trend: number;
  };
  customers: {
    value: number;
    trend: number;
  };
}

export interface RevenueChartReport {
  month: string;
  revenue: number;
  profit: number;
}

export interface DashboardTopProductsReport {
  name: string;
  value: number;
}

export interface ProductPerformanceReport {
  name: string;
  sales: number;
  revenue: number;
}

export interface NewCustomersReport {
  month: string;
  new: number;
} 