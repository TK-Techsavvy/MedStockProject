import React from "react";
import {
    Outlet,
    Navigate
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";


const Root = () => {

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
                replace
            />
        );
    }


    // =========================================================
    // LAYOUT
    // =========================================================

    return (

        <div className="min-h-screen bg-[#f8faff]">

            {/* SIDEBAR */}

            <Sidebar />


            {/* MAIN CONTENT */}

            <main className="ml-[230px] min-h-screen">

                <Outlet />

            </main>

        </div>

    );
};


export default Root;