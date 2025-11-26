// ====================================
// SPACE HUB - ABOUT PAGE JAVASCRIPT
// ====================================

class AboutPage {
  constructor() {
    this.init();
  }
  
  init() {
    this.initAnimations();
    this.initInteractiveElements();
    console.log('🚀 About page initialized!');
  }
  
  initAnimations() {
    // Animate about cards on scroll
    gsap.utils.toArray('.about-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out'
      });
    });
    
    // Animate hero content
    gsap.from('.about-hero-content', {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: 'power2.out'
    });
    
    // Animate creator avatar
    gsap.from('.creator-avatar', {
      scrollTrigger: {
        trigger: '.creator-card',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      duration: 1,
      scale: 0,
      rotation: 360,
      ease: 'back.out(1.7)'
    });
    
    // Animate feature items
    gsap.utils.toArray('.feature-item').forEach((item, index) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        x: -50,
        opacity: 0,
        duration: 0.5,
        delay: index * 0.1,
        ease: 'power2.out'
      });
    });
    
    // Animate tech stack items
    gsap.utils.toArray('.tech-item').forEach((item, index) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.4,
        delay: index * 0.05,
        ease: 'power2.out'
      });
    });
  }
  
  initInteractiveElements() {
    // Add hover effects to tech stack items
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
    
    // Add click effect to CTA button
    const ctaButton = document.querySelector('.cta-section .btn');
    if (ctaButton) {
      ctaButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Create ripple effect
        this.createRippleEffect(e);
        
        // Show temporary message
        const originalText = ctaButton.textContent;
        ctaButton.textContent = 'Thanks for your interest!';
        ctaButton.disabled = true;
        
        setTimeout(() => {
          ctaButton.textContent = originalText;
          ctaButton.disabled = false;
        }, 2000);
      });
    }
    
    // Add animation to creator stats
    this.animateCreatorStats();
  }
  
  createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  animateCreatorStats() {
    const stats = document.querySelectorAll('.creator-stats .stat-number');
    
    stats.forEach(stat => {
      const target = stat.textContent;
      
      // Reset for animation
      if (target.includes('+')) {
        stat.textContent = '0';
      } else if (target === '∞') {
        stat.textContent = '0';
      }
      
      gsap.to(stat, {
        scrollTrigger: {
          trigger: '.creator-stats',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        innerText: target,
        duration: 2,
        ease: 'power2.out',
        snap: { innerText: 1 },
        onUpdate: function() {
          if (target === '∞') {
            // Special handling for infinity symbol
            const progress = this.progress();
            if (progress > 0.8) {
              stat.textContent = '∞';
            }
          } else if (target.includes('+')) {
            // Handle values with plus sign
            const numericValue = Math.floor(this.targets()[0].innerText);
            stat.textContent = numericValue + '+';
          }
        }
      });
    });
  }
}

// ====================================
// INITIALIZE ABOUT PAGE
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  new AboutPage();
});

// ====================================
// ADD RIPPLE EFFECT STYLES
// ====================================
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
  .btn {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyles);
