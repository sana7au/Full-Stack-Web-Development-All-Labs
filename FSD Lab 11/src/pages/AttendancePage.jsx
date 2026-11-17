function AttendancePage({ students, courses, attendance, onUpdateAttendance }) {
  const present = attendance.filter((record) => record.status === 'Present').length;
  const absent = attendance.length - present;
  return (
    <section className="page-panel">
      <div className="page-heading"><div><h2>Attendance</h2><p>Review the latest attendance records and update a student's status.</p></div></div>
      <div className="attendance-summary"><div><span>Total Records</span><strong>{attendance.length}</strong></div><div><span>Present</span><strong className="present-number">{present}</strong></div><div><span>Absent</span><strong className="absent-number">{absent}</strong></div></div>
      <div className="table-wrapper"><table className="student-table"><thead><tr><th>Date</th><th>Student</th><th>Course</th><th>Attendance</th><th>Update Status</th></tr></thead><tbody>
        {attendance.map((record) => {
          const student = students.find((item) => item.id === record.studentId);
          const course = courses.find((item) => item.id === record.courseId);
          if (!student) return null;
          return <tr key={record.id}><td>{record.date}</td><td className="student-name">{student.name}<small className="table-subtext">{student.rollNumber}</small></td><td>{course?.code || record.courseId}</td><td><span className={`badge ${record.status === 'Present' ? 'badge-active' : 'badge-inactive'}`}>{record.status}</span></td><td><select className="attendance-select" value={record.status} onChange={(event) => onUpdateAttendance(record.id, event.target.value)}><option>Present</option><option>Absent</option></select></td></tr>;
        })}
        {!attendance.length && <tr><td colSpan="5" className="empty-state">No attendance records available.</td></tr>}
      </tbody></table></div>
    </section>
  );
}

export default AttendancePage;
