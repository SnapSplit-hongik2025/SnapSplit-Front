'use client';
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ExpenseHeader() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between w-full px-5 py-3">
      <button onClick={() => router.back()}>
        <Image src="/svg/arrow-left-grey-1000.svg" alt="back" width={24} height={24} />
      </button>
      <div className="text-label-1">지출 추가하기</div>
      <div className="w-6 h-6" />
    </div>
  );
}
