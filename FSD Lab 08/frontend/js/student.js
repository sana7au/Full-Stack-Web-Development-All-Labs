$(function () {
  if (!requireRole('student')) return;

  $('#logoutBtn').on('click', logout);

  apiRequest({ url: '/student/dashboard' })
    .done(function (res) {
      $('#studentName').text(res.student.fullName);
      $('#studentEmail').text(res.student.email);
      renderCourses(res.courses);
    })
    .fail(function (xhr) {
      if (!handleAuthFailure(xhr)) {
        showAlert($('#alert'), 'error', errorMessage(xhr));
      }
    });

  function renderCourses(courses) {
    const $body = $('#courseBody').empty();
    if (courses.length === 0) {
      $('#courseTable').hide();
      $('#emptyMsg').show();
      return;
    }
    courses.forEach(function (c) {
      $body.append(
        '<tr><td>' + escapeHtml(c.course_code) + '</td>' +
        '<td>' + escapeHtml(c.title) + '</td>' +
        '<td>' + escapeHtml(c.description) + '</td>' +
        '<td>' + escapeHtml(c.credit_hours) + '</td></tr>'
      );
    });
  }
});
