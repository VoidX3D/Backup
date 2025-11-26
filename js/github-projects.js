// github-projects.js (SIMPLIFIED)
class GitHubProjects {
  constructor() {
    this.username = 'VoidX3D';
    this.projectsGrid = document.getElementById('projectsGrid');
    this.languageIcons = this.getLanguageIcons();
    this.dataFile = 'data/repositories.json';
    this.init();
  }

  async init() {
    try {
      this.showLoadingState();
      const data = await this.loadLocalData();
      
      // Filter to show only non-forked repos for better presentation
      const originalRepos = data.repositories.filter(repo => !repo.fork);
      
      this.displayProjects(originalRepos);
      
    } catch (error) {
      console.error('Error loading GitHub projects:', error);
      this.showErrorState();
    }
  }

  async loadLocalData() {
    try {
      const response = await fetch(this.dataFile);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${this.dataFile}: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Loaded ${data.repositories.length} repositories from local file`);
      
      return data;
    } catch (error) {
      console.error('Error loading local data:', error);
      
      // Try alternative paths
      const fallbackPaths = [
        '../data/repositories.json',
        './repositories.json',
        'repositories.json'
      ];
      
      for (const path of fallbackPaths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Loaded from fallback: ${path}`);
            return data;
          }
        } catch (e) {
          console.warn(`Fallback ${path} failed:`, e);
        }
      }
      
      throw new Error('All data sources failed');
    }
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

  displayProjects(projects) {
    this.removeLoadingState();
    
    const placeholder = document.querySelector('.project-placeholder');
    
    // Show repository count and info
    const countMessage = document.createElement('div');
    countMessage.className = 'github-count-message';
    countMessage.innerHTML = `
      <div class="count-content">
        <h3>🎯 GitHub Projects</h3>
        <p>Showing <strong>${projects.length}</strong> original repositories from <a href="https://github.com/${this.username}" target="_blank">@${this.username}</a></p>
        <p class="count-subtitle">${this.getProjectStats(projects)}</p>
      </div>
    `;
    
    if (placeholder) {
      this.projectsGrid.insertBefore(countMessage, placeholder);
    } else {
      this.projectsGrid.appendChild(countMessage);
    }
    
    // Add all projects
    projects.forEach(project => {
      const projectCard = this.createProjectCard(project);
      if (placeholder) {
        this.projectsGrid.insertBefore(projectCard, placeholder);
      } else {
        this.projectsGrid.appendChild(projectCard);
      }
    });
    
    console.log(`✅ Displayed ${projects.length} GitHub projects`);
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

  createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card github-project';
    card.setAttribute('data-category', project.language?.toLowerCase() || 'code');
    card.setAttribute('data-title', project.name.toLowerCase());
    card.setAttribute('data-description', (project.description || '').toLowerCase());
    
    // Generate better description if null
    const description = project.description || 
      `${this.formatProjectName(project.name)} - ${project.language ? project.language + ' project' : 'GitHub repository'} by ${this.username}`;
    
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

  showLoadingState() {
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

  removeLoadingState() {
    const loadingDiv = document.getElementById('github-loading');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }

  showErrorState() {
    this.removeLoadingState();
    
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
        <p>Check your connection or <a href="https://github.com/${this.username}" target="_blank">view @${this.username} on GitHub</a></p>
      </div>
    `;
    this.projectsGrid.appendChild(errorDiv);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GitHubProjects();
});
