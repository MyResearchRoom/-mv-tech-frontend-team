
import { useState } from 'react';
import ProspectOverviewTab from './ProspectOverviewTab';

const tabs = [
  'Overview',
  'Project Details',
  'Drawings & Documents',
  'Internal Estimation',
  'BOQ',
  'Feedback & Revisions',
  'Activity Timeline',
];

export default function ProspectDetailsTabs({ prospect }) {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-t border-slate-200 px-4 sm:px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 border-b-2 px-4 py-4 text-sm font-medium transition ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Selected Tab Content */}
      <div className="p-4 sm:p-6">
        {activeTab === 'Overview' ? (
          <ProspectOverviewTab prospect={prospect} />
        ) : (
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">
                {activeTab}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                This section will be added next.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
