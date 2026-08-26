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
    .then(async client => {
        console.log("PostgreSQL database connected successfully!");

        // Make sure urgency column exists
        await client.query(`
            ALTER TABLE complaints
            ADD COLUMN IF NOT EXISTS urgency VARCHAR(20) DEFAULT 'Normal'
        `);

        client.release();

        console.log("Urgency column checked successfully!");
    })
    .catch(error => {
        console.error("Database connection failed:", error.message);
    });


// -----------------------------------------
// SMART PRIORITY
// -----------------------------------------
function calculatePriority(category, description) {

    const categoryText = String(category || "").toLowerCase();
    const descriptionText = String(description || "").toLowerCase();

    const text = `${categoryText} ${descriptionText}`;

    // Very serious issues
    const highKeywords = [
        "fire",
        "smoke",
        "spark",
        "sparks",
        "electric shock",
        "short circuit",
        "exposed wire",
        "danger",
        "dangerous",
        "accident",
        "emergency",
        "injury",
        "injured",
        "life risk",
        "gas leak",
        "flood"
    ];

    if (
        categoryText === "safety" ||
        categoryText === "electrical" ||
        categoryText === "water" ||
        highKeywords.some(word => text.includes(word))
    ) {
        return "High";
    }

    const mediumKeywords = [
        "broken",
        "damaged",
        "leak",
        "not working",
        "problem",
        "issue",
        "repair",
        "computer",
        "projector",
        "classroom"
    ];

    if (
        categoryText === "infrastructure" ||
        categoryText === "academic" ||
        mediumKeywords.some(word => text.includes(word))
    ) {
        return "Medium";
    }

    return "Low";
}


// -----------------------------------------
// SMART URGENCY
// -----------------------------------------
function calculateUrgency(category, description) {

    const categoryText = String(category || "").toLowerCase();
    const descriptionText = String(description || "").toLowerCase();

    const text = `${categoryText} ${descriptionText}`;

    // IMMEDIATE
    const immediateKeywords = [
        "fire",
        "smoke",
        "short circuit",
        "electric shock",
        "exposed wire",
        "sparks",
        "spark",
        "emergency",
        "danger",
        "dangerous",
        "life risk",
        "injury",
        "injured",
        "gas leak",
        "flood",
        "accident"
    ];

    if (
        immediateKeywords.some(word => text.includes(word))
    ) {
        return "Immediate";
    }

    // SOON
    const soonKeywords = [
        "leak",
        "leaking",
        "broken",
        "damaged",
        "not working",
        "problem",
        "issue",
        "repair",
        "water problem",
        "fan",
        "light",
        "projector",
        "computer"
    ];

    if (
        soonKeywords.some(word => text.includes(word))
    ) {
        return "Soon";
    }

    // Category-based urgency
    if (
        categoryText === "safety"
    ) {
        return "Immediate";
    }

    if (
        categoryText === "electrical" ||
        categoryText === "water"
    ) {
        return "Soon";
    }

    return "Normal";
}


// -----------------------------------------
// HOME
// -----------------------------------------
app.get("/", (req, res) => {
    res.send(
        "College Issue Management System Backend is running!"
    );
});


// -----------------------------------------
// SUBMIT COMPLAINT
// -----------------------------------------
app.post("/complaints", async (req, res) => {

    const {
        name,
        role,
        category,
        location,
        description
    } = req.body;

    try {

        const selectedPriority =
            calculatePriority(category, description);

        const selectedUrgency =
            calculateUrgency(category, description);

        const result = await pool.query(
            `INSERT INTO complaints
            (
                name,
                role,
                category,
                location,
                description,
                priority,
                urgency
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`,
            [
                name,
                role,
                category,
                location,
                description,
                selectedPriority,
                selectedUrgency
            ]
        );

        res.json({
            message: "Complaint saved successfully!",
            complaintId: result.rows[0].id,
            priority: selectedPriority,
            urgency: selectedUrgency
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to save complaint"
        });
    }
});


// -----------------------------------------
// GET ALL COMPLAINTS
// -----------------------------------------
app.get("/complaints", async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM complaints
             ORDER BY created_at DESC`
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to get complaints"
        });
    }
});


// -----------------------------------------
// GET COMPLAINT BY ID
// -----------------------------------------
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


// -----------------------------------------
// UPDATE STATUS OR PRIORITY
// -----------------------------------------
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

    try {

        const existing = await pool.query(
            `SELECT status, priority, urgency
             FROM complaints
             WHERE id = $1`,
            [req.params.id]
        );

        if (existing.rows.length === 0) {

            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        const current = existing.rows[0];

        const newStatus =
            status || current.status;

        const newPriority =
            priority || current.priority;

        const newUrgency =
            current.urgency || "Normal";

        if (
            status !== undefined &&
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({
                message: "Invalid complaint status"
            });
        }

        if (
            priority !== undefined &&
            !allowedPriorities.includes(priority)
        ) {

            return res.status(400).json({
                message: "Invalid complaint priority"
            });
        }

        await pool.query(
            `UPDATE complaints
             SET status = $1,
                 priority = $2
             WHERE id = $3`,
            [
                newStatus,
                newPriority,
                req.params.id
            ]
        );

        res.json({
            message: "Complaint updated successfully!",
            complaintId: req.params.id,
            status: newStatus,
            priority: newPriority,
            urgency: newUrgency
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update complaint"
        });
    }
});


// -----------------------------------------
// START SERVER
// -----------------------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `College Issue Management System running on port ${PORT}`
    );
});