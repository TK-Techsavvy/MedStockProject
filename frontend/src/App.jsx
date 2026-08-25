import "./App.css";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


// ============================================================
// PAGES
// ============================================================

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import Suppliers from "./pages/Suppliers";

import Transactions from "./pages/Transactions";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";


// ============================================================
// ROUTING
// ============================================================

import Root from "./utils/Root";
import ProtectedRoutes from "./utils/ProtectedRoutes";


function App() {

    return (

        <Router>

            <Routes>


                {/* ==================================================
                    LOGIN
                    ================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* ==================================================
                    PROTECTED APPLICATION
                    ================================================== */}

                <Route
                    element={
                        <ProtectedRoutes>
                            <Root />
                        </ProtectedRoutes>
                    }
                >


                    {/* ==================================================
                        DASHBOARD
                        ================================================== */}

                    <Route
                        path="/"
                        element={
                            <Dashboard />
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <Dashboard />
                        }
                    />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <Dashboard />
                        }
                    />


                    {/* ==================================================
                        MEDICINES
                        ================================================== */}

                    <Route
                        path="/admin/medicines"
                        element={
                            <ProtectedRoutes
                                allowedRoles={[
                                    "Administrator",
                                    "Pharmacist",
                                    "Manager",
                                    "Inventory Officer",
                                    "Storekeeper"
                                ]}
                            >
                                <Medicines />
                            </ProtectedRoutes>
                        }
                    />


                    {/* ==================================================
                        SUPPLIERS
                        ================================================== */}

                    <Route
                        path="/admin/suppliers"
                        element={
                            <ProtectedRoutes
                                allowedRoles={[
                                    "Administrator",
                                    "Pharmacist",
                                    "Manager",
                                    "Inventory Officer",
                                    "Storekeeper"
                                ]}
                            >
                                <Suppliers />
                            </ProtectedRoutes>
                        }
                    />


                    {/* ==================================================
                        TRANSACTIONS
                        ================================================== */}

                    <Route
                        path="/admin/transactions"
                        element={
                            <ProtectedRoutes
                                allowedRoles={[
                                    "Administrator",
                                    "Pharmacist",
                                    "Inventory Officer",
                                    "Storekeeper"
                                ]}
                            >
                                <Transactions />
                            </ProtectedRoutes>
                        }
                    />


                    {/* ==================================================
                        ORDERS
                        ================================================== */}

                    <Route
                        path="/admin/orders"
                        element={
                            <ProtectedRoutes
                                allowedRoles={[
                                    "Administrator",
                                    "Pharmacist",
                                    "Manager",
                                    "Inventory Officer"
                                ]}
                            >
                                <Orders />
                            </ProtectedRoutes>
                        }
                    />


                    {/* ==================================================
                        REPORTS
                        ================================================== */}

                    <Route
                        path="/admin/reports"
                        element={
                            <ProtectedRoutes
                                allowedRoles={[
                                    "Administrator",
                                    "Pharmacist",
                                    "Manager",
                                    "Inventory Officer"
                                ]}
                            >
                                <Reports />
                            </ProtectedRoutes>
                        }
                    />


                    {/* ==================================================
                        USERS
                        ADMINISTRATOR ONLY
                        ================================================== */}

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoutes
                                allowedRoles={[
                                    "Administrator"
                                ]}
                            >
                                <Users />
                            </ProtectedRoutes>
                        }
                    />


                    {/* ==================================================
                        SETTINGS
                        ================================================== */}

                    <Route
                        path="/admin/settings"
                        element={
                            <ProtectedRoutes
                                allowedRoles={[
                                    "Administrator",
                                    "Pharmacist",
                                    "Manager",
                                    "Inventory Officer",
                                    "Storekeeper"
                                ]}
                            >
                                <Settings />
                            </ProtectedRoutes>
                        }
                    />


                    {/* ==================================================
                        CUSTOMER ROUTES
                        ================================================== */}

                    <Route
                        path="/customer"
                        element={
                            <Dashboard />
                        }
                    />

                    <Route
                        path="/customer/dashboard"
                        element={
                            <Dashboard />
                        }
                    />


                    {/* ==================================================
                        UNKNOWN URL
                        ================================================== */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />
                        }
                    />

                </Route>

            </Routes>

        </Router>
    );
}


export default App;