// StudentTable.jsx - Hardcoded student records table with styled status badges
function StudentTable() {
  return (
    <div className="table-container">
      <div className="table-header-bar">
        <div>
          <h2 className="table-title">Enrolled Students</h2>
          <p className="table-description">Overview of active and registered students</p>
        </div>
        {/* Purely visual button with no functionality */}
        <button type="button" className="btn-view-all">
          View All Students
        </button>
      </div>

      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Semester</th>
              <th>GPA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Student 1 */}
            <tr>
              <td className="roll-no">CS-101</td>
              <td className="student-name">Ali Khan</td>
              <td>Computer Science</td>
              <td>5th</td>
              <td className="gpa-value">3.72</td>
              <td>
                <span className="badge badge-active">Active</span>
              </td>
            </tr>

            {/* Student 2 */}
            <tr>
              <td className="roll-no">CS-102</td>
              <td className="student-name">Sara Ahmed</td>
              <td>Computer Science</td>
              <td>3rd</td>
              <td className="gpa-value">3.91</td>
              <td>
                <span className="badge badge-active">Active</span>
              </td>
            </tr>

            {/* Student 3 */}
            <tr>
              <td className="roll-no">SE-103</td>
              <td className="student-name">Hamza Malik</td>
              <td>Software Engineering</td>
              <td>7th</td>
              <td className="gpa-value">3.45</td>
              <td>
                <span className="badge badge-active">Active</span>
              </td>
            </tr>

            {/* Student 4 */}
            <tr>
              <td className="roll-no">AI-104</td>
              <td className="student-name">Ayesha Noor</td>
              <td>Artificial Intelligence</td>
              <td>5th</td>
              <td className="gpa-value">3.84</td>
              <td>
                <span className="badge badge-active">Active</span>
              </td>
            </tr>

            {/* Student 5 */}
            <tr>
              <td className="roll-no">IT-105</td>
              <td className="student-name">Bilal Hassan</td>
              <td>Information Technology</td>
              <td>1st</td>
              <td className="gpa-value">3.20</td>
              <td>
                <span className="badge badge-inactive">Inactive</span>
              </td>
            </tr>

            {/* Student 6 */}
            <tr>
              <td className="roll-no">SE-106</td>
              <td className="student-name">Hira Shah</td>
              <td>Software Engineering</td>
              <td>3rd</td>
              <td className="gpa-value">3.68</td>
              <td>
                <span className="badge badge-active">Active</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;
