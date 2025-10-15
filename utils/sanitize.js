
const validator = require('validator');

function sanitizeText(input = '') {
  let s = String(input);
  
  s = s.trim();
  
  s = s.replace(/[&<>"'`]/g, (m) =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;', '`':'&#96;'}[m])
  );
  return s;
}

function isEmail(email) {
  return validator.isEmail(String(email || '').trim());
}

module.exports = { sanitizeText, isEmail };
