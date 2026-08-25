import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api/suppliers";

const Suppliers = () => {

    const [suppliers, setSuppliers] = useState([]);

    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 4;


    // =========================================================
    // FORM
    // =========================================================

    const [form, setForm] = useState({
        supplier_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        province: "",
        postal_code: "",
    });


    // =========================================================
    // FETCH SUPPLIERS
    // =========================================================

    const fetchSuppliers = async () => {

        try {

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch suppliers");
            }

            const data = await response.json();

            setSuppliers(data);

        } catch (error) {

            console.error(
                "Error fetching suppliers:",
                error
            );

        }
    };


    useEffect(() => {
        fetchSuppliers();
    }, []);


    // =========================================================
    // FORM HANDLING
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const resetForm = () => {

        setEditingId(null);

        setForm({
            supplier_name: "",
            contact_person: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            province: "",
            postal_code: "",
        });
    };


    // =========================================================
    // ADD
    // =========================================================

    const handleAdd = () => {

        resetForm();

        setSelectedSupplier(null);

        setShowForm(true);
    };


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (supplier) => {

        setEditingId(
            supplier.supplier_id
        );

        setForm({
            supplier_name:
                supplier.supplier_name || "",

            contact_person:
                supplier.contact_person || "",

            email:
                supplier.email || "",

            phone:
                supplier.phone || "",

            address:
                supplier.address || "",

            city:
                supplier.city || "",

            province:
                supplier.province || "",

            postal_code:
                supplier.postal_code || "",
        });

        setSelectedSupplier(null);

        setShowForm(true);
    };


    // =========================================================
    // ADD / UPDATE
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId
                ? "PUT"
                : "POST";


            const response = await fetch(url, {

                method,

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify(form),

            });


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to save supplier"
                );
            }


            alert(
                editingId
                    ? "Supplier updated successfully."
                    : "Supplier added successfully."
            );


            await fetchSuppliers();


            resetForm();

            setShowForm(false);


        } catch (error) {

            console.error(
                "Save supplier error:",
                error
            );

            alert(error.message);
        }
    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (supplierId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this supplier?"
            );


        if (!confirmed) return;


        try {

            const response =
                await fetch(
                    `${API_URL}/${supplierId}`,
                    {
                        method: "DELETE",
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to delete supplier"
                );
            }


            alert(
                "Supplier deleted successfully."
            );


            if (
                selectedSupplier?.supplier_id ===
                supplierId
            ) {

                setSelectedSupplier(null);
            }


            await fetchSuppliers();


        } catch (error) {

            console.error(
                "Delete supplier error:",
                error
            );

            alert(error.message);
        }
    };


    // =========================================================
    // FILTERING
    // =========================================================

    const filteredSuppliers = useMemo(() => {

        const searchValue =
            search
                .toLowerCase()
                .trim();


        return suppliers.filter(
            (supplier) => {

                if (!searchValue) {
                    return true;
                }


                return (

                    supplier.supplier_name
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    supplier.contact_person
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    supplier.email
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    supplier.phone
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    supplier.city
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    supplier.province
                        ?.toLowerCase()
                        .includes(searchValue)

                );
            }
        );

    }, [
        suppliers,
        search
    ]);


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredSuppliers.length /
                itemsPerPage
            )
        );


    const displayedSuppliers =
        filteredSuppliers.slice(
            (currentPage - 1) *
                itemsPerPage,

            currentPage *
                itemsPerPage
        );


    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="min-h-screen bg-[#f8faff] text-[#17233c]">


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div
                className={`min-h-screen transition-all duration-200 ${
                    selectedSupplier || showForm
                        ? "pr-[340px]"
                        : ""
                }`}
            >


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="px-7 pt-7">

                    <div className="mb-5 flex items-start justify-between">

                        <div>

                            <h1 className="text-[20px] font-bold tracking-[-0.2px] text-[#17233c]">
                                Supplier Management
                            </h1>

                            <p className="mt-1 text-[11px] text-[#69758b]">
                                Manage suppliers and their
                                contact information.
                            </p>

                        </div>


                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 rounded-[7px] bg-[#00549a] px-4 py-2 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#00447e]"
                        >

                            <span className="text-[16px] leading-none">
                                +
                            </span>

                            Add Supplier

                        </button>

                    </div>


                    {/* =================================================
                        SEARCH BAR
                    ================================================= */}

                    <div className="rounded-[8px] border border-[#dfe5ef] bg-white px-3 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">

                        <div className="relative max-w-[420px]">

                            <SearchIcon />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search suppliers..."
                                className="h-[34px] w-full rounded-[5px] border border-[#d6deeb] bg-white pl-8 pr-3 text-[11px] text-[#344054] outline-none transition placeholder:text-[#9aa4b4] focus:border-[#00549a] focus:ring-1 focus:ring-[#00549a]/10"
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="px-7 pt-4">

                    <div className="overflow-hidden rounded-[8px] border border-[#dce3ee] bg-white">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px] border-collapse">

                                <thead>

                                    <tr className="border-b border-[#e2e7ef] bg-[#f8faff]">

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Supplier
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Contact Person
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Email
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Phone
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            City
                                        </th>

                                        <th className="px-3 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Province
                                        </th>

                                        <th className="px-3 py-3 text-center text-[8px] font-semibold uppercase tracking-[0.5px] text-[#68758a]">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {displayedSuppliers.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="px-6 py-16 text-center"
                                            >

                                                <div className="text-[13px] font-medium text-[#475467]">
                                                    No suppliers found
                                                </div>

                                                <div className="mt-1 text-[11px] text-[#98a2b3]">
                                                    Try changing your
                                                    search or add a
                                                    new supplier.
                                                </div>

                                            </td>

                                        </tr>

                                    ) : (

                                        displayedSuppliers.map(
                                            (supplier) => (

                                                <tr
                                                    key={
                                                        supplier.supplier_id
                                                    }
                                                    onClick={() =>
                                                        setSelectedSupplier(
                                                            supplier
                                                        )
                                                    }
                                                    className={`cursor-pointer border-b border-[#e7ebf1] transition hover:bg-[#f8fbff] ${
                                                        selectedSupplier?.supplier_id ===
                                                        supplier.supplier_id
                                                            ? "bg-[#f2f7fc]"
                                                            : ""
                                                    }`}
                                                >

                                                    {/* SUPPLIER */}

                                                    <td className="px-3 py-3">

                                                        <div className="flex items-center gap-2">

                                                            <div className="flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-[5px] bg-[#eaf3ff] text-[#00549a]">

                                                                <SupplierIcon />

                                                            </div>


                                                            <div>

                                                                <div className="text-[10px] font-semibold leading-[14px] text-[#26344d]">
                                                                    {
                                                                        supplier.supplier_name
                                                                    }
                                                                </div>

                                                                <div className="text-[8px] text-[#8490a4]">
                                                                    ID:{" "}
                                                                    {
                                                                        supplier.supplier_id
                                                                    }
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* CONTACT */}

                                                    <td className="px-3 py-3 text-[9px] text-[#5f6b7f]">
                                                        {
                                                            supplier.contact_person ||
                                                            "—"
                                                        }
                                                    </td>


                                                    {/* EMAIL */}

                                                    <td className="px-3 py-3 text-[9px] text-[#5f6b7f]">
                                                        {
                                                            supplier.email ||
                                                            "—"
                                                        }
                                                    </td>


                                                    {/* PHONE */}

                                                    <td className="px-3 py-3 text-[9px] text-[#5f6b7f]">
                                                        {
                                                            supplier.phone ||
                                                            "—"
                                                        }
                                                    </td>


                                                    {/* CITY */}

                                                    <td className="px-3 py-3 text-[9px] text-[#5f6b7f]">
                                                        {
                                                            supplier.city ||
                                                            "—"
                                                        }
                                                    </td>


                                                    {/* PROVINCE */}

                                                    <td className="px-3 py-3 text-[9px] text-[#5f6b7f]">
                                                        {
                                                            supplier.province ||
                                                            "—"
                                                        }
                                                    </td>


                                                    {/* ACTIONS */}

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
                                                                        supplier
                                                                    )
                                                                }
                                                                className="text-[#00549a] transition hover:text-[#003d70]"
                                                            >
                                                                <EditIcon />
                                                            </button>


                                                            <button
                                                                title="Delete"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        supplier.supplier_id
                                                                    )
                                                                }
                                                                className="text-[#dc2626] transition hover:text-[#b91c1c]"
                                                            >
                                                                <DeleteIcon />
                                                            </button>


                                                            <button
                                                                title="View"
                                                                onClick={() =>
                                                                    setSelectedSupplier(
                                                                        supplier
                                                                    )
                                                                }
                                                                className="text-[#7d8798] transition hover:text-[#26344d]"
                                                            >
                                                                <MoreIcon />
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
                            TABLE FOOTER
                        ================================================= */}

                        <div className="flex items-center justify-between border-t border-[#e3e8ef] px-3 py-2.5">

                            <span className="text-[9px] text-[#68758a]">

                                Showing{" "}

                                {filteredSuppliers.length === 0
                                    ? 0
                                    : (currentPage - 1) *
                                          itemsPerPage +
                                      1}

                                {" "}to{" "}

                                {Math.min(
                                    currentPage *
                                        itemsPerPage,
                                    filteredSuppliers.length
                                )}

                                {" "}of{" "}

                                {filteredSuppliers.length}

                                {" "}entries

                            </span>


                            <div className="flex items-center gap-1">

                                <button
                                    disabled={
                                        currentPage === 1
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
                                    className="flex h-[24px] w-[24px] items-center justify-center rounded border border-[#e1e6ed] text-[#98a2b3] disabled:cursor-not-allowed disabled:opacity-50"
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
                                ).map((page) => (

                                    <button
                                        key={page}
                                        onClick={() =>
                                            setCurrentPage(
                                                page
                                            )
                                        }
                                        className={`flex h-[24px] w-[24px] items-center justify-center rounded text-[9px] font-medium ${
                                            currentPage === page
                                                ? "bg-[#00549a] text-white"
                                                : "border border-[#e1e6ed] bg-white text-[#667085]"
                                        }`}
                                    >
                                        {page}
                                    </button>

                                ))}


                                {totalPages > 3 && (

                                    <>

                                        <span className="px-1 text-[9px] text-[#98a2b3]">
                                            ...
                                        </span>

                                        <button
                                            onClick={() =>
                                                setCurrentPage(
                                                    totalPages
                                                )
                                            }
                                            className="flex h-[24px] min-w-[24px] items-center justify-center rounded border border-[#e1e6ed] text-[9px] text-[#667085]"
                                        >
                                            {
                                                totalPages
                                            }
                                        </button>

                                    </>

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
                                    className="flex h-[24px] w-[24px] items-center justify-center rounded border border-[#e1e6ed] text-[#667085] disabled:cursor-not-allowed disabled:opacity-50"
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
                SUPPLIER DETAILS PANEL
            ========================================================= */}

            {selectedSupplier && !showForm && (

                <div className="fixed right-0 top-0 z-40 flex h-screen w-[340px] flex-col border-l border-[#dfe5ee] bg-white shadow-[-5px_0_20px_rgba(0,0,0,0.05)]">

                    {/* HEADER */}

                    <div className="flex items-center justify-between border-b border-[#e3e8ef] px-4 py-4">

                        <h2 className="text-[11px] font-semibold text-[#17233c]">
                            Supplier Details
                        </h2>

                        <button
                            onClick={() =>
                                setSelectedSupplier(null)
                            }
                            className="text-[#667085] transition hover:text-[#17233c]"
                        >
                            <CloseIcon />
                        </button>

                    </div>


                    {/* CONTENT */}

                    <div className="flex-1 overflow-y-auto px-4 py-4">

                        {/* TITLE */}

                        <div className="flex items-start gap-3">

                            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[7px] bg-[#eaf3ff] text-[#00549a]">

                                <SupplierIcon />

                            </div>


                            <div>

                                <h3 className="text-[15px] font-bold text-[#17233c]">

                                    {
                                        selectedSupplier.supplier_name
                                    }

                                </h3>

                                <p className="mt-1 text-[9px] text-[#7b8799]">

                                    Supplier ID:{" "}

                                    {
                                        selectedSupplier.supplier_id
                                    }

                                </p>

                            </div>

                        </div>


                        {/* INFORMATION */}

                        <div className="mt-5 space-y-3">

                            <Detail
                                label="Contact Person"
                                value={
                                    selectedSupplier.contact_person
                                }
                            />

                            <Detail
                                label="Email"
                                value={
                                    selectedSupplier.email
                                }
                            />

                            <Detail
                                label="Phone"
                                value={
                                    selectedSupplier.phone
                                }
                            />

                            <Detail
                                label="Address"
                                value={
                                    selectedSupplier.address
                                }
                            />

                            <Detail
                                label="City"
                                value={
                                    selectedSupplier.city
                                }
                            />

                            <Detail
                                label="Province"
                                value={
                                    selectedSupplier.province
                                }
                            />

                            <Detail
                                label="Postal Code"
                                value={
                                    selectedSupplier.postal_code
                                }
                            />

                        </div>

                    </div>


                    {/* BUTTONS */}

                    <div className="border-t border-[#dfe5ee] bg-white p-3">

                        <div className="flex gap-2">

                            <button
                                onClick={() =>
                                    handleEdit(
                                        selectedSupplier
                                    )
                                }
                                className="flex-1 rounded-[6px] border border-[#00549a] bg-white py-2 text-[9px] font-semibold text-[#00549a] transition hover:bg-[#f0f6fc]"
                            >
                                Edit Supplier
                            </button>


                            <button
                                onClick={() =>
                                    handleDelete(
                                        selectedSupplier.supplier_id
                                    )
                                }
                                className="flex-1 rounded-[6px] bg-[#dc2626] py-2 text-[9px] font-semibold text-white transition hover:bg-[#b91c1c]"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =========================================================
                ADD / EDIT PANEL
            ========================================================= */}

            {showForm && (

                <div className="fixed right-0 top-0 z-50 flex h-screen w-[390px] flex-col border-l border-[#dfe5ee] bg-white shadow-[-5px_0_20px_rgba(0,0,0,0.05)]">


                    {/* HEADER */}

                    <div className="flex items-center justify-between border-b border-[#e3e8ef] px-5 py-4">

                        <div>

                            <h2 className="text-[13px] font-bold text-[#17233c]">

                                {editingId
                                    ? "Edit Supplier"
                                    : "Add Supplier"}

                            </h2>

                            <p className="mt-1 text-[9px] text-[#7b8799]">
                                Enter supplier information below.
                            </p>

                        </div>


                        <button
                            onClick={() => {

                                setShowForm(false);

                                resetForm();

                            }}
                            className="text-[#667085] hover:text-[#17233c]"
                        >
                            <CloseIcon />
                        </button>

                    </div>


                    {/* FORM */}

                    <div className="flex-1 overflow-y-auto px-5 py-4">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-3"
                        >

                            <Input
                                label="Supplier Name"
                                name="supplier_name"
                                value={
                                    form.supplier_name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />


                            <Input
                                label="Contact Person"
                                name="contact_person"
                                value={
                                    form.contact_person
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <Input
                                label="Phone"
                                name="phone"
                                type="tel"
                                value={
                                    form.phone
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <div>

                                <label className="mb-1 block text-[10px] font-semibold text-[#344054]">
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={
                                        form.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="3"
                                    className="w-full resize-none rounded-[5px] border border-[#d6deeb] px-3 py-2 text-[10px] outline-none focus:border-[#00549a] focus:ring-1 focus:ring-[#00549a]/10"
                                />

                            </div>


                            <div className="grid grid-cols-2 gap-3">

                                <Input
                                    label="City"
                                    name="city"
                                    value={
                                        form.city
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />


                                <Input
                                    label="Province"
                                    name="province"
                                    value={
                                        form.province
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <Input
                                label="Postal Code"
                                name="postal_code"
                                value={
                                    form.postal_code
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {/* BUTTONS */}

                            <div className="flex gap-2 pt-3">

                                <button
                                    type="submit"
                                    className="flex-1 rounded-[6px] bg-[#00549a] py-2.5 text-[10px] font-semibold text-white hover:bg-[#00447e]"
                                >

                                    {editingId
                                        ? "Update Supplier"
                                        : "Add Supplier"}

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
// DETAIL
// =============================================================

const Detail = ({
    label,
    value
}) => (

    <div className="border-b border-[#edf0f4] pb-2.5">

        <p className="text-[8px] font-semibold uppercase tracking-[0.3px] text-[#8a94a5]">
            {label}
        </p>

        <p className="mt-1 break-words text-[10px] text-[#475467]">
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

        <path d="M8 9h1M12 9h1M16 9h1" />

        <path d="M8 12h1M12 12h1M16 12h1" />

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


const DeleteIcon = () => (

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

        <path d="M18 6 6 18" />

        <path d="M6 6l12 12" />

    </svg>
);


export default Suppliers;