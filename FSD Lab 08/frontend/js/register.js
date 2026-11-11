$(function () {
  $('#registerForm').on('submit', function (e) {
    e.preventDefault();
    const $alert = $('#alert');

    const payload = {
      fullName: $('#fullName').val().trim(),
      email: $('#email').val().trim(),
      password: $('#password').val()
    };

    if (payload.fullName.length < 3) return showAlert($alert, 'error', 'Full name must be at least 3 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return showAlert($alert, 'error', 'Enter a valid email address.');
    if (payload.password.length < 6) return showAlert($alert, 'error', 'Password must be at least 6 characters.');

    apiRequest({ url: '/auth/register', method: 'POST', data: payload })
      .done(function (res) {
        showAlert($alert, 'success', res.message);
        $('#registerForm')[0].reset();
        setTimeout(function () { window.location.href = 'login.html'; }, 1500);
      })
      .fail(function (xhr) {
        showAlert($alert, 'error', errorMessage(xhr));
      });
  });
});
