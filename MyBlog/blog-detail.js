// Social Share Functionality
function initializeSocialSharing() {
    const shareButtons = document.querySelectorAll('.social-share-btn');
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.dataset.platform;
            let shareUrl;
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
                    break;
                case 'copy':
                    navigator.clipboard.writeText(window.location.href)
                        .then(() => {
                            // Show success message
                            const originalHtml = button.innerHTML;
                            button.innerHTML = '<i class="fas fa-check"></i>';
                            setTimeout(() => {
                                button.innerHTML = originalHtml;
                            }, 2000);
                        });
                    return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Lightbox Functionality
function initializeLightbox() {
    const lightboxImages = document.querySelectorAll('.lightbox-image img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('button');
    
    lightboxImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.remove('hidden');
            lightbox.classList.add('flex');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    [closeBtn, lightbox].forEach(element => {
        element.addEventListener('click', (e) => {
            if (e.target === element) {
                lightbox.classList.add('hidden');
                lightbox.classList.remove('flex');
                document.body.style.overflow = '';
            }
        });
    });
}

// Clap/Like Feature
function initializeClaps() {
    const clapButton = document.querySelector('.clap-button');
    const clapCount = clapButton.querySelector('.clap-count');
    let claps = parseInt(localStorage.getItem('articleClaps') || '0');
    
    // Update initial count
    clapCount.textContent = claps;
    
    clapButton.addEventListener('click', () => {
        claps++;
        clapCount.textContent = claps;
        localStorage.setItem('articleClaps', claps);
        
        // Add animation
        const ripple = document.createElement('span');
        ripple.classList.add('clap-ripple');
        clapButton.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
    });
}

// Comments System
function initializeComments() {
    const commentForm = document.querySelector('.comment-form');
    const commentsList = document.querySelector('.comments-list');
    
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const textarea = commentForm.querySelector('textarea');
        const comment = textarea.value.trim();
        
        if (comment) {
            // Add new comment
            const newComment = document.createElement('div');
            newComment.className = 'comment bg-gray-50 p-6 rounded-xl opacity-0 transform translate-y-4';
            newComment.innerHTML = `
                <div class="flex items-center gap-4 mb-4">
                    <img src="https://source.unsplash.com/random/100x100/?portrait" 
                         alt="Commenter" 
                         class="w-10 h-10 rounded-full object-cover">
                    <div>
                        <h4 class="font-bold">Guest User</h4>
                        <p class="text-sm text-gray-500">Just now</p>
                    </div>
                </div>
                <p class="text-gray-600">${comment}</p>
            `;
            
            commentsList.insertBefore(newComment, commentsList.firstChild);
            
            // Animate the new comment
            requestAnimationFrame(() => {
                newComment.classList.add('opacity-100', 'translate-y-0', 'transition-all', 'duration-500');
            });
            
            // Clear form
            textarea.value = '';
        }
    });
}

// Copy Code Functionality
function initializeCodeCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const codeBlock = button.nextElementSibling.textContent;
            navigator.clipboard.writeText(codeBlock).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('bg-green-500', 'text-white');
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('bg-green-500', 'text-white');
                }, 2000);
            });
        });
    });
}

// Dark Mode Toggle
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Create overlay for transition effect
    const overlay = document.createElement('div');
    overlay.className = 'mode-transition-overlay';
    document.body.appendChild(overlay);
    
    // Set initial state
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
    
    function updateOverlayPosition(e) {
        overlay.style.setProperty('--x', `${e.clientX}px`);
        overlay.style.setProperty('--y', `${e.clientY}px`);
    }
    
    darkModeToggle.addEventListener('click', (e) => {
        // Update overlay position
        updateOverlayPosition(e);
        
        // Add transition class to body
        document.body.classList.add('dark-mode-transition');
        
        // Show overlay
        overlay.style.opacity = '1';
        
        // Toggle dark mode with delay
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        
        const icon = darkModeToggle.querySelector('i');
        icon.style.transform = 'rotate(360deg)';
        icon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
        
        // Hide overlay and reset after animation
        setTimeout(() => {
            overlay.style.opacity = '0';
            icon.style.transform = '';
            document.body.classList.remove('dark-mode-transition');
        }, 500);
    });

    // Track mouse movement for overlay position
    darkModeToggle.addEventListener('mousemove', updateOverlayPosition);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSocialSharing();
    initializeLightbox();
    initializeClaps();
    initializeComments();
    initializeCodeCopy();
    initializeDarkMode();
}); 