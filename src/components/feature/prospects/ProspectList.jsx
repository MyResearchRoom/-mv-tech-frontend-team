
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Building2,
  UserRound,
  MapPin,
  CalendarDays,
  FileText,
  ClipboardList,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';

import TableComponent from '@/components/common/tableComponent';
import Pagination from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/context/SearchContext';
import useActiveCompany from '@/hooks/useActiveCompany';
import ProspectService from '@/services/prospectService';
import { prospectTypes } from '@/models/prospect/AddProspectModal';

const PAGE_SIZE = 10;
const PROSPECT_STATUSES = [
  'PROSPECT_CREATED',
  'DRAWINGS_RECEIVED',
  'DRAWINGS_UPLODED',
  'ESTIMATION_IN_PROGRESS',
  'ESTIMATION_COMPLETED',
  'BOQ_PREPARED',
  'BOQ_SHARED',
  'FEEDBACK_RECEIVED',
  'BOQ_APPROVED',
  'CONVERTED',
];

export const getStatusStyle = (status) => {
  const value = String(status || '').toLowerCase();

  const statusStyles = {
    prospect_created: 'bg-slate-50 text-slate-700 border-slate-700',
    drawings_uploded: 'bg-teal-200 text-teal-700 border-teal-700',
    drawings_received: 'bg-blue-50 text-blue-700 border-blue-700',
    estimation_in_progress: 'bg-blue-50 text-blue-700 border-blue-700',
    estimation_completed: 'bg-cyan-50 text-cyan-700 border-cyan-700',
    boq_prepared: 'bg-indigo-50 text-indigo-700 border-indigo-700',
    boq_shared: 'bg-violet-50 text-violet-700 border-violet-700',
    feedback_received: 'bg-amber-50 text-amber-700 border-amber-700',
    boq_approved: 'bg-emerald-50 text-emerald-700 border-emerald-700',
    converted: 'bg-green-50 text-green-700 border-green-700',
  };

  return statusStyles[value] || 'bg-slate-100 text-slate-600 border-slate-200';
};

function StatusBadge({ status, compact = false }) {
  const value = status || 'Not Started';

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border font-medium ${
        compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-[11px]'
      } ${getStatusStyle(value)}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      <span className="break-words">{value.replace(/_/g, ' ')}</span>
    </span>
  );
}

function formatDate(date) {
  if (!date) return '—';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '—';

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getProspectName(prospect) {
  return (
    prospect.prospectName ||
    prospect.companyName ||
    'Unnamed Prospect'
  );
}

function getCurrentStatus(prospect) {
  return prospect.currentStage || prospect.status || 'Not Started';
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon size={14} className="mt-0.5 shrink-0 text-slate-400" />

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 break-words text-xs font-medium text-slate-700">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, variant }) {
  const styles = {
    view: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
    edit: 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
    delete: 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${styles[variant]}`}
    >
      <Icon size={15} />
    </button>
  );
}

function ProspectCard({ prospect, onView, onEdit, onDelete }) {
  const name = getProspectName(prospect);
  const status = getCurrentStatus(prospect);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-200">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Building2 size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-semibold text-slate-800">
            {name}
          </h3>

          <p className="mt-1 text-[11px] text-slate-500">
            {prospect.prospectCode || 'ID not assigned'}
            {prospect.prospectType && ` • ${prospect.prospectType}`}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Current Status
        </span>
        <StatusBadge status={status} compact />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <InfoItem icon={UserRound} label="Contact Person" value={prospect.contactPersonName} />
        <InfoItem icon={FileText} label="Mobile" value={prospect.mobileNumber} />
        <InfoItem icon={FileText} label="Email" value={prospect.email} />
        <InfoItem icon={Building2} label="Project" value={prospect.projectName} />
        <InfoItem
          icon={MapPin}
          label="Project Location"
          value={prospect.projectLocation || prospect.city}
        />
        <InfoItem
          icon={CalendarDays}
          label="Created On"
          value={formatDate(prospect.createdAt)}
        />
      </div>

      {/* Mobile card actions */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className="text-[10px] font-medium text-slate-400">
          Prospect Actions
        </span>

        <div className="flex items-center gap-2">
          <ActionButton
            icon={Eye}
            label="View Prospect"
            variant="view"
            onClick={() => onView?.(prospect)}
          />
          <ActionButton
            icon={Pencil}
            label="Edit Prospect"
            variant="edit"
            onClick={() => onEdit?.(prospect)}
          />
          <ActionButton
            icon={Trash2}
            label="Delete Prospect"
            variant="delete"
            onClick={() => onDelete?.(prospect)}
          />
        </div>
      </div>
    </article>
  );
}

export default function ProspectList({
  onView,
  onEdit,
  onDelete,
  refreshKey = 0,
}) {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZE);
  const { debounceSearchTerm } = useSearch();
  const [requestSearch, setRequestSearch] = useState(debounceSearchTerm);
  const [prospectTypeFilter, setProspectTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { currentPage, totalPages, goToPage, setTotalPages } = usePagination();
  const { activeCompany } = useActiveCompany();

  useEffect(() => {
    if (requestSearch !== debounceSearchTerm) {
      setRequestSearch(debounceSearchTerm);
      if (currentPage !== 1) goToPage(1);
    }
  }, [currentPage, debounceSearchTerm, goToPage, requestSearch]);

  const fetchProspects = useCallback(async () => {

    setLoading(true);
    setError('');

    try {
      const result = await ProspectService.getAllProspects({
        companyId: activeCompany?.id,
        page: currentPage,
        limit: PAGE_SIZE,
        searchTerm: requestSearch,
        prospectType: prospectTypeFilter,
        status: statusFilter,
      });

      setProspects(result.prospects);
      setTotalRecords(result.pagination.totalRecords);
      setItemsPerPage(result.pagination.itemsPerPage);
      setTotalPages(result.pagination.totalPages);

      if (result.pagination.currentPage !== currentPage) {
        goToPage(result.pagination.currentPage);
      }
    } catch (requestError) {
      setProspects([]);
      setTotalRecords(0);
      setTotalPages(0);

      const responseData = requestError.response?.data;

      const validationMessages = Array.isArray(responseData?.errors)
        ? responseData.errors
            .map((validationError) => validationError?.msg)
            .filter(Boolean)
        : [];

      setError(
        validationMessages.join(', ') ||
          responseData?.message ||
          requestError.message ||
          'Unable to load prospects.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    activeCompany?.id,
    currentPage,
    requestSearch,
    prospectTypeFilter,
    statusFilter,
    goToPage,
  ]);

  useEffect(() => {
    fetchProspects();
  }, [fetchProspects, retryCount, refreshKey]);

  const resetFiltersToFirstPage = () => {
    if (currentPage !== 1) goToPage(1);
  };

  const recordsCount = totalRecords;
  const startRecord =
    recordsCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, recordsCount);

  const columns = useMemo(
    () => [
      {
        label: 'PROSPECT / COMPANY',
        field: 'prospectName',
        width: '17%',
        className: 'text-left',
        render: (prospect) => (
          <div className="min-w-0 max-w-[190px]">
            <p className="break-words text-xs font-semibold text-slate-800">
              {getProspectName(prospect)}
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              {prospect.prospectCode || '—'}
              {prospect.prospectType && ` • ${prospect.prospectType}`}
            </p>
          </div>
        ),
      },
      {
        label: 'CONTACT',
        field: 'contactPersonName',
        width: '20%',
        className: 'text-left',
        render: (prospect) => (
          <div className="min-w-0 max-w-[200px]">
            <p className="break-words text-xs font-medium text-slate-700">
              {prospect.contactPersonName || '—'}
            </p>
            <p className="mt-1 truncate text-[10px] text-slate-400">
              {prospect.mobileNumber || '—'}
            </p>
            <p className="mt-1 truncate text-[10px] text-slate-400">
              {prospect.email || '—'}
            </p>
          </div>
        ),
      },
      {
        label: 'PROJECT',
        field: 'projectName',
        width: '17%',
        className: 'text-left',
        render: (prospect) => (
          <div className="min-w-0 max-w-[165px]">
            <p className="break-words text-xs font-medium text-slate-700">
              {prospect.projectName || '—'}
            </p>
            <p className="mt-1 truncate text-[10px] text-slate-400">
              {prospect.projectLocation || prospect.city || '—'}
            </p>
          </div>
        ),
      },
      {
        label: 'CURRENT STATUS',
        field: 'currentStage',
        width: '15%',
        className: 'text-left',
        render: (prospect) => (
          <StatusBadge status={getCurrentStatus(prospect)} />
        ),
      },
      {
        label: 'CREATED',
        field: 'createdAt',
        width: '10%',
        className: 'text-left',
        render: (prospect) => (
          <span className="whitespace-nowrap text-xs text-slate-500">
            {formatDate(prospect.createdAt)}
          </span>
        ),
      },
      {
        label: 'ACTIONS',
        field: 'actions',
        width: '12%',
        className: 'text-center',
        render: (prospect) => (
          <div className="flex items-center justify-center gap-1.5">
            <ActionButton
              icon={Eye}
              label="View Prospect"
              variant="view"
              onClick={() => onView?.(prospect)}
            />
            <ActionButton
              icon={Pencil}
              label="Edit Prospect"
              variant="edit"
              onClick={() => onEdit?.(prospect)}
            />
            <ActionButton
              icon={Trash2}
              label="Delete Prospect"
              variant="delete"
              onClick={() => onDelete?.(prospect)}
            />
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete]
  );

  return (
    <div className="w-full space-y-4">
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:gap-3">
          <select
            aria-label="Filter by prospect type"
            value={prospectTypeFilter}
            onChange={(event) => {
              setProspectTypeFilter(event.target.value);
              resetFiltersToFirstPage();
            }}
            className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:min-w-[180px] sm:px-3"
          >
            <option value="all">All Prospect Types</option>
            {prospectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              resetFiltersToFirstPage();
            }}
            className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:min-w-[150px] sm:px-3"
          >
            <option value="all">All Statuses</option>
            {PROSPECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white lg:block">
        <TableComponent
          columns={columns}
          data={prospects}
          loading={loading}
        />
      </div>

      <div className="space-y-3 lg:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="h-4 w-2/3 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="h-8 rounded bg-slate-100" />
                <div className="h-8 rounded bg-slate-100" />
                <div className="h-8 rounded bg-slate-100" />
                <div className="h-8 rounded bg-slate-100" />
              </div>
            </div>
          ))
        ) : prospects.length > 0 ? (
          prospects.map((prospect) => (
            <ProspectCard
              key={prospect.id || prospect.prospectCode}
              prospect={prospect}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center">
            <ClipboardList size={30} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              No prospects found
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Prospects will appear here once added.
            </p>
          </div>
        )}
      </div>

      {!loading && recordsCount > 0 && (
        <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-700">
              {startRecord} - {endRecord}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-700">
              {recordsCount}
            </span>{' '}
            prospects
          </p>

          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              goToPage={goToPage}
              totalPages={totalPages}
            />
          )}
        </div>
      )}
    </div>
  );
}
