import Image from "next/image";

export default function ReceiptRegisterButton() {
    return (
        <div className="flex items-center justify-center gap-1 w-full h-11 bg-primary rounded-xl">
            <Image src="/svg/snap-white.svg" alt="사진 등록" width={24} height={24} />
            <div className="text-body-1 text-white">영수증으로 등록</div>
        </div>
    );
}