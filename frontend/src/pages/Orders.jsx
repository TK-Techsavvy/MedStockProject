import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const Orders = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // =========================================================
    // DATA
    // =========================================================

    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setMedicines] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // =========================================================
    // PANELS
    // =========================================================

    const [showForm, setShowForm] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderDetails, setSelectedOrderDetails] =
        useState(null);

    // =========================================================
    // FILTERS
    // =========================================================

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("");

    // =========================================================
    // ORDER FORM
    // =========================================================

    const [form, setForm] = useState({
        supplier_id: "",
        ordered_by: "",
        order_number: "",
        order_date: "",
        expected_delivery: "",
        notes: "",
    });

    const [items, setItems] = useState([]);

    // =========================================================
    // PAGINATION
    // =========================================================

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // =========================================================
    // FETCH ORDERS
    // =========================================================

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/orders`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();

            setOrders(
                Array.isArray(data)
                    ? data
                    : data.orders || []
            );
        } catch (error) {
            console.error(
                "Error fetching orders:",
                error
            );

            alert(
                "Unable to load orders. Please make sure the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // FETCH SUPPLIERS
    // =========================================================

    const fetchSuppliers = async () => {
        try {
            const response = await fetch(
                `${API_URL}/medicine/suppliers`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch suppliers"
                );
            }

            const data = await response.json();

            setSuppliers(
                Array.isArray(data)
                    ? data
                    : data.suppliers || []
            );
        } catch (error) {
            console.error(
                "Error fetching suppliers:",
                error
            );
        }
    };

    // =========================================================
    // FETCH MEDICINES
    // =========================================================

    const fetchMedicines = async () => {
        try {
            const response = await fetch(
                `${API_URL}/medicine`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch medicines"
                );
            }

            const data = await response.json();

            setMedicines(
                Array.isArray(data)
                    ? data
                    : data.medicines || []
            );
        } catch (error) {
            console.error(
                "Error fetching medicines:",
                error
            );
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchOrders();
        fetchSuppliers();
        fetchMedicines();
    }, []);

    // =========================================================
    // GET LOGGED-IN USER
    // =========================================================

    const getLoggedInUserId = () => {
        try {
            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return "";
            }

            const user = JSON.parse(storedUser);

            return (
                user.user_id ||
                user.id ||
                user.userId ||
                ""
            );
        } catch (error) {
            console.error(
                "Unable to read logged-in user:",
                error
            );

            return "";
        }
    };

    // =========================================================
    // GENERATE ORDER NUMBER
    // =========================================================

    const generateOrderNumber = () => {
        const now = new Date();

        const year = now.getFullYear();

        const month = String(
            now.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            now.getDate()
        ).padStart(2, "0");

        const random = Math.floor(
            1000 + Math.random() * 9000
        );

        return `PO-${year}${month}${day}-${random}`;
    };

    // =========================================================
    // TODAY
    // =========================================================

    const getToday = () => {
        const date = new Date();

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // =========================================================
    // RESET FORM
    // =========================================================

    const resetForm = () => {
        setForm({
            supplier_id: "",
            ordered_by: getLoggedInUserId(),
            order_number: generateOrderNumber(),
            order_date: getToday(),
            expected_delivery: "",
            notes: "",
        });

        setItems([]);
    };

    // =========================================================
    // OPEN NORMAL ORDER FORM
    // =========================================================

    const handleAddOrder = () => {
        setSelectedOrder(null);

        resetForm();

        setShowForm(true);
    };

    // =========================================================
    // IMPORTANT:
    // OPEN ORDER FORM FROM MEDICINE RESTOCK BUTTON
    // =========================================================

    useEffect(() => {
        const restockMedicine =
            location.state?.restockMedicine;

        if (!restockMedicine) {
            return;
        }

        const medicineId =
            restockMedicine.medicine_id;

        const supplierId =
            restockMedicine.supplier_id ||
            "";

        const unitPrice = Number(
            restockMedicine.unit_price || 0
        );

        const existingItem = {
            purchase_order_item_id: null,
            medicine_id: medicineId,
            medicine_name:
                restockMedicine.medicine_name ||
                "Selected Medicine",
            quantity: 1,
            unit_price: unitPrice,
            total_price: unitPrice,
            quantity_received: 0,
        };

        setForm({
            supplier_id: supplierId,
            ordered_by: getLoggedInUserId(),
            order_number: generateOrderNumber(),
            order_date: getToday(),
            expected_delivery: "",
            notes: `Restock request for ${
                restockMedicine.medicine_name ||
                "medicine"
            }`,
        });

        setItems([existingItem]);

        setSelectedOrder(null);

        setShowForm(true);

        // Clear the navigation state so refreshing
        // the Orders page does not create another
        // restock form.
        navigate(location.pathname, {
            replace: true,
            state: {},
        });
    }, [location.state]);

    // =========================================================
    // FORM CHANGE
    // =========================================================

    const handleFormChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =========================================================
    // ADD MEDICINE TO ORDER
    // =========================================================

    const handleAddItem = () => {
        setItems((previous) => [
            ...previous,
            {
                purchase_order_item_id: null,
                medicine_id: "",
                medicine_name: "",
                quantity: 1,
                unit_price: 0,
                total_price: 0,
                quantity_received: 0,
            },
        ]);
    };

    // =========================================================
    // CHANGE ORDER ITEM
    // =========================================================

    const handleItemChange = (
        index,
        field,
        value
    ) => {
        setItems((previous) => {
            const updated = [...previous];

            const item = {
                ...updated[index],
            };

            if (field === "medicine_id") {
                const medicine =
                    medicines.find(
                        (med) =>
                            String(
                                med.medicine_id
                            ) === String(value)
                    );

                item.medicine_id = value;

                item.medicine_name =
                    medicine?.medicine_name ||
                    "";

                item.unit_price = Number(
                    medicine?.unit_price || 0
                );

                item.quantity = Number(
                    item.quantity || 1
                );

                item.total_price =
                    item.quantity *
                    item.unit_price;
            }

            if (field === "quantity") {
                item.quantity = Number(value);

                item.total_price =
                    Number(value || 0) *
                    Number(
                        item.unit_price || 0
                    );
            }

            if (field === "unit_price") {
                item.unit_price =
                    Number(value);

                item.total_price =
                    Number(
                        item.quantity || 0
                    ) *
                    Number(value || 0);
            }

            updated[index] = item;

            return updated;
        });
    };

    // =========================================================
    // REMOVE ORDER ITEM
    // =========================================================

    const handleRemoveItem = (index) => {
        setItems((previous) =>
            previous.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };

    // =========================================================
    // TOTAL
    // =========================================================

    const totalAmount = useMemo(() => {
        return items.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 0
                ) *
                Number(
                    item.unit_price || 0
                ),
            0
        );
    }, [items]);

    // =========================================================
    // CREATE ORDER
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.supplier_id) {
            alert(
                "Please select a supplier."
            );
            return;
        }

        if (!form.ordered_by) {
            alert(
                "No logged-in user was found. Please log in again."
            );
            return;
        }

        if (!form.order_number.trim()) {
            alert(
                "Order number is required."
            );
            return;
        }

        if (!items.length) {
            alert(
                "Please add at least one medicine."
            );
            return;
        }

        for (const item of items) {
            if (!item.medicine_id) {
                alert(
                    "Please select a medicine for every order item."
                );
                return;
            }

            if (
                !item.quantity ||
                Number(item.quantity) <= 0
            ) {
                alert(
                    "Every medicine must have a quantity greater than zero."
                );
                return;
            }

            if (
                item.unit_price === undefined ||
                Number(item.unit_price) < 0
            ) {
                alert(
                    "Every medicine must have a valid unit price."
                );
                return;
            }
        }

        try {
            setSaving(true);

            const payload = {
                supplier_id:
                    Number(form.supplier_id),

                ordered_by:
                    Number(form.ordered_by),

                order_number:
                    form.order_number.trim(),

                order_date:
                    form.order_date || null,

                expected_delivery:
                    form.expected_delivery ||
                    null,

                notes:
                    form.notes.trim() ||
                    null,

                items: items.map(
                    (item) => ({
                        medicine_id:
                            Number(
                                item.medicine_id
                            ),

                        quantity:
                            Number(
                                item.quantity
                            ),

                        unit_price:
                            Number(
                                item.unit_price
                            ),
                    })
                ),
            };

            const response =
                await fetch(
                    `${API_URL}/orders`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify(
                                payload
                            ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        "Failed to create purchase order"
                );
            }

            alert(
                "Purchase order created successfully."
            );

            setShowForm(false);

            resetForm();

            await fetchOrders();
        } catch (error) {
            console.error(
                "Create order error:",
                error
            );

            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // VIEW ORDER
    // =========================================================

    const handleViewOrder = async (order) => {
        try {
            setSelectedOrder(order);

            const response =
                await fetch(
                    `${API_URL}/orders/${order.purchase_order_id}`
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        "Failed to fetch order details"
                );
            }

            setSelectedOrderDetails(data);
        } catch (error) {
            console.error(
                "View order error:",
                error
            );

            alert(error.message);
        }
    };

    // =========================================================
    // CLOSE DETAILS
    // =========================================================

    const handleCloseDetails = () => {
        setSelectedOrder(null);
        setSelectedOrderDetails(null);
    };

    // =========================================================
    // RECEIVE ORDER
    // =========================================================

    const handleReceiveOrder = async () => {
        if (!selectedOrderDetails) {
            return;
        }

        const order =
            selectedOrderDetails.order;

        const orderItems =
            selectedOrderDetails.items || [];

        const receivingItems =
            orderItems
                .filter(
                    (item) =>
                        Number(
                            item.quantity_received
                        ) <
                        Number(
                            item.quantity
                        )
                )
                .map((item) => ({
                    purchase_order_item_id:
                        item.purchase_order_item_id,

                    quantity_received:
                        Number(
                            item.quantity
                        ) -
                        Number(
                            item.quantity_received
                        ),
                }));

        if (!receivingItems.length) {
            alert(
                "This order has already been fully received."
            );
            return;
        }

        const confirmed =
            window.confirm(
                "Receive all remaining quantities for this order?"
            );

        if (!confirmed) {
            return;
        }

        const performedBy =
            getLoggedInUserId();

        if (!performedBy) {
            alert(
                "No logged-in user was found."
            );
            return;
        }

        try {
            setSaving(true);

            const response =
                await fetch(
                    `${API_URL}/orders/${order.purchase_order_id}/receive`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify({
                                performed_by:
                                    Number(
                                        performedBy
                                    ),

                                items:
                                    receivingItems,

                                actual_delivery_date:
                                    getToday(),
                            }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        "Failed to receive order"
                );
            }

            alert(
                "Order received and medicine stock updated successfully."
            );

            await fetchOrders();

            await handleViewOrder(
                order
            );
        } catch (error) {
            console.error(
                "Receive order error:",
                error
            );

            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // DELETE ORDER
    // =========================================================

    const handleDeleteOrder = async (
        order
    ) => {
        const confirmed =
            window.confirm(
                `Are you sure you want to delete order ${order.order_number}?`
            );

        if (!confirmed) {
            return;
        }

        try {
            const response =
                await fetch(
                    `${API_URL}/orders/${order.purchase_order_id}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        "Failed to delete order"
                );
            }

            alert(
                "Order deleted successfully."
            );

            if (
                selectedOrder?.purchase_order_id ===
                order.purchase_order_id
            ) {
                handleCloseDetails();
            }

            await fetchOrders();
        } catch (error) {
            console.error(
                "Delete order error:",
                error
            );

            alert(error.message);
        }
    };

    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (
        status
    ) => {
        switch (status) {
            case "Received":
            case "Completed":
                return "bg-emerald-100 text-emerald-700";

            case "Partially Received":
                return "bg-yellow-100 text-yellow-700";

            case "Cancelled":
                return "bg-red-100 text-red-700";

            case "Pending":
            default:
                return "bg-blue-100 text-blue-700";
        }
    };

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (
        date
    ) => {
        if (!date) {
            return "—";
        }

        const parsed =
            new Date(date);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return date;
        }

        return parsed.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =========================================================
    // FORMAT MONEY
    // =========================================================

    const formatMoney = (
        value
    ) => {
        return `R ${Number(
            value || 0
        ).toLocaleString(
            "en-ZA",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    // =========================================================
    // FILTER ORDERS
    // =========================================================

    const filteredOrders =
        useMemo(() => {
            const searchValue =
                search
                    .toLowerCase()
                    .trim();

            return orders.filter(
                (order) => {
                    const matchesSearch =
                        !searchValue ||
                        order.order_number
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        order.supplier_name
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        order.ordered_by_name
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            );

                    const matchesStatus =
                        !statusFilter ||
                        order.order_status ===
                            statusFilter;

                    const matchesSupplier =
                        !supplierFilter ||
                        String(
                            order.supplier_id
                        ) ===
                            String(
                                supplierFilter
                            );

                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesSupplier
                    );
                }
            );
        }, [
            orders,
            search,
            statusFilter,
            supplierFilter,
        ]);

    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredOrders.length /
                    itemsPerPage
            )
        );

    const displayedOrders =
        filteredOrders.slice(
            (currentPage - 1) *
                itemsPerPage,

            currentPage *
                itemsPerPage
        );

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        statusFilter,
        supplierFilter,
    ]);

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="min-h-screen bg-[#f8faff] text-[#17233c]">

            <div
                className={`min-h-screen transition-all duration-200 ${
                    selectedOrder ||
                    showForm
                        ? "pr-[390px]"
                        : ""
                }`}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="px-7 pt-7">

                    <div className="mb-5 flex items-start justify-between">

                        <div>
                            <h1 className="text-[20px] font-bold tracking-[-0.2px]">
                                Purchase Orders
                            </h1>

                            <p className="mt-1 text-[11px] text-[#69758b]">
                                Create, manage and receive medicine purchase orders.
                            </p>
                        </div>

                        <button
                            onClick={
                                handleAddOrder
                            }
                            className="flex items-center gap-2 rounded-[7px] bg-[#00549a] px-4 py-2 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#00447e]"
                        >
                            <span className="text-[16px] leading-none">
                                +
                            </span>

                            New Order
                        </button>
                    </div>

                    {/* =================================================
                        FILTERS
                    ================================================= */}

                    <div className="rounded-[8px] border border-[#dfe5ef] bg-white px-3 py-3">

                        <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-2">

                            <div className="relative">

                                <SearchIcon />

                                <input
                                    value={
                                        search
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSearch(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="Search order number, supplier..."
                                    className="h-[34px] w-full rounded-[5px] border border-[#d6deeb] pl-8 pr-3 text-[11px] outline-none focus:border-[#00549a]"
                                />
                            </div>

                            <div className="relative">

                                <select
                                    value={
                                        supplierFilter
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSupplierFilter(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="h-[34px] w-full appearance-none rounded-[5px] border border-[#d6deeb] bg-white px-3 text-[11px] outline-none focus:border-[#00549a]"
                                >
                                    <option value="">
                                        All Suppliers
                                    </option>

                                    {suppliers.map(
                                        (
                                            supplier
                                        ) => (
                                            <option
                                                key={
                                                    supplier.supplier_id
                                                }
                                                value={
                                                    supplier.supplier_id
                                                }
                                            >
                                                {
                                                    supplier.supplier_name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                <ChevronDown />
                            </div>

                            <div className="relative">

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setStatusFilter(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="h-[34px] w-full appearance-none rounded-[5px] border border-[#d6deeb] bg-white px-3 text-[11px] outline-none focus:border-[#00549a]"
                                >
                                    <option value="">
                                        All Statuses
                                    </option>

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Partially Received">
                                        Partially Received
                                    </option>

                                    <option value="Received">
                                        Received
                                    </option>

                                    <option value="Completed">
                                        Completed
                                    </option>

                                    <option value="Cancelled">
                                        Cancelled
                                    </option>
                                </select>

                                <ChevronDown />
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="px-7 pt-4">

                    <div className="overflow-hidden rounded-[8px] border border-[#dce3ee] bg-white">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[850px] border-collapse">

                                <thead>

                                    <tr className="border-b border-[#e2e7ef] bg-[#f8faff]">

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Order Number
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Supplier
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Order Date
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Expected Delivery
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Total
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Status
                                        </th>

                                        <th className="px-3 py-3 text-center text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-16 text-center text-[11px] text-[#7b8799]"
                                            >
                                                Loading orders...
                                            </td>
                                        </tr>
                                    ) : displayedOrders.length ===
                                      0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-16 text-center"
                                            >
                                                <div className="text-[13px] font-medium text-[#475467]">
                                                    No orders found
                                                </div>

                                                <div className="mt-1 text-[11px] text-[#98a2b3]">
                                                    Create a new purchase order to get started.
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        displayedOrders.map(
                                            (
                                                order
                                            ) => (
                                                <tr
                                                    key={
                                                        order.purchase_order_id
                                                    }
                                                    onClick={() =>
                                                        handleViewOrder(
                                                            order
                                                        )
                                                    }
                                                    className="cursor-pointer border-b border-[#e7ebf1] transition hover:bg-[#f8fbff]"
                                                >

                                                    <td className="px-3 py-3">

                                                        <div className="flex items-center gap-2">

                                                            <div className="flex h-[27px] w-[27px] items-center justify-center rounded-[5px] bg-[#eaf3ff] text-[#00549a]">
                                                                <OrderIcon />
                                                            </div>

                                                            <span className="text-[10px] font-semibold text-[#26344d]">
                                                                {
                                                                    order.order_number
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-3 py-3 text-[9px] text-[#5f6b7f]">
                                                        {
                                                            order.supplier_name ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td className="px-3 py-3 text-[9px] text-[#5f6b7f]">
                                                        {formatDate(
                                                            order.order_date
                                                        )}
                                                    </td>

                                                    <td className="px-3 py-3 text-[9px] text-[#5f6b7f]">
                                                        {formatDate(
                                                            order.expected_delivery
                                                        )}
                                                    </td>

                                                    <td className="px-3 py-3 text-[9px] font-semibold text-[#344054]">
                                                        {formatMoney(
                                                            order.total_amount
                                                        )}
                                                    </td>

                                                    <td className="px-3 py-3">

                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-1 text-[8px] font-semibold ${getStatusClass(
                                                                order.order_status
                                                            )}`}
                                                        >
                                                            {
                                                                order.order_status
                                                            }
                                                        </span>
                                                    </td>

                                                    <td
                                                        className="px-3 py-3"
                                                        onClick={(
                                                            e
                                                        ) =>
                                                            e.stopPropagation()
                                                        }
                                                    >

                                                        <div className="flex items-center justify-center gap-3">

                                                            <button
                                                                title="View Order"
                                                                onClick={() =>
                                                                    handleViewOrder(
                                                                        order
                                                                    )
                                                                }
                                                                className="text-[#00549a] hover:text-[#003d70]"
                                                            >
                                                                <EyeIcon />
                                                            </button>

                                                            <button
                                                                title="Delete Order"
                                                                onClick={() =>
                                                                    handleDeleteOrder(
                                                                        order
                                                                    )
                                                                }
                                                                className="text-[#ef4444] hover:text-[#b91c1c]"
                                                            >
                                                                <TrashIcon />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        <div className="flex items-center justify-between border-t border-[#e3e8ef] px-3 py-2.5">

                            <span className="text-[9px] text-[#68758a]">
                                Showing{" "}
                                {filteredOrders.length ===
                                0
                                    ? 0
                                    : (currentPage -
                                          1) *
                                          itemsPerPage +
                                      1}{" "}
                                to{" "}
                                {Math.min(
                                    currentPage *
                                        itemsPerPage,
                                    filteredOrders.length
                                )}{" "}
                                of{" "}
                                {
                                    filteredOrders.length
                                }{" "}
                                entries
                            </span>

                            <div className="flex items-center gap-1">

                                <button
                                    disabled={
                                        currentPage ===
                                        1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (
                                                page
                                            ) =>
                                                Math.max(
                                                    1,
                                                    page -
                                                        1
                                                )
                                        )
                                    }
                                    className="flex h-[24px] w-[24px] items-center justify-center rounded border border-[#e1e6ed] text-[#667085] disabled:opacity-40"
                                >
                                    ‹
                                </button>

                                {Array.from(
                                    {
                                        length:
                                            Math.min(
                                                totalPages,
                                                3
                                            ),
                                    },
                                    (
                                        _,
                                        index
                                    ) =>
                                        index +
                                        1
                                ).map(
                                    (
                                        page
                                    ) => (
                                        <button
                                            key={
                                                page
                                            }
                                            onClick={() =>
                                                setCurrentPage(
                                                    page
                                                )
                                            }
                                            className={`flex h-[24px] w-[24px] items-center justify-center rounded text-[9px] ${
                                                currentPage ===
                                                page
                                                    ? "bg-[#00549a] text-white"
                                                    : "border border-[#e1e6ed] bg-white text-[#667085]"
                                            }`}
                                        >
                                            {
                                                page
                                            }
                                        </button>
                                    )
                                )}

                                <button
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (
                                                page
                                            ) =>
                                                Math.min(
                                                    totalPages,
                                                    page +
                                                        1
                                                )
                                        )
                                    }
                                    className="flex h-[24px] w-[24px] items-center justify-center rounded border border-[#e1e6ed] text-[#667085] disabled:opacity-40"
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="flex items-center justify-between px-7 py-5 text-[8px] text-[#8a94a5]">

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

            {/* =========================================================
                ORDER DETAILS PANEL
            ========================================================= */}

            {selectedOrder &&
                !showForm && (
                    <div className="fixed right-0 top-0 z-40 flex h-screen w-[390px] flex-col border-l border-[#dfe5ee] bg-white shadow-[-5px_0_20px_rgba(0,0,0,0.05)]">

                        <div className="flex items-center justify-between border-b border-[#e3e8ef] px-4 py-4">

                            <div>
                                <h2 className="text-[13px] font-bold text-[#17233c]">
                                    Order Details
                                </h2>

                                <p className="mt-1 text-[9px] text-[#7b8799]">
                                    {
                                        selectedOrder.order_number
                                    }
                                </p>
                            </div>

                            <button
                                onClick={
                                    handleCloseDetails
                                }
                                className="text-[#667085] hover:text-[#17233c]"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-4">

                            <div className="grid grid-cols-2 gap-2">

                                <InfoBox
                                    label="ORDER NUMBER"
                                    value={
                                        selectedOrder.order_number
                                    }
                                />

                                <InfoBox
                                    label="STATUS"
                                    value={
                                        selectedOrder.order_status
                                    }
                                />

                                <InfoBox
                                    label="SUPPLIER"
                                    value={
                                        selectedOrder.supplier_name ||
                                        "—"
                                    }
                                />

                                <InfoBox
                                    label="ORDERED BY"
                                    value={
                                        selectedOrder.ordered_by_name ||
                                        "—"
                                    }
                                />

                                <InfoBox
                                    label="ORDER DATE"
                                    value={formatDate(
                                        selectedOrder.order_date
                                    )}
                                />

                                <InfoBox
                                    label="EXPECTED"
                                    value={formatDate(
                                        selectedOrder.expected_delivery
                                    )}
                                />

                                <InfoBox
                                    label="TOTAL"
                                    value={formatMoney(
                                        selectedOrder.total_amount
                                    )}
                                />

                                <InfoBox
                                    label="DELIVERED"
                                    value={formatDate(
                                        selectedOrder.actual_delivery_date
                                    )}
                                />
                            </div>

                            <div className="mt-5">

                                <div className="mb-3 flex items-center">

                                    <h3 className="text-[11px] font-bold text-[#26344d]">
                                        Order Items
                                    </h3>

                                    <div className="ml-3 h-px flex-1 bg-[#e0e5ed]" />
                                </div>

                                {!selectedOrderDetails ? (
                                    <div className="py-6 text-center text-[10px] text-[#7b8799]">
                                        Loading order items...
                                    </div>
                                ) : (
                                    <div className="space-y-2">

                                        {(
                                            selectedOrderDetails.items ||
                                            []
                                        ).map(
                                            (
                                                item
                                            ) => (
                                                <div
                                                    key={
                                                        item.purchase_order_item_id
                                                    }
                                                    className="rounded-[6px] border border-[#e0e5ef] bg-[#f9fbfe] p-3"
                                                >

                                                    <div className="flex items-start justify-between">

                                                        <div>
                                                            <p className="text-[10px] font-semibold text-[#344054]">
                                                                {
                                                                    item.medicine_name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-[8px] text-[#7b8799]">
                                                                Ordered:{" "}
                                                                {
                                                                    item.quantity
                                                                }{" "}
                                                                units
                                                            </p>

                                                            <p className="text-[8px] text-[#7b8799]">
                                                                Received:{" "}
                                                                {
                                                                    item.quantity_received
                                                                }{" "}
                                                                units
                                                            </p>
                                                        </div>

                                                        <div className="text-right">

                                                            <p className="text-[9px] font-semibold text-[#344054]">
                                                                {formatMoney(
                                                                    item.total_price
                                                                )}
                                                            </p>

                                                            <p className="text-[8px] text-[#7b8799]">
                                                                {formatMoney(
                                                                    item.unit_price
                                                                )}{" "}
                                                                / unit
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {selectedOrder.notes && (
                                <div className="mt-5">

                                    <p className="text-[8px] font-semibold uppercase tracking-[0.3px] text-[#8a94a5]">
                                        Notes
                                    </p>

                                    <p className="mt-1 rounded-[6px] bg-[#f5f7fa] p-3 text-[9px] leading-[15px] text-[#475467]">
                                        {
                                            selectedOrder.notes
                                        }
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-[#dfe5ee] bg-white p-3">

                            <div className="flex gap-2">

                                {selectedOrder.order_status !==
                                    "Received" &&
                                    selectedOrder.order_status !==
                                        "Completed" && (
                                        <button
                                            disabled={
                                                saving
                                            }
                                            onClick={
                                                handleReceiveOrder
                                            }
                                            className="flex-1 rounded-[6px] bg-[#00549a] py-2 text-[9px] font-semibold text-white hover:bg-[#00447e] disabled:opacity-50"
                                        >
                                            {saving
                                                ? "Receiving..."
                                                : "Receive Order"}
                                        </button>
                                    )}

                                <button
                                    onClick={
                                        handleCloseDetails
                                    }
                                    className="rounded-[6px] bg-[#eef1f5] px-5 py-2 text-[9px] font-semibold text-[#475467] hover:bg-[#e2e6ec]"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {/* =========================================================
                CREATE ORDER PANEL
            ========================================================= */}

            {showForm && (
                <div className="fixed right-0 top-0 z-50 flex h-screen w-[390px] flex-col border-l border-[#dfe5ee] bg-white shadow-[-5px_0_20px_rgba(0,0,0,0.05)]">

                    <div className="flex items-center justify-between border-b border-[#e3e8ef] px-5 py-4">

                        <div>
                            <h2 className="text-[13px] font-bold text-[#17233c]">
                                Create Purchase Order
                            </h2>

                            <p className="mt-1 text-[9px] text-[#7b8799]">
                                Add medicines to the purchase order.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setShowForm(
                                    false
                                );
                                resetForm();
                            }}
                            className="text-[#667085] hover:text-[#17233c]"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-4">

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-3"
                        >

                            <Input
                                label="Order Number"
                                name="order_number"
                                value={
                                    form.order_number
                                }
                                onChange={
                                    handleFormChange
                                }
                                required
                            />

                            <Select
                                label="Supplier"
                                name="supplier_id"
                                value={
                                    form.supplier_id
                                }
                                onChange={
                                    handleFormChange
                                }
                                options={suppliers.map(
                                    (
                                        supplier
                                    ) => ({
                                        value:
                                            supplier.supplier_id,
                                        label:
                                            supplier.supplier_name,
                                    })
                                )}
                            />

                            <div className="grid grid-cols-2 gap-3">

                                <Input
                                    label="Order Date"
                                    name="order_date"
                                    type="date"
                                    value={
                                        form.order_date
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                />

                                <Input
                                    label="Expected Delivery"
                                    name="expected_delivery"
                                    type="date"
                                    value={
                                        form.expected_delivery
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                />
                            </div>

                            {/* =================================================
                                ORDER ITEMS
                            ================================================= */}

                            <div className="pt-2">

                                <div className="mb-2 flex items-center justify-between">

                                    <label className="text-[10px] font-semibold text-[#344054]">
                                        Medicines
                                    </label>

                                    <button
                                        type="button"
                                        onClick={
                                            handleAddItem
                                        }
                                        className="text-[9px] font-semibold text-[#00549a] hover:underline"
                                    >
                                        + Add Medicine
                                    </button>
                                </div>

                                <div className="space-y-2">

                                    {items.length ===
                                    0 ? (
                                        <div className="rounded-[6px] border border-dashed border-[#ccd5e2] p-4 text-center">

                                            <p className="text-[9px] text-[#7b8799]">
                                                No medicines added.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={
                                                    handleAddItem
                                                }
                                                className="mt-2 text-[9px] font-semibold text-[#00549a]"
                                            >
                                                Add Medicine
                                            </button>
                                        </div>
                                    ) : (
                                        items.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="rounded-[6px] border border-[#dfe5ef] bg-[#f9fbfe] p-3"
                                                >

                                                    <div className="mb-2 flex items-center justify-between">

                                                        <span className="text-[9px] font-semibold text-[#344054]">
                                                            Medicine{" "}
                                                            {index +
                                                                1}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveItem(
                                                                    index
                                                                )
                                                            }
                                                            className="text-[9px] font-medium text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>

                                                    <select
                                                        value={
                                                            item.medicine_id
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleItemChange(
                                                                index,
                                                                "medicine_id",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        className="mb-2 h-[32px] w-full rounded-[5px] border border-[#d6deeb] bg-white px-3 text-[10px] outline-none focus:border-[#00549a]"
                                                    >
                                                        <option value="">
                                                            Select Medicine
                                                        </option>

                                                        {medicines.map(
                                                            (
                                                                medicine
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        medicine.medicine_id
                                                                    }
                                                                    value={
                                                                        medicine.medicine_id
                                                                    }
                                                                >
                                                                    {
                                                                        medicine.medicine_name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>

                                                    <div className="grid grid-cols-2 gap-2">

                                                        <div>
                                                            <label className="mb-1 block text-[8px] font-semibold text-[#667085]">
                                                                Quantity
                                                            </label>

                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={
                                                                    item.quantity
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handleItemChange(
                                                                        index,
                                                                        "quantity",
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className="h-[30px] w-full rounded-[5px] border border-[#d6deeb] px-2 text-[9px] outline-none focus:border-[#00549a]"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="mb-1 block text-[8px] font-semibold text-[#667085]">
                                                                Unit Price
                                                            </label>

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={
                                                                    item.unit_price
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handleItemChange(
                                                                        index,
                                                                        "unit_price",
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className="h-[30px] w-full rounded-[5px] border border-[#d6deeb] px-2 text-[9px] outline-none focus:border-[#00549a]"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 flex justify-between border-t border-[#e7ebf1] pt-2">

                                                        <span className="text-[8px] text-[#7b8799]">
                                                            Item Total
                                                        </span>

                                                        <span className="text-[9px] font-semibold text-[#344054]">
                                                            {formatMoney(
                                                                Number(
                                                                    item.quantity ||
                                                                        0
                                                                ) *
                                                                    Number(
                                                                        item.unit_price ||
                                                                            0
                                                                    )
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            </div>

                            {/* =================================================
                                TOTAL
                            ================================================= */}

                            <div className="rounded-[6px] bg-[#edf4ff] px-3 py-3">

                                <div className="flex items-center justify-between">

                                    <span className="text-[9px] font-semibold text-[#475467]">
                                        Order Total
                                    </span>

                                    <span className="text-[13px] font-bold text-[#00549a]">
                                        {formatMoney(
                                            totalAmount
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* =================================================
                                NOTES
                            ================================================= */}

                            <div>

                                <label className="mb-1 block text-[10px] font-semibold text-[#344054]">
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={
                                        form.notes
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    rows="3"
                                    className="w-full resize-none rounded-[5px] border border-[#d6deeb] px-3 py-2 text-[10px] outline-none focus:border-[#00549a]"
                                />
                            </div>

                            {/* =================================================
                                BUTTONS
                            ================================================= */}

                            <div className="flex gap-2 pt-3">

                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="flex-1 rounded-[6px] bg-[#00549a] py-2.5 text-[10px] font-semibold text-white hover:bg-[#00447e] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving
                                        ? "Creating..."
                                        : "Create Purchase Order"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(
                                            false
                                        );
                                        resetForm();
                                    }}
                                    className="rounded-[6px] bg-[#eef1f5] px-5 py-2.5 text-[10px] font-semibold text-[#475467] hover:bg-[#e2e6ec]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// =============================================================
// INPUT
// =============================================================

const Input = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    ...props
}) => (
    <div>
        <label className="mb-1 block text-[10px] font-semibold text-[#344054]">
            {label}
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            {...props}
            className="h-[32px] w-full rounded-[5px] border border-[#d6deeb] px-3 text-[10px] outline-none transition focus:border-[#00549a] focus:ring-1 focus:ring-[#00549a]/10"
        />
    </div>
);

// =============================================================
// SELECT
// =============================================================

const Select = ({
    label,
    name,
    value,
    onChange,
    options,
}) => (
    <div>
        <label className="mb-1 block text-[10px] font-semibold text-[#344054]">
            {label}
        </label>

        <select
            name={name}
            value={value}
            onChange={onChange}
            className="h-[32px] w-full rounded-[5px] border border-[#d6deeb] bg-white px-3 text-[10px] outline-none focus:border-[#00549a]"
        >
            <option value="">
                Select {label}
            </option>

            {options.map(
                (option) => (
                    <option
                        key={
                            option.value
                        }
                        value={
                            option.value
                        }
                    >
                        {
                            option.label
                        }
                    </option>
                )
            )}
        </select>
    </div>
);

// =============================================================
// INFO BOX
// =============================================================

const InfoBox = ({
    label,
    value,
}) => (
    <div className="rounded-[6px] border border-[#dfe5ef] bg-[#f9fbfe] px-2.5 py-2">

        <p className="text-[7px] font-semibold uppercase text-[#7b8799]">
            {label}
        </p>

        <p className="mt-1 truncate text-[9px] font-semibold text-[#344054]">
            {value || "—"}
        </p>
    </div>
);

// =============================================================
// ICONS
// =============================================================

const SearchIcon = () => (
    <svg
        className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#8995a8]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle
            cx="11"
            cy="11"
            r="7"
        />

        <path d="m20 20-4-4" />
    </svg>
);

const ChevronDown = () => (
    <svg
        className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#8a94a5]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const OrderIcon = () => (
    <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
    >
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M15 3v4h4" />
        <path d="M9 12h6M9 16h6" />
    </svg>
);

const EyeIcon = () => (
    <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle
            cx="12"
            cy="12"
            r="3"
        />
    </svg>
);

const TrashIcon = () => (
    <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 15H6L5 6" />
        <path d="M10 11v6M14 11v6" />
    </svg>
);

const CloseIcon = () => (
    <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

export default Orders;