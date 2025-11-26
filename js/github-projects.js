// github-projects.js
class GitHubProjects {
  constructor() {
    this.username = 'VoidX3D'; // Replace with your GitHub username
    this.projectsGrid = document.getElementById('projectsGrid');
    this.languageIcons = this.getLanguageIcons();
    this.init();
  }

  async init() {
    try {
      const projects = await this.fetchGitHubProjects();
      this.displayProjects(projects);
    } catch (error) {
      console.error('Error loading GitHub projects:', error);
      this.showErrorState();
    }
  }

  async fetchGitHubProjects() {
    const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=30`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub projects');
    }
    
    const repos = await response.json();
    
    // Fetch README content for each repo
    const projectsWithReadme = await Promise.all(
      repos
        .filter(repo => !repo.fork && !repo.archived) // Exclude forks and archived
        .map(async (repo) => {
          const readme = await this.fetchReadme(repo.name);
          return {
            name: repo.name,
            description: repo.description || 'No description available',
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updated: repo.updated_at,
            created: repo.created_at,
            topics: repo.topics || [],
            homepage: repo.homepage,
            readme: readme,
            has_pages: repo.has_pages,
            size: repo.size
          };
        })
    );
    
    return projectsWithReadme;
  }

  async fetchReadme(repoName) {
    try {
      const response = await fetch(`https://api.github.com/repos/${this.username}/${repoName}/readme`);
      if (!response.ok) return null;
      
      const readmeData = await response.json();
      // Decode base64 content
      const content = atob(readmeData.content);
      return this.extractReadmeDescription(content);
    } catch (error) {
      return null;
    }
  }

  extractReadmeDescription(readmeContent) {
    // Extract first meaningful paragraph from README
    const lines = readmeContent.split('\n');
    
    // Skip headers and metadata, find first real paragraph
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Skip empty lines, headers, badges, etc.
      if (line && 
          !line.startsWith('#') && 
          !line.startsWith('![') && 
          !line.startsWith('<') && 
          !line.startsWith('```') &&
          !line.includes('badge') &&
          line.length > 20) {
        // Clean up the line
        return line.replace(/[#*`\[\]]/g, '').trim();
      }
    }
    
    return null;
  }

  getLanguageIcons() {
    return {
      'JavaScript': 'js',
      'TypeScript': 'ts',
      'Python': 'py',
      'Java': 'java',
      'C++': 'cpp',
      'C#': 'csharp',
      'PHP': 'php',
      'Ruby': 'ruby',
      'Go': 'go',
      'Rust': 'rust',
      'Swift': 'swift',
      'Kotlin': 'kotlin',
      'HTML': 'html',
      'CSS': 'css',
      'SCSS': 'scss',
      'Vue': 'vue',
      'React': 'react',
      'Angular': 'angular',
      'Node.js': 'node',
      'Express': 'express',
      'Django': 'django',
      'Flask': 'flask',
      'Spring': 'spring',
      'Laravel': 'laravel'
    };
  }

  getLanguageIcon(language) {
    const iconName = this.languageIcons[language] || 'code';
    return this.generateIconSVG(iconName, language);
  }

  generateIconSVG(iconName, language) {
    const icons = {
      'js': `
        <rect x="8" y="8" width="80" height="80" rx="15" fill="#f7df1e"/>
        <path d="M52 62l10-6c2,4 4,6 8,6 4,0 6-2 6-6 0-10-16-8-16-18 0-10 10-16 20-14l-6 10c-4-2-8-2-10,0-2,2-2,4-2,6 0,6 16,6 16,16 0,8-6,16-18,16C56 76 50 70 52 62z" fill="#000"/>
        <path d="M36 60l10-6c2,4 4,8 8,8 4,0 6-2 6-6 0-4-4-6-10-8-8-2-14-6-14-14 0-8 8-14 18-12l-4 10c-4-2-8-2-10,0-2,2-2,6,0,8 2,4 8,6 14,8 8,2 12,6 12,12 0,10-8,16-20,14C40 74 34 68 36 60z" fill="#000"/>
      `,
      'py': `
        <linearGradient id="pyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3776ab"/>
          <stop offset="100%" style="stop-color:#ffd343"/>
        </linearGradient>
        <path d="M40 30l20-10 20 10v40l-20 10-20-10z" fill="url(#pyGrad)"/>
        <path d="M50 35l10-5 10 5v30l-10 5-10-5z" fill="#fff" opacity="0.2"/>
        <circle cx="60" cy="50" r="8" fill="#fff"/>
        <circle cx="60" cy="50" r="4" fill="url(#pyGrad)"/>
      `,
      'html': `
        <rect x="20" y="20" width="60" height="60" rx="10" fill="#e34f26"/>
        <path d="M30 30l20-5 20 5v40l-20 5-20-5z" fill="#fff" opacity="0.1"/>
        <text x="50" y="55" text-anchor="middle" fill="#fff" font-family="Arial" font-size="20" font-weight="bold">HTML</text>
      `,
      'css': `
        <rect x="20" y="20" width="60" height="60" rx="10" fill="#1572b6"/>
        <path d="M30 30l20-5 20 5v40l-20 5-20-5z" fill="#fff" opacity="0.1"/>
        <text x="50" y="55" text-anchor="middle" fill="#fff" font-family="Arial" font-size="20" font-weight="bold">CSS</text>
      `,
      'react': `
        <circle cx="50" cy="50" r="30" fill="#61dafb" opacity="0.2"/>
        <circle cx="50" cy="50" r="20" fill="none" stroke="#61dafb" stroke-width="3"/>
        <circle cx="50" cy="50" r="15" fill="none" stroke="#61dafb" stroke-width="2" opacity="0.6"/>
        <circle cx="50" cy="50" r="25" fill="none" stroke="#61dafb" stroke-width="2" opacity="0.8"/>
        <circle cx="50" cy="50" r="2" fill="#61dafb"/>
      `,
      'node': `
        <circle cx="50" cy="50" r="35" fill="#339933"/>
        <path d="M35 35l20 20-20 20" fill="none" stroke="#fff" stroke-width="5"/>
        <path d="M50 35v30" fill="none" stroke="#fff" stroke-width="5"/>
      `,
      'code': `
        <rect x="25" y="25" width="50" height="50" rx="10" fill="url(#logoGrad)" opacity="0.3"/>
        <rect x="35" y="35" width="30" height="30" fill="url(#logoGrad)"/>
        <path d="M45 45l5-5-5-5M55 45l-5-5 5-5" fill="none" stroke="#fff" stroke-width="2"/>
        <line x1="50" y1="40" x2="50" y2="50" stroke="#fff" stroke-width="2"/>
      `,
      'default': `
        <circle cx="50" cy="50" r="35" fill="url(#logoGrad)" opacity="0.3"/>
        <path d="M35 40l20-10 20 10v30l-20 10-20-10z" fill="url(#logoGrad)"/>
        <path d="M45 45l5-5-5-5M55 45l-5-5 5-5" fill="none" stroke="#fff" stroke-width="2"/>
        <line x1="50" y1="40" x2="50" y2="50" stroke="#fff" stroke-width="2"/>
      `
    };

    return icons[iconName] || icons['default'];
  }

  displayProjects(projects) {
    const placeholder = document.querySelector('.project-placeholder');
    
    projects.forEach(project => {
      const projectCard = this.createProjectCard(project);
      if (placeholder) {
        this.projectsGrid.insertBefore(projectCard, placeholder);
      } else {
        this.projectsGrid.appendChild(projectCard);
      }
    });
  }

  createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('data-category', project.language?.toLowerCase() || 'code');
    card.setAttribute('data-title', project.name);
    
    // Use README description if available, otherwise fall back to repo description
    const description = project.readme || project.description;
    const displayDescription = description.length > 120 
      ? description.substring(0, 120) + '...' 
      : description;

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
            ${project.has_pages ? '<span class="project-badge demo">Demo</span>' : ''}
            ${project.homepage ? '<span class="project-badge website">Website</span>' : ''}
          </div>
        </div>
        <p class="project-description">${displayDescription}</p>
        
        <div class="project-meta">
          <span class="project-stats" title="Stars">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            ${project.stars}
          </span>
          <span class="project-stats" title="Forks">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9C7.9 1 7 1.9 7 3V9C7 10.1 7.9 11 9 11H11V13H10C8.9 13 8 13.9 8 15V21C8 22.1 8.9 23 10 23H14C15.1 23 16 22.1 16 21V15C16 13.9 15.1 13 14 13H13V11H15C16.1 11 17 10.1 17 9V5L21 9Z"/>
            </svg>
            ${project.forks}
          </span>
          <span class="project-stats" title="Size">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7C14.1,7.7 15.8,9.4 15.8,11.5C15.8,14.5 12,18 12,18C12,18 8.2,14.5 8.2,11.5C8.2,9.4 9.9,7.7 12,7.7Z"/>
            </svg>
            ${this.formatSize(project.size)}
          </span>
        </div>

        ${project.topics.length > 0 ? `
          <div class="project-topics">
            ${project.topics.slice(0, 3).map(topic => 
              `<span class="project-topic">${topic}</span>`
            ).join('')}
            ${project.topics.length > 3 ? `<span class="project-topic-more">+${project.topics.length - 3}</span>` : ''}
          </div>
        ` : ''}

        <div class="project-footer">
          <span class="project-date" title="Last updated">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${this.formatDate(project.updated)}
          </span>
          <div class="project-links">
            ${project.homepage ? `
              <a href="${project.homepage}" target="_blank" class="project-link" title="Live Demo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>Demo</span>
              </a>
            ` : ''}
            <a href="${project.url}" target="_blank" class="project-link" title="View on GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  formatSize(kb) {
    if (kb < 1024) return `${kb} KB`;
    const mb = (kb / 1024).toFixed(1);
    return `${mb} MB`;
  }

  showErrorState() {
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
        <p>Check your username or <a href="https://github.com/${this.username}" target="_blank">view on GitHub</a></p>
      </div>
    `;
    this.projectsGrid.appendChild(errorDiv);
  }
}
