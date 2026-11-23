
// import { useEffect, useState } from 'react';
// import {
//   X,
//   UserPlus,
//   UploadCloud,
//   FileText,
//   Trash2,
// } from 'lucide-react';

// import {
//   FormInput,
//   FormSelect,
// } from '@/components/common/FormFields';

// export const prospectTypes = [
//   'Individual',
//   'Company',
//   'Builder / Developer',
//   'Contractor',
//   'Consultant',
//   'Other',
// ];

// export const projectTypes = [
//   'Residential',
//   'Commercial',
//   'Industrial',
//   'Hospital',
//   'Educational',
//   'Hotel',
//   'Warehouse',
//   'Mixed Use',
//   'Other',
// ];

// export const projectStatuses = [
//   'Concept / Planning',
//   'Under Construction',
//   'Retrofit / Operational',
// ];

// const employees = [
//   'Priya Nair',
//   'Vikram Shah',
//   'Rohan Mehta',
// ];

// const countries = ['India'];

// function Section({ number, title, subtitle, children }) {
//   return (
//     <section className="overflow-hidden rounded-xl border border-slate-200">
//       <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
//         <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-xs font-semibold text-white">
//           {number}
//         </span>

//         <div>
//           <h2 className="text-sm font-semibold text-slate-800">
//             {title}
//           </h2>

//           {subtitle && (
//             <p className="text-[11px] text-slate-500">{subtitle}</p>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
//         {children}
//       </div>
//     </section>
//   );
// }

// function Field({ children, span = false }) {
//   return <div className={span ? 'sm:col-span-2' : ''}>{children}</div>;
// }

// function TextAreaField({
//   label,
//   name,
//   placeholder,
//   required = false,
//   rows = 3,
//   defaultValue = '',
// }) {
//   return (
//     <div className="w-full">
//       <label
//         htmlFor={name}
//         className="mb-1.5 block text-xs font-semibold text-slate-700"
//       >
//         {label}
//         {required && <span className="ml-1 text-red-500">*</span>}
//       </label>

//       <textarea
//         id={name}
//         name={name}
//         rows={rows}
//         placeholder={placeholder}
//         required={required}
//         defaultValue={defaultValue}
//         className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
//       />
//     </div>
//   );
// }

// export default function AddProspectModal({
//   open,
//   onClose,
//   onSubmit,
//   prospect = null,
//   isEdit = false,
//   employeesList = employees,
// }) {
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState([]);

//   useEffect(() => {
//     if (open) {
//       setError('');
//       setIsSubmitting(false);
//       setSelectedFiles([]);
//     }
//   }, [open, prospect?.id]);

//   if (!open) return null;

// const MAX_FILES = 5;

// const handleFileChange = (event) => {
//   const newFiles = Array.from(event.target.files || []);
//   const remainingSlots = MAX_FILES - selectedFiles.length;

//   if (remainingSlots <= 0) {
//     setError('You can upload a maximum of 5 documents.');
//     event.target.value = '';
//     return;
//   }

//   if (newFiles.length > remainingSlots) {
//     setError(`You can upload only ${remainingSlots} more document(s). Maximum limit is 5.`);
//     event.target.value = '';
//     return;
//   }

//   setSelectedFiles((prev) => [...prev, ...newFiles]);
//   setError('');
//   event.target.value = '';
// };

//   const removeFile = (index) => {
//     setSelectedFiles((previous) =>
//       previous.filter((_, fileIndex) => fileIndex !== index)
//     );
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError('');

//     const form = event.currentTarget;

//     if (!form.reportValidity()) return;

//     const formData = new FormData(form);

//     const prospectPayload = {
//       ...(isEdit && prospect?.id ? { id: prospect.id } : {}),

//       prospectType: formData.get('prospectType') || '',
//       prospectName: formData.get('prospectName')?.trim() || '',
//       contactPersonName: formData.get('contactPersonName')?.trim() || '',
//       designation: formData.get('designation')?.trim() || '',
//       mobileNumber: formData.get('mobileNumber')?.trim() || '',
//       alternateContact: formData.get('alternateContact')?.trim() || '',
//       email: formData.get('email')?.trim().toLowerCase() || '',
//       website: formData.get('website')?.trim() || '',
//       gstin: formData.get('gstin')?.trim() || '',
//       pan: formData.get('pan')?.trim() || '',
//       registeredAddress: formData.get('registeredAddress')?.trim() || '',
//       city: formData.get('city')?.trim() || '',
//       state: formData.get('state')?.trim() || '',
//       pinCode: formData.get('pinCode')?.trim() || '',
//       country: formData.get('country') || 'India',
//       remarks: formData.get('remarks')?.trim() || '',

//       projectName: formData.get('projectName')?.trim() || '',
//       projectType: formData.get('projectType') || '',
//       projectLocation: formData.get('projectLocation')?.trim() || '',
//       projectStatus: formData.get('projectStatus') || '',
//       builtUpArea: formData.get('builtUpArea')?.trim() || '',
//       buildingsTowers: formData.get('buildingsTowers')?.trim() || '',
//       floors: formData.get('floors')?.trim() || '',
//       basements: formData.get('basements')?.trim() || '',
//       siteAddress: formData.get('siteAddress')?.trim() || '',
//       expectedTimeline: formData.get('expectedTimeline')?.trim() || '',
//       governingFireAuthority: formData.get('governingFireAuthority')?.trim() || '',
//       fireSafetyRequirements: formData.get('fireSafetyRequirements')?.trim() || '',

//       documents: selectedFiles,
//     };

//     if (!prospectPayload.prospectType) {
//       setError('Please select prospect type.');
//       return;
//     }

//     if (!prospectPayload.prospectName) {
//       setError('Please enter prospect or company name.');
//       return;
//     }

//     if (!prospectPayload.contactPersonName) {
//       setError('Please enter contact person name.');
//       return;
//     }

//     if (!prospectPayload.email) {
//       setError('Please enter email address.');
//       return;
//     }

//     if (
//       prospectPayload.mobileNumber &&
//       !/^[0-9]{10}$/.test(prospectPayload.mobileNumber)
//     ) {
//       setError('Mobile number must contain exactly 10 digits.');
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const result = await onSubmit?.(prospectPayload);

//       if (result === false) return;

//       form.reset();
//       setSelectedFiles([]);
//       setError('');
//       onClose?.();
//     } catch (submitError) {
//       setError(
//         submitError?.message || 'Unable to save prospect details.'
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-3 sm:p-6"
//       onMouseDown={(event) => {
//         if (
//           event.target === event.currentTarget &&
//           !isSubmitting
//         ) {
//           onClose?.();
//         }
//       }}
//     >
//       <div
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="prospect-modal-title"
//         className="flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
//       >
//         {/* Header */}
//         <header className="flex shrink-0 items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
//           <div>
//             <p className="text-[10px] font-bold tracking-[0.2em] text-brand-600">
//               PROSPECT MANAGEMENT
//             </p>

//             <h1
//               id="prospect-modal-title"
//               className="mt-1 text-xl font-semibold text-slate-900"
//             >
//               {isEdit ? 'Edit Prospect' : 'Add New Prospect'}
//             </h1>

//             <p className="mt-1 text-xs text-slate-500">
//               {isEdit
//                 ? 'Update prospect and initial project information.'
//                 : 'Add prospect details and initial project information.'}
//             </p>
//           </div>

//           <button
//             type="button"
//             aria-label="Close"
//             disabled={isSubmitting}
//             onClick={onClose}
//             className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
//           >
//             <X size={18} />
//           </button>
//         </header>

//         {/* Form */}
//         <form
//           key={`${isEdit ? 'edit' : 'add'}-${prospect?.id || 'new'}`}
//           onSubmit={handleSubmit}
//           className="flex min-h-0 flex-1 flex-col"
//         >
//           <div className="thin-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">

//             {/* SECTION A */}
//             <Section
//               number="A"
//               title="Basic Prospect Details"
//               subtitle="Enter prospect, contact and registered address information."
//             >

//               <Field>
//                 <FormSelect
//                   label="Prospect Type"
//                   name="prospectType"
//                   required
//                   options={prospectTypes}
//                   defaultValue={prospect?.prospectType || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="GSTIN"
//                   name="gstin"
//                   placeholder="Enter GSTIN"
//                   defaultValue={prospect?.gstin || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Prospect / Company Name"
//                   name="prospectName"
//                   placeholder="Enter prospect or company name"
//                   defaultValue={prospect?.prospectName || ''}
//                   required
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Contact Person Name"
//                   name="contactPersonName"
//                   placeholder="Enter contact person name"
//                   defaultValue={prospect?.contactPersonName || ''}
//                   required
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Designation"
//                   name="designation"
//                   placeholder="Enter designation"
//                   defaultValue={prospect?.designation || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Mobile Number"
//                   name="mobileNumber"
//                   type="tel"
//                   placeholder="Enter 10-digit mobile number"
//                   defaultValue={prospect?.mobileNumber || ''}
//                   pattern="[0-9]{10}"
//                   title="Enter a valid 10-digit mobile number"
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Alternate Contact"
//                   name="alternateContact"
//                   type="tel"
//                   placeholder="Enter alternate contact"
//                   defaultValue={prospect?.alternateContact || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Email Address"
//                   name="email"
//                   type="email"
//                   placeholder="example@company.com"
//                   defaultValue={prospect?.email || ''}
//                   required
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Website"
//                   name="website"
//                   type="url"
//                   placeholder="https://example.com"
//                   defaultValue={prospect?.website || ''}
//                 />
//               </Field>

             

//                <Field>
//                 <FormInput
//                   label="PAN"
//                   name="pan"
//                   placeholder="Enter PAN"
//                   defaultValue={prospect?.pan || ''}
//                 />
//               </Field>

//               <Field span>
//                 <TextAreaField
//                   label="Registered Address"
//                   name="registeredAddress"
//                   placeholder="Enter registered address"
//                   defaultValue={prospect?.registeredAddress || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormSelect
//                   label="Country"
//                   name="country"
//                   options={countries}
//                   defaultValue={prospect?.country || 'India'}
//                 />
//               </Field>

              

//               <Field>
//                 <FormInput
//                   label="City"
//                   name="city"
//                   placeholder="Enter city"
//                   defaultValue={prospect?.city || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="State"
//                   name="state"
//                   placeholder="Enter state"
//                   defaultValue={prospect?.state || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="PIN Code"
//                   name="pinCode"
//                   placeholder="Enter PIN code"
//                   defaultValue={prospect?.pinCode || ''}
//                 />
//               </Field>

//               <Field span>
//                 <TextAreaField
//                   label="Remarks"
//                   name="remarks"
//                   placeholder="Enter additional remarks"
//                   defaultValue={prospect?.remarks || ''}
//                 />
//               </Field>
//             </Section>

//             {/* SECTION B */}
//             <Section
//               number="B"
//               title="Initial Project Details"
//               subtitle="Incomplete information can be updated later."
//             >
//               <Field>
//                 <FormInput
//                   label="Project Name"
//                   name="projectName"
//                   placeholder="Enter project name"
//                   defaultValue={prospect?.projectName || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormSelect
//                   label="Project Type"
//                   name="projectType"
//                   options={projectTypes}
//                   defaultValue={prospect?.projectType || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Project Location"
//                   name="projectLocation"
//                   placeholder="Enter project location"
//                   defaultValue={prospect?.projectLocation || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormSelect
//                   label="Project Status"
//                   name="projectStatus"
//                   options={projectStatuses}
//                   defaultValue={prospect?.projectStatus || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Approximate Built-up Area"
//                   name="builtUpArea"
//                   placeholder="Enter area"
//                   defaultValue={prospect?.builtUpArea || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Buildings / Towers"
//                   name="buildingsTowers"
//                   type="number"
//                   placeholder="Enter number"
//                   defaultValue={prospect?.buildingsTowers || ''}
//                   min="0"
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Floors"
//                   name="floors"
//                   type="number"
//                   placeholder="Enter number of floors"
//                   defaultValue={prospect?.floors || ''}
//                   min="0"
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Basements"
//                   name="basements"
//                   type="number"
//                   placeholder="Enter number of basements"
//                   defaultValue={prospect?.basements || ''}
//                   min="0"
//                 />
//               </Field>

//               <Field span>
//                 <TextAreaField
//                   label="Site Address / Project Description"
//                   name="siteAddress"
//                   placeholder="Enter site address or project description"
//                   defaultValue={prospect?.siteAddress || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Expected Timeline"
//                   name="expectedTimeline"
//                   placeholder="e.g. 6 months"
//                   defaultValue={prospect?.expectedTimeline || ''}
//                 />
//               </Field>

//               <Field>
//                 <FormInput
//                   label="Governing Fire Authority"
//                   name="governingFireAuthority"
//                   placeholder="Enter fire authority"
//                   defaultValue={prospect?.governingFireAuthority || ''}
//                 />
//               </Field>

//               <Field span>
//                 <TextAreaField
//                   label="Initial Fire Safety Requirements"
//                   name="fireSafetyRequirements"
//                   placeholder="Describe initial fire safety requirements"
//                   defaultValue={prospect?.fireSafetyRequirements || ''}
//                 />
//               </Field>
//             </Section>

//             {/* SECTION C */}
//             <Section
//               number="C"
//               title="Drawing & Document Upload"
//               subtitle="PDF, DWG, DXF, JPG and PNG files. Files remain linked to the prospect until conversion."
//             >
//               <Field span>
//                 <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
//                   <div className="flex flex-col items-center justify-center text-center">
//                     <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
//                       <UploadCloud size={24} />
//                     </div>

//                     <h3 className="text-sm font-semibold text-slate-800">
//                       Upload prospect drawings and technical documents
//                     </h3>

//                     <p className="mt-1 text-xs text-slate-500">
//                       Supported formats: PDF, DWG, DXF, JPG and PNG
//                     </p>

//                     <p className="mt-1 text-xs font-medium text-amber-600">
//                       Maximum 5 documents can be uploaded at a time.
//                     </p>

//                     <label
//                     className={`mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition ${
//                       selectedFiles.length >= 5
//                         ? 'cursor-not-allowed bg-slate-400'
//                         : 'cursor-pointer bg-brand-600 hover:bg-brand-700'
//                     }`}
//                   >
//                     <UploadCloud size={15} />
//                     {selectedFiles.length >= 5 ? 'Maximum Files Reached' : 'Choose Files'}

//                     <input
//                       type="file"
//                       multiple
//                       accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png"
//                       onChange={handleFileChange}
//                       disabled={selectedFiles.length >= 5}
//                       className="hidden"
//                     />
//                   </label>
//                   </div>

//                   {selectedFiles.length > 0 && (
//                     <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
//                       <p className="text-xs font-semibold text-slate-700">
//                         Selected Documents ({selectedFiles.length})
//                       </p>

//                       {selectedFiles.map((file, index) => (
//                         <div
//                           key={`${file.name}-${index}`}
//                           className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
//                         >
//                           <div className="flex min-w-0 items-center gap-2">
//                             <FileText
//                               size={17}
//                               className="shrink-0 text-brand-600"
//                             />

//                             <div className="min-w-0">
//                               <p className="truncate text-xs font-medium text-slate-700">
//                                 {file.name}
//                               </p>
//                               <p className="text-[10px] text-slate-400">
//                                 {(file.size / 1024 / 1024).toFixed(2)} MB
//                               </p>
//                             </div>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={() => removeFile(index)}
//                             className="shrink-0 rounded-md p-1.5 text-red-500 transition hover:bg-red-50"
//                             title="Remove file"
//                           >
//                             <Trash2 size={15} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </Field>
//             </Section>  

//             {error && (
//               <p
//                 role="alert"
//                 className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
//               >
//                 {error}
//               </p>
//             )}
//           </div>

//           {/* Footer */}
//           <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
//             <p className="text-[11px] text-slate-500">
//               Fields marked with an asterisk are required.
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 disabled={isSubmitting}
//                 onClick={onClose}
//                 className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 <UserPlus size={16} />
//                 {isSubmitting
//                   ? 'Saving...'
//                   : isEdit
//                     ? 'Update Prospect'
//                     : 'Add Prospect'}
//               </button>
//             </div>
//           </footer>
//         </form>
//       </div>
//     </div>
//   );
// }




import { useEffect, useRef, useState } from 'react';
import {
  X,
  UserPlus,
  UploadCloud,
  FileText,
  Trash2,
} from 'lucide-react';

import { useDispatch } from 'react-redux';
import { showToast } from '@/store/slices/uiSlice';

import ProspectService from '@/services/prospectService';
import GSTService from '@/services/gstService';
import useActiveCompany from '@/hooks/useActiveCompany';

import {
  FormInput,
  FormSelect,
} from '@/components/common/FormFields';

export const prospectTypes = [
  'Individual',
  'Company',
  'Builder / Developer',
  'Contractor',
  'Consultant',
  'Other',
];

export const projectTypes = [
  'Residential',
  'Commercial',
  'Industrial',
  'Hospital',
  'Educational',
  'Hotel',
  'Warehouse',
  'Mixed Use',
  'Other',
];

export const projectStatuses = [
  'Concept / Planning',
  'Under Construction',
  'Retrofit / Operational',
];

const employees = [
  'Priya Nair',
  'Vikram Shah',
  'Rohan Mehta',
];

const countries = ['India'];
const MAX_FILES = 5;

const getApiResponseMessage = (data, fallback) => {
  const firstValidationMessage = Array.isArray(data?.errors)
    ? data.errors.find(
        (validationError) =>
          typeof validationError?.msg === 'string' &&
          validationError.msg.trim()
      )?.msg
    : '';

  return firstValidationMessage || data?.message || fallback;
};

function normalizeWebsite(value) {
  const website = value.trim();
  if (!website) return '';

  const normalizedWebsite = /^[a-z][a-z\d+.-]*:\/\//i.test(website)
    ? website
    : `https://${website}`;

  try {
    const url = new URL(normalizedWebsite);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function Section({ number, title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-xs font-semibold text-white">
          {number}
        </span>

        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            {title}
          </h2>

          {subtitle && (
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Field({ children, span = false }) {
  return <div className={span ? 'sm:col-span-2' : ''}>{children}</div>;
}

function TextAreaField({
  label,
  name,
  placeholder,
  required = false,
  rows = 3,
  defaultValue = '',
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold text-slate-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}

export default function AddProspectModal({
  open,
  onClose,
  onSubmit,
  prospect: initialProspect = null,
  isEdit = false,
  employeesList = employees,
}) {
  const dispatch = useDispatch();
  const { activeCompany } = useActiveCompany();

  const [prospect, setProspect] = useState(initialProspect);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingProspect, setIsFetchingProspect] = useState(false);
  const [gstLoading, setGstLoading] = useState(false);

  const formRef = useRef(null);

  const notifyError = (message) => {
    dispatch(showToast({
      type: 'error',
      message,
    }));
  };

  const notifySuccess = (message) => {
    dispatch(showToast({
      type: 'success',
      message,
    }));
  };

  useEffect(() => {
    if (!open) return;

    setProspect(initialProspect);
    setExistingDocuments([]);
    setSelectedFiles([]);
    setIsSubmitting(false);
    setGstLoading(false);

    if (!isEdit || !initialProspect?.id) {
      setIsFetchingProspect(false);
      return;
    }

    let isMounted = true;

    const fetchProspect = async () => {
      try {
        setIsFetchingProspect(true);

        const response = await ProspectService.getProspectByIdForEdit(
          initialProspect.id
        );

        if (!response?.success || !response?.data) {
          throw new Error(
            getApiResponseMessage(response, 'Unable to fetch prospect details.')
          );
        }

        const data = response.data;

        const project = Array.isArray(data.project)
          ? data.project[0] || {}
          : data.project || {};

        if (!isMounted) return;

        setProspect({
          ...data,

          // Basic prospect details
          prospectType: data.prospectType || '',
          prospectName: data.companyName || data.prospectName || '',
          contactPersonName: data.contactPerson || data.contactPersonName || '',
          mobileNumber: data.mobile || data.mobileNumber || '',

          // Project details
          projectName: project.projectName || '',
          projectType: project.projectType || '',
          projectLocation: project.projectLocation || '',
          projectStatus: project.projectStatus || '',
          builtUpArea: project.builtUpArea ?? '',
          buildingsTowers: project.towers ?? project.buildingsTowers ?? '',
          floors: project.floors ?? '',
          basements: project.basements ?? '',
          siteAddress: project.siteAddress || '',
          expectedTimeline: project.expectedTimeline || '',
          governingFireAuthority:
            project.fireAuthority || project.governingFireAuthority || '',
          fireSafetyRequirements:
            project.fireRequirements || project.fireSafetyRequirements || '',
        });

        setExistingDocuments(data.documents || []);
      } catch (fetchError) {
        if (isMounted) {
          notifyError(
            getApiResponseMessage(
              fetchError?.response?.data,
              fetchError?.message || 'Unable to fetch prospect details.'
            )
          );
        }
      } finally {
        if (isMounted) {
          setIsFetchingProspect(false);
        }
      }
    };

    fetchProspect();

    return () => {
      isMounted = false;
    };
  }, [open, initialProspect?.id, isEdit]);

  if (!open) return null;

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files || []);
    const remainingSlots =
      MAX_FILES - existingDocuments.length - selectedFiles.length;

    if (remainingSlots <= 0) {
      notifyError('You can upload a maximum of 5 documents.');
      event.target.value = '';
      return;
    }

    if (newFiles.length > remainingSlots) {
      notifyError(
        `You can upload only ${remainingSlots} more document(s). Maximum limit is 5.`
      );
      event.target.value = '';
      return;
    }

    setSelectedFiles((previous) => [...previous, ...newFiles]);
    event.target.value = '';
  };

  const removeFile = (index) => {
    setSelectedFiles((previous) =>
      previous.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  const removeExistingDocument = async (documentId) => {
    try {
      const response = await ProspectService.deleteProspectDocument(
        documentId
      );

      if (response?.success === false) {
        throw new Error(
          getApiResponseMessage(response, 'Unable to delete document.')
        );
      }

      setExistingDocuments((previous) =>
        previous.filter((document) => document.id !== documentId)
      );

      notifySuccess(
        getApiResponseMessage(response, 'Document deleted successfully.')
      );
    } catch (deleteError) {
      notifyError(
        getApiResponseMessage(
          deleteError?.response?.data,
          deleteError?.message || 'Unable to delete document.'
        )
      );
    }
  };

  const handleFetchGST = async () => {
    const gstinField = formRef.current?.elements.namedItem('gstin');
    const gstin = gstinField?.value?.trim().toUpperCase();

    if (!gstin) {
      notifyError('Please enter GSTIN first.');
      gstinField?.focus();
      return;
    }

    const gstinRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

    if (!gstinRegex.test(gstin)) {
      notifyError('Please enter a valid 15-character GSTIN.');
      gstinField?.focus();
      return;
    }

    try {
      setGstLoading(true);

      const response = await GSTService.fetchGSTDetails(gstin);

      if (!response?.success || !response?.data) {
        throw new Error(
          getApiResponseMessage(response, 'GST details not found.')
        );
      }

      const gst = response.data;
      const addressDetails = gst.addressDetails || {};

      const state =
        addressDetails.state ||
        gst.state ||
        '';

      const address =
        (typeof gst.address === 'string' && gst.address.trim()) ||
        [
          addressDetails.building_name,
          addressDetails.building_num,
          addressDetails.street,
          addressDetails.locality,
          gst.city,
          state,
          gst.pincode || gst.pinCode,
        ]
          .filter(Boolean)
          .join(', ');

      const formValues = {
        gstin: gst.gstin || gstin,
        prospectName: gst.tradeName || gst.legalName || '',
        pan: gst.pan || '',
        registeredAddress: address,
        city: gst.city || '',
        state,
        pinCode: gst.pincode || gst.pinCode || '',
      };

      Object.entries(formValues).forEach(([name, value]) => {
        const field = formRef.current?.elements.namedItem(name);

        if (field && value) {
          field.value = value;
        }
      });

      notifySuccess(
        getApiResponseMessage(response, 'GST details fetched successfully.')
      );
    } catch (requestError) {
      notifyError(
        getApiResponseMessage(
          requestError?.response?.data,
          requestError?.message || 'Unable to fetch GST details.'
        )
      );
    } finally {
      setGstLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      const invalidField = form.querySelector(':invalid');

      notifyError(
        invalidField?.validationMessage ||
        'Please check the form fields.'
      );

      invalidField?.focus();
      return;
    }

    const formData = new FormData(form);
    const websiteInput = form.elements.namedItem('website');
    const website = normalizeWebsite(formData.get('website')?.trim() || '');

    if (website === null) {
      notifyError('Please enter a valid website URL.');
      websiteInput?.focus();
      return;
    }

    if (!activeCompany.id) {
      notifyError('Active compoany not found');
      return;
    }

    const prospectPayload = {
      ...(isEdit && prospect?.id ? { id: prospect.id } : {}),
      companyId: activeCompany?.id,
      prospectType: formData.get('prospectType') || '',
      prospectName: formData.get('prospectName')?.trim() || '',
      contactPersonName:
        formData.get('contactPersonName')?.trim() || '',
      designation: formData.get('designation')?.trim() || '',
      mobileNumber: formData.get('mobileNumber')?.trim() || '',
      alternateContact: formData.get('alternateContact')?.trim() || '',
      email: formData.get('email')?.trim().toLowerCase() || '',
      website,
      gstin: formData.get('gstin')?.trim().toUpperCase() || '',
      pan: formData.get('pan')?.trim().toUpperCase() || '',
      registeredAddress:
        formData.get('registeredAddress')?.trim() || '',
      city: formData.get('city')?.trim() || '',
      state: formData.get('state')?.trim() || '',
      pinCode: formData.get('pinCode')?.trim() || '',
      country: formData.get('country') || 'India',
      remarks: formData.get('remarks')?.trim() || '',

      projectName: formData.get('projectName')?.trim() || '',
      projectType: formData.get('projectType') || '',
      projectLocation:
        formData.get('projectLocation')?.trim() || '',
      projectStatus: formData.get('projectStatus') || '',
      builtUpArea: formData.get('builtUpArea')?.trim() || '',
      buildingsTowers:
        formData.get('buildingsTowers')?.trim() || '',
      floors: formData.get('floors')?.trim() || '',
      basements: formData.get('basements')?.trim() || '',
      siteAddress: formData.get('siteAddress')?.trim() || '',
      expectedTimeline:
        formData.get('expectedTimeline')?.trim() || '',
      governingFireAuthority:
        formData.get('governingFireAuthority')?.trim() || '',
      fireSafetyRequirements:
        formData.get('fireSafetyRequirements')?.trim() || '',

      documents: selectedFiles,
    };


    if (!prospectPayload.prospectType) {
      notifyError('Please select prospect type.');
      return;
    }

    if (!prospectPayload.prospectName) {
      notifyError('Please enter prospect or company name.');
      return;
    }

    if (!prospectPayload.contactPersonName) {
      notifyError('Please enter contact person name.');
      return;
    }

    if (!prospectPayload.email) {
      notifyError('Please enter email address.');
      return;
    }

    if (!/^[0-9]{10}$/.test(prospectPayload.mobileNumber)) {
      notifyError('Mobile number must contain exactly 10 digits.');
      return;
    }

    if (
      prospectPayload.gstin &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
        prospectPayload.gstin
      )
    ) {
      notifyError('Please enter a valid 15-character GSTIN.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = isEdit
        ? await ProspectService.updateProspect(
            prospect.id,
            prospectPayload
          )
        : await ProspectService.addProspect(prospectPayload);

      if (!response?.success) {
        throw new Error(
          getApiResponseMessage(response, 'Unable to save prospect.')
        );
      }

      const result = await onSubmit?.(response.data, isEdit);

      if (result === false) return;

      notifySuccess(
        getApiResponseMessage(
          response,
          isEdit
            ? 'Prospect updated successfully.'
            : 'Prospect added successfully.'
        )
      );

      form.reset();
      setSelectedFiles([]);
      onClose?.();
    } catch (submitError) {
      notifyError(
        getApiResponseMessage(
          submitError?.response?.data,
          submitError?.message || 'Unable to save prospect details.'
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formKey = `${isEdit ? 'edit' : 'add'}-${prospect?.id || 'new'}-${isFetchingProspect ? 'loading' : 'loaded'}`;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prospect-modal-title"
        className="flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-brand-600">
              PROSPECT MANAGEMENT
            </p>

            <h1
              id="prospect-modal-title"
              className="mt-1 text-xl font-semibold text-slate-900"
            >
              {isEdit ? 'Edit Prospect' : 'Add New Prospect'}
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              {isEdit
                ? 'Update prospect and initial project information.'
                : 'Add prospect details and initial project information.'}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </header>

        {/* Form */}
        <form
          ref={formRef}
          key={formKey}
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="thin-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">

            {isFetchingProspect ? (
              <div className="py-8 text-center text-sm text-slate-500">
                Loading prospect details...
              </div>
            ) : (
              <>
                {/* SECTION A */}
                <Section
                  number="A"
                  title="Basic Prospect Details"
                  subtitle="Enter prospect, contact and registered address information."
                >
                  <div className="col-span-1 grid grid-cols-1 items-end gap-4 sm:col-span-2 sm:grid-cols-2">
                    <Field>
                      <FormInput
                        label="GSTIN"
                        name="gstin"
                        placeholder="Enter GSTIN"
                        defaultValue={prospect?.gstin || ''}
                        maxLength={15}
                        pattern="[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z][1-9A-Za-z]Z[0-9A-Za-z]"
                        title="Enter a valid 15-character GSTIN"
                      />
                    </Field>

                    <Field>
                      <button
                        type="button"
                        onClick={handleFetchGST}
                        disabled={gstLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {gstLoading ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Fetching GST Details...
                          </>
                        ) : (
                          'Fetch GST Details'
                        )}
                      </button>
                    </Field>
                  </div>

                  <Field>
                    <FormSelect
                      label="Prospect Type"
                      name="prospectType"
                      required
                      options={prospectTypes}
                      defaultValue={prospect?.prospectType || ''}
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="Prospect / Company Name"
                      name="prospectName"
                      placeholder="Enter prospect or company name"
                      defaultValue={prospect?.prospectName || ''}
                      required
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="Contact Person Name"
                      name="contactPersonName"
                      placeholder="Enter contact person name"
                      defaultValue={prospect?.contactPersonName || ''}
                      required
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="Designation"
                      name="designation"
                      placeholder="Enter designation"
                      defaultValue={prospect?.designation || ''}
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="Mobile Number"
                      name="mobileNumber"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      defaultValue={prospect?.mobileNumber || ''}
                      pattern="[0-9]{10}"
                      title="Enter a valid 10-digit mobile number"
                      required
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="Alternate Contact"
                      name="alternateContact"
                      type="tel"
                      placeholder="Enter alternate contact"
                      defaultValue={prospect?.alternateContact || ''}
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="example@company.com"
                      defaultValue={prospect?.email || ''}
                      required
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="Website"
                      name="website"
                      type="text"
                      inputMode="url"
                      placeholder="https://example.com"
                      defaultValue={prospect?.website || ''}
                      required
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="PAN"
                      name="pan"
                      placeholder="Enter PAN"
                      defaultValue={prospect?.pan || ''}
                    />
                  </Field>

                  <Field span>
                    <TextAreaField
                      label="Registered Address"
                      name="registeredAddress"
                      placeholder="Enter registered address"
                      defaultValue={prospect?.registeredAddress || ''}
                    />
                  </Field>

                  <Field>
                    <FormSelect
                      label="Country"
                      name="country"
                      options={countries}
                      defaultValue={prospect?.country || 'India'}
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="City"
                      name="city"
                      placeholder="Enter city"
                      defaultValue={prospect?.city || ''}
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="State"
                      name="state"
                      placeholder="Enter state"
                      defaultValue={prospect?.state || ''}
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="PIN Code"
                      name="pinCode"
                      placeholder="Enter PIN code"
                      defaultValue={prospect?.pinCode || ''}
                    />
                  </Field>

                  <Field span>
                    <TextAreaField
                      label="Remarks"
                      name="remarks"
                      placeholder="Enter additional remarks"
                      defaultValue={prospect?.remarks || ''}
                    />
                  </Field>
                </Section>

                {/* SECTION B */}
                <Section
                  number="B"
                  title="Initial Project Details"
                  subtitle="Incomplete information can be updated later."
                >
                  <Field>
                    <FormInput
                      label="Project Name"
                      name="projectName"
                      placeholder="Enter project name"
                      defaultValue={prospect?.projectName || ''}
                    />
                  </Field>

                  <Field>
                    <FormSelect
                      label="Project Type"
                      name="projectType"
                      options={projectTypes}
                      defaultValue={prospect?.projectType || ''}
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="Project Location"
                      name="projectLocation"
                      placeholder="Enter project location"
                      defaultValue={prospect?.projectLocation || ''}
                    />
                  </Field>

                  <Field>
                    <FormSelect
                      label="Project Status"
                      name="projectStatus"
                      options={projectStatuses}
                      defaultValue={prospect?.projectStatus || ''}
                    />
                  </Field>

                  {/* <Field>
                    <FormInput
                      label="Approximate Built-up Area"
                      name="builtUpArea"
                      placeholder="Enter area"
                      defaultValue={prospect?.builtUpArea ?? ''}
                    />
                  </Field> */}

                  <Field>
                    <FormInput
                      label="Buildings / Towers"
                      name="buildingsTowers"
                      type="number"
                      placeholder="Enter number"
                      defaultValue={prospect?.buildingsTowers ?? ''}
                      min="0"
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="Floors"
                      name="floors"
                      type="number"
                      placeholder="Enter number of floors"
                      defaultValue={prospect?.floors ?? ''}
                      min="0"
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="Basements"
                      name="basements"
                      type="number"
                      placeholder="Enter number of basements"
                      defaultValue={prospect?.basements ?? ''}
                      min="0"
                    />
                  </Field>

                  <Field span>
                    <TextAreaField
                      label="Site Address / Project Description"
                      name="siteAddress"
                      placeholder="Enter site address or project description"
                      defaultValue={prospect?.siteAddress || ''}
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="Expected Timeline"
                      name="expectedTimeline"
                      placeholder="e.g. 6 months"
                      defaultValue={prospect?.expectedTimeline || ''}
                    />
                  </Field>

                  <Field>
                    <FormInput
                      label="Governing Fire Authority"
                      name="governingFireAuthority"
                      placeholder="Enter fire authority"
                      defaultValue={prospect?.governingFireAuthority || ''}
                    />
                  </Field>

                  <Field span>
                    <TextAreaField
                      label="Initial Fire Safety Requirements"
                      name="fireSafetyRequirements"
                      placeholder="Describe initial fire safety requirements"
                      defaultValue={prospect?.fireSafetyRequirements || ''}
                    />
                  </Field>
                </Section>

                {/* SECTION C */}
                <Section
                  number="C"
                  title="Drawing & Document Upload"
                  subtitle="PDF, DWG, DXF, JPG and PNG files. Files remain linked to the prospect until conversion."
                >
                  <Field span>
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                          <UploadCloud size={24} />
                        </div>

                        <h3 className="text-sm font-semibold text-slate-800">
                          Upload prospect drawings and technical documents
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Supported formats: PDF, DWG, DXF, JPG and PNG
                        </p>

                        <p className="mt-1 text-xs font-medium text-amber-600">
                          Maximum 5 documents can be uploaded at a time.
                        </p>

                        <label
                          className={`mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition ${
                            existingDocuments.length + selectedFiles.length >= MAX_FILES
                              ? 'cursor-not-allowed bg-slate-400'
                              : 'cursor-pointer bg-brand-600 hover:bg-brand-700'
                          }`}
                        >
                          <UploadCloud size={15} />
                          {existingDocuments.length + selectedFiles.length >= MAX_FILES
                            ? 'Maximum Files Reached'
                            : 'Choose Files'}

                          <input
                            type="file"
                            multiple
                            accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            disabled={
                              existingDocuments.length + selectedFiles.length >= MAX_FILES
                            }
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* EXISTING DOCUMENTS */}
                      {existingDocuments.length > 0 && (
                        <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
                          <p className="text-xs font-semibold text-slate-700">
                            Existing Documents ({existingDocuments.length})
                          </p>

                          {existingDocuments.map((document) => (
                            <div
                              key={document.id}
                              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <FileText
                                  size={17}
                                  className="shrink-0 text-brand-600"
                                />

                                <p className="truncate text-xs font-medium text-slate-700">
                                  {document.fileName || document.name || 'Document'}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeExistingDocument(document.id)}
                                disabled={isSubmitting}
                                className="shrink-0 rounded-md p-1.5 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                title="Delete existing document"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* NEW SELECTED DOCUMENTS */}
                      {selectedFiles.length > 0 && (
                        <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
                          <p className="text-xs font-semibold text-slate-700">
                            Selected Documents ({selectedFiles.length})
                          </p>

                          {selectedFiles.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <FileText
                                  size={17}
                                  className="shrink-0 text-brand-600"
                                />

                                <div className="min-w-0">
                                  <p className="truncate text-xs font-medium text-slate-700">
                                    {file.name}
                                  </p>

                                  <p className="text-[10px] text-slate-400">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="shrink-0 rounded-md p-1.5 text-red-500 transition hover:bg-red-50"
                                title="Remove file"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>
                </Section>
              </>
            )}
          </div>

          {/* Footer */}
          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <p className="text-[11px] text-slate-500">
              Fields marked with an asterisk are required.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isFetchingProspect}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserPlus size={16} />

                {isSubmitting
                  ? 'Saving...'
                  : isEdit
                    ? 'Update Prospect'
                    : 'Add Prospect'}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
