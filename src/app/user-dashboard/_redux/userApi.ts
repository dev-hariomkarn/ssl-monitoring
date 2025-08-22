import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { getDetail } from "@/app/(auth)/_redux/authApi";

export const updateDetail: any = createAsyncThunk(
    "user/update-detail",
    async (data, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "PUT",
                url: `/api/user/update-detail`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                dispatch(getDetail());
                toast.success(response?.data?.message);
                return fulfillWithValue(response?.data);
            } else {
                toast.error(response?.data?.message);
                return rejectWithValue();
            }
        } catch (error) {
            toast.error("Server Error");
            return rejectWithValue();
        }
    }
)

export const getOtp: any = createAsyncThunk(
    "user/get-otp",
    async (data: any, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "POST",
                url: `/api/public/send-otp/${data?.type}`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                return fulfillWithValue(response?.data);
            } else {
                toast.error(response?.data?.message);
                return rejectWithValue();
            }
        } catch (error) {
            toast.error("Server Error");
            return rejectWithValue();
        }
    }
)

export const verifyOtp: any = createAsyncThunk(
    "user/verify-otp",
    async (data: any, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "POST",
                url: `/api/user/verify-otp/${data.type}`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                dispatch(getDetail())
                toast.success(response?.data?.message)
                return fulfillWithValue(response?.data);
            } else {
                toast.error(response?.data?.message);
                return rejectWithValue();
            }
        } catch (error) {
            toast.error("Server Error");
            return rejectWithValue();
        }
    }
)

export const changePassword: any = createAsyncThunk(
    "user/change-password",
    async (data, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "POST",
                url: `/api/user/auth/change-password`,
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
        } catch (error) {
            toast.error("Server Error");
            return rejectWithValue();
        }
    }
)

export const getDomainList: any = createAsyncThunk(
    "user/get-domain-list",
    async (data, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "GET",
                url: `/api/user/domain/get-domainlist`,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                return fulfillWithValue(response?.data);
            } else {
                toast.error(response?.data?.message);
                return rejectWithValue();
            }
        } catch (error) {
            toast.error("Server Error");
            return rejectWithValue();
        }
    }
)

export const addDomain: any = createAsyncThunk(
    "user/add-domain",
    async (data, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "POST",
                url: `/api/user/domain/add-domain`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                dispatch(getDomainList());
                toast.success(response?.data?.message);
                return fulfillWithValue(response?.data);
            } else {
                toast.error(response?.data?.message);
                return rejectWithValue();
            }
        } catch (error) {
            toast.error("Server Error");
            return rejectWithValue();
        }
    }
)

export const deleteDomain: any = createAsyncThunk(
    "user/delete-domain",
    async (data, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "POST",
                url: `/api/user/domain/delete-domain`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                dispatch(getDomainList());
                toast.success(response?.data?.message);
                return fulfillWithValue(response?.data);
            } else {
                toast.error(response?.data?.message);
                return rejectWithValue();
            }
        } catch (error) {
            toast.error("Server Error");
            return rejectWithValue();
        }
    }
)
