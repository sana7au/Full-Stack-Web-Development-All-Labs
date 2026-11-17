import { useState } from 'react';
import { departmentOptions, initialAttendance, initialCourses, initialStudents, newStudentDefaults, summaryCardData } from '../data/dashboardData';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardPage from '../pages/DashboardPage';
import StudentsPage from '../pages/StudentsPage';
import CoursesPage from '../pages/CoursesPage';
import AttendancePage from '../pages/AttendancePage';
import SettingsPage from '../pages/SettingsPage';

const pages = {
  Dashboard: DashboardPage,
  Students: StudentsPage,
  Courses: CoursesPage,
  Attendance: AttendancePage,
  Settings: SettingsPage,
};

function readSaved(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function AppLayout() {
  const [students, setStudents] = useState(() => readSaved('campushub-students', initialStudents));
  const [courses] = useState(() => readSaved('campushub-courses', initialCourses));
  const [attendance, setAttendance] = useState(() => readSaved('campushub-attendance', initialAttendance));
  const [onlineStatus, setOnlineStatus] = useState(() => readSaved('campushub-online-status', 'Online'));

  const saveStudents = (updater) => setStudents((current) => {
    const next = typeof updater === 'function' ? updater(current) : updater;
    localStorage.setItem('campushub-students', JSON.stringify(next));
    return next;
  });
  const updateOnlineStatus = (status) => {
    setOnlineStatus(status);
    localStorage.setItem('campushub-online-status', JSON.stringify(status));
  };

  const addStudent = (student) => saveStudents((current) => [...current, {
    ...student, id: Date.now(), gpa: '0.00', status: 'Active', courseIds: student.courseIds || [],
  }]);
  const deleteStudent = (studentId) => {
    saveStudents((current) => current.filter((student) => student.id !== studentId));
    setAttendance((current) => {
      const next = current.filter((record) => record.studentId !== studentId);
      localStorage.setItem('campushub-attendance', JSON.stringify(next));
      return next;
    });
  };
  const toggleEnrollment = (studentId, courseId) => saveStudents((current) => current.map((student) => {
    if (student.id !== studentId) return student;
    const enrolled = student.courseIds || [];
    return { ...student, courseIds: enrolled.includes(courseId) ? enrolled.filter((id) => id !== courseId) : [...enrolled, courseId] };
  }));
  const updateAttendance = (recordId, status) => setAttendance((current) => {
    const next = current.map((record) => record.id === recordId ? { ...record, status } : record);
    localStorage.setItem('campushub-attendance', JSON.stringify(next));
    return next;
  });

  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const PageComponent = pages[activePage] || DashboardPage;

  // Every page receives only the data and handlers it needs, through props
  const pageProps = {
    Dashboard: { students, courses, attendance, departmentOptions, summaryCardData, onNavigate: setActivePage },
    Students: { students, courses, departmentOptions, newStudentDefaults, onAddStudent: addStudent, onDeleteStudent: deleteStudent },
    Courses: { students, courses, onToggleEnrollment: toggleEnrollment },
    Attendance: { students, courses, attendance, onUpdateAttendance: updateAttendance },
    Settings: { onlineStatus, onUpdateOnlineStatus: updateOnlineStatus },
  };

  return (
    <div className={`dashboard-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isCollapsed={isSidebarCollapsed}
        onlineStatus={onlineStatus}
        onToggle={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
      />
      <div className="main-wrapper">
        <Header pageTitle={activePage} onlineStatus={onlineStatus} />
        <main className="dashboard-content">
          <PageComponent {...(pageProps[activePage] || pageProps.Dashboard)} />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
