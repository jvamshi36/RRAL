// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle for mobile
    const navLinks = document.getElementById('navLinks');
    const openMenu = document.getElementById('openMenu');
    const closeMenu = document.getElementById('closeMenu');
    
    if (openMenu) {
        openMenu.addEventListener('click', function() {
            navLinks.classList.add('active');
        });
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    }
    
    // Close menu when clicking on a link (for mobile)
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
    
    // Sticky header on scroll
    const header = document.querySelector('header');
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) { // Changed from 100 to 50 for quicker response
            header.classList.add('scrolled');
            if (backToTop) {
                backToTop.classList.add('active');
            }
        } else {
            header.classList.remove('scrolled');
            if (backToTop) {
                backToTop.classList.remove('active');
            }
        }
        
        // Update active navigation link based on scroll position
        if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
            updateActiveNavLink();
        }
    });
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // Check if we're on the index page and using anchor links
            if (href.includes('#') && !href.includes('.html')) {
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            } else if (window.location.pathname.includes(href)) {
                link.classList.add('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Only prevent default if it's an anchor link on the same page
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .testimonial-card, .stat-item, .about-image, .about-text, .contact-form, .contact-info, .feature-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    const elementsToAnimate = document.querySelectorAll('.service-card, .testimonial-card, .stat-item, .about-image, .about-text, .contact-form, .contact-info, .feature-card');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run animation on initial load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Here you would typically send the form data to a server
            // For demonstration, we'll just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset the form
            this.reset();
        });
    }
    
    // Quick contact form in index page
    const quickContactForm = document.querySelector('.contact-form-brief form');
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    // Initialize the active nav link on page load
    // Set active nav link based on current page
    const currentPage = window.location.pathname;
    const navLinksAll = document.querySelectorAll('.nav-links a');
    
    navLinksAll.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPage.includes(href) && href !== 'index.html') {
            link.classList.add('active');
        } else if (currentPage.endsWith('/') || currentPage.endsWith('index.html')) {
            // If we're on the home page
            if (href === 'index.html' || href === './') {
                link.classList.add('active');
            }
        }
    });
    
    // If we're on the index page, also initialize the scroll-based active state
    if (currentPage === '/' || currentPage.includes('index.html')) {
        updateActiveNavLink();
    }

    // Image Carousel
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Check if carousel exists on the page
    if (slides.length === 0) return;
    
    // Preload images to ensure they're available
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            const newImg = new Image();
            newImg.src = img.src;
            newImg.onload = function() {
                // Image loaded successfully
                img.classList.add('loaded');
            };
            newImg.onerror = function() {
                console.error('Error loading image:', img.src);
            };
        }
    });

    // Function to show a specific slide
    function showSlide(index) {
        // Ensure index is within bounds
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }

    // Function to show the next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Function to show the previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Start automatic slideshow
    function startSlideshow() {
        stopSlideshow(); // Clear any existing interval first
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Stop slideshow
    function stopSlideshow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // Touch events for mobile swipe
    const carousel = document.querySelector('.image-carousel');
    if (carousel) {
        // Stop slideshow on hover (desktop)
        carousel.addEventListener('mouseenter', stopSlideshow);
        carousel.addEventListener('mouseleave', startSlideshow);
        
        // Touch events for mobile swipe
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopSlideshow();
        }, {passive: true});
        
        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startSlideshow();
        }, {passive: true});
        
        // Handle swipe direction
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance to be considered a swipe
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, show next slide
                nextSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, show previous slide
                prevSlide();
            }
        }
    }

    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopSlideshow();
            startSlideshow();
        });
    });

    // Force a layout recalculation to ensure carousel is visible
    setTimeout(() => {
        if (carousel) {
            carousel.style.opacity = 0.99;
            setTimeout(() => {
                carousel.style.opacity = 1;
            }, 50);
        }
    }, 100);

    // Start the slideshow if slides exist
    if (slides.length > 0) {
        // Show first slide immediately
        showSlide(0);
        // Start automatic rotation
        startSlideshow();
    }
}); 