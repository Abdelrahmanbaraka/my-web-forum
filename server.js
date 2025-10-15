require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'forum-secret-key-2024',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global variables middleware
app.use((req, res, next) => {
  // إذا لم يكن هناك لغة محددة في الجلسة، تعيين الألمانية كافتراضي
  if (!req.session.language) {
    req.session.language = 'de';
  }
  
  // تمرير المتغيرات لجميع الـ views
  res.locals.currentUser = req.session.user || null;
  res.locals.currentLanguage = req.session.language || 'de';
  res.locals.searchQuery = '';
  
  next();
});

// Routes
app.use('/', require('./routes/mainRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/posts', require('./routes/postRoutes'));

// Route for changing language
app.post('/change-language', (req, res) => {
  const { language } = req.body;
  if (language === 'en' || language === 'de') {
    req.session.language = language;
  }
  res.redirect('back');
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render('error', {
    error: req.session.language === 'de' 
      ? 'Seite nicht gefunden' 
      : 'Page not found',
    currentLanguage: req.session.language || 'de',
    currentUser: req.session.user || null,
    searchQuery: '',
    cssFiles: ['style.css']
  });
});

// Handle other errors
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).render('error', {
    error: req.session.language === 'de'
      ? 'Interner Serverfehler'
      : 'Internal server error',
    currentLanguage: req.session.language || 'de',
    currentUser: req.session.user || null,
    searchQuery: '',
    cssFiles: ['style.css']
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Views directory: ${path.join(__dirname, 'views')}`);
  console.log(`🌐 Language: ${process.env.LANGUAGE || 'de (default)'}`);
});