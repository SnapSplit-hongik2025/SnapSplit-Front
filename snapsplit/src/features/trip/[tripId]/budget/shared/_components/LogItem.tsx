import { getSymbol } from "@/shared/utils/currency";
import { useMemo } from "react";

type LogItemProps = {
  type: 'deposit' | 'expense';
  label: string;
  memo: string | null;
  amount: number;
  currency: string;
  krwEquivalent: number;
  // 기본 통화 추가
  defaultCurrency?: string;
  // 환율 정보 추가
  exchangeRates?: Record<string, number>;
};

const LogItem = ({ 
  type, 
  label, 
  memo, 
  amount, 
  currency, 
  krwEquivalent,
  defaultCurrency = 'KRW',
  exchangeRates
}: LogItemProps) => {
  // 기본 통화가 없거나 현재 통화와 같은 경우 변환 없이 표시
  const displayAmount = useMemo(() => {
    if (!defaultCurrency || currency === defaultCurrency || !exchangeRates) {
      return amount;
    }
    
    // 환율 정보가 없으면 원본 금액 반환
    if (!exchangeRates[currency] || !exchangeRates[defaultCurrency]) {
      return amount;
    }

    // 원본 통화 → KRW → 대상 통화로 변환
    const amountInKRW = amount * exchangeRates[currency];
    return amountInKRW / exchangeRates[defaultCurrency];
  }, [amount, currency, defaultCurrency, exchangeRates]);

  const displaySymbol = getSymbol(defaultCurrency || currency);

  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex flex-col text-start">
        <div className="text-label-1 text-grey-1000">{label}</div>
        {memo && <div className="text-caption-1 text-grey-550">{memo}</div>}
      </div>
      <div className="flex flex-col">
        <div className={`text-label-1 text-end ${
          type === 'expense' ? 'text-grey-1000' : 
          amount > 0 ? 'text-green' : 'text-[#FD7564]'
        }`}>
          {amount > 0 ? '+' : ''}
          {displayAmount.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          })}
          {displaySymbol}
        </div>
        {currency !== defaultCurrency && (
          <div className="text-caption-1 text-end text-grey-550">
            {krwEquivalent} {getSymbol('KRW')}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogItem;
