import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // LOGIN
    // ==========================================

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            console.log("LOGIN RESPONSE:", data);

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            // ==========================================
            // STORE USER
            // ==========================================

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // ==========================================
            // STORE TOKEN
            // ==========================================

            localStorage.setItem(
                "token",
                data.token
            );

            // ==========================================
            // DEBUG
            // ==========================================

            console.log("USER:", data.user);
            console.log("ROLE:", data.user.role);
            console.log("ROLE ID:", data.user.roleId);

            // ==========================================
            // REDIRECT BASED ON ROLE
            // ==========================================

            const role =
                data.user.role
                    ?.trim()
                    .toLowerCase();

            switch (role) {
                case "administrator":
                    navigate("/admin/dashboard", {
                        replace: true
                    });
                    break;

                case "pharmacist":
                    navigate("/pharmacist/dashboard", {
                        replace: true
                    });
                    break;

                case "inventory manager":
                    navigate("/inventory/dashboard", {
                        replace: true
                    });
                    break;

                case "procurement officer":
                    navigate("/procurement/dashboard", {
                        replace: true
                    });
                    break;

                case "auditor":
                    navigate("/auditor/dashboard", {
                        replace: true
                    });
                    break;

                default:
                    navigate("/unauthorized", {
                        replace: true
                    });
                    break;
            }

        } catch (error) {
            console.error("Login error:", error);

            setError(
                error.message ||
                "Unable to login"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-8">

            {/* ==========================================
                BACKGROUND DECORATION
            ========================================== */}

            <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#00549a]/10 blur-3xl" />

            <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#00549a]/10 blur-3xl" />


            {/* ==========================================
                LOGIN CARD
            ========================================== */}

            <div className="relative z-10 w-full max-w-[440px]">

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                    {/* ==========================================
                        TOP BLUE SECTION
                    ========================================== */}

                    <div className="bg-[#00549a] px-8 py-8 text-center">

                        {/* LOGO */}

                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md">

                            <div className="text-3xl font-bold text-[#00549a]">
                                M
                            </div>

                        </div>


                        <h1 className="text-2xl font-bold text-white">
                            MediStock
                        </h1>

                        <p className="mt-1 text-sm text-blue-100">
                            Medical Inventory Management System
                        </p>

                    </div>


                    {/* ==========================================
                        FORM SECTION
                    ========================================== */}

                    <div className="px-8 py-8">

                        <div className="mb-7">

                            <h2 className="text-xl font-semibold text-slate-800">
                                Welcome back
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Sign in to access your account
                            </p>

                        </div>


                        {/* ==========================================
                            ERROR MESSAGE
                        ========================================== */}

                        {error && (

                            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                                    !
                                </div>

                                <p className="text-sm leading-5 text-red-600">
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* ==========================================
                            FORM
                        ========================================== */}

                        <form
                            onSubmit={handleLogin}
                            className="space-y-5"
                        >

                            {/* EMAIL */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Email address
                                </label>

                                <div className="relative">

                                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">

                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>

                                    </div>

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter your email"
                                        required
                                        className="h-12 w-full rounded-lg border border-slate-300 bg-slate-50 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#00549a] focus:bg-white focus:ring-4 focus:ring-[#00549a]/10"
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>

                                <div className="relative">

                                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">

                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M7 10V8a5 5 0 0110 0v2M6 10h12a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-8a1 1 0 011-1z"
                                            />
                                        </svg>

                                    </div>

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        required
                                        className="h-12 w-full rounded-lg border border-slate-300 bg-slate-50 pl-12 pr-20 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#00549a] focus:bg-white focus:ring-4 focus:ring-[#00549a]/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-[#00549a] transition hover:bg-blue-50"
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>


                            {/* ==========================================
                                LOGIN BUTTON
                            ========================================== */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#00549a] px-5 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-[#00427a] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#00549a]/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading ? (

                                    <>

                                        <svg
                                            className="mr-2 h-5 w-5 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />

                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            />

                                        </svg>

                                        Signing in...

                                    </>

                                ) : (

                                    "Sign In"

                                )}

                            </button>

                        </form>


                        {/* ==========================================
                            SECURITY MESSAGE
                        ========================================== */}

                        <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-5">

                            <svg
                                className="h-4 w-4 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"
                                />

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4"
                                />
                            </svg>

                            <span className="text-xs text-slate-500">
                                Secure access to your medical inventory
                            </span>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    FOOTER
                ========================================== */}

                <p className="mt-5 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} MediStock
                    {" "}Medical Inventory System
                </p>

            </div>

        </div>
    );
};

export default Login;