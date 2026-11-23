import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { logout } from './slices/authSlice';
import companyReducer from './slices/companySlice';
import uiReducer from './slices/uiSlice';

const appReducer = combineReducers({
  auth: authReducer,
  company: companyReducer,
  ui: uiReducer,
});

const rootReducer = (state, action) => {
  if (logout.match(action)) {
    localStorage.clear();
    const resetState = appReducer(undefined, action);

    return {
      ...resetState,
      company: {
        ...resetState.company,
        companies: [],
        activeCompanyId: null,
      },
      ui: {
        ...resetState.ui,
        sidebarCollapsed: false,
      },
    };
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
