import React from "react";
import {
    Navigate,
    useLocation
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const ProtectedRoutes = ({
    children,
    allowedRoles = [],
    requiredRole = []
}) => {

    const location = useLocation();

    const {
        user,
        token,
        loading
    } = useAuth();


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8faff]">

                <div className="text-center">

                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#dbe5f0] border-t-[#00549a]" />

                    <p className="mt-3 text-[11px] text-[#69758b]">
                        Loading...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // NOT LOGGED IN
    // =========================================================

    if (!user || !token) {

        return (
            <Navigate
                to="/login"
                state={{
                    from: location.pathname
                }}
                replace
            />
        );
    }


    // =========================================================
    // GET USER ROLE
    // =========================================================

    const userRole = String(user?.role || "")
        .trim()
        .toLowerCase();


    // =========================================================
    // INVALID ROLE
    // =========================================================

    if (!userRole) {

        return (
            <Unauthorized
                message="Your account does not have a valid role."
            />
        );
    }


    // =========================================================
    // DETERMINE REQUIRED ROLES
    // =========================================================

    const rolesToCheck =
        requiredRole.length > 0
            ? requiredRole
            : allowedRoles;


    // =========================================================
    // NORMALIZE ALLOWED ROLES
    // =========================================================

    const normalizedRoles = rolesToCheck
        .map(role =>
            String(role || "")
                .trim()
                .toLowerCase()
        )
        .filter(Boolean);


    // =========================================================
    // ROLE CHECK
    // =========================================================

    if (
        normalizedRoles.length > 0 &&
        !normalizedRoles.includes(userRole)
    ) {

        return (
            <Unauthorized
                message="You do not have permission to access this page."
                role={user.role}
            />
        );
    }


    // =========================================================
    // AUTHORIZED
    // =========================================================

    return children;
};


// =============================================================
// UNAUTHORIZED PAGE
// =============================================================

const Unauthorized = ({
    message,
    role
}) => {

    const handleGoBack = () => {

        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "/";
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8faff] px-5">

            <div className="w-full max-w-md rounded-[10px] border border-[#dfe5ef] bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">

                {/* ICON */}

                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1f2]">

                    <svg
                        className="h-5 w-5 text-[#dc2626]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                        <path d="M10.3 3.8 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
                    </svg>

                </div>


                <h1 className="mt-4 text-[18px] font-bold text-[#17233c]">
                    Unauthorized
                </h1>


                <p className="mt-2 text-[11px] leading-5 text-[#69758b]">
                    {message}
                </p>


                {role && (
                    <p className="mt-2 text-[10px] text-[#98a2b3]">
                        Current role: {role}
                    </p>
                )}


                <button
                    onClick={handleGoBack}
                    className="mt-6 rounded-[6px] bg-[#00549a] px-5 py-2 text-[10px] font-semibold text-white transition hover:bg-[#00447e]"
                >
                    Go Back
                </button>

            </div>

        </div>
    );
};


export default ProtectedRoutes;