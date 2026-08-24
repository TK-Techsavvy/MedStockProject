import bcrypt from "bcrypt";
import { pool } from "./db/connection.js";

const registerUsers = async () => {
    try {
        const hashedPassword = await bcrypt.hash("password123", 10);

        const result = await pool.query(
            `INSERT INTO public.users
            (
                role_id,
                first_name,
                last_name,
                email,
                password_hash,
                phone,
                department,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING
                user_id,
                role_id,
                first_name,
                last_name,
                email,
                phone,
                department,
                status,
                created_at`,
            [
                2,
                "John",
                "Doe",
                "john.doe@example.com",
                hashedPassword,
                "0123456789",
                "Pharmacy",
                "Active"
            ]
        );

        console.log("✅ User registered successfully:");
        console.log(result.rows[0]);

    } catch (error) {
        console.error("❌ Error registering user:", error);
    } finally {
        await pool.end();
    }
};

registerUsers();