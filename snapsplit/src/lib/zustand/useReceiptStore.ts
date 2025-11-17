import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const isClient = typeof window !== 'undefined'

// 영수증 항목 타입
export type ReceiptItem = {
  id: number
  name: string
  amount: number
}

// OCR 결과 타입
export type OcrResult = {
  currency: string
  totalAmount: number
  receiptUrl: string
  items: ReceiptItem[]
} | null

// Zustand 스토어 타입
type ReceiptState = {
  // OCR 결과 전체
  ocrResult: OcrResult
  setOcrResult: (data: OcrResult) => void

  // 개별 필드 접근용 (필요 시)
  items: ReceiptItem[]
  setItems: (items: ReceiptItem[]) => void

  currency: string
  setCurrency: (currency: string) => void

  receiptUrl: string | null
  setReceiptUrl: (url: string) => void

  // ReceiptForm → ExpenseForm 간 상태 공유 후 초기화용
  clearReceiptData: () => void
}

export const useReceiptStore = create<ReceiptState>()(
  persist(
    (set) => ({
      /** OCR 전체 결과 */
      ocrResult: null,
      setOcrResult: (data) => {
        // ocrResult가 들어오면 하위 필드도 자동 업데이트
        if (data) {
          set({
            ocrResult: data,
            items: data.items || [],
            currency: data.currency || 'KRW',
            receiptUrl: data.receiptUrl || null,
          })
        } else {
          set({
            ocrResult: null,
            items: [],
            currency: 'KRW',
            receiptUrl: null,
          })
        }
      },

      /** 개별 필드들 */
      items: [],
      setItems: (items) =>
        set((state) => ({
          items,
          ocrResult: state.ocrResult
            ? { ...state.ocrResult, items }
            : null,
        })),

      currency: 'KRW',
      setCurrency: (currency) =>
        set((state) => ({
          currency,
          ocrResult: state.ocrResult
            ? { ...state.ocrResult, currency }
            : null,
        })),

      receiptUrl: null,
      setReceiptUrl: (url) =>
        set((state) => ({
          receiptUrl: url,
          ocrResult: state.ocrResult
            ? { ...state.ocrResult, receiptUrl: url }
            : null,
        })),

      /** 전체 초기화 (ExpenseForm 제출 후) */
      clearReceiptData: () =>
        set({
          ocrResult: null,
          items: [],
          currency: 'KRW',
          receiptUrl: null,
        }),
    }),
    {
      name: 'receipt-storage',
      storage: isClient ? createJSONStorage(() => localStorage) : undefined,
    }
  )
)
