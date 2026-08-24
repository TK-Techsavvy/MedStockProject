import express from "express";
import { pool } from "./connection.js";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM public.users ORDER BY user_id ASC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);

        res.status(500).json({
            error: "Failed to fetch users"
        });
    }
});

export default router;