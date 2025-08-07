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
            console.log('response', response)
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