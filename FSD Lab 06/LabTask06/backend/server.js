
const express = require("express");
const cors = require("cors");

const watchRoutes = require("./data");
const paymentRoutes = require("./payment");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "4mb" }));

app.use("/api/designs", watchRoutes);
app.use("/api/payments", paymentRoutes);

app.use(function (req, res) {
    res.status(404).json({
        message: "Route not found: " + req.method + " " + req.url
    });
});

app.listen(PORT, function () {
    console.log("Watch configurator server running at http://localhost:" + PORT);
});
