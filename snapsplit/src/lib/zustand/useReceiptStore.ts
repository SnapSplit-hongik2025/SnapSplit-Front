import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ReceiptItem = {
  id: number;
  name: string;
  amount: string;
};

type ReceiptState = {
    items: ReceiptItem[];
    setItems: (items: ReceiptItem[]) => void;
}

export const useReceiptStore = create<ReceiptState>()(
  persist(
    (set) => ({
      items: [] as ReceiptItem[],
      setItems: (items: ReceiptItem[]) => set({ items }),
    }),
    {
      name: 'receipt-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
