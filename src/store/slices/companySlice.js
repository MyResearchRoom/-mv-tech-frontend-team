
import { createSlice } from '@reduxjs/toolkit';
import { COMPANIES } from '@/data/companies';
import { STORAGE_KEYS } from '@/constants/storageKeys';

const savedId = localStorage.getItem(STORAGE_KEYS.ACTIVE_COMPANY);
const validId = COMPANIES.some((c) => c.id === savedId)
  ? savedId
  : COMPANIES[0].id;

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: COMPANIES,
    activeCompanyId: validId,
  },
  reducers: {
    setActiveCompany(state, action) {
      state.activeCompanyId = action.payload;
      localStorage.setItem(STORAGE_KEYS.ACTIVE_COMPANY, action.payload);
    },

    replaceCompanies(state, action) {
      state.companies = action.payload;
      const activeCompanyExists = state.companies.some(
        (company) => String(company.id) === String(state.activeCompanyId)
      );

      if (!activeCompanyExists) {
        state.activeCompanyId = state.companies[0]?.id ?? null;
      }

      if (state.activeCompanyId == null) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_COMPANY);
      } else {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_COMPANY, state.activeCompanyId);
      }
    },

    addCompany(state, action) {
      state.companies.push(action.payload);
      state.activeCompanyId = action.payload.id;
      localStorage.setItem(
        STORAGE_KEYS.ACTIVE_COMPANY,
        action.payload.id
      );
    },

    updateCompany(state, action) {
      const index = state.companies.findIndex(
        (company) => company.id === action.payload.id
      );

      if (index !== -1) {
        state.companies[index] = {
          ...state.companies[index],
          ...action.payload,
        };
      }
    },
  },
});

export const {
  setActiveCompany,
  replaceCompanies,
  addCompany,
  updateCompany,
} = companySlice.actions;

export default companySlice.reducer;
