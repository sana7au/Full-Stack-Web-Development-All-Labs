const apiUrl = "http://localhost:3004/api/students";
let enrolledRoster = [];
let editingStudentId = null;

function showMessage(message, type) {
    $("#message").removeClass("success error").addClass(type).text(message);
}

// Helper function to render student roster
function renderRoster(students) {
    $("#students").html("");

    if (students.length === 0) {
        $("#students").html('<p style="text-align: center; color: #64748b; padding: 24px;">No students found matching search.</p>');
        return;
    }

    $.each(students, function (index, student) {
        const initials = student.name ? student.name.slice(0, 2).toUpperCase() : "ST";

        $("#students").append(`
            <div class="student-card" data-name="${(student.name || '').toLowerCase()}" data-city="${(student.city || '').toLowerCase()}">
                <div class="student-left">
                    <div class="student-avatar">${initials}</div>
                    <div class="student-details">
                        <h4>${student.name}</h4>
                        <p>📍 ${student.city}</p>
                    </div>
                </div>
                <div class="student-badges">
                    <span class="pill-id">ID: ${student.id}</span>
                    <span class="pill-age">${student.age} yrs</span>
                </div>
                <div class="student-actions">
                    <button class="btn btn-edit edit-student" data-id="${student.id}" type="button">Edit</button>
                    <button class="btn btn-delete delete-student" data-id="${student.id}" type="button">Delete</button>
                </div>
            </div>
        `);
    });
}

// 1. GET Request: Load students from backend API
$("#loadStudents").click(function () {
    const btn = $(this);
    btn.prop("disabled", true).text("⏳ Loading...");

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (students) {
            enrolledRoster = students;
            renderRoster(students);
            btn.prop("disabled", false).text("🔄 Refresh roster");
        },
        error: function () {
            showMessage("Could not load students. Is the backend server and MySQL database running?", "error");
            btn.prop("disabled", false).text("🔄 Load students");
        }
    });
});

// 2. POST Request: Submit new student to backend API
$("#addStudent").click(function () {
    const nameVal = $("#name").val().trim();
    const cityVal = $("#city").val().trim();
    const ageVal = $("#age").val();

    if (!nameVal || !cityVal || !ageVal || Number(ageVal) < 1 || Number(ageVal) > 120) {
        showMessage("Please enter a name, city, and an age from 1 to 120.", "error");
        return;
    }

    const student = {
        name: nameVal,
        city: cityVal,
        age: Number(ageVal)
    };

    const addBtn = $(this);
    const isEditing = editingStudentId !== null;
    addBtn.prop("disabled", true).text(isEditing ? "⏳ Saving..." : "⏳ Adding...");

    $.ajax({
        url: isEditing ? apiUrl + "/" + editingStudentId : apiUrl,
        method: isEditing ? "PUT" : "POST",
        contentType: "application/json",
        data: JSON.stringify(student),
        success: function (response) {
            showMessage(response.message, "success");

            // Clear input fields
            $("#name").val("");
            $("#city").val("");
            $("#age").val("");

            resetForm();
            addBtn.prop("disabled", false).text("➕ Add student");

            // Automatically refresh the roster so new student shows up immediately
            $("#loadStudents").trigger("click");
        },
        error: function (error) {
            const message = error.responseJSON
                ? error.responseJSON.message
                : "Could not add student. Make sure backend is running.";
            showMessage(message, "error");

            addBtn.prop("disabled", false).text(isEditing ? "💾 Save changes" : "➕ Add student");
        }
    });

});

function resetForm() {
    editingStudentId = null;
    $("#formTitle").text("Add student");
    $("#name, #city, #age").val("");
    $("#cancelEdit").hide();
}

$("#cancelEdit").click(resetForm).hide();

$(document).on("click", ".edit-student", function () {
    const student = enrolledRoster.find(function (item) {
        return item.id === Number($(this).data("id"));
    }.bind(this));
    if (!student) return;

    editingStudentId = student.id;
    $("#formTitle").text("Edit student");
    $("#name").val(student.name);
    $("#city").val(student.city);
    $("#age").val(student.age);
    $("#addStudent").text("💾 Save changes");
    $("#cancelEdit").show();
    $("#name").focus();
});

$(document).on("click", ".delete-student", function () {
    const id = Number($(this).data("id"));
    if (!window.confirm("Delete this student?")) return;

    $.ajax({
        url: apiUrl + "/" + id,
        method: "DELETE",
        success: function (response) {
            showMessage(response.message, "success");
            if (editingStudentId === id) resetForm();
            $("#loadStudents").trigger("click");
        },
        error: function (error) {
            showMessage(error.responseJSON ? error.responseJSON.message : "Could not delete student.", "error");
        }
    });
});

// 3. Keyboard Event: Press Enter inside any input to trigger Add Student
$("#name, #city, #age").on("keydown", function (e) {
    if (e.key === "Enter") {
        $("#addStudent").trigger("click");
    }
});

// 4. Input Event: Live Search / Filter on roster
$("#filterStudents").on("input", function () {
    const query = $(this).val().toLowerCase().trim();
    if (!enrolledRoster.length) return;

    const filtered = enrolledRoster.filter(function (s) {
        return (s.name && s.name.toLowerCase().includes(query)) ||
               (s.city && s.city.toLowerCase().includes(query));
    });

    renderRoster(filtered);
});
