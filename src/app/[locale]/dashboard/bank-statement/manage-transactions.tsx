"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Badge } from "@/components/shadcn-ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn-ui/tabs";
import {
  Save,
  Edit2,
  Check,
  X,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BanknoteIcon,
  Trash2,
} from "lucide-react";
import { BankStatmentType } from "@/types/bank-statement.type";
import { Spinner } from "@heroui/react";
import { Checkbox } from "@/components/shadcn-ui/checkbox";

// Helper functions can be defined outside the component
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

interface TransactionRowProps {
  transaction: BankStatmentType;
  isEditing: boolean;
  isSelected: boolean;
  onFieldChange: (
    id: string,
    field: keyof BankStatmentType,
    value: any
  ) => void;
  onEdit: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onSelect: (id: string, selected: boolean) => void;
}

const TransactionRow: React.FC<TransactionRowProps> = React.memo(
  ({
    transaction,
    isEditing,
    isSelected,
    onFieldChange,
    onEdit,
    onSave,
    onCancel,
    onSelect,
  }) => {
    if (isEditing) {
      return (
        <tr className="bg-muted border-l-4 ">
          <td className="px-4 py-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(transaction.id, !!checked)}
            />
          </td>
          <td className="px-4 py-3">
            <Input
              type="date"
              value={new Date(transaction.date).toISOString().split("T")[0]}
              onChange={(e) =>
                onFieldChange(transaction.id, "date", new Date(e.target.value))
              }
              className="h-8"
            />
          </td>
          <td className="px-4 py-3">
            <Select
              value={transaction.type}
              onValueChange={(value) =>
                onFieldChange(transaction.id, "type", value)
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"expense"}>Expense</SelectItem>
                <SelectItem value={"revenue"}>Revenue</SelectItem>
              </SelectContent>
            </Select>
          </td>
          <td className="px-4 py-3">
            <Input
              value={transaction.description}
              onChange={(e) =>
                onFieldChange(transaction.id, "description", e.target.value)
              }
              className="h-8"
              placeholder="Description"
            />
          </td>
          <td className="px-4 py-3">
            <Input
              value={transaction.category}
              onChange={(e) =>
                onFieldChange(transaction.id, "category", e.target.value)
              }
              className="h-8"
              placeholder="Category"
            />
          </td>
          <td className="px-4 py-3">
            <Input
              value={transaction.subcategory}
              onChange={(e) =>
                onFieldChange(transaction.id, "subcategory", e.target.value)
              }
              className="h-8"
              placeholder="Subcategory"
            />
          </td>
          <td className="px-4 py-3">
            <Input
              type="number"
              step="0.01"
              value={transaction.amount}
              onChange={(e) =>
                onFieldChange(transaction.id, "amount", e.target.value)
              }
              className="h-8"
            />
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr className="hover:bg-muted/hover group">
        <td className="px-4 py-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(transaction.id, !!checked)}
          />
        </td>
        <td className="px-4 py-3 text-sm text-foreground">
          {formatDate(transaction.date)}
        </td>
        <td className="px-4 py-3">
          <Badge variant="secondary" className="text-xs">
            {transaction.type}
          </Badge>
        </td>
        <td className="px-4 py-3">
          <div
            className="font-medium text-foreground truncate max-w-xs"
            title={transaction.description}
          >
            {transaction.description}
          </div>
        </td>
        <td className="px-4 py-3">
          <Badge variant="secondary" className="text-xs">
            {transaction.category}
          </Badge>
        </td>
        <td className="px-4 py-3">
          <Badge variant="outline" className="text-xs">
            {transaction.subcategory}
          </Badge>
        </td>
        <td className="px-4 py-3">
          <div
            className={`font-semibold ${
              transaction.type === "revenue" ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(transaction.amount)}
          </div>
        </td>
        <td className="px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(transaction.id)}
            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </td>
      </tr>
    );
  }
);

TransactionRow.displayName = "TransactionRow"; // for better debugging

interface TransactionTableProps {
  transactions: BankStatmentType[];
  title: string;
  icon: React.ReactNode;
  total: number;
  colorClass: string;
  editingId: string | null;
  selectedIds: Set<string>;
  onFieldChange: (
    id: string,
    field: keyof BankStatmentType,
    value: any
  ) => void;
  onEdit: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onDeleteSelected: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = React.memo(
  ({
    transactions,
    title,
    icon,
    total,
    colorClass,
    editingId,
    selectedIds,
    onFieldChange,
    onEdit,
    onSave,
    onCancel,
    onSelect,
    onSelectAll,
    onDeleteSelected,
  }) => {
    const checkboxRef = React.useRef<HTMLButtonElement>(null);

    const allSelected =
      transactions.length > 0 &&
      transactions.every((t) => selectedIds.has(t.id));
    const someSelected = transactions.some((t) => selectedIds.has(t.id));
    const selectedCount = transactions.filter((t) =>
      selectedIds.has(t.id)
    ).length;

    // Set indeterminate state after render
    React.useEffect(() => {
      if (checkboxRef.current) {
        const inputElement = checkboxRef.current.querySelector(
          'input[type="checkbox"]'
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.indeterminate = someSelected && !allSelected;
        }
      }
    }, [someSelected, allSelected]);

    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              {icon}
              {title}
              <Badge variant="secondary" className="ml-2">
                {transactions.length} transactions
              </Badge>
              {selectedCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {selectedCount} selected
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-4">
              {selectedCount > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onDeleteSelected}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedCount})
                </Button>
              )}
              <div className={`text-right ${colorClass}`}>
                <div className="text-2xl font-bold">
                  {formatCurrency(total)}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase w-12">
                      <Checkbox
                        ref={checkboxRef}
                        checked={allSelected}
                        onCheckedChange={(checked) => onSelectAll(!!checked)}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase w-28">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase w-32">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase w-32">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase w-32">
                      Subcategory
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase w-32">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase w-12">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-muted divide-y divide-muted-foreground">
                  {transactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      isEditing={editingId === transaction.id}
                      isSelected={selectedIds.has(transaction.id)}
                      onFieldChange={onFieldChange}
                      onEdit={onEdit}
                      onSave={onSave}
                      onCancel={onCancel}
                      onSelect={onSelect}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);
TransactionTable.displayName = "TransactionTable"; // for better debugging

interface BankStatementEditorProps {
  transactions: BankStatmentType[];
  onSave?: (transactions: BankStatmentType[]) => void;
  isLoading?: boolean;
}

const BankStatementEditor: React.FC<BankStatementEditorProps> = ({
  transactions = [],
  onSave,
  isLoading,
}) => {
  const [editedTransactions, setEditedTransactions] =
    useState<BankStatmentType[]>(transactions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { revenues, expenses } = useMemo(() => {
    const revenues = editedTransactions
      .filter((t) => t.type === "revenue")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const expenses = editedTransactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { revenues, expenses };
  }, [editedTransactions]);

  const totalRevenue = useMemo(
    () => revenues.reduce((sum, t) => sum + t.amount, 0),
    [revenues]
  );
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, t) => sum + t.amount, 0),
    [expenses]
  );
  const netIncome = useMemo(
    () => totalRevenue - totalExpenses,
    [totalRevenue, totalExpenses]
  );

  const handleEdit = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const handleSaveEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditedTransactions(transactions);
    setEditingId(null);
  }, [transactions]);

  const handleFieldChange = useCallback(
    (id: string, field: keyof BankStatmentType, value: any) => {
      setEditedTransactions((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                [field]: field === "amount" ? parseFloat(value) || 0 : value,
              }
            : t
        )
      );
    },
    []
  );

  const handleSaveAll = useCallback(() => {
    onSave?.(editedTransactions);
  }, [editedTransactions, onSave]);

  const handleSelect = useCallback((id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAllRevenues = useCallback(
    (selected: boolean) => {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        revenues.forEach((transaction) => {
          if (selected) {
            newSet.add(transaction.id);
          } else {
            newSet.delete(transaction.id);
          }
        });
        return newSet;
      });
    },
    [revenues]
  );

  const handleSelectAllExpenses = useCallback(
    (selected: boolean) => {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        expenses.forEach((transaction) => {
          if (selected) {
            newSet.add(transaction.id);
          } else {
            newSet.delete(transaction.id);
          }
        });
        return newSet;
      });
    },
    [expenses]
  );

  const handleDeleteSelected = useCallback(() => {
    setEditedTransactions((prev) =>
      prev.filter((transaction) => !selectedIds.has(transaction.id))
    );
    setSelectedIds(new Set());
  }, [selectedIds]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Summary Cards */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Net Income</p>
                <p
                  className={`text-xl font-bold ${
                    netIncome >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(netIncome)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-center">
            <Button
              onClick={handleSaveAll}
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <>
                  <BanknoteIcon className="h-4 w-4 mr-2" />
                  Generate Records
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenues" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revenues" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Revenues ({revenues.length})
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Expenses ({expenses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenues" className="mt-6">
          <TransactionTable
            transactions={revenues}
            title="Revenue Transactions"
            icon={<TrendingUp className="h-5 w-5 text-green-600" />}
            total={totalRevenue}
            colorClass="text-green-600"
            editingId={editingId}
            selectedIds={selectedIds}
            onFieldChange={handleFieldChange}
            onEdit={handleEdit}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            onSelect={handleSelect}
            onSelectAll={handleSelectAllRevenues}
            onDeleteSelected={handleDeleteSelected}
          />
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <TransactionTable
            transactions={expenses}
            title="Expense Transactions"
            icon={<TrendingDown className="h-5 w-5 text-red-600" />}
            total={totalExpenses}
            colorClass="text-red-600"
            editingId={editingId}
            selectedIds={selectedIds}
            onFieldChange={handleFieldChange}
            onEdit={handleEdit}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            onSelect={handleSelect}
            onSelectAll={handleSelectAllExpenses}
            onDeleteSelected={handleDeleteSelected}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BankStatementEditor;
