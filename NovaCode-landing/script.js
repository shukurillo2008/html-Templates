// Initialize AOS animations
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    const navContent = nav.querySelector('div > div'); // The inner navbar content
    
    if (window.scrollY > 50) {
        navContent.classList.add('shadow-2xl');
        navContent.classList.add('bg-[#0E0E0E]/60');
        navContent.classList.remove('bg-[#0E0E0E]/40');
        navContent.style.backdropFilter = 'blur(16px)';
    } else {
        navContent.classList.remove('shadow-2xl');
        navContent.classList.remove('bg-[#0E0E0E]/60');
        navContent.classList.add('bg-[#0E0E0E]/40');
        navContent.style.backdropFilter = 'blur(12px)';
    }
});

// Counter animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // Adjust speed here
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 20);
}

// Initialize counters when they come into view
const counterElements = document.querySelectorAll('.counter');
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

counterElements.forEach(counter => {
    observer.observe(counter);
});

// Scrollspy Implementation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

function updateActiveLink() {
    const scrollPosition = window.scrollY + 100; // Offset for better trigger point

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('text-[#DCF230]');
                link.classList.add('text-white');
            });
            
            // Add active class to current section link
            const correspondingLink = document.querySelector(`nav a[href="#${sectionId}"]`);
            if (correspondingLink) {
                correspondingLink.classList.remove('text-white');
                correspondingLink.classList.add('text-[#DCF230]');
            }
        }
    });
}

// Update active link on scroll
window.addEventListener('scroll', updateActiveLink);
// Update active link on page load
document.addEventListener('DOMContentLoaded', updateActiveLink);

// Custom Scrollbar Implementation
class CustomScrollbar {
    constructor() {
        this.scrollbar = document.querySelector('.custom-scrollbar');
        this.scrollbarContainer = document.querySelector('.custom-scrollbar-container');
        this.isScrolling = false;
        this.scrollStartY = 0;
        this.initialScrollTop = 0;
        
        this.init();
    }

    init() {
        // Initial setup
        this.updateScrollbarSize();
        this.updateScrollbarPosition();

        // Event listeners
        window.addEventListener('scroll', () => this.updateScrollbarPosition());
        window.addEventListener('resize', () => {
            this.updateScrollbarSize();
            this.updateScrollbarPosition();
        });

        // Drag functionality
        this.scrollbar.addEventListener('mousedown', (e) => this.startDragging(e));
        window.addEventListener('mousemove', (e) => this.drag(e));
        window.addEventListener('mouseup', () => this.stopDragging());

        // Touch functionality for mobile
        this.scrollbar.addEventListener('touchstart', (e) => this.startDragging(e));
        window.addEventListener('touchmove', (e) => this.drag(e));
        window.addEventListener('touchend', () => this.stopDragging());
    }

    updateScrollbarSize() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollbarHeight = (windowHeight / documentHeight) * windowHeight;
        this.scrollbar.style.height = `${scrollbarHeight}px`;
    }

    updateScrollbarPosition() {
        if (!this.isScrolling) {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrolled = window.scrollY;
            const maxScroll = documentHeight - windowHeight;
            const scrollPercentage = scrolled / maxScroll;
            const maxScrollbarTranslate = windowHeight - this.scrollbar.offsetHeight;
            const scrollbarTranslate = scrollPercentage * maxScrollbarTranslate;

            this.scrollbar.style.transform = `translateY(${scrollbarTranslate}px)`;
        }
    }

    startDragging(e) {
        this.isScrolling = true;
        this.scrollStartY = e.type === 'mousedown' ? e.pageY : e.touches[0].pageY;
        this.initialScrollTop = window.scrollY;
        this.scrollbar.classList.add('active');
    }

    drag(e) {
        if (!this.isScrolling) return;

        e.preventDefault();
        const y = e.type === 'mousemove' ? e.pageY : e.touches[0].pageY;
        const walk = (y - this.scrollStartY) * 2; // Scroll multiplier
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const maxScroll = documentHeight - windowHeight;
        const scrollPercentage = walk / windowHeight;
        const scrollAmount = scrollPercentage * maxScroll;

        window.scrollTo({
            top: this.initialScrollTop + scrollAmount,
            behavior: 'auto'
        });
    }

    stopDragging() {
        this.isScrolling = false;
        this.scrollbar.classList.remove('active');
    }
}

// Initialize custom scrollbar
document.addEventListener('DOMContentLoaded', () => {
    new CustomScrollbar();
});
