const Post = require('../models/postModel');
const db = require('../config/db'); // ⬅️ لازم نضيف هذا السطر

const categories = [
  { id: 'all', name: 'All Categories', nameDE: 'Alle Kategorien', icon: '📋', postCount: 0 },
  { id: 'general', name: 'General Discussion', nameDE: 'Allgemeine Diskussion', icon: '💬', postCount: 0 },
  { id: 'technology', name: 'Technology', nameDE: 'Technologie', icon: '💻', postCount: 0 },
  { id: 'privacy', name: 'Privacy & Security', nameDE: 'Datenschutz & Sicherheit', icon: '🔒', postCount: 0 },
  { id: 'community', name: 'Community', nameDE: 'Gemeinschaft', icon: '👥', postCount: 0 },
  { id: 'anonymous', name: 'Anonymous Posts', nameDE: 'Anonyme Beiträge', icon: '🎭', postCount: 0 }
];

exports.getHomePage = async (req, res) => {
  const currentLanguage = req.session.language || 'de';
  try {
    const selectedCategory = req.query.category || 'all';
    const searchQuery = req.query.search || '';
    
    console.log('🎯 [CONTROLLER] Request received:', {
      category: selectedCategory,
      search: searchQuery,
      url: req.url,
      query: req.query
    });
    
    let posts = await Post.findAll(selectedCategory, searchQuery);
    
    console.log('📊 [CONTROLLER] Posts returned to view:', posts.length);
    
    // استدعاء الدالة المعدلة
    await updateCategoryCounts(); // ⬅️ await لأنها async الآن
    
    res.render('index', {
      currentUser: req.session.user || null,
      currentLanguage,
      categories,
      posts,
      selectedCategory,
      searchQuery,
      cssFiles: ['style.css', 'forum.css']
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Error fetching home page:', error);
    res.status(500).render('error', {
      currentUser: req.session.user || null,
      currentLanguage,
      error: 'Failed to load home page',
      searchQuery: '',
      cssFiles: ['style.css']
    });
  } // ⬅️ كانت ناقصة هنا
};

exports.getProfilePage = (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  res.render('profile', {
    currentUser: req.session.user,
    currentLanguage: req.session.language || 'de',
    searchQuery: '',
    cssFiles: ['style.css', 'profile.css']
  });
};

exports.changeLanguage = (req, res) => {
  const { language } = req.body;
  if (language === 'en' || language === 'de') req.session.language = language;
  res.redirect('back');
};

// الدالة المعدلة لحساب العدد الصحيح
async function updateCategoryCounts() {
  try {
    console.log('🔄 [COUNTS] Starting to update category counts...');
    
    // إعادة تعيين العداد
    categories.forEach(cat => cat.postCount = 0);
    
    // حساب العدد الفعلي لكل فئة من قاعدة البيانات
    for (let category of categories) {
      if (category.id === 'all') {
        const allResult = await db.query('SELECT COUNT(*) FROM posts');
        category.postCount = parseInt(allResult.rows[0].count);
        console.log(`📊 [COUNTS] All posts: ${category.postCount}`);
      } else {
        const catResult = await db.query('SELECT COUNT(*) FROM posts WHERE category = $1', [category.id]);
        category.postCount = parseInt(catResult.rows[0].count);
        console.log(`📊 [COUNTS] ${category.id}: ${category.postCount}`);
      }
    }
    
    console.log('✅ [COUNTS] Category counts updated successfully');
  } catch (error) {
    console.error('❌ [COUNTS] Error updating category counts:', error);
  }
}