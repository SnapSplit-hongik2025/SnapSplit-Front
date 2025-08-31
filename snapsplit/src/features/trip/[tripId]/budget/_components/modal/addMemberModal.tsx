'use client';

import Image from 'next/image';
import { motion, useMotionValue, useDragControls, animate } from 'framer-motion';
import grabber from '@public/svg/grabber.svg';
import Button from '@/shared/components/Button'; // Button 컴포넌트 사용을 위해 import

// 1. props 타입에 isLoading, isError 추가
type AddMemberModalProps = {
  onClose?: () => void;
  tripCode?: string;
  isLoading: boolean;
  isError: boolean;
};

// 2. 컴포넌트가 받을 props에 isLoading, isError 추가
const AddMemberModal = ({ onClose, tripCode, isLoading, isError }: AddMemberModalProps) => {
  const y = useMotionValue(0);
  const controls = useDragControls();

  const handleCopy = async () => {
    if (!tripCode) return; // tripCode가 없을 때 복사 방지
    if (!window.isSecureContext || !navigator.clipboard) {
      alert('현재 환경에서 복사가 지원되지 않습니다. HTTPS 환경 또는 최신 브라우저에서 시도해 주세요.');
      return;
    }
    try {
      await navigator.clipboard.writeText(tripCode);
      alert('코드가 복사되었습니다!');
    } catch (err) {
      console.error('복사 실패:', err);
      alert('복사에 실패했습니다.');
    }
  };

  const animateAndClose = async () => {
    await animate(y, 500, { type: 'tween', duration: 0.2, ease: 'easeIn' });
    if (onClose) {
      onClose();
    }
  };

  // 3. 로딩/에러/성공 상태에 따라 다른 UI를 보여주는 내부 렌더링 함수
  const renderContent = () => {
    if (isLoading) {
      return <div className="flex-1 flex items-center justify-center text-grey-550">초대 코드를 불러오는 중...</div>;
    }

    if (isError) {
      return (
        <div className="flex-1 flex items-center justify-center text-status_error">
          코드를 불러오는 데 실패했습니다.
        </div>
      );
    }

    if (tripCode) {
      return (
        <>
          <div className="flex pb-3 flex-col gap-1 items-center justify-center">
            <label className="text-grey-550 text-body-2">초대 코드</label>
            <p className="text-title-1 py-2">{tripCode}</p>
          </div>
          <Button label="복사하기" onClick={handleCopy} />
        </>
      );
    }

    return null; // 데이터가 없는 비정상적인 경우
  };

  return (
    <motion.div
      style={{ y }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      // 모달의 기본 높이를 auto로 설정하여 내용에 맞게 조절되도록 합니다.
      className="w-full min-h-[200px] bg-white rounded-t-[20px] px-5 pb-8 flex flex-col items-center"
      drag="y"
      dragListener={false}
      dragControls={controls}
      onDrag={(e, info) => {
        if (info.offset.y > 0) y.set(info.offset.y);
        else y.set(0);
      }}
      onDragEnd={() => {
        if (y.get() > 50) {
          // 드래그 민감도를 조금 낮춤
          animateAndClose();
        } else {
          animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
        }
      }}
    >
      <div
        className="flex w-full justify-center py-3 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => controls.start(e)}
      >
        <Image src={grabber} alt="handle modal" />
      </div>

      {renderContent()}
    </motion.div>
  );
};

export default AddMemberModal;
