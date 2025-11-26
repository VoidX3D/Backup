/* ====================================
   INTERACTIVE UNIT CIRCLE
   ==================================== */

class UnitCircle {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.angle = 45; // degrees
    this.animating = false;
    this.animationId = null;
    
    // Colors
    this.colors = {
      background: 'rgba(19, 19, 26, 0.8)',
      grid: 'rgba(255, 255, 255, 0.1)',
      circle: 'rgba(0, 212, 255, 0.6)',
      radius: '#00d4ff',
      sin: '#7b2ff7',
      cos: '#ff006e',
      tan: '#00ff88',
      angle: 'rgba(255, 255, 255, 0.2)',
      point: '#ffffff',
      text: '#ffffff'
    };
    
    // Setup controls
    this.setupControls();
    
    // Initial draw
    this.draw();
    
    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }
  
  setupControls() {
    // Angle slider
    const slider = document.getElementById('angleSlider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.angle = parseFloat(e.target.value);
        this.updateDisplay();
        this.draw();
      });
    }
    
    // Play animation button
    const playBtn = document.getElementById('playAnimation');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.toggleAnimation());
    }
    
    // Reset button
    const resetBtn = document.getElementById('resetAngle');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }
    
    // Preset angle buttons
    const presetButtons = document.querySelectorAll('.btn-preset');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.angle = parseFloat(btn.dataset.angle);
        document.getElementById('angleSlider').value = this.angle;
        this.updateDisplay();
        this.draw();
      });
    });
  }
  
  handleResize() {
    // Canvas size is fixed, but we can adjust if needed
    this.draw();
  }
  
  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
  updateDisplay() {
    const radians = this.degreesToRadians(this.angle);
    
    // Update angle displays
    const degDisplay = document.getElementById('angleDegrees');
    const radDisplay = document.getElementById('angleRadians');
    if (degDisplay) degDisplay.textContent = `${this.angle.toFixed(0)}°`;
    if (radDisplay) radDisplay.textContent = `${radians.toFixed(2)} rad`;
    
    // Calculate trig values
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    const tan = Math.tan(radians);
    const csc = 1 / sin;
    const sec = 1 / cos;
    const cot = 1 / tan;
    
    // Update trig value displays
    this.updateTrigValue('sinValue', sin);
    this.updateTrigValue('cosValue', cos);
    this.updateTrigValue('tanValue', tan);
    this.updateTrigValue('cscValue', csc);
    this.updateTrigValue('secValue', sec);
    this.updateTrigValue('cotValue', cot);
  }
  
  updateTrigValue(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    
    if (Math.abs(value) > 1000) {
      element.textContent = '∞';
    } else if (isNaN(value) || !isFinite(value)) {
      element.textContent = 'undefined';
    } else {
      element.textContent = value.toFixed(3);
    }
  }
  
  draw() {
    const canvas = this.canvas;
    const ctx = this.ctx;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;
    
    // Clear canvas
    ctx.fillStyle = this.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    this.drawGrid(ctx, centerX, centerY, radius);
    
    // Draw axes
    this.drawAxes(ctx, centerX, centerY, radius);
    
    // Draw unit circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.colors.circle;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Calculate point on circle
    const radians = this.degreesToRadians(this.angle);
    const x = centerX + radius * Math.cos(radians);
    const y = centerY - radius * Math.sin(radians); // Negative because canvas Y is inverted
    
    // Draw angle arc
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius * 0.3, 0, -radians, radians > 0);
    ctx.closePath();
    ctx.fillStyle = this.colors.angle;
    ctx.fill();
    
    // Draw angle label
    const labelRadius = radius * 0.4;
    const labelX = centerX + labelRadius * Math.cos(radians / 2);
    const labelY = centerY - labelRadius * Math.sin(radians / 2);
    ctx.fillStyle = this.colors.text;
    ctx.font = 'bold 16px Orbitron';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('θ', labelX, labelY);
    
    // Draw radius line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = this.colors.radius;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw sin line (vertical from x-axis to point)
    ctx.beginPath();
    ctx.moveTo(x, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = this.colors.sin;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw sin label
    ctx.fillStyle = this.colors.sin;
    ctx.font = 'bold 14px Orbitron';
    ctx.textAlign = 'left';
    ctx.fillText('sin(θ)', x + 10, (centerY + y) / 2);
    
    // Draw cos line (horizontal from origin to point's x)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, centerY);
    ctx.strokeStyle = this.colors.cos;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw cos label
    ctx.fillStyle = this.colors.cos;
    ctx.textAlign = 'center';
    ctx.fillText('cos(θ)', (centerX + x) / 2, centerY - 15);
    
    // Draw tan line (if within canvas bounds)
    const tanLength = Math.tan(radians) * radius;
    if (Math.abs(tanLength) < canvas.height && Math.cos(radians) !== 0) {
      ctx.beginPath();
      ctx.moveTo(centerX + radius, centerY);
      ctx.lineTo(centerX + radius, centerY - tanLength);
      ctx.strokeStyle = this.colors.tan;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw tan label
      ctx.fillStyle = this.colors.tan;
      ctx.textAlign = 'left';
      ctx.fillText('tan(θ)', centerX + radius + 10, centerY - tanLength / 2);
    }
    
    // Draw point on circle
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.point;
    ctx.fill();
    ctx.strokeStyle = this.colors.radius;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw coordinates label
    ctx.fillStyle = this.colors.text;
    ctx.font = 'bold 12px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(
      `(${Math.cos(radians).toFixed(2)}, ${Math.sin(radians).toFixed(2)})`,
      x,
      y - 20
    );
  }
  
  drawGrid(ctx, centerX, centerY, radius) {
    ctx.strokeStyle = this.colors.grid;
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = -1; i <= 1; i++) {
      if (i === 0) continue;
      ctx.beginPath();
      ctx.moveTo(centerX + i * radius, centerY - radius - 20);
      ctx.lineTo(centerX + i * radius, centerY + radius + 20);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = -1; i <= 1; i++) {
      if (i === 0) continue;
      ctx.beginPath();
      ctx.moveTo(centerX - radius - 20, centerY + i * radius);
      ctx.lineTo(centerX + radius + 20, centerY + i * radius);
      ctx.stroke();
    }
  }
  
  drawAxes(ctx, centerX, centerY, radius) {
    // X-axis
    ctx.beginPath();
    ctx.moveTo(centerX - radius - 40, centerY);
    ctx.lineTo(centerX + radius + 40, centerY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // X-axis arrow
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 40, centerY);
    ctx.lineTo(centerX + radius + 30, centerY - 5);
    ctx.lineTo(centerX + radius + 30, centerY + 5);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 40);
    ctx.lineTo(centerX, centerY + radius + 40);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Y-axis arrow
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 40);
    ctx.lineTo(centerX - 5, centerY - radius - 30);
    ctx.lineTo(centerX + 5, centerY - radius - 30);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
    
    // Axis labels
    ctx.fillStyle = this.colors.text;
    ctx.font = 'bold 14px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('x', centerX + radius + 50, centerY + 5);
    ctx.fillText('y', centerX + 5, centerY - radius - 50);
    
    // Mark important points
    ctx.font = '12px Orbitron';
    ctx.fillText('1', centerX + radius, centerY + 20);
    ctx.fillText('-1', centerX - radius, centerY + 20);
    ctx.fillText('1', centerX - 20, centerY - radius);
    ctx.fillText('-1', centerX - 20, centerY + radius);
  }
  
  toggleAnimation() {
    this.animating = !this.animating;
    
    const playBtn = document.getElementById('playAnimation');
    if (playBtn) {
      playBtn.innerHTML = this.animating ? 
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg><span>Pause</span>` :
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg><span>Animate</span>`;
    }
    
    if (this.animating) {
      this.animate();
    } else {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  animate() {
    if (!this.animating) return;
    
    this.angle = (this.angle + 1) % 360;
    
    const slider = document.getElementById('angleSlider');
    if (slider) slider.value = this.angle;
    
    this.updateDisplay();
    this.draw();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  reset() {
    this.angle = 0;
    this.animating = false;
    
    const slider = document.getElementById('angleSlider');
    if (slider) slider.value = 0;
    
    const playBtn = document.getElementById('playAnimation');
    if (playBtn) {
      playBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg><span>Animate</span>`;
    }
    
    this.updateDisplay();
    this.draw();
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Initialize unit circle when page loads
document.addEventListener('DOMContentLoaded', () => {
  const unitCircle = new UnitCircle('unitCircle');
});
