import { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Power } from 'lucide-react';
import TableComponent from '@/components/common/tableComponent';
import Pagination from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/context/SearchContext';
import { cn } from '@/utils/helpers';
import CompanyService from '@/services/companyService';
import { CompanyLogo } from './settingsHelpers';

const PAGE_SIZE = 10;
import { showToast } from '@/store/slices/uiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { companyTypes } from '../../../models/settings/AddCompanyModal';

function ActionButton({ children, title, onClick, className }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg border text-xs font-semibold transition',
        className
      )}
    >
      {children}
    </button>
  );
}

export default function CompanyListTab({ onView, onEdit }) {
  const { debounceSearchTerm } = useSearch();
  const [requestSearch, setRequestSearch] = useState(debounceSearchTerm);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZE);
  const { currentPage, totalPages, goToPage, setTotalPages } = usePagination();
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const addCompanyOpen = useSelector((state) => state.ui.addCompanyOpen);
  const [companyTypeFilter, setCompanyTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');


  useEffect(() => {
    if (requestSearch !== debounceSearchTerm) {
      setRequestSearch(debounceSearchTerm);
      if (currentPage !== 1) goToPage(1);
    }
  }, [currentPage, debounceSearchTerm, goToPage, requestSearch]);

  useEffect(() => {
    if (addCompanyOpen) return;
    fetchCompanies();
  }, [addCompanyOpen, currentPage, goToPage, requestSearch, retryCount, setTotalPages, companyTypeFilter, statusFilter]);

  const fetchCompanies = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await CompanyService.getAllCompanies({
        page: currentPage,
        limit: PAGE_SIZE,
        searchTerm: requestSearch,
        companyType: companyTypeFilter,
        status: statusFilter,
      });

      setCompanies(result.companies);
      setTotalRecords(result.pagination.totalRecords);
      setItemsPerPage(result.pagination.itemsPerPage);
      setTotalPages(result.pagination.totalPages);

      if (result.pagination.currentPage !== currentPage) {
        goToPage(result.pagination.currentPage);
      }
    } catch (requestError) {
      setCompanies([]);
      setTotalRecords(0);
      setTotalPages(0);

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load companies."
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        label: 'Company',
        field: 'name',
        width: '30%',
        className: 'text-left',
        headerClassName: 'text-left',
        render: (company) => (
          <div className="flex items-center gap-3 text-left">
            <CompanyLogo company={company} />
            <div className="min-w-0">
              <p className="max-w-[220px] truncate text-xs font-semibold text-slate-800">
                {company.name}
              </p>
              <p className="text-[10px] text-slate-400">{company.code}</p>
            </div>
          </div>
        ),
      },
      {
        label: 'Type',
        width: '13%',
        className: 'hidden lg:table-cell',
        headerClassName: 'hidden lg:table-cell',
        render: (company) => company?.details?.companyType || '—',
      },
      {
        label: 'PAN',
        width: '15%',
        className: 'hidden lg:table-cell',
        headerClassName: 'hidden lg:table-cell',
        render: (company) =>  company?.details?.pan || '—',
      },
      {
        label: 'State',
        width: '14%',
        className: 'hidden lg:table-cell',
        headerClassName: 'hidden lg:table-cell',
        render: (company) => company?.state || '—',
      },
      {
        label: 'Status',
        width: '12%',
        render: (company) => {
          const active = company?.details?.status?.toLowerCase() === 'active';
          return (
            <span
              className={cn(
                'rounded-full px-2.5 py-1  font-semibold',
                active
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
              )}
            >
              {active ? 'Active' : 'Inactive'}
            </span>
          );
        },
      },
    ],
    []
  );

  const renderActions = (company, mobile = false) => {
    const active = company?.details?.status?.toLowerCase() === 'active';
    const buttonClass = mobile
      ? 'flex min-w-0 flex-1 items-center justify-center gap-1.5 px-2 text-[11px]'
      : 'w-auto gap-1.5 px-3';

    return (
      <div className={cn('flex items-center gap-2', mobile ? 'w-full' : 'justify-center')}>
        <ActionButton
          title="View company"
          onClick={() => onView(company)}
          className={cn(buttonClass, 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100')}
        >
          <Eye size={15} />
          {mobile && <span>View</span>}
        </ActionButton>
        <ActionButton
          title="Edit company"
          onClick={() => onEdit(company)}
          className={cn(buttonClass, 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100')}
        >
          <Pencil size={14} />
          {mobile && <span>Edit</span>}
        </ActionButton>
        <ActionButton
          title={active ? 'Deactivate' : 'Activate'}
          onClick={() => handleToggle(company.id)}
          disabled={isProcessing}
          className={cn(
            buttonClass,
            active
              ? 'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100'
          )}
        >
          <Power size={14} />
          {mobile && <span>{active ? 'Deactivate' : 'Activate'}</span>}
        </ActionButton>
      </div>
    );
  };

  const handleToggle = async (companyId) => {
    try {
      setIsProcessing(true);

      const response = await CompanyService.toggleCompany(companyId);

      if (response.success) {
        dispatch(showToast({
          type: 'success',
          message: response.message || 'Company status updated successfully.',
        }));

        fetchCompanies();
      } else {
        dispatch(showToast({
          type: 'error',
          message: response.message || "Failed to update company status.",
        }));
      }
    } catch (error) {
      console.error("Toggle Company Error:", error);

      dispatch(showToast({
          type: 'error',
          message: error?.message ||error.response?.data?.message || "Something went wrong.",
        }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
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
          <div>
            <select
              value={companyTypeFilter}
              onChange={(e) => {
                setCompanyTypeFilter(e.target.value);
                if (currentPage !== 1) goToPage(1);
              }}
              className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-auto sm:min-w-[180px] sm:px-3"
            >
              <option value="all">All Company Types</option>

              {companyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                if (currentPage !== 1) goToPage(1);
              }}
              className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-auto sm:min-w-[150px] sm:px-3"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

        </div>
      </div>

      <div className="hidden lg:block">
        <TableComponent
          columns={columns}
          data={companies}
          loading={loading}
          actionLabel="Actions"
          actions={(company) => renderActions(company)}
        />
      </div>

      <div className="space-y-3 lg:hidden">
        {loading ? (
          Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="animate-pulse space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded bg-slate-200" />
                  <div className="h-2 w-1/3 rounded bg-slate-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-8 rounded bg-slate-100" />
                <div className="h-8 rounded bg-slate-100" />
              </div>
            </div>
          ))
        ) : companies.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
            No companies found.
          </div>
        ) : (
          companies.map((company) => {
            const active = company?.details?.status?.toLowerCase() === 'active';
            return (
              <article
                key={company.id}
                className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <CompanyLogo company={company} />
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold text-slate-800">
                      {company.name}
                    </p>
                   
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold',
                      active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-x-3 gap-3 rounded-lg">

                  <div className="min-w-0 bg-slate-50 rounded-md py-1 px-2">
                      <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                        Company code
                      </dt>
                      <dd className="mt-1 break-words text-xs font-medium text-slate-700">
                        {company.code  || '—'}
                      </dd>
                  </div>
                  <div className="min-w-0 bg-slate-50 rounded-md py-1 px-2">
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      Type
                    </dt>
                    <dd className="mt-1 break-words text-xs font-medium text-slate-700">
                      {company?.details?.companyType || '—'}
                    </dd>
                  </div>
                  <div className="min-w-0 bg-slate-50 rounded-md py-1 px-2">
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      PAN
                    </dt>
                    <dd className="mt-1 break-words text-xs font-medium text-slate-700">
                      {company?.details?.pan || '—'}
                    </dd>
                  </div>
                  <div className="min-w-0 bg-slate-50 rounded-md py-1 px-2">
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      State
                    </dt>
                    <dd className="mt-1 break-words text-xs font-medium text-slate-700">
                      {company?.state || '—'}
                    </dd>
                  </div>
                </dl>

                {renderActions(company, true)}
              </article>
            );
          })
        )}
      </div>

      <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {companies.length ? (currentPage - 1) * itemsPerPage + 1 : 0}
          {' - '}
          {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords}
        </span>
        {totalPages > 0 && (
          <div className="w-full overflow-x-auto sm:w-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
