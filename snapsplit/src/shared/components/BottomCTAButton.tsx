import { motion } from 'framer-motion';

type BottomCTAButtonProps = {
  label: string;
  onClick: () => void;
};

const BottomCTAButton = ({ label, onClick }: BottomCTAButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="flex w-full cursor-pointer p-3 bg-primary rounded-xl shadow-[0px_-2px_10px_0px_rgba(108,108,108,0.12)] justify-center items-center text-label-1 text-neutral-50"
    >
      {label}
    </motion.button>
  );
};

export default BottomCTAButton;
