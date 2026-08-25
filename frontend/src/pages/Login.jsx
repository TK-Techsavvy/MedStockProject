import React, { useState } from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const Login = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const {
        login
    } = useAuth();


    const [email, setEmail] = useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setLoading(true);


        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        password
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Login failed"
                );

            }


            login(
                data.user,
                data.token
            );


            const role =
                data.user?.role
                    ?.trim()
                    .toLowerCase();


            const previousPage =
                location.state?.from;


            if (previousPage) {

                navigate(
                    previousPage,
                    {
                        replace: true
                    }
                );

                return;

            }


            if (role === "customer") {

                navigate(
                    "/customer/dashboard",
                    {
                        replace: true
                    }
                );

            } else {

                navigate(
                    "/admin/dashboard",
                    {
                        replace: true
                    }
                );

            }

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                error.message ||
                "Unable to login"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="flex min-h-screen bg-[#f8faff]">


            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="hidden w-[52%] flex-col justify-between bg-[#00549a] p-12 text-white lg:flex">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-white text-[#00549a]">

                            <span className="text-[22px] font-bold">
                                +
                            </span>

                        </div>

                        <div>

                            <h1 className="text-[18px] font-bold">
                                MediStock
                            </h1>

                            <p className="text-[9px] text-blue-100">
                                Medical Inventory Management System
                            </p>

                        </div>

                    </div>


                    <div className="mt-24 max-w-[430px]">

                        <h2 className="text-[35px] font-bold leading-tight">

                            Manage your medical inventory with confidence.

                        </h2>

                        <p className="mt-5 text-[13px] leading-6 text-blue-100">

                            Monitor medicines, suppliers and stock information from one centralized system.

                        </p>

                    </div>

                </div>


                <p className="text-[9px] text-blue-100">
                    © 2026 MediStock IMS
                </p>

            </div>


            {/* =================================================
                LOGIN FORM
            ================================================= */}

            <div className="flex flex-1 items-center justify-center px-6">

                <div className="w-full max-w-[350px]">


                    <div className="mb-8 lg:hidden">

                        <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#00549a] text-white">

                                +
                                
                            </div>

                            <span className="text-[15px] font-bold text-[#17233c]">
                                MediStock
                            </span>

                        </div>

                    </div>


                    <div className="mb-7">

                        <h2 className="text-[21px] font-bold text-[#17233c]">
                            Welcome back
                        </h2>

                        <p className="mt-1 text-[11px] text-[#69758b]">
                            Sign in to access your inventory system.
                        </p>

                    </div>


                    {error && (

                        <div className="mb-4 rounded-[6px] border border-[#fecaca] bg-[#fff5f5] px-3 py-2 text-[10px] text-[#dc2626]">

                            {error}

                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        <div>

                            <label className="mb-1.5 block text-[10px] font-semibold text-[#344054]">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your email"
                                required
                                className="h-[38px] w-full rounded-[6px] border border-[#d6deeb] bg-white px-3 text-[11px] text-[#344054] outline-none transition placeholder:text-[#a0a9b8] focus:border-[#00549a] focus:ring-2 focus:ring-[#00549a]/10"
                            />

                        </div>


                        <div>

                            <label className="mb-1.5 block text-[10px] font-semibold text-[#344054]">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your password"
                                required
                                className="h-[38px] w-full rounded-[6px] border border-[#d6deeb] bg-white px-3 text-[11px] text-[#344054] outline-none transition placeholder:text-[#a0a9b8] focus:border-[#00549a] focus:ring-2 focus:ring-[#00549a]/10"
                            />

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-[38px] w-full items-center justify-center rounded-[6px] bg-[#00549a] text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#00447e] disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign In"}

                        </button>

                    </form>


                    <p className="mt-8 text-center text-[9px] text-[#98a2b3]">
                        Secure medical inventory management
                    </p>

                </div>

            </div>

        </div>

    );

};


export default Login;