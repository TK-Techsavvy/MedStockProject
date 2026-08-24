import express from "express";
import cors from "cors";

import "./db/connection.js";

import authRoutes from "./routes/auth.js";
import medicineRoutes from "./routes/medicine.js";

const app = express();

app.use(cors());
app.use(express.json());


// Authentication
app.use("/api/auth", authRoutes);


// Medicines
app.use("/api/medicine", medicineRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});