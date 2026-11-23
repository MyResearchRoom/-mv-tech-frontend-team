import API from './api';

const COMPANY_FIELDS = {
  companyType: 'companyType',
  description: 'description',
  website: 'website',
  legalRegisteredName: 'legalName',
  pan: 'pan',
  cinLlpIN: 'cin',
  registrationNumber: 'registrationNumber',
  esiNumber: 'esiNumber',
  pfNumber: 'pfNumber',
  iec: 'iec',
  dateOfIncorporation: 'incorporationDate',
  country: 'country',
  registeredOfficeAddress: 'registeredAddress',
  state: 'state',
  city: 'city',
  pinCode: 'pinCode',
  primaryContactPerson: 'primaryContact',
  officialEmail: 'officialEmail',
  mobileNumber: 'mobileNumber',
  financeContact: 'financeContact',
  financialYearStart: 'financialYearStart',
  invoicePrefix: 'invoicePrefix',
  quotationPrefix: 'quotationPrefix',
  purchaseOrderPrefix: 'purchaseOrderPrefix',
  defaultPaymentTerms: 'paymentTerms',
  bankName: 'bankName',
  accountHolderName: 'accountHolder',
  accountNumber: 'accountNumber',
  ifscCode: 'ifsc',
  bankAddress: 'billingAddress',
};

const toCompanyDocumentFile = async (document) => {
  const content = document.document;
  const filename = document.documentName || document.name || 'company-document';

  if (content instanceof File) return content;
  if (content instanceof Blob) {
    return new File([content], filename, {
      type: document.documentContentType || content.type,
    });
  }
  if (typeof content !== 'string' || !content) {
    if (document.isExisting) {
      throw new Error(`The existing document "${filename}" has no file data to preserve.`);
    }
    return null;
  }

  const source = /^(data:|https?:|blob:)/i.test(content)
    ? content
    : `data:${document.documentContentType || 'application/octet-stream'};base64,${content}`;

  try {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Unable to retrieve "${filename}" for upload.`);
    }
    const blob = await response.blob();
    return new File([blob], filename, {
      type: document.documentContentType || blob.type,
    });
  } catch (error) {
    throw new Error(`Unable to preserve existing document "${filename}": ${error.message}`);
  }
};

const createCompanyFormData = async ({ name, logo, details }) => {
  const formData = new FormData();
  formData.append('companyName', name);
  formData.append('baseCurrency', details.currency?.slice(0, 3) || 'INR');
  // formData.append('bankAddress',details.currency);

  Object.entries(COMPANY_FIELDS).forEach(([apiField, formField]) => {
    const value = details[formField];
    if (value !== undefined && value !== '') {
      formData.append(apiField, value);
    }
  });

  if (logo instanceof File && logo.size > 0) {
    formData.append('logo', logo);
  }

  const gstRegistrations = (details.gstRegistrations || [])
    .filter((registration) => registration.gstin && registration.registrationState)
    .map((registration) => {
      const gstRegistration = {
        gstin: registration.gstin,
        state: registration.registrationState,
      };

      const optionalFields = {
        address: registration.registrationAddress,
        gstRegistrationStatus: registration.gstStatus,
        taxCalculationPreference: registration.taxPreference,
        gstRegistrationType: registration.gstType,
        defaultGstConfiguration: registration.gstConfiguration,
        defaultPlaceOfSupply: registration.placeOfSupply,
      };

      Object.entries(optionalFields).forEach(([field, value]) => {
        if (value) gstRegistration[field] = value;
      });

      return gstRegistration;
    });

  if (gstRegistrations.length > 0) {
    formData.append('gstRegistrations', JSON.stringify(gstRegistrations));
  }

  const documents = [];
  for (const document of details.documents || []) {
    const file = await toCompanyDocumentFile(document);
    if (file && file.size > 0) {
      documents.push({ ...document, file });
    }
  }

  if (documents.length > 0) {
    formData.append(
      'documentMetadata',
      JSON.stringify(
        documents.map((document) => ({
          documentName: document.documentName || document.name,
          documentKey: document.documentKey || document.name,
          isAdditional: Boolean(document.isAddition ?? document.isAdditional),
        }))
      )
    );

    documents.forEach((document) => {
      formData.append('documents', document.file, document.file.name);
    });
  }

  return formData;
};

const CompanyService = {

  addCompany: async (company) => {
    const response = await API.post('/companies', await createCompanyFormData(company));
    return response.data;
  },

  updateCompany: async (companyId, company) => {
    const response = await API.patch(
      `/companies/updateCompany/${companyId}`,
      await createCompanyFormData(company)
    );
    return response.data;
  },

  getAllCompanies: async ({ page = 1, limit = 10, searchTerm = '',companyType,
  status, } = {}) => {
    const response = await API.get('/companies/getAllCompanies', {
      params: { page, limit, searchTerm ,companyType,status},
    });
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload.message || 'Unable to load companies.');
    }

    const companies = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.companies)
          ? payload.companies
          : payload?.data?.companies;

    if (!Array.isArray(companies)) {
      throw new Error(
        payload?.message || 'The companies endpoint returned an invalid response.'
      );
    }

    const pagination = payload?.pagination;
    if (
      !pagination ||
      !Number.isFinite(Number(pagination.totalPages)) ||
      !Number.isFinite(Number(pagination.currentPage)) ||
      !Number.isFinite(Number(pagination.totalRecords)) ||
      !Number.isFinite(Number(pagination.itemsPerPage))
    ) {
      throw new Error('The companies endpoint returned invalid pagination data.');
    }

    return {
      companies: companies.map((company) => {
        if (!company || typeof company !== 'object') {
          throw new Error('The companies endpoint returned an invalid company record.');
        }

        return {
          ...company,
          id: company.id,
          name: company.companyName ?? '',
          code: company.companyCode ?? '',
          region: company.state ?? '',
          details: company.details || {
            ...company,
            companyStatus: company.status,
          },
        };
      }),
      pagination: {
        totalRecords: Number(pagination.totalRecords),
        totalPages: Number(pagination.totalPages),
        currentPage: Number(pagination.currentPage),
        itemsPerPage: Number(pagination.itemsPerPage),
        isAll: Boolean(pagination.isAll),
      },
    };
  },

  toggleCompany: async (companyId) => {
    const response = await API.patch(`/companies/toggleCompanyStatus/${companyId}`);
    return response.data;
  },

  getCompanyDetailsById: async (companyId) => {
    const response = await API.get(`/companies/getCompanyById/${companyId}`);
    const payload = response.data;
    if (!payload?.success || !payload.data) {
      throw new Error(payload?.message || 'Unable to load company details.');
    }

    const company = payload.data;
    const gstRegistrations = (company.gstRegistrations || []).map((registration) => ({
      ...registration,
      gstStatus:
        registration.gstStatus ||
        registration.gstRegistrationStatus ||
        registration.status,
      gstin: registration.gstin || registration.gstNumber,
      taxPreference:
        registration.taxPreference || registration.taxCalculationPreference,
      gstType: registration.gstType || registration.gstRegistrationType || registration.registrationType,
      gstConfiguration:
        registration.gstConfiguration || registration.defaultGstConfiguration,
      placeOfSupply: registration.placeOfSupply || registration.defaultPlaceOfSupply,
      registrationState: registration.registrationState || registration.state,
      registrationAddress: registration.registrationAddress || registration.address,
    }));

    return {
      ...company,
      name: company.companyName || '',
      code: company.companyCode || '',
      region: company.state || '',
      details: {
        ...company,
        companyName: company.companyName,
        companyCode: company.companyCode,
        companyStatus: company.status,
        legalName: company.legalName || company.legalRegisteredName,
        cin: company.cin || company.cinLlpIN,
        incorporationDate:
          company.incorporationDate || company.dateOfIncorporation,
        registeredAddress:
          company.registeredAddress || company.registeredOfficeAddress,
        primaryContact:
          company.primaryContact || company.primaryContactPerson,
        currency: company.currency || company.baseCurrency,
        paymentTerms: company.paymentTerms || company.defaultPaymentTerms,
        accountHolder: company.accountHolder || company.accountHolderName,
        ifsc: company.ifsc || company.ifscCode,
        gstRegistrations,
        documents: (company.documents || []).map((document) => ({
          ...document,
          name: document.documentName || document.documentType || 'Company document',
        })),
      },
    };
  },

};

export default CompanyService;
