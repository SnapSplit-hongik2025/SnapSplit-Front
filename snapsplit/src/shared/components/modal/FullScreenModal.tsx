'use client';

import { ReactNode } from 'react';
import Modal from './Modal';
import { usePreventScroll } from '@/shared/components/modal/usePreventScroll';

type FullScreenModalProps = {
  children: ReactNode;
};

export default function FullScreenModal({ children }: FullScreenModalProps) {
  usePreventScroll(true);
  return <Modal layer="fullscreen">{children}</Modal>;
}
