'use client';

import { useEffect } from 'react'; // useEffect 추가
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

declare global {
  interface Window {
    Kakao: {
      init: (key: string | undefined) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (settings: KakaoShareSettings) => void;
      };
    };
  }
}

interface KakaoShareSettings {
  objectType: 'feed' | 'list' | 'location' | 'commerce' | 'text';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

const SettlementPage = ({ tripId, settlementId, startDay, endDay }: SettlementPageProps) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery<GetSettlementDto, Error>({
    queryKey: ['settlement', tripId, settlementId],
    queryFn: () => getSettlementData(tripId, settlementId),
    enabled: !!tripId && !!settlementId,
  });

  // 1. 카카오 SDK 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Kakao) {
      // 이미 초기화되었는지 확인
      if (!window.Kakao.isInitialized()) {
        // 여기에 발급받은 JavaScript 키를 입력하세요 (.env 파일 사용 권장)
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }
    }
  }, []);

  // 2. 카카오톡 공유 핸들러 (피드 템플릿 사용)
  const handleKakaoShare = () => {
    if (!data || !window.Kakao) {
      alert('카카오톡 공유 기능을 사용할 수 없습니다.');
      return;
    }

    const { settlementDetails } = data;

    // 공유 메시지 본문 구성 (최대 5줄 정도가 적당)
    let description = `Day ${startDay} ~ Day ${endDay} 정산 내역입니다.\n\n[송금 목록]\n`;

    if (settlementDetails.length === 0) {
      description += '정산할 내역이 없습니다.';
    } else {
      // 너무 길면 잘릴 수 있으므로 상위 몇 개만 보여주거나 요약하는 것이 좋습니다.
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
        title: '💸 SNAP SPLIT 정산 영수증 도착!',
        description: description,
        imageUrl: 'https://your-service-domain.com/images/og-settlement.png', // [수정 필요] 정산 관련 썸네일 이미지 URL (필수 아님)
        link: {
          // [수정 필요] 클릭 시 이동할 웹 페이지 URL (보통 현재 정산 페이지)
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '정산 내역 자세히 보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  };

  // 3. 텍스트 복사 핸들러 (기존 유지 - 백업용)
  const handleCopyText = async () => {
    if (!data) return;
    // ... (기존 텍스트 생성 로직 활용)
    let message = `[SNAP SPLIT 정산 영수증]\nDay ${startDay} ~ Day ${endDay}\n\n`;
    data.settlementDetails.forEach((detail) => {
      message += `- ${detail.sender.name} → ${detail.receiver.name} : ${detail.amount.toLocaleString()}원\n`;
    });

    try {
      await navigator.clipboard.writeText(message);
      alert('정산 내역이 클립보드에 복사되었습니다!');
    } catch {
      alert('복사에 실패했습니다.');
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

            <div className="flex gap-2 w-full mt-4">
              {/* 텍스트 복사 버튼 (선택 사항) */}
              <Button label="텍스트 복사" onClick={handleCopyText} bg="bg-grey-300 text-grey-800" className="flex-1" />
              {/* 카카오톡 공유 버튼 */}
              <Button
                label="카카오톡 공유"
                onClick={handleKakaoShare}
                bg="bg-[#FEE500] text-[#191919]" // 카카오톡 브랜드 컬러
                className="flex-1"
              />
            </div>
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
