
import {
  ArrowLeft,
  Pencil,
  Upload,
  BadgeCheck,
  CalendarDays,
} from 'lucide-react';

import ProspectDetailsTabs from '@/components/feature/prospects/ProspectDetailsTabs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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
  onViewDrawings,
  onConvert,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const prospect = prospectProp || location.state?.prospect;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/prospects');
    }
  };

  if (!prospect) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 pt-3 pb-6 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Prospect details not available
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            No prospect data was found for ID: {id || '—'}.
          </p>

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
    <div className="min-h-screen bg-slate-50 px-3 pt-2 pb-5 sm:px-5 sm:pt-3 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-3">

        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 py-1 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
        >
          <ArrowLeft size={18} />
          Back to prospects
        </button>

        {/* Prospect Header Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">

          <div className="p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-5">

              {/* Prospect Information */}
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm font-bold text-brand-700 sm:h-14 sm:w-14">
                  {prospectNumber || '—'}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
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

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
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
              </div>

              {/* Created Date and Status */}
              <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2 sm:p-4">

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

                    <span className="mt-1.5 inline-flex max-w-full items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      <span className="break-words">{prospectStatus}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center">

                <button
                  type="button"
                  onClick={() => onEdit?.(prospect)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  <Pencil size={16} />
                  Edit Prospect
                </button>

                <button
                  type="button"
                  onClick={() => onViewDrawings?.(prospect)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  <Upload size={16} />
                  Drawings
                </button>

                <button
                  type="button"
                  onClick={() => onConvert?.(prospect)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:ml-auto sm:w-auto"
                >
                  <BadgeCheck size={16} />
                  Convert to Client
                </button>
              </div>
            </div>
          </div>

          {/* Details Tabs */}
          <div className="border-t border-slate-200">
            <ProspectDetailsTabs prospect={prospect} />
          </div>
        </div>
      </div>
    </div>
  );
}
