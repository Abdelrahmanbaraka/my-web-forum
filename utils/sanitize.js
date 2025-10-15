// /utils/sanitize.js
const validator = require('validator');

function sanitizeText(input = '') {
  let s = String(input);
  // trim and escape HTML entities
  s = s.trim();
  // basic escape
  s = s.replace(/[&<>"'`]/g, (m) =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;', '`':'&#96;'}[m])
  );
  return s;
}

function isEmail(email) {
  return validator.isEmail(String(email || '').trim());
}

module.exports = { sanitizeText, isEmail };
