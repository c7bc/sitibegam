"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: string;
}

interface TabsSectionProps {
  tabs: Tab[];
  defaultTab?: string;
}

export default function TabsSection({ tabs, defaultTab }: TabsSectionProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Mobile Select */}
        <div className="w-full md:hidden">
          <div className="relative grid w-full items-center">
            <select
              aria-label="Tabs"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="appearance-none bg-primary px-3.5 py-2.5 text-md font-medium text-primary shadow-xs ring-1 ring-primary outline-hidden transition duration-100 ease-linear ring-inset placeholder:text-fg-quaternary focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:bg-disabled_subtle disabled:text-disabled"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="pointer-events-none absolute right-3.5 size-5 text-fg-quaternary"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden w-full md:block">
          <div className="relative flex gap-3 border-b border-border-secondary">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`z-10 flex h-max cursor-pointer items-center justify-center gap-2 whitespace-nowrap transition duration-100 ease-linear text-sm font-semibold px-1 pb-2.5 pt-0 border-b-2 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  activeTab === tab.id
                    ? "border-fg-brand-primary_alt text-brand-secondary"
                    : "border-transparent text-quaternary hover:text-secondary"
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="hidden size-max items-center whitespace-nowrap py-0.5 px-2 text-xs font-medium bg-utility-gray-50 text-utility-gray-700 ring-1 ring-inset ring-utility-gray-200 transition-inherit-all md:flex -my-px">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8 md:mt-12">
          {activeTabData && (
            <div className="prose max-w-none">
              {activeTabData.content}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
