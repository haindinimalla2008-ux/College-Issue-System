const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MYSQL CONNECTION POOL
========================= */

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "College@2026",
    database: "college_issue_system",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


db.getConnection((err, connection) => {

    if (err) {

        console.log(
            "Database connection failed:",
            err.message
        );

    } else {

        console.log(
            "MySQL database connected successfully!"
        );

        connection.release();

    }

});


/* =========================
   HOME
========================= */

app.get("/", (req, res) => {

    res.send(
        "College Issue Management System Backend is running!"
    );

});


/* =========================
   SUBMIT COMPLAINT
========================= */

app.post("/complaints", (req, res) => {

    const {
        name,
        role,
        category,
        location,
        description,
        priority
    } = req.body;


    const selectedPriority =
        priority || "Medium";


    const sql = `
        INSERT INTO complaints
        (name, role, category, location, description, priority)
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            name,
            role,
            category,
            location,
            description,
            selectedPriority
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message:
                        "Failed to save complaint"
                });

            }


            res.json({

                message:
                    "Complaint saved successfully!",

                complaintId:
                    result.insertId

            });

        }
    );

});


/* =========================
   GET ALL COMPLAINTS
========================= */

app.get("/complaints", (req, res) => {

    const sql = `
        SELECT *
        FROM complaints
        ORDER BY created_at DESC
    `;


    db.query(
        sql,
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message:
                        "Failed to get complaints"
                });

            }


            res.json(results);

        }
    );

});


/* =========================
   GET COMPLAINT BY ID
========================= */

app.get("/complaints/:id", (req, res) => {

    const id = req.params.id;


    const sql = `
        SELECT *
        FROM complaints
        WHERE id = ?
    `;


    db.query(
        sql,
        [id],
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message:
                        "Failed to find complaint"
                });

            }


            if (results.length === 0) {

                return res.status(404).json({
                    message:
                        "Complaint not found"
                });

            }


            res.json(results[0]);

        }
    );

});


/* =========================
   UPDATE COMPLAINT STATUS
========================= */

app.put("/complaints/:id", (req, res) => {

    const id = req.params.id;

    const { status } = req.body;


    /* Validate status */

    const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved"
    ];


    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            message:
                "Invalid complaint status"
        });

    }


    const sql = `
        UPDATE complaints
        SET status = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [status, id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message:
                        "Failed to update status"
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Complaint not found"
                });

            }


            res.json({

                message:
                    "Complaint status updated successfully!",

                complaintId: id,

                status: status

            });

        }
    );

});


/* =========================
   START SERVER
========================= */

app.listen(
    3000,
    () => {

        console.log(
            "Server running at http://localhost:3000"
        );

    }
);