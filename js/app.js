// =======================
// GLOBAL STARFIELD CANVAS
// =======================
const canvas = document.getElementById("starfield");
if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  let stars = [];

  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.2;
      this.speed = Math.random() * 0.3 + 0.1;
    }
    update() {
      this.y += this.speed;
      if (this.y > canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.fillStyle = "white";
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 300; i++) stars.push(new Star());
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animateStars);
  }

  initStars();
  animateStars();

  window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    initStars();
  });
}

// =======================
// THEME SWITCHER
// =======================
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("light-theme") ? "light" : "dark"
    );
  });

  const saved = localStorage.getItem("theme");
  if (saved === "light") document.body.classList.add("light-theme");
}

// =======================
// SMOOTH SCROLL + FADE
// =======================
document.querySelectorAll(".fade-up").forEach((el) => {
  gsap.from(el, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: { trigger: el, start: "top 85%" }
  });
});
