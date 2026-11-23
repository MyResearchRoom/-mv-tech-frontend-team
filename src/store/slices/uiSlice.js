import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/constants/storageKeys';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarCollapsed: localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === '1',
    mobileSidebarOpen: false,
    addCompanyOpen: false,
    editingCompanyId: null,
    companyUpdateVersion: 0,
    toast: null,
    pendingApprovals: 8,
    unreadNotifications: 4,
  },
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, state.sidebarCollapsed ? '1' : '0');
    },
    openMobileSidebar(state) {
      state.mobileSidebarOpen = true;
    },
    closeMobileSidebar(state) {
      state.mobileSidebarOpen = false;
    },
    openAddCompany(state, action) {
      state.addCompanyOpen = true;
      state.editingCompanyId = action.payload ?? null;
    },
    closeAddCompany(state) {
      state.addCompanyOpen = false;
      state.editingCompanyId = null;
    },
    companyUpdated(state) {
      state.companyUpdateVersion += 1;
    },
    showToast(state, action) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
  },
});

export const {
  toggleSidebar,
  openMobileSidebar,
  closeMobileSidebar,
  openAddCompany,
  closeAddCompany,
  companyUpdated,
  showToast,
  clearToast,
} = uiSlice.actions;
export default uiSlice.reducer;
