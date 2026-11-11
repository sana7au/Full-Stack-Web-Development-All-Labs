const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistration({ fullName, email, password }) {
  if (typeof fullName !== 'string' || fullName.trim().length < 3) {
    return 'Full name must be at least 3 characters.';
  }
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return 'Enter a valid email address.';
  }
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  return null;
}

function validateCourse({ courseCode, title, description, creditHours }) {
  if (typeof courseCode !== 'string' || courseCode.trim().length < 2) {
    return 'Course code is required.';
  }
  if (typeof title !== 'string' || title.trim().length < 3) {
    return 'Course title must be at least 3 characters.';
  }
  if (description !== undefined && description !== null && typeof description !== 'string') {
    return 'Description must be text.';
  }
  const hours = Number(creditHours);
  if (!Number.isInteger(hours) || hours < 1 || hours > 6) {
    return 'Credit hours must be a whole number between 1 and 6.';
  }
  return null;
}

module.exports = { validateRegistration, validateCourse, EMAIL_REGEX };
