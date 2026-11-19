
import { useMemo } from 'react';
import {
  Building2,
  UserRound,
  MapPin,
  CalendarDays,
  FileText,
  ClipboardList,
  Eye,
} from 'lucide-react';

import TableComponent from '@/components/common/tableComponent';
import Pagination from '@/components/common/Pagination';

const LIMIT = 10;

const getStatusStyle = (status) => {
  const value = String(status || '').toLowerCase();

  if (
    ['completed', 'converted', 'approved', 'won', 'closed'].includes(value)
  ) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  }

  if (
    [
      'in progress',
      'awaiting prospect feedback',
      'estimation in progress',
      'negotiation',
      'proposal shared',
    ].includes(value)
  ) {
    return 'bg-blue-50 text-blue-700 border-blue-100';
  }

  if (
    ['pending', 'drawings pending', 'new', 'not started', 'follow up'].includes(value)
  ) {
    return 'bg-amber-50 text-amber-700 border-amber-100';
  }

  return 'bg-slate-100 text-slate-600 border-slate-200';
};

function StatusBadge({ status, compact = false }) {
  const value = status || 'Not Started';

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border font-medium ${
        compact
          ? 'px-2 py-1 text-[10px]'
          : 'px-2.5 py-1.5 text-[11px]'
      } ${getStatusStyle(value)}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      <span className="break-words">{value}</span>
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
    prospect.name ||
    'Unnamed Prospect'
  );
}

function getCurrentStatus(prospect) {
  return prospect.currentStage || 'Not Started';
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

function ProspectCard({ prospect, onView }) {
  const name = getProspectName(prospect);
  const status = getCurrentStatus(prospect);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-200">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Building2 size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-semibold text-slate-800">
            {name}
          </h3>

          <p className="mt-1 text-[11px] text-slate-500">
            {prospect.prospectId || 'ID not assigned'}
            {prospect.prospectType && ` • ${prospect.prospectType}`}
          </p>
        </div>
      </div>

      {/* Current status */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Current Status
        </span>
        <StatusBadge status={status} compact />
      </div>

      {/* Contact and project details */}
      <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <InfoItem
          icon={UserRound}
          label="Contact Person"
          value={prospect.contactPersonName}
        />

        <InfoItem
          icon={FileText}
          label="Mobile"
          value={prospect.mobileNumber}
        />

        <InfoItem
          icon={FileText}
          label="Email"
          value={prospect.email}
        />

        <InfoItem
          icon={Building2}
          label="Project"
          value={prospect.projectName}
        />

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

      {/* View action */}
      <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => onView?.(prospect)}
          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          <Eye size={14} />
          View Details
        </button>
      </div>
    </article>
  );
}

export default function ProspectList({
  prospects = [],
  loading = false,
  currentPage = 1,
  setCurrentPage,
  totalPages = 1,
  totalRecords,
  onView,
}) {
  const columns = useMemo(
    () => [
      {
        label: 'PROSPECT / COMPANY',
        field: 'prospectName',
        width: '19%',
        className: 'text-left',
        render: (prospect) => (
          <div className="min-w-0 max-w-[190px]">
            <p className="break-words text-xs font-semibold text-slate-800">
              {getProspectName(prospect)}
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              {prospect.prospectId || '—'}
              {prospect.prospectType && ` • ${prospect.prospectType}`}
            </p>
          </div>
        ),
      },
      {
        label: 'CONTACT',
        field: 'contactPersonName',
        width: '15%',
        className: 'text-left',
        render: (prospect) => (
          <div className="min-w-0 max-w-[155px]">
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
        width: '16%',
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
        width: '19%',
        className: 'text-left',
        render: (prospect) => (
          <StatusBadge status={getCurrentStatus(prospect)} />
        ),
      },
      {
        label: 'CREATED',
        field: 'createdAt',
        width: '11%',
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
        width: '7%',
        className: 'text-center',
        render: (prospect) => (
          <button
            type="button"
            onClick={() => onView?.(prospect)}
            title="View Prospect"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
          >
            <Eye size={15} />
          </button>
        ),
      },
    ],
    [onView]
  );

  const recordsCount =
    totalRecords !== undefined ? totalRecords : prospects.length;

  const startRecord =
    recordsCount === 0 ? 0 : (currentPage - 1) * LIMIT + 1;

  const endRecord = Math.min(currentPage * LIMIT, recordsCount);

  return (
    <div className="w-full space-y-4">
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white lg:block">
        <TableComponent
          columns={columns}
          data={prospects}
          loading={loading}
        />
      </div>

      {/* Mobile and tablet cards */}
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
              key={prospect.id || prospect.prospectId}
              prospect={prospect}
              onView={onView}
            />
          ))
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center">
            <ClipboardList
              size={30}
              className="mx-auto text-slate-300"
            />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              No prospects found
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Prospects will appear here once added.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && recordsCount > 0 && (
        <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center">
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

          {totalPages > 1 && setCurrentPage && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      )}
    </div>
  );
}
