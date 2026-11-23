// import { useState } from 'react';
// import { Plus } from 'lucide-react';
// import { useDispatch } from 'react-redux';
// import { openAddCompany } from '@/store/slices/uiSlice';
// import AccessControlTab from '@/components/feature/settings/AccessControlTab';
// import CompanyDetailsTab from '@/components/feature/settings/CompanyDetailsTab';
// import CompanyListTab from '@/components/feature/settings/CompanyListTab';
// import EmployeeManagementTab from '@/components/feature/settings/EmployeeManagementTab';
// import SettingsTabNavigation from '@/components/feature/settings/SettingsTabNavigation';
// import UserCompanyAccessTab from '@/components/feature/settings/UserCompanyAccessTab';

// export default function SettingsPage() {
//   const dispatch = useDispatch();
//   const [activeTab, setActiveTab] = useState('list');
//   const [selectedCompany, setSelectedCompany] = useState(null);

//   const handleView = (company) => {
//     setSelectedCompany(company);
//     setActiveTab('details');
//   };

//   const handleEdit = (company) => {
//     setSelectedCompany(company);
//     dispatch(openAddCompany(company.id));
//   };

//   const tabContent = {
//     details: (
//       <CompanyDetailsTab
//         company={selectedCompany}
//         onEdit={handleEdit}
//       />
//     ),
//     access: <UserCompanyAccessTab />,
//     employee: <EmployeeManagementTab />,
//     control: <AccessControlTab />,
//   }[activeTab];

//   return (
//     <section className="w-full space-y-5 pb-6">
//       <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">
//             Multi-Company ERP
//           </p>
//           <h1 className="mt-1 text-lg md:text-xl lg:text-2xl font-semibold text-slate-900">
//             System Settings
//           </h1>
//           <p className="mt-0.2 text-[10px] md:text-xs text-slate-500 sm:text-sm">
//             Manage company information, employees, user access and system permissions.
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => dispatch(openAddCompany())}
//           className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-1.5 md:py-2 lg:py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
//         >
//           <Plus size={17} /> New Company
//         </button>
//       </header>
//       <SettingsTabNavigation activeTab={activeTab} onChange={setActiveTab} />
//       {activeTab === 'list' ? (
//         <CompanyListTab
//           onView={handleView}
//           onEdit={handleEdit}
//         />
//       ) : tabContent}
//     </section>
//   );
// }

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openAddCompany } from '@/store/slices/uiSlice';

import AccessControlTab from '@/components/feature/settings/AccessControlTab';
import CompanyDetailsTab from '@/components/feature/settings/CompanyDetailsTab';
import CompanyListTab from '@/components/feature/settings/CompanyListTab';
import EmployeeManagementTab from '@/components/feature/settings/EmployeeManagementTab';
import SettingsTabNavigation from '@/components/feature/settings/SettingsTabNavigation';
import UserCompanyAccessTab from '@/components/feature/settings/UserCompanyAccessTab';

const settingsTabs = [
  { value: 'list', label: 'Company List' },
  { value: 'details', label: 'Company Details' },
  { value: 'access', label: 'User Company Access' },
  { value: 'employee', label: 'Employee Management' },
  { value: 'control', label: 'Access Control' },
];

export default function SettingsPage() {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('list');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleView = (company) => {
    setSelectedCompany(company);
    setActiveTab('details');
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    dispatch(openAddCompany(company.id));
  };

  const tabContent = {
    details: (
      <CompanyDetailsTab
        company={selectedCompany}
        onEdit={handleEdit}
      />
    ),
    access: <UserCompanyAccessTab />,
    employee: <EmployeeManagementTab />,
    control: <AccessControlTab />,
  }[activeTab];

  return (
    <section className="w-full space-y-5 pb-6">

      {/* Page Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">
            Multi-Company ERP
          </p>

          <h1 className="mt-1 text-lg font-semibold text-slate-900 md:text-xl lg:text-2xl">
            Organization Settings
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Manage companies, employees, user access and organizational permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(openAddCompany())}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          <Plus size={17} />
           New Company
        </button>
      </header>

      {/* Desktop Tab Navigation */}
      <div className="hidden md:block">
        <SettingsTabNavigation
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="md:hidden">
        <label
          htmlFor="settings-subtab"
          className="mb-2 block text-xs font-semibold text-slate-600"
        >
          Select Settings Section
        </label>

        <select
          id="settings-subtab"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        >
          {settingsTabs.map((tab) => (
            <option key={tab.value} value={tab.value}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>


      {activeTab === 'list' ? (
        <CompanyListTab
          onView={handleView}
          onEdit={handleEdit}
        />
      ) : tabContent}

    </section>
  );
}