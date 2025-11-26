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

  // 2. [통합] 범용 공유 핸들러 (카카오 우선 3단계 폴백)
  const handleUniversalShare = async () => {
    if (!data) return;

    const shareText = generateShareText();
    const shareTitle = '[SNAP SPLIT 정산 영수증]';
    const currentUrl = window.location.href;
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

    // --- Tier 1: Kakao Rich Template 시도 (성공하면 바로 종료) ---
    if (typeof window.Kakao !== 'undefined') {
      try {
        // 안전 장치: 초기화가 안 되었으면 초기화 시도 (레이아웃에서 로드 실패 대비)
        if (!window.Kakao.isInitialized() && apiKey) {
          window.Kakao.init(apiKey);
        }

        if (window.Kakao.isInitialized()) {
          const { settlementDetails } = data;
          let description = `Day ${startDay} ~ Day ${endDay} 정산 내역입니다.\n\n[송금 목록]\n`;

          if (settlementDetails.length === 0) {
            description += '정산할 내역이 없습니다.';
          } else {
            settlementDetails.slice(0, 5).forEach((detail) => {
              const senderName = detail.sender.name || '알수없음';
              const receiverName = detail.receiver.name || '알수없음';
              const amount = detail.amount.toLocaleString();
              description += `• ${senderName} → ${receiverName} : ${amount}원\n`;
            });

            if (settlementDetails.length > 5) {
              description += `...외 ${settlementDetails.length - 5}건`;
            }
          }

          window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: 'SNAP SPLIT 정산 영수증 도착!',
              description: description,
              imageUrl:
                'https://file.notion.so/f/f/c12b61e8-004b-4c24-a22f-9a1e3ce70c4b/c9b7539c-3a9b-4fbf-b278-d6c2bd70031f/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2025-11-27_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_3.55.33.png?table=block&id=2b767ed1-3cf8-80e5-a584-db6c04edd368&spaceId=c12b61e8-004b-4c24-a22f-9a1e3ce70c4b&expirationTimestamp=1764288000000&signature=xPkV4s_HlEfFXnt0kWTofnM6TTOf3wYnGZIRxKqUxM0&downloadName=%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2025-11-27+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+3.55.33.png',
              link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
            },
            buttons: [
              {
                title: '정산 내역 자세히 보기',
                link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
              },
            ],
          });
          return; // 카카오 공유 성공 (또는 실행) 시 여기서 종료
        }
      } catch (error) {
        console.log('Kakao Rich Template execution failed, falling back:', error);
        // Fall through to Tier 2
      }
    }

    // --- Tier 2: Web Share API 시도 (General/Native Share Sheet) ---
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareTitle}\n\n${shareText}`,
          url: currentUrl,
        });
        return; // 성공 또는 취소 시 여기서 종료
      } catch (error) {
        console.log('Native Share failed, falling back to Clipboard:', error);
        // Fall through to Tier 3
      }
    }

    // --- Tier 3: Final Fallback (클립보드 복사) ---
    try {
      await navigator.clipboard.writeText(`${shareTitle}\n\n${shareText}`);
      alert('공유 기능을 지원하지 않아 클립보드에 복사되었습니다. 다른 앱에 붙여넣기 하세요!');
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
            <Button label="카카오톡으로 공유하기" onClick={handleUniversalShare} className="w-full" />
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
