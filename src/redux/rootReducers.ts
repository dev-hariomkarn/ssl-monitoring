import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "@/app/(auth)/_redux/authSlice";
import userSlice from "@/app/user-dashboard/_redux/userSlice";

export const rootReducers = combineReducers({
    auth: authSlice,
    user: userSlice,
}) 