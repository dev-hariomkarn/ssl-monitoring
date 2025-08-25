import { createAsyncThunk } from "@reduxjs/toolkit";
import { isLoadingToggle } from "./authSlice";
import axios from "axios";
import { toast } from "react-toastify";

export const register: any = createAsyncThunk(
    "user/register",
    async (data: any, { dispatch }) => {
        try {
            dispatch(isLoadingToggle(true));
            const response = await axios({
                method: "POST",
                url: `/api/user/auth/register`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                toast.success(response?.data?.message);
                dispatch(isLoadingToggle(false));
                return response?.data;
            } else {
                toast.error(response?.data?.message);
                dispatch(isLoadingToggle(false));
            }
        } catch (err: any) {
            dispatch(isLoadingToggle(false));
            toast.error(err.message);
        }
    }
)

export const login: any = createAsyncThunk(
    "login",
    async (data: any, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            dispatch(isLoadingToggle(true));
            const response = await axios({
                method: "POST",
                url: `/api/${data.role}/auth/login`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log('response: ', response);
            if (response.status === 200) {
                toast.success(response?.data?.message);
                dispatch(isLoadingToggle(false));
                return fulfillWithValue(response?.data);
            } else {
                toast.error(response?.data?.message);
                dispatch(isLoadingToggle(false));
                return rejectWithValue();
            }
        } catch (err) {
            dispatch(isLoadingToggle(false));
            return rejectWithValue();
        }
    }
);

export const userLogout: any = createAsyncThunk(
    "logout",
    async (data: any, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "POST",
                url: `/api/${data.role}/auth/logout`,
            });
            console.log(response)

            if (response.status === 200) {
                toast.success(response?.data?.message);
                return fulfillWithValue(response);
            } else {
                toast.error(response?.data?.message);
                return rejectWithValue();
            }
        } catch (error) {
            rejectWithValue();
        }
    }
);

export const forgotPassword: any = createAsyncThunk(
    "auth/forgot-password",
    async (data: any, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            dispatch(isLoadingToggle(true));
            const response = await axios({
                method: "POST",
                url: `/api/${data.role}/auth/forgot-password`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                toast.success(response?.data?.message);
                dispatch(isLoadingToggle(false));
                return fulfillWithValue(response?.data);
            } else {
                toast.error(response?.data?.message);
                dispatch(isLoadingToggle(false));
                return rejectWithValue();
            }
        } catch (err) {
            dispatch(isLoadingToggle(false));
            return rejectWithValue();
        }
    }
)

export const resetPassword: any = createAsyncThunk(
    "auth/reset-password",
    async (data: any, { rejectWithValue }: any) => {
        try {
            const response = await axios({
                method: "POST",
                url: `/api/${data.role}/auth/reset-password`,
                data,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log('response: ', response);
            if (response.status === 200) {
                toast.success(response?.data?.message);
                return response?.data;
            } else {
                toast.error(response?.data?.message);
                return response?.data;
            }
        } catch (error) {
            return rejectWithValue();
        }
    }
)

export const googleLogin: any = createAsyncThunk(
    "auth/google-login",
    async (data, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "POST",
                url: `/api/user/auth/google-login`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                toast.success(response?.data?.message);
                return fulfillWithValue(response?.data);
            } else {
                toast.error(response?.data?.message);
                return rejectWithValue();
            }
        } catch (err) {
            return rejectWithValue();
        }
    }
);

export const getDetail: any = createAsyncThunk(
    "auth/get-detail",
    async (data: any, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "GET",
                url: `/api/${data.role}/get-detail`,
            });
            console.log('response', response)
            if (response.status === 200) {
                return fulfillWithValue(response?.data?.userData);
            } else {
                return rejectWithValue();
            }
        } catch (err: any) {
            toast.error("Server Error");
            return rejectWithValue();
        }
    }
);