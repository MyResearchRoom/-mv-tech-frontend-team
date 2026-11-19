import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  X,
  Trash2,
  Upload,
  FileText,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { addCompany, updateCompany } from '@/store/slices/companySlice';
import { closeAddCompany, companyUpdated, showToast } from '@/store/slices/uiSlice';
import {
  FormImageUpload,
  FormInput,
  FormSelect,
  FormTextarea,
} from '@/components/common/FormFields';
import CompanyService from '../../services/companyService';
import { handleViewDocument } from '../../utils/viewDocument';

export const companyTypes = [
  'Private Limited',
  'Public Limited',
  'LLP',
  'Partnership',
  'Proprietorship',
  'Joint Venture',
  'Other',
];

const states = [
  'Andhra Pradesh',
  'Delhi',
  'Gujarat',
  'Karnataka',
  'Kerala',
  'Maharashtra',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
  'Other',
];

const currencies = ['INR — Indian Rupee', 'USD — US Dollar'];

const documentFields = [
  {
    id: 'panCard',
    name: 'Company PAN Card',
    requirement: 'Mandatory',
    type: 'mandatory',
  },
  {
    id: 'incorporation',
    name: 'Certificate of Incorporation / Business Registration Proof',
    requirement: 'Mandatory — as per company type',
    type: 'conditional',
  },
  {
    id: 'gstCertificate',
    name: 'GST Registration Certificate',
    requirement: 'Mandatory — if GST registered',
    type: 'conditional',
  },
  {
    id: 'addressProof',
    name: 'Registered Office Address Proof',
    requirement: 'Mandatory — as applicable',
    type: 'conditional',
  },
  {
    id: 'bankProof',
    name: 'Cancelled Cheque / Bank Proof',
    requirement: 'Optional',
    type: 'optional',
  },
  {
    id: 'moa',
    name: 'MOA (Memorandum of Association)',
    requirement: 'Conditional — for applicable companies',
    type: 'conditional',
  },
  {
    id: 'aoa',
    name: 'AOA (Articles of Association)',
    requirement: 'Conditional — for applicable companies',
    type: 'conditional',
  },
  {
    id: 'llpAgreement',
    name: 'LLP Agreement',
    requirement: 'Conditional — for LLP',
    type: 'conditional',
  },
  {
    id: 'partnershipDeed',
    name: 'Partnership Deed',
    requirement: 'Conditional — for partnership',
    type: 'conditional',
  },
  {
    id: 'authorization',
    name: 'Authorized Signatory Authorization / Board Resolution',
    requirement: 'Conditional — as applicable',
    type: 'conditional',
  },
  {
    id: 'tanCertificate',
    name: 'TAN Certificate',
    requirement: 'Conditional — if TAN is required',
    type: 'conditional',
  },
  {
    id: 'professionalTax',
    name: 'Professional Tax Registration Certificate',
    requirement: 'Conditional — state-specific',
    type: 'conditional',
  },
  {
    id: 'shopsEstablishment',
    name: 'Shops & Establishment Certificate',
    requirement: 'Conditional — state-specific',
    type: 'conditional',
  },
];

const isAdditionalDocument = (document) =>
  document.isAdditional === true ||
  document.isAdditional === 1 ||
  String(document.isAdditional).toLowerCase() === 'true';

const getDocumentField = (document) => {
  const documentIdentifier = [
    document.documentKey,
    document.documentName,
    document.documentType,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase().replace(/[^a-z0-9]/g, ''));

  return documentFields.find((field) => {
    const identifiers = [field.id, field.name]
      .map((value) => value.toLowerCase().replace(/[^a-z0-9]/g, ''));
    return documentIdentifier.some((identifier) =>
      identifiers.some((fieldIdentifier) =>
        identifier === fieldIdentifier ||
        identifier.includes(fieldIdentifier) ||
        fieldIdentifier.includes(identifier)
      )
    );
  });
};


function Section({ number, title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-xs font-semibold text-white">
          {number}
        </span>

        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            {title}
          </h2>

          {subtitle && (
            <p className="text-[11px] text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Field({ children, span = false, border = false }) {
  return (
    <div
      className={`${span ? "sm:col-span-2" : ""} ${
        border ? "border rounded-md p-3" : ""
      }`}
    >
      {children}
    </div>
  );
}

const validateDocumentFile = (file) => {
  if (!file) return '';

  const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
  ];

  if (!allowedTypes.includes(file.type)) {
    return 'Only PDF, PNG and JPG files are allowed.';
  }

  if (file.size > 10 * 1024 * 1024) {
    return 'File size must not exceed 10 MB.';
  }

  return '';
};

const getApiErrorMessage = (data) => {
  if (typeof data === 'string') return data;

  const message =
    data?.message ||
    (typeof data?.error === 'string' ? data.error : data?.error?.message);
  const validationMessages = Array.isArray(data?.errors)
    ? data.errors
        .map((item) => (typeof item === 'string' ? item : item?.message))
        .filter(Boolean)
    : [];

  return [message, ...validationMessages].filter(Boolean).join(' ');
};

const toDateInputValue = (value) => {
  if (!value) return '';
  return String(value).slice(0, 10);
};

const getCompanyFormValues = (company) => ({
  companyName: company.companyName || '',
  companyType: company.companyType || '',
  // companyStatus: company.status || 'Active',
  description: company.description || '',
  website: company.website || '',
  legalName: company.legalRegisteredName || company.legalName || '',
  pan: company.pan || '',
  cin: company.cinLlpIN || company.cin || '',
  registrationNumber: company.registrationNumber || '',
  esiNumber: company.esiNumber || '',
  pfNumber: company.pfNumber || '',
  iec: company.iec || '',
  incorporationDate: toDateInputValue(
    company.dateOfIncorporation || company.incorporationDate
  ),
  country: company.country || 'India',
  state: company.state || '',
  city: company.city || '',
  pinCode: company.pinCode || '',
  registeredAddress: company.registeredOfficeAddress || company.registeredAddress || '',
  primaryContact: company.primaryContactPerson || company.primaryContact || '',
  officialEmail: company.officialEmail || '',
  mobileNumber: company.mobileNumber || '',
  financeContact: company.financeContact || '',
  financialYearStart: toDateInputValue(company.financialYearStart),
  currency: (company.baseCurrency || company.currency || 'INR').startsWith('INR')
    ? currencies[0]
    : currencies[1],
  invoicePrefix: company.invoicePrefix || '',
  quotationPrefix: company.quotationPrefix || '',
  purchaseOrderPrefix: company.purchaseOrderPrefix || '',
  paymentTerms: company.defaultPaymentTerms || company.paymentTerms || '',
  bankName: company.bankName || '',
  accountHolder: company.accountHolderName || company.accountHolder || '',
  accountNumber: company.accountNumber || '',
  ifsc: company.ifscCode || company.ifsc || '',
  billingAddress: company.bankAddress || '',
});


export default function AddCompanyModal({ companyId = null }) {
  const dispatch = useDispatch();

  const open = useSelector((state) => state.ui.addCompanyOpen);
  const formRef = useRef(null);
  const [companyData, setCompanyData] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);

  const [registrations, setRegistrations] = useState([{ id: 1 }]);
  const [activeStep, setActiveStep] = useState(1);

  const [additionalDocuments, setAdditionalDocuments] = useState([
    { id: 1, name: '' },
  ]);
  const [existingDocuments, setExistingDocuments] = useState([]);

  const [documentFiles, setDocumentFiles] = useState({});

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [country, setCountry] = useState('India');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const notifyError = (message) => {
    setError(message);
    dispatch(showToast({ type: 'error', message }));
  };

  useEffect(() => {
    if (!open) return;

    setActiveStep(1);
    setError('');
    setIsSubmitting(false);
    setCompanyData(null);
    setLoadError('');
    setRegistrations([{ id: 1 }]);
    setAdditionalDocuments([{ id: 1, name: '' }]);
    setExistingDocuments([]);
    setDocumentFiles({});
    setLogoFile(null);
    setLogoPreview('');

    if (!companyId) {
      setCountry('India');
    }
  }, [companyId, open]);

  useEffect(() => {
    if (logoFile) {
      const objectUrl = URL.createObjectURL(logoFile);
      setLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setLogoPreview(companyData?.logo || '');
    return undefined;
  }, [companyData, logoFile]);

  useEffect(() => {
    if (!open || !companyId) return undefined;

    let active = true;
    setLoadError('');

    CompanyService.getCompanyDetailsById(companyId)
      .then((company) => {
        if (!active) return;
        setCompanyData(company);
        setCountry(company.country || 'India');
        const gstRegistrations = company.gstRegistrations || [];
        setRegistrations(
          gstRegistrations.length
            ? gstRegistrations.map((registration, index) => ({
                id: registration.id || index + 1,
                values: {
                  gstStatus: registration?.gstRegistrationStatus || "",
                  taxPreference: registration.taxCalculationPreference || '',
                  gstType: registration.gstRegistrationType || '',
                  gstConfiguration: registration.defaultGstConfiguration || '',
                  placeOfSupply: registration.defaultPlaceOfSupply || '',
                  gstin: registration.gstin || '',
                  registrationState: registration.state || '',
                  registrationAddress: registration.address || '',
                },
              }))
            : [{ id: 1 }]
        );
        const documents = company.documents || [];
        setExistingDocuments(documents);
        setAdditionalDocuments(
          documents
            .filter(isAdditionalDocument)
            .map((document, index) => ({
              id: `existing-${document.id || index}`,
              name: document.documentName || '',
              isExisting: true,
              existingDocument: document,
            }))
            .concat([{ id: `new-${Date.now()}`, name: '' }])
        );
      })
      .catch((requestError) => {
        if (active) {
          setLoadError(
            requestError.response?.data?.message ||
              requestError.message ||
              'Unable to load company details.'
          );
        }
      });

    return () => {
      active = false;
    };
  }, [companyId, loadAttempt, open]);

  useEffect(() => {
    if (!open || !companyData || !formRef.current) return;

    const formValues = getCompanyFormValues(companyData);
    Object.entries(formValues).forEach(([name, value]) => {
      const field = formRef.current.elements.namedItem(name);
      if (field && 'value' in field) {
        field.value = value;
      }
    });

    registrations.forEach((registration, index) => {
      Object.entries(registration.values || {}).forEach(([fieldName, value]) => {
        const field = formRef.current.elements.namedItem(`${fieldName}${index + 1}`);
        if (field && 'value' in field) {
          field.value = value;
        }
      });
    });
  }, [companyData, open, registrations]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        dispatch(closeAddCompany());
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [dispatch, open]);

  if (!open) return null;

  if (companyId && !companyData) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-3">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-company-loading-title"
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        >
          <h2 id="edit-company-loading-title" className="text-lg font-semibold text-slate-900">
            {loadError ? 'Unable to load company' : 'Loading company details'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {loadError || 'Please wait while the company details are fetched.'}
          </p>
          <div className="mt-5 flex justify-end gap-2">
            {loadError && (
              <button
                type="button"
                onClick={() => setLoadAttempt((attempt) => attempt + 1)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Retry
              </button>
            )}
            <button
              type="button"
              onClick={() => dispatch(closeAddCompany())}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const addRegistration = () => {
    setRegistrations((prev) => [
      ...prev,
      { id: Date.now() + Math.random() },
    ]);
  };

  const removeRegistration = (id) => {
    setRegistrations((prev) =>
      prev.length > 1
        ? prev.filter((item) => item.id !== id)
        : prev
    );
  };

  const handleDocumentChange = (id, file) => {
    if (!file) return;

    const validationError = validateDocumentFile(file);

    if (validationError) {
      notifyError(validationError);
      return;
    }

    setDocumentFiles((prev) => ({
      ...prev,
      [id]: file,
    }));

    setError('');
  };


  const getExistingDocumentForField = (field) =>
    existingDocuments.find(
      (document) =>
        !isAdditionalDocument(document) &&
        getDocumentField(document)?.id === field.id
  );

  const addAdditionalDocument = () => {
    setAdditionalDocuments((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), name: '' },
    ]);
  };

  const removeAdditionalDocument = (id) => {
    setAdditionalDocuments((prev) =>
      prev.length > 1
        ? prev.filter((doc) => doc.id !== id)
        : prev
    );

    setDocumentFiles((prev) => {
      const updated = { ...prev };
      delete updated[`additional_${id}`];
      return updated;
    });
  };

  const handleNext = (event) => {
    const form = event.currentTarget.closest('form');

    if (!companyId && !form.reportValidity()) {
      notifyError('Please complete all required company details before continuing.');
      return;
    }

    setError('');
    setActiveStep(2);
  };

  const submit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const name = data.get('companyName')?.trim() || '';

    if (!name) {
      setActiveStep(1);
      notifyError('Please complete the required company details.');
      return;
    }

    const incompleteDocument = additionalDocuments.some((doc) => {
      const hasName = doc.name.trim().length > 0;
      const hasFile = Boolean(documentFiles[`additional_${doc.id}`]);

      return doc.isExisting && !hasFile ? false : hasName !== hasFile;
    });

    if (incompleteDocument) {
      notifyError('Please provide both the document name and file for each additional document.');
      return;
    }

    const invalidGST = registrations.some((_, index) => {
      const status = data.get(`gstStatus${index + 1}`);
      const gstin = data.get(`gstin${index + 1}`)?.trim() || '';
      const registrationState = data.get(`registrationState${index + 1}`)?.trim() || '';
      const hasGSTDetails = Boolean(gstin || registrationState);

      return (
        (status === 'Registered' || hasGSTDetails) &&
        (!gstin || !registrationState)
      );
    });

    if (invalidGST) {
      notifyError(
        'Please enter both the GSTIN and state for every registered or partially completed GST configuration.'
      );
      return;
    }

    const details = Object.fromEntries(
      [...data.entries()].filter(
        ([, value]) => typeof value === 'string'
      )
    );

    const state = data.get('state');

    details.gstRegistrations = registrations.map((_, index) => ({
      gstStatus: details[`gstStatus${index + 1}`] || '',
      taxPreference: details[`taxPreference${index + 1}`] || '',
      gstType: details[`gstType${index + 1}`] || '',
      gstConfiguration: details[`gstConfiguration${index + 1}`] || '',
      placeOfSupply: details[`placeOfSupply${index + 1}`] || '',
      gstin: details[`gstin${index + 1}`] || '',
      registrationState: details[`registrationState${index + 1}`] || '',
      registrationAddress: details[`registrationAddress${index + 1}`] || '',
    }));

    const uploadedMainDocuments = documentFields
      .filter((document) => documentFiles[document.id])
      .map((document) => ({
        name: document.id,
        documentName: document.id,
        documentKey: document.id,
        document: documentFiles[document.id],
        isAddition: false,
      }));

    const uploadedAdditionalDocuments = additionalDocuments
      .filter(
        (document) =>
          document.name.trim() &&
          documentFiles[`additional_${document.id}`]
      )
      .map((document) => ({
        name: document.name.trim(),
        documentName: document.name.trim(),
        documentKey: document.name.trim(),
        document: documentFiles[`additional_${document.id}`],
        isAddition: true,
      }));

    const preservedDocuments = existingDocuments.map((document) => ({
      name: document.documentName || document.documentType || 'Company document',
      documentName: document.documentName || document.documentType || 'Company document',
      documentKey: document.documentKey || document.documentName || document.documentType,
      document: document.document,
      documentContentType: document.documentContentType,
      isAddition: isAdditionalDocument(document),
      isExisting: true,
    }));

    details.documents = [
      ...preservedDocuments,
      ...uploadedMainDocuments,
      ...uploadedAdditionalDocuments,
    ];

    const companyPayload = {
      name,
      region: state || 'India',
      logo: logoFile,
      details,
    };

    try {
      setIsSubmitting(true);
      setError('');

      const response = companyId
        ? await CompanyService.updateCompany(companyId, companyPayload)
        : await CompanyService.addCompany(companyPayload);

      if (!response?.success) {
        notifyError(
          getApiErrorMessage(response) ||
            `Failed to ${companyId ? 'update' : 'create'} company.`
        );
        return;
      }

      if (companyId) {
        const updatedRecord = response.data || {};
        dispatch(updateCompany({
          ...companyData,
          ...updatedRecord,
          id: companyId,
          code: updatedRecord.companyCode || companyData.companyCode,
          name: updatedRecord.companyName || name,
          region: updatedRecord.state || state || companyData.state || 'India',
          details: {
            ...companyData,
            ...updatedRecord,
            ...details,
            companyStatus: updatedRecord.status || details.companyStatus,
          },
        }));
        dispatch(companyUpdated());
      } else {
        if (!response.data) {
          notifyError(getApiErrorMessage(response) || 'Failed to create company.');
          return;
        }

        dispatch(addCompany({
          id: response.data.id,
          code: response.data.companyCode,
          name: response.data.companyName,
          region: state || 'India',
        }));
      }

      dispatch(showToast({
        type: 'success',
        message:
          response.message ||
          `Company ${companyId ? 'updated' : 'created'} successfully.`,
      }));

      dispatch(closeAddCompany());
    } catch (requestError) {
      const apiMessage = getApiErrorMessage(requestError.response?.data);

      if (apiMessage) {
        notifyError(apiMessage);
      } else if (requestError.response) {
        notifyError(
          `Failed to ${companyId ? 'update' : 'create'} company (HTTP ${requestError.response.status}).`
        );
      } else if (requestError.request) {
        notifyError('Unable to connect to the company service. Please try again.');
      } else {
        notifyError(
          requestError.message ||
            `Failed to ${companyId ? 'update' : 'create'} company. Please try again.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          dispatch(closeAddCompany());
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-company-title"
        className="flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >

        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-2 sm:px-7">
          <div>
            <p className="text-[8px] lg:text-[10px] font-bold tracking-[0.2em] text-brand-600">
              CORE ERP CONFIGURATION
            </p>

            <h1
              id="add-company-title"
              className="mt-0.5 text-sm md:text-base lg:text-xl font-semibold text-slate-900"
            >
              {companyId ? 'Edit operating company' : 'Add operating company'}
            </h1>

            <p className="mt-0 text-xs text-slate-500 hidden md:block">
              Upload supporting company documents now or add them later.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={() => dispatch(closeAddCompany())}
            className="rounded-lg border border-slate-200 p-1 md:p-2 text-slate-500 hover:bg-slate-50"
          >
            <X size={18} />
          </button>
        </header>

        <form
          ref={formRef}
          onSubmit={submit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Step Indicator */}
          <div className="flex shrink-0 items-center justify-center gap-4 border-b border-slate-200 px-5 py-1.5 md:py-2 lg:py-3">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  activeStep === 1
                    ? 'bg-brand-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {activeStep === 1 ? '1' : <Check size={15} />}
              </span>

              <div>
                <p className="text-[10px] lg:text-xs font-semibold text-slate-800">
                  Company details
                </p>
                <p className="hidden md:block text-[10px] text-slate-400">
                  Legal, tax and financial setup
                </p>
              </div>
            </div>

            <div className="h-px w-12 bg-slate-200" />

            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  activeStep === 2
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </span>

              <div>
                <p
                  className={`text-[10px] lg:text-xs font-semibold ${
                    activeStep === 2
                      ? 'text-brand-600'
                      : 'text-slate-500'
                  }`}
                >
                  Documents
                </p>

                <p className="hidden md:block text-[10px] text-slate-400">
                  Optional supporting uploads
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="thin-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">

            {/* STEP 1: COMPANY DETAILS */}
            <div className={activeStep === 1 ? 'space-y-4' : 'hidden'}>

              {/* Section 1 */}
              <Section
                number="1"
                title="Basic Company Details"
                subtitle="Company identity, logo and operating status"
              >
                <Field>
                  <FormInput
                    label="Company Name"
                    name="companyName"
                    required
                    autoFocus
                  />
                </Field>

                <Field>
                  <FormSelect
                    label="Company Type"
                    name="companyType"
                    required
                    options={companyTypes}
                  />
                </Field>

                {/* <Field>
                  <FormSelect
                    label="Company Status"
                    name="companyStatus"
                    options={['Active', 'Inactive']}
                    defaultValue="Active"
                  />
                </Field> */}

                <Field span>
                  <FormTextarea
                    label="Business / Work Description"
                    name="description"
                    rows={2}
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Website"
                    name="website"
                    type="url"
                    placeholder="https://example.com"
                  />
                </Field>

                <Field>
                  <FormImageUpload
                    label="Company Logo"
                    name="logo"
                    accept="image/*"
                    imageLabel="logo"
                    previewUrl={logoPreview}
                    fileName={logoFile?.name}
                    onChange={setLogoFile}
                    onView={() => window.open(logoPreview, '_blank', 'noopener,noreferrer')}
                    hint="The selected or currently uploaded logo is previewed here."
                  />
                </Field>
              </Section>

              {/* Section 2 */}
              <Section
                number="2"
                title="Legal & Registration Details"
                subtitle="Statutory registration and registered office"
              >
                <Field>
                  <FormInput
                    label="Legal Registered Name"
                    name="legalName"
                    required
                  />
                </Field>

                <Field>
                  <FormInput
                    label="PAN Number"
                    name="pan"
                    required
                    pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]"
                    title="Enter a valid PAN, for example AABCM1234A"
                    placeholder="AABCM1234A"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="CIN / LLPIN"
                    name="cin"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Registration Number"
                    name="registrationNumber"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="ESI Number"
                    name="esiNumber"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="PF Number"
                    name="pfNumber"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Importer-Exporter Code (IEC)"
                    name="iec"
                    maxLength={10}
                    placeholder="10-digit IEC"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Date of Incorporation"
                    name="incorporationDate"
                    type="date"
                  />
                </Field>

                <Field>
                  <FormSelect
                    label="Country"
                    name="country"
                    required
                    options={['India']}
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                  />
                </Field>

                <Field>
                  <FormSelect
                    label="State"
                    name="state"
                    required
                    options={states}
                  />
                </Field>

                <Field>
                  <FormInput
                    label="City"
                    name="city"
                    required
                  />
                </Field>

                <Field>
                  <FormInput
                    label="PIN Code"
                    name="pinCode"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    title="Enter a 6-digit PIN code"
                    maxLength={6}
                  />
                </Field>

                <Field span>
                  <FormTextarea
                    label="Registered Office Address"
                    name="registeredAddress"
                    required
                    rows={2}
                  />
                </Field>
              </Section>

              {/* Section 3: GST */}
              <Section
                number="3"
                title="GST & Tax Configuration"
                subtitle="Multiple registrations and default tax behavior"
              >
                {/* Add GST Configuration */}
                <Field span>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addRegistration}
                      className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                    >
                      + Add GST Configuration
                    </button>
                  </div>
                </Field>

                
                {registrations.map((registration, index) => (
                  <div
                    key={registration.id}
                    className="sm:col-span-2 border border-slate-200 rounded-xl bg-slate-50 p-4 mb-4"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                      <h4 className="text-sm font-semibold text-slate-700">
                        GST Configuration {index + 1}
                      </h4>

                      {registrations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRegistration(registration.id)}
                          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                    </div>

                    {/* GST Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field>
                        <FormSelect
                          label="GST Registration Status"
                          name={`gstStatus${index + 1}`}
                          options={["Registered", "Unregistered"]}
                          defaultValue="Unregistered"
                        />
                      </Field>

                      <Field>
                        <FormSelect
                          label="Tax Calculation Preference"
                          name={`taxPreference${index + 1}`}
                          options={["Exclusive", "Inclusive"]}
                        />
                      </Field>

                      <Field>
                        <FormSelect
                          label="GST Registration Type"
                          name={`gstType${index + 1}`}
                          options={["Regular", "Composition", "Other"]}
                        />
                      </Field>

                      <Field>
                        <FormSelect
                          label="Default GST Configuration"
                          name={`gstConfiguration${index + 1}`}
                          options={[
                            "CGST + SGST for intra-state",
                            "IGST for all transactions",
                          ]}
                        />
                      </Field>

                      <Field>
                        <FormSelect
                          label="Default Place of Supply"
                          name={`placeOfSupply${index + 1}`}
                          options={states}
                        />
                      </Field>

                      <Field>
                        <FormInput
                          label="GSTIN"
                          name={`gstin${index + 1}`}
                          placeholder="Enter GSTIN"
                          pattern="[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z][1-9A-Za-z]Z[0-9A-Za-z]"
                          title="Enter a valid 15-character GSTIN"
                        />
                      </Field>

                      <Field>
                        <FormSelect
                          label="State"
                          name={`registrationState${index + 1}`}
                          options={states}
                        />
                      </Field>

                      <Field>
                        <FormInput
                          label="Registration Address"
                          name={`registrationAddress${index + 1}`}
                          placeholder="Enter Registration Address"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </Section>

              {/* Section 4 */}
              <Section
                number="4"
                title="Contact, Financial & Operational Settings"
                subtitle="Communication, prefixes, financial year and protected banking information"
              >
                <Field>
                  <FormInput
                    label="Primary Contact Person"
                    name="primaryContact"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Official Email"
                    name="officialEmail"
                    type="email"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Mobile Number"
                    name="mobileNumber"
                    type="tel"
                    pattern="[+0-9 ()-]{7,20}"
                    title="Enter a valid phone number"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Finance Contact"
                    name="financeContact"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Financial Year Start Date"
                    name="financialYearStart"
                    type="date"
                  />
                </Field>

                <Field>
                  <FormSelect
                    label="Base Currency"
                    name="currency"
                    options={currencies}
                    defaultValue={currencies[0]}
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Invoice Prefix"
                    name="invoicePrefix"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Quotation Prefix"
                    name="quotationPrefix"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Purchase Order Prefix"
                    name="purchaseOrderPrefix"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Default Payment Terms"
                    name="paymentTerms"
                    placeholder="e.g. Net 30"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Bank Name"
                    name="bankName"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Account Holder Name"
                    name="accountHolder"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="Account Number"
                    name="accountNumber"
                    type="password"
                    autoComplete="new-password"
                  />
                </Field>

                <Field>
                  <FormInput
                    label="IFSC Code"
                    name="ifsc"
                    maxLength={11}
                  />
                </Field>

                <Field span>
                  <FormTextarea
                    label="Corporate / Branch / Billing Address"
                    name="billingAddress"
                    rows={2}
                  />
                </Field>
              </Section>
            </div>

            {/* STEP 2: DOCUMENTS */}
            <div className={activeStep === 2 ? 'space-y-4' : 'hidden'}>
              <Section
                number="2"
                title="Company Documents"
                subtitle="Upload supporting company documents now or add them later."
              >
                {/* Document Checklist */}
                <Field span>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                      <FileText size={17} />
                      Document readiness checklist
                    </div>

                    <p className="mt-1 pl-6 text-xs text-slate-500">
                      The requirement column is a compliance reference only.
                      Missing files will not prevent company creation.
                    </p>
                  </div>
                </Field>

                {/* Document Table */}
                <Field span>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full min-w-[750px] text-left">
                      <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="w-16 px-3 py-3">Sr. No.</th>
                          <th className="px-3 py-3">Document Field</th>
                          <th className="w-64 px-3 py-3">Requirement</th>
                          <th className="w-56 px-3 py-3">Upload</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200">
                        {documentFields.map((doc, index) => (
                          <tr
                            key={doc.id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-3 py-3 text-xs text-slate-500">
                              {index + 1}
                            </td>

                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                                <FileText
                                  size={16}
                                  className="shrink-0 text-slate-500"
                                />
                                {doc.name}
                              </div>
                            </td>

                            <td className="px-3 py-3">
                              <span
                                className={`text-[11px] ${
                                  doc.type === 'mandatory'
                                    ? 'font-semibold text-red-600'
                                    : doc.type === 'conditional'
                                      ? 'text-amber-700'
                                      : 'text-slate-500'
                                }`}
                              >
                                {doc.requirement}
                              </span>
                            </td>

                            
                            <td className="px-3 py-3">
                              {(() => {
                                const existingDocument =
                                  getExistingDocumentForField(doc);

                                const uploadedDocument =
                                  documentFiles[doc.id] || existingDocument;

                                return (
                                  <div className="flex items-center gap-2">
                                    <label className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 bg-blue-50/50 px-3 py-2 text-[11px] font-medium text-blue-600 transition hover:bg-blue-50">
                                      <Upload size={14} />

                                      <span className="max-w-[150px] truncate">
                                        {documentFiles[doc.id]?.name ||
                                          existingDocument?.documentName || 
                                          "Choose file"}
                                      </span>

                                      <input
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        className="hidden"
                                        onChange={(event) =>
                                          handleDocumentChange(
                                            doc.id,
                                            event.target.files?.[0] || null
                                          )
                                        }
                                      />
                                    </label>

                                    {uploadedDocument && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleViewDocument(uploadedDocument, dispatch)
                                        }
                                        className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                                      >
                                        View
                                      </button>
                                    )}
                                  </div>
                                );
                              })()}
                            </td>
                          </tr>
                        ))}
                        {existingDocuments
                          .filter(
                            (document) =>
                              !isAdditionalDocument(document) &&
                              !getDocumentField(document)
                          )
                          .map((document, index) => (
                            <tr key={`main-document-${document.id || index}`}>
                              <td className="px-3 py-3 text-xs text-slate-500">
                                {documentFields.length + index + 1}
                              </td>
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                                  <FileText size={16} className="shrink-0 text-slate-500" />
                                  {document.documentName || document.documentType || 'Company document'}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-[11px] text-slate-500">
                                {document.documentType || 'Company document'}
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => 
                                  handleViewDocument(document, dispatch)  
                                  }
                                  className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </Field>

                {/* Additional Documents */}
                <Field span>
                  <div className="space-y-3 rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          Additional Documents
                        </h3>

                        <p className="text-xs text-slate-500">
                          Upload any other company-related documents.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={addAdditionalDocument}
                        className="rounded-lg border border-brand-600 px-3 py-2 text-xs font-semibold text-brand-600 transition hover:bg-blue-50"
                      >
                        + Add Document
                      </button>
                    </div>

                    {additionalDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="grid grid-cols-1 items-center gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto_36px]"
                      >
                        <input
                          type="text"
                          placeholder="Enter Document Name"
                          value={doc.name}
                          onChange={(event) =>
                            setAdditionalDocuments((prev) =>
                              prev.map((item) =>
                                item.id === doc.id
                                  ? {
                                      ...item,
                                      name: event.target.value,
                                    }
                                  : item
                              )
                            )
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500"
                        />

                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 bg-white px-3 py-2 text-xs text-blue-600 transition hover:bg-blue-50">
                          <Upload size={14} />

                          <span className="max-w-[180px] truncate">
                            {documentFiles[`additional_${doc.id}`]?.name ||
                              doc.existingDocument?.documentName ||
                              'Choose file'}
                          </span>

                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={(event) =>
                              handleDocumentChange(
                                `additional_${doc.id}`,
                                event.target.files?.[0] || null
                              )
                            }
                          />
                        </label>

                        {(documentFiles[`additional_${doc.id}`] ||
                          doc.existingDocument) && (
                          <button
                            type="button"
                            onClick={() =>
                              handleViewDocument(
                                documentFiles[`additional_${doc.id}`] ||
                                  doc.existingDocument, dispatch
                              )
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
                          >
                            View
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => removeAdditionalDocument(doc.id)}
                          disabled={additionalDocuments.length === 1}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                          title="Remove document"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Field>
              </Section>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            {activeStep === 1 ? (
              <>
                <p className="text-[9px] lg:text-[11px] text-slate-500">
                  Required fields are marked with an asterisk.
                </p>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-1.5 text-[10px] md:text-xs lg:text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Next: Documents
                  <ChevronRight size={17} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setActiveStep(1);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <ChevronLeft size={17} />
                  Back
                </button>

                <p className="hidden text-[11px] text-slate-500 sm:block">
                  Documents are optional and can be managed after creation.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-1.5 text-[10px] md:text-xs lg:text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  <Check size={17} />
                  {isSubmitting
                    ? `${companyId ? 'Updating' : 'Creating'} Company…`
                    : `${companyId ? 'Update' : 'Create'} Company`}
                </button>
              </>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
}

