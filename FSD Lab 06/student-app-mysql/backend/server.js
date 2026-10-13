const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const port = 3004;

//  local XAMPP/MySQL setup
const dbConfig = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "student_db",
    waitForConnections: true,
    connectionLimit: 10
};

const pool = mysql.createPool(dbConfig);
app.use(cors());
app.use(express.json());

function validateStudent(body) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const age = Number(body.age);

    if (!name || !city || !Number.isInteger(age) || age < 1 || age > 120) {
        return null;
    }

    return { name: name, city: city, age: age };
}

app.get("/api/students", async function (request, response) {
    try {
        const [students] = await pool.execute(
            "SELECT id, name, city, age FROM students ORDER BY id DESC"
        );
        response.json(students);
    } catch (error) {
        console.error("GET /api/students failed:", error.message);
        response.status(500).json({ message: "Could not load students." });
    }
});

app.post("/api/students", async function (request, response) {
    const student = validateStudent(request.body);
    if (!student) {
        response.status(400).json({ message: "Name, city, and a valid age (1-120) are required." });
        return;
    }

    try {
        const [result] = await pool.execute(
            "INSERT INTO students (name, city, age) VALUES (?, ?, ?)",
            [student.name, student.city, student.age]
        );
        response.status(201).json({
            message: "Student added successfully.",
            student: { id: result.insertId, ...student }
        });
    } catch (error) {
        console.error("POST /api/students failed:", error.message);
        response.status(500).json({ message: "Could not add student." });
    }
});

app.put("/api/students/:id", async function (request, response) {
    const id = Number(request.params.id);
    const student = validateStudent(request.body);
    if (!Number.isInteger(id) || id < 1 || !student) {
        response.status(400).json({ message: "A valid student ID and student details are required." });
        return;
    }

    try {
        const [result] = await pool.execute(
            "UPDATE students SET name = ?, city = ?, age = ? WHERE id = ?",
            [student.name, student.city, student.age, id]
        );
        if (result.affectedRows === 0) {
            response.status(404).json({ message: "Student not found." });
            return;
        }
        response.json({
            message: "Student updated successfully.",
            student: { id: id, ...student }
        });
    } catch (error) {
        console.error("PUT /api/students/:id failed:", error.message);
        response.status(500).json({ message: "Could not update student." });
    }
});

app.delete("/api/students/:id", async function (request, response) {
    const id = Number(request.params.id);
    if (!Number.isInteger(id) || id < 1) {
        response.status(400).json({ message: "A valid student ID is required." });
        return;
    }

    try {
        const [result] = await pool.execute(
            "DELETE FROM students WHERE id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            response.status(404).json({ message: "Student not found." });
            return;
        }
        response.json({ message: "Student deleted successfully." });
    } catch (error) {
        console.error("DELETE /api/students/:id failed:", error.message);
        response.status(500).json({ message: "Could not delete student." });
    }
});

app.listen(port, function () {
    console.log("Student API running at http://localhost:" + port);
});
