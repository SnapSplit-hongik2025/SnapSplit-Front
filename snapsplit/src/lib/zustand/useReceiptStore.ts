// src/lib/zustand/useReceiptStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const isClient = typeof window !== 'undefined'

export type ReceiptItem = {
  id: number
  name: string
  amount: string
}

type ReceiptState = {
  // 영수증 항목
  items: ReceiptItem[]
  setItems: (items: ReceiptItem[]) => void
  currency: string
  setCurrency: (currency: string) => void

  // OCR 결과
  ocrResult: any | null
  setOcrResult: (data: any) => void

  // 영수증 원본 이미지 URL
  receiptUrl: string | null
  setReceiptUrl: (url: string) => void

  // 전체 리셋
  clearReceiptData: () => void
}

export const useReceiptStore = create<ReceiptState>()(
  persist(
    (set) => ({
      // 영수증 항목 리스트
      items: [],
      setItems: (items) => set({ items }),

      // 기준 통화
      currency: 'KRW',
      setCurrency: (currency) => set({ currency }),

      // OCR 결과
      ocrResult: null,
      setOcrResult: (data) => set({ ocrResult: data }),

      // 영수증 원본 이미지 URL
      receiptUrl: null,
      setReceiptUrl: (url) => set({ receiptUrl: url }),

      // 전체 리셋
      clearReceiptData: () =>
        set({
          items: [],
          currency: 'KRW',
          ocrResult: null,
          receiptUrl: null,
        }),
    }),
    {
      name: 'receipt-storage',
      storage: isClient ? createJSONStorage(() => localStorage) : undefined,
    }
  )
)
