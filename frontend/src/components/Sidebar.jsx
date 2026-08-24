import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const navigation = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: (
                <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
            ),
        },
        {
            name: "Medicine",
            path: "/admin/medicines",
            icon: (
                <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M10.5 3.5h3v4h-3z" />
                    <path d="M8 7.5h8a2 2 0 0 1 2 2v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-8a2 2 0 0 1 2-2Z" />
                    <path d="M9 13h6" />
                    <path d="M12 10v6" />
                </svg>
            ),
        },
        {
            name: "Suppliers",
            path: "/admin/suppliers",
            icon: (
                <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M3 7h11v10H3z" />
                    <path d="M14 10h4l3 3v4h-7z" />
                    <circle cx="7" cy="19" r="2" />
                    <circle cx="18" cy="19" r="2" />
                </svg>
            ),
        },
        {
            name: "Transactions",
            path: "/admin/transactions",
            icon: (
                <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M4 7h13" />
                    <path d="m13 3 4 4-4 4" />
                    <path d="M20 17H7" />
                    <path d="m11 13-4 4 4 4" />
                </svg>
            ),
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: (
                <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M6 3h12l1 4H5z" />
                    <path d="M5 7h14v13H5z" />
                    <path d="M9 11h6" />
                    <path d="M9 15h6" />
                </svg>
            ),
        },
        {
            name: "Reports",
            path: "/admin/reports",
            icon: (
                <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M4 19V5" />
                    <path d="M4 19h16" />
                    <path d="m7 15 3-4 3 2 5-7" />
                </svg>
            ),
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: (
                <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                    <path d="M16 11c2.2 0 4 1.8 4 4" />
                    <path d="M16 5.5a2.5 2.5 0 0 1 0 5" />
                </svg>
            ),
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: (
                <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6.4v-2.6h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1H15v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1Z" />
                </svg>
            ),
        },
    ];

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    return (
        <aside
            className="
                fixed
                left-0
                top-0
                z-50
                flex
                h-screen
                w-[141px]
                flex-col
                border-r
                border-[#dce3ed]
                bg-[#eef3ff]
            "
        >

            {/* ================================
                LOGO
            ================================= */}

            <div
                className="
                    flex
                    h-[52px]
                    items-center
                    gap-2
                    border-b
                    border-[#dce3ed]
                    px-3
                "
            >

                <div
                    className="
                        flex
                        h-[21px]
                        w-[21px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-[5px]
                        bg-[#00549a]
                        text-[11px]
                        font-bold
                        text-white
                    "
                >
                    ✚
                </div>

                <div className="min-w-0">

                    <h1
                        className="
                            truncate
                            text-[10px]
                            font-bold
                            leading-tight
                            text-[#172033]
                        "
                    >
                        MediStock IMS
                    </h1>

                    <p
                        className="
                            text-[6px]
                            leading-tight
                            text-[#6f7b8c]
                        "
                    >
                        Inventory Control
                    </p>

                </div>

            </div>


            {/* ================================
                NAVIGATION
            ================================= */}

            <nav className="flex-1 px-2 py-7">

                <div className="space-y-[3px]">

                    {navigation.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `
                                flex
                                h-[25px]
                                items-center
                                gap-2
                                rounded-[12px]
                                px-3
                                text-[8px]
                                font-medium
                                transition-all
                                ${
                                    isActive
                                        ? "bg-[#00549a] text-white shadow-sm"
                                        : "text-[#3f4b5d] hover:bg-white/70 hover:text-[#00549a]"
                                }
                                `
                            }
                        >

                            <span className="flex w-[14px] items-center justify-center">
                                {item.icon}
                            </span>

                            <span>
                                {item.name}
                            </span>

                        </NavLink>

                    ))}

                </div>

            </nav>


            {/* ================================
                BOTTOM SECTION
            ================================= */}

            <div
                className="
                    border-t
                    border-[#dce3ed]
                    px-3
                    py-4
                "
            >

                {/* Support */}

                <button
                    type="button"
                    className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-md
                        px-2
                        py-2
                        text-[8px]
                        text-[#4d5969]
                        transition
                        hover:bg-white/70
                        hover:text-[#00549a]
                    "
                >

                    <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.8c-.8.8-1.8 1.2-1.8 2.7" />
                        <path d="M12 17h.01" />
                    </svg>

                    <span>
                        Support
                    </span>

                </button>


                {/* Sign Out */}

                <button
                    type="button"
                    onClick={handleSignOut}
                    className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-md
                        px-2
                        py-2
                        text-[8px]
                        text-[#4d5969]
                        transition
                        hover:bg-white/70
                        hover:text-red-600
                    "
                >

                    <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M10 17l5-5-5-5" />
                        <path d="M15 12H3" />
                        <path d="M21 3v18" />
                    </svg>

                    <span>
                        Sign Out
                    </span>

                </button>

            </div>

        </aside>
    );
};

export default Sidebar;