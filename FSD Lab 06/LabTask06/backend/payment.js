
const express = require("express");
const router = express.Router();
const pool = require("./db");

router.post("/", async function (req, res) {
    const payment = req.body || {};

    const cardholderName = typeof payment.cardholderName === "string"
        ? payment.cardholderName.trim()
        : "";

    const lastFour = typeof payment.cardLastFour === "string"
        ? payment.cardLastFour
        : "";

    if (!cardholderName) {
        return res.status(400).json({ message: "Cardholder name is required for the demo record." });
    }

    if (!/^\d{4}$/.test(lastFour)) {
        return res.status(400).json({ message: "A four-digit card suffix is required for the demo record." });
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO payments
            (cardholder_name, amount, currency, payment_method, card_last_four, payment_status, is_demo)
            VALUES (?, ?, 'USD', 'Demo card', ?, 'DEMO_COMPLETED', 1)`,
            [cardholderName, 9.99, lastFour]
        );

        res.status(201).json({
            message: "Demo payment record saved. No real payment was processed.",
            payment: {
                id: result.insertId,
                amount: 9.99,
                status: "DEMO_COMPLETED"
            }
        });
    } catch (error) {
        console.error("POST /api/payments:", error.message);
        res.status(500).json({ message: "Could not save the demo payment record. Check the payments table." });
    }
});

router.get("/", async function (req, res) {
    try {
        const [rows] = await pool.execute(
            `SELECT id, cardholder_name AS cardholderName, amount, currency,
            payment_method AS paymentMethod, card_last_four AS cardLastFour,
            payment_status AS paymentStatus, is_demo AS isDemo, created_at AS createdAt
            FROM payments ORDER BY id DESC`
        );

        res.json(rows);
    } catch (error) {
        console.error("GET /api/payments:", error.message);
        res.status(500).json({ message: "Could not retrieve payment records. Check the payments table." });
    }
});

module.exports = router;
