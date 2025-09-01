import Image from 'next/image';

type ReceiptThumbnailProps = {
    setZoomOpen: (open: boolean) => void;
}

export default function ReceiptThumbnail({ setZoomOpen }: ReceiptThumbnailProps) {
  return (
    <div className="relative bg-grey-150 w-full h-50 rounded-xl">
      <button className="absolute top-3 right-3" onClick={() => setZoomOpen(true)}>
        <Image src="/svg/zoom-dark-green.svg" alt="확대" width={32} height={32} />
      </button>
    </div>
  );
}
