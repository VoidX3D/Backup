// ====================================
// SPACE HUB - PROJECTS JAVASCRIPT (UPDATED)
// ====================================

class ProjectsPage {
  constructor() {
    this.projectsGrid = document.getElementById('projectsGrid');
    this.searchInput = document.getElementById('searchInput');
    this.viewToggleBtns = document.querySelectorAll('.toggle-btn');
    this.currentView = 'grid';
    this.projects = [];
    this.githubProjects = []; // Store GitHub projects separately
    
    this.init();
  }
  
  init() {
    // Initialize projects data
    this.collectProjects();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize animations
    this.initAnimations();
    
    console.log('🚀 Projects page initialized!');
  }
  
  collectProjects() {
    // Collect all project cards (excluding GitHub projects and placeholder)
    const projectCards = document.querySelectorAll('.project-card:not(.github-project):not(.project-placeholder)');
    
    this.projects = Array.from(projectCards).map(card => {
      return {
        element: card,
        title: card.getAttribute('data-title') || card.querySelector('.project-title').textContent.toLowerCase(),
        category: card.getAttribute('data-category') || 'general',
        description: card.querySelector('.project-description').textContent.toLowerCase(),
        isGitHub: false
      };
    });

    console.log(`📁 Collected ${this.projects.length} local projects`);
  }
  
  // NEW METHOD: Add GitHub projects to search system
  addGitHubProjects(githubCards) {
    const githubProjects = Array.from(githubCards).map(card => {
      return {
        element: card,
        title: card.getAttribute('data-title') || card.querySelector('.project-title').textContent.toLowerCase(),
        category: card.getAttribute('data-category') || 'code',
        description: card.querySelector('.project-description').textContent.toLowerCase(),
        isGitHub: true
      };
    });
    
    this.projects = [...this.projects, ...githubProjects];
    console.log(`✅ Added ${githubProjects.length} GitHub projects to search system`);
  }
  
  setupEventListeners() {
    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.filterProjects(e.target.value);
      });
    }
    
    // View toggle functionality
    this.viewToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        this.switchView(view);
      });
    });
    
    // Placeholder project card click
    const placeholder = document.querySelector('.project-placeholder');
    if (placeholder) {
      placeholder.addEventListener('click', () => {
        this.showAddProjectModal();
      });
    }
  }
  
  initAnimations() {
    // Animate project cards on scroll
    gsap.utils.toArray('.project-card').forEach((card, index) => {
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
    
    // Animate controls
    gsap.from('.controls-wrapper', {
      scrollTrigger: {
        trigger: '.projects-controls',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  }
  
  filterProjects(searchTerm) {
    if (!searchTerm) {
      // Show all projects if search is empty
      this.projects.forEach(project => {
        project.element.style.display = 'flex';
      });
      this.hideNoResults();
      this.removeAllHighlights();
      return;
    }
    
    const term = searchTerm.toLowerCase();
    let hasResults = false;
    
    this.projects.forEach(project => {
      const title = project.title;
      const description = project.description;
      const category = project.category;
      
      if (title.includes(term) || description.includes(term) || category.includes(term)) {
        project.element.style.display = 'flex';
        hasResults = true;
        
        // Highlight matching text
        this.highlightText(project.element, term);
      } else {
        project.element.style.display = 'none';
        this.removeHighlight(project.element);
      }
    });
    
    if (!hasResults) {
      this.showNoResults(searchTerm);
    } else {
      this.hideNoResults();
    }
  }
  
  highlightText(element, term) {
    // Remove existing highlights from this element
    this.removeHighlight(element);
    
    // Highlight in title
    const title = element.querySelector('.project-title');
    if (title) {
      const titleText = title.textContent;
      const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
      const highlighted = titleText.replace(regex, '<mark class="search-highlight">$1</mark>');
      title.innerHTML = highlighted;
    }
    
    // Highlight in description
    const description = element.querySelector('.project-description');
    if (description) {
      const descText = description.textContent;
      const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
      const highlighted = descText.replace(regex, '<mark class="search-highlight">$1</mark>');
      description.innerHTML = highlighted;
    }
  }

  // Helper function to escape regex special characters
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  removeHighlight(element) {
    const marks = element.querySelectorAll('mark.search-highlight');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
      }
    });
  }

  removeAllHighlights() {
    this.projects.forEach(project => {
      this.removeHighlight(project.element);
    });
  }
  
  showNoResults(searchTerm) {
    // Remove existing no results message
    this.hideNoResults();
    
    // Create no results message
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
        <line x1="8" y1="8" x2="16" y2="16"></line>
      </svg>
      <h3>No projects found</h3>
      <p>No results for "${searchTerm}". Try different keywords or browse all projects.</p>
    `;
    
    this.projectsGrid.appendChild(noResults);
  }
  
  hideNoResults() {
    const noResults = this.projectsGrid.querySelector('.no-results');
    if (noResults) {
      noResults.remove();
    }
  }
  
 switchView(view) {
  if (view === this.currentView) return;
  
  // Update active button
  this.viewToggleBtns.forEach(btn => {
    if (btn.getAttribute('data-view') === view) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Update grid class
  this.projectsGrid.classList.remove(`${this.currentView}-view`);
  this.projectsGrid.classList.add(`${view}-view`);
  
  // Ensure GitHub projects have proper list view styling
  if (view === 'list') {
    this.ensureGitHubListViewStyling();
  }
  
  // REMOVED the GSAP animation from here to prevent opacity issues
  // The cards should maintain their existing opacity
  
  this.currentView = view;
}
    // Animate transition
    gsap.from('.project-card', {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.out'
    });
    
    this.currentView = view;
  }

  // NEW METHOD: Ensure GitHub projects have list view styling
  ensureGitHubListViewStyling() {
    const githubProjects = this.projectsGrid.querySelectorAll('.github-project');
    githubProjects.forEach(project => {
      project.classList.add('github-project-list-view');
    });
  }
  
  showAddProjectModal() {
    // Create a simple modal for adding projects
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
      <div class="modal-content" style="
        background: var(--color-bg-card);
        border-radius: var(--radius-xl);
        padding: var(--spacing-2xl);
        max-width: 500px;
        width: 90%;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transform: translateY(20px);
        transition: transform 0.3s ease;
      ">
        <h2 style="margin-bottom: var(--spacing-lg); font-family: 'Orbitron', sans-serif;">Add New Project</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-xl);">
          This feature is coming soon! You'll be able to add your own projects to the gallery.
        </p>
        <div style="display: flex; gap: var(--spacing-md); justify-content: flex-end;">
          <button class="modal-close" style="
            padding: var(--spacing-md) var(--spacing-xl);
            background: transparent;
            border: 1px solid var(--color-text-muted);
            color: var(--color-text-primary);
            border-radius: var(--radius-lg);
            cursor: pointer;
            transition: all var(--transition-fast);
          ">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
    
    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      modal.style.opacity = '0';
      modal.querySelector('.modal-content').style.transform = 'translateY(20px)';
      setTimeout(() => {
        modal.remove();
      }, 300);
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeBtn.click();
      }
    });
  }
}

// ====================================
// INITIALIZE PROJECTS PAGE
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  window.projectsPage = new ProjectsPage(); // Make it globally accessible
});

// ====================================
// ADD SEARCH HIGHLIGHT STYLES
// ====================================
const searchStyles = document.createElement('style');
searchStyles.textContent = `
  .search-highlight {
    background: var(--color-accent-primary);
    color: var(--color-bg-primary);
    padding: 0 2px;
    border-radius: 2px;
    font-weight: 600;
  }
`;
document.head.appendChild(searchStyles);
