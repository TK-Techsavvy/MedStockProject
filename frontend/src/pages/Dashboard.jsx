import React, {
    useEffect,
    useState
} from "react";

import { useAuth } from "../context/AuthContext";


const Dashboard = () => {

    const { user } = useAuth();

    const [stats, setStats] = useState({
        totalMedicines: 0,
        lowStock: 0,
        suppliers: 0,
        transactions: 0,
        healthy: 0,
        moderate: 0,
        critical: 0
    });

    const [loading, setLoading] = useState(true);


    // =========================================================
    // FETCH DASHBOARD DATA
    // =========================================================

    const fetchDashboardData = async () => {

        try {

            setLoading(true);


            // -------------------------------------------------
            // MEDICINES
            // -------------------------------------------------

            const medicinesResponse = await fetch(
                "http://localhost:5000/api/medicine"
            );

            if (!medicinesResponse.ok) {
                throw new Error(
                    "Failed to fetch medicines"
                );
            }

            const medicines =
                await medicinesResponse.json();


            // -------------------------------------------------
            // SUPPLIERS
            // -------------------------------------------------

            const suppliersResponse = await fetch(
                "http://localhost:5000/api/medicine/suppliers"
            );

            let suppliers = [];

            if (suppliersResponse.ok) {
                suppliers =
                    await suppliersResponse.json();
            }


            // -------------------------------------------------
            // TRANSACTIONS
            // -------------------------------------------------

            let transactions = [];

            try {

                const transactionsResponse =
                    await fetch(
                        "http://localhost:5000/api/transactions"
                    );

                if (transactionsResponse.ok) {

                    transactions =
                        await transactionsResponse.json();

                }

            } catch (transactionError) {

                console.warn(
                    "Transactions endpoint unavailable:",
                    transactionError
                );

            }


            // -------------------------------------------------
            // CALCULATE STOCK
            // -------------------------------------------------

            let lowStock = 0;
            let healthy = 0;
            let moderate = 0;
            let critical = 0;


            medicines.forEach((medicine) => {

                const quantity = Number(
                    medicine.quantity ??
                    medicine.current_stock ??
                    medicine.stock_quantity ??
                    medicine.stock_level ??
                    0
                );


                const reorderLevel = Number(
                    medicine.reorder_level ?? 10
                );


                // Critical = at or below reorder level
                if (quantity <= reorderLevel) {

                    critical++;
                    lowStock++;

                }

                // Moderate
                else if (
                    quantity <=
                    reorderLevel + 20
                ) {

                    moderate++;

                }

                // Healthy
                else {

                    healthy++;

                }

            });


            setStats({

                totalMedicines:
                    medicines.length,

                lowStock,

                suppliers:
                    suppliers.length,

                transactions:
                    transactions.length,

                healthy,

                moderate,

                critical

            });


        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // LOAD DASHBOARD
    // =========================================================

    useEffect(() => {

        fetchDashboardData();

        const interval = setInterval(
            fetchDashboardData,
            30000
        );

        return () => clearInterval(interval);

    }, []);


    return (

        <div className="min-h-screen bg-[#f8faff] px-7 py-7">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6 flex items-start justify-between">

                <div>

                    <h1 className="text-[20px] font-bold tracking-[-0.2px] text-[#17233c]">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-[11px] text-[#69758b]">
                        Welcome back,{" "}
                        {user?.firstName || "User"}.
                    </p>

                </div>


                <div className="rounded-[6px] border border-[#dfe5ef] bg-white px-3 py-2">

                    <p className="text-[8px] uppercase tracking-[0.4px] text-[#8a94a5]">
                        Current Role
                    </p>

                    <p className="mt-0.5 text-[10px] font-semibold text-[#00549a]">
                        {user?.role || "User"}
                    </p>

                </div>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">


                <StatCard
                    title="Total Medicines"
                    value={
                        loading
                            ? "..."
                            : stats.totalMedicines
                    }
                    description="Registered medicines"
                    icon={<MedicineIcon />}
                />


                <StatCard
                    title="Low Stock"
                    value={
                        loading
                            ? "..."
                            : stats.lowStock
                    }
                    description="Require attention"
                    icon={<WarningIcon />}
                />


                <StatCard
                    title="Suppliers"
                    value={
                        loading
                            ? "..."
                            : stats.suppliers
                    }
                    description="Active suppliers"
                    icon={<SupplierIcon />}
                />


                <StatCard
                    title="Transactions"
                    value={
                        loading
                            ? "..."
                            : stats.transactions
                    }
                    description="Recent transactions"
                    icon={<TransactionIcon />}
                />

            </div>


            {/* =================================================
                MAIN CARDS
            ================================================= */}

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">


                {/* INVENTORY OVERVIEW */}

                <div className="rounded-[8px] border border-[#dfe5ef] bg-white">

                    <div className="border-b border-[#e8ecf2] px-4 py-3">

                        <h2 className="text-[11px] font-semibold text-[#26344d]">
                            Inventory Overview
                        </h2>

                        <p className="mt-0.5 text-[9px] text-[#8a94a5]">
                            Current inventory status
                        </p>

                    </div>


                    <div className="grid grid-cols-3 divide-x divide-[#edf0f4]">

                        <Overview
                            label="Healthy"
                            value={
                                loading
                                    ? "..."
                                    : stats.healthy
                            }
                        />

                        <Overview
                            label="Moderate"
                            value={
                                loading
                                    ? "..."
                                    : stats.moderate
                            }
                        />

                        <Overview
                            label="Critical"
                            value={
                                loading
                                    ? "..."
                                    : stats.critical
                            }
                        />

                    </div>

                </div>


                {/* QUICK INFORMATION */}

                <div className="rounded-[8px] border border-[#dfe5ef] bg-white">

                    <div className="border-b border-[#e8ecf2] px-4 py-3">

                        <h2 className="text-[11px] font-semibold text-[#26344d]">
                            Quick Information
                        </h2>

                        <p className="mt-0.5 text-[9px] text-[#8a94a5]">
                            Account information
                        </p>

                    </div>


                    <div className="space-y-3 px-4 py-4">

                        <Info
                            label="Name"
                            value={
                                `${user?.firstName || ""} ${
                                    user?.lastName || ""
                                }`
                            }
                        />

                        <Info
                            label="Email"
                            value={user?.email}
                        />

                        <Info
                            label="Department"
                            value={user?.department}
                        />

                        <Info
                            label="Status"
                            value={user?.status}
                        />

                    </div>

                </div>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="mt-8 flex items-center justify-between text-[8px] text-[#8a94a5]">

                <span>
                    © 2026 MediStock IMS v2.4.1
                </span>

                <div className="flex gap-5">

                    <span>
                        Support Center
                    </span>

                    <span>
                        Privacy Policy
                    </span>

                    <span>
                        Terms of Service
                    </span>

                </div>

            </div>

        </div>

    );

};


// =============================================================
// STAT CARD
// =============================================================

const StatCard = ({
    title,
    value,
    description,
    icon
}) => (

    <div className="rounded-[8px] border border-[#dfe5ef] bg-white p-4">

        <div className="flex items-start justify-between">

            <div>

                <p className="text-[9px] font-medium text-[#8a94a5]">
                    {title}
                </p>

                <p className="mt-2 text-[22px] font-bold text-[#17233c]">
                    {value}
                </p>

                <p className="mt-1 text-[8px] text-[#98a2b3]">
                    {description}
                </p>

            </div>


            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] bg-[#eaf3ff] text-[#00549a]">

                {icon}

            </div>

        </div>

    </div>

);


// =============================================================
// OVERVIEW
// =============================================================

const Overview = ({
    label,
    value
}) => (

    <div className="px-4 py-5">

        <p className="text-[8px] text-[#8a94a5]">
            {label}
        </p>

        <p className="mt-1 text-[17px] font-bold text-[#26344d]">
            {value}
        </p>

    </div>

);


// =============================================================
// INFO
// =============================================================

const Info = ({
    label,
    value
}) => (

    <div className="flex items-center justify-between border-b border-[#edf0f4] pb-2">

        <span className="text-[9px] text-[#8a94a5]">
            {label}
        </span>

        <span className="max-w-[220px] truncate text-right text-[9px] font-medium text-[#475467]">
            {value || "—"}
        </span>

    </div>

);


// =============================================================
// ICONS
// =============================================================

const MedicineIcon = () => (

    <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
    >

        <path d="M9 3h6" />

        <path d="M10 3v4M14 3v4" />

        <path d="M7 7h10" />

        <path d="M6 7h12l-1 13H7L6 7Z" />

        <path d="M12 10v6M9 13h6" />

    </svg>

);


const WarningIcon = () => (

    <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
    >

        <path d="M12 9v4" />

        <path d="M12 17h.01" />

        <path d="M10.3 3.8 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />

    </svg>

);


const SupplierIcon = () => (

    <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
    >

        <path d="M3 21h18" />

        <path d="M5 21V7l7-4 7 4v14" />

        <path d="M9 21v-5h6v5" />

    </svg>

);


const TransactionIcon = () => (

    <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
    >

        <path d="M4 6h16" />

        <path d="M4 12h16" />

        <path d="M4 18h16" />

        <path d="M8 4v16" />

    </svg>

);


export default Dashboard;