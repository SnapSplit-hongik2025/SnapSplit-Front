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
  // 기존 항목
  items: ReceiptItem[]
  setItems: (items: ReceiptItem[]) => void

  // ✅ OCR 관련 추가 상태
  ocrResult: any | null
  setOcrResult: (data: any) => void

  // ✅ 영수증 원본 이미지 URL
  receiptUrl: string | null
  setReceiptUrl: (url: string) => void

  // ✅ 전체 리셋
  clearReceiptData: () => void
}

export const useReceiptStore = create<ReceiptState>()(
  persist(
    (set) => ({
      // 🧾 기본 영수증 아이템 리스트
      items: [],
      setItems: (items) => set({ items }),

      // 🔍 OCR 결과
      ocrResult: null,
      setOcrResult: (data) => set({ ocrResult: data }),

      // 🖼️ 원본 이미지 URL
      receiptUrl: null,
      setReceiptUrl: (url) => set({ receiptUrl: url }),

      // 🧹 전체 리셋
      clearReceiptData: () =>
        set({
          items: [],
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
