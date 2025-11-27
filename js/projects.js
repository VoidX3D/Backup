/* ====================================
   PROJECTS PAGE FUNCTIONALITY
   ==================================== */

class ProjectsManager {
  constructor() {
    this.grid = document.getElementById('projectsGrid');
    this.searchInput = document.getElementById('searchInput');
    this.viewToggleBtns = document.querySelectorAll('.toggle-btn');
    this.currentView = 'grid';
    
    this.init();
  }
  
  init() {
    // Setup view toggle
    this.viewToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });
    
    // Setup search
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.filterProjects(e.target.value);
      });
    }
    
    // Setup placeholder click
    const placeholder = document.querySelector('.project-placeholder');
    if (placeholder) {
      placeholder.addEventListener('click', () => {
        this.showAddProjectInfo();
      });
    }
    
    // Animate cards on load
    this.animateCards();
  }
  
  switchView(view) {
    this.currentView = view;
    
    // Update buttons
    this.viewToggleBtns.forEach(btn => {
      if (btn.dataset.view === view) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Update grid class
    if (view === 'list') {
      this.grid.classList.add('list-view');
    } else {
      this.grid.classList.remove('list-view');
    }
    
    // Re-animate cards
    this.animateCards();
  }
  
  filterProjects(searchTerm) {
    const cards = document.querySelectorAll('.project-card:not(.project-placeholder)');
    const term = searchTerm.toLowerCase().trim();
    
    let visibleCount = 0;
    
    cards.forEach(card => {
      const title = card.dataset.title?.toLowerCase() || '';
      const category = card.dataset.category?.toLowerCase() || '';
      const description = card.querySelector('.project-description')?.textContent.toLowerCase() || '';
      
      const matches = title.includes(term) || 
                     category.includes(term) || 
                     description.includes(term);
      
      if (matches || term === '') {
        card.style.display = '';
        visibleCount++;
        
        // Fade in animation
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(card, {
          opacity: 0,
          y: 20,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            card.style.display = 'none';
          }
        });
      }
    });
    
    // Show empty state if no results
    this.toggleEmptyState(visibleCount === 0 && term !== '');
  }
  
  toggleEmptyState(show) {
    let emptyState = document.querySelector('.empty-state');
    
    if (show && !emptyState) {
      emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <h3>No Projects Found</h3>
        <p>Try adjusting your search terms</p>
      `;
      this.grid.parentElement.appendChild(emptyState);
      
      gsap.from(emptyState, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power2.out'
      });
    } else if (!show && emptyState) {
      gsap.to(emptyState, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          emptyState.remove();
        }
      });
    }
  }
  
  animateCards() {
    const cards = document.querySelectorAll('.project-card');
    
    gsap.from(cards, {
      scrollTrigger: {
        trigger: this.grid,
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }
  
  showAddProjectInfo() {
    // Create modal or alert
    const message = `
      To add a new project:
      
      1. Open projects.html in your code editor
      2. Copy an existing project card
      3. Update the content with your project details
      4. Save and refresh the page
      
      You can customize:
      - Project title and description
      - Category badge
      - Project icon (SVG)
      - External link
    `;
    
    alert(message);
  }
}

// ====================================
// PROJECT CARD INTERACTIONS
// ====================================
class ProjectCardEffects {
  constructor() {
    this.cards = document.querySelectorAll('.project-card:not(.project-placeholder)');
    this.init();
  }
  
  init() {
    this.cards.forEach(card => {
      // Add hover tilt effect
      card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
      card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
      
      // Add click ripple effect
      card.addEventListener('click', (e) => this.createRipple(e, card));
    });
  }
  
  handleMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
  
  handleMouseLeave(card) {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  }
  
  createRipple(e, card) {
    // Only create ripple if not clicking on a link
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      return;
    }
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    card.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }
}

// ====================================
// STATISTICS
// ====================================
class ProjectStats {
  constructor() {
    this.updateStats();
  }
  
  updateStats() {
    const cards = document.querySelectorAll('.project-card:not(.project-placeholder)');
    const categories = new Set();
    
    cards.forEach(card => {
      const category = card.dataset.category;
      if (category) categories.add(category);
    });
    
    console.log('📊 Project Statistics:');
    console.log(`Total Projects: ${cards.length}`);
    console.log(`Categories: ${Array.from(categories).join(', ')}`);
  }
}

// ====================================
// INITIALIZE
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  new ProjectsManager();
  new ProjectCardEffects();
  new ProjectStats();
  
  console.log('✨ Projects page initialized!');
});

// ====================================
// ADD RIPPLE EFFECT STYLES
// ====================================
const style = document.createElement('style');
style.textContent = `
  .project-card {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(0, 212, 255, 0.3);
    transform: scale(0);
    animation: rippleEffect 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes rippleEffect {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
