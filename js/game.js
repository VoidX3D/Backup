// ====================================
// SPACE HUB - SPACE EXPLORER GAME
// ====================================

class SpaceExplorerGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.gameState = 'menu'; // menu, playing, paused, gameover
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.asteroids = [];
    this.bullets = [];
    this.powerups = [];
    this.particles = [];
    
    // Player spaceship
    this.player = {
      x: this.canvas.width / 2,
      y: this.canvas.height - 100,
      width: 40,
      height: 60,
      speed: 5,
      color: '#00d4ff',
      isMovingLeft: false,
      isMovingRight: false,
      isMovingUp: false,
      isMovingDown: false,
      isShooting: false,
      lastShot: 0,
      shootDelay: 300,
      shield: false,
      shieldTime: 0,
      rapidFire: false,
      rapidFireTime: 0
    };
    
    // Game settings
    this.asteroidSpawnRate = 60;
    this.powerupSpawnRate = 300;
    this.asteroidSpeed = 2;
    this.frameCount = 0;
    
    this.init();
  }
  
  init() {
    // Set canvas size
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Initialize event listeners
    this.setupEventListeners();
    
    // Initialize game controls
    this.setupControls();
    
    // Start game loop
    this.gameLoop();
    
    console.log('🚀 Space Explorer Game initialized!');
  }
  
  resizeCanvas() {
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = Math.min(500, window.innerHeight * 0.6);
  }
  
  setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    
    // Game buttons
    document.getElementById('startBtn').addEventListener('click', () => this.startGame());
    document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
    document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
  }
  
  setupControls() {
    // Touch controls
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const upBtn = document.getElementById('upBtn');
    const shootBtn = document.getElementById('shootBtn');
    
    // Left button
    leftBtn.addEventListener('touchstart', () => this.player.isMovingLeft = true);
    leftBtn.addEventListener('touchend', () => this.player.isMovingLeft = false);
    leftBtn.addEventListener('mousedown', () => this.player.isMovingLeft = true);
    leftBtn.addEventListener('mouseup', () => this.player.isMovingLeft = false);
    leftBtn.addEventListener('mouseleave', () => this.player.isMovingLeft = false);
    
    // Right button
    rightBtn.addEventListener('touchstart', () => this.player.isMovingRight = true);
    rightBtn.addEventListener('touchend', () => this.player.isMovingRight = false);
    rightBtn.addEventListener('mousedown', () => this.player.isMovingRight = true);
    rightBtn.addEventListener('mouseup', () => this.player.isMovingRight = false);
    rightBtn.addEventListener('mouseleave', () => this.player.isMovingRight = false);
    
    // Up button
    upBtn.addEventListener('touchstart', () => this.player.isMovingUp = true);
    upBtn.addEventListener('touchend', () => this.player.isMovingUp = false);
    upBtn.addEventListener('mousedown', () => this.player.isMovingUp = true);
    upBtn.addEventListener('mouseup', () => this.player.isMovingUp = false);
    upBtn.addEventListener('mouseleave', () => this.player.isMovingUp = false);
    
    // Shoot button
    shootBtn.addEventListener('touchstart', () => this.player.isShooting = true);
    shootBtn.addEventListener('touchend', () => this.player.isShooting = false);
    shootBtn.addEventListener('mousedown', () => this.player.isShooting = true);
    shootBtn.addEventListener('mouseup', () => this.player.isShooting = false);
    shootBtn.addEventListener('mouseleave', () => this.player.isShooting = false);
  }
  
  handleKeyDown(e) {
    switch(e.code) {
      case 'ArrowLeft':
        this.player.isMovingLeft = true;
        break;
      case 'ArrowRight':
        this.player.isMovingRight = true;
        break;
      case 'ArrowUp':
        this.player.isMovingUp = true;
        break;
      case 'ArrowDown':
        this.player.isMovingDown = true;
        break;
      case 'Space':
        this.player.isShooting = true;
        e.preventDefault();
        break;
      case 'KeyP':
        this.togglePause();
        break;
    }
  }
  
  handleKeyUp(e) {
    switch(e.code) {
      case 'ArrowLeft':
        this.player.isMovingLeft = false;
        break;
      case 'ArrowRight':
        this.player.isMovingRight = false;
        break;
      case 'ArrowUp':
        this.player.isMovingUp = false;
        break;
      case 'ArrowDown':
        this.player.isMovingDown = false;
        break;
      case 'Space':
        this.player.isShooting = false;
        break;
    }
  }
  
  startGame() {
    if (this.gameState === 'menu' || this.gameState === 'gameover') {
      this.resetGame();
      this.gameState = 'playing';
      document.getElementById('startBtn').textContent = 'Restart Game';
    }
  }
  
  togglePause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
      document.getElementById('pauseBtn').textContent = 'Resume';
    } else if (this.gameState === 'paused') {
      this.gameState = 'playing';
      document.getElementById('pauseBtn').textContent = 'Pause';
    }
  }
  
  resetGame() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.asteroids = [];
    this.bullets = [];
    this.powerups = [];
    this.particles = [];
    
    this.player.x = this.canvas.width / 2;
    this.player.y = this.canvas.height - 100;
    this.player.shield = false;
    this.player.rapidFire = false;
    
    this.updateUI();
  }
  
  updateUI() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('lives').textContent = this.lives;
    document.getElementById('level').textContent = this.level;
  }
  
  gameLoop() {
    if (this.gameState === 'playing') {
      this.update();
    }
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
  
  update() {
    this.frameCount++;
    
    // Update player position
    this.updatePlayer();
    
    // Spawn asteroids
    if (this.frameCount % this.asteroidSpawnRate === 0) {
      this.spawnAsteroid();
    }
    
    // Spawn powerups
    if (this.frameCount % this.powerupSpawnRate === 0) {
      this.spawnPowerup();
    }
    
    // Update asteroids
    this.updateAsteroids();
    
    // Update bullets
    this.updateBullets();
    
    // Update powerups
    this.updatePowerups();
    
    // Update particles
    this.updateParticles();
    
    // Update power-up timers
    this.updatePowerupTimers();
    
    // Check collisions
    this.checkCollisions();
    
    // Update level
    this.updateLevel();
  }
  
  updatePlayer() {
    // Movement
    if (this.player.isMovingLeft && this.player.x > this.player.width / 2) {
      this.player.x -= this.player.speed;
    }
    if (this.player.isMovingRight && this.player.x < this.canvas.width - this.player.width / 2) {
      this.player.x += this.player.speed;
    }
    if (this.player.isMovingUp && this.player.y > this.player.height / 2) {
      this.player.y -= this.player.speed;
    }
    if (this.player.isMovingDown && this.player.y < this.canvas.height - this.player.height / 2) {
      this.player.y += this.player.speed;
    }
    
    // Shooting
    const now = Date.now();
    if (this.player.isShooting && now - this.player.lastShot > (this.player.rapidFire ? this.player.shootDelay / 3 : this.player.shootDelay)) {
      this.shoot();
      this.player.lastShot = now;
    }
  }
  
  shoot() {
    this.bullets.push({
      x: this.player.x,
      y: this.player.y - this.player.height / 2,
      width: 4,
      height: 15,
      speed: 8,
      color: '#00ff88'
    });
    
    // Add muzzle flash particle
    this.particles.push({
      x: this.player.x,
      y: this.player.y - this.player.height / 2,
      size: 8,
      color: '#00d4ff',
      life: 10,
      speed: 2,
      vx: (Math.random() - 0.5) * 4,
      vy: -Math.random() * 4
    });
  }
  
  spawnAsteroid() {
    const size = Math.random() * 30 + 20;
    this.asteroids.push({
      x: Math.random() * (this.canvas.width - size),
      y: -size,
      width: size,
      height: size,
      speed: this.asteroidSpeed + Math.random() * 2,
      color: '#7b2ff7',
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    });
  }
  
  spawnPowerup() {
    const types = ['shield', 'rapid-fire', 'extra-life'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    this.powerups.push({
      x: Math.random() * (this.canvas.width - 30),
      y: -30,
      width: 30,
      height: 30,
      speed: 2,
      type: type
    });
  }
  
  updateAsteroids() {
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      asteroid.y += asteroid.speed;
      asteroid.rotation += asteroid.rotationSpeed;
      
      // Remove if off screen
      if (asteroid.y > this.canvas.height + asteroid.height) {
        this.asteroids.splice(i, 1);
      }
    }
  }
  
  updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.y -= bullet.speed;
      
      // Remove if off screen
      if (bullet.y < -bullet.height) {
        this.bullets.splice(i, 1);
      }
    }
  }
  
  updatePowerups() {
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const powerup = this.powerups[i];
      powerup.y += powerup.speed;
      
      // Remove if off screen
      if (powerup.y > this.canvas.height + powerup.height) {
        this.powerups.splice(i, 1);
      }
    }
  }
  
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      particle.size *= 0.95;
      
      // Remove if dead
      if (particle.life <= 0 || particle.size < 0.5) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  updatePowerupTimers() {
    const now = Date.now();
    
    // Shield timer
    if (this.player.shield && now > this.player.shieldTime) {
      this.player.shield = false;
    }
    
    // Rapid fire timer
    if (this.player.rapidFire && now > this.player.rapidFireTime) {
      this.player.rapidFire = false;
    }
  }
  
  checkCollisions() {
    // Bullet vs Asteroid
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      for (let j = this.asteroids.length - 1; j >= 0; j--) {
        const bullet = this.bullets[i];
        const asteroid = this.asteroids[j];
        
        if (this.checkCollision(bullet, asteroid)) {
          // Remove bullet and asteroid
          this.bullets.splice(i, 1);
          this.asteroids.splice(j, 1);
          
          // Add score
          this.score += Math.floor(100 - asteroid.width);
          
          // Create explosion particles
          this.createExplosion(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2);
          
          break;
        }
      }
    }
    
    // Player vs Asteroid
    if (!this.player.shield) {
      for (let i = this.asteroids.length - 1; i >= 0; i--) {
        const asteroid = this.asteroids[i];
        
        if (this.checkCollision(this.player, asteroid)) {
          // Remove asteroid
          this.asteroids.splice(i, 1);
          
          // Lose life
          this.lives--;
          this.updateUI();
          
          // Create explosion
          this.createExplosion(this.player.x, this.player.y);
          
          // Check game over
          if (this.lives <= 0) {
            this.gameOver();
          }
          
          break;
        }
      }
    }
    
    // Player vs Powerup
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const powerup = this.powerups[i];
      
      if (this.checkCollision(this.player, powerup)) {
        this.collectPowerup(powerup);
        this.powerups.splice(i, 1);
        break;
      }
    }
  }
  
  checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }
  
  collectPowerup(powerup) {
    const now = Date.now();
    
    switch(powerup.type) {
      case 'shield':
        this.player.shield = true;
        this.player.shieldTime = now + 10000; // 10 seconds
        break;
      case 'rapid-fire':
        this.player.rapidFire = true;
        this.player.rapidFireTime = now + 8000; // 8 seconds
        break;
      case 'extra-life':
        this.lives++;
        this.updateUI();
        break;
    }
    
    // Create collection effect
    this.createPowerupEffect(powerup.x + powerup.width / 2, powerup.y + powerup.height / 2, powerup.type);
  }
  
  createExplosion(x, y) {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: x,
        y: y,
        size: Math.random() * 8 + 4,
        color: '#ff006e',
        life: Math.random() * 30 + 20,
        speed: 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8
      });
    }
  }
  
  createPowerupEffect(x, y, type) {
    const colors = {
      'shield': '#00d4ff',
      'rapid-fire': '#ff006e',
      'extra-life': '#00ff88'
    };
    
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: x,
        y: y,
        size: Math.random() * 6 + 3,
        color: colors[type],
        life: Math.random() * 40 + 30,
        speed: 2,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6
      });
    }
  }
  
  updateLevel() {
    const newLevel = Math.floor(this.score / 1000) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.asteroidSpeed = 2 + (this.level - 1) * 0.5;
      this.asteroidSpawnRate = Math.max(20, 60 - (this.level - 1) * 5);
      this.updateUI();
    }
  }
  
  gameOver() {
    this.gameState = 'gameover';
  }
  
  render() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw stars in background
    this.drawStars();
    
    // Draw game objects
    this.drawPowerups();
    this.drawAsteroids();
    this.drawBullets();
    this.drawPlayer();
    this.drawParticles();
    
    // Draw UI overlays
    this.drawUI();
    
    // Draw game state overlays
    if (this.gameState === 'menu') {
      this.drawMenu();
    } else if (this.gameState === 'paused') {
      this.drawPauseScreen();
    } else if (this.gameState === 'gameover') {
      this.drawGameOver();
    }
  }
  
  drawStars() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 123.456) % this.canvas.width;
      const y = (i * 76.543) % this.canvas.height;
      const size = (Math.sin(this.frameCount * 0.01 + i) + 1) * 0.5 + 0.5;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  drawPlayer() {
    this.ctx.save();
    this.ctx.translate(this.player.x, this.player.y);
    
    // Draw shield if active
    if (this.player.shield) {
      this.ctx.strokeStyle = '#00d4ff';
      this.ctx.lineWidth = 3;
      this.ctx.globalAlpha = 0.5;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.player.width, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;
    }
    
    // Draw spaceship
    this.ctx.fillStyle = this.player.color;
    
    // Spaceship body
    this.ctx.beginPath();
    this.ctx.moveTo(0, -this.player.height / 2);
    this.ctx.lineTo(-this.player.width / 2, this.player.height / 2);
    this.ctx.lineTo(this.player.width / 2, this.player.height / 2);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Spaceship details
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(-this.player.width / 4, -this.player.height / 4, this.player.width / 2, this.player.height / 4);
    
    // Engine glow
    if (this.frameCount % 10 < 5) {
      this.ctx.fillStyle = '#ff4400';
      this.ctx.beginPath();
      this.ctx.moveTo(-this.player.width / 4, this.player.height / 2);
      this.ctx.lineTo(0, this.player.height / 2 + 10);
      this.ctx.lineTo(this.player.width / 4, this.player.height / 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }
  
  drawAsteroids() {
    this.asteroids.forEach(asteroid => {
      this.ctx.save();
      this.ctx.translate(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2);
      this.ctx.rotate(asteroid.rotation);
      
      this.ctx.fillStyle = asteroid.color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, asteroid.width / 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Asteroid details
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      this.ctx.beginPath();
      this.ctx.arc(-asteroid.width / 4, -asteroid.width / 4, asteroid.width / 6, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });
  }
  
  drawBullets() {
    this.bullets.forEach(bullet => {
      this.ctx.fillStyle = bullet.color;
      this.ctx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
      
      // Bullet glow
      this.ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
      this.ctx.fillRect(bullet.x - bullet.width, bullet.y, bullet.width * 2, bullet.height);
    });
  }
  
  drawPowerups() {
    this.powerups.forEach(powerup => {
      this.ctx.save();
      this.ctx.translate(powerup.x + powerup.width / 2, powerup.y + powerup.height / 2);
      
      // Pulsing animation
      const scale = 1 + Math.sin(this.frameCount * 0.1) * 0.2;
      this.ctx.scale(scale, scale);
      
      let color;
      switch(powerup.type) {
        case 'shield':
          color = '#00d4ff';
          break;
        case 'rapid-fire':
          color = '#ff006e';
          break;
        case 'extra-life':
          color = '#00ff88';
          break;
      }
      
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, powerup.width / 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Inner symbol
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      switch(powerup.type) {
        case 'shield':
          this.ctx.arc(0, 0, powerup.width / 4, 0, Math.PI * 2);
          break;
        case 'rapid-fire':
          this.ctx.rect(-powerup.width / 4, -powerup.width / 8, powerup.width / 2, powerup.width / 4);
          break;
        case 'extra-life':
          this.ctx.moveTo(0, -powerup.width / 4);
          this.ctx.lineTo(-powerup.width / 4, powerup.width / 4);
          this.ctx.lineTo(powerup.width / 4, powerup.width / 4);
          this.ctx.closePath();
          break;
      }
      this.ctx.fill();
      
      this.ctx.restore();
    });
  }
  
  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.globalAlpha = particle.life / 50;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;
  }
  
  drawUI() {
    // Draw score in corner
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px Orbitron';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`SCORE: ${this.score}`, 10, 25);
    this.ctx.fillText(`LIVES: ${this.lives}`, 10, 50);
    this.ctx.fillText(`LEVEL: ${this.level}`, 10, 75);
    
    // Draw active power-ups
    let powerupY = 100;
    if (this.player.shield) {
      const timeLeft = Math.ceil((this.player.shieldTime - Date.now()) / 1000);
      this.ctx.fillStyle = '#00d4ff';
      this.ctx.fillText(`SHIELD: ${timeLeft}s`, 10, powerupY);
      powerupY += 25;
    }
    
    if (this.player.rapidFire) {
      const timeLeft = Math.ceil((this.player.rapidFireTime - Date.now()) / 1000);
      this.ctx.fillStyle = '#ff006e';
      this.ctx.fillText(`RAPID FIRE: ${timeLeft}s`, 10, powerupY);
    }
  }
  
  drawMenu() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 48px Orbitron';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('SPACE EXPLORER', this.canvas.width / 2, this.canvas.height / 2 - 50);
    
    this.ctx.font = '20px Inter';
    this.ctx.fillText('Click START GAME to begin your space adventure!', this.canvas.width / 2, this.canvas.height / 2 + 20);
    
    this.ctx.font = '16px Inter';
    this.ctx.fillStyle = '#00d4ff';
    this.ctx.fillText('Use ARROW KEYS to move and SPACEBAR to shoot', this.canvas.width / 2, this.canvas.height / 2 + 60);
  }
  
  drawPauseScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 36px Orbitron';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    
    this.ctx.font = '16px Inter';
    this.ctx.fillText('Press P or click RESUME to continue', this.canvas.width / 2, this.canvas.height / 2 + 40);
  }
  
  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#ff006e';
    this.ctx.font = 'bold 48px Orbitron';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '24px Orbitron';
    this.ctx.fillText(`FINAL SCORE: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
    
    this.ctx.font = '20px Orbitron';
    this.ctx.fillText(`LEVEL REACHED: ${this.level}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
    
    this.ctx.font = '16px Inter';
    this.ctx.fillStyle = '#00d4ff';
    this.ctx.fillText('Click START GAME to play again', this.canvas.width / 2, this.canvas.height / 2 + 90);
  }
}

// ====================================
// INITIALIZE GAME
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  new SpaceExplorerGame();
});
