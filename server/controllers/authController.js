import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/connection.js";

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password were provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Get user and role information
        const result = await pool.query(
            `SELECT
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
             WHERE u.email = $1`,
            [email]
        );

        // User not found
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Check account status
        if (user.status !== "Active") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                userId: user.user_id,
                roleId: user.role_id,
                role: user.role_name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2d"
            }
        );

        // Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                userId: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,

                roleId: user.role_id,
                role: user.role_name,

                phone: user.phone,
                department: user.department,
                status: user.status
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export { login };