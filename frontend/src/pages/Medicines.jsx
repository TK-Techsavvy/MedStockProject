import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

const Medicines = () => {
    const navigate = useNavigate();

    const { user } = useAuth();

    const [medicines, setMedicines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [locations, setLocations] = useState([]);

    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("");
    const [showMoreFilters, setShowMoreFilters] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 4;

    // =========================================================
    // FORM
    // =========================================================

    const emptyForm = {
        category_id: "",
        supplier_id: "",
        location_id: "",
        medicine_name: "",
        generic_name: "",
        brand_name: "",
        dosage: "",
        dosage_form: "",
        strength: "",
        barcode: "",
        unit_price: "",
        reorder_level: "",
        quantity: "",
        description: "",
        requires_prescription: false,
        status: "Active",
        sku: "",
        manufacturer: "",
        medicine_image: "",
        storage_condition: "",
    };

    const [form, setForm] = useState(emptyForm);

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
                Array.isArray(data) ? data : []
            );

        } catch (error) {
            console.error(
                "Error fetching medicines:",
                error
            );
        }
    };

    // =========================================================
    // FETCH CATEGORIES
    // =========================================================

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${API_URL}/medicine/categories`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch categories"
                );
            }

            const data = await response.json();

            setCategories(
                Array.isArray(data) ? data : []
            );

        } catch (error) {
            console.error(
                "Error fetching categories:",
                error
            );
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
                Array.isArray(data) ? data : []
            );

        } catch (error) {
            console.error(
                "Error fetching suppliers:",
                error
            );
        }
    };

    // =========================================================
    // FETCH LOCATIONS
    // =========================================================

    const fetchLocations = async () => {
        try {
            const response = await fetch(
                `${API_URL}/medicine/locations`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch locations"
                );
            }

            const data = await response.json();

            setLocations(
                Array.isArray(data) ? data : []
            );

        } catch (error) {
            console.error(
                "Error fetching locations:",
                error
            );
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchMedicines();
        fetchCategories();
        fetchSuppliers();
        fetchLocations();
    }, []);

    // =========================================================
    // FORM CHANGE
    // =========================================================

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setForm((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // =========================================================
    // RESET FORM
    // =========================================================

    const resetForm = () => {
        setEditingId(null);

        setForm({
            ...emptyForm,
        });
    };

    // =========================================================
    // ADD MEDICINE
    // =========================================================

    const handleAdd = () => {
        resetForm();

        setSelectedMedicine(null);

        setShowForm(true);
    };

    // =========================================================
    // EDIT MEDICINE
    // =========================================================

    const handleEdit = (medicine) => {
        setEditingId(
            medicine.medicine_id
        );

        setForm({
            category_id:
                medicine.category_id ?? "",

            supplier_id:
                medicine.supplier_id ?? "",

            location_id:
                medicine.location_id ?? "",

            medicine_name:
                medicine.medicine_name ?? "",

            generic_name:
                medicine.generic_name ?? "",

            brand_name:
                medicine.brand_name ?? "",

            dosage:
                medicine.dosage ?? "",

            dosage_form:
                medicine.dosage_form ?? "",

            strength:
                medicine.strength ?? "",

            barcode:
                medicine.barcode ?? "",

            unit_price:
                medicine.unit_price ?? "",

            reorder_level:
                medicine.reorder_level ?? "",

            quantity:
                medicine.quantity ??
                medicine.stock_quantity ??
                medicine.current_stock ??
                medicine.stock_level ??
                0,

            description:
                medicine.description ?? "",

            requires_prescription:
                medicine.requires_prescription ??
                false,

            status:
                medicine.status ??
                "Active",

            sku:
                medicine.sku ?? "",

            manufacturer:
                medicine.manufacturer ?? "",

            medicine_image:
                medicine.medicine_image ?? "",

            storage_condition:
                medicine.storage_condition ?? "",
        });

        setSelectedMedicine(null);

        setShowForm(true);
    };

    // =========================================================
    // ADD / UPDATE MEDICINE
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const medicineData = {
                ...form,

                category_id:
                    form.category_id
                        ? Number(form.category_id)
                        : null,

                supplier_id:
                    form.supplier_id
                        ? Number(form.supplier_id)
                        : null,

                location_id:
                    form.location_id
                        ? Number(form.location_id)
                        : null,

                unit_price:
                    form.unit_price === ""
                        ? 0
                        : Number(form.unit_price),

                reorder_level:
                    form.reorder_level === ""
                        ? 0
                        : Number(form.reorder_level),

                quantity:
                    form.quantity === ""
                        ? 0
                        : Number(form.quantity),
            };

            const url = editingId
                ? `${API_URL}/medicine/${editingId}`
                : `${API_URL}/medicine`;

            const method = editingId
                ? "PUT"
                : "POST";

            const response = await fetch(
                url,
                {
                    method,

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(
                        medicineData
                    ),
                }
            );

            let data = {};

            try {
                data =
                    await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Failed to save medicine"
                );
            }

            alert(
                editingId
                    ? "Medicine updated successfully."
                    : "Medicine added successfully."
            );

            await fetchMedicines();

            resetForm();

            setShowForm(false);

            setSelectedMedicine(null);

        } catch (error) {
            console.error(
                "Save medicine error:",
                error
            );

            alert(
                error.message ||
                "Failed to save medicine."
            );
        }
    };

    // =========================================================
    // DELETE MEDICINE
    // =========================================================

    const handleDelete = async (
        medicineId
    ) => {
        if (!medicineId) {
            alert(
                "Invalid medicine."
            );

            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this medicine?\n\nThis action cannot be undone."
            );

        if (!confirmed) {
            return;
        }

        try {
            const response =
                await fetch(
                    `${API_URL}/medicine/${medicineId}`,
                    {
                        method: "DELETE",
                    }
                );

            let data = {};

            try {
                data =
                    await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Failed to delete medicine"
                );
            }

            alert(
                "Medicine deleted successfully."
            );

            setSelectedMedicine(null);

            await fetchMedicines();

        } catch (error) {
            console.error(
                "Delete medicine error:",
                error
            );

            alert(
                error.message ||
                "Failed to delete medicine."
            );
        }
    };

    // =========================================================
    // QUANTITY
    // =========================================================

    const getQuantity = (
        medicine
    ) => {
        const quantity =
            medicine.quantity ??
            medicine.stock_quantity ??
            medicine.current_stock ??
            medicine.stock_level ??
            0;

        const number =
            Number(quantity);

        return Number.isNaN(number)
            ? 0
            : number;
    };

    // =========================================================
    // EXPIRY
    // =========================================================

    const getExpiryDate = (
        medicine
    ) => {
        return (
            medicine.expiry_date ??
            medicine.expiration_date ??
            medicine.expiryDate ??
            null
        );
    };

    // =========================================================
    // DATE FORMAT
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
    // EXPIRED
    // =========================================================

    const isExpired = (
        date
    ) => {
        if (!date) {
            return false;
        }

        const expiry =
            new Date(date);

        const today =
            new Date();

        return expiry < today;
    };

    // =========================================================
    // LOW STOCK
    // =========================================================

    const isLowStock = (
        medicine
    ) => {
        const quantity =
            getQuantity(
                medicine
            );

        const reorderLevel =
            Number(
                medicine.reorder_level ??
                0
            );

        if (
            reorderLevel > 0
        ) {
            return (
                quantity <=
                reorderLevel
            );
        }

        return quantity <= 20;
    };

    // =========================================================
    // STOCK CLASS
    // =========================================================

    const getStockClass = (
        medicine
    ) => {
        const quantity =
            getQuantity(
                medicine
            );

        const reorderLevel =
            Number(
                medicine.reorder_level ??
                0
            );

        if (
            reorderLevel > 0 &&
            quantity <=
                reorderLevel
        ) {
            return "bg-red-100 text-red-600";
        }

        if (
            quantity <= 20
        ) {
            return "bg-red-100 text-red-600";
        }

        if (
            quantity <= 50
        ) {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-emerald-100 text-emerald-600";
    };

    // =========================================================
    // RESTOCK
    // =========================================================

    const handleRestock = async (
        medicine
    ) => {
        if (!medicine) {
            return;
        }

        // -----------------------------------------------------
        // GET LOGGED-IN USER
        // -----------------------------------------------------

        const orderedBy =
            user?.user_id ??
            user?.userId ??
            user?.id;

        if (!orderedBy) {
            alert(
                "Your logged-in user could not be identified. Please log in again."
            );

            return;
        }

        // -----------------------------------------------------
        // SUPPLIER REQUIRED
        // -----------------------------------------------------

        if (
            !medicine.supplier_id
        ) {
            alert(
                "This medicine does not have a supplier assigned. Please edit the medicine and select a supplier before restocking."
            );

            return;
        }

        // -----------------------------------------------------
        // CURRENT STOCK
        // -----------------------------------------------------

        const currentQuantity =
            getQuantity(
                medicine
            );

        const reorderLevel =
            Number(
                medicine.reorder_level ??
                0
            );

        // -----------------------------------------------------
        // CALCULATE RESTOCK QUANTITY
        //
        // Example:
        // Current stock = 5
        // Reorder level = 20
        // Restock quantity = 15
        //
        // If reorder level is 0, order 1 unit.
        // -----------------------------------------------------

        let restockQuantity;

        if (
            reorderLevel >
            currentQuantity
        ) {
            restockQuantity =
                reorderLevel -
                currentQuantity;
        } else {
            restockQuantity =
                reorderLevel > 0
                    ? reorderLevel
                    : 1;
        }

        if (
            restockQuantity <= 0
        ) {
            restockQuantity = 1;
        }

        // -----------------------------------------------------
        // UNIT PRICE
        // -----------------------------------------------------

        const unitPrice =
            Number(
                medicine.unit_price ??
                0
            );

        // -----------------------------------------------------
        // UNIQUE ORDER NUMBER
        // -----------------------------------------------------

        const orderNumber =
            `RESTOCK-${medicine.medicine_id}-${Date.now()}`;

        // -----------------------------------------------------
        // CREATE ORDER
        // -----------------------------------------------------

        const orderData = {
            supplier_id:
                Number(
                    medicine.supplier_id
                ),

            ordered_by:
                Number(
                    orderedBy
                ),

            order_number:
                orderNumber,

            order_date:
                new Date()
                    .toISOString()
                    .split("T")[0],

            expected_delivery:
                null,

            notes:
                `Automatic restock for ${medicine.medicine_name}. Current stock: ${currentQuantity}. Reorder level: ${reorderLevel}.`,

            items: [
                {
                    medicine_id:
                        Number(
                            medicine.medicine_id
                        ),

                    quantity:
                        Number(
                            restockQuantity
                        ),

                    unit_price:
                        unitPrice,
                },
            ],
        };

        try {
            const response =
                await fetch(
                    `${API_URL}/orders`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(
                            orderData
                        ),
                    }
                );

            let data = {};

            try {
                data =
                    await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Failed to create restock order."
                );
            }

            alert(
                `Restock order created successfully.\n\nMedicine: ${medicine.medicine_name}\nQuantity ordered: ${restockQuantity} units\nOrder: ${orderNumber}`
            );

            // -------------------------------------------------
            // GO TO ORDERS PAGE
            // -------------------------------------------------

            setSelectedMedicine(
                null
            );

            navigate(
                "/orders"
            );

        } catch (error) {
            console.error(
                "Restock order error:",
                error
            );

            alert(
                error.message ||
                "Failed to create restock order."
            );
        }
    };

    // =========================================================
    // FILTER
    // =========================================================

    const filteredMedicines =
        useMemo(() => {
            return medicines.filter(
                (medicine) => {

                    const searchValue =
                        search
                            .toLowerCase()
                            .trim();

                    const matchesSearch =
                        !searchValue ||
                        medicine
                            .medicine_name
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        medicine
                            .generic_name
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        medicine
                            .brand_name
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        medicine
                            .sku
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        medicine
                            .barcode
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            );

                    const matchesCategory =
                        !categoryFilter ||
                        String(
                            medicine.category_id
                        ) ===
                            String(
                                categoryFilter
                            );

                    const matchesSupplier =
                        !supplierFilter ||
                        String(
                            medicine.supplier_id
                        ) ===
                            String(
                                supplierFilter
                            );

                    const quantity =
                        getQuantity(
                            medicine
                        );

                    let matchesStock =
                        true;

                    if (
                        stockFilter ===
                        "critical"
                    ) {
                        matchesStock =
                            quantity <=
                            20;
                    }

                    if (
                        stockFilter ===
                        "low"
                    ) {
                        matchesStock =
                            quantity >
                                20 &&
                            quantity <=
                                50;
                    }

                    if (
                        stockFilter ===
                        "normal"
                    ) {
                        matchesStock =
                            quantity >
                            50;
                    }

                    return (
                        matchesSearch &&
                        matchesCategory &&
                        matchesSupplier &&
                        matchesStock
                    );
                }
            );
        }, [
            medicines,
            search,
            categoryFilter,
            supplierFilter,
            stockFilter,
        ]);

    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredMedicines.length /
                    itemsPerPage
            )
        );

    const displayedMedicines =
        filteredMedicines.slice(
            (currentPage - 1) *
                itemsPerPage,
            currentPage *
                itemsPerPage
        );

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        categoryFilter,
        supplierFilter,
        stockFilter,
    ]);

    // =========================================================
    // PRINT
    // =========================================================

    const handlePrintLabel = () => {
        window.print();
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="min-h-screen bg-[#f8faff] text-[#17233c]">

            <div
                className={`min-h-screen transition-all duration-200 ${
                    selectedMedicine ||
                    showForm
                        ? "pr-[340px]"
                        : ""
                }`}
            >

                {/* HEADER */}

                <div className="px-7 pt-7">

                    <div className="mb-5 flex items-start justify-between">

                        <div>

                            <h1 className="text-[20px] font-bold tracking-[-0.2px] text-[#17233c]">
                                Medicine Management
                            </h1>

                            <p className="mt-1 text-[11px] text-[#69758b]">
                                Manage pharmaceutical stocks,
                                categories, and expiry tracking.
                            </p>

                        </div>

                        <button
                            onClick={
                                handleAdd
                            }
                            className="flex items-center gap-2 rounded-[7px] bg-[#00549a] px-4 py-2 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#00447e]"
                        >
                            <span className="text-[16px] leading-none">
                                +
                            </span>

                            Add Medicine
                        </button>

                    </div>

                    {/* FILTER BAR */}

                    <div className="rounded-[8px] border border-[#dfe5ef] bg-white px-3 py-3 shadow-sm">

                        <div className="grid grid-cols-[1.4fr_0.85fr_0.85fr_0.85fr_auto] gap-2">

                            <div className="relative">

                                <SearchIcon />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Name or Generic..."
                                    className="h-[34px] w-full rounded-[5px] border border-[#d6deeb] bg-white pl-8 pr-3 text-[11px] text-[#344054] outline-none placeholder:text-[#9aa4b4] focus:border-[#00549a]"
                                />

                            </div>

                            <div className="relative">

                                <select
                                    value={
                                        categoryFilter
                                    }
                                    onChange={(e) =>
                                        setCategoryFilter(
                                            e.target.value
                                        )
                                    }
                                    className="h-[34px] w-full appearance-none rounded-[5px] border border-[#d6deeb] bg-white px-3 pr-7 text-[11px] text-[#465269] outline-none focus:border-[#00549a]"
                                >

                                    <option value="">
                                        All Categories
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={
                                                    category.category_id
                                                }
                                                value={
                                                    category.category_id
                                                }
                                            >
                                                {
                                                    category.category_name
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
                                        supplierFilter
                                    }
                                    onChange={(e) =>
                                        setSupplierFilter(
                                            e.target.value
                                        )
                                    }
                                    className="h-[34px] w-full appearance-none rounded-[5px] border border-[#d6deeb] bg-white px-3 pr-7 text-[11px] text-[#465269] outline-none focus:border-[#00549a]"
                                >

                                    <option value="">
                                        All Suppliers
                                    </option>

                                    {suppliers.map(
                                        (supplier) => (
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
                                        stockFilter
                                    }
                                    onChange={(e) =>
                                        setStockFilter(
                                            e.target.value
                                        )
                                    }
                                    className="h-[34px] w-full appearance-none rounded-[5px] border border-[#d6deeb] bg-white px-3 pr-7 text-[11px] text-[#465269] outline-none focus:border-[#00549a]"
                                >

                                    <option value="">
                                        Any Level
                                    </option>

                                    <option value="critical">
                                        Critical Stock
                                    </option>

                                    <option value="low">
                                        Low Stock
                                    </option>

                                    <option value="normal">
                                        Normal Stock
                                    </option>

                                </select>

                                <ChevronDown />

                            </div>

                            <button
                                onClick={() =>
                                    setShowMoreFilters(
                                        !showMoreFilters
                                    )
                                }
                                className={`flex h-[34px] items-center justify-center gap-1 rounded-[5px] border px-3 text-[11px] font-medium ${
                                    showMoreFilters
                                        ? "border-[#00549a] bg-[#f0f6fc] text-[#00549a]"
                                        : "border-[#d6deeb] bg-white text-[#465269]"
                                }`}
                            >

                                <FilterIcon />

                                More

                            </button>

                        </div>

                        {showMoreFilters && (
                            <div className="mt-3 border-t border-[#edf0f5] pt-3">

                                <div className="flex items-center justify-between">

                                    <span className="text-[11px] text-[#69758b]">
                                        Additional medicine filters
                                    </span>

                                    <button
                                        onClick={() => {
                                            setSearch("");
                                            setCategoryFilter("");
                                            setSupplierFilter("");
                                            setStockFilter("");
                                        }}
                                        className="text-[11px] font-medium text-[#00549a] hover:underline"
                                    >
                                        Clear Filters
                                    </button>

                                </div>

                            </div>
                        )}

                    </div>

                </div>

                {/* TABLE */}

                <div className="px-7 pt-4">

                    <div className="overflow-hidden rounded-[8px] border border-[#dce3ee] bg-white">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[750px] border-collapse">

                                <thead>

                                    <tr className="border-b border-[#e2e7ef] bg-[#f8faff]">

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Name
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Generic Name
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Category
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Supplier
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Quantity
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Expiry
                                            <br />
                                            Date
                                        </th>

                                        <th className="px-3 py-3 text-center text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {displayedMedicines.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="px-6 py-16 text-center"
                                            >

                                                <div className="text-[13px] font-medium text-[#475467]">
                                                    No medicines found
                                                </div>

                                                <div className="mt-1 text-[11px] text-[#98a2b3]">
                                                    Try changing your search or filters.
                                                </div>

                                            </td>

                                        </tr>

                                    ) : (

                                        displayedMedicines.map(
                                            (medicine) => {

                                                const quantity =
                                                    getQuantity(
                                                        medicine
                                                    );

                                                const expiry =
                                                    getExpiryDate(
                                                        medicine
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            medicine.medicine_id
                                                        }
                                                        onClick={() =>
                                                            setSelectedMedicine(
                                                                medicine
                                                            )
                                                        }
                                                        className={`cursor-pointer border-b border-[#e7ebf1] transition hover:bg-[#f8fbff] ${
                                                            selectedMedicine?.medicine_id ===
                                                            medicine.medicine_id
                                                                ? "bg-[#f2f7fc]"
                                                                : ""
                                                        }`}
                                                    >

                                                        <td className="px-3 py-3">

                                                            <div className="flex items-center gap-2">

                                                                <div className="flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-[5px] bg-[#eaf3ff] text-[#00549a]">
                                                                    <MedicineIcon />
                                                                </div>

                                                                <div>

                                                                    <div className="text-[10px] font-semibold leading-[14px] text-[#26344d]">
                                                                        {
                                                                            medicine.medicine_name
                                                                        }
                                                                    </div>

                                                                    {medicine.strength && (
                                                                        <div className="text-[8px] text-[#8490a4]">
                                                                            {
                                                                                medicine.strength
                                                                            }
                                                                        </div>
                                                                    )}

                                                                </div>

                                                            </div>

                                                        </td>

                                                        <td className="px-3 py-3 text-[9px] text-[#5f6b7f]">
                                                            {
                                                                medicine.generic_name ||
                                                                "—"
                                                            }
                                                        </td>

                                                        <td className="px-3 py-3 text-[9px] text-[#5f6b7f]">
                                                            {
                                                                medicine.category_name ||
                                                                "—"
                                                            }
                                                        </td>

                                                        <td className="max-w-[100px] px-3 py-3 text-[9px] leading-[13px] text-[#5f6b7f]">
                                                            {
                                                                medicine.supplier_name ||
                                                                "—"
                                                            }
                                                        </td>

                                                        <td className="px-3 py-3">

                                                            <span
                                                                className={`inline-flex rounded-full px-2 py-1 text-[8px] font-semibold ${getStockClass(
                                                                    medicine
                                                                )}`}
                                                            >
                                                                {quantity} Units
                                                            </span>

                                                        </td>

                                                        <td className="px-3 py-3">

                                                            <span
                                                                className={`text-[9px] font-medium ${
                                                                    isExpired(
                                                                        expiry
                                                                    )
                                                                        ? "text-[#ef4444]"
                                                                        : "text-[#59667a]"
                                                                }`}
                                                            >
                                                                {formatDate(
                                                                    expiry
                                                                )}
                                                            </span>

                                                        </td>

                                                        <td
                                                            className="px-3 py-3"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >

                                                            <div className="flex items-center justify-center gap-3">

                                                                <button
                                                                    title="Edit"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            medicine
                                                                        )
                                                                    }
                                                                    className="text-[#00549a] transition hover:text-[#003d70]"
                                                                >
                                                                    <EditIcon />
                                                                </button>

                                                                <button
                                                                    title="More"
                                                                    onClick={() =>
                                                                        setSelectedMedicine(
                                                                            medicine
                                                                        )
                                                                    }
                                                                    className="text-[#7d8798] transition hover:text-[#26344d]"
                                                                >
                                                                    <MoreIcon />
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* FOOTER */}

                        <div className="flex items-center justify-between border-t border-[#e3e8ef] px-3 py-2.5">

                            <span className="text-[9px] text-[#68758a]">

                                Showing{" "}

                                {filteredMedicines.length === 0
                                    ? 0
                                    : (currentPage - 1) *
                                          itemsPerPage +
                                      1}

                                {" "}to{" "}

                                {Math.min(
                                    currentPage *
                                        itemsPerPage,
                                    filteredMedicines.length
                                )}

                                {" "}of{" "}

                                {filteredMedicines.length} entries

                            </span>

                            <div className="flex items-center gap-1">

                                <button
                                    disabled={
                                        currentPage ===
                                        1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                Math.max(
                                                    1,
                                                    page - 1
                                                )
                                        )
                                    }
                                    className="flex h-[24px] w-[24px] items-center justify-center rounded border border-[#e1e6ed] text-[#98a2b3] disabled:opacity-50"
                                >
                                    ‹
                                </button>

                                {Array.from(
                                    {
                                        length: Math.min(
                                            totalPages,
                                            3
                                        ),
                                    },
                                    (_, index) =>
                                        index + 1
                                ).map(
                                    (page) => (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                setCurrentPage(
                                                    page
                                                )
                                            }
                                            className={`flex h-[24px] w-[24px] items-center justify-center rounded text-[9px] font-medium ${
                                                currentPage ===
                                                page
                                                    ? "bg-[#00549a] text-white"
                                                    : "border border-[#e1e6ed] bg-white text-[#667085]"
                                            }`}
                                        >
                                            {page}
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
                                            (page) =>
                                                Math.min(
                                                    totalPages,
                                                    page + 1
                                                )
                                        )
                                    }
                                    className="flex h-[24px] w-[24px] items-center justify-center rounded border border-[#e1e6ed] text-[#667085] disabled:opacity-50"
                                >
                                    ›
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                {/* FOOTER */}

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

            {/* =====================================================
                DETAILS PANEL
            ===================================================== */}

            {selectedMedicine &&
                !showForm && (

                    <div className="fixed right-0 top-0 z-40 flex h-screen w-[340px] flex-col border-l border-[#dfe5ee] bg-white shadow-[-5px_0_20px_rgba(0,0,0,0.05)]">

                        <div className="flex items-center justify-between border-b border-[#e3e8ef] px-4 py-4">

                            <h2 className="text-[11px] font-semibold text-[#17233c]">
                                Medicine Details
                            </h2>

                            <button
                                onClick={() =>
                                    setSelectedMedicine(
                                        null
                                    )
                                }
                                className="text-[#667085]"
                            >
                                <CloseIcon />
                            </button>

                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-4">

                            <div className="flex items-start gap-3">

                                <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[7px] bg-[#eaf3ff] text-[#00549a]">
                                    <MedicineIcon />
                                </div>

                                <div>

                                    <h3 className="text-[15px] font-bold text-[#17233c]">

                                        {
                                            selectedMedicine.medicine_name
                                        }

                                        {selectedMedicine.strength
                                            ? ` ${selectedMedicine.strength}`
                                            : ""}

                                    </h3>

                                    {isLowStock(
                                        selectedMedicine
                                    ) && (

                                        <span className="mt-1 inline-block rounded-[3px] bg-[#fee2e2] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.4px] text-[#dc2626]">
                                            Critical Stock
                                        </span>

                                    )}

                                </div>

                            </div>

                            {/* CURRENT QUANTITY */}

                            <div className="mt-4 rounded-[7px] border border-[#dfe5ef] bg-[#f8faff] p-3">

                                <p className="text-[8px] font-semibold uppercase tracking-[0.3px] text-[#8a94a5]">
                                    Current Quantity
                                </p>

                                <p className="mt-1 text-[20px] font-bold text-[#17233c]">

                                    {getQuantity(
                                        selectedMedicine
                                    )}

                                    <span className="ml-1 text-[9px] font-medium text-[#7b8799]">
                                        Units
                                    </span>

                                </p>

                                <p className="mt-1 text-[8px] text-[#8a94a5]">

                                    Reorder Level:{" "}

                                    {selectedMedicine.reorder_level ??
                                        0}

                                </p>

                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">

                                <InfoBox
                                    label="BARCODE"
                                    value={
                                        selectedMedicine.barcode ||
                                        "—"
                                    }
                                />

                                <InfoBox
                                    label="SKU"
                                    value={
                                        selectedMedicine.sku ||
                                        "—"
                                    }
                                />

                                <InfoBox
                                    label="STORAGE LOCATION"
                                    value={
                                        selectedMedicine.location_name ||
                                        "—"
                                    }
                                />

                                <InfoBox
                                    label="SUPPLIER"
                                    value={
                                        selectedMedicine.supplier_name ||
                                        "—"
                                    }
                                />

                            </div>

                            <div className="mt-5">

                                <div className="mb-3 flex items-center justify-between">

                                    <h3 className="text-[11px] font-bold text-[#26344d]">
                                        Timeline & Compliance
                                    </h3>

                                    <div className="ml-3 h-px flex-1 bg-[#e0e5ed]" />

                                </div>

                                <div className="space-y-3">

                                    <TimelineRow
                                        label="Manufacturing Date"
                                        value={
                                            selectedMedicine.manufacturing_date
                                                ? formatDate(
                                                      selectedMedicine.manufacturing_date
                                                  )
                                                : "—"
                                        }
                                    />

                                    <TimelineRow
                                        label="Expiry Date"
                                        value={
                                            getExpiryDate(
                                                selectedMedicine
                                            )
                                                ? formatDate(
                                                      getExpiryDate(
                                                          selectedMedicine
                                                      )
                                                  )
                                                : "—"
                                        }
                                        danger={isExpired(
                                            getExpiryDate(
                                                selectedMedicine
                                            )
                                        )}
                                    />

                                </div>

                            </div>

                            <div className="mt-5 rounded-[7px] bg-[#edf4ff] px-2.5 py-3">

                                <div className="mb-3 flex items-center justify-between">

                                    <span className="text-[9px] font-semibold text-[#26344d]">
                                        Usage Trend
                                    </span>

                                    <span className="text-[8px] text-[#78859a]">
                                        Last 30 Days
                                    </span>

                                </div>

                                <UsageChart />

                            </div>

                            <div className="mt-5 space-y-3">

                                <Detail
                                    label="Generic Name"
                                    value={
                                        selectedMedicine.generic_name
                                    }
                                />

                                <Detail
                                    label="Brand Name"
                                    value={
                                        selectedMedicine.brand_name
                                    }
                                />

                                <Detail
                                    label="Dosage Form"
                                    value={
                                        selectedMedicine.dosage_form
                                    }
                                />

                                <Detail
                                    label="Manufacturer"
                                    value={
                                        selectedMedicine.manufacturer
                                    }
                                />

                                <Detail
                                    label="Storage Condition"
                                    value={
                                        selectedMedicine.storage_condition
                                    }
                                />

                                <Detail
                                    label="Description"
                                    value={
                                        selectedMedicine.description
                                    }
                                />

                            </div>

                        </div>

                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div className="border-t border-[#dfe5ee] bg-white p-3">

                            <div className="flex gap-2">

                                <button
                                    onClick={
                                        handlePrintLabel
                                    }
                                    className="flex-1 rounded-[6px] border border-[#00549a] bg-white py-2 text-[9px] font-semibold text-[#00549a] hover:bg-[#f0f6fc]"
                                >
                                    Print Label
                                </button>

                                <button
                                    onClick={() =>
                                        handleRestock(
                                            selectedMedicine
                                        )
                                    }
                                    className="flex-1 rounded-[6px] bg-[#00549a] py-2 text-[9px] font-semibold text-white hover:bg-[#00447e]"
                                >
                                    Restock Now
                                </button>

                            </div>

                            {/* DELETE BUTTON */}

                            <button
                                onClick={() =>
                                    handleDelete(
                                        selectedMedicine.medicine_id
                                    )
                                }
                                className="mt-2 w-full rounded-[6px] border border-[#ef4444] bg-white py-2 text-[9px] font-semibold text-[#dc2626] transition hover:bg-[#fef2f2]"
                            >
                                Delete Medicine
                            </button>

                        </div>

                    </div>
                )}

            {/* =====================================================
                ADD / EDIT PANEL
            ===================================================== */}

            {showForm && (

                <div className="fixed right-0 top-0 z-50 flex h-screen w-[390px] flex-col border-l border-[#dfe5ee] bg-white shadow-[-5px_0_20px_rgba(0,0,0,0.05)]">

                    <div className="flex items-center justify-between border-b border-[#e3e8ef] px-5 py-4">

                        <div>

                            <h2 className="text-[13px] font-bold text-[#17233c]">

                                {editingId
                                    ? "Edit Medicine"
                                    : "Add Medicine"}

                            </h2>

                            <p className="mt-1 text-[9px] text-[#7b8799]">
                                Enter medicine information below.
                            </p>

                        </div>

                        <button
                            onClick={() => {
                                setShowForm(false);
                                resetForm();
                            }}
                            className="text-[#667085]"
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
                                label="Medicine Name"
                                name="medicine_name"
                                value={
                                    form.medicine_name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            <Input
                                label="Generic Name"
                                name="generic_name"
                                value={
                                    form.generic_name
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <Input
                                label="Brand Name"
                                name="brand_name"
                                value={
                                    form.brand_name
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <div className="grid grid-cols-2 gap-3">

                                <Input
                                    label="Dosage"
                                    name="dosage"
                                    value={
                                        form.dosage
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <Input
                                    label="Strength"
                                    name="strength"
                                    value={
                                        form.strength
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            <Input
                                label="Dosage Form"
                                name="dosage_form"
                                value={
                                    form.dosage_form
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <Input
                                label="Barcode"
                                name="barcode"
                                value={
                                    form.barcode
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <Input
                                label="SKU"
                                name="sku"
                                value={
                                    form.sku
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <Input
                                label="Manufacturer"
                                name="manufacturer"
                                value={
                                    form.manufacturer
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <div className="grid grid-cols-2 gap-3">

                                <Input
                                    label="Unit Price"
                                    name="unit_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={
                                        form.unit_price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <Input
                                    label="Reorder Level"
                                    name="reorder_level"
                                    type="number"
                                    min="0"
                                    value={
                                        form.reorder_level
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            <div className="rounded-[6px] border border-[#cfe0f1] bg-[#f5f9fd] p-2.5">

                                <Input
                                    label="Initial Quantity"
                                    name="quantity"
                                    type="number"
                                    min="0"
                                    value={
                                        form.quantity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                                <p className="mt-1 text-[8px] text-[#7b8799]">
                                    Enter the number of units currently available.
                                </p>

                            </div>

                            <Select
                                label="Category"
                                name="category_id"
                                value={
                                    form.category_id
                                }
                                onChange={
                                    handleChange
                                }
                                options={categories.map(
                                    (category) => ({
                                        value:
                                            category.category_id,
                                        label:
                                            category.category_name,
                                    })
                                )}
                            />

                            <Select
                                label="Supplier"
                                name="supplier_id"
                                value={
                                    form.supplier_id
                                }
                                onChange={
                                    handleChange
                                }
                                options={suppliers.map(
                                    (supplier) => ({
                                        value:
                                            supplier.supplier_id,
                                        label:
                                            supplier.supplier_name,
                                    })
                                )}
                            />

                            <Select
                                label="Storage Location"
                                name="location_id"
                                value={
                                    form.location_id
                                }
                                onChange={
                                    handleChange
                                }
                                options={locations.map(
                                    (location) => ({
                                        value:
                                            location.location_id,
                                        label:
                                            location.location_name,
                                    })
                                )}
                            />

                            <Select
                                label="Status"
                                name="status"
                                value={
                                    form.status
                                }
                                onChange={
                                    handleChange
                                }
                                options={[
                                    {
                                        value: "Active",
                                        label: "Active",
                                    },
                                    {
                                        value: "Inactive",
                                        label: "Inactive",
                                    },
                                ]}
                            />

                            <Input
                                label="Storage Condition"
                                name="storage_condition"
                                value={
                                    form.storage_condition
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <div>

                                <label className="mb-1 block text-[10px] font-semibold text-[#344054]">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="3"
                                    className="w-full resize-none rounded-[5px] border border-[#d6deeb] px-3 py-2 text-[10px] outline-none focus:border-[#00549a]"
                                />

                            </div>

                            <label className="flex items-center gap-2 text-[10px] text-[#475467]">

                                <input
                                    type="checkbox"
                                    name="requires_prescription"
                                    checked={
                                        form.requires_prescription
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="h-3.5 w-3.5 accent-[#00549a]"
                                />

                                Requires prescription

                            </label>

                            <div className="flex gap-2 pt-3">

                                <button
                                    type="submit"
                                    className="flex-1 rounded-[6px] bg-[#00549a] py-2.5 text-[10px] font-semibold text-white hover:bg-[#00447e]"
                                >
                                    {editingId
                                        ? "Update Medicine"
                                        : "Add Medicine"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
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
// DETAIL
// =============================================================

const Detail = ({
    label,
    value,
}) => (
    <div className="border-b border-[#edf0f4] pb-2.5">

        <p className="text-[8px] font-semibold uppercase tracking-[0.3px] text-[#8a94a5]">
            {label}
        </p>

        <p className="mt-1 text-[10px] text-[#475467]">
            {value || "—"}
        </p>

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
            {value}
        </p>

    </div>
);

// =============================================================
// TIMELINE
// =============================================================

const TimelineRow = ({
    label,
    value,
    danger = false,
}) => (
    <div className="flex items-center justify-between">

        <span className="text-[9px] text-[#68758a]">
            {label}
        </span>

        <span
            className={`text-[9px] font-semibold ${
                danger
                    ? "text-[#ef4444]"
                    : "text-[#59667a]"
            }`}
        >
            {value}
        </span>

    </div>
);

// =============================================================
// USAGE CHART
// =============================================================

const UsageChart = () => {

    const bars = [
        42,
        58,
        64,
        48,
        82,
        59,
        65,
    ];

    return (
        <div className="flex h-[62px] items-end gap-1.5">

            {bars.map(
                (height, index) => (

                    <div
                        key={index}
                        className="flex flex-1 items-end"
                    >

                        <div
                            style={{
                                height: `${height}%`,
                            }}
                            className={`w-full rounded-t-[2px] ${
                                index === 4
                                    ? "bg-[#00549a]"
                                    : "bg-[#9db9d8]"
                            }`}
                        />

                    </div>

                )
            )}

        </div>
    );
};

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

const FilterIcon = () => (
    <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
);

const MedicineIcon = () => (
    <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="3"
        />

        <path d="M8 12h8M12 8v8" />
    </svg>
);

const EditIcon = () => (
    <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M12 20h9" />

        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
);

const MoreIcon = () => (
    <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <circle
            cx="5"
            cy="12"
            r="1.5"
        />

        <circle
            cx="12"
            cy="12"
            r="1.5"
        />

        <circle
            cx="19"
            cy="12"
            r="1.5"
        />
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

export default Medicines;