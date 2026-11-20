
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ROUTES } from '../../constants/routePaths';

import ProspectList from '../../components/feature/prospects/ProspectList';
import AddProspectModal from '@/models/prospect/AddProspectModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';

export default function ProspectPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('list');
  const [showProspectModal, setShowProspectModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [prospectToDelete, setProspectToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  // Temporary data until API integration
  const [prospects, setProspects] = useState([
    {
      id: 1,
      prospectId: 'PR-MVT-001',
      prospectName: 'Silverline Developers',
      prospectType: 'Builder / Developer',
      contactPersonName: 'Karan Malhotra',
      mobileNumber: '9876542011',
      email: 'karan@silverline.dev',
      projectName: 'Silverline Corporate Park',
      projectLocation: 'Mumbai, Maharashtra',
      currentStage: 'Awaiting Prospect Feedback',
      createdAt: '2026-11-10T10:30:00',
    },
    {
      id: 2,
      prospectId: 'PR-MVT-002',
      prospectName: 'Nova Manufacturing',
      prospectType: 'Company',
      contactPersonName: 'Rakesh Pillai',
      mobileNumber: '9876574202',
      email: 'projects@nova.dev',
      projectName: 'Nova Plant Fire System Upgrade',
      projectLocation: 'Pune, Maharashtra',
      currentStage: 'Estimation In Progress',
      createdAt: '2026-11-12T11:15:00',
    },
    {
      id: 3,
      prospectId: 'PR-MVT-003',
      prospectName: 'Axis MEP Consultants',
      prospectType: 'Consultant',
      contactPersonName: 'Farah Khan',
      mobileNumber: '9876574233',
      email: 'farah@axis.demo',
      projectName: 'CityCare Hospital Extension',
      projectLocation: 'Thane, Maharashtra',
      currentStage: 'Drawings Pending',
      createdAt: '2026-11-15T14:20:00',
    },
  ]);

  const loading = false;
  const totalRecords = prospects.length;
  const totalPages = Math.ceil(totalRecords / 10);

  // View prospect
  const handleViewProspect = (prospect) => {
    navigate(
      ROUTES.PROSPECTSDETAILS.replace(':id', prospect.id),
      {
        state: { prospect },
      }
    );
  };

  // Open Add modal
  const handleOpenAddModal = () => {
    setSelectedProspect(null);
    setShowProspectModal(true);
  };

  // Open Edit modal
  const handleEditProspect = (prospect) => {
    setSelectedProspect(prospect);
    setShowProspectModal(true);
  };

  // Close Add/Edit modal
  const handleCloseProspectModal = () => {
    setShowProspectModal(false);
    setSelectedProspect(null);
  };

  // Add / Update prospect
  const handleSaveProspect = async (prospectData) => {
    if (selectedProspect) {
      console.log('Update Prospect:', prospectData);

      // Update API will be integrated here.
      // Temporary local update:
      setProspects((previous) =>
        previous.map((item) =>
          item.id === selectedProspect.id
            ? { ...item, ...prospectData }
            : item
        )
      );
    } else {
      console.log('Add Prospect:', prospectData);

      // Add API will be integrated here.
    }

    handleCloseProspectModal();
    return true;
  };

  // Open Delete Confirmation
  const handleDeleteClick = (prospect) => {
    setProspectToDelete(prospect);
  };

  // Delete confirmation
  const handleDeleteProspect = () => {
    if (!prospectToDelete) return;

    console.log('Delete Prospect ID:', prospectToDelete.id);

    // Delete API will be integrated here.
    setProspects((previous) =>
      previous.filter((item) => item.id !== prospectToDelete.id)
    );

    setProspectToDelete(null);
  };

  const tabs = [
    {
      id: 'list',
      label: 'All Prospects',
    },
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
        onEdit={handleEditProspect}
        onDelete={handleDeleteClick}
      />
    ),
  };

  return (
    <section className="w-full space-y-5 pb-6">
      {/* Page Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Prospect Management
          </h1>

          <p className="text-xs text-slate-500 sm:text-sm">
            Manage prospects, contact information and initial project details.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
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

      {/* Add / Edit Prospect Modal */}
      <AddProspectModal
        open={showProspectModal}
        onClose={handleCloseProspectModal}
        onSubmit={handleSaveProspect}
        prospect={selectedProspect}
        isEdit={Boolean(selectedProspect)}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={Boolean(prospectToDelete)}
        onClose={() => setProspectToDelete(null)}
        onConfirm={handleDeleteProspect}
        title="Delete Prospect"
        message={`Are you sure you want to delete "${
          prospectToDelete?.prospectName || 'this prospect'
        }"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </section>
  );

}
