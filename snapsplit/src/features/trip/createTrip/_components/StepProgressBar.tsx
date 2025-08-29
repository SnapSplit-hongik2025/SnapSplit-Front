'use client';

import { motion } from 'framer-motion';
import { StepProgressBarProps } from '@/features/trip/createTrip/types/type';

const StepProgressBar = ({ step }: StepProgressBarProps) => {
  return (
    <div className="flex gap-1 pt-[18px] pb-6 px-5">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ backgroundColor: '#E8E8E8' }} // grey-250
          animate={{ backgroundColor: i <= step ? '#41D596' : '#E8E8E8' }} // 선택 시 primary, 아니면 grey-250
          transition={{ duration: 0.3 }}
          className="h-1 flex-1 rounded"
        />
      ))}
    </div>
  );
};

export default StepProgressBar;
