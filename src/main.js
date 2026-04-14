import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";
import { DualWaveAnimation } from "./dual-wave/DualWaveAnimation.js";
import { preloadImages } from "./utils.js";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ===== Pixel noise background =====
function initPixelNoise() {
  const canvas = document.getElementById('pixel-noise');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const colors = ['#ff3c78', '#00e5ff', '#ffe600', '#76ff03', '#d500f9', '#ff6d00'];
  const blockSize = 2;
  const count = 10;

  // Pre-generate static block positions
  let blocks = [];
  function generateBlocks() {
    blocks = [];
    for (let i = 0; i < count; i++) {
      blocks.push({
        x: Math.floor(Math.random() * canvas.width / blockSize) * blockSize,
        y: Math.floor(Math.random() * canvas.height / blockSize) * blockSize,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateBlocks();
  }
  resize();
  window.addEventListener('resize', resize);

  // Slowly shuffle a few blocks each frame for subtle movement
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Randomly reposition 2 blocks per frame
    for (let j = 0; j < 2; j++) {
      const idx = Math.floor(Math.random() * blocks.length);
      blocks[idx].x = Math.floor(Math.random() * canvas.width / blockSize) * blockSize;
      blocks[idx].y = Math.floor(Math.random() * canvas.height / blockSize) * blockSize;
      blocks[idx].color = colors[Math.floor(Math.random() * colors.length)];
    }
    for (const b of blocks) {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, blockSize, blockSize);
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// Initialize smooth scroll
ScrollSmoother.create({
  smooth: 1.5,
  normalizeScroll: true,
});

// ===== 1. Hero character stagger animation =====
function initHeroAnimation() {
  const lines = document.querySelectorAll(".hero__line");
  lines.forEach((line) => {
    const text = line.textContent;
    line.textContent = "";
    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.className = "hero__char";
      span.textContent = char === " " ? "\u00A0" : char;
      line.appendChild(span);
    });
  });

  const allChars = document.querySelectorAll(".hero__char");
  gsap.to(allChars, {
    y: 0,
    rotation: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power4.out",
    stagger: 0.04,
    delay: 0.3,
  });

  // Subtitle fade in
  gsap.from(".hero__subtitle", {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.8,
  });
}

// ===== 2. Description line-by-line reveal =====
function initDescReveal() {
  const desc = document.querySelector(".hero__desc");
  if (!desc) return;

  gsap.from(desc, {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 1.0,
  });
}

// ===== 3. Make project texts clickable =====
function initProjectLinks() {
  document.querySelectorAll(".animated-text[data-link]").forEach((el) => {
    el.addEventListener("click", () => {
      window.open(el.dataset.link, "_blank");
    });
  });
}

// ===== 4. Pac-Man contact animation =====
function initPacMan() {
  const board = document.querySelector('.pac-board');
  const pacEl = document.getElementById('pac-man');
  const dotsContainer = document.getElementById('pac-dots');
  if (!board || !pacEl) return;

  const corners = document.querySelectorAll('.pac-corner');
  // Corner order: TL -> TR -> BR -> BL (clockwise)
  const margin = 10;
  const dotSpacing = 28;

  let dots = [];
  let raf;

  function getCornerPositions() {
    const w = board.clientWidth;
    const h = board.clientHeight;
    return [
      { x: margin, y: margin },                 // TL
      { x: w - margin - 22, y: margin },         // TR
      { x: w - margin - 22, y: h - margin - 22 },// BR
      { x: margin, y: h - margin - 22 },         // BL
    ];
  }

  function getDirection(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
    return dy > 0 ? 'down' : 'up';
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    dots = [];
    const cp = getCornerPositions();
    for (let i = 0; i < 4; i++) {
      const from = cp[i];
      const to = cp[(i + 1) % 4];
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const count = Math.floor(dist / dotSpacing);
      for (let j = 1; j < count; j++) {
        const t = j / count;
        const dot = document.createElement('div');
        dot.className = 'pac-dot';
        dot.style.left = (from.x + dx * t + 10) + 'px';
        dot.style.top = (from.y + dy * t + 10) + 'px';
        dotsContainer.appendChild(dot);
        dots.push({ el: dot, x: from.x + dx * t + 10, y: from.y + dy * t + 10 });
      }
    }
  }

  // Animation state
  let seg = 0;       // current segment 0-3
  let progress = 0;  // 0..1 along current segment
  const speed = 0.4; // segments per second

  function animate(time) {
    const cp = getCornerPositions();
    const from = cp[seg];
    const to = cp[(seg + 1) % 4];

    const x = from.x + (to.x - from.x) * progress;
    const y = from.y + (to.y - from.y) * progress;

    pacEl.style.left = x + 'px';
    pacEl.style.top = y + 'px';
    pacEl.dataset.dir = getDirection(from, to);

    // Eat nearby dots
    const px = x + 11, py = y + 11;
    dots.forEach(d => {
      if (!d.el.classList.contains('eaten')) {
        const dist = Math.abs(d.x - px) + Math.abs(d.y - py);
        if (dist < 18) d.el.classList.add('eaten');
      }
    });

    // Eat corner label when close
    const cornerIdx = (seg + 1) % 4;
    const nearEnd = progress > 0.85;
    const nearStart = progress < 0.15;
    corners[cornerIdx]?.classList.toggle('eaten', nearEnd);
    corners[seg]?.classList.toggle('eaten', nearStart);

    progress += speed / 60;
    if (progress >= 1) {
      progress = 0;
      seg = (seg + 1) % 4;
      // Respawn dots for the segment we just finished
      dots.forEach(d => d.el.classList.remove('eaten'));
    }

    raf = requestAnimationFrame(animate);
  }

  function init() {
    buildDots();
    raf = requestAnimationFrame(animate);
  }

  // Rebuild dots on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildDots, 200);
  });

  init();
}


// ===== Initialize dual wave animation =====
const wrapper = document.querySelector(".dual-wave-wrapper");
if (wrapper) {
  const animation = new DualWaveAnimation(wrapper);
  preloadImages(".dual-wave-wrapper").then(() => {
    document.body.classList.remove("loading");
    initPixelNoise();
    animation.init();
    initHeroAnimation();
    initDescReveal();
    initProjectLinks();
    initPacMan();
  });
}
