const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

const products = [
    {
        id: 1,
        name: "Chronos Smart Watch",
        description: "A stylish and comfortable smart watch for everyday use. Tracks your steps, heart rate and sleep, with a bright always-on display and a 7-day battery.",
        basePrice: 120,
        colors: ["Black", "Blue", "Red", "Green"],
        variants: [
            { id: "standard", label: "Standard 40mm", price: 120 },
            { id: "sport", label: "Sport 44mm", price: 150 },
            { id: "lite", label: "Lite 38mm", price: 99 }
        ],
        strapStyles: ["Sport Band", "Leather Stitch", "Metal Link"],
        features: ["Heart rate tracking", "Sleep tracking", "7-day battery", "Custom engraving"]
    }
];

const configurations = [];

app.use(function (req, res, next) {
    console.log("[" + new Date().toLocaleTimeString() + "] " + req.method + " " + req.url);
    next();
});

app.use(cors());
app.use(express.json());

app.get("/api/products", function (req, res) {
    res.json(products);
});

app.get("/api/configurations", function (req, res) {
    res.json(configurations);
});

app.post("/api/configurations", function (req, res) {
    const config = req.body || {};
    console.log("Request body:", config);

    const required = ["productName", "color", "variant", "strapStyle"];
    const missing = required.filter(function (field) {
        return typeof config[field] !== "string" || config[field].trim() === "";
    });

    if (missing.length > 0) {
        return res.status(400).json({ message: "Missing or invalid fields: " + missing.join(", ") });
    }

    if (typeof config.price !== "number") {
        return res.status(400).json({ message: "Price must be a number." });
    }

    const saved = {
        id: "CFG-" + (1000 + configurations.length + 1),
        receivedAt: new Date().toISOString(),
        productName: config.productName,
        color: config.color,
        variant: config.variant,
        strapStyle: config.strapStyle,
        engraving: config.engraving || "None",
        extras: Array.isArray(config.extras) ? config.extras : [],
        price: config.price
    };

    configurations.push(saved);
    console.log("Configuration saved:", saved.id);

    res.status(201).json({
        message: "Configuration received successfully",
        totalConfigurations: configurations.length,
        configuration: saved
    });
});

app.use(function (req, res) {
    res.status(404).json({ message: "Route not found: " + req.method + " " + req.url });
});

app.use(function (err, req, res, next) {
    console.log("Error:", err.message);
    const status = err.status || 500;
    res.status(status).json({ message: status === 400 ? "Invalid JSON in request body." : "Server error." });
});

app.listen(PORT, function () {
    console.log("Server running on http://localhost:" + PORT);
});