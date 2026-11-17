import { useState } from 'react';

function CoursesPage({ students, courses, onToggleEnrollment }) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const selectedCourse = courses.find((course) => course.id === selectedCourseId);
  const enrolledStudents = students.filter((student) => (student.courseIds || []).includes(selectedCourseId));

  return (
    <section className="page-panel">
      <div className="page-heading"><div><h2>Course Management</h2><p>Explore course offerings and manage student registrations.</p></div><span className="soft-count">{courses.length} courses</span></div>
      <div className="course-management-layout">
        <div className="course-list-panel">
          <h3>Available Courses</h3>
          <div className="course-list">{courses.map((course) => {
            const count = students.filter((student) => (student.courseIds || []).includes(course.id)).length;
            return <button key={course.id} className={`course-list-item ${selectedCourseId === course.id ? 'selected' : ''}`} onClick={() => setSelectedCourseId(course.id)}>
              <span className="course-code">{course.code}</span><strong>{course.title}</strong><span className="course-list-meta">{course.department} · {count} enrolled</span>
            </button>;
          })}</div>
        </div>
        <div className="course-detail-panel">
          {selectedCourse ? <>
            <div className="course-detail-heading"><div><span className="course-code">{selectedCourse.code}</span><h3>{selectedCourse.title}</h3><p>{selectedCourse.department}</p></div><span className="badge badge-active">{selectedCourse.status}</span></div>
            <div className="course-facts"><div><span>Instructor</span><strong>{selectedCourse.instructor}</strong></div><div><span>Semester</span><strong>{selectedCourse.semester}</strong></div><div><span>Credit Hours</span><strong>{selectedCourse.credits}</strong></div><div><span>Enrolled Students</span><strong>{enrolledStudents.length}</strong></div></div>
            <div className="enrollment-heading"><h4>Student Enrollment</h4><span>Use the checkbox to register or remove a student</span></div>
            <div className="enrollment-list">{students.map((student) => {
              const enrolled = (student.courseIds || []).includes(selectedCourse.id);
              return <label className="enrollment-row" key={student.id}><div><strong>{student.name}</strong><span>{student.rollNumber} · {student.department}</span></div><input type="checkbox" checked={enrolled} onChange={() => onToggleEnrollment(student.id, selectedCourse.id)} /></label>;
            })}</div>
          </> : <p className="empty-state">No course selected.</p>}
        </div>
      </div>
    </section>
  );
}

export default CoursesPage;
