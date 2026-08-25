import express from "express";
import cors from "cors";

import "./db/connection.js";

import authRoutes from "./routes/auth.js";
import medicineRoutes from "./routes/medicine.js";
import supplierRoutes from "./routes/suppliers.js";
import orderRoutes from "./routes/Orders.js";
import transactionRoutes from "./routes/Transactions.js";
import reportRoutes from "./routes/Reports.js";
import userRoutes from "./routes/Users.js";
import settingsRoutes from "./routes/Settings.js";


const app = express();


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ============================================================
// ROUTES
// ============================================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/medicine",
    medicineRoutes
);

app.use(
    "/api/suppliers",
    supplierRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/transactions",
    transactionRoutes
);

app.use(
    "/api/reports",
    reportRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/settings",
    settingsRoutes
);


// ============================================================
// API TEST
// ============================================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "MediStock API is running"
    });

});


// ============================================================
// 404
// ============================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});


// ============================================================
// ERROR HANDLER
// ============================================================

app.use((error, req, res, next) => {

    console.error(
        "Unhandled server error:",
        error
    );

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});


// ============================================================
// SERVER
// ============================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `MediStock API running on http://localhost:${PORT}`
    );

});