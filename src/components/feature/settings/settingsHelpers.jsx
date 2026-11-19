import { cn } from '@/utils/helpers';
import { Building2 } from 'lucide-react';

export const DETAIL_SECTIONS = [
  {
    title: 'Basic Company Details',
    description: 'Company identity and operating information',
    fields: [
      ['companyName', 'Company Name'],
      ['companyCode', 'Company Code'],
      ['companyType', 'Company Type'],
      ['companyStatus', 'Company Status'],
      ['description', 'Business Description'],
      ['website', 'Website'],
      // ['logo', 'Company Logo'],
    ],
  },
  {
    title: 'Legal & Registration Details',
    description: 'Statutory and incorporation information',
    fields: [
      ['legalName', 'Legal Registered Name'],
      ['pan', 'PAN Number'],
      ['cin', 'CIN / LLPIN'],
      ['registrationNumber', 'Registration Number'],
      ['esiNumber', 'ESI Number'],
      ['pfNumber', 'PF Number'],
      ['iec', 'Importer Exporter Code'],
      ['incorporationDate', 'Date of Incorporation'],
    ],
  },
  {
    title: 'Registered Office Address',
    description: 'Company registered location',
    fields: [
      ['country', 'Country'],
      ['state', 'State'],
      ['city', 'City'],
      ['pinCode', 'PIN Code'],
      ['registeredAddress', 'Registered Office Address'],
    ],
  },
  {
    title: 'Contact Information',
    description: 'Primary and financial contacts',
    fields: [
      ['primaryContact', 'Primary Contact Person'],
      ['officialEmail', 'Official Email'],
      ['mobileNumber', 'Mobile Number'],
      ['financeContact', 'Finance Contact'],
    ],
  },
  {
    title: 'Financial & Operational Settings',
    description: 'Financial year, currency and document prefixes',
    fields: [
      ['financialYearStart', 'Financial Year Start'],
      ['currency', 'Base Currency'],
      ['invoicePrefix', 'Invoice Prefix'],
      ['quotationPrefix', 'Quotation Prefix'],
      ['purchaseOrderPrefix', 'Purchase Order Prefix'],
      ['paymentTerms', 'Default Payment Terms'],
    ],
  },
  {
    title: 'Banking Information',
    description: 'Company bank account details',
    fields: [
      ['bankName', 'Bank Name'],
      ['accountHolder', 'Account Holder'],
      ['accountNumber', 'Account Number'],
      ['ifsc', 'IFSC Code'],
      ['billingAddress', 'Billing / Branch Address'],
    ],
  },
];

export const getDetails = (company) => company?.details || {};

export const getCompanyStatus = (company) =>
  getDetails(company).status || 'Active';

export const getCompanyState = (company) =>
  getDetails(company).state || company?.region || '';

export const getGSTRegistrations = (company) =>
  getDetails(company).gstRegistrations || [];

export const getCompanyGSTIN = (company) => {
  const registrations = getGSTRegistrations(company);

  return (
    registrations.find((item) => item.gstin)?.gstin ||
    getDetails(company).gstin ||
    ''
  );
};

export const getFileName = (file) => {
  if (!file) return '';

  if (typeof file === 'string') return file;

  return file.name || 'Uploaded file';
};

export const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Not provided';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'object') {
    if (value.name) return value.name;
    return 'Available';
  }

  return String(value);
};

export function CompanyLogo({ company, size = 'md' }) {
  const dimensions =
    size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-xl text-xs font-bold text-white border',
        dimensions
      )}
      // style={{ backgroundColor: company.color || '#2563eb' }}
    >
      {company.logo ? (
        <img
          src={company.logo}
          alt={`${company.name} logo`}
          className="h-full w-full object-contain"
        />
      ) : (
        company.initials ||
        company.name?.slice(0, 2).toUpperCase()
      )}
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center">
      <Building2
        size={30}
        className="mx-auto mb-3 text-slate-300"
      />
      <p className="text-sm font-semibold text-slate-700">
        {title}
      </p>
      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

export function DetailCard({ section, details }) {

  const visibleFields = section.fields;

  if (!visibleFields.length) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-100 px-4 py-3.5">
        <h3 className="text-sm font-semibold text-slate-800">
          {section.title}
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          {section.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleFields.map(([key, label]) => (
          <div
            key={key}
            className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 transition hover:border-brand-200 hover:bg-white"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </p>

            {key === 'logo' && details.logo ? (
              <img
                src={details.logo}
                alt="Company logo"
                className="mt-2 h-14 w-14 rounded-lg border border-slate-200 object-cover"
              />
            ) : (
              <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-slate-800">
                {formatValue(details[key])}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

