import { create } from "zustand";
import { DebitNoteType } from "@/types/debit-note.type";
import { generateMockDebitNotes } from "@/app/[locale]/dashboard/(Procurement-Management)/debit-notes/mock";

type DebitNotesState = {
  debitNotes: DebitNoteType[];
  setDebitNotes: (debitNotes: DebitNoteType[]) => void;
  isLoading: boolean;
  toggleFetch: () => void;
  fetchDebitNotes: () => void;
  deleteDebitNote: (id: string) => void;
  addDebitNote: (debitNote: DebitNoteType) => void;
  updateDebitNote: (id: string, updatedDebitNote: DebitNoteType) => void;
  getDebitNoteById: (id: string) => DebitNoteType | undefined;
};

export const useDebitNotesStore = create<DebitNotesState>((set, get) => ({
  debitNotes: [],
  setDebitNotes: (debitNotes) => set(() => ({ debitNotes })),
  isLoading: false,
  toggleFetch: () => set((state) => ({ isLoading: !state.isLoading })),
  fetchDebitNotes: () =>
    set(() => ({ isLoading: true, debitNotes: generateMockDebitNotes(20) })),
  deleteDebitNote: (id) => 
    set((state) => ({ 
      debitNotes: state.debitNotes.filter(debitNote => debitNote.id !== id) 
    })),
  addDebitNote: (debitNote) => 
    set((state) => ({ 
      debitNotes: [...state.debitNotes, debitNote] 
    })),
  updateDebitNote: (id, updatedDebitNote) => 
    set((state) => ({ 
      debitNotes: state.debitNotes.map(debitNote => 
        debitNote.id === id ? updatedDebitNote : debitNote
      ) 
    })),
  getDebitNoteById: (id) => {
    return get().debitNotes.find(debitNote => debitNote.id === id);
  }
})); 