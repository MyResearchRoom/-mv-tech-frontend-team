import { useId } from 'react';
import { ImagePlus } from 'lucide-react';

const controlClass = 'mt-1.5 block w-full rounded-lg border border-slate-400 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15';

function FieldShell({ label, required, hint, error, children }) {
  const id = useId();
  return <div className="min-w-0"><label htmlFor={id} className="block text-xs font-medium text-slate-700">{label}{required && <span className="ml-1 text-red-500">*</span>}</label>{children(id)}{hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}{error && <p className="mt-1 text-xs text-red-600">{error}</p>}</div>;
}

export function FormInput({ label, required = false, hint, error, className = '', ...props }) {
  return <FieldShell label={label} required={required} hint={hint} error={error}>{(id) => <input id={id} required={required} className={`${controlClass} ${className}`} {...props} />}</FieldShell>;
}

export function FormSelect({ label, required = false, hint, error, options, placeholder = 'Select…', ...props }) {
  return <FieldShell label={label} required={required} hint={hint} error={error}>{(id) => <select id={id} required={required} className={controlClass} {...props}><option value="">{placeholder}</option>{options.map((item) => typeof item === 'string' ? <option key={item} value={item}>{item}</option> : <option key={item.value} value={item.value}>{item.label}</option>)}</select>}</FieldShell>;
}

export function FormTextarea({ label, required = false, hint, error, rows = 3, ...props }) {
  return <FieldShell label={label} required={required} hint={hint} error={error}>{(id) => <textarea id={id} rows={rows} required={required} className={`${controlClass} resize-y`} {...props} />}</FieldShell>;
}

export function FormFile({ label, required = false, hint, accept, ...props }) {
  return <FieldShell label={label} required={required} hint={hint}>{(id) => <input id={id} type="file" accept={accept} required={required} className={`${controlClass} file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700`} {...props} />}</FieldShell>;
}

export function FormImageUpload({
  label,
  name,
  previewUrl,
  fileName,
  onChange,
  onView,
  accept = 'image/*',
  hint,
  imageLabel = 'image',
}) {
  return (
    <FieldShell label={label} hint={hint}>
      {(id) => (
        <div className="mt-1.5 flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={`${label} preview`}
                className="h-full w-full object-contain p-1"
              />
            ) : (
              <ImagePlus size={23} className="text-slate-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800">
              {fileName || (previewUrl ? `Current ${imageLabel}` : `No ${imageLabel} selected`)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Choose a PNG, JPG, or other image file.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <label
                htmlFor={id}
                className="inline-flex cursor-pointer items-center rounded-lg bg-brand-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-brand-700"
              >
                {previewUrl ? `Change ${imageLabel}` : `Choose ${imageLabel}`}
              </label>
              {/* {previewUrl && (
                <button
                  type="button"
                  onClick={onView}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  View logo
                </button>
              )} */}
            </div>
          </div>

          <input
            id={id}
            name={name}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(event) => {
              onChange(event.target.files?.[0] || null);
              event.currentTarget.value = '';
            }}
          />
        </div>
      )}
    </FieldShell>
  );
}
