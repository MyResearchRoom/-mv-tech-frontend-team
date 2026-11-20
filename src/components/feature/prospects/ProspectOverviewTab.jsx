
import { FileText, ExternalLink, Eye } from 'lucide-react';

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

const getDocumentName = (document, index) => {
  if (document instanceof File) return document.name;

  if (typeof document === 'string') {
    return document.split('/').pop() || `Document ${index + 1}`;
  }

  return (
    document?.name ||
    document?.originalName ||
    document?.fileName ||
    document?.filename ||
    `Document ${index + 1}`
  );
};

const getDocumentUrl = (document) => {
  if (typeof document === 'string') return document;

  if (!document || typeof document !== 'object') return null;

  return (
    document.url ||
    document.documentUrl ||
    document.fileUrl ||
    document.previewUrl ||
    null
  );
};

function DocumentsSection({ documents }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">

      <div className="border-b border-slate-300 bg-slate-100 px-4 py-3.5">
        <h3 className="text-sm font-semibold text-slate-800">
          Drawing & Document Upload
        </h3>

        <p className="mt-1 text-[11px] text-slate-500">
          Prospect drawings and technical documents
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {documents.length > 0 ? (
          documents.map((document, index) => {
            const documentName = getDocumentName(document, index);
            const documentUrl = getDocumentUrl(document);

            return (
              <div
                key={`${documentName}-${index}`}
                className="flex flex-col gap-3 px-3 py-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
                    <FileText size={18} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-xs font-semibold text-slate-800 sm:text-sm">
                      {documentName}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Document {index + 1}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end pl-[52px] sm:shrink-0 sm:pl-0">
                  {documentUrl ? (
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                    >
                      <Eye size={14} />
                      View
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
                      Available
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-4 py-8 text-center">
            <FileText
              className="mx-auto mb-2 text-slate-300"
              size={28}
            />

            <p className="text-xs font-medium text-slate-500">
              No documents available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

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

  const projectFields = [
    { key: 'projectName', label: 'Project Name', value: prospect.projectName },
    { key: 'projectType', label: 'Project Type', value: prospect.projectType },
    { key: 'projectLocation', label: 'Project Location', value: prospect.projectLocation },
    { key: 'projectStatus', label: 'Project Status', value: prospect.projectStatus },
    { key: 'builtUpArea', label: 'Approximate Built-up Area', value: prospect.builtUpArea },
    { key: 'buildingsTowers', label: 'Buildings / Towers', value: prospect.buildingsTowers },
    { key: 'floors', label: 'Floors', value: prospect.floors },
    { key: 'basements', label: 'Basements', value: prospect.basements },
    { key: 'expectedTimeline', label: 'Expected Timeline', value: prospect.expectedTimeline },
    { key: 'governingFireAuthority', label: 'Governing Fire Authority', value: prospect.governingFireAuthority },
    { key: 'siteAddress', label: 'Site Address / Project Description', value: prospect.siteAddress, fullWidth: true },
    { key: 'fireSafetyRequirements', label: 'Initial Fire Safety Requirements', value: prospect.fireSafetyRequirements, fullWidth: true },
  ];

  const documents =
    prospect.documents ||
    prospect.drawingDocuments ||
    prospect.files ||
    [];

  return (
    <div className="space-y-4 p-3 sm:p-4">

      <DetailCard
        title="Basic Prospect Details"
        subtitle="Prospect, contact and registered address information."
        fields={basicFields}
      />

      <DetailCard
        title="Initial Project Details"
        subtitle="Initial information about the prospect's project."
        fields={projectFields}
      />

      <DocumentsSection documents={Array.isArray(documents) ? documents : []} />

    </div>
  );
}
