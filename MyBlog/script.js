// DOM Elements
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearch = document.getElementById('closeSearch');
const searchInput = document.getElementById('searchInput');

// Update the mobile menu toggle
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('hamburger-active');
    
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        // Trigger reflow
        mobileMenu.offsetHeight;
        mobileMenu.classList.add('active');
    } else {
        mobileMenu.classList.remove('active');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 500); // Match the CSS transition duration
    }
});

// Update the search functionality
searchBtn.addEventListener('click', () => {
    searchOverlay.classList.remove('hidden');
    // Force browser reflow
    searchOverlay.offsetHeight;
    requestAnimationFrame(() => {
        searchOverlay.classList.add('active');
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    });
});

// Update close search functionality
function closeSearchOverlay() {
    const searchResults = document.querySelector('#searchResults');
    if (searchResults) {
        searchResults.classList.remove('active');
    }
    searchOverlay.classList.remove('active');
    setTimeout(() => {
        searchOverlay.classList.add('hidden');
        searchInput.value = '';
        if (searchResults) {
            searchResults.style.display = 'none';
            searchResults.innerHTML = '';
        }
    }, 500);
}

closeSearch.addEventListener('click', closeSearchOverlay);

// Update the escape key handler
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !searchOverlay.classList.contains('hidden')) {
        closeSearchOverlay();
    }
});

// Update the overlay click handler
searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
        closeSearchOverlay();
    }
});

// Search functionality
function searchPosts(searchTerm) {
    return blogPosts.filter(post => {
        const searchFields = [
            post.title.toLowerCase(),
            post.excerpt.toLowerCase(),
            post.category.toLowerCase(),
            post.author.name.toLowerCase()
        ];
        return searchFields.some(field => field.includes(searchTerm.toLowerCase()));
    });
}

// Update the search input event listener with debouncing and smooth animations
let searchTimeout;
let loadingIndicator;

function createLoadingIndicator() {
    loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'search-loading';
    return loadingIndicator;
}

function animateSearchResults(container, results) {
    container.style.display = 'block';
    // Force reflow
    container.offsetHeight;
    container.classList.add('active');

    // Animate each result item with delay
    const items = container.querySelectorAll('.search-result-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('show');
        }, index * 50); // Stagger the animations
    });
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let searchResultsContainer = document.querySelector('#searchResults');

    // Clear previous timeout
    clearTimeout(searchTimeout);

    // Create or get search results container
    if (!searchResultsContainer) {
        searchResultsContainer = document.createElement('div');
        searchResultsContainer.id = 'searchResults';
        searchResultsContainer.className = 'mt-4 max-h-[60vh] overflow-y-auto';
        searchInput.parentElement.appendChild(searchResultsContainer);
    }

    if (searchTerm.length > 0) {
        // Show loading indicator
        searchResultsContainer.innerHTML = '';
        searchResultsContainer.appendChild(createLoadingIndicator());
        searchResultsContainer.style.display = 'block';

        // Debounce the search
        searchTimeout = setTimeout(() => {
            const searchResults = searchPosts(searchTerm);
            
            // Create search results HTML with animation classes
            const resultsHTML = searchResults.length > 0 
                ? searchResults.map(post => `
                    <div class="search-result-item flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg">
                        <img src="${post.image}" alt="${post.title}" class="w-16 h-16 object-cover rounded-lg">
                        <div>
                            <h4 class="font-bold">${post.title}</h4>
                            <p class="text-sm text-gray-500">${post.category} • ${post.readTime}</p>
                        </div>
                    </div>
                `).join('')
                : '<div class="search-result-item p-4 text-gray-500">No results found</div>';

            // Update results with animation
            searchResultsContainer.innerHTML = resultsHTML;
            animateSearchResults(searchResultsContainer, searchResults);

            // Add click handlers to search results
            const resultItems = searchResultsContainer.querySelectorAll('.search-result-item');
            resultItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    if (searchResults[index]) {
                        const post = searchResults[index];
                        // Animate the closing of search
                        searchResultsContainer.classList.remove('active');
                        setTimeout(() => {
                            closeSearchOverlay();
                            // Find and highlight the post
                            const postElements = document.querySelectorAll('.grid article');
                            postElements.forEach(element => {
                                if (element.querySelector('h3').textContent === post.title) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    element.classList.add('found-post');
                                    setTimeout(() => element.classList.remove('found-post'), 2000);
                                }
                            });
                        }, 300);
                    }
                });
            });
        }, 300); // Debounce delay
    } else {
        // Clear results with animation
        searchResultsContainer.classList.remove('active');
        setTimeout(() => {
            searchResultsContainer.style.display = 'none';
            searchResultsContainer.innerHTML = '';
        }, 300);
    }
});

// Sample blog post data
const blogPosts = [
    {
        image: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'Design',
        readTime: '5 min read',
        title: 'The Art of Minimalism',
        excerpt: 'Exploring how minimalism can enhance user experience and visual appeal.',
        author: {
            name: 'Jane Smith',
            avatar: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: 'Aug 20, 2023'
        },
        popularity: 156,
        trending: true
    },
    {
        image: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'Technology',
        readTime: '8 min read',
        title: 'The Future of Web Development',
        excerpt: 'Exploring upcoming trends and technologies that will shape the future of web development.',
        author: {
            name: 'John Doe',
            avatar: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: 'Aug 22, 2023'
        },
        popularity: 230,
        trending: true
    },
    {
        image: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'Design',
        readTime: '4 min read',
        title: 'Minimalism in Modern Architecture',
        excerpt: 'How minimalist principles in architecture influence digital design trends.',
        author: {
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: 'Aug 19, 2023'
        },
        popularity: 98,
        trending: false
    },
    {
        image: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'Development',
        readTime: '6 min read',
        title: 'Clean Code Principles',
        excerpt: 'Best practices for writing maintainable and scalable code in modern web development.',
        author: {
            name: 'Mike Wilson',
            avatar: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: 'Aug 21, 2023'
        },
        popularity: 182,
        trending: true
    },
    {
        image: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'UI/UX',
        readTime: '7 min read',
        title: 'Designing for Accessibility',
        excerpt: 'Creating inclusive web experiences through thoughtful UI/UX design practices.',
        author: {
            name: 'Emily Chen',
            avatar: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: 'Aug 23, 2023'
        },
        popularity: 145,
        trending: false
    },
    {
        image: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'Design',
        readTime: '6 min read',
        title: 'The Power of White Space',
        excerpt: 'How strategic use of white space can dramatically improve your design\'s impact and user experience.',
        author: {
            name: 'Alex Turner',
            avatar: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: 'Aug 24, 2023'
        },
        popularity: 245,
        trending: true
    },
    {
        image: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'Development',
        readTime: '7 min read',
        title: 'Modern JavaScript Patterns',
        excerpt: 'Essential design patterns and best practices for modern JavaScript development.',
        author: {
            name: 'Rachel Chen',
            avatar: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: 'Aug 25, 2023'
        },
        popularity: 198,
        trending: true
    },
    {
        image: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'UI/UX',
        readTime: '5 min read',
        title: 'Psychology in Design',
        excerpt: 'Understanding human psychology to create more effective and engaging user interfaces.',
        author: {
            name: 'David Kim',
            avatar: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: 'Aug 26, 2023'
        },
        popularity: 210,
        trending: true
    },
    {
        image: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'Technology',
        readTime: '8 min read',
        title: 'AI in Web Development',
        excerpt: 'How artificial intelligence is revolutionizing the way we build and design websites.',
        author: {
            name: 'Sarah Parker',
            avatar: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: 'Aug 27, 2023'
        },
        popularity: 275,
        trending: true
    },
    {
        image: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'Design',
        readTime: '6 min read',
        title: 'Future of Web Animation',
        excerpt: 'Exploring cutting-edge animation techniques and their impact on user engagement.',
        author: {
            name: 'Mark Wilson',
            avatar: 'https://images.unsplash.com/photo-1422207258071-70754198c4a2?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: 'Aug 28, 2023'
        },
        popularity: 188,
        trending: true
    }
];

// Function to create a blog post card
function createPostCard(post) {
    return `
        <article class="group">
            <div class="overflow-hidden rounded-xl mb-4">
                <img src="${post.image}" alt="${post.title}" 
                     class="w-full h-64 object-cover transition-transform group-hover:scale-105 duration-500">
            </div>
            <span class="text-sm text-gray-500">${post.category} • ${post.readTime}</span>
            <h3 class="text-xl font-bold mt-2 mb-2 group-hover:text-gray-600 transition-colors">${post.title}</h3>
            <p class="text-gray-600 mb-4">${post.excerpt}</p>
            <div class="flex items-center gap-3">
                <img src="${post.author.avatar}" alt="${post.author.name}" 
                     class="w-8 h-8 rounded-full object-cover">
                <span class="text-sm text-gray-500">By ${post.author.name} • ${post.author.date}</span>
            </div>
        </article>
    `;
}

// Function to render blog posts
function renderBlogPosts() {
    const postsGrid = document.querySelector('.grid');
    if (postsGrid) {
        postsGrid.innerHTML = blogPosts.map(post => createPostCard(post)).join('');
    }
}

// Call render function when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // First render the posts
    renderBlogPosts();
    
    // Initialize slider
    initializeSlider();
    
    // Then create and initialize the filter menu
    createFilterMenu();
    
    // Initialize other enhancements
    enhancePagination();
    updatePostClickHandlers();
    
    // Add smooth scroll to navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.getAttribute('href');
            smoothScroll(target);
        });
    });
    
    initializeNewsletterForm();
    initializeBackToTop();
    initializeDarkMode();
});

// Ripple effect function
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    
    ripple.classList.add('ripple-effect');
    
    const existingRipple = button.querySelector('.ripple-effect');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple effect to all buttons
document.querySelectorAll('button').forEach(button => {
    button.classList.add('ripple');
    button.addEventListener('click', createRipple);
});

// Enhance pagination
function enhancePagination() {
    const paginationButtons = document.querySelectorAll('.flex.justify-center button');
    paginationButtons.forEach(button => {
        button.classList.add('pagination-btn');
    });
}

// Add smooth scroll behavior
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Update the click handlers for blog posts
function updatePostClickHandlers() {
    document.querySelectorAll('.grid article').forEach(article => {
        article.addEventListener('click', (e) => {
            // Add click animation
            article.style.transform = 'scale(0.98)';
            setTimeout(() => {
                article.style.transform = 'scale(1)';
            }, 200);
            
            // You can add navigation here if needed
        });
    });
}

// Update the render posts function to reattach click handlers
const originalRenderBlogPosts = renderBlogPosts;
renderBlogPosts = function() {
    originalRenderBlogPosts();
    updatePostClickHandlers();
};

// Update filterAndRenderPosts to include animations
const originalFilterAndRenderPosts = filterAndRenderPosts;
filterAndRenderPosts = function() {
    const postsGrid = document.querySelector('.grid');
    if (postsGrid) {
        postsGrid.style.opacity = '0';
        postsGrid.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            originalFilterAndRenderPosts();
            postsGrid.style.opacity = '1';
            postsGrid.style.transform = 'translateY(0)';
            updatePostClickHandlers();
        }, 300);
    }
};

// Featured posts for slider
const featuredPosts = blogPosts.filter(post => post.trending);

// Slider functionality
function initializeSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let isAnimating = false;

    // Clear existing content
    if (sliderContainer) {
        sliderContainer.innerHTML = '';
        dotsContainer.innerHTML = '';
    
        // Create slides
        featuredPosts.forEach((post, index) => {
            const slide = document.createElement('div');
            slide.className = `slider-slide ${index === 0 ? 'active' : ''}`;
            slide.style.position = 'absolute';
            slide.style.inset = '0';
            slide.innerHTML = `
                <div class="relative w-full h-full">
                    <img src="${post.image}" alt="${post.title}" 
                         class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                        <div class="slide-content absolute bottom-0 p-8 text-white max-w-4xl">
                            <span class="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm mb-4 inline-block">
                                ${post.category}
                            </span>
                            <h1 class="text-4xl font-bold mb-4">${post.title}</h1>
                            <p class="text-lg mb-4 text-gray-200">${post.excerpt}</p>
                            <div class="flex items-center gap-4">
                                <img src="${post.author.avatar}" alt="${post.author.name}" 
                                     class="w-10 h-10 rounded-full object-cover">
                                <div>
                                    <p class="font-medium">${post.author.name}</p>
                                    <p class="text-sm text-gray-300">Posted on ${post.author.date}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            sliderContainer.appendChild(slide);
            
            // Create dot
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.className = index === 0 ? 'active' : '';
            dot.addEventListener('click', () => !isAnimating && goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) {
            if (currentSlide === index || isAnimating) return;
            isAnimating = true;
            
            const slides = document.querySelectorAll('.slider-slide');
            const dots = document.querySelectorAll('.slider-dots button');
            
            // Fade out current slide
            slides[currentSlide].style.opacity = '0';
            dots[currentSlide].classList.remove('active');
            
            // Update current slide index
            currentSlide = index;
            
            // Fade in new slide
            setTimeout(() => {
                slides.forEach((slide, i) => {
                    if (i === currentSlide) {
                        slide.classList.add('active');
                        slide.style.opacity = '1';
                    } else {
                        slide.classList.remove('active');
                    }
                });
                dots[currentSlide].classList.add('active');
                isAnimating = false;
            }, 300);
        }

        function nextSlide() {
            if (!isAnimating) {
                goToSlide((currentSlide + 1) % featuredPosts.length);
            }
        }

        function prevSlide() {
            if (!isAnimating) {
                goToSlide((currentSlide - 1 + featuredPosts.length) % featuredPosts.length);
            }
        }

        // Navigation buttons
        const prevButton = document.querySelector('.slider-nav.prev');
        const nextButton = document.querySelector('.slider-nav.next');
        
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', (e) => {
                e.stopPropagation();
                prevSlide();
            });
            
            nextButton.addEventListener('click', (e) => {
                e.stopPropagation();
                nextSlide();
            });
        }

        // Auto-advance
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        const slider = document.querySelector('.featured-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
            slider.addEventListener('mouseleave', () => {
                if (slideInterval) clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!isAnimating) {
                if (e.key === 'ArrowLeft') prevSlide();
                if (e.key === 'ArrowRight') nextSlide();
            }
        });

        // Initial state
        const firstSlide = document.querySelector('.slider-slide');
        if (firstSlide) {
            firstSlide.classList.add('active');
            firstSlide.style.opacity = '1';
        }
    }
}

// Newsletter form handling
function initializeNewsletterForm() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            // Add loading state
            const button = form.querySelector('button');
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Success state
                button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                button.classList.add('bg-green-500', 'text-white');
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('bg-green-500', 'text-white');
                    button.disabled = false;
                    form.reset();
                }, 2000);
            }, 1500);
        });
    }
}

// Back to Top functionality
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
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

// Add sorting and filtering functionality
const filterButton = document.querySelector('button:has(.fa-filter)');
const sortSelect = document.querySelector('select');

// Filter functionality
let activeFilters = new Set();

function createFilterMenu() {
    const filterButton = document.querySelector('button:has(.fa-filter)');
    if (!filterButton) return;

    // Create filter menu container
    const filterMenu = document.createElement('div');
    filterMenu.className = 'absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-4 hidden z-50';
    filterMenu.id = 'filterMenu';
    
    // Get unique categories
    const uniqueCategories = [...new Set(blogPosts.map(post => post.category))];
    
    // Create filter items
    uniqueCategories.forEach(category => {
        const label = document.createElement('label');
        label.className = 'filter-item flex items-center space-x-2 mb-2 cursor-pointer';
        label.innerHTML = `
            <input type="checkbox" class="form-checkbox" value="${category}">
            <span class="ml-2">${category}</span>
        `;
        filterMenu.appendChild(label);

        // Add change event listener to checkbox
        const checkbox = label.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            if (e.target.checked) {
                activeFilters.add(category);
            } else {
                activeFilters.delete(category);
            }
            filterAndRenderPosts();
        });
    });
    
    // Add menu to DOM
    const filterContainer = filterButton.parentElement;
    filterContainer.style.position = 'relative';
    filterContainer.appendChild(filterMenu);

    // Toggle menu on button click
    filterButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = filterMenu.classList.contains('hidden');
        
        if (isHidden) {
            // Show menu
            filterMenu.classList.remove('hidden');
            requestAnimationFrame(() => {
                filterMenu.style.opacity = '1';
                filterMenu.style.transform = 'scale(1)';
            });
        } else {
            // Hide menu
            filterMenu.style.opacity = '0';
            filterMenu.style.transform = 'scale(0.95)';
            setTimeout(() => {
                filterMenu.classList.add('hidden');
            }, 200);
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!filterButton.contains(e.target) && !filterMenu.contains(e.target)) {
            filterMenu.style.opacity = '0';
            filterMenu.style.transform = 'scale(0.95)';
            setTimeout(() => {
                filterMenu.classList.add('hidden');
            }, 200);
        }
    });
}

// Sorting functionality
function sortPosts(posts, criterion) {
    const sortedPosts = [...posts];
    switch (criterion) {
        case 'Latest':
            return sortedPosts.sort((a, b) => new Date(b.author.date) - new Date(a.author.date));
        case 'Popular':
            return sortedPosts.sort((a, b) => b.popularity - a.popularity);
        case 'Trending':
            return sortedPosts.filter(post => post.trending);
        default:
            return sortedPosts;
    }
}

// Update filter and render function
function filterAndRenderPosts() {
    let filteredPosts = [...blogPosts];
    
    // Apply category filters
    if (activeFilters.size > 0) {
        filteredPosts = filteredPosts.filter(post => activeFilters.has(post.category));
    }
    
    // Apply sorting
    const sortCriterion = document.querySelector('select').value;
    filteredPosts = sortPosts(filteredPosts, sortCriterion);
    
    // Render with animation
    const postsGrid = document.querySelector('.grid');
    if (postsGrid) {
        // Fade out
        postsGrid.style.opacity = '0';
        postsGrid.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            // Update content
            postsGrid.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
            
            // Fade in
            requestAnimationFrame(() => {
                postsGrid.style.opacity = '1';
                postsGrid.style.transform = 'translateY(0)';
            });
            
            // Reattach click handlers
            updatePostClickHandlers();
        }, 300);
    }
}

// Event listeners for sorting
sortSelect.addEventListener('change', filterAndRenderPosts);
