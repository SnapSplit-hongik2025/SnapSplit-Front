'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import LogSection from '@/features/trip/[tripId]/budget/shared/_components/LogSection';
import BudgetOverview from '@/features/trip/[tripId]/budget/shared/_components/BudgetOverview';
import { useState } from 'react';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import CurrencyBottomSheet from '@/features/trip/[tripId]/budget/shared/_components/CurrencyBottomSheet';
import { getSharedBudgetData } from '@/features/trip/[tripId]/budget/api/budget-api';
import { getKorName } from '@/shared/utils/currency';
import { updateDefaultCurrency } from '@/features/trip/[tripId]/budget/api/budget-api';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { GetSharedBudgetDto } from '@/features/trip/[tripId]/budget/types/budget-dto-type';

const SharedBudgetDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const tripId: number = Number(params.tripId);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // 공유 예산 데이터를 가져오는 쿼리
  const { data: sharedBudgetData, isLoading } = useQuery({
    queryKey: ['sharedBudget', tripId],
    queryFn: () => getSharedBudgetData(tripId),
  });

  // 기본 통화 업데이트 뮤테이션
  const { mutate: updateCurrency } = useMutation({
    mutationFn: (currency: string) => updateDefaultCurrency(tripId, currency),
    onMutate: async (newCurrency) => {
      // 낙관적 업데이트를 위해 현재 쿼리 데이터 저장
      await queryClient.cancelQueries({ queryKey: ['sharedBudget', tripId] });
      const previousData = queryClient.getQueryData(['sharedBudget', tripId]);

      // 새 데이터로 낙관적 업데이트
      queryClient.setQueryData(['sharedBudget', tripId], (old: GetSharedBudgetDto) => ({
        ...old,
        defaultCurrency: newCurrency,
      }));

      return { previousData };
    },
    onError: (err, newCurrency, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      queryClient.setQueryData(['sharedBudget', tripId], context?.previousData);
      alert('통화 변경에 실패했습니다.');
    },
    onSettled: async () => {
      // 성공이든 실패든 항상 최신 데이터로 다시 가져오기
      await queryClient.refetchQueries({ queryKey: ['sharedBudget', tripId] });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tripBudget', String(tripId)] });
    },
  });

  const beforeTripData =
    sharedBudgetData?.sharedBudgetDetails?.filter(
      (item) => new Date(item.date) < new Date(sharedBudgetData.tripStartDate)
    ) || [];

  const handleCurrencyChange = async (currency: string) => {
    try {
      await updateCurrency(currency);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!sharedBudgetData) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  // TO TELL : "공동경비 세부내역" weight 가 700 인데 tailwind.config.js 에 해당하는 속성이 없음
  // TO TELL : 대표 통화 오른쪽에 오는 글씨 text-body-2 로 설정해뒀는데 weight 가 500 이어야 함
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between w-full px-5 py-3">
        <button
          onClick={() => {
            router.back();
          }}
        >
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
              <div className="text-body-2">
                {sharedBudgetData.defaultCurrency}({getKorName(sharedBudgetData.defaultCurrency)})
              </div>
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="text-body-2 text-grey-450">
              변경
            </button>
          </div>
        </div>
      </div>

      <LogSection
        defaultCurrency={sharedBudgetData.defaultCurrency}
        sharedBudgetLog={sharedBudgetData.sharedBudgetDetails}
        beforeTripData={beforeTripData || []}
      />

      <BudgetOverview totalSharedBudget={sharedBudgetData.totalSharedBudget} />

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CurrencyBottomSheet
          onClose={() => setIsOpen(false)}
          selectedCurrency={sharedBudgetData.defaultCurrency}
          handleCurrencyChange={handleCurrencyChange}
          availableCurrencies={sharedBudgetData.availCurrencies}
        />
      </BottomSheet>
    </div>
  );
};

export default SharedBudgetDetailPage;
