import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function ReceiptRegisterButton() {
  const params = useParams();
  const tripId = params.tripId as string;
  const router = useRouter();

  const handleClick = () => {
    router.push(`/trip/${tripId}/budget/expense/receipt`);
  };
  return (
    <button
      className="flex items-center justify-center gap-1 w-full h-11 bg-primary rounded-xl cursor-pointer"
      onClick={handleClick}
    >
      <Image src="/svg/snap-white.svg" alt="사진 등록" width={24} height={24} />
      <div className="text-body-1 text-white">영수증으로 등록</div>
    </button>
  );
}
