// StudentTable.jsx - Student controls and reusable prop-driven student rows
function StudentRow({ student, onDelete }) {
  return (
    <tr>
      <td className="roll-no">{student.rollNumber}</td>
      <td className="student-name">{student.name}</td>
      <td>{student.department}</td>
      <td>{student.semester}</td>
      <td>{student.email}</td>
      <td className="gpa-value">{student.gpa}</td>
      <td>
        <span className={`badge badge-${student.status.toLowerCase()}`}>
          {student.status}
        </span>
      </td>
      <td>
        <button
          type="button"
          className="btn-delete"
          onClick={() => onDelete(student.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

function StudentTable({
  students,
  departmentOptions,
  isAddFormVisible,
  onToggleAddForm,
  newStudent,
  onNewStudentChange,
  onAddStudent,
  onDeleteStudent,
}) {
  return (
    <div className="table-container">
      <div className="table-header-bar">
        <div>
          <h2 className="table-title">Enrolled Students</h2>
          <p className="table-description">
            {students.length} local student records
          </p>
        </div>
        <button type="button" className="btn-view-all" onClick={onToggleAddForm}>
          {isAddFormVisible ? 'Close Form' : 'Add Student'}
        </button>
      </div>

      {isAddFormVisible && (
        <form className="student-form" onSubmit={onAddStudent}>
          <h3 className="form-title">Add New Student</h3>
          <div className="form-grid">
            <label>
              Name
              <input name="name" value={newStudent.name} onChange={onNewStudentChange} required />
            </label>
            <label>
              Roll Number
              <input name="rollNumber" value={newStudent.rollNumber} onChange={onNewStudentChange} required />
            </label>
            <label>
              Department
              <select name="department" value={newStudent.department} onChange={onNewStudentChange}>
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </label>
            <label>
              Semester
              <select name="semester" value={newStudent.semester} onChange={onNewStudentChange}>
                {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map((semester) => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </label>
            <label>
              Email
              <input type="email" name="email" value={newStudent.email} onChange={onNewStudentChange} required />
            </label>
          </div>
          <button type="submit" className="btn-submit">Save Student</button>
        </form>
      )}

      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Email</th>
              <th>GPA</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <StudentRow key={student.id} student={student} onDelete={onDeleteStudent} />
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-state">No students available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;
