'use client';
import Image from 'next/image';
import close from '@public/svg/close-grey-1000.svg';
import { useRouter } from 'next/navigation';

export default function EditLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full min-h-[100vh]">
      <div className="flex px-5 py-3 justify-end cursor-pointer">
        <Image src={close} alt="close" onClick={() => router.back()} />
      </div>
      {children}
    </div>
  );
}
