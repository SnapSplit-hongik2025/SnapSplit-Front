export type ReceiptItem = {
    id: number;
    name: string;
    amount: number;
};

export type ResponseItem = {
    name: string;
    amount: number;
};

export type ExpenseDetail = {
    id: number;
    date: string;
    amount: number;
    currency: string;
    exchangeRate: number;
    category: string;
    expenseName: string;
    expenseMemo: string;
    paymentMethod: string;
    payers: {
        memberId: number;
        name: string;
        amount: number;
    }[];
    splitters: {
        memberId: number;
        name: string;
        amount: number;
    }[];
    receiptUrl?: string;
    items?: ResponseItem[];
};