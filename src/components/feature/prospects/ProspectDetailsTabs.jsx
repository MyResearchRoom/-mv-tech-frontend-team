
// import { useState } from 'react';
// import ProspectOverviewTab from './ProspectOverviewTab';
// import ProspectProspectTab from './prospectProjectTab';
// import ProspectDocument from './prospectDocument';

// const tabs = [
//   'Overview',
//   'Project Details',
//   'Drawings & Documents',
//   'Internal Estimation',
//   'BOQ',
//   'Feedback & Revisions',
//   'Activity Timeline',
// ];

// export default function ProspectDetailsTabs({ prospect }) {
//   const [activeTab, setActiveTab] = useState('Overview');

//   return (
//     <div>
//       {/* Tab Navigation */}
//       <div className="flex overflow-x-auto border-t border-slate-200 px-4 sm:px-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             type="button"
//             onClick={() => setActiveTab(tab)}
//             className={`shrink-0 border-b-2 px-4 py-4 text-sm font-medium transition ${
//               activeTab === tab
//                 ? 'border-blue-600 text-blue-600'
//                 : 'border-transparent text-slate-500 hover:text-slate-800'
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       <div className="p-3 md:p-4">
//         {activeTab === 'Overview' ? (
//           <ProspectOverviewTab prospect={prospect} />
//         ) : activeTab === 'Project Details' ? (
//           <ProspectProspectTab prospect={prospect} />
//         ) : activeTab === 'Drawings & Documents' ? (
//           <ProspectDocument prospectId={prospect.id} />
//         ) : (
//           <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
//             <div className="text-center">
//               <p className="text-sm font-semibold text-slate-700">
//                 {activeTab}
//               </p>
//               <p className="mt-1 text-xs text-slate-500">
//                 This section will be added next.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import ProspectOverviewTab from './ProspectOverviewTab';
import ProspectProspectTab from './prospectProjectTab';
import ProspectDocument from './prospectDocument';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsDropdownOpen(false);
  };

  return (
    <div>
      <div className="relative border-t border-slate-200 px-4 pt-3 pb-1 md:hidden">
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between rounded-lg  px-4 py-2 text-sm font-semibold transition ${
            isDropdownOpen
              ? 'border border-blue-500 bg-blue-50 text-blue-700'
              : 'border-2 border-blue-500 bg-white text-slate-700'
          }`}
          aria-expanded={isDropdownOpen}
        >
          <span>{activeTab}</span>

          {isDropdownOpen ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute left-4 right-4 top-full z-30 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`block w-full px-4 py-3 text-left text-sm transition ${
                  activeTab === tab
                    ? 'bg-blue-50 font-semibold text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>


      <div className="pt-1 hidden overflow-x-auto border-t border-slate-200 px-4 md:flex sm:px-6 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => handleTabChange(tab)}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 bg-blue-50 rounded-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100 hover:rounded-lg'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

   
      <div className="p-3 md:p-4 ">
        {activeTab === 'Overview' ? (
          <ProspectOverviewTab prospect={prospect} />
        ) : activeTab === 'Project Details' ? (
          <ProspectProspectTab prospect={prospect} />
        ) : activeTab === 'Drawings & Documents' ? (
          <ProspectDocument prospectId={prospect.id} />
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
