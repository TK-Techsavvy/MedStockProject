import React, { useEffect, useState } from "react";

const Medicines = () => {
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

    const [form, setForm] = useState({
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
        description: "",
        requires_prescription: false,
        status: "Active",
        sku: "",
        manufacturer: "",
        medicine_image: "",
        storage_condition: ""
    });

    // =========================
    // FETCH MEDICINES
    // =========================

    const fetchMedicines = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/medicine"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch medicines");
            }

            const data = await response.json();
            setMedicines(data);
        } catch (error) {
            console.error("Error fetching medicines:", error);
        }
    };

    // =========================
    // FETCH CATEGORIES
    // =========================

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/medicine/categories"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // =========================
    // FETCH SUPPLIERS
    // =========================

    const fetchSuppliers = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/medicine/suppliers"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch suppliers");
            }

            const data = await response.json();
            setSuppliers(data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    // =========================
    // FETCH LOCATIONS
    // =========================

    const fetchLocations = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/medicine/locations"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch locations");
            }

            const data = await response.json();
            setLocations(data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    useEffect(() => {
        fetchMedicines();
        fetchCategories();
        fetchSuppliers();
        fetchLocations();
    }, []);

    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setEditingId(null);

        setForm({
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
            description: "",
            requires_prescription: false,
            status: "Active",
            sku: "",
            manufacturer: "",
            medicine_image: "",
            storage_condition: ""
        });
    };

    // =========================
    // OPEN ADD FORM
    // =========================

    const handleAdd = () => {
        resetForm();
        setShowForm(true);
    };

    // =========================
    // OPEN EDIT FORM
    // =========================

    const handleEdit = (medicine) => {
        setEditingId(medicine.medicine_id);

        setForm({
            category_id: medicine.category_id || "",
            supplier_id: medicine.supplier_id || "",
            location_id: medicine.location_id || "",
            medicine_name: medicine.medicine_name || "",
            generic_name: medicine.generic_name || "",
            brand_name: medicine.brand_name || "",
            dosage: medicine.dosage || "",
            dosage_form: medicine.dosage_form || "",
            strength: medicine.strength || "",
            barcode: medicine.barcode || "",
            unit_price: medicine.unit_price || "",
            reorder_level: medicine.reorder_level || "",
            description: medicine.description || "",
            requires_prescription:
                medicine.requires_prescription || false,
            status: medicine.status || "Active",
            sku: medicine.sku || "",
            manufacturer: medicine.manufacturer || "",
            medicine_image: medicine.medicine_image || "",
            storage_condition: medicine.storage_condition || ""
        });

        setShowForm(true);
    };

    // =========================
    // ADD / UPDATE
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `http://localhost:5000/api/medicine/${editingId}`
                : "http://localhost:5000/api/medicine";

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to save medicine");
            }

            alert(
                editingId
                    ? "Medicine updated successfully."
                    : "Medicine added successfully."
            );

            await fetchMedicines();

            resetForm();
            setShowForm(false);
        } catch (error) {
            console.error("Save medicine error:", error);
            alert(error.message);
        }
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (medicineId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this medicine?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/medicine/${medicineId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete medicine");
            }

            alert("Medicine deleted successfully.");

            if (selectedMedicine?.medicine_id === medicineId) {
                setSelectedMedicine(null);
            }

            await fetchMedicines();
        } catch (error) {
            console.error("Delete medicine error:", error);
            alert(error.message);
        }
    };

    // =========================
    // FILTER MEDICINES
    // =========================

    const filteredMedicines = medicines.filter((medicine) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            medicine.medicine_name
                ?.toLowerCase()
                .includes(searchValue) ||
            medicine.generic_name
                ?.toLowerCase()
                .includes(searchValue) ||
            medicine.brand_name
                ?.toLowerCase()
                .includes(searchValue) ||
            medicine.sku
                ?.toLowerCase()
                .includes(searchValue);

        const matchesCategory =
            !categoryFilter ||
            String(medicine.category_id) === String(categoryFilter);

        const matchesSupplier =
            !supplierFilter ||
            String(medicine.supplier_id) === String(supplierFilter);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesSupplier
        );
    });

    return (
        <div className="min-h-screen bg-slate-50">

            {/* MAIN CONTENT */}
            <div className="p-6">

                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Medicine Management
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage medicines, suppliers, categories and storage
                        information.
                    </p>
                </div>

                {/* FILTER BAR */}
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="flex flex-wrap gap-3">

                        <input
                            type="text"
                            placeholder="Search medicines..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-[#00549a] focus:ring-2 focus:ring-[#00549a]/20"
                        />

                        <select
                            value={categoryFilter}
                            onChange={(e) =>
                                setCategoryFilter(e.target.value)
                            }
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm"
                        >
                            <option value="">
                                All Categories
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.category_id}
                                    value={category.category_id}
                                >
                                    {category.category_name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={supplierFilter}
                            onChange={(e) =>
                                setSupplierFilter(e.target.value)
                            }
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm"
                        >
                            <option value="">
                                All Suppliers
                            </option>

                            {suppliers.map((supplier) => (
                                <option
                                    key={supplier.supplier_id}
                                    value={supplier.supplier_id}
                                >
                                    {supplier.supplier_name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleAdd}
                            className="rounded-lg bg-[#00549a] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#00427a]"
                        >
                            + Add Medicine
                        </button>

                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead className="border-b border-slate-200 bg-slate-100">
                                <tr>
                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                                        Medicine
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                                        Generic Name
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                                        Category
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                                        Supplier
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                                        Price
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">

                                {filteredMedicines.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-10 text-center text-sm text-slate-500"
                                        >
                                            No medicines found.
                                        </td>
                                    </tr>

                                ) : (

                                    filteredMedicines.map((medicine) => (

                                        <tr
                                            key={medicine.medicine_id}
                                            onClick={() =>
                                                setSelectedMedicine(medicine)
                                            }
                                            className="cursor-pointer transition hover:bg-slate-50"
                                        >

                                            <td className="px-5 py-4">
                                                <div className="font-medium text-slate-800">
                                                    {medicine.medicine_name}
                                                </div>

                                                <div className="text-xs text-slate-400">
                                                    {medicine.brand_name}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {medicine.generic_name || "-"}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {medicine.category_name || "-"}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {medicine.supplier_name || "-"}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                R{medicine.unit_price}
                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        medicine.status === "Active"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {medicine.status}
                                                </span>

                                            </td>

                                            <td
                                                className="px-5 py-4"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >

                                                <button
                                                    onClick={() =>
                                                        handleEdit(medicine)
                                                    }
                                                    className="mr-3 text-sm font-medium text-[#00549a] hover:underline"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            medicine.medicine_id
                                                        )
                                                    }
                                                    className="text-sm font-medium text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* =========================
                DETAILS SIDEBAR
            ========================= */}

            {selectedMedicine && !showForm && (

                <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl">

                    <div className="mb-6 flex items-start justify-between">

                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                {selectedMedicine.medicine_name}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Medicine Details
                            </p>
                        </div>

                        <button
                            onClick={() => setSelectedMedicine(null)}
                            className="text-xl text-slate-400 hover:text-slate-700"
                        >
                            ×
                        </button>

                    </div>

                    <div className="space-y-4 text-sm">

                        <Detail
                            label="Generic Name"
                            value={selectedMedicine.generic_name}
                        />

                        <Detail
                            label="Brand Name"
                            value={selectedMedicine.brand_name}
                        />

                        <Detail
                            label="Dosage"
                            value={selectedMedicine.dosage}
                        />

                        <Detail
                            label="Dosage Form"
                            value={selectedMedicine.dosage_form}
                        />

                        <Detail
                            label="Strength"
                            value={selectedMedicine.strength}
                        />

                        <Detail
                            label="Barcode"
                            value={selectedMedicine.barcode}
                        />

                        <Detail
                            label="SKU"
                            value={selectedMedicine.sku}
                        />

                        <Detail
                            label="Manufacturer"
                            value={selectedMedicine.manufacturer}
                        />

                        <Detail
                            label="Unit Price"
                            value={`R${selectedMedicine.unit_price}`}
                        />

                        <Detail
                            label="Reorder Level"
                            value={selectedMedicine.reorder_level}
                        />

                        <Detail
                            label="Storage Condition"
                            value={selectedMedicine.storage_condition}
                        />

                        <Detail
                            label="Description"
                            value={selectedMedicine.description}
                        />

                        <Detail
                            label="Prescription Required"
                            value={
                                selectedMedicine.requires_prescription
                                    ? "Yes"
                                    : "No"
                            }
                        />

                    </div>

                    <div className="mt-8 flex gap-3">

                        <button
                            onClick={() =>
                                handleEdit(selectedMedicine)
                            }
                            className="flex-1 rounded-lg bg-[#00549a] px-4 py-2 text-sm font-medium text-white hover:bg-[#00427a]"
                        >
                            Edit Medicine
                        </button>

                        <button
                            onClick={() =>
                                handleDelete(
                                    selectedMedicine.medicine_id
                                )
                            }
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            )}

            {/* =========================
                ADD / EDIT SIDEBAR
            ========================= */}

            {showForm && (

                <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl">

                    <div className="mb-6 flex items-center justify-between">

                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingId
                                    ? "Edit Medicine"
                                    : "Add Medicine"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Enter medicine information below.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setShowForm(false);
                                resetForm();
                            }}
                            className="text-xl text-slate-400 hover:text-slate-700"
                        >
                            ×
                        </button>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        <Input
                            label="Medicine Name"
                            name="medicine_name"
                            value={form.medicine_name}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Generic Name"
                            name="generic_name"
                            value={form.generic_name}
                            onChange={handleChange}
                        />

                        <Input
                            label="Brand Name"
                            name="brand_name"
                            value={form.brand_name}
                            onChange={handleChange}
                        />

                        <div className="grid grid-cols-2 gap-4">

                            <Input
                                label="Dosage"
                                name="dosage"
                                value={form.dosage}
                                onChange={handleChange}
                            />

                            <Input
                                label="Strength"
                                name="strength"
                                value={form.strength}
                                onChange={handleChange}
                            />

                        </div>

                        <Input
                            label="Dosage Form"
                            name="dosage_form"
                            value={form.dosage_form}
                            onChange={handleChange}
                        />

                        <Input
                            label="Barcode"
                            name="barcode"
                            value={form.barcode}
                            onChange={handleChange}
                        />

                        <Input
                            label="SKU"
                            name="sku"
                            value={form.sku}
                            onChange={handleChange}
                        />

                        <Input
                            label="Manufacturer"
                            name="manufacturer"
                            value={form.manufacturer}
                            onChange={handleChange}
                        />

                        <div className="grid grid-cols-2 gap-4">

                            <Input
                                label="Unit Price"
                                name="unit_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.unit_price}
                                onChange={handleChange}
                            />

                            <Input
                                label="Reorder Level"
                                name="reorder_level"
                                type="number"
                                min="0"
                                value={form.reorder_level}
                                onChange={handleChange}
                            />

                        </div>

                        <Select
                            label="Category"
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            options={categories.map((category) => ({
                                value: category.category_id,
                                label: category.category_name
                            }))}
                        />

                        <Select
                            label="Supplier"
                            name="supplier_id"
                            value={form.supplier_id}
                            onChange={handleChange}
                            options={suppliers.map((supplier) => ({
                                value: supplier.supplier_id,
                                label: supplier.supplier_name
                            }))}
                        />

                        <Select
                            label="Storage Location"
                            name="location_id"
                            value={form.location_id}
                            onChange={handleChange}
                            options={locations.map((location) => ({
                                value: location.location_id,
                                label: location.location_name
                            }))}
                        />

                        <Select
                            label="Status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            options={[
                                {
                                    value: "Active",
                                    label: "Active"
                                },
                                {
                                    value: "Inactive",
                                    label: "Inactive"
                                }
                            ]}
                        />

                        <Input
                            label="Storage Condition"
                            name="storage_condition"
                            value={form.storage_condition}
                            onChange={handleChange}
                        />

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#00549a] focus:ring-2 focus:ring-[#00549a]/20"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm text-slate-700">

                            <input
                                type="checkbox"
                                name="requires_prescription"
                                checked={form.requires_prescription}
                                onChange={handleChange}
                                className="h-4 w-4"
                            />

                            Requires prescription

                        </label>

                        <div className="flex gap-3 pt-4">

                            <button
                                type="submit"
                                className="flex-1 rounded-lg bg-[#00549a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#00427a]"
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
                                className="rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-300"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}

        </div>
    );
};


// =========================
// INPUT COMPONENT
// =========================

const Input = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    ...props
}) => (
    <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
            {label}
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            {...props}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#00549a] focus:ring-2 focus:ring-[#00549a]/20"
        />
    </div>
);


// =========================
// SELECT COMPONENT
// =========================

const Select = ({
    label,
    name,
    value,
    onChange,
    options
}) => (
    <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
            {label}
        </label>

        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#00549a] focus:ring-2 focus:ring-[#00549a]/20"
        >
            <option value="">
                Select {label}
            </option>

            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);


// =========================
// DETAILS COMPONENT
// =========================

const Detail = ({ label, value }) => (
    <div className="border-b border-slate-100 pb-3">
        <p className="text-xs font-medium uppercase text-slate-400">
            {label}
        </p>

        <p className="mt-1 text-slate-700">
            {value || "-"}
        </p>
    </div>
);

export default Medicines;