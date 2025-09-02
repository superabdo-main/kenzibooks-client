import { create } from "zustand";
import { BillType } from "@/types/bills.type";
import { generateMockBills } from "@/app/[locale]/dashboard/(Procurement-Management)/bills/mock";

type BillsState = {
  bills: BillType[];
  setBills: (bills: BillType[]) => void;
  isLoading: boolean;
  toggleFetch: () => void;
  fetchBills: () => void;
  deleteBill: (id: string) => void;
  addBill: (bill: BillType) => void;
  updateBill: (id: string, updatedBill: BillType) => void;
  getBillById: (id: string) => BillType | undefined;
};

export const useBillsStore = create<BillsState>((set, get) => ({
  bills: [],
  setBills: (bills) => set(() => ({ bills })),
  isLoading: false,
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),
  fetchBills: () =>
    set(() => ({ isLoading: true, bills: generateMockBills(20) })),
  deleteBill: (id) => 
    set((state) => ({ 
      bills: state.bills.filter(bill => bill.id !== id) 
    })),
  addBill: (bill) => 
    set((state) => ({ 
      bills: [...state.bills, bill] 
    })),
  updateBill: (id, updatedBill) => 
    set((state) => ({ 
      bills: state.bills.map(bill => 
        bill.id === id ? updatedBill : bill
      ) 
    })),
  getBillById: (id) => {
    return get().bills.find(bill => bill.id === id);
  }
})); 