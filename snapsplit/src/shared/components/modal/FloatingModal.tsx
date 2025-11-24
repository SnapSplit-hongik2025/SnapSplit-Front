'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface FloatingModalProps {
  children: ReactNode;
}

export default function FloatingModal({ children }: FloatingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setModalRoot(document.getElementById('modal-root'));
  }, []);

  if (!mounted || !modalRoot) return null;

  return createPortal(
    <div className="display-base z-floating fixed inset-0 flex items-center justify-center pointer-events-none">
      {children}
    </div>,
    modalRoot
  );
}
