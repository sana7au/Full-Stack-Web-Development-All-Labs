const Session = {
  save(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  token() {
    return localStorage.getItem('token');
  },
  user() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      return null;
    }
  },
  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

function apiRequest({ url, method = 'GET', data }) {
  const headers = {};
  if (Session.token()) {
    headers.Authorization = 'Bearer ' + Session.token();
  }
  return $.ajax({
    url: '/api' + url,
    method,
    headers,
    contentType: 'application/json',
    data: data ? JSON.stringify(data) : undefined
  });
}

function errorMessage(xhr) {
  return (xhr.responseJSON && xhr.responseJSON.message) || 'Could not reach the server. Check that it is running.';
}

function handleAuthFailure(xhr) {
  if (xhr.status === 401) {
    const message = encodeURIComponent(errorMessage(xhr));
    Session.clear();
    window.location.href = 'login.html?msg=' + message;
    return true;
  }
  if (xhr.status === 403) {
    window.location.href = 'index.html';
    return true;
  }
  return false;
}

function requireRole(role) {
  const user = Session.user();
  if (!Session.token() || !user || user.role !== role) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function logout() {
  Session.clear();
  window.location.href = 'login.html?loggedout=1';
}

function showAlert($el, type, message) {
  $el.removeClass('error success').addClass(type).text(message).show();
}

function escapeHtml(value) {
  return $('<div>').text(value === null || value === undefined ? '' : value).html();
}
