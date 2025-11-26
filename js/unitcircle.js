// =======================
// UNIT CIRCLE CANVAS
// =======================
const unitCanvas = document.getElementById("unitCircle");
if (unitCanvas) {
  const ctx = unitCanvas.getContext("2d");
  const radius = 250;
  let angle = 45 * Math.PI / 180;

  function drawCircle() {
    ctx.clearRect(0, 0, unitCanvas.width, unitCanvas.height);

    const cx = unitCanvas.width / 2;
    const cy = unitCanvas.height / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#66aaff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Axis
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx, cy + radius);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#999";
    ctx.stroke();

    // Point
    const px = cx + radius * Math.cos(angle);
    const py = cy - radius * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#00d4ff";
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.strokeStyle = "#00d4ff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawCircle();

  // =======================
  // SLIDER + VALUES
  // =======================
  const slider = document.getElementById("angleSlider");
  const degText = document.getElementById("angleDegrees");
  const radText = document.getElementById("angleRadians");

  const sinVal = document.getElementById("sinValue");
  const cosVal = document.getElementById("cosValue");
  const tanVal = document.getElementById("tanValue");
  const cscVal = document.getElementById("cscValue");
  const secVal = document.getElementById("secValue");
  const cotVal = document.getElementById("cotValue");

  function updateValues() {
    const deg = parseInt(slider.value);
    angle = deg * Math.PI / 180;

    degText.textContent = `${deg}°`;
    radText.textContent = angle.toFixed(2) + " rad";

    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const t = Math.tan(angle);

    sinVal.textContent = s.toFixed(3);
    cosVal.textContent = c.toFixed(3);
    tanVal.textContent = t.toFixed(3);
    cscVal.textContent = s === 0 ? "∞" : (1/s).toFixed(3);
    secVal.textContent = c === 0 ? "∞" : (1/c).toFixed(3);
    cotVal.textContent = s === 0 ? "∞" : (c/s).toFixed(3);

    drawCircle();
  }

  slider.addEventListener("input", updateValues);
  updateValues();

  // =======================
  // QUICK ANGLES
  // =======================
  document.querySelectorAll(".btn-preset").forEach(btn => {
    btn.addEventListener("click", () => {
      slider.value = btn.dataset.angle;
      updateValues();
    });
  });

  // =======================
  // ANIMATION PLAY
  // =======================
  let animActive = false;

  document.getElementById("playAnimation").addEventListener("click", () => {
    animActive = !animActive;

    if (animActive) animateCircle();
  });

  function animateCircle() {
    if (!animActive) return;

    slider.value = (parseInt(slider.value) + 1) % 360;
    updateValues();

    requestAnimationFrame(animateCircle);
  }

  // Reset
  document.getElementById("resetAngle").addEventListener("click", () => {
    slider.value = 45;
    animActive = false;
    updateValues();
  });
}
