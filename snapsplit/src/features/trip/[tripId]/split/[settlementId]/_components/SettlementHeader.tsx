import Image from 'next/image';
import arrow from '@public/svg/arrow-left-grey-1000.svg';
import Link from 'next/link';
import { SettlementHeaderProps } from '../types/settlement-type';

export default function SettlementHeader({ tripId }: SettlementHeaderProps) {
  return (
    <header className="flex py-3">
      <Link href={`/trip/${tripId}/split`}>
        <Image src={arrow} alt="back button" />
      </Link>
    </header>
  );
}
