
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Pencil,
  Upload,
  BadgeCheck,
  CalendarDays,
} from 'lucide-react';

import ProspectDetailsTabs from '@/components/feature/prospects/ProspectDetailsTabs';
import { useNavigate, useParams } from 'react-router-dom';
import ProspectService from '@/services/prospectService';
import AddProspectModal from '@/models/prospect/AddProspectModal';
import { getStatusStyle } from '../../components/feature/prospects/ProspectList';

const getDisplayValue = (value, fallback = '—') => {
  if (value === undefined || value === null || value === '') return fallback;

  if (typeof value === 'object' && !Array.isArray(value)) {
    return (
      value.name ||
      value.label ||
      value.employeeName ||
      value.firstName ||
      fallback
    );
  }

  return String(value);
};

const formatDate = (date) => {
  if (!date) return '—';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return getDisplayValue(date);

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function ProspectDetailsPage({
  prospect: prospectProp,
  onBack,
  onEdit,
  onConvert,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [prospect, setProspect] = useState(prospectProp || null);
  const [loading, setLoading] = useState(!prospectProp);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState(null);

  useEffect(() => {
    if (prospectProp) {
      setProspect(prospectProp);
      setLoading(false);
      setError('');
      return undefined;
    }

    let isCurrentRequest = true;
    setProspect(null);
    setLoading(true);
    setError('');

    const fetchProspect = async () => {
      try {
        const result = await ProspectService.getProspectById(id);
        if (isCurrentRequest) setProspect(result);
      } catch (requestError) {
        if (isCurrentRequest) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              'Unable to load prospect details.'
          );
        }
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    };

    fetchProspect();

    return () => {
      isCurrentRequest = false;
    };
  }, [id, prospectProp, retryCount]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/prospects');
    }
  };

  const handleEditProspect = () => {
    if (onEdit) {
      onEdit(prospect);
      return;
    }

    setSelectedProspect(prospect);
    setShowEditModal(true);
  };

  const handleSaveProspect = async () => {
    setShowEditModal(false);
    setSelectedProspect(null);

    try {
      const refreshedProspect = await ProspectService.getProspectById(
        prospect.id || id
      );
      setProspect(refreshedProspect);
    } catch (refreshError) {
      setRetryCount((count) => count + 1);
    }

    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 pt-3 pb-6 sm:px-6">
        <div className="mx-auto max-w-3xl animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-5 w-48 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-full max-w-md rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 pt-3 pb-6 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Prospect details not available
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || `No prospect data was found for ID: ${id || '—'}.`}
          </p>

          {error && (
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-4 font-semibold text-brand-700 underline underline-offset-2"
            >
              Retry
            </button>
          )}

          <button
            type="button"
            onClick={handleBack}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <ArrowLeft size={16} />
            Back to Prospects
          </button>
        </div>
      </div>
    );
  }

  const prospectName =
    prospect.prospectName ||
    prospect.companyName ||
    prospect.name ||
    'Unnamed Prospect';

  const prospectStatus =
    prospect.currentStage ||
    prospect.currentStatus ||
    'Not Started';

  const prospectNumber = prospect.prospectId
    ? String(prospect.prospectId).split('-').pop()
    : prospect.id || id;

  return (
    <div className="min-h-screen bg-slate-50 p-2 pb-5">
      <div className="mx-auto max-w-[1500px] space-y-3">

        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 pb-1 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
        >
          <ArrowLeft size={18} />
          Back to prospects
        </button>


        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">

          <div className="p-3 sm:p-3 lg:p-4">
            <div className="flex flex-col gap-5">

              {/* Prospect Information */}
              <div className="flex flex-col md:flex-row min-w-0 items-start  gap-3 md:gap-4">

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-brand-700">
                      {getDisplayValue(prospect.prospectId)}
                    </span>

                    <span className="text-slate-300">•</span>

                    <span className="text-xs font-medium text-slate-500">
                      {getDisplayValue(prospect.prospectType)}
                    </span>
                  </div>

                  <h1 className="break-words text-lg font-bold leading-snug text-slate-900 sm:text-2xl">
                    {prospectName}
                  </h1>

                  <div className=" flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                    {prospect.projectName && (
                      <span className="break-words font-medium text-slate-600">
                        {prospect.projectName}
                      </span>
                    )}

                    {prospect.projectName && prospect.projectLocation && (
                      <span className="text-slate-300">•</span>
                    )}

                    {prospect.projectLocation && (
                      <span className="break-words">
                        {prospect.projectLocation}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-row gap-2 sm:flex-wrap sm:items-center">

                  <button
                    type="button"
                    onClick={handleEditProspect}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 md:px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 w-auto"
                  >
                    <Pencil size={16} />
                    Edit 
                  </button>

                  <button
                    type="button"
                    onClick={() => onConvert?.(prospect)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 md:px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:ml-auto sm:w-auto"
                  >
                    <BadgeCheck size={16} />
                    Convert to Client
                  </button>
                </div>
              </div>


              <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 sm:grid-cols-2 p-2">

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                    <CalendarDays size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Created On
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                      {formatDate(prospect.createdAt || prospect.createdOn)}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Current Status
                    </p>

                    <span className={`mt-1.5 inline-flex max-w-full items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold border  ${getStatusStyle(prospectStatus)}`}>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      <span className={`break-words`} >{prospectStatus.replace(/_/g, ' ')}</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Details Tabs */}
          <div className="border-t border-slate-200">
            <ProspectDetailsTabs prospect={prospect} />
          </div>
        </div>
      </div>

      <AddProspectModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProspect(null);
        }}
        onSubmit={handleSaveProspect}
        prospect={selectedProspect}
        isEdit
      />
    </div>
  );
}
