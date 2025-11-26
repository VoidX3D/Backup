// combined-projects.js - ALL IN ONE SOLUTION
class ProjectsManager {
  constructor() {
    this.projectsGrid = document.getElementById('projectsGrid');
    this.searchInput = document.getElementById('searchInput');
    this.viewToggleBtns = document.querySelectorAll('.toggle-btn');
    this.currentView = 'grid';
    this.githubUsername = 'VoidX3D';
    this.languageIcons = this.getLanguageIcons();
    
    this.init();
  }
  
  async init() {
    // Set up event listeners first
    this.setupEventListeners();
    
    // Load GitHub projects
    await this.loadGitHubProjects();
    
    // Initialize animations
    this.initAnimations();
    
    console.log('🚀 Projects manager initialized!');
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
  
  async loadGitHubProjects() {
    try {
      this.showGitHubLoading();
      const data = await this.loadGitHubData();
      
      if (!data.repositories || data.repositories.length === 0) {
        throw new Error('No repository data found');
      }
      
      // Filter to show only non-forked repos
      const originalRepos = data.repositories.filter(repo => !repo.fork);
      this.displayGitHubProjects(originalRepos);
      
    } catch (error) {
      console.error('Error loading GitHub projects:', error);
      this.showGitHubError();
    }
  }
  
  async loadGitHubData() {
    const possiblePaths = [
      'data/repositories.json',
      '../data/repositories.json',
      './data/repositories.json',
      'repositories.json',
      '../repositories.json'
    ];
    
    for (const path of possiblePaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Loaded ${data.repositories.length} repositories from: ${path}`);
          return data;
        }
      } catch (error) {
        console.warn(`Failed to load from ${path}:`, error);
        continue;
      }
    }
    
    throw new Error('All data sources failed');
  }
  
  displayGitHubProjects(projects) {
    this.removeGitHubLoading();
    
    const placeholder = document.querySelector('.project-placeholder');
    
    // Show repository count and info
    const countMessage = document.createElement('div');
    countMessage.className = 'github-count-message';
    countMessage.innerHTML = `
      <div class="count-content">
        <h3>🎯 GitHub Projects</h3>
        <p>Showing <strong>${projects.length}</strong> original repositories from <a href="https://github.com/${this.githubUsername}" target="_blank">@${this.githubUsername}</a></p>
        <p class="count-subtitle">${this.getProjectStats(projects)}</p>
      </div>
    `;
    
    if (placeholder) {
      this.projectsGrid.insertBefore(countMessage, placeholder);
    } else {
      this.projectsGrid.appendChild(countMessage);
    }
    
    // Add all GitHub projects
    projects.forEach(project => {
      const projectCard = this.createGitHubProjectCard(project);
      if (placeholder) {
        this.projectsGrid.insertBefore(projectCard, placeholder);
      } else {
        this.projectsGrid.appendChild(projectCard);
      }
    });
    
    console.log(`✅ Displayed ${projects.length} GitHub projects`);
  }
  
  createGitHubProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card github-project';
    card.setAttribute('data-category', project.language?.toLowerCase() || 'code');
    card.setAttribute('data-title', project.name.toLowerCase());
    card.setAttribute('data-description', (project.description || '').toLowerCase());
    
    // Generate better description if null
    const description = project.description || 
      `${this.formatProjectName(project.name)} - ${project.language ? project.language + ' project' : 'GitHub repository'} by ${this.githubUsername}`;
    
    const displayDescription = description.length > 120 
      ? description.substring(0, 120) + '...' 
      : description;

    // Handle topics with tooltips for long names
    const topicsHTML = project.topics && project.topics.length > 0 ? `
      <div class="project-topics">
        ${project.topics.slice(0, 4).map(topic => {
          const displayTopic = topic.length > 15 ? topic.substring(0, 15) + '...' : topic;
          return `<span class="project-topic" ${topic.length > 15 ? `data-tooltip="${topic}"` : ''}>${displayTopic}</span>`;
        }).join('')}
        ${project.topics.length > 4 ? `<span class="project-topic-more">+${project.topics.length - 4}</span>` : ''}
      </div>
    ` : '';

    card.innerHTML = `
      <div class="project-image">
        <svg class="project-icon" viewBox="0 0 100 100" width="100" height="100">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#7b2ff7;stop-opacity:1" />
            </linearGradient>
          </defs>
          ${this.getLanguageIcon(project.language)}
        </svg>
      </div>
      <div class="project-content">
        <div class="project-header">
          <h3 class="project-title">${this.formatProjectName(project.name)}</h3>
          <div class="project-badges">
            ${project.language ? `<span class="project-badge language">${project.language}</span>` : ''}
            ${project.archived ? '<span class="project-badge archived">Archived</span>' : ''}
            ${project.has_pages ? '<span class="project-badge pages">Pages</span>' : ''}
            ${project.stars > 0 ? `<span class="project-badge stars">⭐ ${project.stars}</span>` : ''}
          </div>
        </div>
        <p class="project-description">${displayDescription}</p>
        
        <div class="project-meta">
          ${project.stars > 0 ? `
            <span class="project-stats" title="Stars">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              ${project.stars}
            </span>
          ` : ''}
          ${project.forks > 0 ? `
            <span class="project-stats" title="Forks">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9C7.9 1 7 1.9 7 3V9C7 10.1 7.9 11 9 11H11V13H10C8.9 13 8 13.9 8 15V21C8 22.1 8.9 23 10 23H14C15.1 23 16 22.1 16 21V15C16 13.9 15.1 13 14 13H13V11H15C16.1 11 17 10.1 17 9V5L21 9Z"/>
              </svg>
              ${project.forks}
            </span>
          ` : ''}
          <span class="project-stats" title="Size">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7C14.1,7.7 15.8,9.4 15.8,11.5C15.8,14.5 12,18 12,18C12,18 8.2,14.5 8.2,11.5C8.2,9.4 9.9,7.7 12,7.7Z"/>
            </svg>
            ${this.formatSize(project.size)}
          </span>
        </div>

        ${topicsHTML}

        <div class="project-footer">
          <span class="project-date" title="Last updated">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${this.formatDate(project.updated)}
          </span>
          <div class="project-links">
            ${project.homepage ? `
              <a href="${project.homepage}" target="_blank" class="project-link demo-link" title="Live Demo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>Demo</span>
              </a>
            ` : ''}
            <a href="${project.url}" target="_blank" class="project-link github-link" title="View on GitHub">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              <span>Code</span>
            </a>
          </div>
        </div>
      </div>
    `;
    
    return card;
  }
  
  filterProjects(searchTerm) {
    if (!searchTerm) {
      // Show all projects if search is empty
      const allCards = this.projectsGrid.querySelectorAll('.project-card');
      allCards.forEach(card => {
        card.style.display = 'flex';
      });
      this.hideNoResults();
      this.removeAllHighlights();
      return;
    }
    
    const term = searchTerm.toLowerCase();
    let hasResults = false;
    
    const allCards = this.projectsGrid.querySelectorAll('.project-card');
    
    allCards.forEach(card => {
      // Skip the count message and placeholder
      if (card.classList.contains('github-count-message') || card.classList.contains('project-placeholder')) {
        return;
      }
      
      const title = card.getAttribute('data-title') || card.querySelector('.project-title')?.textContent.toLowerCase() || '';
      const description = card.getAttribute('data-description') || card.querySelector('.project-description')?.textContent.toLowerCase() || '';
      const category = card.getAttribute('data-category') || 'general';
      
      if (title.includes(term) || description.includes(term) || category.includes(term)) {
        card.style.display = 'flex';
        hasResults = true;
        
        // Highlight matching text
        this.highlightText(card, term);
      } else {
        card.style.display = 'none';
        this.removeHighlight(card);
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
    const allCards = this.projectsGrid.querySelectorAll('.project-card');
    allCards.forEach(card => {
      this.removeHighlight(card);
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
    
    this.currentView = view;
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
  
  showGitHubLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'github-loading';
    loadingDiv.className = 'github-loading';
    loadingDiv.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>Loading GitHub repositories...</p>
      </div>
    `;
    this.projectsGrid.appendChild(loadingDiv);
  }

  removeGitHubLoading() {
    const loadingDiv = document.getElementById('github-loading');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }

  showGitHubError() {
    this.removeGitHubLoading();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'github-error';
    errorDiv.innerHTML = `
      <div class="error-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Unable to load GitHub projects</h3>
        <p>Check your connection or <a href="https://github.com/${this.githubUsername}" target="_blank">view @${this.githubUsername} on GitHub</a></p>
      </div>
    `;
    this.projectsGrid.appendChild(errorDiv);
  }
  
  getLanguageIcons() {
    return {
      'JavaScript': 'js', 'TypeScript': 'ts', 'Python': 'py', 'Java': 'java',
      'HTML': 'html', 'CSS': 'css', 'SCSS': 'scss', 'Vue': 'vue', 'React': 'react',
      'Node.js': 'node', 'Express': 'express', 'Django': 'django', 'Flask': 'flask',
      'Shell': 'shell', 'Dockerfile': 'docker', 'Makefile': 'code',
      'Jupyter Notebook': 'python', 'C++': 'cpp', 'C#': 'csharp', 'PHP': 'php',
      'Ruby': 'ruby', 'Go': 'go', 'Rust': 'rust', 'Swift': 'swift'
    };
  }

  getLanguageIcon(language) {
    const iconName = this.languageIcons[language] || 'code';
    return this.generateIconSVG(iconName, language);
  }

  generateIconSVG(iconName, language) {
    const icons = {
      'js': `<circle cx="50" cy="50" r="40" fill="#f7df1e"/><path d="M35 35l30 30M65 35L35 65" stroke="#000" stroke-width="3"/>`,
      'ts': `<rect x="20" y="20" width="60" height="60" rx="10" fill="#3178c6"/><text x="50" y="55" text-anchor="middle" fill="#fff" font-family="Arial" font-size="14" font-weight="bold">TS</text>`,
      'py': `<circle cx="50" cy="50" r="40" fill="#3776ab"/><path d="M35 35l15 15-15 15" stroke="#ffd343" stroke-width="4" fill="none"/>`,
      'html': `<rect x="20" y="20" width="60" height="60" rx="10" fill="#e34f26"/><text x="50" y="52" text-anchor="middle" fill="#fff" font-family="Arial" font-size="14" font-weight="bold">HTML</text>`,
      'css': `<rect x="20" y="20" width="60" height="60" rx="10" fill="#1572b6"/><text x="50" y="52" text-anchor="middle" fill="#fff" font-family="Arial" font-size="14" font-weight="bold">CSS</text>`,
      'react': `<circle cx="50" cy="50" r="25" fill="#61dafb" opacity="0.3"/><circle cx="50" cy="50" r="20" fill="none" stroke="#61dafb" stroke-width="2"/><circle cx="50" cy="50" r="15" fill="none" stroke="#61dafb" stroke-width="1" opacity="0.6"/>`,
      'node': `<circle cx="50" cy="50" r="35" fill="#339933"/><path d="M35 35l20 20-20 20" fill="none" stroke="#fff" stroke-width="5"/><path d="M50 35v30" fill="none" stroke="#fff" stroke-width="5"/>`,
      'code': `<rect x="25" y="25" width="50" height="50" rx="10" fill="url(#logoGrad)" opacity="0.3"/><rect x="35" y="35" width="30" height="30" fill="url(#logoGrad)"/><path d="M45 45l5-5-5-5M55 45l-5-5 5-5" fill="none" stroke="#fff" stroke-width="2"/><line x1="50" y1="40" x2="50" y2="50" stroke="#fff" stroke-width="2"/>`
    };
    return icons[iconName] || icons['code'];
  }

  getProjectStats(projects) {
    const languages = {};
    let totalStars = 0;
    let withHomepage = 0;
    
    projects.forEach(project => {
      const lang = project.language || 'Various';
      languages[lang] = (languages[lang] || 0) + 1;
      totalStars += project.stars;
      if (project.homepage) withHomepage++;
    });
    
    const topLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang, count]) => `${lang} (${count})`)
      .join(', ');
    
    return `${topLanguages} • ${totalStars} stars • ${withHomepage} live demos`;
  }

  formatProjectName(name) {
    return name
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  formatSize(kb) {
    if (kb === 0) return 'Empty';
    if (kb < 1024) return `${kb} KB`;
    const mb = (kb / 1024).toFixed(1);
    return `${mb} MB`;
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
// INITIALIZE PROJECTS MANAGER
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  new ProjectsManager();
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
