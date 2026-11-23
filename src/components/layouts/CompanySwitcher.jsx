import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Check, ChevronDown, Lock, Plus, Search } from 'lucide-react';
import useActiveCompany from '@/hooks/useActiveCompany';
import useClickOutside from '@/hooks/useClickOutside';
import { replaceCompanies, setActiveCompany } from '@/store/slices/companySlice';
import { openAddCompany } from '@/store/slices/uiSlice';
import { cn } from '@/utils/helpers';
import CompanyService from '@/services/companyService';


function CompanyLogo({ company, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-lg font-semibold text-white',
        sizeClass
      )}
    >
      {company.logo ? (
        <img
          src={company.logo}
          alt={`${company.name} logo`}
          className="h-full w-full object-contain border rounded-md"
        />
      ) : (
        company.initials || company.name?.slice(0, 2).toUpperCase()
      )}
    </span>
  );
}


export default function CompanySwitcher({ variant = 'header', collapsed = false }) {
  const dispatch = useDispatch();
  const { companies, activeCompany } = useActiveCompany();
  const [loading, setLoading] = useState(variant === 'sidebar');
  const [loadError, setLoadError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef(null);
  const isSidebar = variant === 'sidebar';

  useEffect(() => {
    if (!isSidebar) return undefined;

    let active = true;
    setLoading(true);
    setLoadError('');

    CompanyService.getAllCompanies({ limit: 'all' })
      .then((result) => {
        if (active) dispatch(replaceCompanies(result.companies));
      })
      .catch((error) => {
        if (!active) return;
        dispatch(replaceCompanies([]));
        setLoadError(
          error.response?.data?.message ||
            error.message ||
            'Unable to load companies.'
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [dispatch, isSidebar, retryCount]);

  useClickOutside(ref, () => {
    setOpen(false);
    setSearchTerm('');
  });

  const filteredCompanies = companies.filter((company) =>
    `${company.name} ${company.code} ${company.region}`
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  );

  const select = (id) => {
    dispatch(setActiveCompany(id));
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={ref} className="relative w-full min-w-0">

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={collapsed ? activeCompany?.name || 'No company added' : undefined}
        className={cn(
          'flex w-full min-w-0 items-center gap-3 rounded-xl border text-left transition-colors',
          isSidebar
            ? 'border-white/10 bg-white/5 p-2.5 hover:bg-white/10'
            : 'border-slate-200 bg-white px-2 py-1 hover:bg-slate-50',
          collapsed && 'justify-center px-0'
        )}
      >
        {activeCompany ? (
          <CompanyLogo company={activeCompany} size={isSidebar ? 'md' : 'sm'} />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-xs font-semibold text-slate-400">
            —
          </span>
        )}

        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-medium text-slate-400">
                Active company
              </span>
              <span className={cn(
                'block truncate text-sm font-semibold',
                isSidebar ? 'text-white' : 'text-slate-800'
              )}>
                {activeCompany?.name || 'No company added'}
              </span>
            </span>

            <ChevronDown
              size={16}
              className={cn(
                'shrink-0 transition-transform',
                open && 'rotate-180',
                isSidebar ? 'text-slate-400' : 'text-slate-500'
              )}
            />
          </>
        )}
      </button>

      {/* Company Dropdown */}
      {open && (
        <div
          role="listbox"
          className={cn(
            'absolute left-0 right-0 z-50 mt-2 w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl',
            !isSidebar && 'sm:w-72'
          )}
        >
          {/* Dropdown Header */}
          <div className="border-b border-slate-100 p-3">
            <p className="mb-2 text-xs font-semibold text-slate-700">
              Select Company
            </p>

            {/* Search */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search company..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10"
              />
            </div>
          </div>

          {/* Company List */}
         <ul className="thin-scroll max-h-[156px] overflow-y-auto overscroll-contain p-1.5">
           {loading ? (
             <li className="px-3 py-6 text-center text-xs text-slate-500">
               Loading companies...
             </li>
           ) : loadError ? (
             <li className="px-3 py-5 text-center">
               <p role="alert" className="text-xs font-medium text-red-600">
                 {loadError}
               </p>
               <button
                 type="button"
                 onClick={() => setRetryCount((count) => count + 1)}
                 className="mt-2 text-xs font-semibold text-brand-700 underline"
               >
                 Retry
               </button>
             </li>
           ) : companies.length === 0 ? (
             <li className="px-3 py-6 text-center">
               <p className="text-xs font-medium text-slate-600">
                 No company is added
               </p>
             </li>
           ) : filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => {
               const active = String(company.id) === String(activeCompany?.id);

                return (
                  <li key={company.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => select(company.id)}
                      className={cn(
                        'flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-2.5 text-left transition-colors',
                        active
                          ? 'bg-brand-50'
                          : 'hover:bg-slate-50'
                      )}
                    >
                      <CompanyLogo company={company} size="sm" />

                      <span className="min-w-0 flex-1">
                        <span className={cn(
                          'block truncate text-xs font-semibold',
                          active ? 'text-brand-700' : 'text-slate-800'
                        )}>
                          {company.name}
                        </span>

                        <span className="block truncate text-[10px] text-slate-500">
                          {company.code} · {company.region}
                        </span>
                      </span>

                      {active && (
                        <Check
                          size={15}
                          className="shrink-0 text-brand-600"
                        />
                      )}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-6 text-center">
                <Search size={20} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-medium text-slate-500">
                  No companies found
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  Try another company name.
                </p>
              </li>
            )}
          </ul>

          {/* Add Company */}
          <div className="border-t border-slate-100 p-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setSearchTerm('');
                dispatch(openAddCompany());
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              <Plus size={16} />
              Add New Company
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50 px-2 py-2 text-[10px] text-slate-500">
            <Lock size={11} />
            Authorized companies only
          </div>
        </div>
      )}
    </div>
  );
}

