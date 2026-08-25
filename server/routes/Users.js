import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../db/connection.js";

const router = express.Router();


// ============================================================
// GET USERS
// GET /api/users
// ============================================================

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT

                u.user_id,
                u.role_id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                u.profile_image,
                u.department,
                u.status,
                u.last_login,
                u.created_at,
                u.updated_at,
                u.job_title,

                r.role_name

            FROM public.users u

            INNER JOIN public.roles r
                ON u.role_id = r.role_id

            ORDER BY u.user_id DESC
        `);


        res.status(200).json(result.rows);

    } catch (error) {

        console.error(
            "GET users error:",
            error
        );

        res.status(500).json({
            success: false,
            error: "Failed to fetch users"
        });
    }
});


// ============================================================
// GET ROLES
// GET /api/users/roles
// ============================================================

router.get("/roles", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                role_id,
                role_name,
                description
            FROM public.roles
            ORDER BY role_name ASC
        `);


        res.status(200).json(result.rows);

    } catch (error) {

        console.error(
            "GET roles error:",
            error
        );

        res.status(500).json({
            success: false,
            error: "Failed to fetch roles"
        });
    }
});


// ============================================================
// CREATE USER
// POST /api/users
// ============================================================

router.post("/", async (req, res) => {

    const {
        role_id,
        first_name,
        last_name,
        email,
        password,
        phone,
        department,
        job_title,
        status,
        profile_image
    } = req.body;


    if (
        !role_id ||
        !first_name ||
        !last_name ||
        !email ||
        !password
    ) {

        return res.status(400).json({
            success: false,
            error:
                "Role, first name, last name, email and password are required"
        });
    }


    try {

        const existingUser = await pool.query(
            `
            SELECT user_id
            FROM public.users
            WHERE LOWER(email) = LOWER($1)
            `,
            [email.trim()]
        );


        if (existingUser.rows.length > 0) {

            return res.status(409).json({
                success: false,
                error: "A user with this email already exists"
            });
        }


        const passwordHash =
            await bcrypt.hash(password, 10);


        const result = await pool.query(`
            INSERT INTO public.users
            (
                role_id,
                first_name,
                last_name,
                email,
                password_hash,
                phone,
                profile_image,
                department,
                status,
                job_title
            )
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)

            RETURNING
                user_id,
                role_id,
                first_name,
                last_name,
                email,
                phone,
                profile_image,
                department,
                status,
                job_title,
                created_at
        `, [
            Number(role_id),
            first_name.trim(),
            last_name.trim(),
            email.trim(),
            passwordHash,
            phone?.trim() || null,
            profile_image?.trim() || null,
            department?.trim() || null,
            status || "Active",
            job_title?.trim() || null
        ]);


        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: result.rows[0]
        });

    } catch (error) {

        console.error(
            "POST user error:",
            error
        );

        res.status(500).json({
            success: false,
            error: "Failed to create user"
        });
    }
});


// ============================================================
// UPDATE USER
// PUT /api/users/:id
// ============================================================

router.put("/:id", async (req, res) => {

    const { id } = req.params;

    const {
        role_id,
        first_name,
        last_name,
        email,
        password,
        phone,
        department,
        job_title,
        status,
        profile_image
    } = req.body;


    if (
        !role_id ||
        !first_name ||
        !last_name ||
        !email
    ) {

        return res.status(400).json({
            success: false,
            error:
                "Role, first name, last name and email are required"
        });
    }


    try {

        let query;
        let values;


        if (password && password.trim()) {

            const passwordHash =
                await bcrypt.hash(password, 10);


            query = `
                UPDATE public.users

                SET
                    role_id = $1,
                    first_name = $2,
                    last_name = $3,
                    email = $4,
                    password_hash = $5,
                    phone = $6,
                    profile_image = $7,
                    department = $8,
                    status = $9,
                    job_title = $10,
                    updated_at = CURRENT_TIMESTAMP

                WHERE user_id = $11

                RETURNING
                    user_id,
                    role_id,
                    first_name,
                    last_name,
                    email,
                    phone,
                    profile_image,
                    department,
                    status,
                    job_title,
                    updated_at
            `;


            values = [
                Number(role_id),
                first_name.trim(),
                last_name.trim(),
                email.trim(),
                passwordHash,
                phone?.trim() || null,
                profile_image?.trim() || null,
                department?.trim() || null,
                status || "Active",
                job_title?.trim() || null,
                Number(id)
            ];

        } else {

            query = `
                UPDATE public.users

                SET
                    role_id = $1,
                    first_name = $2,
                    last_name = $3,
                    email = $4,
                    phone = $5,
                    profile_image = $6,
                    department = $7,
                    status = $8,
                    job_title = $9,
                    updated_at = CURRENT_TIMESTAMP

                WHERE user_id = $10

                RETURNING
                    user_id,
                    role_id,
                    first_name,
                    last_name,
                    email,
                    phone,
                    profile_image,
                    department,
                    status,
                    job_title,
                    updated_at
            `;


            values = [
                Number(role_id),
                first_name.trim(),
                last_name.trim(),
                email.trim(),
                phone?.trim() || null,
                profile_image?.trim() || null,
                department?.trim() || null,
                status || "Active",
                job_title?.trim() || null,
                Number(id)
            ];
        }


        const result =
            await pool.query(query, values);


        if (!result.rows.length) {

            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: result.rows[0]
        });

    } catch (error) {

        console.error(
            "PUT user error:",
            error
        );

        res.status(500).json({
            success: false,
            error: "Failed to update user"
        });
    }
});


// ============================================================
// DELETE USER
// DELETE /api/users/:id
// ============================================================

router.delete("/:id", async (req, res) => {

    try {

        const result = await pool.query(`
            DELETE FROM public.users
            WHERE user_id = $1
            RETURNING user_id
        `, [Number(req.params.id)]);


        if (!result.rows.length) {

            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE user error:",
            error
        );

        res.status(500).json({
            success: false,
            error:
                "Unable to delete user. The user may be referenced by existing records."
        });
    }
});


export default router;