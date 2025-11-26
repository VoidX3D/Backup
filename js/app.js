/* ====================================
   SPACE HUB - MAIN JAVASCRIPT
   ==================================== */

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// ====================================
// STARFIELD BACKGROUND
// ====================================
class Starfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.numStars = 200;
    this.speed = 0.5;
    
    this.resize();
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  init() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2,
        vx: (Math.random() - 0.5) * this.speed,
        vy: (Math.random() - 0.5) * this.speed,
        opacity: Math.random() * 0.5 + 0.5
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.stars.forEach(star => {
      // Update position
      star.x += star.vx;
      star.y += star.vy;
      
      // Wrap around edges
      if (star.x < 0) star.x = this.canvas.width;
      if (star.x > this.canvas.width) star.x = 0;
      if (star.y < 0) star.y = this.canvas.height;
      if (star.y > this.canvas.height) star.y = 0;
      
      // Twinkle effect
      star.opacity += (Math.random() - 0.5) * 0.1;
      star.opacity = Math.max(0.3, Math.min(1, star.opacity));
      
      // Draw star
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      this.ctx.fill();
      
      // Add glow for larger stars
      if (star.radius > 1) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(0, 212, 255, ${star.opacity * 0.2})`;
        this.ctx.fill();
      }
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// ====================================
// THEME TOGGLE
// ====================================
class ThemeToggle {
  constructor() {
    this.btn = document.getElementById('themeToggle');
    if (!this.btn) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.setTheme(savedTheme);
    
    this.btn.addEventListener('click', () => this.toggle());
  }
  
  toggle() {
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
  
  setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }
}

// ====================================
// NAVBAR SCROLL EFFECT
// ====================================
class NavbarScroll {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    if (!this.navbar) return;
    
    window.addEventListener('scroll', () => this.handleScroll());
  }
  
  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }
}
// ====================================
// SCROLL ANIMATIONS
// ====================================
class ScrollAnimations {
  constructor() {
    this.init();
  }
  
  init() {
    // Fade in cards on scroll
    gsap.utils.toArray('.feature-card, .identity-card, .resource-card, .quick-card').forEach(card => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    });
    
    // Section titles
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
    
    // FIXED: Animate stats properly
    this.animateStats();
  }
  
  animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
      const originalText = stat.textContent.trim();
      
      // Extract the numeric value and suffix
      let targetValue, suffix;
      
      if (originalText.includes('%')) {
        targetValue = parseInt(originalText);
        suffix = '%';
      } else if (originalText.includes('+')) {
        targetValue = parseInt(originalText);
        suffix = '+';
      } else {
        targetValue = parseInt(originalText);
        suffix = '';
      }
      
      // If we can't parse the number, skip animation
      if (isNaN(targetValue)) {
        console.warn('Could not parse number from:', originalText);
        return;
      }
      
      // Reset the stat to 0 for animation
      stat.textContent = '0' + suffix;
      
      // Animate from 0 to target value
      gsap.to(stat, {
        scrollTrigger: {
          trigger: stat,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        duration: 2,
        ease: 'power1.inOut',
        onUpdate: function() {
          const progress = this.progress();
          const currentValue = Math.floor(progress * targetValue);
          stat.textContent = currentValue + suffix;
        },
        onComplete: function() {
          // Ensure we end with the exact original text
          stat.textContent = originalText;
        }
      });
    });
  }
}
// ====================================
// SMOOTH SCROLL
// ====================================
class SmoothScroll {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// ====================================
// PARALLAX EFFECT
// ====================================
class ParallaxEffect {
  constructor() {
    this.elements = document.querySelectorAll('.floating-planet, .hero-visual');
    if (this.elements.length === 0) return;
    
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }
  
  handleScroll() {
    const scrolled = window.pageYOffset;
    this.elements.forEach(el => {
      const speed = 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }
  
  handleMouseMove(e) {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const moveX = (clientX - centerX) / 50;
    const moveY = (clientY - centerY) / 50;
    
    this.elements.forEach(el => {
      gsap.to(el, {
        x: moveX,
        y: moveY,
        duration: 1,
        ease: 'power2.out'
      });
    });
  }
}

// ====================================
// LOADING ANIMATION
// ====================================
class LoadingAnimation {
  constructor() {
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      
      // Animate hero elements
      const heroTitle = document.querySelector('.hero-title');
      const heroDescription = document.querySelector('.hero-description');
      const heroButtons = document.querySelector('.hero-buttons');
      
      if (heroTitle) {
        gsap.from('.title-line', {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out'
        });
      }
    });
  }
}

// ====================================
// CURSOR TRAIL EFFECT
// ====================================
class CursorTrail {
  constructor() {
    this.particles = [];
    this.particleCount = 0;
    this.maxParticles = 20;
    
    document.addEventListener('mousemove', (e) => this.addParticle(e));
    this.animate();
  }
  
  addParticle(e) {
    if (this.particleCount >= this.maxParticles) return;
    
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = e.clientX + 'px';
    particle.style.top = e.clientY + 'px';
    
    document.body.appendChild(particle);
    this.particles.push(particle);
    this.particleCount++;
    
    setTimeout(() => {
      particle.remove();
      this.particles.shift();
      this.particleCount--;
    }, 1000);
  }
  
  animate() {
    this.particles.forEach((particle, index) => {
      const life = index / this.particles.length;
      particle.style.opacity = 1 - life;
      particle.style.transform = `scale(${1 - life * 0.5})`;
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// ====================================
// INITIALIZE ALL
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize starfield
  new Starfield('starfield');
  
  // Initialize theme toggle
  new ThemeToggle();
  
  // Initialize navbar scroll
  new NavbarScroll();
  
  // Initialize scroll animations
  new ScrollAnimations();
  
  // Initialize smooth scroll
  new SmoothScroll();
  
  // Initialize parallax
  new ParallaxEffect();
  
  // Initialize loading animation
  new LoadingAnimation();
  
  // Add cursor trail on desktop
  if (window.innerWidth > 768) {
    // Cursor trail disabled by default, can be enabled
    // new CursorTrail();
  }
  
  console.log('🚀 Space Hub initialized successfully!');
});

// ====================================
// ADD CURSOR PARTICLE STYLES
// ====================================
const style = document.createElement('style');
style.textContent = `
  .cursor-particle {
    position: fixed;
    width: 10px;
    height: 10px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.8), transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: opacity 0.3s, transform 0.3s;
  }
`;
document.head.appendChild(style);
