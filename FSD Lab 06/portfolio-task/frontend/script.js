const forms = {
  profile: {
    title: 'Profile',
    url: '/api/profile',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'title', label: 'Job Title', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'about', label: 'About Me', type: 'textarea' },
      { name: 'image', label: 'Profile Image', type: 'file' }
    ]
  },
  skills: {
    title: 'Skill',
    url: '/api/skills',
    fields: [
      { name: 'name', label: 'Skill Name', type: 'text', required: true },
      { name: 'level', label: 'Level (0 to 100)', type: 'number', required: true, min: 0, max: 100, value: 50 }
    ]
  },
  education: {
    title: 'Education',
    url: '/api/education',
    fields: [
      { name: 'degree', label: 'Degree', type: 'text', required: true },
      { name: 'institute', label: 'Institute', type: 'text', required: true },
      { name: 'start_year', label: 'Start Year', type: 'text' },
      { name: 'end_year', label: 'End Year', type: 'text' }
    ]
  },
  experience: {
    title: 'Experience',
    url: '/api/experience',
    fields: [
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'text', required: true },
      { name: 'start_date', label: 'Start Date', type: 'text' },
      { name: 'end_date', label: 'End Date', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  projects: {
    title: 'Project',
    url: '/api/projects',
    fields: [
      { name: 'title', label: 'Project Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'tech', label: 'Technologies (comma separated)', type: 'text' },
      { name: 'link', label: 'Project Link', type: 'url' }
    ]
  }
};

let profile = null;
let editing = { type: null, id: null };
const data = { skills: [], education: [], experience: [], projects: [] };

function esc(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function errorText(xhr) {
  return (xhr.responseJSON && xhr.responseJSON.message) || 'Something went wrong. Please try again.';
}

function actionButtons(type, id) {
  return `<div class="actions">
    <button class="link-btn edit-btn" data-type="${type}" data-id="${id}">Edit</button>
    <button class="link-btn delete-btn" data-type="${type}" data-id="${id}">Delete</button>
  </div>`;
}

/* Card templates */
const renderers = {
  skills(item) {
    const level = Math.min(100, Math.max(0, Number(item.level) || 0));
    return `<div class="card">
      <div class="skill-top"><strong>${esc(item.name)}</strong><span class="muted">${level}%</span></div>
      <div class="bar"><div class="bar-fill" style="width:${level}%"></div></div>
      ${actionButtons('skills', item.id)}
    </div>`;
  },

  education(item) {
    const years = [item.start_year, item.end_year].filter(Boolean).join(' - ');
    return `<div class="card">
      <h3>${esc(item.degree)}</h3>
      <p class="sub">${esc(item.institute)}</p>
      <p class="muted">${esc(years)}</p>
      ${actionButtons('education', item.id)}
    </div>`;
  },

  experience(item) {
    const dates = [item.start_date, item.end_date].filter(Boolean).join(' - ');
    return `<div class="card">
      <h3>${esc(item.role)}</h3>
      <p class="sub">${esc(item.company)}</p>
      <p class="muted">${esc(dates)}</p>
      <p class="desc">${esc(item.description)}</p>
      ${actionButtons('experience', item.id)}
    </div>`;
  },

  projects(item) {
    const tags = (item.tech || '').split(',').map((t) => t.trim()).filter(Boolean);
    const tagHtml = tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('');
    const hasLink = /^https?:\/\//i.test(item.link || '');
    const linkHtml = hasLink ? `<p><a href="${esc(item.link)}" target="_blank" rel="noopener">View Project</a></p>` : '';
    return `<div class="card">
      <h3>${esc(item.title)}</h3>
      <p class="desc">${esc(item.description)}</p>
      <div class="tags">${tagHtml}</div>
      ${linkHtml}
      ${actionButtons('projects', item.id)}
    </div>`;
  }
};

/* Loading and showing data */
function showProfile() {
  if (!profile) {
    $('#navName').text('Portfolio');
    $('#heroName').text('Welcome');
    $('#heroTitle').text('Set up your portfolio');
    $('#avatar').text('?');
    $('#aboutText').text('Add your profile to get started.');
    $('#contactList').empty();
    $('#editProfileBtn').text('Set Up Profile');
    return;
  }

  $('#navName').text(profile.name);
  $('#heroName').text(profile.name);
  $('#heroTitle').text(profile.title);
  $('#aboutText').text(profile.about || '');
  $('#editProfileBtn').text('Edit Profile');

  if (profile.image) {
    $('#avatar').html(`<img src="${esc(profile.image)}" alt="Profile photo">`);
  } else {
    $('#avatar').text(profile.name.charAt(0).toUpperCase());
  }

  const contacts = [
    ['Email', profile.email],
    ['Phone', profile.phone],
    ['Location', profile.location]
  ];
  const html = contacts
    .filter((c) => c[1])
    .map((c) => `<li><span>${c[0]}</span>${esc(c[1])}</li>`)
    .join('');
  $('#contactList').html(html);
}

function loadProfile() {
  $.getJSON(forms.profile.url)
    .done((result) => {
      profile = result;
      showProfile();
      if (!profile) openForm('profile', null);
    })
    .fail(() => $('#heroTitle').text('Could not load profile'));
}

function renderList(type) {
  const rows = data[type];
  const $box = $('#' + type + 'List');
  if (rows.length === 0) {
    $box.html('<p class="empty">Nothing added yet.</p>');
    return;
  }
  $box.html(rows.map(renderers[type]).join(''));
}

function loadList(type) {
  $.getJSON(forms[type].url)
    .done((rows) => {
      data[type] = rows;
      renderList(type);
    })
    .fail(() => $('#' + type + 'List').html('<p class="empty">Could not load data.</p>'));
}

function refresh(type) {
  if (type === 'profile') loadProfile();
  else loadList(type);
}

/* Modal form */
function openForm(type, item) {
  const config = forms[type];
  editing = { type: type, id: type !== 'profile' && item ? item.id : null };

  let title = (item ? 'Edit ' : 'Add ') + config.title;
  if (type === 'profile') title = item ? 'Edit Profile' : 'Set Up Your Profile';
  $('#modalTitle').text(title);

  const html = config.fields.map((f) => {
    const id = 'f_' + f.name;
    const attrs = `id="${id}" name="${f.name}"${f.required ? ' required' : ''}`;
    let input;
    if (f.type === 'textarea') {
      input = `<textarea ${attrs}></textarea>`;
    } else if (f.type === 'file') {
      input = `<input type="file" ${attrs} accept="image/*">`;
    } else {
      const range = f.min !== undefined ? ` min="${f.min}" max="${f.max}"` : '';
      input = `<input type="${f.type}" ${attrs}${range}>`;
    }
    return `<label for="${id}">${f.label}</label>${input}`;
  }).join('');
  $('#formFields').html(html);

  config.fields.forEach((f) => {
    if (f.type === 'file') return;
    const value = item ? item[f.name] : f.value;
    $('#f_' + f.name).val(value ?? '');
  });

  $('#formError').text('');
  $('#modal').addClass('open');
  $('#modalForm input:not([type=file]), #modalForm textarea').first().trigger('focus');
}

function closeModal() {
  $('#modal').removeClass('open');
}

$('#modalForm').on('submit', function (e) {
  e.preventDefault();
  const type = editing.type;
  const config = forms[type];
  let options;

  if (type === 'profile') {
    options = {
      url: config.url,
      method: 'POST',
      data: new FormData(this),
      processData: false,
      contentType: false
    };
  } else {
    const body = {};
    config.fields.forEach((f) => {
      body[f.name] = $('#f_' + f.name).val().trim();
    });
    const isEdit = editing.id !== null;
    options = {
      url: isEdit ? config.url + '/' + editing.id : config.url,
      method: isEdit ? 'PUT' : 'POST',
      data: JSON.stringify(body),
      contentType: 'application/json'
    };
  }

  $.ajax(options)
    .done(() => {
      closeModal();
      refresh(type);
    })
    .fail((xhr) => $('#formError').text(errorText(xhr)));
});

/* Buttons and events */
$(document).on('click', '.add-btn', function () {
  openForm($(this).data('type'), null);
});

$(document).on('click', '.edit-btn', function () {
  const type = $(this).data('type');
  const id = Number($(this).data('id'));
  const item = data[type].find((row) => row.id === id);
  if (item) openForm(type, item);
});

$(document).on('click', '.delete-btn', function () {
  const type = $(this).data('type');
  const id = Number($(this).data('id'));
  if (!confirm('Delete this item?')) return;

  $.ajax({ url: forms[type].url + '/' + id, method: 'DELETE' })
    .done(() => loadList(type))
    .fail((xhr) => alert(errorText(xhr)));
});

$('#editProfileBtn').on('click', () => openForm('profile', profile));
$('#cancelBtn').on('click', closeModal);

$('#modal').on('click', function (e) {
  if (e.target === this) closeModal();
});

$(document).on('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

$('#menuBtn').on('click', () => $('#navLinks').toggleClass('open'));
$('#navLinks a').on('click', () => $('#navLinks').removeClass('open'));

/* Start */
$(function () {
  $('#year').text(new Date().getFullYear());
  loadProfile();
  ['skills', 'education', 'experience', 'projects'].forEach(loadList);
});
