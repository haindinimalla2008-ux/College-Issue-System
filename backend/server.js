const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(client => {
        console.log("PostgreSQL database connected successfully!");
        client.release();
    })
    .catch(error => {
        console.error("Database connection failed:", error.message);
    });

// HOME
app.get("/", (req, res) => {
    res.send("College Issue Management System Backend is running!");
});

// SUBMIT COMPLAINT
app.post("/complaints", async (req, res) => {

    const {
        name,
        role,
        category,
        location,
        description
    } = req.body;

    try {

        // AUTOMATIC PRIORITY
        let selectedPriority = "Low";

        if (
            category === "Safety" ||
            category === "Electrical" ||
            category === "Water"
        ) {
            selectedPriority = "High";
        }
        else if (
            category === "Infrastructure" ||
            category === "Academic"
        ) {
            selectedPriority = "Medium";
        }
        else {
            selectedPriority = "Low";
        }

        const result = await pool.query(
            `INSERT INTO complaints
            (name, role, category, location, description, priority)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`,
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
            complaintId: result.rows[0].id,
            priority: selectedPriority
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to save complaint"
        });
    }
});

// GET ALL COMPLAINTS
app.get("/complaints", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM complaints ORDER BY created_at DESC"
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to get complaints"
        });
    }
});

// GET COMPLAINT BY ID
app.get("/complaints/:id", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM complaints WHERE id = $1",
            [req.params.id]
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

// UPDATE COMPLAINT STATUS
app.put("/complaints/:id", async (req, res) => {

    const { status, priority } = req.body;

    const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved"
    ];

    const allowedPriorities = [
        "Low",
        "Medium",
        "High"
    ];

    // STATUS + PRIORITY UPDATE
    if (
        !allowedStatuses.includes(status) ||
        !allowedPriorities.includes(priority)
    ) {

        return res.status(400).json({
            message: "Invalid complaint status or priority"
        });
    }

    try {

        const result = await pool.query(
            `UPDATE complaints
             SET status = $1,
                 priority = $2
             WHERE id = $3`,
            [
                status,
                priority,
                req.params.id
            ]
        );

        if (result.rowCount === 0) {

            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.json({
            message: "Complaint updated successfully!",
            complaintId: req.params.id,
            status: status,
            priority: priority
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update complaint"
        });
    }
});

// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `College Issue Management System running on port ${PORT}`
    );
});