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

  // Check if mobile device for reduced motion
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shouldAnimate = !prefersReducedMotion;

  // Common animation settings
  const defaultDuration = isMobile ? 0.6 : 0.8;
  const defaultEase = 'power2.out';

  // Get all sections for reliable section finding
  const allSections = document.querySelectorAll('section');

  // Parallax effect for hero background (Section 1)
  const heroImage = document.getElementById('slider-image');
  if (heroImage && shouldAnimate) {
    gsap.to(heroImage, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.s1',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true
      }
    });
  }

  // Hero title animation
  const heroTitle = document.getElementById('slider-title');
  if (heroTitle && shouldAnimate) {
    gsap.from(heroTitle, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: heroTitle,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Section 2 - Overview Section
  const section2 = document.querySelector('section:nth-of-type(2)');
  if (section2 && shouldAnimate) {
    const section2Content = section2.querySelectorAll('h2, p, img, .flex.flex-col.gap-2');
    gsap.utils.toArray(section2Content).forEach((el, index) => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: defaultDuration,
        ease: defaultEase,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        delay: index * 0.1
      });
    });
  }

  // Section 3 - Pillars of a Better Life
  const section3 = document.querySelector('section:nth-of-type(3)');
  if (section3 && shouldAnimate) {
    // Heading animation
    const section3Heading = section3.querySelector('p.font-baskervville');
    if (section3Heading) {
      gsap.from(section3Heading, {
        opacity: 0,
        y: 30,
        duration: defaultDuration,
        ease: defaultEase,
        scrollTrigger: {
          trigger: section3Heading,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Pillar cards animation with stagger
    const pillarCards = section3.querySelectorAll('.flex.flex-col.justify-between.items-center.gap-4');
    if (pillarCards.length > 0) {
      gsap.from(pillarCards, {
        opacity: 0,
        y: 50,
        duration: defaultDuration,
        ease: defaultEase,
        stagger: 0.2,
        scrollTrigger: {
          trigger: pillarCards[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Curated Amenities heading
    const curatedHeading = section3.querySelector('h3.font-baskervville');
    if (curatedHeading) {
      gsap.from(curatedHeading, {
        opacity: 0,
        y: 30,
        duration: defaultDuration,
        ease: defaultEase,
        scrollTrigger: {
          trigger: curatedHeading,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Amenity cards animation
    const amenityCards = section3.querySelectorAll('.amenity-card');
    if (amenityCards.length > 0) {
      gsap.from(amenityCards, {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: defaultDuration,
        ease: defaultEase,
        stagger: 0.15,
        scrollTrigger: {
          trigger: amenityCards[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
  }

  // Section 4 - Location Advantage
  const section4 = Array.from(allSections).find(section => 
    section.textContent.includes('Location Advantage') || 
    section.classList.toString().includes('BF4423')
  );
  if (section4 && shouldAnimate) {
    // Heading animation
    const section4Headings = section4.querySelectorAll('h3, p.font-baskervville');
    gsap.from(section4Headings, {
      opacity: 0,
      y: 30,
      duration: defaultDuration,
      ease: defaultEase,
      stagger: 0.1,
      scrollTrigger: {
        trigger: section4Headings[0],
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    // Location images and grid
    const locationContent = section4.querySelectorAll('img, .flex.flex-col');
    gsap.from(locationContent, {
      opacity: 0,
      y: 40,
      duration: defaultDuration,
      ease: defaultEase,
      stagger: 0.15,
      scrollTrigger: {
        trigger: locationContent[0],
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Section 5 - Layouts & Planning
  const section5 = document.querySelector('section:nth-of-type(5)');
  if (section5 && shouldAnimate) {
    // Heading animation
    const section5Heading = section5.querySelector('h3');
    if (section5Heading) {
      gsap.from(section5Heading, {
        opacity: 0,
        y: 30,
        duration: defaultDuration,
        ease: defaultEase,
        scrollTrigger: {
          trigger: section5Heading,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Master plan image and list
    const masterPlanContent = section5.querySelectorAll('img, h4, ul');
    gsap.from(masterPlanContent, {
      opacity: 0,
      x: isMobile ? 0 : -30,
      duration: defaultDuration,
      ease: defaultEase,
      stagger: 0.1,
      scrollTrigger: {
        trigger: masterPlanContent[0],
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Section 6 - Unit Layout
  const section6 = Array.from(allSections).find(section => 
    section.textContent.includes('Unit Layout') || 
    section.classList.toString().includes('F7EEE6')
  );
  if (section6 && shouldAnimate) {
    // Heading animation
    const section6Heading = section6.querySelector('h3');
    if (section6Heading) {
      gsap.from(section6Heading, {
        opacity: 0,
        y: 30,
        duration: defaultDuration,
        ease: defaultEase,
        scrollTrigger: {
          trigger: section6Heading,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Layout images
    const layoutImages = section6.querySelectorAll('img[alt*="BHK"]');
    gsap.from(layoutImages, {
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: defaultDuration,
      ease: defaultEase,
      stagger: 0.2,
      scrollTrigger: {
        trigger: layoutImages[0],
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    // Button animation
    const section6Button = section6.querySelector('button');
    if (section6Button) {
      gsap.from(section6Button, {
        opacity: 0,
        y: 20,
        duration: defaultDuration,
        ease: defaultEase,
        scrollTrigger: {
          trigger: section6Button,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
  }

  // Section 7 - Trust & Governance
  const section7 = document.querySelector('section:nth-of-type(7)');
  if (section7 && shouldAnimate) {
    // Text content animation
    const section7Text = section7.querySelectorAll('h2, p');
    gsap.from(section7Text, {
      opacity: 0,
      y: 30,
      duration: defaultDuration,
      ease: defaultEase,
      stagger: 0.1,
      scrollTrigger: {
        trigger: section7Text[0],
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    // Image animation
    const section7Image = section7.querySelector('img');
    if (section7Image) {
      gsap.from(section7Image, {
        opacity: 0,
        scale: 0.9,
        duration: defaultDuration + 0.2,
        ease: defaultEase,
        scrollTrigger: {
          trigger: section7Image,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
  }

  // Section 8 - Featured Project (Form Section)
  const section8 = document.getElementById('featured-project');
  if (section8 && shouldAnimate) {
    // Form container
    const formContainer = section8.querySelector('#sec4-form');
    if (formContainer) {
      gsap.from(formContainer, {
        opacity: 0,
        x: isMobile ? 0 : -50,
        duration: defaultDuration,
        ease: defaultEase,
        scrollTrigger: {
          trigger: formContainer,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Cards animation
    const section8Cards = section8.querySelectorAll('#sec4-card1, #sec4-card2, #sec4-card3');
    gsap.from(section8Cards, {
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: defaultDuration,
      ease: defaultEase,
      stagger: 0.15,
      scrollTrigger: {
        trigger: section8Cards[0],
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Footer animations
  const footer = document.getElementById('footer');
  if (footer && shouldAnimate) {
    const footerContent = footer.querySelectorAll('#footer-row1 > *, #footer-row2 > *');
    gsap.from(footerContent, {
      opacity: 0,
      y: 30,
      duration: defaultDuration,
      ease: defaultEase,
      stagger: 0.1,
      scrollTrigger: {
        trigger: footer,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Refresh ScrollTrigger after all animations are set up
  ScrollTrigger.refresh();

  // Refresh on resize for responsive behavior
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
}

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

// ============================================
// Amenity Cards Hover Animation with GSAP
// ============================================
function initAmenityCardsHover() {
  if (typeof gsap === 'undefined') {
    setTimeout(initAmenityCardsHover, 100);
    return;
  }

  const amenityCards = document.querySelectorAll('.amenity-card');

  if (!amenityCards.length) {
    return;
  }

  // Process each card individually
  amenityCards.forEach(card => {
    const overlay = card.querySelector('.amenity-hover-overlay');
    const title = card.querySelector('.amenity-title');
    
    if (!overlay || !title) return;

    // Set initial state
    // Overlay starts from bottom (hidden below)
    gsap.set(overlay, {
      y: '100%', // Start from bottom (fully below the card)
      opacity: 0
    });
    
    // Title starts visible at bottom
    gsap.set(title, {
      y: '0%',
      opacity: 1
    });

    // Create hover timeline: title hides (slides down) -> overlay shows (slides up)
    const hoverTimeline = gsap.timeline({ paused: true });
    hoverTimeline
      .to(title, {
        y: '100%', // Slide title down to hide
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      })
      .to(overlay, {
        y: '0%', // Slide overlay up to show (starts after title is completely hidden)
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, '-=0.1'); // Start slightly before title animation ends for faster transition

    // Create leave timeline: overlay hides (slides down) -> title shows (slides up)
    const leaveTimeline = gsap.timeline({ paused: true });
    leaveTimeline
      .to(overlay, {
        y: '100%', // Slide overlay down to hide
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      })
      .to(title, {
        y: '0%', // Slide title up to show (starts after overlay is completely hidden)
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, '-=0.1'); // Start slightly before overlay animation ends for faster transition

    card.addEventListener('mouseenter', function() {
      // Stop leave timeline if it's playing and restart hover timeline
      if (leaveTimeline.isActive()) {
        leaveTimeline.kill();
        // Reset to starting state for hover
        gsap.set(overlay, { y: '100%', opacity: 0 });
        gsap.set(title, { y: '0%', opacity: 1 });
      }
      hoverTimeline.restart();
    });

    card.addEventListener('mouseleave', function() {
      // Stop hover timeline if it's playing and restart leave timeline
      if (hoverTimeline.isActive()) {
        hoverTimeline.kill();
        // Reset to starting state for leave
        gsap.set(title, { y: '100%', opacity: 0 });
        gsap.set(overlay, { y: '0%', opacity: 1 });
      }
      leaveTimeline.restart();
    });
  });
}

// Initialize amenity cards hover when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAmenityCardsHover);
} else {
  initAmenityCardsHover();
}