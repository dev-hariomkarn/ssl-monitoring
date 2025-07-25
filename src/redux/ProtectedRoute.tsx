"use client";

import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { selectIsAuthenticated, selectUserRole } from "@/app/(auth)/_redux/authSlice";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role = useSelector(selectUserRole);

    useEffect(() => {
        const isUserRoute = pathname.startsWith("/user-dashboard");
        const isAdminRoute = pathname.startsWith("/admin-dashboard");

        if (!isAuthenticated) {
            router.replace("/login");
        } else if (role === "user" && isAdminRoute) {
            router.replace("/user-dashboard");
        } else if (role === "admin" && isUserRoute) {
            router.replace("/admin-dashboard");
        }
    }, [isAuthenticated, role, pathname, router]);

    return <>{children}</>;
}
