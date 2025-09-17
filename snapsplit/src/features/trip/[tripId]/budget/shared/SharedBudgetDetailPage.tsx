'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import LogSection from '@/features/trip/[tripId]/budget/shared/_components/LogSection';
import BudgetOverview from '@/features/trip/[tripId]/budget/shared/_components/BudgetOverview';
import { useState } from 'react';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import CurrencyBottomSheet from '@/features/trip/[tripId]/budget/shared/_components/CurrencyBottomSheet';
import { useEffect } from 'react';
import { getSharedBudgetData } from '@/features/trip/[tripId]/budget/api/budget-api';
import { getKorName } from '@/shared/utils/currency';
import { GetSharedBudgetDto } from '@/features/trip/[tripId]/budget/types/budget-dto-type';

const SharedBudgetDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const tripId: number = Number(params.tripId);
  const [isOpen, setIsOpen] = useState(false);
  const [sharedBudgetData, setSharedBudgetData] = useState<GetSharedBudgetDto | null>(null);

  useEffect(() => {
    getSharedBudgetData(tripId)
      .then((res) => setSharedBudgetData(res))
      .catch((e) => console.error(e));
  }, [tripId]);

  if (!sharedBudgetData) return null;

  // TO TELL : "공동경비 세부내역" weight 가 700 인데 tailwind.config.js 에 해당하는 속성이 없음
  // TO TELL : 대표 통화 오른쪽에 오는 글씨 text-body-2 로 설정해뒀는데 weight 가 500 이어야 함
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between w-full px-5 py-3">
        <button onClick={() => router.back()}>
          <Image src="/svg/arrow-left-grey-1000.svg" alt="뒤로" width={24} height={24} />
        </button>
        <div className="text-label-1">공동경비 세부내역</div>
        <div className="w-6 h-6" />
      </div>
      <div className="px-5">
        <div className="pt-2">
          <div className="flex items-center justify-between p-4 bg-pale_green rounded-xl">
            <div className="flex items-center gap-1.5">
              <div className="px-2 py-0.5 bg-primary rounded-full text-body-1 text-white">대표통화</div>
              <div className="text-body-2">{sharedBudgetData.defaultCurrency}({getKorName(sharedBudgetData.defaultCurrency)})</div>
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="text-body-2 text-grey-450">
              변경
            </button>
          </div>
        </div>
      </div>

      <LogSection defaultCurrency={sharedBudgetData.defaultCurrency} sharedBudgetLog={sharedBudgetData.sharedBudgetDetails} />

      <BudgetOverview totalSharedBudget={sharedBudgetData.totalSharedBudget} />

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CurrencyBottomSheet
          onClose={() => setIsOpen(false)}
          selectedCurrency={sharedBudgetData.defaultCurrency}
          setCurrency={(currency) => setSharedBudgetData({ ...sharedBudgetData, defaultCurrency: currency })}
          availableCurrencies={sharedBudgetData.totalSharedBudget.map((budget) => budget.currency)}
        />
      </BottomSheet>
    </div>
  );
};

export default SharedBudgetDetailPage;
