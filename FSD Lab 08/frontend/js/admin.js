$(function () {
  if (!requireRole('admin')) return;

  const $alert = $('#alert');

  $('#logoutBtn').on('click', logout);
  $('#cancelBtn').on('click', resetForm);

  function onFail(xhr) {
    if (!handleAuthFailure(xhr)) {
      showAlert($alert, 'error', errorMessage(xhr));
    }
  }

  function loadSummary() {
    apiRequest({ url: '/admin/dashboard' })
      .done(function (res) {
        $('#adminName').text(res.admin.fullName);
        $('#totalStudents').text(res.totals.students);
        $('#totalCourses').text(res.totals.courses);
      })
      .fail(onFail);
  }

  function loadCourses() {
    apiRequest({ url: '/admin/courses' })
      .done(function (res) {
        const $body = $('#courseBody').empty();
        $('#emptyMsg').toggle(res.courses.length === 0);
        $('#courseTable').toggle(res.courses.length > 0);

        res.courses.forEach(function (c) {
          const $row = $(
            '<tr><td>' + escapeHtml(c.course_code) + '</td>' +
            '<td>' + escapeHtml(c.title) + '</td>' +
            '<td>' + escapeHtml(c.description) + '</td>' +
            '<td>' + escapeHtml(c.credit_hours) + '</td>' +
            '<td class="actions">' +
            '<button class="secondary edit">Edit</button>' +
            '<button class="danger delete">Delete</button></td></tr>'
          );
          $row.find('.edit').on('click', function () { fillForm(c); });
          $row.find('.delete').on('click', function () { removeCourse(c); });
          $body.append($row);
        });
      })
      .fail(onFail);
  }

  function fillForm(c) {
    $('#courseId').val(c.id);
    $('#courseCode').val(c.course_code);
    $('#title').val(c.title);
    $('#creditHours').val(c.credit_hours);
    $('#description').val(c.description);
    $('#formTitle').text('Edit course');
    $('#saveBtn').text('Update course');
    $('#cancelBtn').show();
    $('#courseCode').trigger('focus');
  }

  function resetForm() {
    $('#courseForm')[0].reset();
    $('#courseId').val('');
    $('#formTitle').text('Add course');
    $('#saveBtn').text('Add course');
    $('#cancelBtn').hide();
  }

  function removeCourse(c) {
    if (!window.confirm('Delete ' + c.course_code + ' - ' + c.title + '?')) return;

    apiRequest({ url: '/admin/courses/' + c.id, method: 'DELETE' })
      .done(function (res) {
        showAlert($alert, 'success', res.message);
        resetForm();
        loadCourses();
        loadSummary();
      })
      .fail(onFail);
  }

  $('#courseForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#courseId').val();
    const payload = {
      courseCode: $('#courseCode').val().trim(),
      title: $('#title').val().trim(),
      creditHours: $('#creditHours').val(),
      description: $('#description').val().trim()
    };

    if (!payload.courseCode || payload.title.length < 3) {
      return showAlert($alert, 'error', 'Course code and a title of at least 3 characters are required.');
    }

    apiRequest({
      url: id ? '/admin/courses/' + id : '/admin/courses',
      method: id ? 'PUT' : 'POST',
      data: payload
    })
      .done(function (res) {
        showAlert($alert, 'success', res.message);
        resetForm();
        loadCourses();
        loadSummary();
      })
      .fail(onFail);
  });

  loadSummary();
  loadCourses();
});
