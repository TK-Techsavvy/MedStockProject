import express from "express";
import { pool } from "../db/connection.js";

const router = express.Router();


// ============================================================
// GET ALL ORDERS
// GET /api/orders
// ============================================================

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                po.purchase_order_id,
                po.order_number,
                po.order_date,
                po.expected_delivery,
                po.total_amount,
                po.order_status,
                po.notes,
                po.created_at,
                po.actual_delivery_date,

                po.supplier_id,
                po.ordered_by,

                s.supplier_name,

                CONCAT(
                    u.first_name,
                    ' ',
                    u.last_name
                ) AS ordered_by_name

            FROM public.purchaseorders po

            LEFT JOIN public.suppliers s
                ON po.supplier_id = s.supplier_id

            LEFT JOIN public.users u
                ON po.ordered_by = u.user_id

            ORDER BY po.purchase_order_id DESC
        `);

        res.status(200).json(result.rows);

    } catch (error) {

        console.error("GET orders error:", error);

        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch orders"
        });

    }

});


// ============================================================
// GET SINGLE ORDER
// GET /api/orders/:id
// ============================================================

router.get("/:id", async (req, res) => {

    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {

        return res.status(400).json({
            success: false,
            error: "Invalid order ID"
        });

    }

    try {

        const orderResult = await pool.query(`
            SELECT
                po.*,

                s.supplier_name,

                CONCAT(
                    u.first_name,
                    ' ',
                    u.last_name
                ) AS ordered_by_name

            FROM public.purchaseorders po

            LEFT JOIN public.suppliers s
                ON po.supplier_id = s.supplier_id

            LEFT JOIN public.users u
                ON po.ordered_by = u.user_id

            WHERE po.purchase_order_id = $1
        `, [orderId]);


        if (orderResult.rows.length === 0) {

            return res.status(404).json({
                success: false,
                error: "Order not found"
            });

        }


        const itemsResult = await pool.query(`
            SELECT
                poi.purchase_order_item_id,
                poi.purchase_order_id,
                poi.medicine_id,
                poi.quantity,
                poi.unit_price,
                poi.total_price,
                COALESCE(poi.quantity_received, 0) AS quantity_received,

                m.medicine_name,
                COALESCE(m.quantity, 0) AS current_stock,
                m.reorder_level

            FROM public.purchaseorderitems poi

            LEFT JOIN public.medicines m
                ON poi.medicine_id = m.medicine_id

            WHERE poi.purchase_order_id = $1

            ORDER BY poi.purchase_order_item_id ASC
        `, [orderId]);


        res.status(200).json({

            success: true,

            order: orderResult.rows[0],

            items: itemsResult.rows

        });

    } catch (error) {

        console.error("GET order error:", error);

        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch order"
        });

    }

});


// ============================================================
// CREATE PURCHASE ORDER
// POST /api/orders
// ============================================================

router.post("/", async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            supplier_id,
            ordered_by,
            order_number,
            order_date,
            expected_delivery,
            notes,
            items
        } = req.body;


        // ----------------------------------------------------
        // VALIDATE SUPPLIER
        // ----------------------------------------------------

        const supplierId = Number(supplier_id);

        if (!Number.isInteger(supplierId) || supplierId <= 0) {

            return res.status(400).json({
                success: false,
                error: "A valid supplier is required"
            });

        }


        // ----------------------------------------------------
        // VALIDATE USER
        // ----------------------------------------------------

        const orderedBy = Number(ordered_by);

        if (!Number.isInteger(orderedBy) || orderedBy <= 0) {

            return res.status(400).json({
                success: false,
                error: "A valid ordering user is required"
            });

        }


        // ----------------------------------------------------
        // VALIDATE ORDER NUMBER
        // ----------------------------------------------------

        if (
            typeof order_number !== "string" ||
            order_number.trim() === ""
        ) {

            return res.status(400).json({
                success: false,
                error: "Order number is required"
            });

        }


        // ----------------------------------------------------
        // VALIDATE ITEMS
        // ----------------------------------------------------

        if (!Array.isArray(items) || items.length === 0) {

            return res.status(400).json({
                success: false,
                error: "At least one order item is required"
            });

        }


        // ----------------------------------------------------
        // CLEAN ITEMS
        // ----------------------------------------------------

        const cleanItems = [];


        for (const item of items) {

            const medicineId = Number(item.medicine_id);

            const quantity = Number(item.quantity);

            const unitPrice = Number(item.unit_price);


            if (
                !Number.isInteger(medicineId) ||
                medicineId <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    error: "Every order item must have a valid medicine"
                });

            }


            if (
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    error:
                        "Every order item must have a quantity greater than zero"
                });

            }


            if (
                !Number.isFinite(unitPrice) ||
                unitPrice < 0
            ) {

                return res.status(400).json({
                    success: false,
                    error:
                        "Every order item must have a valid unit price"
                });

            }


            cleanItems.push({

                medicine_id: medicineId,

                quantity,

                unit_price: unitPrice

            });

        }


        await client.query("BEGIN");


        // ----------------------------------------------------
        // CHECK SUPPLIER
        // ----------------------------------------------------

        const supplierResult = await client.query(`
            SELECT supplier_id
            FROM public.suppliers
            WHERE supplier_id = $1
        `, [supplierId]);


        if (supplierResult.rows.length === 0) {

            throw new Error("Supplier not found");

        }


        // ----------------------------------------------------
        // CHECK USER
        // ----------------------------------------------------

        const userResult = await client.query(`
            SELECT user_id
            FROM public.users
            WHERE user_id = $1
        `, [orderedBy]);


        if (userResult.rows.length === 0) {

            throw new Error("Ordering user not found");

        }


        // ----------------------------------------------------
        // CHECK ORDER NUMBER
        // ----------------------------------------------------

        const duplicateResult = await client.query(`
            SELECT purchase_order_id
            FROM public.purchaseorders
            WHERE order_number = $1
        `, [order_number.trim()]);


        if (duplicateResult.rows.length > 0) {

            throw new Error(
                "An order with this order number already exists"
            );

        }


        // ----------------------------------------------------
        // CHECK MEDICINES
        // ----------------------------------------------------

        for (const item of cleanItems) {

            const medicineResult = await client.query(`
                SELECT
                    medicine_id,
                    medicine_name
                FROM public.medicines
                WHERE medicine_id = $1
            `, [item.medicine_id]);


            if (medicineResult.rows.length === 0) {

                throw new Error(
                    `Medicine with ID ${item.medicine_id} was not found`
                );

            }

        }


        // ----------------------------------------------------
        // CALCULATE TOTAL
        // ----------------------------------------------------

        let totalAmount = 0;


        for (const item of cleanItems) {

            totalAmount +=
                item.quantity *
                item.unit_price;

        }


        // ----------------------------------------------------
        // CREATE PURCHASE ORDER
        // ----------------------------------------------------

        const orderResult = await client.query(`
            INSERT INTO public.purchaseorders
            (
                supplier_id,
                ordered_by,
                order_number,
                order_date,
                expected_delivery,
                total_amount,
                order_status,
                notes
            )

            VALUES
            (
                $1,
                $2,
                $3,
                COALESCE($4::date, CURRENT_DATE),
                $5::date,
                $6,
                'Pending',
                $7
            )

            RETURNING *
        `, [

            supplierId,

            orderedBy,

            order_number.trim(),

            order_date || null,

            expected_delivery || null,

            totalAmount,

            notes?.trim() || null

        ]);


        const order = orderResult.rows[0];


// ----------------------------------------------------
// CREATE ORDER ITEMS
// ----------------------------------------------------

for (const item of cleanItems) {

    await client.query(`
        INSERT INTO public.purchaseorderitems
        (
            purchase_order_id,
            medicine_id,
            quantity,
            unit_price,
            quantity_received
        )

        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            0
        )
    `, [

        order.purchase_order_id,

        item.medicine_id,

        item.quantity,

        item.unit_price

    ]);

}


        await client.query("COMMIT");


        res.status(201).json({

            success: true,

            message: "Purchase order created successfully",

            order

        });

    } catch (error) {

        try {

            await client.query("ROLLBACK");

        } catch (rollbackError) {

            console.error(
                "ROLLBACK ERROR:",
                rollbackError
            );

        }


        console.error(
            "POST order error:",
            error
        );


        res.status(500).json({

            success: false,

            error:
                error.message ||
                "Failed to create order"

        });

    } finally {

        client.release();

    }

});


// ============================================================
// RECEIVE / RESTOCK PURCHASE ORDER
// POST /api/orders/:id/receive
// ============================================================

router.post("/:id/receive", async (req, res) => {

    const client = await pool.connect();

    try {

        const orderId =
            Number(req.params.id);

        const {
            performed_by,
            items,
            actual_delivery_date
        } = req.body;


        // ----------------------------------------------------
        // VALIDATE ORDER ID
        // ----------------------------------------------------

        if (
            !Number.isInteger(orderId) ||
            orderId <= 0
        ) {

            return res.status(400).json({
                success: false,
                error: "Invalid order ID"
            });

        }


        // ----------------------------------------------------
        // VALIDATE USER
        // ----------------------------------------------------

        const performedBy =
            Number(performed_by);


        if (
            !Number.isInteger(performedBy) ||
            performedBy <= 0
        ) {

            return res.status(400).json({
                success: false,
                error:
                    "A valid receiving user is required"
            });

        }


        // ----------------------------------------------------
        // VALIDATE ITEMS
        // ----------------------------------------------------

        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                success: false,
                error:
                    "At least one medicine must be received"
            });

        }


        await client.query("BEGIN");


        // ----------------------------------------------------
        // CHECK USER
        // ----------------------------------------------------

        const userResult = await client.query(`
            SELECT user_id
            FROM public.users
            WHERE user_id = $1
        `, [performedBy]);


        if (userResult.rows.length === 0) {

            throw new Error(
                "Receiving user was not found"
            );

        }


        // ----------------------------------------------------
        // GET ORDER
        // ----------------------------------------------------

        const orderResult =
            await client.query(`
                SELECT *
                FROM public.purchaseorders
                WHERE purchase_order_id = $1
                FOR UPDATE
            `, [orderId]);


        if (orderResult.rows.length === 0) {

            throw new Error("Order not found");

        }


        const order =
            orderResult.rows[0];


        // ----------------------------------------------------
        // PREVENT RECEIVING COMPLETED ORDER
        // ----------------------------------------------------

        if (
            order.order_status === "Received" ||
            order.order_status === "Completed"
        ) {

            throw new Error(
                "This order has already been fully received"
            );

        }


        const receivedItems = [];


        // ----------------------------------------------------
        // PROCESS EACH RECEIVED ITEM
        // ----------------------------------------------------

        for (const item of items) {

            const orderItemId =
                Number(
                    item.purchase_order_item_id
                );

            const receiveQuantity =
                Number(
                    item.quantity_received
                );


            if (
                !Number.isInteger(orderItemId) ||
                orderItemId <= 0
            ) {

                throw new Error(
                    "Invalid purchase order item"
                );

            }


            if (
                !Number.isInteger(receiveQuantity) ||
                receiveQuantity <= 0
            ) {

                throw new Error(
                    "Received quantity must be a whole number greater than zero"
                );

            }


            // ------------------------------------------------
            // GET ORDER ITEM
            // ------------------------------------------------

            const orderItemResult =
                await client.query(`
                    SELECT
                        poi.*,

                        m.medicine_name,

                        COALESCE(
                            m.quantity,
                            0
                        ) AS current_stock

                    FROM public.purchaseorderitems poi

                    INNER JOIN public.medicines m
                        ON poi.medicine_id =
                           m.medicine_id

                    WHERE
                        poi.purchase_order_item_id = $1

                        AND

                        poi.purchase_order_id = $2

                    FOR UPDATE
                `, [

                    orderItemId,

                    orderId

                ]);


            if (orderItemResult.rows.length === 0) {

                throw new Error(
                    `Order item ${orderItemId} was not found`
                );

            }


            const orderItem =
                orderItemResult.rows[0];


            const alreadyReceived =
                Number(
                    orderItem.quantity_received || 0
                );


            const orderedQuantity =
                Number(
                    orderItem.quantity
                );


            const remainingQuantity =
                orderedQuantity -
                alreadyReceived;


            if (
                receiveQuantity >
                remainingQuantity
            ) {

                throw new Error(
                    `Cannot receive ${receiveQuantity} units of ${orderItem.medicine_name}. Only ${remainingQuantity} units remain on the order.`
                );

            }


            // ------------------------------------------------
            // UPDATE ORDER ITEM
            // ------------------------------------------------

            await client.query(`
                UPDATE public.purchaseorderitems

                SET
                    quantity_received =
                        COALESCE(
                            quantity_received,
                            0
                        ) + $1

                WHERE
                    purchase_order_item_id = $2
            `, [

                receiveQuantity,

                orderItemId

            ]);


            // ------------------------------------------------
            // UPDATE MEDICINE STOCK
            // ------------------------------------------------

            await client.query(`
                UPDATE public.medicines

                SET
                    quantity =
                        COALESCE(
                            quantity,
                            0
                        ) + $1,

                    updated_at =
                        CURRENT_TIMESTAMP

                WHERE medicine_id = $2
            `, [

                receiveQuantity,

                orderItem.medicine_id

            ]);


            receivedItems.push({

                medicine_id:
                    orderItem.medicine_id,

                medicine_name:
                    orderItem.medicine_name,

                quantity:
                    receiveQuantity,

                unit_price:
                    Number(orderItem.unit_price)

            });

        }


        // ----------------------------------------------------
        // DETERMINE NEW ORDER STATUS
        // ----------------------------------------------------

        const remainingResult =
            await client.query(`
                SELECT
                    COALESCE(
                        SUM(
                            quantity -
                            COALESCE(
                                quantity_received,
                                0
                            )
                        ),
                        0
                    ) AS remaining_quantity

                FROM public.purchaseorderitems

                WHERE purchase_order_id = $1
            `, [orderId]);


        const remainingOrderQuantity =
            Number(
                remainingResult.rows[0]
                    .remaining_quantity
            );


        const newStatus =
            remainingOrderQuantity === 0
                ? "Received"
                : "Partially Received";


// ----------------------------------------------------
// UPDATE PURCHASE ORDER
// ----------------------------------------------------

await client.query(`
    UPDATE public.purchaseorders

    SET
        order_status = $1::varchar,

        actual_delivery_date =
            CASE
                WHEN $2::date IS NOT NULL
                    THEN $2::date
                WHEN $1::varchar = 'Received'
                    THEN CURRENT_DATE
                ELSE actual_delivery_date
            END

    WHERE purchase_order_id = $3::integer
`, [

    String(newStatus),

    actual_delivery_date || null,

    Number(orderId)

]);


        // ----------------------------------------------------
        // CREATE STOCK-IN TRANSACTION
        // ----------------------------------------------------

        const transactionNumber =
        `RESTOCK-${order.purchase_order_id}-${Date.now().toString().slice(-10)}`;


        const transactionResult =
            await client.query(`
                INSERT INTO public.transactions
                (
                    transaction_number,
                    transaction_type,
                    transaction_date,
                    performed_by,
                    remarks,
                    status
                )

                VALUES
                (
                    $1,
                    'Stock In',
                    CURRENT_TIMESTAMP,
                    $2,
                    $3,
                    'Completed'
                )

                RETURNING *
            `, [

                transactionNumber,

                performedBy,

                `Stock received from purchase order ${order.order_number}`

            ]);


        const transaction =
            transactionResult.rows[0];


        // ----------------------------------------------------
        // CREATE TRANSACTION ITEMS
        // ----------------------------------------------------

        for (const item of receivedItems) {

            await client.query(`
                INSERT INTO public.transactionitems
                (
                    transaction_id,
                    medicine_id,
                    quantity,
                    unit_cost,
                    notes
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                )
            `, [

                transaction.transaction_id,

                item.medicine_id,

                item.quantity,

                item.unit_price,

                `Restocked from purchase order ${order.order_number}`

            ]);

        }


        await client.query("COMMIT");


        res.status(200).json({

            success: true,

            message:
                "Medicine restocked successfully",

            order_status:
                newStatus,

            transaction,

            received_items:
                receivedItems

        });

    } catch (error) {

        try {

            await client.query("ROLLBACK");

        } catch (rollbackError) {

            console.error(
                "ROLLBACK ERROR:",
                rollbackError
            );

        }


        console.error(
            "RESTOCK ORDER ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            error:
                error.message ||
                "Failed to restock order"

        });

    } finally {

        client.release();

    }

});


// ============================================================
// UPDATE ORDER
// PUT /api/orders/:id
// ============================================================

router.put("/:id", async (req, res) => {

    const orderId =
        Number(req.params.id);

    const {
        order_status,
        expected_delivery,
        actual_delivery_date,
        notes
    } = req.body;


    if (
        !Number.isInteger(orderId) ||
        orderId <= 0
    ) {

        return res.status(400).json({
            success: false,
            error: "Invalid order ID"
        });

    }


    try {

        const result = await pool.query(`
            UPDATE public.purchaseorders

            SET
                order_status =
                    COALESCE(
                        $1,
                        order_status
                    ),

                expected_delivery =
                    COALESCE(
                        $2::date,
                        expected_delivery
                    ),

                actual_delivery_date =
                    COALESCE(
                        $3::date,
                        actual_delivery_date
                    ),

                notes =
                    COALESCE(
                        $4,
                        notes
                    )

            WHERE purchase_order_id = $5

            RETURNING *
        `, [

            order_status || null,

            expected_delivery || null,

            actual_delivery_date || null,

            notes !== undefined
                ? notes
                : null,

            orderId

        ]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                error: "Order not found"
            });

        }


        res.status(200).json({

            success: true,

            message:
                "Order updated successfully",

            order:
                result.rows[0]

        });

    } catch (error) {

        console.error(
            "PUT order error:",
            error
        );

        res.status(500).json({

            success: false,

            error:
                error.message ||
                "Failed to update order"

        });

    }

});


// ============================================================
// DELETE ORDER
// DELETE /api/orders/:id
// ============================================================

router.delete("/:id", async (req, res) => {

    const orderId =
        Number(req.params.id);

    if (
        !Number.isInteger(orderId) ||
        orderId <= 0
    ) {

        return res.status(400).json({
            success: false,
            error: "Invalid order ID"
        });

    }


    const client =
        await pool.connect();


    try {

        await client.query("BEGIN");


        // ----------------------------------------------------
        // GET ORDER
        // ----------------------------------------------------

        const orderResult =
            await client.query(`
                SELECT
                    purchase_order_id,
                    order_number,
                    order_status

                FROM public.purchaseorders

                WHERE purchase_order_id = $1

                FOR UPDATE
            `, [orderId]);


        if (orderResult.rows.length === 0) {

            throw new Error("Order not found");

        }


        const order =
            orderResult.rows[0];


        // ----------------------------------------------------
        // ONLY ALLOW DELETING PENDING ORDERS
        // ----------------------------------------------------

        if (
            order.order_status !== "Pending"
        ) {

            throw new Error(
                "Only pending orders can be deleted"
            );

        }


        // ----------------------------------------------------
        // DELETE ORDER ITEMS
        // ----------------------------------------------------

        await client.query(`
            DELETE FROM public.purchaseorderitems

            WHERE purchase_order_id = $1
        `, [orderId]);


        // ----------------------------------------------------
        // DELETE ORDER
        // ----------------------------------------------------

        const deleteResult =
            await client.query(`
                DELETE FROM public.purchaseorders

                WHERE purchase_order_id = $1

                RETURNING purchase_order_id
            `, [orderId]);


        if (deleteResult.rows.length === 0) {

            throw new Error(
                "Order could not be deleted"
            );

        }


        await client.query("COMMIT");


        res.status(200).json({

            success: true,

            message:
                `Order ${order.order_number} deleted successfully`

        });

    } catch (error) {

        try {

            await client.query("ROLLBACK");

        } catch (rollbackError) {

            console.error(
                "ROLLBACK ERROR:",
                rollbackError
            );

        }


        console.error(
            "DELETE order error:",
            error
        );


        res.status(500).json({

            success: false,

            error:
                error.message ||
                "Failed to delete order"

        });

    } finally {

        client.release();

    }

});


export default router;