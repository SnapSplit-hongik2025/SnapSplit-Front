'use client';

import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Layer } from './type';

type ModalProps = {
  children: ReactNode;
  layer: Layer;
};

export default function Modal({ children, layer }: ModalProps) {
  const layerVariants = {
    base: 'z-base',
    navbar: 'z-navbar',
    dropdown: 'z-dropdown',
    floating: 'z-floating',
    backdrop: 'z-backdrop',
    overlay: 'z-overlay',
    fullscreen: 'z-fullscreen',
    toast: 'z-toast',
  };

  return createPortal(
    <div className={`display-base ${layerVariants[layer]} fixed inset-0 flex items-center justify-center`}>
      {children}
    </div>,
    document.getElementById('modal-root')!
  );
}
