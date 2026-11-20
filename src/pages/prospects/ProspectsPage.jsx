import ModulePlaceholder from '@/components/common/ModulePlaceholder';

<<<<<<< Updated upstream
export default function ProspectsPage() {
  return <ModulePlaceholder title="Prospects" description="Projects in enquiry, estimation, BOQ and quotation stages." />;
=======
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { ROUTES } from '../../constants/routePaths';

import ProspectList from '../../components/feature/prospects/ProspectList';
import AddProspectModal from '@/models/prospect/AddProspectModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import ProspectService from '@/services/prospectService';
import { showToast } from '@/store/slices/uiSlice';

export default function ProspectPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('list');
  const [showProspectModal, setShowProspectModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [prospectToDelete, setProspectToDelete] = useState(null);
  const [isDeletingProspect, setIsDeletingProspect] = useState(false);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const handleViewProspect = (prospect) => {
    navigate(
      ROUTES.PROSPECTSDETAILS.replace(':id', encodeURIComponent(prospect.id))
    );
  };


  const handleOpenAddModal = () => {
    setSelectedProspect(null);
    setShowProspectModal(true);
  };

  const handleEditProspect = (prospect) => {
    setSelectedProspect(prospect);
    setShowProspectModal(true);
  };


  const handleCloseProspectModal = () => {
    setShowProspectModal(false);
    setSelectedProspect(null);
  };

  const handleSaveProspect = async () => {
    handleCloseProspectModal();
    setListRefreshKey((key) => key + 1);
    return true;
  };

  const handleDeleteClick = (prospect) => {
    setProspectToDelete(prospect);
  };

  const handleDeleteProspect = async () => {
    if (!prospectToDelete) return;

    try {
      setIsDeletingProspect(true);
      const result = await ProspectService.deleteProspect(prospectToDelete.id);
      dispatch(showToast({
        type: 'success',
        message: result?.message || 'Prospect deleted successfully.',
      }));
      setProspectToDelete(null);
      setListRefreshKey((key) => key + 1);
    } catch (requestError) {
      dispatch(showToast({
        type: 'error',
        message:
          requestError.response?.data?.message ||
          requestError.message ||
          'Unable to delete prospect.',
      }));
    } finally {
      setIsDeletingProspect(false);
    }
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
        onView={handleViewProspect}
        onEdit={handleEditProspect}
        onDelete={handleDeleteClick}
        refreshKey={listRefreshKey}
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

  
      {tabContent[activeTab]}


      <AddProspectModal
        open={showProspectModal}
        onClose={handleCloseProspectModal}
        onSubmit={handleSaveProspect}
        prospect={selectedProspect}
        isEdit={Boolean(selectedProspect)}
      />

      <ConfirmationModal
        open={Boolean(prospectToDelete)}
        onClose={() => {
          if (!isDeletingProspect) setProspectToDelete(null);
        }}
        onConfirm={handleDeleteProspect}
        title="Delete Prospect"
        message={`Are you sure you want to delete "${
          prospectToDelete?.prospectName || 'this prospect'
        }" "${
          prospectToDelete?.prospectCode || 'this prospect'
        }"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeletingProspect}
        variant="danger"
      />
    </section>
  );
>>>>>>> Stashed changes
}
