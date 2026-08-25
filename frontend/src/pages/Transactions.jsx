import React, { useEffect, useState } from "react";

const Transactions = () => {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");


    // ============================================================
    // FETCH TRANSACTIONS
    // ============================================================

    const fetchTransactions = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/transactions"
            );

            if (!response.ok) {

                throw new Error(
                    `Failed to fetch transactions (${response.status})`
                );

            }

            const data = await response.json();

            console.log(
                "Transactions API response:",
                data
            );

            // Your API returns an array directly
            if (Array.isArray(data)) {

                setTransactions(data);

            } else {

                console.error(
                    "Unexpected transactions response:",
                    data
                );

                setTransactions([]);

                setError(
                    "The server returned an unexpected response."
                );
            }

        } catch (error) {

            console.error(
                "Transaction error:",
                error
            );

            setTransactions([]);

            setError(
                error.message ||
                "Failed to load transactions"
            );

        } finally {

            setLoading(false);

        }

    };


    // ============================================================
    // LOAD TRANSACTIONS
    // ============================================================

    useEffect(() => {

        fetchTransactions();

    }, []);


    // ============================================================
    // SEARCH
    // ============================================================

    const filteredTransactions =
        transactions.filter((transaction) => {

            const searchText =
                search.toLowerCase().trim();

            if (!searchText) {
                return true;
            }

            return (

                transaction.transaction_number
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                transaction.transaction_type
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                transaction.performed_by_name
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                transaction.department
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                transaction.status
                    ?.toLowerCase()
                    .includes(searchText)

            );

        });


    // ============================================================
    // DATE FORMAT
    // ============================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString();

    };


    // ============================================================
    // STATUS STYLE
    // ============================================================

    const getStatusClass = (status) => {

        switch (
            status?.toLowerCase()
        ) {

            case "completed":

                return "bg-green-100 text-green-700";

            case "pending":

                return "bg-yellow-100 text-yellow-700";

            case "cancelled":

                return "bg-red-100 text-red-700";

            default:

                return "bg-slate-100 text-slate-600";

        }

    };


    // ============================================================
    // PAGE
    // ============================================================

    return (

        <div className="min-h-screen bg-slate-50 p-4 md:p-6">

            <div className="mx-auto max-w-7xl">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6">

                    <h1 className="text-2xl font-bold text-slate-800">
                        Transactions
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        View and manage inventory transactions
                    </p>

                </div>


                {/* ==================================================
                    MAIN CARD
                ================================================== */}

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">


                    {/* ==================================================
                        SEARCH
                    ================================================== */}

                    <div className="border-b border-slate-200 p-4">

                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#00549a] focus:ring-2 focus:ring-blue-100"
                        />

                    </div>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                            {error}

                        </div>

                    )}


                    {/* ==================================================
                        TABLE
                    ================================================== */}

                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">


                            {/* TABLE HEADER */}

                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">

                                <tr>

                                    <th className="px-6 py-4">
                                        Transaction #
                                    </th>

                                    <th className="px-6 py-4">
                                        Type
                                    </th>

                                    <th className="px-6 py-4">
                                        Date
                                    </th>

                                    <th className="px-6 py-4">
                                        Location
                                    </th>

                                    <th className="px-6 py-4">
                                        Performed By
                                    </th>

                                    <th className="px-6 py-4">
                                        Department
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            {/* TABLE BODY */}

                            <tbody className="divide-y divide-slate-100">


                                {/* LOADING */}

                                {loading && (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="px-6 py-12 text-center text-slate-500"
                                        >

                                            Loading transactions...

                                        </td>

                                    </tr>

                                )}


                                {/* NO RESULTS */}

                                {!loading &&
                                    filteredTransactions.length === 0 && (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="px-6 py-12 text-center text-slate-500"
                                            >

                                                {search
                                                    ? "No transactions match your search."
                                                    : "No transactions found."
                                                }

                                            </td>

                                        </tr>

                                    )}


                                {/* TRANSACTIONS */}

                                {!loading &&
                                    filteredTransactions.length > 0 &&
                                    filteredTransactions.map(
                                        (transaction) => (

                                            <tr
                                                key={
                                                    transaction.transaction_id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >


                                                {/* TRANSACTION NUMBER */}

                                                <td className="px-6 py-4 font-semibold text-[#00549a]">

                                                    {transaction.transaction_number ||
                                                        "-"}

                                                </td>


                                                {/* TYPE */}

                                                <td className="px-6 py-4 text-slate-700">

                                                    {transaction.transaction_type ||
                                                        "-"}

                                                </td>


                                                {/* DATE */}

                                                <td className="whitespace-nowrap px-6 py-4 text-slate-600">

                                                    {formatDate(
                                                        transaction.transaction_date
                                                    )}

                                                </td>


                                                {/* LOCATION */}

                                                <td className="px-6 py-4 text-slate-600">

                                                    {transaction.location_name ||
                                                        "-"}

                                                </td>


                                                {/* PERFORMED BY */}

                                                <td className="px-6 py-4 text-slate-600">

                                                    {transaction.performed_by_name ||
                                                        "-"}

                                                </td>


                                                {/* DEPARTMENT */}

                                                <td className="px-6 py-4 text-slate-600">

                                                    {transaction.department ||
                                                        "-"}

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                            transaction.status
                                                        )}`}
                                                    >

                                                        {transaction.status ||
                                                            "-"}

                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                            </tbody>

                        </table>

                    </div>


                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    {!loading &&
                        transactions.length > 0 && (

                            <div className="border-t border-slate-200 px-6 py-4">

                                <p className="text-sm text-slate-500">

                                    Showing{" "}

                                    <span className="font-semibold text-slate-700">
                                        {filteredTransactions.length}
                                    </span>{" "}

                                    of{" "}

                                    <span className="font-semibold text-slate-700">
                                        {transactions.length}
                                    </span>{" "}

                                    transactions

                                </p>

                            </div>

                        )}

                </div>

            </div>

        </div>

    );

};

export default Transactions;