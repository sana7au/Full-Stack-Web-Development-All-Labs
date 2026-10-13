
const express = require("express");
const router = express.Router();
const pool = require("./db");

function validateDesign(design) {
    const required = ["productName", "productType", "color", "variant", "strapStyle", "imageData", "imageType"];

    const missing = required.filter(function (field) {
        return typeof design[field] !== "string" || design[field].trim() === "";
    });

    if (missing.length) return "Missing required fields: " + missing.join(", ");
    if (!design.imageType.startsWith("image/")) return "The uploaded file must be an image.";

    if (typeof design.price !== "number" || !Number.isFinite(design.price) || design.price < 0) {
        return "Price must be a valid non-negative number.";
    }

    if (!design.imageData.startsWith("data:" + design.imageType + ";base64,")) {
        return "Image data is invalid. Please select the image again.";
    }

    return null;
}

function designValues(design) {
    return [
        design.productName.trim(),
        design.productType.trim(),
        design.color.trim(),
        design.variant.trim(),
        design.strapStyle.trim(),
        (design.engraving || "None").trim(),
        JSON.stringify(Array.isArray(design.extras) ? design.extras : []),
        design.price,
        design.imageData,
        design.imageType
    ];
}

const designSelect = `
    SELECT id, product_name AS productName, product_type AS productType,
           color, variant, strap_style AS strapStyle, engraving, extras,
           price, image_data AS imageData, image_type AS imageType,
           created_at AS createdAt, updated_at AS updatedAt
    FROM watch_designs`;

router.get("/", async function (req, res) {
    try {
        const [rows] = await pool.execute(designSelect + " ORDER BY id DESC");
        rows.forEach(function (row) {
            row.extras = JSON.parse(row.extras || "[]");
        });
        res.json(rows);
    } catch (error) {
        console.error("GET /api/designs:", error.message);
        res.status(500).json({ message: "Could not retrieve designs. Check the database and watch_designs table." });
    }
});

router.post("/", async function (req, res) {
    const design = req.body || {};
    const validationError = validateDesign(design);

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO watch_designs
            (product_name, product_type, color, variant, strap_style, engraving, extras, price, image_data, image_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            designValues(design)
        );

        res.status(201).json({
            message: "Watch design saved successfully.",
            design: { id: result.insertId, productName: design.productName }
        });
    } catch (error) {
        console.error("POST /api/designs:", error.message);
        res.status(500).json({ message: "Could not save design. Check the database connection and table structure." });
    }
});

router.put("/:id", async function (req, res) {
    const id = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ message: "Invalid design ID." });
    }

    const design = req.body || {};
    const validationError = validateDesign(design);

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const [result] = await pool.execute(
            `UPDATE watch_designs SET product_name=?, product_type=?, color=?, variant=?, strap_style=?,
            engraving=?, extras=?, price=?, image_data=?, image_type=? WHERE id=?`,
            designValues(design).concat([id])
        );

        if (!result.affectedRows) {
            return res.status(404).json({ message: "Design not found. Reload the saved designs and try again." });
        }

        res.json({
            message: "Watch design updated successfully.",
            design: { id: id, productName: design.productName }
        });
    } catch (error) {
        console.error("PUT /api/designs/:id:", error.message);
        res.status(500).json({ message: "Could not update design. Check the database connection and table structure." });
    }
});

router.delete("/:id", async function (req, res) {
    const id = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ message: "Invalid design ID." });
    }

    try {
        const [result] = await pool.execute(
            "DELETE FROM watch_designs WHERE id = ?",
            [id]
        );

        if (!result.affectedRows) {
            return res.status(404).json({ message: "Design not found. It may already have been deleted." });
        }

        res.json({ message: "Watch design deleted successfully.", id: id });
    } catch (error) {
        console.error("DELETE /api/designs/:id:", error.message);
        res.status(500).json({ message: "Could not delete design from the database." });
    }
});

module.exports = router;
