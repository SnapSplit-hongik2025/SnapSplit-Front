'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type ModalMotionWrapperProps = {
  children: ReactNode;
};

const ModalMotionWrapper = ({ children }: ModalMotionWrapperProps) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-white flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default ModalMotionWrapper;
