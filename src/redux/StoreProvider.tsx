"use client";
import React, { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

import { store, persistor, RootState } from "@/redux/store";
import setupAxios from "@/redux/setupAxios";

const ADMIN_PREFIX = "/admin-dashboard";
const USER_PREFIX = "/user-dashboard";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    setupAxios(axios, store);
    return (
        <Provider store={store}>
            <PersistGate loading={<div>Loading app...</div>} persistor={persistor}>
                <AuthHandler>{children}</AuthHandler>
            </PersistGate>
        </Provider>
    );
}

function AuthHandler({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth);
    const { isLoading, role, token } = auth || {};

    const isAdminPath = () => pathname.startsWith(ADMIN_PREFIX);
    const isUserPath = () => pathname.startsWith(USER_PREFIX);

    useEffect(() => {
        if (!token && (isUserPath() || isAdminPath())) {
            router.push("/login")
        }
        if (token && role && role === "user" && isAdminPath()) {
            router.push("/")
        }
        if (token && role && role === "admin" && isUserPath()) {
            router.push("/")
        }
    }, [pathname, isLoading, role]);

    const redirecting =
        (role === "user" && isAdminPath()) ||
        (role === "admin" && isUserPath());

    if (!isLoading && redirecting) {
        return <div>Redirecting...</div>;
    }

    return <>{children}</>;
}
