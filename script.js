// ============================================
// Lenis Smooth Scroll Initialization
// ============================================
let lenis;

function initLenis() {
  if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Animation frame loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update();
      handleNavbarScroll(); // Update navbar on scroll
    });

    // Update ScrollTrigger on Lenis scroll
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      }
    });

    // Refresh ScrollTrigger after Lenis is ready
    ScrollTrigger.addEventListener('refresh', () => {
      if (lenis) {
        lenis.resize();
      }
    });

    ScrollTrigger.refresh();
  }
}

// ============================================
// Navbar scroll behavior
// ============================================
let lastScrollTop = 0;
const navbar = document.getElementById('main-navbar');
const defaultLogo = document.getElementById('default-logo');
const scrollLogo = document.getElementById('scroll-logo');

// Navbar scroll handler - works with both native scroll and Lenis
function handleNavbarScroll() {
  const scrollTop = lenis ? lenis.scroll : (window.pageYOffset || document.documentElement.scrollTop);
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelectorAll('#main-navbar ul li a, #main-navbar ul li button');
  
  if (scrollTop > 50) {
    // User has scrolled down - make navbar fixed at top with black background
    navbar.classList.remove('absolute', 'top-0', 'md:top-0');
    navbar.classList.add('fixed', 'top-0', 'bg-black');
    
    // Animate background color with GSAP
    if (typeof gsap !== 'undefined') {
      gsap.to(navbar, {
        backgroundColor: '#000000',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    // Show scroll logo, hide default logo instantly
    defaultLogo.classList.add('hidden');
    scrollLogo.classList.remove('hidden');
    
    // Change text color to white with GSAP
    navLinks.forEach(link => {
      if (typeof gsap !== 'undefined') {
        gsap.to(link, {
          color: '#ffffff',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        link.style.color = '#ffffff';
      }
    });
    
    // Ensure menu button text is white when navbar has black background
    if (mobileMenuBtn) {
      if (typeof gsap !== 'undefined') {
        gsap.to(mobileMenuBtn, {
          color: '#ffffff',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        mobileMenuBtn.classList.add('text-white');
        mobileMenuBtn.classList.remove('text-black');
      }
    }
    
    lastScrollTop = scrollTop;
  } else {
    // User is at the top - restore original position and remove background
    navbar.classList.remove('fixed', 'top-0', 'bg-black');
    navbar.classList.add('absolute', 'top-0', 'md:top-0');
    
    // Animate background to transparent with GSAP
    if (typeof gsap !== 'undefined') {
      gsap.to(navbar, {
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    // Show default logo, hide scroll logo instantly
    scrollLogo.classList.add('hidden');
    defaultLogo.classList.remove('hidden');
    
    // Change text color back to white (for transparent background over hero)
    navLinks.forEach(link => {
      if (typeof gsap !== 'undefined') {
        gsap.to(link, {
          color: '#ffffff',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        link.style.color = '#ffffff';
      }
    });
    
    // Menu button text should be white when at top (over hero section)
    if (mobileMenuBtn) {
      if (typeof gsap !== 'undefined') {
        gsap.to(mobileMenuBtn, {
          color: '#ffffff',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        mobileMenuBtn.classList.add('text-white');
        mobileMenuBtn.classList.remove('text-black');
      }
    }
    
    lastScrollTop = scrollTop;
  }
}

// Use Lenis scroll event if available, otherwise use window scroll
if (typeof Lenis !== 'undefined') {
  // Will be set up after Lenis is initialized
} else {
  window.addEventListener('scroll', handleNavbarScroll);
}

// Initialize on page load
window.addEventListener('load', function() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop <= 50) {
    defaultLogo.classList.remove('hidden');
    scrollLogo.classList.add('hidden');
  }
});

// ============================================
// Smooth Scroll to Sections with Offset
// ============================================
function smoothScrollToSection(targetId) {
  const targetElement = document.querySelector(targetId);
  if (!targetElement) return;

  // Calculate offset: 15% of viewport height
  const offset = window.innerHeight * 0.15;
  
  // Get target position
  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

  // Use Lenis if available, otherwise use native smooth scroll
  if (lenis) {
    lenis.scrollTo(targetPosition, {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Handle anchor link clicks for smooth scrolling
function initSmoothScrollLinks() {
  // Get all anchor links in navigation (desktop and mobile)
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#" or empty
      if (!href || href === '#') return;
      
      // Prevent default anchor behavior
      e.preventDefault();
      
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) {
        const isMenuOpen = !mobileMenu.classList.contains('hidden');
        if (isMenuOpen && typeof closeMobileMenu === 'function') {
          closeMobileMenu();
        }
      }
      
      // Smooth scroll to target section
      smoothScrollToSection(href);
    });
  });
}

// Initialize smooth scroll links when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmoothScrollLinks);
} else {
  initSmoothScrollLinks();
}

// ============================================
// Mobile Menu Toggle with GSAP
// ============================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');
const menuItems = document.querySelectorAll('.mobile-menu-item');
let isMenuOpen = false;

// Set initial state for mobile menu
if (typeof gsap !== 'undefined' && mobileMenu) {
  gsap.set(mobileMenu, { y: '-100%', display: 'none' });
  gsap.set(menuItems, { opacity: 0, y: 20 });
}

// Toggle mobile menu
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', function() {
    if (!isMenuOpen) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
  });
}

function openMobileMenu() {
  if (isMenuOpen) return;
  
  isMenuOpen = true;
  mobileMenu.classList.remove('hidden');
  menuIcon.classList.add('hidden');
  closeIcon.classList.remove('hidden');
  
  // Force close icon to be visible
  if (closeIcon) {
    closeIcon.style.display = 'block';
  }
  if (menuIcon) {
    menuIcon.style.display = 'none';
  }
  
  // Change button color to black for white menu background
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.remove('text-white');
    mobileMenuBtn.classList.add('text-black', 'fixed', 'top-6', 'right-6', 'z-[10000]');
  }
  
  document.body.style.overflow = 'hidden'; // Prevent body scroll
  
  // Animate menu from top to bottom with GSAP
  if (typeof gsap !== 'undefined' && mobileMenu) {
    gsap.to(mobileMenu, {
      y: '0%',
      duration: 0.6,
      ease: 'power3.out',
      display: 'block'
    });
    
    // Animate menu items with stagger
    gsap.to(menuItems, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.2,
      ease: 'power2.out'
    });
  } else {
    // Fallback if GSAP is not available
    mobileMenu.style.display = 'flex';
  }
}

function closeMobileMenu() {
  if (!isMenuOpen) return;
  
  isMenuOpen = false;
  
  if (menuIcon) {
    menuIcon.classList.remove('hidden');
    menuIcon.style.display = 'block';
  }
  if (closeIcon) {
    closeIcon.classList.add('hidden');
    closeIcon.style.display = 'none';
  }
  
  // Restore button color to white and position
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.remove('text-black', 'fixed', 'top-6', 'right-6', 'z-[10000]');
    mobileMenuBtn.classList.add('text-white');
  }
  
  document.body.style.overflow = ''; // Restore body scroll
  
  // Animate menu items out with GSAP
  if (typeof gsap !== 'undefined' && mobileMenu) {
    gsap.to(menuItems, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in'
    });
    
    // Animate menu from bottom to top
    gsap.to(mobileMenu, {
      y: '-100%',
      duration: 0.5,
      ease: 'power3.in',
      delay: 0.2,
      onComplete: function() {
        mobileMenu.classList.add('hidden');
      }
    });
  } else {
    // Fallback if GSAP is not available
    mobileMenu.classList.add('hidden');
  }
}

// Close menu when clicking on close button at bottom
if (mobileMenuCloseBtn) {
  mobileMenuCloseBtn.addEventListener('click', function() {
    closeMobileMenu();
  });
}

// Close menu when clicking on navigation links (but not the close button)
if (mobileMenu) {
  mobileMenu.addEventListener('click', function(e) {
    if (e.target.closest('a') && !e.target.closest('#mobile-menu-close-btn')) {
      closeMobileMenu();
    }
  });
}

// Close menu on window resize if it's larger than lg breakpoint
window.addEventListener('resize', function() {
  if (window.innerWidth >= 1024 && isMenuOpen) {
    closeMobileMenu();
  }
});

// Prevent scroll when menu is open
if (mobileMenu) {
  mobileMenu.addEventListener('touchmove', function(e) {
    if (isMenuOpen) {
      e.preventDefault();
    }
  }, { passive: false });
}

// Close menu on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && isMenuOpen) {
    closeMobileMenu();
  }
});

// ============================================
// GSAP ScrollTrigger Animations
// ============================================

// Wait for DOM and GSAP to be ready
function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(initAnimations, 100);
    return;
  }

  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Initialize Lenis after GSAP is ready
  initLenis();

  // Parallax effect for hero background (Section 1)
  const heroImage = document.getElementById('slider-image');
  if (heroImage) {
    gsap.to(heroImage, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.s1',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Refresh ScrollTrigger after all animations are set up
  ScrollTrigger.refresh();
}

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}
