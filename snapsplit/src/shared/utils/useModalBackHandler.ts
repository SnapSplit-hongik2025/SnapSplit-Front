// hooks/useModalBackHandler.ts
import { useEffect } from 'react';

export function useModalBackHandler(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    // 중복 push 방지
    if (window.history.state?.modal !== true) {
      window.history.pushState({ modal: true }, '');
    }

    const handlePopState = () => {
      onClose(); // 브라우저 뒤로가기 시 모달 닫기
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);
}
