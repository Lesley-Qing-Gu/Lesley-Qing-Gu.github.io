import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export class DualWaveAnimation {
  constructor(wrapper, options = {}) {
    this.wrapper =
      wrapper instanceof Element ? wrapper : document.querySelector(wrapper);

    // Read config from data attributes
    const waveNumber = this.wrapper?.dataset.waveNumber
      ? parseFloat(this.wrapper.dataset.waveNumber)
      : 2;
    const waveSpeed = this.wrapper?.dataset.waveSpeed
      ? parseFloat(this.wrapper.dataset.waveSpeed)
      : 1;

    this.config = {
      waveNumber,
      waveSpeed,
      ...options,
    };

    this.currentImage = null;
  }

  init() {
    if (!this.wrapper) {
      console.warn("Wrapper not found");
      return;
    }

    this.leftColumn = this.wrapper.querySelector(".wave-column-left");
    this.rightColumn = this.wrapper.querySelector(".wave-column-right");

    if (!this.leftColumn || !this.rightColumn) {
      console.warn("Columns not found");
      return;
    }

    this.setupResponsiveAnimation();
  }

  setupResponsiveAnimation() {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
      },
      () => {
        // Get texts from both columns
        this.leftTexts = gsap.utils.toArray(
          this.leftColumn.querySelectorAll(".animated-text")
        );
        this.rightTexts = gsap.utils.toArray(
          this.rightColumn.querySelectorAll(".animated-text")
        );

        this.thumbnail = this.wrapper.querySelector(".image-thumbnail");

        if (this.leftTexts.length === 0 || this.rightTexts.length === 0) return;

        // Calculate ranges based on column widths minus max element width
        const maxLeftTextWidth = Math.max(
          ...this.leftTexts.map((t) => t.offsetWidth)
        );
        const maxRightTextWidth = Math.max(
          ...this.rightTexts.map((t) => t.offsetWidth)
        );

        this.leftRange = {
          minX: 0,
          maxX: this.leftColumn.offsetWidth - maxLeftTextWidth,
        };
        this.rightRange = {
          minX: 0,
          maxX: this.rightColumn.offsetWidth - maxRightTextWidth,
        };

        // Create quick setters
        this.leftQuickSetters = this.leftTexts.map((text) =>
          gsap.quickTo(text, "x", { duration: 0.6, ease: "power4.out" })
        );

        this.rightQuickSetters = this.rightTexts.map((text) =>
          gsap.quickTo(text, "x", { duration: 0.6, ease: "power4.out" })
        );

        // Set initial positions (multiplier: 1 for left, -1 for right)
        this.setInitialPositions(this.leftTexts, this.leftRange, 1);
        this.setInitialPositions(this.rightTexts, this.rightRange, -1);

        // Setup scroll trigger
        this.setupScrollTrigger();
      }
    );
  }

  setInitialPositions(texts, range, multiplier) {
    const rangeSize = range.maxX - range.minX;

    texts.forEach((text, index) => {
      const initialPhase = this.config.waveNumber * index - Math.PI / 2;
      const initialWave = Math.sin(initialPhase);
      const initialProgress = (initialWave + 1) / 2;
      const startX = (range.minX + initialProgress * rangeSize) * multiplier;

      gsap.set(text, { x: startX });
    });
  }

  setupScrollTrigger() {
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.wrapper,
      start: "top bottom",
      end: "bottom top",
      scrub: 2,
      onUpdate: (self) => this.handleScroll(self),
    });
  }

  handleScroll(self) {
    const globalProgress = self.progress;

    const closestLeftIndex = this.findClosestToViewportCenter(this.leftTexts);
    const closestRightIndex = this.findClosestToViewportCenter(this.rightTexts);

    const leftClosest = this.leftTexts[closestLeftIndex];
    const rightClosest = this.rightTexts[closestRightIndex];
    const overallClosest = this.getClosestBetweenTwo(leftClosest, rightClosest);

    // Update both columns with their respective multipliers
    this.updateColumn(
      this.leftTexts,
      this.leftQuickSetters,
      this.leftRange,
      globalProgress,
      closestLeftIndex,
      1
    );

    this.updateColumn(
      this.rightTexts,
      this.rightQuickSetters,
      this.rightRange,
      globalProgress,
      closestRightIndex,
      -1
    );

    this.updateThumbnail(this.thumbnail, overallClosest);
  }

  updateColumn(texts, setters, range, progress, focusedIndex, multiplier) {
    const rangeSize = range.maxX - range.minX;

    texts.forEach((text, index) => {
      const finalX =
        this.calculateWavePosition(index, progress, range.minX, rangeSize) *
        multiplier;

      setters[index](finalX);

      if (index === focusedIndex) {
        text.classList.add("focused");
      } else {
        text.classList.remove("focused");
      }
    });
  }

  updateThumbnail(thumbnail, focusedText) {
    if (!thumbnail || !focusedText) return;

    // Récupère l'image depuis la gauche (source unique)
    let newImage = focusedText.dataset.image;

    // Si le texte focused n'a pas d'image, cherche dans la colonne gauche avec le même index
    if (!newImage) {
      const focusedIndex = this.rightTexts.indexOf(focusedText);
      if (focusedIndex !== -1 && this.leftTexts[focusedIndex]) {
        newImage = this.leftTexts[focusedIndex].dataset.image;
      }
    }

    // Change l'image uniquement si différente
    if (newImage && this.currentImage !== newImage) {
      this.currentImage = newImage;

      thumbnail.src = newImage;
    }

    // Calcule la position pour centrer l'image avec le texte
    const textRect = focusedText.getBoundingClientRect();
    const wrapperRect = this.wrapper.getBoundingClientRect();
    const thumbnailHeight = thumbnail.offsetHeight;

    const textCenterY = textRect.top + textRect.height / 2 - wrapperRect.top;
    const targetY = textCenterY - thumbnailHeight / 2;

    // Utilise gsap.to ou crée un quickSetter
    gsap.to(thumbnail, {
      y: targetY,
      ease: "power1.out",
      duration: 0.6,
    });
  }

  getClosestBetweenTwo(text1, text2) {
    const viewportCenter = window.innerHeight / 2;

    const rect1 = text1.getBoundingClientRect();
    const center1 = rect1.top + rect1.height / 2;
    const distance1 = Math.abs(center1 - viewportCenter);

    const rect2 = text2.getBoundingClientRect();
    const center2 = rect2.top + rect2.height / 2;
    const distance2 = Math.abs(center2 - viewportCenter);

    return distance1 < distance2 ? text1 : text2;
  }

  calculateWavePosition(index, globalProgress, minX, range) {
    const phase =
      this.config.waveNumber * index +
      this.config.waveSpeed * globalProgress * Math.PI * 2 -
      Math.PI / 2;
    const wave = Math.sin(phase);
    const cycleProgress = (wave + 1) / 2;
    return minX + cycleProgress * range;
  }

  findClosestToViewportCenter(texts) {
    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    texts.forEach((text, index) => {
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
  }
}
