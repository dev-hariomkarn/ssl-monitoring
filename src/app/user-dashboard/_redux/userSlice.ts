import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        Loading: false,
        
    },
    reducers: {
        isToggle: (state, action) =>
        (state = {
            ...state,
            Loading: action.payload,
        }),
    },
    extraReducers: (builder) => {

    }
})

export const { isToggle } = userSlice.actions
export default userSlice.reducer