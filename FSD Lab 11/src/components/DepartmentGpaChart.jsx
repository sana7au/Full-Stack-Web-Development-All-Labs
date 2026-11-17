
function DepartmentGpaChart({ departmentData }) {
  return (
    <section className="page-panel department-gpa-panel">
      <div className="department-gpa-heading">
        <div>
          <h2>Department GPA Performance</h2>
          <p>Average GPA of students in each department</p>
        </div>
        <span className="gpa-scale-label">
          GPA scale: 0.00 – 4.00
        </span>
      </div>

      {departmentData.some((item) => item.studentCount > 0) ? (
        <div
          className="department-gpa-chart"
          aria-label="Average GPA by department"
        >
          <div className="gpa-axis-row">
            <span>Department</span>

            <div className="gpa-axis-values" aria-hidden="true">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>

            <span className="gpa-axis-average-label">
              Average
            </span>
          </div>

          {departmentData.map((item) => (
            <div className="gpa-bar-row" key={item.department}>
              <div className="gpa-department-name">
                <strong>{item.department}</strong>
                <small>
                  {item.studentCount}{" "}
                  {item.studentCount === 1 ? "student" : "students"}
                </small>
              </div>

              <div
                className="gpa-bar-track"
                role="img"
                aria-label={`${item.department}: ${
                  item.averageGpa === null
                    ? "No GPA data"
                    : `${item.averageGpa.toFixed(2)} out of 4.00`
                }`}
              >
                {item.averageGpa !== null && (
                  <span
                    className="gpa-bar-fill"
                    style={{
                      width: `${Math.min(
                        (item.averageGpa / 4) * 100,
                        100
                      )}%`,
                    }}
                  />
                )}
              </div>

              <strong className="gpa-average-value">
                {item.averageGpa === null
                  ? "—"
                  : item.averageGpa.toFixed(2)}
              </strong>
            </div>
          ))}

          <p className="gpa-chart-note">
            Each bar represents the department's mean GPA.
            The maximum GPA is 4.00.
          </p>
        </div>
      ) : (
        <div className="gpa-empty-state">
          No student GPA records are available to display.
        </div>
      )}
    </section>
  );
}

export default DepartmentGpaChart;
