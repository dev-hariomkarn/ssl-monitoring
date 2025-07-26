"use client";
import React, { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import setupAxios from "./setupAxios";
import { persistor, store } from "./store";
import { usePathname, useRouter } from "next/navigation";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    setupAxios(axios, store)
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <AuthHandler>
                    {children}
                </AuthHandler>
            </PersistGate>
        </Provider>
    );
}


function AuthHandler({ children }: { children: React.ReactNode }) {
    const auth = useSelector((state: any) => state.auth);
    const pathname = usePathname();
    const router = useRouter();

    const isPublicPath = () => {
        return !pathname.startsWith("/admin-dashboard") && !pathname.startsWith("/user-dashboard");
    };

    const isAdminPath = () => {
        return pathname.startsWith("/admin-dashboard");
    };

    const isUserPath = () => {
        return pathname.startsWith("/user-dashboard");
    };

    useEffect(() => {
        if (!auth.isLoading) {
            const role = auth?.role;

            if (role === null || role === undefined) {
                // Only allow public routes
                if (!isPublicPath()) {
                    router.push("/login"); // or "/" or any public fallback
                }
            } else if (role === "user") {
                // User should not access admin routes
                if (isAdminPath()) {
                    router.push("/user-dashboard");
                }
            } else if (role === "admin") {
                // Admin should not access user routes
                if (isUserPath()) {
                    router.push("/admin-dashboard");
                }
            }
        }
    }, [auth.isLoading, auth.role, pathname]);

    return <>{children}</>;
}