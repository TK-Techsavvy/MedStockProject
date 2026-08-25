import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { pool } from "../db/connection.js";


const router = express.Router();


// ============================================================
// POST /api/auth/login
// ============================================================

router.post(
    "/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            // =================================================
            // VALIDATION
            // =================================================

            if (
                !email ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email and password are required"

                });

            }


            // =================================================
            // FIND USER
            // =================================================

            const result =
                await pool.query(
                    `
                    SELECT
                        u.user_id,
                        u.role_id,
                        u.first_name,
                        u.last_name,
                        u.email,
                        u.password_hash,
                        u.phone,
                        u.department,
                        u.status,
                        r.role_name

                    FROM public.users u

                    INNER JOIN public.roles r
                        ON u.role_id = r.role_id

                    WHERE LOWER(u.email) = LOWER($1)

                    LIMIT 1
                    `,
                    [email.trim()]
                );


            if (
                result.rows.length === 0
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            const user =
                result.rows[0];


            // =================================================
            // STATUS
            // =================================================

            if (
                user.status
                    ?.toLowerCase() !==
                "active"
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Your account is not active"

                });

            }


            // =================================================
            // PASSWORD
            // =================================================

            const isMatch =
                await bcrypt.compare(
                    password,
                    user.password_hash
                );


            if (!isMatch) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            // =================================================
            // JWT SECRET
            // =================================================

            if (
                !process.env.JWT_SECRET
            ) {

                console.error(
                    "JWT_SECRET is missing."
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Server authentication configuration is missing"

                });

            }


            // =================================================
            // TOKEN
            // =================================================

            const token =
                jwt.sign(
                    {
                        userId:
                            user.user_id,

                        roleId:
                            user.role_id,

                        role:
                            user.role_name
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            "2d"
                    }
                );


            // =================================================
            // RESPONSE
            // =================================================

            return res.status(200).json({

                success: true,

                message:
                    "Login successful",

                token,

                user: {

                    userId:
                        user.user_id,

                    firstName:
                        user.first_name,

                    lastName:
                        user.last_name,

                    email:
                        user.email,

                    roleId:
                        user.role_id,

                    role:
                        user.role_name,

                    phone:
                        user.phone,

                    department:
                        user.department,

                    status:
                        user.status

                }

            });

        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Internal server error"

            });

        }

    }
);


export default router;