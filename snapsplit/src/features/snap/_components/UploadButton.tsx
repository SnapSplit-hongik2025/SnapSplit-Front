import { RefObject } from 'react';

interface UploadButtonProps {
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function UploadButton({ inputRef }: UploadButtonProps) {
    return (
      <div className="fixed bottom-24 right-4">
        <button
          onClick={() => inputRef.current?.click()}
          className="bg-black text-white px-4 py-2 rounded-full shadow-md"
        >
          + 사진 업로드
        </button>
      </div>
    );
  }