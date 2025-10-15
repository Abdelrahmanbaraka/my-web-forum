// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initMobileMenu();
    initSearch();
    initCategoryFilters();
    initPostInteractions();
    initLanguageSwitcher();
    initAnimations();
    initFormValidations();
    initUserInteractions();
    
    console.log('🚀 Web Forum initialized successfully');
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            
            // Animate hamburger icon
            const bars = mobileMenuButton.querySelectorAll('span');
            bars.forEach(bar => bar.classList.toggle('active'));
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && mobileMenuButton && 
            !mobileMenu.contains(event.target) && 
            !mobileMenuButton.contains(event.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
        }
    });
}

// Search Functionality

function initSearch() {
    
    const searchInput = document.getElementById('searchInput') || document.querySelector('.search-input');
    const searchForm = document.getElementById('searchForm') || document.querySelector('.search-form');

    if (searchInput && searchForm) {
        
        searchInput.addEventListener('input', debounce(function(e) {
            const query = e.target.value.trim();
            if (query.length > 2) {
                showSearchSuggestions(query);
            }
        }, 300));

        // Quick search on Enter — use keydown for broader compatibility
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                
                e.preventDefault();
                if (searchForm) {
                    // Ensure hidden category input is up-to-date (in case active category changed via JS)
                    const activeCategory = document.querySelector('.category-item.active .category-link')?.dataset?.category;
                    const hiddenCategory = searchForm.querySelector('input[name="category"]');
                    if (activeCategory && hiddenCategory) hiddenCategory.value = activeCategory;
                    searchForm.submit();
                }
            }
        });
    }
}

function performSearch() {
    const searchForm = document.getElementById('searchForm') || document.querySelector('.search-form');
    if (searchForm) {
        // update category hidden input from active category if exists
        const activeCategory = document.querySelector('.category-item.active .category-link')?.dataset?.category;
        const hiddenCategory = searchForm.querySelector('input[name="category"]');
        if (activeCategory && hiddenCategory) hiddenCategory.value = activeCategory;
        searchForm.submit();
    } else {
        // Fallback: redirect with search + category from input
        const searchInput = document.getElementById('searchInput') || document.querySelector('.search-input');
        const activeCategory = document.querySelector('.category-item.active .category-link')?.dataset?.category || 'all';
        const q = encodeURIComponent(searchInput ? searchInput.value.trim() : '');
        window.location.href = `/?category=${activeCategory}&search=${q}`;
    }
}


// Category Filtering
function initCategoryFilters() {
    const categoryLinks = document.querySelectorAll('.category-link');
    const categoryItems = document.querySelectorAll('.category-item');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
    
            categoryItems.forEach(cat => cat.classList.remove('active'));
            const li = this.closest('.category-item');
            if (li) li.classList.add('active');

           
        });
    });
}


function filterPostsByCategory(categoryId) {
    const postCards = document.querySelectorAll('.post-card');
    const noPostsMessage = document.getElementById('noPostsMessage');
    
    let visibleCount = 0;
    
    postCards.forEach(card => {
        const postCategory = card.getAttribute('data-category');
        
        if (categoryId === 'all' || postCategory === categoryId) {
            card.style.display = 'block';
            animateElement(card, 'fadeIn');
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no posts message
    if (noPostsMessage) {
        if (visibleCount === 0) {
            noPostsMessage.style.display = 'block';
            animateElement(noPostsMessage, 'bounceIn');
        } else {
            noPostsMessage.style.display = 'none';
        }
    }
}

// Post Interactions (Likes, Comments, Shares)
function initPostInteractions() {
    // Like buttons
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            toggleLike(postId, this);
        });
    });
    
    // Comment buttons
    const commentButtons = document.querySelectorAll('.comment-btn');
    commentButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            scrollToComments(postId);
        });
    });
    
    // Share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            sharePost(postId);
        });
    });
}

// Language Switcher
function initLanguageSwitcher() {
    const languageForms = document.querySelectorAll('.language-form');
    
    languageForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const language = this.querySelector('input[name="language"]').value;
            switchLanguage(language);
        });
    });
    
    // Quick language switch buttons
    const quickLangButtons = document.querySelectorAll('.quick-lang-btn');
    quickLangButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            switchLanguage(language);
        });
    });
}

// Animations
function initAnimations() {
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .bounce-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Add hover effects
    const interactiveCards = document.querySelectorAll('.post-card, .category-item, .user-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
    });
}

// Form Validations
function initFormValidations() {
    const forms = document.querySelectorAll('form[needs-validation]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showFormErrors(this);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

// User Interactions
function initUserInteractions() {
    // User menu toggle
    const userMenuButtons = document.querySelectorAll('.user-menu-btn');
    userMenuButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const menu = this.nextElementSibling;
            menu.classList.toggle('hidden');
        });
    });
    
    // Close user menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu-container')) {
            document.querySelectorAll('.user-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
        }
    });
    
    // Notification bell
    const notificationBell = document.getElementById('notificationBell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            toggleNotifications();
        });
    }
}

// API Functions
async function toggleLike(postId, button) {
    try {
        const response = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateLikeUI(button, data.liked, data.likesCount);
        }
    } catch (error) {
        console.error('Like error:', error);
        showNotification('Error liking post', 'error');
    }
}

async function addComment(postId, content) {
    try {
        const response = await fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });
        
        if (response.ok) {
            const data = await response.json();
            displayNewComment(data.comment);
            clearCommentForm();
            showNotification('Comment added successfully', 'success');
        }
    } catch (error) {
        console.error('Comment error:', error);
        showNotification('Error adding comment', 'error');
    }
}

// UI Update Functions
function updateLikeUI(button, liked, likesCount) {
    const icon = button.querySelector('i');
    const countSpan = button.querySelector('.like-count');
    
    if (liked) {
        icon.classList.remove('far', 'fa-heart');
        icon.classList.add('fas', 'fa-heart', 'text-red-500');
        button.classList.add('liked');
    } else {
        icon.classList.remove('fas', 'fa-heart', 'text-red-500');
        icon.classList.add('far', 'fa-heart');
        button.classList.remove('liked');
    }
    
    if (countSpan) {
        countSpan.textContent = likesCount;
    }
    
    // Add animation
    button.classList.add('pulse');
    setTimeout(() => button.classList.remove('pulse'), 600);
}

function displayNewComment(comment) {
    const commentsContainer = document.getElementById('commentsContainer');
    if (commentsContainer) {
        const commentHTML = `
            <div class="comment-card fade-in">
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="author-avatar">
                            ${comment.isAnonymous ? '🎭' : '👤'}
                        </div>
                        <div class="author-info">
                            <h4>${comment.isAnonymous ? 'Anonymous' : comment.author}</h4>
                            <span class="comment-date">Just now</span>
                        </div>
                    </div>
                </div>
                <div class="comment-content">
                    <p>${comment.content}</p>
                </div>
            </div>
        `;
        
        commentsContainer.insertAdjacentHTML('afterbegin', commentHTML);
        
        // Update comments count
        const commentsCount = document.querySelector('.comments-count');
        if (commentsCount) {
            const currentCount = parseInt(commentsCount.textContent) || 0;
            commentsCount.textContent = currentCount + 1;
        }
    }
}

function clearCommentForm() {
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.reset();
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function animateElement(element, animation) {
    element.classList.add(`animate-${animation}`);
    element.style.opacity = '1';
    
    setTimeout(() => {
        element.classList.remove(`animate-${animation}`);
    }, 1000);
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const errorElement = field.nextElementSibling;
    
    // Clear previous error
    if (errorElement && errorElement.classList.contains('field-error')) {
        errorElement.remove();
    }
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (field.type === 'password' && value) {
        if (value.length < 6) {
            showFieldError(field, 'Password must be at least 6 characters');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error text-red-500 text-sm mt-1';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function showFormErrors(form) {
    const firstError = form.querySelector('.error');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm transform translate-x-full transition-transform duration-300`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <span class="text-lg">${icons[type]}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Allow manual close
    notification.addEventListener('click', () => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    });
}

function switchLanguage(language) {
    const form = document.getElementById('languageForm');
    if (form) {
        form.querySelector('input[name="language"]').value = language;
        form.submit();
    }
}

function performSearch() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.submit();
    }
}

function scrollToComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`) || 
                           document.getElementById('commentsSection');
    if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: 'smooth' });
        commentsSection.classList.add('highlight');
        setTimeout(() => commentsSection.classList.remove('highlight'), 2000);
    }
}

function sharePost(postId) {
    const postUrl = `${window.location.origin}/posts/${postId}`;
    
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: postUrl
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(postUrl).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        });
    }
}

function toggleNotifications() {
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationPanel) {
        notificationPanel.classList.toggle('hidden');
        
        if (!notificationPanel.classList.contains('hidden')) {
            loadNotifications();
        }
    }
}

async function loadNotifications() {
    try {
        const response = await fetch('/api/notifications');
        const notifications = await response.json();
        displayNotifications(notifications);
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Export functions for global access (if needed)
window.WebForum = {
    toggleLike,
    addComment,
    sharePost,
    showNotification,
    switchLanguage
};

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-fadeIn {
        animation: fadeIn 0.5s ease-in-out;
    }
    
    .animate-bounceIn {
        animation: bounceIn 0.6s ease-out;
    }
    
    .animate-slideIn {
        animation: slideIn 0.4s ease-out;
    }
    
    .pulse {
        animation: pulse 0.6s ease-in-out;
    }
    
    .highlight {
        animation: highlight 2s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes highlight {
        0% { background-color: transparent; }
        50% { background-color: #fef3c7; }
        100% { background-color: transparent; }
    }
    
    .notification-success { background: #10b981; }
    .notification-error { background: #ef4444; }
    .notification-warning { background: #f59e0b; }
    .notification-info { background: #3b82f6; }
    
    .field-error { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }
    .error { border-color: #ef4444 !important; }
    
    .mobile-menu.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .mobile-menu.active span:nth-child(2) { opacity: 0; }
    .mobile-menu.active span:nth-child(3) { transform: rotate(-45deg) translate(7px, -6px); }
`;
document.head.appendChild(style);