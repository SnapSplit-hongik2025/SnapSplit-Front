import Image from 'next/image'

type ReceiptThumbnailProps = {
  setZoomOpen: (open: boolean) => void
  receiptUrl: string | null
}

export default function ReceiptThumbnail({ setZoomOpen, receiptUrl }: ReceiptThumbnailProps) {
  return (
    <div className="relative bg-grey-150 w-full h-50 rounded-xl overflow-hidden">
      {/* 확대 버튼 */}
      <button
        className="absolute top-3 right-3 z-10"
        onClick={() => setZoomOpen(true)}
      >
        <Image src="/svg/zoom-dark-green.svg" alt="확대" width={32} height={32} />
      </button>

      {/* 이미지 */}
      {receiptUrl && (
        <Image
          src={receiptUrl}
          alt="영수증"
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      )}
    </div>
  )
}