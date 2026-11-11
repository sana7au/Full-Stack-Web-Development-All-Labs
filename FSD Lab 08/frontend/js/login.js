$(function () {
  const params = new URLSearchParams(window.location.search);
  const $alert = $('#alert');

  if (params.get('loggedout')) showAlert($alert, 'success', 'You have been logged out.');
  if (params.get('msg')) showAlert($alert, 'error', params.get('msg'));

  $('#loginForm').on('submit', function (e) {
    e.preventDefault();

    const payload = {
      email: $('#email').val().trim(),
      password: $('#password').val()
    };

    if (!payload.email || !payload.password) {
      return showAlert($alert, 'error', 'Email and password are required.');
    }

    apiRequest({ url: '/auth/login', method: 'POST', data: payload })
      .done(function (res) {
        Session.save(res.token, res.user);
        window.location.href = res.user.role === 'admin' ? 'admin-dashboard.html' : 'student-dashboard.html';
      })
      .fail(function (xhr) {
        showAlert($alert, 'error', errorMessage(xhr));
      });
  });
});
