import SummaryCards from '../components/SummaryCards';
import RecentActivity from '../components/RecentActivity';
import DepartmentGpaChart from '../components/DepartmentGpaChart';

function DashboardPage({ students, courses, attendance, departmentOptions, summaryCardData, onNavigate }) {
  const departments = new Set(students.map((student) => student.department));
  const departmentGpaData = departmentOptions.map((department) => {
  const departmentStudents = students.filter(
    (student) => student.department === department
  );

  const totalGpa = departmentStudents.reduce(
    (total, student) => total + (Number.parseFloat(student.gpa) || 0),
    0
  );

  return {
    department,
    studentCount: departmentStudents.length,
    averageGpa: departmentStudents.length
      ? totalGpa / departmentStudents.length
      : null,
  };
});
  const presentCount = attendance.filter((record) => record.status === 'Present').length;
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0;
  const cards = summaryCardData.map((card) => {
    if (card.id === 'totalStudents') return { ...card, value: students.length };
    if (card.id === 'activeCourses') return { ...card, value: courses.filter((course) => course.status === 'Active').length };
    if (card.id === 'attendance') return { ...card, value: `${attendanceRate}%` };
    if (card.id === 'departments') return { ...card, value: departments.size };
    return card;
  });

  return (
      <>
  <SummaryCards cards={cards} />

  <DepartmentGpaChart
    departmentData={departmentGpaData}
  />
      <div className="dashboard-shortcuts">
        <button onClick={() => onNavigate('Students')}>🎓 Manage Students <span>View records and enrollments</span></button>
        <button onClick={() => onNavigate('Courses')}>📚 Manage Courses <span>View courses and class lists</span></button>
        <button onClick={() => onNavigate('Settings')}>⚙️ Profile Settings <span>Change online availability</span></button>
      </div>
      <div className="content-grid dashboard-lower-grid">
        <section className="page-panel dashboard-overview">
          <div className="page-heading"><div><h2>Campus Overview</h2><p>Current academic session at a glance</p></div></div>
          <div className="overview-list">
            <div><span>Registered students</span><strong>{students.length}</strong></div>
            <div><span>Available courses</span><strong>{courses.length}</strong></div>
            <div><span>Departments represented</span><strong>{departments.size}</strong></div>
          </div>
        </section>
        <RecentActivity />
      </div>
    </>
  );
}

export default DashboardPage;
