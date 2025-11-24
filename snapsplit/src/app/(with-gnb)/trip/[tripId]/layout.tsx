import GNB from '@/shared/components/GNB';

export default function TripLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GNB />
    </>
  );
}
