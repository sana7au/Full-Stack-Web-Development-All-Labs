// dashboardData.js - Local data for CampusHub
export const departmentOptions = [
  'Computer Science',
  'Software Engineering',
  'Artificial Intelligence',
  'Information Technology',
];

export const initialCourses = [
  { id: 'CS301', code: 'CS-301', title: 'Full Stack Development', department: 'Computer Science', instructor: 'Mr. Fahad Qasim', credits: 3, semester: '5th', status: 'Active' },
  { id: 'CS302', code: 'CS-302', title: 'Database Systems', department: 'Computer Science', instructor: 'Ms. Ayesha Khan', credits: 3, semester: '5th', status: 'Active' },
  { id: 'CS205', code: 'CS-205', title: 'Data Structures', department: 'Computer Science', instructor: 'Mr. Usman Ali', credits: 4, semester: '3rd', status: 'Active' },
  { id: 'SE401', code: 'SE-401', title: 'Software Quality Assurance', department: 'Software Engineering', instructor: 'Dr. Hina Malik', credits: 3, semester: '7th', status: 'Active' },
  { id: 'SE203', code: 'SE-203', title: 'Software Design', department: 'Software Engineering', instructor: 'Mr. Hamza Raza', credits: 3, semester: '3rd', status: 'Active' },
  { id: 'AI301', code: 'AI-301', title: 'Machine Learning', department: 'Artificial Intelligence', instructor: 'Dr. Sara Ahmed', credits: 3, semester: '5th', status: 'Active' },
  { id: 'IT101', code: 'IT-101', title: 'Introduction to Computing', department: 'Information Technology', instructor: 'Ms. Noor Fatima', credits: 3, semester: '1st', status: 'Active' },
];

export const initialStudents = [
  { id: 1, name: 'Ali Khan', rollNumber: 'CS-101', department: 'Computer Science', semester: '5th', email: 'ali.khan@campushub.edu', gpa: '3.72', status: 'Active', courseIds: ['CS301', 'CS302', 'CS205'] },
  { id: 2, name: 'Sara Ahmed', rollNumber: 'CS-102', department: 'Computer Science', semester: '3rd', email: 'sara.ahmed@campushub.edu', gpa: '3.91', status: 'Active', courseIds: ['CS205', 'CS301'] },
  { id: 3, name: 'Hamza Malik', rollNumber: 'SE-103', department: 'Software Engineering', semester: '7th', email: 'hamza.malik@campushub.edu', gpa: '3.45', status: 'Active', courseIds: ['SE401', 'SE203'] },
  { id: 4, name: 'Ayesha Noor', rollNumber: 'AI-104', department: 'Artificial Intelligence', semester: '5th', email: 'ayesha.noor@campushub.edu', gpa: '3.84', status: 'Active', courseIds: ['AI301'] },
  { id: 5, name: 'Bilal Hassan', rollNumber: 'IT-105', department: 'Information Technology', semester: '1st', email: 'bilal.hassan@campushub.edu', gpa: '3.20', status: 'Inactive', courseIds: ['IT101'] },
  { id: 6, name: 'Hira Shah', rollNumber: 'SE-106', department: 'Software Engineering', semester: '3rd', email: 'hira.shah@campushub.edu', gpa: '3.68', status: 'Active', courseIds: ['SE203'] },
];

export const newStudentDefaults = {
  name: '', rollNumber: '', department: departmentOptions[0], semester: '1st', email: '', courseIds: [], initialCourse: '',
};

export const summaryCardData = [
  { id: 'totalStudents', title: 'Total Students', icon: '👨‍🎓', description: 'Enrolled across all programs', theme: 'blue' },
  { id: 'activeCourses', title: 'Active Courses', icon: '📚', description: 'Current course offerings', theme: 'indigo' },
  { id: 'attendance', title: 'Average Attendance', value: '87%', icon: '📊', description: 'Current semester average', theme: 'emerald' },
  { id: 'departments', title: 'Departments', icon: '🏛️', description: 'Faculties in operation', theme: 'amber' },
];

export const initialAttendance = [
  { id: 1, studentId: 1, courseId: 'CS301', date: '2026-11-16', status: 'Present' },
  { id: 2, studentId: 2, courseId: 'CS301', date: '2026-11-16', status: 'Present' },
  { id: 3, studentId: 3, courseId: 'SE401', date: '2026-11-16', status: 'Absent' },
  { id: 4, studentId: 4, courseId: 'AI301', date: '2026-11-16', status: 'Present' },
  { id: 5, studentId: 5, courseId: 'IT101', date: '2026-11-16', status: 'Present' },
  { id: 6, studentId: 6, courseId: 'SE203', date: '2026-11-16', status: 'Present' },
];
