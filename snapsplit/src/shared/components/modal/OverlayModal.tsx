'use client';

import Modal from './Modal';
import { usePreventScroll } from '@/shared/components/modal/usePreventScroll';
import { ReactNode, useRef } from 'react';

type OverlayModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: 'center' | 'bottom' | 'top';
  className?: string;
};

export default function OverlayModal({
  isOpen,
  onClose,
  children,
  position = 'bottom',
  className = '',
}: OverlayModalProps) {
  usePreventScroll(isOpen);

  const modalBackground = useRef<HTMLDivElement>(null);

  const positionClasses = {
    center: 'items-center',
    bottom: 'items-end',
    top: 'items-start',
  };

  if (!isOpen) return null;

  return (
    <Modal layer="overlay">
      <div
        className={`w-full h-full bg-black/40 flex ${positionClasses[position]} justify-center ${className}`}
        ref={modalBackground}
        onClick={(e) => {
          if (e.target === modalBackground.current) {
            onClose();
          }
        }}
      >
        {children}
      </div>
    </Modal>
  );
}
