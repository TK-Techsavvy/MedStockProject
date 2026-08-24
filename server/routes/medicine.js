import express from "express";
import { pool } from "../db/connection.js";

const router = express.Router();


// ============================================================
// GET ALL MEDICINES
// ============================================================

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT

                m.*,

                c.category_name,

                s.supplier_name,

                l.location_name,

                CASE
                    WHEN m.quantity <= m.reorder_level
                        THEN 'Critical'

                    WHEN m.quantity <= (m.reorder_level * 2)
                        THEN 'Moderate'

                    ELSE 'Healthy'
                END AS stock_level

            FROM public.medicines m

            LEFT JOIN public.categories c
                ON m.category_id = c.category_id

            LEFT JOIN public.suppliers s
                ON m.supplier_id = s.supplier_id

            LEFT JOIN public.medicinelocations l
                ON m.location_id = l.location_id

            ORDER BY m.medicine_id ASC
        `);


        res.status(200).json(result.rows);

    } catch (error) {

        console.error("=================================");
        console.error("ERROR FETCHING MEDICINES");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Detail:", error.detail);
        console.error("Hint:", error.hint);
        console.error("=================================");


        res.status(500).json({
            success: false,
            error: "Failed to fetch medicines",
            detail: error.message
        });
    }
});


// ============================================================
// GET CATEGORIES
// ============================================================

router.get("/categories", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                category_id,
                category_name
            FROM public.categories
            ORDER BY category_name ASC
        `);


        res.status(200).json(result.rows);

    } catch (error) {

        console.error("=================================");
        console.error("ERROR FETCHING CATEGORIES");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Detail:", error.detail);
        console.error("Hint:", error.hint);
        console.error("=================================");


        res.status(500).json({
            success: false,
            error: "Failed to fetch categories",
            detail: error.message
        });
    }
});


// ============================================================
// GET SUPPLIERS
// ============================================================

router.get("/suppliers", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                supplier_id,
                supplier_name
            FROM public.suppliers
            ORDER BY supplier_name ASC
        `);


        res.status(200).json(result.rows);

    } catch (error) {

        console.error("=================================");
        console.error("ERROR FETCHING SUPPLIERS");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Detail:", error.detail);
        console.error("Hint:", error.hint);
        console.error("=================================");


        res.status(500).json({
            success: false,
            error: "Failed to fetch suppliers",
            detail: error.message
        });
    }
});


// ============================================================
// GET LOCATIONS
// ============================================================

router.get("/locations", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                location_id,
                location_name
            FROM public.medicinelocations
            ORDER BY location_name ASC
        `);


        res.status(200).json(result.rows);

    } catch (error) {

        console.error("=================================");
        console.error("ERROR FETCHING LOCATIONS");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Detail:", error.detail);
        console.error("Hint:", error.hint);
        console.error("=================================");


        res.status(500).json({
            success: false,
            error: "Failed to fetch locations",
            detail: error.message
        });
    }
});


// ============================================================
// ADD MEDICINE
// ============================================================

router.post("/", async (req, res) => {

    const {

        category_id,
        supplier_id,
        location_id,

        medicine_name,
        generic_name,
        brand_name,

        dosage,
        dosage_form,
        strength,

        barcode,
        sku,

        manufacturer,

        unit_price,
        reorder_level,
        quantity,

        batch_number,
        manufacturing_date,
        expiry_date,
        last_audit_date,

        description,

        requires_prescription,

        status,

        medicine_image,

        storage_condition

    } = req.body;


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!category_id) {

        return res.status(400).json({
            success: false,
            error: "Category is required"
        });
    }


    if (!supplier_id) {

        return res.status(400).json({
            success: false,
            error: "Supplier is required"
        });
    }


    if (!medicine_name || !medicine_name.trim()) {

        return res.status(400).json({
            success: false,
            error: "Medicine name is required"
        });
    }


    if (
        unit_price === undefined ||
        unit_price === null ||
        unit_price === ""
    ) {

        return res.status(400).json({
            success: false,
            error: "Unit price is required"
        });
    }


    // ========================================================
    // INSERT
    // ========================================================

    try {

        const result = await pool.query(
            `
            INSERT INTO public.medicines (

                category_id,
                supplier_id,
                location_id,

                medicine_name,
                generic_name,
                brand_name,

                dosage,
                dosage_form,
                strength,

                barcode,
                sku,

                manufacturer,

                unit_price,
                reorder_level,
                quantity,

                batch_number,
                manufacturing_date,
                expiry_date,
                last_audit_date,

                description,

                requires_prescription,

                status,

                medicine_image,

                storage_condition

            )

            VALUES (

                $1,
                $2,
                $3,

                $4,
                $5,
                $6,

                $7,
                $8,
                $9,

                $10,
                $11,

                $12,

                $13,
                $14,
                $15,

                $16,
                $17,
                $18,
                $19,

                $20,

                $21,

                $22,

                $23,

                $24

            )

            RETURNING *
            `,

            [

                Number(category_id),

                Number(supplier_id),

                location_id
                    ? Number(location_id)
                    : null,


                medicine_name.trim(),

                generic_name?.trim() || null,

                brand_name?.trim() || null,


                dosage?.trim() || null,

                dosage_form?.trim() || null,

                strength?.trim() || null,


                barcode?.trim() || null,

                sku?.trim() || null,


                manufacturer?.trim() || null,


                Number(unit_price),

                reorder_level
                    ? Number(reorder_level)
                    : 0,

                quantity
                    ? Number(quantity)
                    : 0,


                batch_number?.trim() || null,


                manufacturing_date
                    || null,


                expiry_date
                    || null,


                last_audit_date
                    || null,


                description?.trim() || null,


                Boolean(requires_prescription),


                status || "Active",


                medicine_image?.trim() || null,


                storage_condition?.trim() || null

            ]
        );


        res.status(201).json({

            success: true,

            message:
                "Medicine added successfully",

            medicine:
                result.rows[0]

        });


    } catch (error) {

        console.error("=================================");
        console.error("ERROR ADDING MEDICINE");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Detail:", error.detail);
        console.error("Hint:", error.hint);
        console.error("=================================");


        res.status(500).json({

            success: false,

            error:
                "Failed to add medicine",

            detail:
                error.message

        });
    }
});


// ============================================================
// UPDATE MEDICINE
// ============================================================

router.put("/:id", async (req, res) => {

    const { id } = req.params;


    const {

        category_id,
        supplier_id,
        location_id,

        medicine_name,
        generic_name,
        brand_name,

        dosage,
        dosage_form,
        strength,

        barcode,
        sku,

        manufacturer,

        unit_price,
        reorder_level,
        quantity,

        batch_number,
        manufacturing_date,
        expiry_date,
        last_audit_date,

        description,

        requires_prescription,

        status,

        medicine_image,

        storage_condition

    } = req.body;


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!category_id) {

        return res.status(400).json({
            success: false,
            error: "Category is required"
        });
    }


    if (!supplier_id) {

        return res.status(400).json({
            success: false,
            error: "Supplier is required"
        });
    }


    if (!medicine_name || !medicine_name.trim()) {

        return res.status(400).json({
            success: false,
            error: "Medicine name is required"
        });
    }


    if (
        unit_price === undefined ||
        unit_price === null ||
        unit_price === ""
    ) {

        return res.status(400).json({
            success: false,
            error: "Unit price is required"
        });
    }


    // ========================================================
    // UPDATE
    // ========================================================

    try {

        const result = await pool.query(
            `
            UPDATE public.medicines

            SET

                category_id = $1,

                supplier_id = $2,

                location_id = $3,

                medicine_name = $4,

                generic_name = $5,

                brand_name = $6,

                dosage = $7,

                dosage_form = $8,

                strength = $9,

                barcode = $10,

                sku = $11,

                manufacturer = $12,

                unit_price = $13,

                reorder_level = $14,

                quantity = $15,

                batch_number = $16,

                manufacturing_date = $17,

                expiry_date = $18,

                last_audit_date = $19,

                description = $20,

                requires_prescription = $21,

                status = $22,

                medicine_image = $23,

                storage_condition = $24,

                updated_at = CURRENT_TIMESTAMP

            WHERE medicine_id = $25

            RETURNING *
            `,

            [

                Number(category_id),

                Number(supplier_id),

                location_id
                    ? Number(location_id)
                    : null,


                medicine_name.trim(),

                generic_name?.trim() || null,

                brand_name?.trim() || null,


                dosage?.trim() || null,

                dosage_form?.trim() || null,

                strength?.trim() || null,


                barcode?.trim() || null,

                sku?.trim() || null,


                manufacturer?.trim() || null,


                Number(unit_price),

                reorder_level
                    ? Number(reorder_level)
                    : 0,

                quantity
                    ? Number(quantity)
                    : 0,


                batch_number?.trim() || null,

                manufacturing_date
                    || null,

                expiry_date
                    || null,

                last_audit_date
                    || null,


                description?.trim() || null,


                Boolean(requires_prescription),


                status || "Active",


                medicine_image?.trim() || null,


                storage_condition?.trim() || null,


                Number(id)

            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error:
                    "Medicine not found"

            });
        }


        res.status(200).json({

            success: true,

            message:
                "Medicine updated successfully",

            medicine:
                result.rows[0]

        });


    } catch (error) {

        console.error("=================================");
        console.error("ERROR UPDATING MEDICINE");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Detail:", error.detail);
        console.error("Hint:", error.hint);
        console.error("=================================");


        res.status(500).json({

            success: false,

            error:
                "Failed to update medicine",

            detail:
                error.message

        });
    }
});


// ============================================================
// DELETE MEDICINE
// ============================================================

router.delete("/:id", async (req, res) => {

    const { id } = req.params;


    try {

        const result = await pool.query(
            `
            DELETE FROM public.medicines

            WHERE medicine_id = $1

            RETURNING medicine_id
            `,

            [Number(id)]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error:
                    "Medicine not found"

            });
        }


        res.status(200).json({

            success: true,

            message:
                "Medicine deleted successfully"

        });


    } catch (error) {

        console.error("=================================");
        console.error("ERROR DELETING MEDICINE");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Detail:", error.detail);
        console.error("Hint:", error.hint);
        console.error("=================================");


        res.status(500).json({

            success: false,

            error:
                "Failed to delete medicine",

            detail:
                error.message

        });
    }
});


export default router;