// animations.js

// ------------------- STARFIELD -------------------
const starsLayer = document.getElementById('stars-layer');
for (let i = 0; i < 300; i++) {
  let star = document.createElement('div');
  star.style.position = 'absolute';
  star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
  star.style.top = Math.random() * 100 + '%';
  star.style.left = Math.random() * 100 + '%';
  star.style.background = 'white';
  star.style.opacity = Math.random();
  star.style.borderRadius = '50%';
  star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite alternate`;
  starsLayer.appendChild(star);
}

// Starfield twinkle animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes twinkle {
  0% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0.2; transform: scale(0.8); }
}`;
document.head.appendChild(styleSheet);

// ------------------- FLOATING FORMULAS -------------------
const formulas = document.querySelectorAll('.formula-float');
formulas.forEach((formula, index) => {
  let amplitude = Math.random() * 30 + 20; // horizontal movement
  let speed = Math.random() * 0.02 + 0.01;
  let angle = Math.random() * 2 * Math.PI;

  function floatFormula() {
    angle += speed;
    let x = amplitude * Math.sin(angle);
    formula.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(floatFormula);
  }
  floatFormula();
});

// ------------------- PARALLAX MOUSE EFFECT -------------------
document.addEventListener('mousemove', (e) => {
  let w = window.innerWidth;
  let h = window.innerHeight;
  let x = (e.clientX - w/2) / w * 100;
  let y = (e.clientY - h/2) / h * 100;

  // Parallax layers
  const nebula = document.getElementById('nebula-layer');
  const planets = document.getElementById('planets-layer');

  nebula.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
  planets.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
});

// ------------------- FLOATING OBJECTS -------------------
const floatingObjects = document.querySelectorAll('.floating-rocket, .floating-comet, .floating-planet, .floating-satellite');

floatingObjects.forEach(obj => {
  let amplitude = Math.random() * 20 + 10;
  let speed = Math.random() * 0.005 + 0.002;
  let angle = Math.random() * 2 * Math.PI;
  let originalTop = obj.offsetTop;

  function floatObj() {
    angle += speed;
    let y = originalTop + amplitude * Math.sin(angle);
    obj.style.top = y + 'px';
    requestAnimationFrame(floatObj);
  }
  floatObj();
});

// ------------------- PLANET HOVER FACTS -------------------
document.querySelectorAll('.floating-planet, .floating-comet, .floating-satellite').forEach(obj => {
  obj.addEventListener('mouseenter', () => {
    let info = document.createElement('div');
    info.className = 'hover-info';
    info.style.position = 'absolute';
    info.style.left = (obj.offsetLeft + 50) + 'px';
    info.style.top = (obj.offsetTop - 40) + 'px';
    info.style.padding = '8px 12px';
    info.style.background = 'rgba(0,255,255,0.9)';
    info.style.color = '#000';
    info.style.borderRadius = '8px';
    info.style.fontWeight = '700';
    info.style.fontSize = '0.9rem';
    info.style.zIndex = '100';
    info.textContent = '🌌 Space Object Info!';

    document.body.appendChild(info);

    obj.addEventListener('mouseleave', () => {
      info.remove();
    }, { once: true });
  });
});
