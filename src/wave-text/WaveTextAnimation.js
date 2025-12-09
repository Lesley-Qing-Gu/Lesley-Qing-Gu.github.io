import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export class WaveTextAnimation {
  constructor(container, options = {}) {
    // Accept element directly instead of selector
    this.container = container instanceof Element ? container : document.querySelector(container);
    this.texts = [];
    this.scrollTrigger = null;
    this.quickSetters = [];
    this.range = { minX: 0, maxX: 0 };

    this.config = {
      waveNumber: 0.5,
      waveSpeed: 1,
      ...options,
    };
  }

  init() {
    if (!this.container) {
      console.warn('Container not found');
      return;
    }

    this.setupResponsiveAnimation();
  }

  setupResponsiveAnimation() {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
      },
      () => {
        this.texts = gsap.utils.toArray('.animated-text');

        if (this.texts.length === 0) return;

        // Calculate range dynamically based on container width
        const maxTextWidth = Math.max(...this.texts.map((t) => t.offsetWidth));

        this.range = {
          minX: 0,
          maxX: this.container.offsetWidth - maxTextWidth,
        };

        this.createQuickSetters();
        this.setInitialPositions();
        this.setupScrollTrigger();
      }
    );
  }

  createQuickSetters() {
    this.quickSetters = this.texts.map((text) => gsap.quickTo(text, 'x', { duration: 0.6, ease: 'power4.out' }));
  }

  setInitialPositions() {
    const rangeSize = this.range.maxX - this.range.minX;

    this.texts.forEach((text, index) => {
      const initialPhase = this.config.waveNumber * index + 0 - Math.PI / 2;
      const initialWave = Math.sin(initialPhase);
      const initialProgress = (initialWave + 1) / 2;
      const startX = this.range.minX + initialProgress * rangeSize;

      gsap.set(text, { x: startX });
    });
  }

  setupScrollTrigger() {
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
      onUpdate: (self) => this.handleScroll(self),
    });
  }

  handleScroll(self) {
    const globalProgress = self.progress;
    const rangeSize = this.range.maxX - this.range.minX;

    const closestIndex = this.findClosestToViewportCenter();

    this.texts.forEach((text, index) => {
      const finalX = this.calculateWavePosition(index, globalProgress, this.range.minX, rangeSize);

      this.quickSetters[index](finalX);

      if (index === closestIndex) {
        text.classList.add('focused');
      } else {
        text.classList.remove('focused');
      }
    });
  }

  calculateWavePosition(index, globalProgress, minX, range) {
    const phase = this.config.waveNumber * index + this.config.waveSpeed * globalProgress * Math.PI * 2 - Math.PI / 2;
    const wave = Math.sin(phase);
    const cycleProgress = (wave + 1) / 2;
    return minX + cycleProgress * range;
  }

  findClosestToViewportCenter() {
    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    this.texts.forEach((text, index) => {
      const rect = text.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.abs(elementCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  destroy() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    this.quickSetters = [];
  }
}
