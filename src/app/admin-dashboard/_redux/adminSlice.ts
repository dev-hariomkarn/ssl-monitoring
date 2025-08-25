import { createSlice } from "@reduxjs/toolkit";
import { getAllDomainList } from "./adminApi";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        Loading: false,
        domainList: [],
    },
    reducers: {
        isAdminToggle: (state, action) =>
        (state = {
            ...state,
            Loading: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder.addCase(getAllDomainList.pending, (state) => {
            state.Loading = true;
        });
        builder.addCase(getAllDomainList.fulfilled, (state, action) => {
            state.Loading = false;
            state.domainList = action?.payload?.domains || [];
        });
        builder.addCase(getAllDomainList.rejected, (state) => {
            state.Loading = false;
        });
    }
})

export const { isAdminToggle } = adminSlice.actions
export default adminSlice.reducer