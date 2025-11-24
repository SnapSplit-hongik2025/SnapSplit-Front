// 마우스와 터치 드래그 커스텀 훅
// TODO: 호출 컴포넌트에서 변경 사항 적용

import { useRef } from 'react';

type ScrollDirection = 'x' | 'y';

type DragEvent = React.MouseEvent | React.TouchEvent;

export const useDragScroll = (direction: ScrollDirection = 'x') => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const start = useRef(0);
  const scrollStart = useRef(0);

  const getEventPosition = (e: DragEvent): number => {
    if ('touches' in e) {
      const touch = e.touches[0];
      return direction === 'x' ? touch.clientX : touch.clientY;
    }
    return direction === 'x' ? (e as React.MouseEvent).pageX : (e as React.MouseEvent).pageY;
  };

  const getEventOffset = () => {
    if (!scrollRef.current) return 0;
    return direction === 'x' ? scrollRef.current.offsetLeft : scrollRef.current.offsetTop;
  };

  const handleDragStart = (e: DragEvent) => {
    isDragging.current = true;
    start.current = getEventPosition(e) - getEventOffset();
    scrollStart.current = direction === 'x' ? scrollRef.current?.scrollLeft || 0 : scrollRef.current?.scrollTop || 0;
  };

  const handleDragMove = (e: DragEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const current = getEventPosition(e) - getEventOffset();
    const walk = current - start.current;
    if (direction === 'x') {
      scrollRef.current.scrollLeft = scrollStart.current - walk;
    } else {
      scrollRef.current.scrollTop = scrollStart.current - walk;
    }
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  return {
    scrollRef,
    onMouseDown: handleDragStart,
    onMouseMove: handleDragMove,
    onMouseUp: handleDragEnd,
    onMouseLeave: handleDragEnd,
    onTouchStart: handleDragStart,
    onTouchMove: handleDragMove,
    onTouchEnd: handleDragEnd,
    onTouchCancel: handleDragEnd,
  };
};
