import { createSlice } from "@reduxjs/toolkit";
import { getDomainList } from "./userApi";

const userSlice = createSlice({
    name: "user",
    initialState: {
        Loading: false,
        domainList: [],
    },
    reducers: {
        isToggle: (state, action) =>
        (state = {
            ...state,
            Loading: action.payload,
        }),
    },
    extraReducers: (builder) => {
        builder.addCase(getDomainList.pending, (state) => {
            state.Loading = true;
        });
        builder.addCase(getDomainList.fulfilled, (state, action) => {
            state.Loading = false;
            state.domainList = action?.payload?.domains || [];
        });
        builder.addCase(getDomainList.rejected, (state) => {
            state.Loading = false;
        });
    }
})

export const { isToggle } = userSlice.actions
export default userSlice.reducer