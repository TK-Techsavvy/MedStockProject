import "./App.css";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Root from "./utils/Root";
import Login from "./pages/Login";
import ProtectedRoutes from "./utils/ProtectedRoutes";

import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";


function App() {

    return (
        <Router>

            <Routes>

                {/* =====================================================
                    HOME
                ===================================================== */}

                <Route
                    path="/"
                    element={<Root />}
                />


                {/* =====================================================
                    LOGIN
                ===================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =====================================================
                    ADMINISTRATOR
                ===================================================== */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoutes
                            requiredRole={["Administrator"]}
                        >
                            <Dashboard />
                        </ProtectedRoutes>
                    }
                >

                    {/* Default */}

                    <Route
                        index
                        element={
                            <Navigate
                                to="/admin/dashboard"
                                replace
                            />
                        }
                    />


                    {/* Dashboard */}

                    <Route
                        path="dashboard"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Administrator Dashboard
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Summary of the medical inventory system.
                                </p>

                            </div>
                        }
                    />


                    {/* Users */}

                    <Route
                        path="users"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Users
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage system users and permissions.
                                </p>

                            </div>
                        }
                    />


                    {/* Medicines */}

                    <Route
                        path="medicines"
                        element={<Medicines />}
                    />


                    {/* Inventory */}

                    <Route
                        path="inventory"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Inventory
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage medical inventory and stock levels.
                                </p>

                            </div>
                        }
                    />


                    {/* Suppliers */}

                    <Route
                        path="suppliers"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Suppliers
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage suppliers and supplier information.
                                </p>

                            </div>
                        }
                    />


                    {/* Transactions */}

                    <Route
                        path="transactions"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Transactions
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    View and manage inventory transactions.
                                </p>

                            </div>
                        }
                    />


                    {/* Orders */}

                    <Route
                        path="orders"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Purchase Orders
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage purchase orders and supplier orders.
                                </p>

                            </div>
                        }
                    />


                    {/* Reports */}

                    <Route
                        path="reports"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Reports
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    View medical inventory reports.
                                </p>

                            </div>
                        }
                    />


                    {/* Audit Logs */}

                    <Route
                        path="audit-logs"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Audit Logs
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    View system activity and audit records.
                                </p>

                            </div>
                        }
                    />


                    {/* Settings */}

                    <Route
                        path="settings"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Settings
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage system settings.
                                </p>

                            </div>
                        }
                    />

                </Route>


                {/* =====================================================
                    PHARMACIST
                ===================================================== */}

                <Route
                    path="/pharmacist"
                    element={
                        <ProtectedRoutes
                            requiredRole={["Pharmacist"]}
                        >
                            <Dashboard />
                        </ProtectedRoutes>
                    }
                >

                    {/* Default */}

                    <Route
                        index
                        element={
                            <Navigate
                                to="/pharmacist/dashboard"
                                replace
                            />
                        }
                    />


                    {/* Dashboard */}

                    <Route
                        path="dashboard"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Pharmacist Dashboard
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage medicines, inventory and transactions.
                                </p>

                            </div>
                        }
                    />


                    {/* Medicines */}

                    <Route
                        path="medicines"
                        element={<Medicines />}
                    />


                    {/* Inventory */}

                    <Route
                        path="inventory"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Inventory
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    View medicine stock and availability.
                                </p>

                            </div>
                        }
                    />


                    {/* Transactions */}

                    <Route
                        path="transactions"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Transactions
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage medicine transactions.
                                </p>

                            </div>
                        }
                    />


                    {/* Adjustments */}

                    <Route
                        path="adjustments"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Stock Adjustments
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage stock adjustments.
                                </p>

                            </div>
                        }
                    />


                    {/* Notifications */}

                    <Route
                        path="notifications"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Notifications
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    View inventory notifications.
                                </p>

                            </div>
                        }
                    />


                    {/* Reports */}

                    <Route
                        path="reports"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Reports
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    View medicine and inventory reports.
                                </p>

                            </div>
                        }
                    />


                    {/* Settings */}

                    <Route
                        path="settings"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Settings
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage pharmacist settings.
                                </p>

                            </div>
                        }
                    />

                </Route>


                {/* =====================================================
                    INVENTORY MANAGER
                ===================================================== */}

                <Route
                    path="/inventory"
                    element={
                        <ProtectedRoutes
                            requiredRole={["Inventory Manager"]}
                        >
                            <Dashboard />
                        </ProtectedRoutes>
                    }
                >

                    <Route
                        index
                        element={
                            <Navigate
                                to="/inventory/dashboard"
                                replace
                            />
                        }
                    />


                    <Route
                        path="dashboard"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Inventory Manager Dashboard
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Monitor and manage medical inventory.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="stock"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Inventory
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage current stock levels.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="batches"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Medicine Batches
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage medicine batches and expiry dates.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="adjustments"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Inventory Adjustments
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Record inventory adjustments.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="reports"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Inventory Reports
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    View inventory reports.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="notifications"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Notifications
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    View inventory notifications.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="settings"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Settings
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage inventory manager settings.
                                </p>

                            </div>
                        }
                    />

                </Route>


                {/* =====================================================
                    PROCUREMENT OFFICER
                ===================================================== */}

                <Route
                    path="/procurement"
                    element={
                        <ProtectedRoutes
                            requiredRole={["Procurement Officer"]}
                        >
                            <Dashboard />
                        </ProtectedRoutes>
                    }
                >

                    <Route
                        index
                        element={
                            <Navigate
                                to="/procurement/dashboard"
                                replace
                            />
                        }
                    />


                    <Route
                        path="dashboard"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Procurement Dashboard
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage suppliers and purchase orders.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="suppliers"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Suppliers
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage suppliers.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="orders"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Purchase Orders
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Create and manage purchase orders.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="batches"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Medicine Batches
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage incoming medicine batches.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="reports"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Procurement Reports
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    View procurement reports.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="settings"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Settings
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage procurement settings.
                                </p>

                            </div>
                        }
                    />

                </Route>


                {/* =====================================================
                    AUDITOR
                ===================================================== */}

                <Route
                    path="/auditor"
                    element={
                        <ProtectedRoutes
                            requiredRole={["Auditor"]}
                        >
                            <Dashboard />
                        </ProtectedRoutes>
                    }
                >

                    <Route
                        index
                        element={
                            <Navigate
                                to="/auditor/dashboard"
                                replace
                            />
                        }
                    />


                    <Route
                        path="dashboard"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Auditor Dashboard
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Monitor system activity and records.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="logs"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Audit Logs
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    View system audit logs.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="transactions"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Transactions
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Review inventory transactions.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="reports"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Inventory Reports
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Review inventory reports.
                                </p>

                            </div>
                        }
                    />


                    <Route
                        path="settings"
                        element={
                            <div className="p-6">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Settings
                                </h1>

                                <p className="mt-2 text-slate-500">
                                    Manage auditor settings.
                                </p>

                            </div>
                        }
                    />

                </Route>


                {/* =====================================================
                    UNAUTHORIZED
                ===================================================== */}

                <Route
                    path="/unauthorized"
                    element={
                        <div className="flex min-h-screen items-center justify-center bg-slate-50">

                            <div className="max-w-md rounded-xl bg-white p-10 text-center shadow">

                                <h1 className="text-3xl font-bold text-red-600">
                                    Unauthorized
                                </h1>

                                <p className="mt-4 text-slate-600">
                                    You do not have permission to access this page.
                                </p>

                                <button
                                    onClick={() => window.history.back()}
                                    className="mt-6 rounded-lg bg-[#00549a] px-5 py-2 text-sm font-medium text-white hover:bg-[#00427a]"
                                >
                                    Go Back
                                </button>

                            </div>

                        </div>
                    }
                />


                {/* =====================================================
                    PAGE NOT FOUND
                ===================================================== */}

                <Route
                    path="*"
                    element={
                        <div className="flex min-h-screen items-center justify-center bg-slate-50">

                            <div className="max-w-md rounded-xl bg-white p-10 text-center shadow">

                                <h1 className="text-3xl font-bold text-slate-800">
                                    Page Not Found
                                </h1>

                                <p className="mt-4 text-slate-500">
                                    The page you are looking for does not exist.
                                </p>

                            </div>

                        </div>
                    }
                />

            </Routes>

        </Router>
    );
}

export default App;