'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import CurrencyList from '@/features/trip/[tripId]/budget/shared/[mode]/_components/CurrencyList';
import BudgetInput from './BudgetInput';
import calendar from '@public/svg/calendar.svg';
import { useRouter } from 'next/navigation';
import CalendarSheet from './CalendarSheet';
import CategorySection from './CategorySection';
import { format } from 'date-fns';
import StatusMessage from './StatusMessage';
import { useParams } from 'next/navigation';
import {
  getSharedData,
  addSharedBudget,
  removeSharedBudget,
  updateDefaultCurrency,
} from '@/features/trip/[tripId]/budget/api/budget-api';
import { UpdateSharedBudgetRequestDto } from '../../../types/budget-dto-type';

const result = '$9805596000000';

const SharedForm = () => {
  const router = useRouter();
  const { tripId } = useParams() as { tripId: string };
  const { mode } = useParams() as { mode: 'add' | 'remove' };
  const isAdd = mode === 'add';

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<string>('KRW');
  const [exchangeRate, setExchangeRate] = useState<Record<string, number>>({});
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 모달
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 로딩
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormDataReady = Boolean(amount && currency && selectedDate && selectedCategory);

  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getSharedData(Number(tripId));
        setCurrency(data.defaultCurrency);
        setAvailableCurrencies(data.currencies.map((currency) => currency.code));
        setExchangeRate(
          data.currencies.reduce(
            (acc, currency) => {
              acc[currency.code] = currency.exchangeRate;
              return acc;
            },
            {} as Record<string, number>
          )
        );
      } catch (error) {
        console.error(error);
        setError('공동 경비 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSharedData();
  }, [tripId]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload: UpdateSharedBudgetRequestDto = {
        amount: Number(amount),
        exchangeRate: Number(exchangeRate[currency]),
        currency: currency,
        paymentMethod: selectedCategory || '',
        createdAt: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      };

      if (mode === 'add') {
        await addSharedBudget(Number(tripId), payload);
      } else {
        await removeSharedBudget(Number(tripId), payload);
      }
    
      setIsSubmitting(false);
      alert('공동 경비 정보를 저장했습니다.');
      router.back();
    } catch (error) {
      console.error(error);
      setError('공동 경비 정보를 저장하는데 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCurrencyChange = async (cur: string) => {
    try {
      const newCur = await updateDefaultCurrency(Number(tripId), cur);
      setCurrency(newCur.after);
    } catch (error) {
      console.error(error);
      alert('기본 통화를 변경하는데 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // TODO: BottomNavBar fixed 제거 시 pb-15 제거
  return (
    <div className="w-full h-full pb-15 flex flex-col items-center bg-white">
      <div className="flex w-full h-12 items-center justify-between px-5 py-3">
        <button onClick={() => router.back()}>
          <Image alt="back" src="/svg/arrow-left-grey-850.svg" width={24} height={24} />
        </button>
        <p className="text-label-1">{isAdd ? '경비 추가하기' : '경비 빼기'}</p>
        <div className="w-6 h-6" />
      </div>
      {/* main section */}
      <div className="flex flex-col w-full p-5">
        {/* expense section */}
        <BudgetInput
          currency={currency}
          exchangeRate={exchangeRate}
          amount={amount}
          setAmount={setAmount}
          isCurrencyOpen={isCurrencyOpen}
          setIsCurrencyOpen={setIsCurrencyOpen}
        />
        {isCurrencyOpen && (
          <CurrencyList
            onClose={() => setIsCurrencyOpen(false)}
            handleCurrencyChange={handleCurrencyChange}
            selectedCurrency={currency}
            availableCurrencies={availableCurrencies}
          />
        )}

        {/* date section */}
        <div className="flex flex-col pt-6 gap-3">
          <div className="text-body-2">날짜</div>
          <div className="text-body-2 flex items-center justify-between h-12 px-4 rounded-xl border border-grey-350">
            <div>{selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '날짜 선택'}</div>
            <button onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
              <Image alt="calendar" src={calendar} />
            </button>
          </div>
        </div>
        {isCalendarOpen && (
          <CalendarSheet
            isOpen={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}

        {/* category section */}
        <CategorySection selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      </div>

      {/* submit button */}
      <div className="w-full mt-auto p-5">
        <button
          onClick={handleSubmit}
          className="w-full h-13 rounded-xl bg-primary text-label-2 text-white disabled:bg-light_green"
          disabled={!isFormDataReady || isSubmitting}
        >
          {isAdd ? '추가하기' : '빼기'}
        </button>
      </div>

      {/* Toast */}
      {isFormDataReady && <StatusMessage result={result} />}
    </div>
  );
};

export default SharedForm;
