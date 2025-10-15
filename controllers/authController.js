// controllers/authController.js
const User = require('../models/userModel');

exports.getLoginPage = (req, res) => {
  res.render('login', {
    currentUser: req.session.user || null,
    currentLanguage: req.session.language || 'de',
    error: null,
    cssFiles: ['style.css', 'auth.css']
  });
};

exports.getRegisterPage = (req, res) => {
  res.render('register', {
    currentUser: req.session.user || null,
    currentLanguage: req.session.language || 'de',
    error: null,
    cssFiles: ['style.css', 'auth.css']
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.render('login', {
        currentUser: null,
        currentLanguage: req.session.language || 'de',
        error: 'Email and password are required',
        cssFiles: ['style.css', 'auth.css']
      });
    }

    // Hardcoded admin (example)
    if (email === 'admin@forum.com' && password === 'password123') {
      req.session.user = {
        id: 1,
        username: 'Admin',
        email: 'admin@forum.com',
        isAnonymous: false,
        createdAt: new Date().toISOString() // give admin a valid createdAt
      };
      return res.redirect('/');
    }

    const user = await User.findByEmail(email);
    if (user && await User.validatePassword(password, user.password_hash)) {
      // Normalize date field (support created_at or createdAt or created)
      const createdRaw = user.createdAt || user.created_at || user.created || null;
      const createdAt = createdRaw ? (new Date(createdRaw)).toISOString() : null;

      // Build session user (do not include password hash)
      const sessionUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        isAnonymous: user.is_anonymous || false,
        createdAt
      };

      // store in session
      req.session.user = sessionUser;
      return res.redirect('/');
    }

    res.render('login', {
      currentUser: null,
      currentLanguage: req.session.language || 'de',
      error: 'Invalid email or password',
      cssFiles: ['style.css', 'auth.css']
    });

  } catch (error) {
    console.error('Login error:', error);
    res.render('login', {
      currentUser: null,
      currentLanguage: req.session.language || 'de',
      error: 'An error occurred during login',
      cssFiles: ['style.css', 'auth.css']
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
      return res.render('register', {
        currentUser: null,
        currentLanguage: req.session.language || 'de',
        error: 'All fields are required',
        cssFiles: ['style.css', 'auth.css']
      });
    }

    if (password !== confirmPassword) {
      return res.render('register', {
        currentUser: null,
        currentLanguage: req.session.language || 'de',
        error: 'Passwords do not match',
        cssFiles: ['style.css', 'auth.css']
      });
    }

    if (password.length < 6) {
      return res.render('register', {
        currentUser: null,
        currentLanguage: req.session.language || 'de',
        error: 'Password must be at least 6 characters long',
        cssFiles: ['style.css', 'auth.css']
      });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.trim(),
      password: password,
      isAnonymous: false
    });

    // Normalize created date for session
    const createdRaw = user.createdAt || user.created_at || user.created || null;
    const createdAt = createdRaw ? (new Date(createdRaw)).toISOString() : null;

    const sessionUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAnonymous: user.is_anonymous || false,
      createdAt
    };

    // remove password hash if present
    if (sessionUser.password_hash) delete sessionUser.password_hash;

    req.session.user = sessionUser;

    console.log('✅ User registered with real ID:', user.id);
    res.redirect('/');

  } catch (error) {
    console.error('Registration error:', error);
    
    let errorMessage = 'An error occurred during registration';
    if (error.code === '23505') {
      errorMessage = 'Email already exists';
    }
    
    res.render('register', {
      currentUser: null,
      currentLanguage: req.session.language || 'de',
      error: errorMessage,
      cssFiles: ['style.css', 'auth.css']
    });
  }
};

exports.anonymousLogin = async (req, res) => {
  try {
    const username = `Anonymous_${Date.now()}`;
    const user = await User.create({
      username,
      email: null,
      password: null,
      isAnonymous: true
    });

    const createdRaw = user.createdAt || user.created_at || user.created || null;
    const createdAt = createdRaw ? (new Date(createdRaw)).toISOString() : new Date().toISOString();

    const sessionUser = {
      id: user.id,
      username: user.username,
      isAnonymous: true,
      createdAt
    };

    req.session.user = sessionUser;

    console.log('✅ Anonymous user created with real ID:', user.id);
    res.redirect('/');
  } catch (error) {
    console.error('Anonymous login error:', error);
    res.redirect('/auth/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Logout error:', err);
    res.redirect('/');
  });
};
