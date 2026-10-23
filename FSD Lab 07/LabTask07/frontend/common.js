const API = '';
function savedKey() { return localStorage.getItem('universityApiKey') || ''; }
function saveKey(value) { localStorage.setItem('universityApiKey', value.trim()); }
function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function apiRequest(url, method, key, body) {
  return $.ajax({
    url: API + url,
    method: method || 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: key ? {'x-api-key': key} : {},
    data: body ? JSON.stringify(body) : undefined
  });
}
function showMessage(selector, message, type) {
  $(selector).removeClass('ok fail').addClass(type || '').text(message);
}
function loadSavedKey(selector) { $(selector).val(savedKey()); }
function nav(active) {
  return `<div class="topbar"><div class="brand">UNI<span>API</span> / Access Control</div>
  <nav><a href="/">Home</a><a href="/student">Student</a><a href="/teacher">Teacher</a><a href="/admin">Admin</a></nav></div>`;
}
