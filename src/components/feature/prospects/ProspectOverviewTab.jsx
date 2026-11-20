const formatValue = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (value instanceof File) {
    return value.name;
  }

  if (Array.isArray(value)) {
    return value.length
      ? value.map((item) => formatValue(item)).join(', ')
      : '—';
  }

  if (typeof value === 'object') {
    return (
      value.name ||
      value.label ||
      value.employeeName ||
      value.originalName ||
      value.fileName ||
      '—'
    );
  }

  return String(value);
};

const DetailCard = ({ title, subtitle, fields }) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">

      {/* Section Header */}
      <div className="border-b border-slate-300 bg-slate-100 px-4 py-3.5">
        <h3 className="text-sm font-semibold text-slate-800">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-[11px] text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 sm:gap-x-6 sm:px-4">
        {fields.map((field, index) => (
          <div
            key={field.key}
            className={`grid min-w-0 grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-start gap-3 px-4 py-3 sm:px-2 ${
              index % 2 === 0 ? 'sm:bg-slate-50/60' : 'sm:bg-white'
            } ${
              field.fullWidth
                ? 'sm:col-span-2'
                : ''
            }`}
          >
            <p className="text-[11px] font-semibold text-slate-500 sm:text-xs">
              {field.label}
            </p>

            <p className="break-words text-right text-xs font-semibold leading-relaxed text-slate-800 sm:text-left">
              {formatValue(field.value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};


export default function ProspectOverviewTab({ prospect = {} }) {
  const basicFields = [
    { key: 'prospectType', label: 'Prospect Type', value: prospect.prospectType },
    { key: 'prospectName', label: 'Prospect / Company Name', value: prospect.prospectName },
    { key: 'contactPersonName', label: 'Contact Person Name', value: prospect.contactPersonName },
    { key: 'designation', label: 'Designation', value: prospect.designation },
    { key: 'mobileNumber', label: 'Mobile Number', value: prospect.mobileNumber },
    { key: 'alternateContact', label: 'Alternate Contact', value: prospect.alternateContact },
    { key: 'email', label: 'Email Address', value: prospect.email },
    { key: 'website', label: 'Website', value: prospect.website },
    { key: 'gstin', label: 'GSTIN', value: prospect.gstin },
    { key: 'pan', label: 'PAN', value: prospect.pan },
    { key: 'country', label: 'Country', value: prospect.country },
    { key: 'city', label: 'City', value: prospect.city },
    { key: 'state', label: 'State', value: prospect.state },
    { key: 'pinCode', label: 'PIN Code', value: prospect.pinCode },
    { key: 'registeredAddress', label: 'Registered Address', value: prospect.registeredAddress, fullWidth: true },
    { key: 'remarks', label: 'Remarks', value: prospect.remarks, fullWidth: true },
  ];


  return (
    <div className="space-y-4">

      <DetailCard
        title="Basic Customer Details"
        subtitle="Prospect, contact and registered address information."
        fields={basicFields}
      />

    </div>
  );
}
