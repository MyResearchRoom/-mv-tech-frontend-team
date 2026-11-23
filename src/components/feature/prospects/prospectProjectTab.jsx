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


export default function ProspectProspectTab({ prospect = {} }) {

  const projectFields = [
    { key: 'projectName', label: 'Project Name', value: prospect.projectName },
    { key: 'projectType', label: 'Project Type', value: prospect.projectType },
    { key: 'projectLocation', label: 'Project Location', value: prospect.projectLocation },
    { key: 'projectStatus', label: 'Project Status', value: prospect.projectStatus },
    { key: 'buildingsTowers', label: 'Buildings / Towers', value: prospect.buildingsTowers },
    { key: 'floors', label: 'Floors', value: prospect.floors },
    { key: 'basements', label: 'Basements', value: prospect.basements },
    { key: 'expectedTimeline', label: 'Expected Timeline', value: prospect.expectedTimeline },
    { key: 'governingFireAuthority', label: 'Governing Fire Authority', value: prospect.governingFireAuthority },
    { key: 'siteAddress', label: 'Site Address / Project Description', value: prospect.siteAddress, fullWidth: true },
    { key: 'fireSafetyRequirements', label: 'Initial Fire Safety Requirements', value: prospect.fireSafetyRequirements, fullWidth: true },
  ];


  return (
    <div className="space-y-4 ">

      <DetailCard
        title="Initial Project Details"
        subtitle="Initial information about the prospect's project."
        fields={projectFields}
      />


    </div>
  );
}
