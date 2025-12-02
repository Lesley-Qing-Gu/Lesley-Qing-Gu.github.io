import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";
import { WaveTextAnimation } from "./wave-text/WaveTextAnimation.js";
import { DualWaveAnimation } from "./dual-wave/DualWaveAnimation.js";
import { preloadImages } from "./utils.js";

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Initialize smooth scroll
ScrollSmoother.create({
  smooth: 1.5,
  effects: true,
  normalizeScroll: true,
});

// Detect current page and load appropriate animation
const page = window.location.pathname.split("/").pop() || "index.html";

if (page === "index.html" || page === "") {
  const container = document.querySelector("[data-animation='wave-text']");
  if (container) {
    const animation = new WaveTextAnimation(container);
    // Wait for all images to preload before initializing layout and scroll effects
    preloadImages("[data-animation='wave-text']").then(() => {
      document.body.classList.remove("loading"); // Remove loading state
      animation.init(); // Start layout initialization
    });
  }
} else if (page.startsWith("dual-wave")) {
  const wrapper = document.querySelector("[data-animation='dual-wave']");
  if (wrapper) {
    const animation = new DualWaveAnimation(wrapper);
    // Wait for all images to preload before initializing layout and scroll effects
    preloadImages("[data-animation='dual-wave']").then(() => {
      document.body.classList.remove("loading"); // Remove loading state
      animation.init(); // Start layout initialization
    });
  }
}
