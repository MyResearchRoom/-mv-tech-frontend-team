import API from './api';

const normalizeProspect = (prospect) => {
  const project = Array.isArray(prospect.project)
    ? prospect.project[0]
    : prospect.project;

  return {
    ...prospect,
    prospectId: prospect.prospectCode ?? prospect.prospectId ?? '',
    prospectName: prospect.companyName ?? prospect.prospectName ?? '',
    contactPersonName: prospect.contactPerson ?? prospect.contactPersonName ?? '',
    mobileNumber: prospect.mobile ?? prospect.mobileNumber ?? '',
    projectName: prospect.projectName ?? project?.projectName ?? '',
    projectType: prospect.projectType ?? project?.projectType ?? '',
    projectLocation: prospect.projectLocation ?? project?.projectLocation ?? '',
    projectStatus: prospect.projectStatus ?? project?.projectStatus ?? '',
    builtUpArea: prospect.builtUpArea ?? project?.builtUpArea ?? '',
    buildingsTowers:
      prospect.buildingsTowers ?? project?.towers ?? project?.buildingsTowers ?? '',
    floors: prospect.floors ?? project?.floors ?? '',
    basements: prospect.basements ?? project?.basements ?? '',
    expectedTimeline: prospect.expectedTimeline ?? project?.expectedTimeline ?? '',
    governingFireAuthority:
      prospect.governingFireAuthority ??
      project?.fireAuthority ??
      project?.governingFireAuthority ??
      '',
    siteAddress: prospect.siteAddress ?? project?.siteAddress ?? '',
    fireSafetyRequirements:
      prospect.fireSafetyRequirements ??
      project?.fireRequirements ??
      project?.fireSafetyRequirements ??
      '',
    documents: prospect.documents ?? prospect.prospectDocuments ?? [],
    currentStage: prospect.status ?? prospect.currentStage ?? '',
  };
};

const buildProspectFormData = (prospectData) => {
  const formData = new FormData();

  // Basic prospect details
   formData.append('companyId', prospectData.companyId);

  formData.append('prospectType', prospectData.prospectType || '');
  formData.append('companyName', prospectData.prospectName || '');
  formData.append('contactPerson', prospectData.contactPersonName || '');
  formData.append('designation', prospectData.designation || '');
  formData.append('mobile', prospectData.mobileNumber || '');
  formData.append('alternateContact', prospectData.alternateContact || '');
  formData.append('email', prospectData.email || '');
  formData.append('website', prospectData.website || '');
  formData.append('gstin', prospectData.gstin || '');
  formData.append('pan', prospectData.pan || '');
  formData.append('registeredAddress', prospectData.registeredAddress || '');
  formData.append('country', prospectData.country || '');
  formData.append('city', prospectData.city || '');
  formData.append('state', prospectData.state || '');
  formData.append('pinCode', prospectData.pinCode || '');
  formData.append('remarks', prospectData.remarks || '');


  const project = {
    ...(prospectData.projectId != null ? { id: prospectData.projectId } : {}),
    projectName: prospectData.projectName || '',
    projectType: prospectData.projectType || '',
    projectLocation: prospectData.projectLocation || '',
    projectStatus: prospectData.projectStatus || '',
    builtUpArea: prospectData.builtUpArea || '',
    towers: prospectData.buildingsTowers || '',
    floors: prospectData.floors || '',
    basements: prospectData.basements || '',
    siteAddress: prospectData.siteAddress || '',
    expectedTimeline: prospectData.expectedTimeline || '',
    fireAuthority: prospectData.governingFireAuthority || '',
    fireRequirements: prospectData.fireSafetyRequirements || '',
  };

  formData.append('project', JSON.stringify(project));

  (prospectData.documents || []).forEach((file) => {
    formData.append('drawings', file);
  });

  return formData;
};

const ProspectService = {
  getAllProspects: async ({
    companyId,
    page = 1,
    limit = 10,
    searchTerm = '',
    prospectType = 'all',
    status = 'all',
  } = {}) => {
    const response = await API.get('/prospect/getAllProspect', {
      params: { companyId, page, limit, searchTerm, prospectType, status },
    });
    const payload = response.data;

    if (payload?.success === false) {
      const validationMessages = Array.isArray(payload.errors)
        ? payload.errors
            .map((validationError) => validationError?.msg)
            .filter(Boolean)
        : [];
      throw new Error(
        validationMessages.join(', ') ||
          payload.message ||
          'Unable to load prospects.'
      );
    }

    if (!Array.isArray(payload?.data)) {
      throw new Error(
        payload?.message || 'The prospects endpoint returned an invalid response.'
      );
    }

    const pagination = payload.pagination;
    if (
      !pagination ||
      !Number.isFinite(Number(pagination.totalPages)) ||
      !Number.isFinite(Number(pagination.currentPage)) ||
      !Number.isFinite(Number(pagination.totalRecords)) ||
      !Number.isFinite(Number(pagination.itemsPerPage))
    ) {
      throw new Error('The prospects endpoint returned invalid pagination data.');
    }

    return {
      prospects: payload.data.map((prospect) => {
        if (!prospect || typeof prospect !== 'object') {
          throw new Error('The prospects endpoint returned an invalid prospect record.');
        }

        return normalizeProspect(prospect);
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

  getProspectById: async (prospectId) => {
    if (!prospectId) {
      throw new Error('A prospect ID is required to load prospect details.');
    }

    const response = await API.get(
      `/prospect/getProspectById/${encodeURIComponent(prospectId)}`
    );
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload.message || 'Unable to load prospect details.');
    }

    if (!payload?.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
      throw new Error(
        payload?.message || 'The prospect endpoint returned an invalid response.'
      );
    }

    return normalizeProspect(payload.data);
  },

  getAllProspectDocuments: async ({
    prospectId,
    page = 1,
    limit = 10,
    searchTerm = '',
  } = {}) => {
    if (!prospectId) {
      throw new Error('A prospect ID is required to load prospect documents.');
    }

    const response = await API.get('/prospect/documents', {
      params: {
        ownerId: prospectId,
        ownerType: 'prospect',
        page,
        limit,
        searchTerm,
      },
    });
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload.message || 'Unable to load prospect documents.');
    }

    if (!Array.isArray(payload?.data)) {
      throw new Error(
        payload?.message || 'The prospect documents endpoint returned an invalid response.'
      );
    }

    const pagination = payload.pagination;
    if (
      !pagination ||
      !Number.isFinite(Number(pagination.totalPages)) ||
      !Number.isFinite(Number(pagination.currentPage)) ||
      !Number.isFinite(Number(pagination.totalRecords)) ||
      !Number.isFinite(Number(pagination.itemsPerPage))
    ) {
      throw new Error('The prospect documents endpoint returned invalid pagination data.');
    }

    return {
      documents: payload.data,
      pagination: {
        totalRecords: Number(pagination.totalRecords),
        totalPages: Number(pagination.totalPages),
        currentPage: Number(pagination.currentPage),
        itemsPerPage: Number(pagination.itemsPerPage),
      },
    };
  },

  getProspectDocumentById: async (documentId) => {
    if (!documentId) {
      throw new Error('A document ID is required to view a prospect document.');
    }

    const response = await API.get(
      `/prospect/documents/${encodeURIComponent(documentId)}`
    );
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload.message || 'Unable to load prospect document.');
    }

    if (!payload?.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
      throw new Error(
        payload?.message || 'The prospect document endpoint returned an invalid response.'
      );
    }

    return payload.data;
  },

  deleteProspectDocument: async (documentId) => {
    if (!documentId) {
      throw new Error('A document ID is required to delete a prospect document.');
    }

    const response = await API.delete(
      `/prospect/documents/${encodeURIComponent(documentId)}`
    );
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload.message || 'Unable to delete prospect document.');
    }

    return payload;
  },

  uploadProspectDrawings: async (prospectId, files) => {
    if (!prospectId) {
      throw new Error('A prospect ID is required to upload documents.');
    }

    if (!Array.isArray(files) || files.length === 0 || files.length > 5) {
      throw new Error('Select between 1 and 5 documents to upload.');
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('drawings', file, file.name);
    });

    const response = await API.post(
      `/prospect/${encodeURIComponent(prospectId)}/drawings`,
      formData
    );
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload.message || 'Unable to upload prospect documents.');
    }

    return payload;
  },

  deleteProspect: async (prospectId) => {
    if (!prospectId) {
      throw new Error('A prospect ID is required to delete a prospect.');
    }

    const response = await API.delete(
      `/prospect/documents/${encodeURIComponent(prospectId)}`
    );
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload.message || 'Unable to delete prospect.');
    }

    return payload;
  },

  addProspect: async (prospectData) => {
    const formData = buildProspectFormData(prospectData);
    const response = await API.post('/prospect/add', formData);
    return response.data;
  },

  updateProspect: async (id, prospectData) => {
    const formData = buildProspectFormData(prospectData);
    const response = await API.put(`/prospect/edit/${id}`, formData);
    return response.data;
  },

  getProspectByIdForEdit: async (id) => {
    const response = await API.get(`/prospect/getProspectById/${id}`);
    return response.data;
  },

  deleteProspectDocument: async (documentId) => {
    const response = await API.delete(`/prospect/documents/${documentId}`);
    return response.data;
  },
};

export default ProspectService;