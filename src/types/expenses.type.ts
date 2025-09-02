export type ExpenseType = {
  id: string;
  reference: string;
  type: "FIXED" | "RECURRING";
  expenseFor: string;
  amount: number;
  category: ExpenseSubCategory;
  categoryId: string;
  repeatEvery: number;
  startDate: Date;
  endDate: Date;
  lastGenerated: Date;
  instances: ExpenseInstance[];
  _count: {
    instances: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type ExpenseInstance = {
  id: string;
  expenseId: string;
  expense: ExpenseType;
  date: Date;
  createdAt: Date;
};

export type ExpenseCategory = {
  id: string;
  name: string;
  subCategories: ExpenseSubCategory[];
  createdAt: Date;
};

export type ExpenseSubCategory = {
  id: string;
  name: string;
  category: ExpenseCategory;
  categoryId: string;
  expenses: ExpenseType[];
  _count: {
    expenses: number;
  };
};
