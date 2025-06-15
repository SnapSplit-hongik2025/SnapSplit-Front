'use client';

import { ActiveTab } from '../type';

interface TabSelectorProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const tabs = ['전체', '폴더별'];

export default function TabSelector({ activeTab, setActiveTab }: TabSelectorProps) {

  return (
    <div className="flex justify-around mt-4 border-b border-grey-250">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as ActiveTab)}
          className={`pb-2 transition-colors duration-200 w-full ${
            activeTab === tab
              ? 'font-semibold text-black border-b-2 border-black'
              : 'text-grey-450'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
