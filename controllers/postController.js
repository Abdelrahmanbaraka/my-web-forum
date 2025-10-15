const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.getCreatePostPage = (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const currentLanguage = req.session.language || 'de';
  res.render('newPost', { 
    currentUser: req.session.user, 
    currentLanguage, 
    categories: categoriesList(), 
    searchQuery: '',
    cssFiles: ['style.css', 'forum.css']
  });
};

exports.createPost = async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const currentLanguage = req.session.language || 'de';

  const { title, content, category, isAnonymous } = req.body;
  if (!title || !content || !category) {
    return res.status(400).render('newPost', { 
      currentUser: req.session.user, 
      currentLanguage, 
      categories: categoriesList(), 
      error: 'Title, content, and category are required', 
      searchQuery: '' 
    });
  }

  await Post.create({ 
    title, 
    content, 
    author_id: req.session.user.id, 
    category, 
    is_anonymous: isAnonymous === 'on' 
  });
  res.redirect('/');
};

exports.getPostPage = async (req, res) => {
  const postId = req.params.id;
  const currentLanguage = req.session.language || 'de';

  const post = await Post.findById(postId);
  if (!post) return res.status(404).render('error', { 
    currentUser: req.session.user || null, 
    currentLanguage, 
    error: 'Post not found', 
    searchQuery: '',
    cssFiles: ['style.css']
  });

  const comments = await Comment.getCommentsForPost(postId).catch(() => []);
  res.render('post', { 
    currentUser: req.session.user || null, 
    currentLanguage, 
    post, 
    comments, 
    searchQuery: '',
    cssFiles: ['style.css', 'post.css']
  });
};

exports.addComment = async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const { content, isAnonymous } = req.body;
  const postId = req.params.id;
  if (!content) return res.redirect(`/posts/${postId}`);

  await Comment.create({ 
    post_id: postId, 
    author_id: req.session.user.id, 
    body: content, 
    anonymous: isAnonymous === 'on' 
  });
  res.redirect(`/posts/${postId}`);
};

function categoriesList() {
  return [
    { id: 'general', name: 'General Discussion', nameDE: 'Allgemeine Diskussion' },
    { id: 'technology', name: 'Technology', nameDE: 'Technologie' },
    { id: 'privacy', name: 'Privacy & Security', nameDE: 'Datenschutz & Sicherheit' },
    { id: 'community', name: 'Community', nameDE: 'Gemeinschaft' },
    { id: 'anonymous', name: 'Anonymous Posts', nameDE: 'Anonyme Beiträge' }
  ];
}