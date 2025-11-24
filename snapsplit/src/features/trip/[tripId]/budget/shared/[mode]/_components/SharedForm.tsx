'use client';

import { useEffect, useMemo, useState } from 'react';
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
} from '@/features/trip/[tripId]/budget/api/budget-api';
import { UpdateSharedBudgetRequestDto } from '../../../types/budget-dto-type';
import Loading from '@/shared/components/loading/Loading';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetTripBudgetDto } from '../../../types/budget-dto-type';
import { getTripBudgetData } from '../../../api/budget-api';

const SharedForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tripId } = useParams() as { tripId: string };
  const { mode } = useParams() as { mode: 'add' | 'remove' };
  const isAdd = mode === 'add';

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<Record<string, number>>({});
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // budgetData
  const {
    data: budgetData,
    isLoading: isBudgetLoading,
    error: budgetError,
  } = useQuery<GetTripBudgetDto, Error>({
    queryKey: ['tripBudget', tripId],
    queryFn: () => getTripBudgetData(Number(tripId)),
    staleTime: 1000 * 60 * 2, // 2분
  });

  // 모달
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 로딩
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // submit
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

  // 예상 총액 계산
  const predictedTotal = useMemo(() => {
    if (!budgetData || !amount || !currency || !exchangeRate) return null;

    let res = 0;

    const currentTotal = budgetData.sharedFund.balance; // 현재 total
    const currentCurrency = budgetData.sharedFund.defaultCurrency; // 기준 통화
    const isSameCurrency = currency === currentCurrency;

    const addedAmount = Number(amount) || 0;

    // currency가 다르면 환율로 변환
    const adjustedAmount = isSameCurrency
      ? addedAmount
      : addedAmount * (exchangeRate[currency] / exchangeRate[currentCurrency]);

    if (mode === 'add') {
      res = currentTotal + adjustedAmount;
    } else {
      res = currentTotal - adjustedAmount;
    }

    if (!isSameCurrency) {
      res = res * exchangeRate[currentCurrency] / exchangeRate[currency];
    }

    return Number(res.toFixed(2));
  }, [amount, currency, exchangeRate, budgetData, mode]);

  // 경비 추가/빼기 뮤테이션
  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: (payload: UpdateSharedBudgetRequestDto) => {
      if (mode === 'add') {
        return addSharedBudget(Number(tripId), payload);
      } else {
        return removeSharedBudget(Number(tripId), payload);
      }
    },
    onSuccess: () => {
      // 성공 시, Budget 관련 쿼리 리패치
      queryClient.refetchQueries({ queryKey: ['tripBudget', tripId] });
      queryClient.invalidateQueries({ queryKey: ['tripInfo', tripId] });
      queryClient.invalidateQueries({ queryKey: ['homeData'] });

      alert('공동 경비 정보를 저장했습니다.');
      router.back();
    },
    onError: (error) => {
      console.error(error);
      alert('공동 경비 정보를 저장하는데 실패했습니다.');
      router.refresh();
    },
  });

  const handleSubmit = () => {
    if (!isFormDataReady || isSubmitting) return;

    const payload: UpdateSharedBudgetRequestDto = {
      amount: Number(amount),
      exchangeRate: Number(exchangeRate[currency]),
      currency: currency,
      paymentMethod: selectedCategory || '',
      createdAt: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
    };

    mutate(payload);
  };

  if (isLoading || isBudgetLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-center">데이터 로드 중 오류가 발생했습니다. {error ?? ''}</p>
      </div>
    );
  }

  if (budgetError) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-center">데이터 로드 중 오류가 발생했습니다. {budgetError?.message ?? ''}</p>
      </div>
    );
  }

  // TODO: BottomNavBar fixed 제거 시 pb-15 제거
  return (
    <div className="w-full h-full flex flex-col items-center bg-white">
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
            handleCurrencyChange={setCurrency}
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
      {isFormDataReady && <StatusMessage result={predictedTotal} currency={currency} mode={mode} />}
    </div>
  );
};

export default SharedForm;
