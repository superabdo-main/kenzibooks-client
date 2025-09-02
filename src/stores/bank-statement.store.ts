import { generateTransactiions } from "@/app/[locale]/dashboard/bank-statement/mock";
import { BankStatmentType } from "@/types/bank-statement.type";
import { create } from "zustand";
import { ApiResponse, createAuthenticatedFetch } from "@/lib/api";

type BankStatmentState = {
  transactions: BankStatmentType[];
  setTransactions: (transactions: BankStatmentType[]) => void;
  isLoading: boolean;
  error: string | null;

  genMockTransactions: () => void;
  uploadedFile: File | null;
  setIsLoading: (isLoading: boolean) => void;
  setUploadedFile: (file: File) => void;
  sendRecordsGeneration: ({
    accessToken,
    organizationId,
    records,
  }: {
    accessToken: string;
    organizationId: string;
    records: BankStatmentType[];
  }) => Promise<ApiResponse>;
};

export const useBankStatementStore = create<BankStatmentState>((set, get) => ({
  error: null,
  isLoading: false,
  transactions: [],
  uploadedFile: null,
  setTransactions: (transactions) => set(() => ({ transactions })),
  setUploadedFile: (file) => set(() => ({ uploadedFile: file })),
  setIsLoading: (isLoading) => set(() => ({ isLoading })),
  genMockTransactions: () => {
    set(() => ({ isLoading: true, transactions: generateTransactiions(5) }));

    setTimeout(() => {
      set(() => ({ isLoading: false }));
    }, 2000);
  },
  sendRecordsGeneration: async ({
    accessToken,
    organizationId,
    records,
  }: {
    accessToken: string;
    organizationId: string;
    records: BankStatmentType[];
  }) => {
    set({ isLoading: true });

    try {
      const response = await createAuthenticatedFetch({
        accessToken,
        endpoint: `/bank-statement/${organizationId}/generate`,
        options: {
          method: "POST",
          body: JSON.stringify(records),
        },
      });
      if (response.error) {
        set({
          error: response.error,
        });
      }
      set({
        isLoading: false,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate records";

      set({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  },
}));
