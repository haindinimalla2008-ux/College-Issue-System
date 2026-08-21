const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// POSTGRESQL CONNECTION
// =========================

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// =========================
// CREATE TABLE
// =========================

async function createTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaints (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                role VARCHAR(50) NOT NULL,
                category VARCHAR(100) NOT NULL,
                location VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                priority VARCHAR(20) DEFAULT 'Medium',
                status VARCHAR(30) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("PostgreSQL database connected successfully!");
        console.log("Complaints table is ready!");

    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
}

createTable();

// =========================
// FRONTEND
// =========================

const frontendPath = path.join(__dirname, "..", "frontend");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "home.html"));
});

// =========================
// SUBMIT COMPLAINT
// =========================

app.post("/complaints", async (req, res) => {

    const {
        name,
        role,
        category,
        location,
        description,
        priority
    } = req.body;

    const selectedPriority = priority || "Medium";

    try {

        const result = await pool.query(
            `
            INSERT INTO complaints
            (name, role, category, location, description, priority)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            `,
            [
                name,
                role,
                category,
                location,
                description,
                selectedPriority
            ]
        );

        res.json({
            message: "Complaint saved successfully!",
            complaintId: result.rows[0].id
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to save complaint"
        });
    }
});

// =========================
// GET ALL COMPLAINTS
// =========================

app.get("/complaints", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM complaints
            ORDER BY created_at DESC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to get complaints"
        });
    }
});

// =========================
// GET COMPLAINT BY ID
// =========================

app.get("/complaints/:id", async (req, res) => {

    const id = req.params.id;

    try {

        const result = await pool.query(
            `
            SELECT *
            FROM complaints
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to find complaint"
        });
    }
});

// =========================
// UPDATE COMPLAINT STATUS
// =========================

app.put("/complaints/:id", async (req, res) => {

    const id = req.params.id;
    const { status } = req.body;

    const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved"
    ];

    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            message: "Invalid complaint status"
        });
    }

    try {

        const result = await pool.query(
            `
            UPDATE complaints
            SET status = $1
            WHERE id = $2
            `,
            [status, id]
        );

        if (result.rowCount === 0) {

            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.json({
            message: "Complaint status updated successfully!",
            complaintId: id,
            status: status
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update status"
        });
    }
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `College Issue Management System running on port ${PORT}`
    );

});