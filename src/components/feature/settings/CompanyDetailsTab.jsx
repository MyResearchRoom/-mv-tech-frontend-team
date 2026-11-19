import { useEffect, useState } from 'react';
import { ExternalLink, Eye, FileText, Pencil } from 'lucide-react';
import { cn } from '@/utils/helpers';
import CompanyService from '@/services/companyService';
import { useDispatch, useSelector } from 'react-redux';
import {
  CompanyLogo,
  DETAIL_SECTIONS,
  DetailCard,
  EmptyState,
  formatValue,
  getDetails,
  getFileName,
  getGSTRegistrations,
} from "./settingsHelpers";
import { handleViewDocument } from '../../../utils/viewDocument';
function CompanyDetailsView({ company, onEdit }) {
  if (!company) {
    return (
      <EmptyState
        title="Select a company"
        description="Choose a company from the Company List tab."
      />
    );
  }

  const details = {
    ...getDetails(company),
    companyName: getDetails(company).companyName || company.name,
    companyCode: getDetails(company).companyCode || company.code,
    companyStatus:
      getDetails(company).companyStatus || 'Active',
    logo: getDetails(company).logo || company.logo,
  };

  const registrations = getGSTRegistrations(company);
  const documents = details.documents || [];
  const dispatch =useDispatch();

  return (
    <div className="space-y-4">

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <CompanyLogo company={company} />

        <div className="min-w-0 flex-1">
          <h2 className="break-words text-lg font-semibold text-slate-900">
            {company.name}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {details.companyType || 'Company'} · {company.code} · 
            <span
              className={`ml-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                details.companyStatus?.toLowerCase() === 'active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {details.companyStatus}
            </span>
          </p>
    
        </div>

        <button
          type="button"
          onClick={() => onEdit(company)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Pencil size={14} /> Edit Company
        </button>
      </div>

      {DETAIL_SECTIONS.map((section) => (
        <DetailCard
          key={section.title}
          section={section}
          details={details}
        />
      ))}


      <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
        <div className="border-b border-slate-300 bg-slate-100 px-4 py-3.5">
          <h3 className="text-sm font-semibold text-slate-800">
            GST Registrations
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">
            {registrations.length} registration(s)
          </p>
        </div>

        {registrations.length ? (
          <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-2">
            {registrations.map((registration, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-brand-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-brand-100 bg-brand-50/70 px-4 py-3">
                  <h4 className="text-xs font-bold text-brand-800">
                    GST Configuration {index + 1}
                  </h4>
                  <span className="rounded-full border border-brand-200 bg-white px-2 py-1 text-[10px] font-semibold text-brand-700">
                    Registration {index + 1}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {[
                    ['gstStatus', 'Registration Status'],
                    ['gstin', 'GSTIN'],
                    ['taxPreference', 'Tax Preference'],
                    ['gstType', 'Registration Type'],
                    ['gstConfiguration', 'GST Configuration'],
                    ['placeOfSupply', 'Place of Supply'],
                    ['registrationState', 'State'],
                    ['registrationAddress', 'Address'],
                  ].map(([key, label]) => (
                    <div key={key} className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 px-4 py-2.5 even:bg-slate-50/70">
                      <p className="text-[10px] font-semibold text-slate-500">
                        {label}
                      </p>
                      <p className="break-words text-right text-xs font-semibold text-slate-800">
                        {formatValue(registration[key])}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-5 text-xs text-slate-400">
            No GST registrations provided.
          </p>
        )}
      </section>


      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-100 px-4 py-3.5">
          <h3 className="text-sm font-semibold text-slate-800">
            Company Documents
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">
            Uploaded and pending company documents
          </p>
        </div>

        <div className="hidden grid-cols-[minmax(0,1fr)_140px_120px] items-center gap-4 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:grid">
          <span>Document</span>
          <span className="text-center">Status</span>
          <span className="text-right">Action</span>
        </div>

        <div className="divide-y divide-slate-100">
          {documents.map((document, index) => {
            const uploaded = Boolean(document.document);
            const fileValue = document.document;

            const canView = Boolean(
              typeof fileValue === "string" ||
              (fileValue &&
                typeof fileValue === "object" &&
                (fileValue.url ||
                  fileValue.dataUrl ||
                  fileValue.previewUrl))
            );

            return (
              <div
                key={`${document.name}-${index}`}
                className="flex flex-col gap-3 px-3 py-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4"
              >
                {/* Document information */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
                    <FileText size={18} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-xs font-semibold text-slate-800 sm:text-sm">
                      {document.name || `Document ${index + 1}`}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {uploaded ? "Document uploaded successfully" : "Document not uploaded yet"}
                    </p>
                  </div>
                </div>

                {/* Status and action */}
                <div className="flex items-center justify-between gap-3 pl-[52px] sm:shrink-0 sm:justify-end sm:pl-0">
                  <span
                    className={cn(
                      "inline-flex min-w-[82px] items-center justify-center rounded-full border px-3 py-1.5 text-[10px] font-bold",
                      uploaded
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    )}
                  >
                    {uploaded ? "Uploaded" : "Pending"}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleViewDocument(document, dispatch)}
                    disabled={
                      !uploaded ||
                      (!canView && !(fileValue instanceof Blob))
                    }
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <Eye size={14} />
                    <span>View</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            );
          })}

          {!documents.length && (
            <div className="px-4 py-8 text-center">
              <FileText className="mx-auto mb-2 text-slate-300" size={28} />
              <p className="text-xs font-medium text-slate-500">
                No documents available.
              </p>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}

export default function CompanyDetailsTab({ company: initialCompany, onEdit }) {
  
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    initialCompany?.id ?? ''
  );
  const [companyDetails, setCompanyDetails] = useState(null);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState('');
  const [detailsError, setDetailsError] = useState('');
  const [companiesRetry, setCompaniesRetry] = useState(0);
  const companyUpdateVersion = useSelector(
    (state) => state.ui.companyUpdateVersion
  );

  useEffect(() => {
    setSelectedCompanyId(initialCompany?.id ?? '');
  }, [initialCompany?.id]);

  useEffect(() => {
    let active = true;
    setCompaniesLoading(true);
    setCompaniesError('');

    CompanyService.getAllCompanies({ limit: 'all' })
      .then((result) => {
        if (active) setCompanies(result.companies);
      })
      .catch((error) => {
        if (active) {
          setCompaniesError(
            error.response?.data?.message ||
              error.message ||
              'Unable to load companies.'
          );
        }
      })
      .finally(() => {
        if (active) setCompaniesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [companiesRetry]);

  useEffect(() => {
    if (selectedCompanyId === '' || selectedCompanyId == null) {
      setCompanyDetails(null);
      setDetailsError('');
      return undefined;
    }

    let active = true;
    setDetailsLoading(true);
    setDetailsError('');

    CompanyService.getCompanyDetailsById(selectedCompanyId)
      .then((details) => {
        if (active) setCompanyDetails(details);
      })
      .catch((error) => {
        if (active) {
          setCompanyDetails(null);
          setDetailsError(
            error.response?.data?.message ||
              error.message ||
              'Unable to load company details.'
          );
        }
      })
      .finally(() => {
        if (active) setDetailsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [companyUpdateVersion, selectedCompanyId]);

  return (
    <div className="space-y-4">
      {companiesError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{companiesError}</span>
          <button
            type="button"
            onClick={() => setCompaniesRetry((retry) => retry + 1)}
            className="shrink-0 font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Company Information</h2>
          <p className="mt-1 text-xs text-slate-500">
            View all information submitted through the company form.
          </p>
        </div>
        <select
          value={selectedCompanyId}
          onChange={(event) => setSelectedCompanyId(event.target.value)}
          disabled={companiesLoading}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs sm:max-w-xs"
        >
          <option value="">
            {companiesLoading ? 'Loading companies...' : 'Select Company'}
          </option>
          {companies.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name || item.companyName}
            </option>
          ))}
        </select>
      </div>
      {detailsError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {detailsError}
        </div>
      )}
      {detailsLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
          Loading company details...
        </div>
      ) : (
        <CompanyDetailsView company={companyDetails} onEdit={onEdit} />
      )}
    </div>
  );
}
