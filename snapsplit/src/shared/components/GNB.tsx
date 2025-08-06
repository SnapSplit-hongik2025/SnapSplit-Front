'use client';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function GNB() {
  const pathname = usePathname();
  const router = useRouter();
  const { tripId } = useParams();

  const tabs = [
    {
      label: 'BUDGET',
      iconPath: '/svg/budget-grey.svg',
      iconPathActive: '/svg/budget-green.svg',
      path: `/trip/${tripId}/budget`,
    },
    {
      label: 'SNAP',
      iconPath: '/svg/snap-grey.svg',
      iconPathActive: '/svg/snap-green.svg',
      path: `/trip/${tripId}/snap`,
    },
    {
      label: 'SPLIT',
      iconPath: '/svg/split-grey.svg',
      iconPathActive: '/svg/split-green.svg',
      path: `/trip/${tripId}/split`,
    },
  ];

  return (
    <nav className="fixed bottom-0 h-15 display-w-full border-t border-grey-250 bg-white z-navbar">
      <div className="flex w-full items-center py-[9px]">
        {tabs.map((tab) => {
          const isActive = isActiveTab(pathname, tab.path);
          return (
            <button
              key={tab.label}
              onClick={() => router.push(tab.path)}
              className="flex flex-col items-center w-full cursor-pointer"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {isActive ? (
                  <Image src={tab.iconPathActive} alt={`${tab.label} icon`} width={24} height={24} unoptimized />
                ) : (
                  <Image src={tab.iconPath} alt={`${tab.label} icon`} width={24} height={24} unoptimized />
                )}
              </div>
              <span className={`text-caption-1 ${isActive ? 'text-green' : 'text-grey-550'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const isActiveTab = (pathname: string, tabPath: string) => {
  // pathname이 tabPath로 시작하는지 확인
  return pathname === tabPath || pathname.startsWith(`${tabPath}/`);
};