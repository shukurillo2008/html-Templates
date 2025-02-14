document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinksDesktop = document.querySelectorAll('.desktop-tracker a');
  const navLinksMobile = document.querySelectorAll('.mobile-tracker-links a');
  const mobileTrackerToggle = document.getElementById('mobile-tracker-toggle');
  const mobileTrackerLinks = document.getElementById('mobile-tracker-links');
  const desktopTracker = document.querySelector('.desktop-tracker');

  // Apply fade-in after a slight delay for desktop tracker
  if (desktopTracker) {
    setTimeout(() => {
      desktopTracker.style.opacity = 1;
    }, 100);
  }

  const highlightActiveSection = () => {
    // Get current scroll position
    const scrollY = window.scrollY;
    
    // Find the current section
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100; // Offset for better trigger point
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinksDesktop.forEach(link => link.classList.remove('active'));
        navLinksMobile.forEach(link => link.classList.remove('active'));
        
        // Add active class to corresponding links
        document.querySelector(`.desktop-tracker a[href*=${sectionId}]`)?.classList.add('active');
        document.querySelector(`.mobile-tracker-links a[href*=${sectionId}]`)?.classList.add('active');
      }
    });
  };

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.mobile-tracker')) {
      mobileTrackerLinks.classList.remove('open');
    }
  });

  // Close mobile menu when clicking a link
  navLinksMobile.forEach(link => {
    link.addEventListener('click', () => {
      mobileTrackerLinks.classList.remove('open');
    });
  });

  // Smooth scroll for navigation links
  const smoothScroll = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    const offset = 80; // Adjust offset as needed
    
    window.scrollTo({
      top: targetSection.offsetTop - offset,
      behavior: 'smooth'
    });
  };

  // Add smooth scroll to all navigation links
  navLinksDesktop.forEach(link => link.addEventListener('click', smoothScroll));
  navLinksMobile.forEach(link => link.addEventListener('click', smoothScroll));

  window.addEventListener('scroll', highlightActiveSection);
  highlightActiveSection(); // Run on initial load

  // Mobile Tracker Toggle Logic
  mobileTrackerToggle.addEventListener('click', () => {
    mobileTrackerLinks.classList.toggle('open');
  });

  // Form handling
  const contactForm = document.getElementById('contact-form');
  const messageInput = document.getElementById('message');
  const charCount = document.getElementById('char-count');
  const emailInput = document.getElementById('email');

  // Character count for message
  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      const remaining = messageInput.value.length;
      charCount.textContent = `${remaining}/500`;
      
      // Visual feedback when approaching limit
      if (remaining >= 450) {
        charCount.classList.add('text-yellow-500');
      } else {
        charCount.classList.remove('text-yellow-500');
      }
    });
  }

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
  };

  // Form submission handler
  window.handleSubmit = (event) => {
    event.preventDefault();
    
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    // Validate inputs
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (message.length < 10) {
      alert('Message must be at least 10 characters long');
      return;
    }
    
    if (message.length > 500) {
      alert('Message is too long. Please keep it under 500 characters');
      return;
    }
    
    // Disable form while submitting
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    
    // Here you would typically send the data to your server
    // For demonstration, we'll just show a success message
    setTimeout(() => {
      alert('Message sent successfully!');
      contactForm.reset();
      submitButton.disabled = false;
      charCount.textContent = '0/500';
    }, 1000);
  };

  // Add this to your existing DOMContentLoaded event listener
  const createCursorGlow = () => {
    // Create cursor glow element
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let cursorX = 0;
    let cursorY = 0;
    let currentX = 0;
    let currentY = 0;

    // Smooth animation settings
    const ease = 0.15;
    let isMoving = false;
    let animationFrame;
    let timeout;

    const animate = () => {
      const dx = cursorX - currentX;
      const dy = cursorY - currentY;

      currentX += dx * ease;
      currentY += dy * ease;

      cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px)`;

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        isMoving = false;
      }
    };

    document.addEventListener('mousemove', (e) => {
      cursorGlow.classList.add('active');
      
      cursorX = e.clientX;
      cursorY = e.clientY;

      if (!isMoving) {
        isMoving = true;
        animationFrame = requestAnimationFrame(animate);
      }

      // Reset timeout
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cursorGlow.classList.remove('active');
      }, 1000);
    });

    // Hide cursor glow when mouse leaves the window
    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });

    // Show cursor glow when mouse enters the window
    document.addEventListener('mouseenter', () => {
      cursorGlow.classList.add('active');
    });

    // Optional: Add special effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursorGlow.style.background = `radial-gradient(
          circle at center,
          rgba(50, 213, 131, 0.25),
          rgba(50, 213, 131, 0.15) 25%,
          transparent 65%
        )`;
        cursorGlow.style.width = '250px';
        cursorGlow.style.height = '250px';
      });

      element.addEventListener('mouseleave', () => {
        cursorGlow.style.background = `radial-gradient(
          circle at center,
          rgba(50, 213, 131, 0.15),
          rgba(50, 213, 131, 0.1) 25%,
          transparent 65%
        )`;
        cursorGlow.style.width = '350px';
        cursorGlow.style.height = '350px';
      });
    });
  };

  createCursorGlow();
}); 