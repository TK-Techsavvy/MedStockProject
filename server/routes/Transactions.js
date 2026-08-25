import express from "express";
import { pool } from "../db/connection.js";

const router = express.Router();


// ============================================================
// GET ALL TRANSACTIONS
// GET /api/transactions
// ============================================================

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT

                t.transaction_id,
                t.transaction_number,
                t.transaction_type,
                t.transaction_date,
                t.department,
                t.remarks,
                t.status,
                t.created_at,

                l.location_name,

                CONCAT(
                    u.first_name,
                    ' ',
                    u.last_name
                ) AS performed_by_name

            FROM public.transactions t

            LEFT JOIN public.medicinelocations l
                ON t.location_id = l.location_id

            LEFT JOIN public.users u
                ON t.performed_by = u.user_id

            ORDER BY t.transaction_id DESC
        `);


        res.status(200).json(result.rows);

    } catch (error) {

        console.error(
            "GET transactions error:",
            error
        );

        res.status(500).json({
            success: false,
            error: "Failed to fetch transactions"
        });
    }
});


// ============================================================
// GET TRANSACTION DETAILS
// GET /api/transactions/:id
// ============================================================

router.get("/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const transaction = await pool.query(`
            SELECT
                t.*,
                l.location_name,

                CONCAT(
                    u.first_name,
                    ' ',
                    u.last_name
                ) AS performed_by_name

            FROM public.transactions t

            LEFT JOIN public.medicinelocations l
                ON t.location_id = l.location_id

            LEFT JOIN public.users u
                ON t.performed_by = u.user_id

            WHERE t.transaction_id = $1
        `, [Number(id)]);


        if (transaction.rows.length === 0) {

            return res.status(404).json({
                success: false,
                error: "Transaction not found"
            });
        }


        const items = await pool.query(`
            SELECT
                ti.*,
                m.medicine_name,
                mb.batch_number

            FROM public.transactionitems ti

            LEFT JOIN public.medicines m
                ON ti.medicine_id = m.medicine_id

            LEFT JOIN public.medicinebatches mb
                ON ti.batch_id = mb.batch_id

            WHERE ti.transaction_id = $1

            ORDER BY ti.transaction_item_id ASC
        `, [Number(id)]);


        res.status(200).json({
            success: true,
            transaction: transaction.rows[0],
            items: items.rows
        });

    } catch (error) {

        console.error(
            "GET transaction error:",
            error
        );

        res.status(500).json({
            success: false,
            error: "Failed to fetch transaction"
        });
    }
});


// ============================================================
// CREATE TRANSACTION
// POST /api/transactions
// ============================================================

router.post("/", async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            transaction_number,
            transaction_type,
            transaction_date,
            location_id,
            performed_by,
            department,
            remarks,
            status,
            items = []
        } = req.body;


        if (!transaction_number) {

            return res.status(400).json({
                success: false,
                error: "Transaction number is required"
            });
        }


        if (!transaction_type) {

            return res.status(400).json({
                success: false,
                error: "Transaction type is required"
            });
        }


        if (!performed_by) {

            return res.status(400).json({
                success: false,
                error: "Performed by user is required"
            });
        }


        if (!items.length) {

            return res.status(400).json({
                success: false,
                error: "At least one transaction item is required"
            });
        }


        await client.query("BEGIN");


        const transactionResult = await client.query(`
            INSERT INTO public.transactions
            (
                transaction_number,
                transaction_type,
                transaction_date,
                location_id,
                performed_by,
                department,
                remarks,
                status
            )
            VALUES
            (
                $1,
                $2,
                COALESCE($3, CURRENT_TIMESTAMP),
                $4,
                $5,
                $6,
                $7,
                COALESCE($8, 'Completed')
            )

            RETURNING *
        `, [
            transaction_number.trim(),
            transaction_type,
            transaction_date || null,
            location_id ? Number(location_id) : null,
            Number(performed_by),
            department?.trim() || null,
            remarks?.trim() || null,
            status || null
        ]);


        const transaction = transactionResult.rows[0];


        for (const item of items) {

            await client.query(`
                INSERT INTO public.transactionitems
                (
                    transaction_id,
                    medicine_id,
                    batch_id,
                    quantity,
                    unit_cost,
                    expiry_date,
                    notes
                )
                VALUES
                ($1, $2, $3, $4, $5, $6, $7)
            `, [
                transaction.transaction_id,
                Number(item.medicine_id),
                item.batch_id
                    ? Number(item.batch_id)
                    : null,
                Number(item.quantity),
                item.unit_cost !== undefined
                    ? Number(item.unit_cost)
                    : null,
                item.expiry_date || null,
                item.notes?.trim() || null
            ]);
        }


        await client.query("COMMIT");


        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "POST transaction error:",
            error
        );

        res.status(500).json({
            success: false,
            error: "Failed to create transaction",
            detail: error.message
        });

    } finally {

        client.release();
    }
});


export default router;