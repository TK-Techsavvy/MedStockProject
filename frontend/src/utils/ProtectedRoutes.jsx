import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = ({
    children,
    allowedRoles = [],
    requiredRole = []
}) => {

    const location = useLocation();


    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    const storedUser = localStorage.getItem("user");


    // ==========================================
    // USER NOT LOGGED IN
    // ==========================================

    if (!storedUser) {

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


    // ==========================================
    // PARSE USER
    // ==========================================

    let user;

    try {

        user = JSON.parse(storedUser);

    } catch (error) {

        console.error(
            "Invalid user data:",
            error
        );

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ==========================================
    // GET USER ROLE
    // ==========================================

    const userRole = user?.role
        ?.trim()
        .toLowerCase();


    // ==========================================
    // NO ROLE
    // ==========================================

    if (!userRole) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">

                <div className="max-w-md rounded-xl bg-white p-8 text-center shadow">

                    <h1 className="text-2xl font-bold text-red-600">
                        Unauthorized
                    </h1>

                    <p className="mt-3 text-slate-600">
                        Your account does not have a valid role.
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // DETERMINE REQUIRED ROLES
    // ==========================================

    const rolesToCheck =
        requiredRole.length > 0
            ? requiredRole
            : allowedRoles;


    // ==========================================
    // NORMALIZE ROLES
    // ==========================================

    const normalizedRoles = rolesToCheck.map(
        (role) =>
            role.trim().toLowerCase()
    );


    // ==========================================
    // CHECK PERMISSION
    // ==========================================

    if (
        normalizedRoles.length > 0 &&
        !normalizedRoles.includes(userRole)
    ) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">

                <div className="max-w-md rounded-xl bg-white p-8 text-center shadow">

                    <h1 className="text-2xl font-bold text-red-600">
                        Unauthorized
                    </h1>

                    <p className="mt-3 text-slate-600">
                        You do not have permission to access this page.
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                        Current role: {user?.role}
                    </p>

                    <button
                        onClick={() => window.history.back()}
                        className="mt-6 rounded-lg bg-[#00549a] px-5 py-2 text-sm font-medium text-white hover:bg-[#00427a]"
                    >
                        Go Back
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // AUTHORIZED
    // ==========================================

    return children;
};

export default ProtectedRoutes;