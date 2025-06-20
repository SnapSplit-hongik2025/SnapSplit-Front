'use client';

import { ActiveTab } from '../type';

interface TabSelectorProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const tabs = ['전체', '폴더별'];

export default function TabSelector({ activeTab, setActiveTab }: TabSelectorProps) {

  return (
    <div className="flex h-11 border-b border-grey-250 text-body-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as ActiveTab)}
          className={`transition-colors duration-200 w-full ${
            activeTab === tab
              ? 'border-b-1 border-black'
              : ''
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
