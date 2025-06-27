'use client';

import { motion } from 'framer-motion';

type Props = {
  onClose: () => void;
};

const FullExpenseModal = ({ onClose }: Props) => {
  return (
    <motion.div
      initial={{ y: '100%' }} // 아래에서 시작
      animate={{ y: 0 }} // 올라오기
      exit={{ y: '100%' }} // 아래로 사라짐
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-white flex flex-col"
    >
      <button onClick={onClose} className="p-4 text-right text-grey-700">
        닫기 ✕
      </button>
      <div className="flex-1 overflow-y-auto px-4">
        <h2 className="text-xl font-bold mb-4">전체 지출 내역</h2>
        {/* 내용 들어갈 부분 */}
      </div>
    </motion.div>
  );
};

export default FullExpenseModal;
