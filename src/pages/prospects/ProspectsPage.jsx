
import { useState } from 'react';
import { Plus } from 'lucide-react';

import ProspectList from '../../components/feature/prospects/ProspectList';
import AddProspectModal from '@/models/prospect/AddProspectModal';

export default function ProspectPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [showProspectModal, setShowProspectModal] = useState(false);

    const handleViewProspect = (prospect) => {
  console.log('Selected Prospect:', prospect);
};

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  // Temporary data states until API integration
const prospects = [
  {
    id: 1,
    prospectId: 'PR-MVT-001',
    prospectName: 'Silverline Developers',
    prospectType: 'Builder / Developer',
    contactPersonName: 'Karan Malhotra',
    mobileNumber: '+91 98765 42011',
    email: 'karan@silverline.dev',
    projectName: 'Silverline Corporate Park',
    projectLocation: 'Mumbai, Maharashtra',
    drawingStatus: 'Received',
    estimationStatus: 'Completed',
    boqStatus: 'Shared',
    currentStage: 'Awaiting Prospect Feedback',
    assignedEmployee: 'Priya Nair',
    createdAt: '2026-11-10T10:30:00',
  },
  {
    id: 2,
    prospectId: 'PR-MVT-002',
    prospectName: 'Nova Manufacturing',
    prospectType: 'Industrial',
    contactPersonName: 'Rakesh Pillai',
    mobileNumber: '+91 98765 74202',
    email: 'projects@nova.dev',
    projectName: 'Nova Plant Fire System Upgrade',
    projectLocation: 'Pune, Maharashtra',
    drawingStatus: 'Received',
    estimationStatus: 'In Progress',
    boqStatus: 'Not Started',
    currentStage: 'Estimation In Progress',
    assignedEmployee: 'Vikram Shah',
    createdAt: '2026-11-12T11:15:00',
  },
  {
    id: 3,
    prospectId: 'PR-MVT-003',
    prospectName: 'Axis MEP Consultants',
    prospectType: 'Consultant',
    contactPersonName: 'Farah Khan',
    mobileNumber: '+91 98765 74233',
    email: 'farah@axis.demo',
    projectName: 'CityCare Hospital Extension',
    projectLocation: 'Thane, Maharashtra',
    drawingStatus: 'Pending',
    estimationStatus: 'Not Started',
    boqStatus: 'Not Started',
    currentStage: 'Drawings Pending',
    assignedEmployee: 'Priya Nair',
    createdAt: '2026-11-15T14:20:00',
  },
];

const loading = false;
const totalRecords = prospects.length;
const totalPages = Math.ceil(totalRecords / 10);

  const handleAddProspect = async (prospectData) => {
    // Prospect creation API will be integrated here.
    console.log('Prospect Form Data:', prospectData);

    // Keep the modal open until the API is integrated.
    return false;
  };

  const tabs = [
    {
      id: 'list',
      label: 'All Prospects',
    },
    // Add more tabs here later.
    // Example: Details, Converted Clients, etc.
  ];

  const tabContent = {
    list: (
      <ProspectList
        prospects={prospects}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onView={handleViewProspect}
      />
    ),
  };



  return (
    <section className="w-full space-y-5 pb-6">
      {/* Page Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">
            Sales & Project Management
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Prospect Management
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Manage prospects, contact information and initial project details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowProspectModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <Plus size={17} />
          Add Prospect
        </button>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative shrink-0 pb-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'text-brand-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}

              {activeTab === tab.id && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      {tabContent[activeTab]}

      {/* Add Prospect Modal */}
      <AddProspectModal
        open={showProspectModal}
        onClose={() => setShowProspectModal(false)}
        onSubmit={handleAddProspect}
      />
    </section>
  );
}
