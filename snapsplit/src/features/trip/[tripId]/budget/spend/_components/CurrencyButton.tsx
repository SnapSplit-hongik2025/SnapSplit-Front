import Image from "next/image";

export default function CurrencyButton() {
    return (
        <button className="flex items-center h-8 pl-3 pr-1.5 py-1 bg-white rounded-3xl border-[1px] border-grey-250">
            <div className="text-body-3">USD(달러)</div>
            <Image src="/svg/arrow-bottom-grey-450.svg" alt="back" width={24} height={24} />
        </button>
    );
}