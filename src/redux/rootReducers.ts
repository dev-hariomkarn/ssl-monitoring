import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "@/app/(auth)/_redux/authSlice";

export const rootReducers = combineReducers({
    auth: authSlice,
}) 