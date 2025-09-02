import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Organization {
  id: string;
  name: string;
  memberCount: number;
  isOwner: boolean;
  subscription: {
    isDemo: boolean;
    isActive: boolean;
    period: number;
    expiresAt: string;
  };
  icon: string | null;
}

type managementState = {
  managedOrganization: Organization | undefined;
  setManagedOrganization: (organization: Organization) => void;
};

export const useManagementStore = create<managementState>()(
  persist(
    (set) => ({
      managedOrganization: undefined,
      setManagedOrganization: (organization: Organization) =>
        set({ managedOrganization: organization }),
    }),
    {
      name: "management-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
