'use client';

import { useQuery } from '@tanstack/react-query';
import Button from '@/shared/components/Button';
import SettlementHeader from './_components/SettlementHeader';
import SettlementInfoSection from './_components/SettlementInfoSection';
import { SettlementPageProps } from './types/settlement-type';
import Divider from '@/shared/components/Divider';
import PersonalExpensesList from './_components/PersonalExpensesList';
import { getSettlementData } from './api/settlement-api';
import { GetSettlementDto } from './types/settlement-dto-type';
import Loading from '@/shared/components/loading/Loading';

const SettlementPage = ({ tripId, settlementId, startDay, endDay }: SettlementPageProps) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery<GetSettlementDto, Error>({
    queryKey: ['settlement', tripId, settlementId],
    queryFn: () => getSettlementData(tripId, settlementId),
    enabled: !!tripId && !!settlementId,
  });

  // 1. 공유할 텍스트를 생성하는 함수
  const generateShareText = () => {
    if (!data) return '';

    const { settlementDetails } = data;

    let message = ``;
    message += `Day ${startDay} ~ Day ${endDay} 까지의 정산 내역이에요!\n\n`;

    message += `[정산 목록]\n\n`;

    if (settlementDetails.length === 0) {
      message += `- 정산할 내역이 없습니다.\n`;
    } else {
      settlementDetails.forEach((detail) => {
        const senderName = detail.sender.name || '알수없음';
        const receiverName = detail.receiver.name || '알수없음';
        const amount = detail.amount.toLocaleString();

        message += `- ${senderName} → ${receiverName} : ${amount}원\n`;
      });
    }

    return message;
  };

  // 2. [통합] 범용 공유 핸들러 (Web Share API 우선, 복사 Fallback)
  const handleUniversalShare = async () => {
    if (!data) return;

    const shareText = generateShareText();
    const shareTitle = '[SNAP SPLIT 정산 영수증]';
    const currentUrl = window.location.href;

    // 1. Web Share API 시도 (모바일 Native Share Sheet)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareTitle}\n\n${shareText}`, // 텍스트와 타이틀을 합쳐서 전송
          url: currentUrl,
        });
        return; // 성공 시 여기서 종료
      } catch (error) {
        // [수정] 실패(취소 포함) 시 콘솔에 로그만 남기고 바로 종료
        console.log('Native Share Failed or Canceled:', error);
        return; // 실패/취소 시에도 클립보드 복사 로직으로 넘어가지 않고 종료
      }
    }

    // 2. Fallback: 클립보드 복사 (Web Share API가 존재하지 않을 때만 실행됨)
    try {
      await navigator.clipboard.writeText(`${shareTitle}\n\n${shareText}`);
      alert('정산 내역이 클립보드에 복사되었습니다. 카카오톡 등 앱에 붙여넣기 하세요!');
    } catch {
      alert('공유 기능을 지원하지 않는 환경입니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-light_grey overflow-y-auto scrollbar-hide">
      <section className="flex flex-col pt-2 pb-6 px-5">
        <SettlementHeader tripId={tripId} />
        {isSuccess && data && (
          <>
            <SettlementInfoSection
              members={data.members}
              endDay={endDay}
              startDay={startDay}
              settlementDetails={data.settlementDetails}
            />
            <Button label="공유하기" onClick={handleUniversalShare} className="w-full" />
          </>
        )}
      </section>
      {isSuccess && data && (
        <>
          <Divider />
          <section className="flex flex-col px-5 pt-6 pb-8 gap-3 w-full text-body-1 mb-[60px]">
            <PersonalExpensesList
              settlementId={settlementId}
              expenses={data.personalExpenses}
              totalAmount={data.totalAmount}
              tripId={tripId}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default SettlementPage;
