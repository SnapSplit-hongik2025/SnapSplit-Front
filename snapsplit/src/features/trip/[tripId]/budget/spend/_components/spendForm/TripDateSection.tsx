import Image from "next/image";

export default function TripDateSection() {
    return (
        <div className="flex flex-col items-start w-full gap-3">
            <div className="text-body-3">여행 일자</div>
            <button className="flex items-center gap-3 w-full h-12 px-4 rounded-xl border-[1px] border-grey-250">
                <div className="flex-1 text-body-3 text-start">Day 1</div>
                <Image src="/svg/arrow-bottom-grey-450.svg" alt="open" width={24} height={24} />
            </button>
        </div>
    );
}