import express from "express";

import { pool } from "../db/connection.js";


const router = express.Router();


// ============================================================
// GET ALL SUPPLIERS
// ============================================================

router.get(
    "/",
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    `
                    SELECT
                        supplier_id,
                        supplier_name,
                        contact_person,
                        email,
                        phone,
                        address,
                        city,
                        province,
                        postal_code

                    FROM public.suppliers

                    ORDER BY supplier_id DESC
                    `
                );


            res.status(200).json(
                result.rows
            );

        } catch (error) {

            console.error(
                "GET suppliers error:",
                error
            );


            res.status(500).json({

                success: false,

                error:
                    "Failed to fetch suppliers"

            });

        }

    }
);


// ============================================================
// GET ONE SUPPLIER
// ============================================================

router.get(
    "/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const result =
                await pool.query(
                    `
                    SELECT
                        supplier_id,
                        supplier_name,
                        contact_person,
                        email,
                        phone,
                        address,
                        city,
                        province,
                        postal_code

                    FROM public.suppliers

                    WHERE supplier_id = $1
                    `,
                    [id]
                );


            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    error:
                        "Supplier not found"

                });

            }


            res.status(200).json(
                result.rows[0]
            );

        } catch (error) {

            console.error(
                "GET supplier error:",
                error
            );


            res.status(500).json({

                success: false,

                error:
                    "Failed to fetch supplier"

            });

        }

    }
);


// ============================================================
// ADD SUPPLIER
// ============================================================

router.post(
    "/",
    async (req, res) => {

        const {
            supplier_name,
            contact_person,
            email,
            phone,
            address,
            city,
            province,
            postal_code
        } = req.body;


        if (
            !supplier_name ||
            !supplier_name.trim()
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Supplier name is required"

            });

        }


        try {

            const result =
                await pool.query(
                    `
                    INSERT INTO public.suppliers
                    (
                        supplier_name,
                        contact_person,
                        email,
                        phone,
                        address,
                        city,
                        province,
                        postal_code
                    )

                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6,
                        $7,
                        $8
                    )

                    RETURNING
                        supplier_id,
                        supplier_name,
                        contact_person,
                        email,
                        phone,
                        address,
                        city,
                        province,
                        postal_code
                    `,
                    [
                        supplier_name.trim(),
                        contact_person?.trim() || null,
                        email?.trim() || null,
                        phone?.trim() || null,
                        address?.trim() || null,
                        city?.trim() || null,
                        province?.trim() || null,
                        postal_code?.trim() || null
                    ]
                );


            res.status(201).json({

                success: true,

                message:
                    "Supplier added successfully",

                supplier:
                    result.rows[0]

            });

        } catch (error) {

            console.error(
                "POST supplier error:",
                error
            );


            res.status(500).json({

                success: false,

                error:
                    "Failed to add supplier",

                detail:
                    error.message

            });

        }

    }
);


// ============================================================
// UPDATE SUPPLIER
// ============================================================

router.put(
    "/:id",
    async (req, res) => {

        const {
            id
        } = req.params;


        const {
            supplier_name,
            contact_person,
            email,
            phone,
            address,
            city,
            province,
            postal_code
        } = req.body;


        if (
            !supplier_name ||
            !supplier_name.trim()
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Supplier name is required"

            });

        }


        try {

            const result =
                await pool.query(
                    `
                    UPDATE public.suppliers

                    SET
                        supplier_name = $1,
                        contact_person = $2,
                        email = $3,
                        phone = $4,
                        address = $5,
                        city = $6,
                        province = $7,
                        postal_code = $8

                    WHERE supplier_id = $9

                    RETURNING
                        supplier_id,
                        supplier_name,
                        contact_person,
                        email,
                        phone,
                        address,
                        city,
                        province,
                        postal_code
                    `,
                    [
                        supplier_name.trim(),
                        contact_person?.trim() || null,
                        email?.trim() || null,
                        phone?.trim() || null,
                        address?.trim() || null,
                        city?.trim() || null,
                        province?.trim() || null,
                        postal_code?.trim() || null,
                        id
                    ]
                );


            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    error:
                        "Supplier not found"

                });

            }


            res.status(200).json({

                success: true,

                message:
                    "Supplier updated successfully",

                supplier:
                    result.rows[0]

            });

        } catch (error) {

            console.error(
                "PUT supplier error:",
                error
            );


            res.status(500).json({

                success: false,

                error:
                    "Failed to update supplier",

                detail:
                    error.message

            });

        }

    }
);


// ============================================================
// DELETE SUPPLIER
// ============================================================

router.delete(
    "/:id",
    async (req, res) => {

        const {
            id
        } = req.params;


        try {

            const result =
                await pool.query(
                    `
                    DELETE FROM public.suppliers

                    WHERE supplier_id = $1

                    RETURNING supplier_id
                    `,
                    [id]
                );


            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    error:
                        "Supplier not found"

                });

            }


            res.status(200).json({

                success: true,

                message:
                    "Supplier deleted successfully"

            });

        } catch (error) {

            console.error(
                "DELETE supplier error:",
                error
            );


            res.status(409).json({

                success: false,

                error:
                    "Unable to delete supplier. It may be linked to existing inventory or purchase orders.",

                detail:
                    error.message

            });

        }

    }
);


export default router;