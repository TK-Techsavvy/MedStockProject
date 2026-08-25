import express from "express";
import { pool } from "../db/connection.js";

const router = express.Router();


// ============================================================
// GET USER SETTINGS
// GET /api/settings/:userId
// ============================================================

router.get("/:userId", async (req, res) => {

    const userId = Number(req.params.userId);


    if (!Number.isInteger(userId)) {

        return res.status(400).json({
            success: false,
            error: "Invalid user ID"
        });
    }


    try {

        const result = await pool.query(`
            SELECT
                setting_id,
                user_id,
                theme,
                language,
                timezone,
                date_format,
                email_notifications,
                push_notifications,
                session_timeout,
                created_at,
                updated_at
            FROM public.usersettings
            WHERE user_id = $1
        `, [userId]);


        // --------------------------------------------------------
        // Create default settings if none exist
        // --------------------------------------------------------

        if (result.rows.length === 0) {

            const newSettings =
                await pool.query(`
                    INSERT INTO public.usersettings (
                        user_id,
                        theme,
                        language,
                        timezone,
                        date_format,
                        email_notifications,
                        push_notifications,
                        session_timeout
                    )
                    VALUES (
                        $1,
                        'Light',
                        'English',
                        'Africa/Johannesburg',
                        'DD/MM/YYYY',
                        true,
                        true,
                        30
                    )
                    RETURNING *
                `, [userId]);


            return res.status(200).json({
                success: true,
                settings: newSettings.rows[0]
            });
        }


        return res.status(200).json({
            success: true,
            settings: result.rows[0]
        });


    } catch (error) {

        console.error(
            "GET settings error:",
            error
        );


        return res.status(500).json({
            success: false,
            error: "Failed to fetch settings",
            details: error.message
        });
    }
});


// ============================================================
// SAVE USER SETTINGS
// PUT /api/settings/:userId
// ============================================================

router.put("/:userId", async (req, res) => {

    const userId =
        Number(req.params.userId);


    if (!Number.isInteger(userId)) {

        return res.status(400).json({
            success: false,
            error: "Invalid user ID"
        });
    }


    const {
        theme,
        language,
        timezone,
        date_format,
        email_notifications,
        push_notifications,
        session_timeout
    } = req.body;


    try {

        // --------------------------------------------------------
        // Check existing settings
        // --------------------------------------------------------

        const existing =
            await pool.query(`
                SELECT setting_id
                FROM public.usersettings
                WHERE user_id = $1
            `, [userId]);


        // ========================================================
        // UPDATE
        // ========================================================

        if (existing.rows.length > 0) {

            const result =
                await pool.query(`
                    UPDATE public.usersettings
                    SET
                        theme = $1,
                        language = $2,
                        timezone = $3,
                        date_format = $4,
                        email_notifications = $5,
                        push_notifications = $6,
                        session_timeout = $7,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = $8
                    RETURNING *
                `, [

                    theme || "Light",

                    language || "English",

                    timezone ||
                        "Africa/Johannesburg",

                    date_format ||
                        "DD/MM/YYYY",

                    email_notifications ??
                        true,

                    push_notifications ??
                        true,

                    Number(session_timeout) ||
                        30,

                    userId
                ]);


            return res.status(200).json({

                success: true,

                message:
                    "Settings updated successfully",

                settings:
                    result.rows[0]
            });
        }


        // ========================================================
        // CREATE
        // ========================================================

        const result =
            await pool.query(`
                INSERT INTO public.usersettings (
                    user_id,
                    theme,
                    language,
                    timezone,
                    date_format,
                    email_notifications,
                    push_notifications,
                    session_timeout
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8
                )
                RETURNING *
            `, [

                userId,

                theme || "Light",

                language || "English",

                timezone ||
                    "Africa/Johannesburg",

                date_format ||
                    "DD/MM/YYYY",

                email_notifications ??
                    true,

                push_notifications ??
                    true,

                Number(session_timeout) ||
                    30
            ]);


        return res.status(201).json({

            success: true,

            message:
                "Settings created successfully",

            settings:
                result.rows[0]
        });


    } catch (error) {

        console.error(
            "PUT settings error:",
            error
        );


        return res.status(500).json({

            success: false,

            error:
                "Failed to save settings",

            details:
                error.message
        });
    }
});


export default router;