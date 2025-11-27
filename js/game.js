/* ====================================
   SPACE EXPLORER GAME
   ==================================== */

class SpaceGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Game state
    this.gameRunning = false;
    this.score = 0;
    this.time = 0;
    this.highScore = parseInt(localStorage.getItem('spaceGameHighScore')) || 0;
    
    // Player
    this.player = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      radius: 15,
      speed: 5,
      color: '#00d4ff'
    };
    
    // Asteroids
    this.asteroids = [];
    this.asteroidSpawnRate = 60; // frames
    this.asteroidSpawnCounter = 0;
    
    // Particles
    this.particles = [];
    
    // Input
    this.keys = {};
    
    // UI Elements
    this.startBtn = document.getElementById('startBtn');
    this.restartBtn = document.getElementById('restartBtn');
    this.gameOverlay = document.getElementById('gameOverlay');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    
    this.init();
  }
  
  init() {
    // Update high score display
    this.updateHighScore();
    
    // Event listeners
    this.startBtn.addEventListener('click', () => this.start());
    this.restartBtn.addEventListener('click', () => this.restart());
    
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      
      // Pause on spacebar
      if (e.key === ' ' && this.gameRunning) {
        this.togglePause();
        e.preventDefault();
      }
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
    
    // Initial draw
    this.drawStartScreen();
  }
  
  start() {
    this.gameRunning = true;
    this.score = 0;
    this.time = 0;
    this.asteroids = [];
    this.particles = [];
    this.asteroidSpawnCounter = 0;
    
    this.player.x = this.canvas.width / 2;
    this.player.y = this.canvas.height / 2;
    
    this.gameOverlay.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    
    this.gameLoop();
    this.updateStats();
  }
  
  restart() {
    this.start();
  }
  
  togglePause() {
    this.gameRunning = !this.gameRunning;
    if (this.gameRunning) {
      this.gameLoop();
    }
  }
  
  gameLoop() {
    if (!this.gameRunning) return;
    
    this.update();
    this.draw();
    
    requestAnimationFrame(() => this.gameLoop());
  }
  
  update() {
    // Update player position
    this.updatePlayer();
    
    // Spawn asteroids
    this.asteroidSpawnCounter++;
    if (this.asteroidSpawnCounter >= this.asteroidSpawnRate) {
      this.spawnAsteroid();
      this.asteroidSpawnCounter = 0;
      
      // Increase difficulty over time
      if (this.asteroidSpawnRate > 20) {
        this.asteroidSpawnRate -= 0.5;
      }
    }
    
    // Update asteroids
    this.updateAsteroids();
    
    // Update particles
    this.updateParticles();
    
    // Check collisions
    this.checkCollisions();
    
    // Update score and time
    this.score += 1;
    this.time = Math.floor(this.score / 60);
    this.updateStats();
    
    // Create trail particles
    if (Math.random() < 0.3) {
      this.createParticle(this.player.x, this.player.y, this.player.color);
    }
  }
  
  updatePlayer() {
    // Movement
    if (this.keys['arrowup'] || this.keys['w']) {
      this.player.y = Math.max(this.player.radius, this.player.y - this.player.speed);
    }
    if (this.keys['arrowdown'] || this.keys['s']) {
      this.player.y = Math.min(this.canvas.height - this.player.radius, this.player.y + this.player.speed);
    }
    if (this.keys['arrowleft'] || this.keys['a']) {
      this.player.x = Math.max(this.player.radius, this.player.x - this.player.speed);
    }
    if (this.keys['arrowright'] || this.keys['d']) {
      this.player.x = Math.min(this.canvas.width - this.player.radius, this.player.x + this.player.speed);
    }
  }
  
  spawnAsteroid() {
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y, vx, vy;
    
    switch(side) {
      case 0: // top
        x = Math.random() * this.canvas.width;
        y = -30;
        vx = (Math.random() - 0.5) * 4;
        vy = Math.random() * 2 + 1;
        break;
      case 1: // right
        x = this.canvas.width + 30;
        y = Math.random() * this.canvas.height;
        vx = -(Math.random() * 2 + 1);
        vy = (Math.random() - 0.5) * 4;
        break;
      case 2: // bottom
        x = Math.random() * this.canvas.width;
        y = this.canvas.height + 30;
        vx = (Math.random() - 0.5) * 4;
        vy = -(Math.random() * 2 + 1);
        break;
      case 3: // left
        x = -30;
        y = Math.random() * this.canvas.height;
        vx = Math.random() * 2 + 1;
        vy = (Math.random() - 0.5) * 4;
        break;
    }
    
    this.asteroids.push({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      radius: Math.random() * 15 + 15,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    });
  }
  
  updateAsteroids() {
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      
      asteroid.x += asteroid.vx;
      asteroid.y += asteroid.vy;
      asteroid.rotation += asteroid.rotationSpeed;
      
      // Remove if off screen
      if (asteroid.x < -50 || asteroid.x > this.canvas.width + 50 ||
          asteroid.y < -50 || asteroid.y > this.canvas.height + 50) {
        this.asteroids.splice(i, 1);
      }
    }
  }
  
  createParticle(x, y, color) {
    this.particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 3 + 1,
      color: color,
      alpha: 1,
      decay: 0.02
    });
  }
  
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= particle.decay;
      
      if (particle.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  checkCollisions() {
    for (const asteroid of this.asteroids) {
      const dx = this.player.x - asteroid.x;
      const dy = this.player.y - asteroid.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.player.radius + asteroid.radius) {
        this.gameOver();
        return;
      }
    }
  }
  
  gameOver() {
    this.gameRunning = false;
    
    // Create explosion particles
    for (let i = 0; i < 30; i++) {
      this.createParticle(this.player.x, this.player.y, '#ff006e');
    }
    
    // Update high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('spaceGameHighScore', this.highScore);
      this.updateHighScore();
    }
    
    // Show game over screen
    document.getElementById('finalScore').textContent = this.score;
    
    setTimeout(() => {
      this.gameOverScreen.classList.remove('hidden');
    }, 500);
  }
  
  draw() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw particles
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color + Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
      this.ctx.fill();
    });
    
    // Draw asteroids
    this.asteroids.forEach(asteroid => {
      this.ctx.save();
      this.ctx.translate(asteroid.x, asteroid.y);
      this.ctx.rotate(asteroid.rotation);
      
      this.ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = asteroid.radius * (0.8 + Math.random() * 0.4);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.closePath();
      
      this.ctx.fillStyle = '#7b2ff7';
      this.ctx.fill();
      this.ctx.strokeStyle = '#ff006e';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      this.ctx.restore();
    });
    
    // Draw player
    if (this.gameRunning) {
      this.ctx.save();
      this.ctx.translate(this.player.x, this.player.y);
      
      // Player glow
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.player.radius + 5, 0, Math.PI * 2);
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.player.radius + 5);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      // Player ship
      this.ctx.beginPath();
      this.ctx.moveTo(0, -this.player.radius);
      this.ctx.lineTo(this.player.radius * 0.7, this.player.radius);
      this.ctx.lineTo(0, this.player.radius * 0.6);
      this.ctx.lineTo(-this.player.radius * 0.7, this.player.radius);
      this.ctx.closePath();
      
      this.ctx.fillStyle = this.player.color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Cockpit
      this.ctx.beginPath();
      this.ctx.arc(0, -this.player.radius * 0.3, this.player.radius * 0.3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();
      
      this.ctx.restore();
    }
  }
  
  drawStartScreen() {
    this.ctx.fillStyle = 'rgba(10, 10, 15, 0.95)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw title
    this.ctx.font = 'bold 48px Orbitron';
    this.ctx.fillStyle = '#00d4ff';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('SPACE EXPLORER', this.canvas.width / 2, this.canvas.height / 2);
  }
  
  updateStats() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('time').textContent = this.time + 's';
  }
  
  updateHighScore() {
    document.getElementById('highScore').textContent = this.highScore;
  }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  const game = new SpaceGame();
  console.log('🎮 Space Explorer game loaded!');
});
