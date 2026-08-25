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

                COALESCE(
                    SUM(ms.current_quantity),
                    0
                ) AS quantity,

                COALESCE(
                    SUM(ms.current_quantity),
                    0
                ) AS current_stock,

                COALESCE(
                    SUM(ms.current_quantity),
                    0
                ) AS stock_quantity,

                COALESCE(
                    SUM(ms.current_quantity),
                    0
                ) AS stock_level,

                CASE
                    WHEN COALESCE(SUM(ms.current_quantity), 0)
                         <= m.reorder_level
                    THEN 'Critical'

                    WHEN COALESCE(SUM(ms.current_quantity), 0)
                         <= m.reorder_level + 20
                    THEN 'Low'

                    ELSE 'Normal'
                END AS stock_status

            FROM medicines m

            LEFT JOIN categories c
                ON m.category_id = c.category_id

            LEFT JOIN suppliers s
                ON m.supplier_id = s.supplier_id

            LEFT JOIN medicinelocations l
                ON m.location_id = l.location_id

            LEFT JOIN medicinestock ms
                ON m.medicine_id = ms.medicine_id

            GROUP BY
                m.medicine_id,
                c.category_name,
                s.supplier_name,
                l.location_name

            ORDER BY
                m.medicine_name ASC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(
            "GET MEDICINES ERROR:",
            error
        );

        res.status(500).json({
            error: "Failed to fetch medicines"
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
            FROM categories
            ORDER BY category_name ASC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(
            "GET CATEGORIES ERROR:",
            error
        );

        res.status(500).json({
            error: "Failed to fetch categories"
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
            FROM suppliers
            WHERE status = 'Active'
            ORDER BY supplier_name ASC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(
            "GET SUPPLIERS ERROR:",
            error
        );

        res.status(500).json({
            error: "Failed to fetch suppliers"
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
            FROM medicinelocations
            ORDER BY location_name ASC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(
            "GET LOCATIONS ERROR:",
            error
        );

        res.status(500).json({
            error: "Failed to fetch locations"
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
        unit_price,
        reorder_level,
        description,
        requires_prescription,
        status,
        sku,
        manufacturer,
        medicine_image,
        storage_condition
    } = req.body;

    try {

        if (
            !category_id ||
            !supplier_id ||
            !medicine_name ||
            !unit_price
        ) {

            return res.status(400).json({
                error:
                    "Category, supplier, medicine name and unit price are required."
            });
        }


        const result = await pool.query(
            `
            INSERT INTO medicines (
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
                unit_price,
                reorder_level,
                description,
                requires_prescription,
                status,
                sku,
                manufacturer,
                medicine_image,
                storage_condition
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                $11,$12,$13,$14,$15,$16,$17,$18,$19
            )
            RETURNING *
            `,
            [
                category_id,
                supplier_id,
                location_id || null,
                medicine_name,
                generic_name || null,
                brand_name || null,
                dosage || null,
                dosage_form || null,
                strength || null,
                barcode || null,
                unit_price,
                reorder_level || 10,
                description || null,
                requires_prescription || false,
                status || "Active",
                sku || null,
                manufacturer || null,
                medicine_image || null,
                storage_condition || null
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(
            "ADD MEDICINE ERROR:",
            error
        );

        res.status(500).json({
            error:
                error.code === "23505"
                    ? "Barcode or SKU already exists."
                    : "Failed to add medicine."
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
        unit_price,
        reorder_level,
        description,
        requires_prescription,
        status,
        sku,
        manufacturer,
        medicine_image,
        storage_condition
    } = req.body;

    try {

        const result = await pool.query(
            `
            UPDATE medicines

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
                unit_price = $11,
                reorder_level = $12,
                description = $13,
                requires_prescription = $14,
                status = $15,
                sku = $16,
                manufacturer = $17,
                medicine_image = $18,
                storage_condition = $19,
                updated_at = CURRENT_TIMESTAMP

            WHERE medicine_id = $20

            RETURNING *
            `,
            [
                category_id,
                supplier_id,
                location_id || null,
                medicine_name,
                generic_name || null,
                brand_name || null,
                dosage || null,
                dosage_form || null,
                strength || null,
                barcode || null,
                unit_price,
                reorder_level || 10,
                description || null,
                requires_prescription || false,
                status || "Active",
                sku || null,
                manufacturer || null,
                medicine_image || null,
                storage_condition || null,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Medicine not found."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(
            "UPDATE MEDICINE ERROR:",
            error
        );

        res.status(500).json({
            error: "Failed to update medicine."
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
            DELETE FROM medicines
            WHERE medicine_id = $1
            RETURNING medicine_id
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Medicine not found."
            });
        }

        res.json({
            message: "Medicine deleted successfully."
        });

    } catch (error) {

        console.error(
            "DELETE MEDICINE ERROR:",
            error
        );

        res.status(500).json({
            error: "Failed to delete medicine."
        });
    }
});


export default router;