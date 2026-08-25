import React, { useEffect, useState } from "react";

const Users = () => {

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [editingUser, setEditingUser] =
        useState(null);

    const [search, setSearch] = useState("");


    const [form, setForm] = useState({
        role_id: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        department: "",
        job_title: "",
        status: "Active"
    });


    const fetchUsers = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/users"
            );

            const data = await response.json();

            setUsers(data);

        } catch (error) {

            console.error(
                "Users error:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    const fetchRoles = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/users/roles"
            );

            const data = await response.json();

            setRoles(data);

        } catch (error) {

            console.error(
                "Roles error:",
                error
            );
        }
    };


    useEffect(() => {

        fetchUsers();
        fetchRoles();

    }, []);


    const resetForm = () => {

        setForm({
            role_id: "",
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            phone: "",
            department: "",
            job_title: "",
            status: "Active"
        });

        setEditingUser(null);
    };


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const url = editingUser
                ? `http://localhost:5000/api/users/${editingUser.user_id}`
                : "http://localhost:5000/api/users";


            const method = editingUser
                ? "PUT"
                : "POST";


            const response = await fetch(
                url,
                {
                    method,
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(form)
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.error ||
                    "Unable to save user"
                );

                return;
            }


            alert(
                editingUser
                    ? "User updated successfully."
                    : "User created successfully."
            );


            setShowForm(false);

            resetForm();

            fetchUsers();

        } catch (error) {

            console.error(
                "Save user error:",
                error
            );

            alert(
                "Unable to save user."
            );
        }
    };


    const editUser = (user) => {

        setEditingUser(user);

        setForm({
            role_id: user.role_id || "",
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            password: "",
            phone: user.phone || "",
            department: user.department || "",
            job_title: user.job_title || "",
            status: user.status || "Active"
        });

        setShowForm(true);
    };


    const deleteUser = async (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this user?"
            )
        ) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/users/${id}`,
                {
                    method: "DELETE"
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.error ||
                    "Unable to delete user"
                );

                return;
            }


            fetchUsers();

        } catch (error) {

            console.error(
                "Delete user error:",
                error
            );
        }
    };


    const filteredUsers = users.filter(
        (user) => {

            const value =
                `${user.first_name} ${user.last_name} ${user.email} ${user.role_name}`
                    .toLowerCase();

            return value.includes(
                search.toLowerCase()
            );
        }
    );


    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">

            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-800">
                            User Management
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage MediStock system users
                        </p>

                    </div>


                    <button
                        onClick={() => {

                            resetForm();

                            setShowForm(true);

                        }}
                        className="rounded-lg bg-[#00549a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00427a]"
                    >
                        + Add User
                    </button>

                </div>


                {/* USER FORM */}

                {showForm && (

                    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="mb-5 flex items-center justify-between">

                            <h2 className="text-lg font-semibold text-slate-800">
                                {editingUser
                                    ? "Edit User"
                                    : "Add New User"}
                            </h2>

                            <button
                                onClick={() => {

                                    setShowForm(false);

                                    resetForm();

                                }}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                ✕
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-4 md:grid-cols-2"
                        >

                            <input
                                name="first_name"
                                placeholder="First Name"
                                value={form.first_name}
                                onChange={handleChange}
                                required
                                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#00549a]"
                            />


                            <input
                                name="last_name"
                                placeholder="Last Name"
                                value={form.last_name}
                                onChange={handleChange}
                                required
                                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#00549a]"
                            />


                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#00549a]"
                            />


                            <input
                                name="phone"
                                placeholder="Phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#00549a]"
                            />


                            <select
                                name="role_id"
                                value={form.role_id}
                                onChange={handleChange}
                                required
                                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#00549a]"
                            >

                                <option value="">
                                    Select Role
                                </option>

                                {roles.map(
                                    (role) => (

                                        <option
                                            key={role.role_id}
                                            value={role.role_id}
                                        >
                                            {
                                                role.role_name
                                            }
                                        </option>

                                    )
                                )}

                            </select>


                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#00549a]"
                            >

                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>

                            </select>


                            <input
                                name="department"
                                placeholder="Department"
                                value={form.department}
                                onChange={handleChange}
                                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#00549a]"
                            />


                            <input
                                name="job_title"
                                placeholder="Job Title"
                                value={form.job_title}
                                onChange={handleChange}
                                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#00549a]"
                            />


                            <input
                                name="password"
                                type="password"
                                placeholder={
                                    editingUser
                                        ? "New password (optional)"
                                        : "Password"
                                }
                                value={form.password}
                                onChange={handleChange}
                                required={!editingUser}
                                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#00549a]"
                            />


                            <div className="flex items-center gap-3 md:justify-end">

                                <button
                                    type="button"
                                    onClick={() => {

                                        setShowForm(false);

                                        resetForm();

                                    }}
                                    className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="rounded-lg bg-[#00549a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00427a]"
                                >
                                    {editingUser
                                        ? "Update User"
                                        : "Create User"}
                                </button>

                            </div>

                        </form>

                    </div>

                )}


                {/* USERS TABLE */}

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-4">

                        <input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#00549a]"
                        />

                    </div>


                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">

                                <tr>

                                    <th className="px-6 py-4">
                                        User
                                    </th>

                                    <th className="px-6 py-4">
                                        Email
                                    </th>

                                    <th className="px-6 py-4">
                                        Role
                                    </th>

                                    <th className="px-6 py-4">
                                        Department
                                    </th>

                                    <th className="px-6 py-4">
                                        Job Title
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="px-6 py-12 text-center"
                                        >
                                            Loading users...
                                        </td>

                                    </tr>

                                ) : filteredUsers.map(
                                    (user) => (

                                        <tr
                                            key={
                                                user.user_id
                                            }
                                            className="hover:bg-slate-50"
                                        >

                                            <td className="px-6 py-4">

                                                <div className="font-semibold text-slate-800">
                                                    {
                                                        user.first_name
                                                    }{" "}
                                                    {
                                                        user.last_name
                                                    }
                                                </div>

                                            </td>


                                            <td className="px-6 py-4 text-slate-600">
                                                {
                                                    user.email
                                                }
                                            </td>


                                            <td className="px-6 py-4">

                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-[#00549a]">
                                                    {
                                                        user.role_name
                                                    }
                                                </span>

                                            </td>


                                            <td className="px-6 py-4 text-slate-600">
                                                {
                                                    user.department ||
                                                    "-"
                                                }
                                            </td>


                                            <td className="px-6 py-4 text-slate-600">
                                                {
                                                    user.job_title ||
                                                    "-"
                                                }
                                            </td>


                                            <td className="px-6 py-4">

                                                <span
                                                    className={
                                                        user.status ===
                                                        "Active"
                                                            ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                                                            : "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                                                    }
                                                >
                                                    {
                                                        user.status
                                                    }
                                                </span>

                                            </td>


                                            <td className="px-6 py-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            editUser(
                                                                user
                                                            )
                                                        }
                                                        className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-[#00549a] hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            deleteUser(
                                                                user.user_id
                                                            )
                                                        }
                                                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Users;