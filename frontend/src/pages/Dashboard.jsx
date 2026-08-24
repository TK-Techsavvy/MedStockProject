import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="flex min-h-screen">

                {/* SIDEBAR */}

                <Sidebar />


                {/* MAIN CONTENT */}

                <main className="ml-16 min-h-screen flex-1 bg-gray-100 md:ml-64">

                    <Outlet />

                </main>

            </div>

        </div>
    );
};

export default Dashboard;