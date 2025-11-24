import { BackendCategory } from '@/shared/utils/useCategoryMapper';
import { SharedBudgetDetail, TotalSharedBudget } from './budget-type';

// 여행홈 조회 API 응답 타입
export interface GetTripBudgetDto {
  tripId: number;
  tripName: string;
  startDate: string;
  endDate: string;
  countries: string[];
  memberProfileImages: string[];
  sharedFund: SharedFundDto;
  topCategoryExpense?: TopCategoryExpenseDto;
  dailyExpenses: DailyExpenseDto[];
  totalExpense: number;
}

// 공동 경비 잔액
export interface SharedFundDto {
  defaultCurrency: string;
  balance: number;
}

// 가장 많이 지출한 카테고리
export interface TopCategoryExpenseDto {
  category: BackendCategory;
  amountKRW: number;
}

// 날짜별 지출 내역
export interface DailyExpenseDto {
  date: string;
  expenses: ExpenseDto[];
}

// 지출 내역
export interface ExpenseDto {
  expenseId: number;
  category: BackendCategory;
  expenseName: string;
  expenseMemo: string;
  amount: number;
  currency: string;
  splitters: string[];
}

// 공동 경비 세부 내역 조회
export interface GetSharedBudgetDto {
  tripId: number;
  tripStartDate: string;
  defaultCurrency: string;
  availCurrencies: string[];
  sharedBudgetDetails: SharedBudgetDetail[];
  totalSharedBudget: TotalSharedBudget[];
}

// 환율 정보
export interface GetExchangeRateDto {
  base: string;
  rateToKRW: number;
  date: string;
}

export interface SharedBudgetDto {
  defaultCurrency: string;
  currencies: {
    code: string;
    exchangeRate: number;
  } [];
}

export interface UpdateDefaultCurrencyDto {
  before: string;
  after: string;
}

export interface UpdateSharedBudgetRequestDto {
  amount: number;
  exchangeRate: number;
  currency: string;
  paymentMethod: string;
  createdAt: string;
}

export interface GetCategoryExpenseDto {
  totalAmountKRW: number;
  categoryExpenses: {
    category: BackendCategory,
    amountKRW: number;
  }[]
}
