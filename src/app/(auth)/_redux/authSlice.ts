import { createSlice } from "@reduxjs/toolkit";
import { login, userLogout } from "./authApi";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: true,
    token: null,
    role: null,
    email: null,
    name: null,
    profileImage: null,
  },
  reducers: {
    isLoadingToggle: (state, action) => {
      state.isLoading = action.payload;
    },
    defaultLogout: (state) => {
      state.token = null;
      state.role = null;
      state.email = null;
      state.name = null;
      state.profileImage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action?.payload?.token;
      state.role = action?.payload?.role || null;
      state.email = action?.payload?.email || null;
      state.name = action?.payload?.name || null;
      state.profileImage = action?.payload?.profileImage || null;
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(userLogout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(userLogout.fulfilled, (state) => {
      state.isLoading = false;
      state.token = null;
      state.role = null;
      state.email = null;
      state.name = null;
      state.profileImage = null;
    });
    builder.addCase(userLogout.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const selectIsAuthenticated = (state: any) => !!state.auth.token;
export const selectUserRole = (state: any) => state.auth.role;
export const selectUserEmail = (state: any) => state.auth.email;

export const {
  isLoadingToggle,
  defaultLogout,
} = authSlice.actions;
export default authSlice.reducer;