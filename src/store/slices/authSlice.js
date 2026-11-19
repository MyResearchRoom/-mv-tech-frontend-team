import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/constants/storageKeys';

const loadAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saved = loadAuth();

const initialState = {
  isAuthenticated: Boolean(saved?.user),
  user: saved?.user || null,
  token: saved?.token || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const loginData = action.payload || {};
      const user = loginData.user || loginData;
      const roleId = user.roleId || user.role;

      state.isAuthenticated = true;
      state.user = { ...user, ...(roleId ? { roleId } : {}) };
      state.token = loginData.token || loginData.accessToken || loginData.access_token || null;
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ user: state.user, token: state.token }));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
