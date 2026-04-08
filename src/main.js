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
  });
}
