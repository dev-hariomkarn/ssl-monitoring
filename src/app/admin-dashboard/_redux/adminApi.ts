import { getDetail } from "@/app/(auth)/_redux/authApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const updateAdminDetail: any = createAsyncThunk(
    "admin/update-detail",
    async (data, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "PUT",
                url: `/api/admin/update-detail`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const data = {
                    role: "admin"
                }
                dispatch(getDetail(data));
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

export const verifyAdminOtp: any = createAsyncThunk(
    "admin/verify-otp",
    async (data: any, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "POST",
                url: `/api/admin/verify-otp/${data.type}`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const data = {
                    role: "admin"
                }
                dispatch(getDetail(data))
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

export const changeAdminPassword: any = createAsyncThunk(
    "admin/change-password",
    async (data, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "POST",
                url: `/api/admin/auth/change-password`,
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

export const getAllDomainList: any = createAsyncThunk(
    "admin/get-all-domain-list",
    async (data, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "GET",
                url: `/api/admin/domain/get-alldomainlist`,
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

export const refreshDomainSSL: any = createAsyncThunk(
    "admin/refresh-domain-ssl",
    async (domainId: string, { rejectWithValue, fulfillWithValue, dispatch }: any) => {
        try {
            const response = await axios({
                method: "POST",
                url: `/api/admin/domain/refresh/${domainId}`,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                toast.success(response?.data?.message);
                await dispatch(getAllDomainList());
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