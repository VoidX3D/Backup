// github-projects.js
class GitHubProjects {
  constructor() {
    this.username = 'VoidX3D'; // Replace with your GitHub username
    this.projectsGrid = document.getElementById('projectsGrid');
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
    const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=20`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub projects');
    }
    
    const repos = await response.json();
    
    // Filter and format the data
    return repos
      .filter(repo => !repo.fork) // Exclude forked repos
      .map(repo => ({
        name: repo.name,
        description: repo.description || 'No description available',
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated: repo.updated_at,
        topics: repo.topics || []
      }));
  }

  displayProjects(projects) {
    // Remove the placeholder or add after it
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
    
    card.innerHTML = `
      <div class="project-image">
        <svg class="project-icon" viewBox="0 0 200 200" width="200" height="200">
          <defs>
            <linearGradient id="githubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#7b2ff7;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="url(#githubGrad)" opacity="0.2"/>
          <path d="M100 40 C60 40, 40 70, 40 100 C40 130, 60 160, 100 160 C140 160, 160 130, 160 100 C160 70, 140 40, 100 40 Z 
                   M80 120 L70 130 L90 150 M120 120 L130 130 L110 150" 
                fill="none" stroke="url(#githubGrad)" stroke-width="8"/>
          <circle cx="80" cy="90" r="10" fill="url(#githubGrad)"/>
          <circle cx="120" cy="90" r="10" fill="url(#githubGrad)"/>
        </svg>
      </div>
      <div class="project-content">
        <div class="project-header">
          <h3 class="project-title">${this.formatProjectName(project.name)}</h3>
          <span class="project-badge">${project.language || 'Code'}</span>
        </div>
        <p class="project-description">${project.description}</p>
        <div class="project-meta">
          <span class="project-stats">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"></polygon>
            </svg>
            ${project.stars}
          </span>
          <span class="project-stats">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
            ${project.forks}
          </span>
        </div>
        <div class="project-footer">
          <span class="project-date">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${this.formatDate(project.updated)}
          </span>
          <a href="${project.url}" target="_blank" class="project-link">
            <span>View on GitHub</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    `;
    
    return card;
  }

  formatProjectName(name) {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  showErrorState() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'github-error';
    errorDiv.innerHTML = `
      <p>Unable to load GitHub projects. <a href="https://github.com/${this.username}" target="_blank">View on GitHub</a></p>
    `;
    this.projectsGrid.appendChild(errorDiv);
  }
}
