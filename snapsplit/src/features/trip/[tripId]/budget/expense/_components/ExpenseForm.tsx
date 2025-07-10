'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CurrencyList from '@/features/trip/[tripId]/budget/expense/_components/CurrencyList';
import ExpenseSection from './ExpenseSection';
import calendar from '@public/svg/calendar.svg';
import { useRouter } from 'next/navigation';
import CalendarSheet from './CalendarSheet';
import CategorySection from './CategorySection';
import { format } from 'date-fns';
import StatusMessage from './StatusMessage';

// TODO: FormData 타입 정의
type ExpenseFormProps = {
  mode: 'add' | 'remove'; // '추가하기' | '빼기'
  onSubmit: (data: FormData) => void;
};

// TODO: result 값 API 호출 후 받아오기
const result = '$9805596000000';

const ExpenseForm = ({ mode, onSubmit }: ExpenseFormProps) => {
  const isAdd = mode === 'add';
  const [amount, setAmount] = useState('');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [currency, setCurrency] = useState<string>('미국 - USD(달러)');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFormDataReady, setIsFormDataReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (amount && currency && selectedDate && selectedCategory) {
      setIsFormDataReady(true);
    } else {
      setIsFormDataReady(false);
    }
  }, [amount, currency, selectedDate, selectedCategory]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('amount', amount.toString());
    formData.append('currency', currency);
    formData.append('date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
    onSubmit(formData);
  };

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
        <ExpenseSection
          currency={currency}
          amount={amount}
          setAmount={setAmount}
          isCurrencyOpen={isCurrencyOpen}
          setIsCurrencyOpen={setIsCurrencyOpen}
        />
        {isCurrencyOpen && <CurrencyList onClose={() => setIsCurrencyOpen(false)} setCurrency={setCurrency} selectedCurrency={currency} />}

        {/* date section */}
        <div className="flex flex-col pt-6 gap-3">
          <div className="text-label-2">날짜</div>
          <div className="flex items-center justify-between h-12 px-4 rounded-xl border border-grey-350">
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
          disabled={!isFormDataReady}
        >
          {isAdd ? '추가하기' : '빼기'}
        </button>
      </div>

      {/* Toast */}
      {isFormDataReady && <StatusMessage result={result} />}
    </div>
  );
};

export default ExpenseForm;
