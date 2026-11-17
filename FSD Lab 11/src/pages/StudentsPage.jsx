import { useMemo, useState } from 'react';

function StudentsPage({ students, courses, departmentOptions, newStudentDefaults, onAddStudent, onDeleteStudent }) {
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState(newStudentDefaults);

  const filteredStudents = useMemo(() => students.filter((student) => {
    const search = searchText.trim().toLowerCase();
    const matchesSearch = student.name.toLowerCase().includes(search) || student.rollNumber.toLowerCase().includes(search);
    const matchesDepartment = selectedDepartment === 'All Departments' || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  }), [students, searchText, selectedDepartment]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewStudent((current) => ({ ...current, [name]: value }));
  };
  const handleAdd = (event) => {
    event.preventDefault();
    const { initialCourse, ...studentData } = newStudent;
    onAddStudent(studentData);
    setNewStudent(newStudentDefaults);
    setShowForm(false);
  };

  return (
    <section className="page-panel">
      <div className="page-heading">
        <div><h2>Student Management</h2><p>Manage student profiles, departments and course registrations.</p></div>
        <button className="primary-button" onClick={() => setShowForm((value) => !value)}>{showForm ? 'Close Form' : '+ Add Student'}</button>
      </div>

      {showForm && <form className="page-form" onSubmit={handleAdd}>
        <h3>New Student Record</h3>
        <div className="page-form-grid">
          <label>Full Name<input name="name" value={newStudent.name} onChange={handleChange} required /></label>
          <label>Roll Number<input name="rollNumber" value={newStudent.rollNumber} onChange={handleChange} required /></label>
          <label>Department<select name="department" value={newStudent.department} onChange={handleChange}>{departmentOptions.map((department) => <option key={department}>{department}</option>)}</select></label>
          <label>Semester<select name="semester" value={newStudent.semester} onChange={handleChange}>{['1st','2nd','3rd','4th','5th','6th','7th','8th'].map((semester) => <option key={semester}>{semester}</option>)}</select></label>
          <label>Email<input type="email" name="email" value={newStudent.email} onChange={handleChange} required /></label>
          <label>Initial Course<select name="initialCourse" value={newStudent.initialCourse || ''} onChange={(event) => setNewStudent((current) => ({ ...current, initialCourse: event.target.value, courseIds: event.target.value ? [event.target.value] : [] }))}><option value="">No course selected</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.code} — {course.title}</option>)}</select></label>
        </div>
        <button className="primary-button" type="submit">Save Student</button>
      </form>}

      <div className="page-toolbar">
        <input className="toolbar-input" placeholder="Search by name or roll number..." value={searchText} onChange={(event) => setSearchText(event.target.value)} />
        <select className="toolbar-input department-select" value={selectedDepartment} onChange={(event) => setSelectedDepartment(event.target.value)}><option>All Departments</option>{departmentOptions.map((department) => <option key={department}>{department}</option>)}</select>
        <span className="result-count">{filteredStudents.length} of {students.length} students</span>
      </div>

      <div className="table-wrapper"><table className="student-table">
        <thead><tr><th>Roll No.</th><th>Student</th><th>Department</th><th>Semester</th><th>Courses</th><th>GPA</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{filteredStudents.length ? filteredStudents.map((student) => <tr key={student.id}>
          <td className="roll-no">{student.rollNumber}</td><td className="student-name">{student.name}<small className="table-subtext">{student.email}</small></td><td>{student.department}</td><td>{student.semester}</td>
          <td><div className="course-chip-list">{(student.courseIds || []).length ? student.courseIds.map((id) => <span className="course-chip" key={id}>{courses.find((course) => course.id === id)?.code || id}</span>) : <span className="muted-text">No courses</span>}</div></td>
          <td className="gpa-value">{student.gpa}</td><td><span className={`badge badge-${student.status.toLowerCase()}`}>{student.status}</span></td>
          <td><button className="btn-delete" onClick={() => onDeleteStudent(student.id)}>Delete</button></td>
        </tr>) : <tr><td colSpan="8" className="empty-state">No matching students found.</td></tr>}</tbody>
      </table></div>
    </section>
  );
}

export default StudentsPage;
