import React from "react";
import {
    NavLink,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const Sidebar = () => {

    const navigate = useNavigate();

    const {
        user,
        logout
    } = useAuth();


    // =========================================================
    // ROLE
    // =========================================================

    const userRole = String(user?.role || "")
        .trim()
        .toLowerCase();


    const isAdmin =
        userRole === "administrator";


    // =========================================================
    // NAVIGATION
    // =========================================================

    const navigation = [

        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: (
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M3 13h8V3H3v10Z" />
                    <path d="M13 21h8V11h-8v10Z" />
                    <path d="M13 3h8v4h-8V3Z" />
                    <path d="M3 17h8v4H3v-4Z" />
                </svg>
            ),

            roles: [
                "administrator",
                "pharmacist",
                "manager",
                "inventory officer",
                "storekeeper"
            ]
        },

        {
            name: "Medicines",
            path: "/admin/medicines",
            icon: (
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M10.5 3.5h3" />
                    <path d="M9 3.5h6v3l1.5 2.5V19a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V9l1.5-2.5v-3Z" />
                    <path d="M8 11h8" />
                    <path d="M10 15h4" />
                </svg>
            ),

            roles: [
                "administrator",
                "pharmacist",
                "manager",
                "inventory officer",
                "storekeeper"
            ]
        },

        {
            name: "Suppliers",
            path: "/admin/suppliers",
            icon: (
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M3 7h11v10H3V7Z" />
                    <path d="M14 10h4l3 3v4h-7v-7Z" />
                    <path d="M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                    <path d="M18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                </svg>
            ),

            roles: [
                "administrator",
                "pharmacist",
                "manager",
                "inventory officer",
                "storekeeper"
            ]
        },

        {
            name: "Transactions",
            path: "/admin/transactions",
            icon: (
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M4 5h16" />
                    <path d="M4 9h16" />
                    <path d="M4 13h10" />
                    <path d="M4 17h8" />
                    <path d="M17 15v6" />
                    <path d="m14 18 3 3 3-3" />
                </svg>
            ),

            roles: [
                "administrator",
                "pharmacist",
                "inventory officer",
                "storekeeper"
            ]
        },

        {
            name: "Orders",
            path: "/admin/orders",
            icon: (
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M4 4h16v16H4V4Z" />
                    <path d="M8 8h8" />
                    <path d="M8 12h8" />
                    <path d="M8 16h5" />
                </svg>
            ),

            roles: [
                "administrator",
                "pharmacist",
                "manager",
                "inventory officer"
            ]
        },

        {
            name: "Reports",
            path: "/admin/reports",
            icon: (
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M4 19V5" />
                    <path d="M4 19h17" />
                    <path d="m7 15 4-4 3 2 5-6" />
                </svg>
            ),

            roles: [
                "administrator",
                "pharmacist",
                "manager",
                "inventory officer"
            ]
        },

        {
            name: "Users",
            path: "/admin/users",
            icon: (
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),

            roles: [
                "administrator"
            ]
        },

        {
            name: "Settings",
            path: "/admin/settings",
            icon: (
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V20h-2v-.09a1.7 1.7 0 0 0-1.03-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.55-1.03H7v-2h.09A1.7 1.7 0 0 0 8.64 11a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.63 6.5V6h2v.5a1.7 1.7 0 0 0 1.03 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 18.6 11a1.7 1.7 0 0 0 1.55 1.03H20v2h-.5A1.7 1.7 0 0 0 19.4 15Z" />
                </svg>
            ),

            roles: [
                "administrator",
                "pharmacist",
                "manager",
                "inventory officer",
                "storekeeper"
            ]
        }

    ];


    // =========================================================
    // FILTER NAVIGATION
    // =========================================================

    const visibleNavigation =
        navigation.filter(item =>
            item.roles.includes(userRole)
        );


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        if (logout) {
            logout();
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true
        });
    };


    // =========================================================
    // NAV LINK
    // =========================================================

    const navLinkClass = ({ isActive }) => {

        return `
            group
            flex
            items-center
            gap-3
            rounded-[7px]
            px-3
            py-2.5
            text-[11px]
            font-medium
            transition-all
            duration-150
            ${
                isActive
                    ? "bg-[#e9f2fa] text-[#00549a]"
                    : "text-[#667085] hover:bg-[#f5f8fb] hover:text-[#00549a]"
            }
        `;
    };


    return (

        <aside className="fixed left-0 top-0 z-40 flex h-screen w-[230px] flex-col border-r border-[#e1e7ef] bg-white">


            {/* =====================================================
                LOGO
            ===================================================== */}

            <div className="flex h-[70px] items-center border-b border-[#e8edf3] px-5">

                <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#00549a]">

                        <svg
                            className="h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3Z" />
                        </svg>

                    </div>

                    <div>

                        <h1 className="text-[15px] font-bold tracking-tight text-[#17233c]">
                            MediStock
                        </h1>

                        <p className="text-[8px] uppercase tracking-[0.12em] text-[#98a2b3]">
                            Inventory System
                        </p>

                    </div>

                </div>

            </div>


            {/* =====================================================
                USER
            ===================================================== */}

            <div className="border-b border-[#e8edf3] px-4 py-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8f1f8] text-[11px] font-bold text-[#00549a]">

                        {user?.firstName?.charAt(0)?.toUpperCase() || "U"}

                    </div>


                    <div className="min-w-0">

                        <p className="truncate text-[11px] font-semibold text-[#17233c]">

                            {user?.firstName || "User"}{" "}
                            {user?.lastName || ""}

                        </p>

                        <p className="truncate text-[9px] text-[#8b95a7]">

                            {user?.role || "User"}

                        </p>

                    </div>

                </div>

            </div>


            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <nav className="flex-1 overflow-y-auto px-3 py-4">

                <p className="mb-2 px-3 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#a1aab8]">
                    Main Menu
                </p>


                <div className="space-y-1">

                    {visibleNavigation.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={navLinkClass}
                        >

                            <span className="shrink-0">
                                {item.icon}
                            </span>

                            <span>
                                {item.name}
                            </span>

                        </NavLink>

                    ))}

                </div>

            </nav>


            {/* =====================================================
                ADMIN INDICATOR
            ===================================================== */}

            {isAdmin && (

                <div className="mx-3 mb-3 rounded-[7px] border border-[#dce8f2] bg-[#f7fbfe] px-3 py-2.5">

                    <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#00549a]">
                        Administrator
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-[#718096]">
                        Full system access enabled.
                    </p>

                </div>

            )}


            {/* =====================================================
                LOGOUT
            ===================================================== */}

            <div className="border-t border-[#e8edf3] p-3">

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2.5 text-[11px] font-medium text-[#667085] transition hover:bg-[#fff5f5] hover:text-[#dc2626]"
                >

                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="M10 17l5-5-5-5" />
                        <path d="M15 12H3" />
                        <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
                    </svg>

                    Logout

                </button>

            </div>

        </aside>
    );
};


export default Sidebar;