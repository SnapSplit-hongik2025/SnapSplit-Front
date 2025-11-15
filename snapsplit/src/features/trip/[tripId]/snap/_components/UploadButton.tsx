'use client';

import { RefObject } from 'react';
import Image from 'next/image';

interface UploadButtonProps {
  inputRef: RefObject<HTMLInputElement | null>;
  isScrolled: boolean;
  scrollToTop: (() => void) | null;
}

export default function UploadButton({ inputRef, isScrolled, scrollToTop }: UploadButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2 mt-auto mb-18 ml-auto mr-5 pointer-events-auto ">
      {isScrolled && (
        <button
          onClick={scrollToTop ? scrollToTop : undefined}
          className="flex items-center justify-center gap-0.5 px-2 bg-primary min-w-11 h-11 rounded-full shadow-[0px_0px_2px_0px_rgba(34,34,34,0.25)]"
        >
          <Image src="/svg/arrow-top-white.svg" alt="arrowTop" width={24} height={24} />
        </button>
      )}
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center gap-0.5 px-2 bg-primary min-w-11 h-11 rounded-full shadow-[0px_0px_2px_0px_rgba(34,34,34,0.25)]"
      >
        <Image src="/svg/plus-upload.svg" alt="plus" width={24} height={24} />
        {!isScrolled && <div className="pr-1 text-body-1 text-white">사진 업로드</div>}
      </button>
    </div>
  );
}
