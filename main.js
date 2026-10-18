/**
 * BJ DESIGNS — 3D Perspective Tunnel Portfolio
 * Faithful 3D perspective slideshow architecture
 */

// 9 Uploaded Projects from public/assets/images
const CARDS_DATA = [
  {
    id: '01',
    name: 'Club Flyer',
    title: 'Club Flyer',
    category: 'Event & Visual Design',
    slug: 'club-flyer',
    image: '/assets/images/CLUB-FLYER.png',
    url: '#',
    desc: 'Dynamic event flyer design featuring bold typography, high-impact contrast, and vibrant club atmosphere.'
  },
  {
    id: '02',
    name: 'Neat Stylin',
    title: 'Neat Stylin',
    category: 'Brand & Promotional Flyer',
    slug: 'neat-stylin',
    image: '/assets/images/NEAT-STYLIN-FLYER-DESIGN.png',
    url: '#',
    desc: 'Clean, stylish promotional identity and flyer design tailored for contemporary lifestyle and grooming branding.'
  },
  {
    id: '03',
    name: 'Merdiv Flier',
    title: 'Merdiv Flier',
    category: 'Print & Campaign Design',
    slug: 'merdiv-flier',
    image: '/assets/images/merdiv-flier-design.png',
    url: '#',
    desc: 'Sophisticated print campaign and flyer architecture balancing modern typography with compelling visual flow.'
  },
  {
    id: '04',
    name: 'Pharmacy Leaflet',
    title: 'Pharmacy Leaflet',
    category: 'Publication & Informational Design',
    slug: 'pharmacy-leaflet',
    image: '/assets/images/pharmacy-leaflet.png',
    url: '#',
    desc: 'Structured editorial and medical layout design crafted for clear communication, clarity, and trust.'
  },
  {
    id: '05',
    name: 'SU Flyer Design',
    title: 'SU Flyer Design',
    category: 'Event Identity & Direction',
    slug: 'su-flyer',
    image: '/assets/images/SU-new-fkyer-design-2.png',
    url: '#',
    desc: 'High-energy event flyer design showcasing layered visual hierarchy, rhythmic typography, and bespoke curation.'
  },
  {
    id: '06',
    name: 'Mell Creative',
    title: 'Mell Creative',
    category: 'Brand Identity & Direction',
    slug: 'mell',
    image: '/assets/images/,MELL.png',
    url: '#',
    desc: 'Modern digital curation and brand design balancing minimalist composition with bespoke creative flair.'
  },
  {
    id: '07',
    name: 'SU Identity',
    title: 'SU Identity',
    category: 'Visual Identity & Emblem',
    slug: 'su-identity',
    image: '/assets/images/SU-BLACK-BG.png',
    url: '#',
    desc: 'Minimalist brand mark and icon design set against deep black background with crisp visual focus.'
  },
  {
    id: '08',
    name: 'LME Logo Design',
    title: 'LME Logo Design',
    category: 'Brand Identity & Emblem',
    slug: 'lme-logo',
    image: '/assets/images/LME Logo Design.png',
    url: '#',
    desc: 'Bespoke luxury brand mark and embossed gold emblem design crafted for Little Miss Everything.'
  },
  {
    id: '09',
    name: 'Sunday Baddies',
    title: 'Sunday Baddies',
    category: 'Event & Visual Direction',
    slug: 'sunday-baddies',
    image: '/assets/images/Club Flyer.png',
    url: '#',
    desc: 'High-energy nightlife promotional design blending neon typography, organic textures, and club culture aesthetics.'
  }
];

/**
 * TechArchiveAnimator — Interactive Typewriter Engine & Micro-Motions
 * Handles realistic "write-up" animations for tech archive cards with zero CLS layout stability,
 * digital number scramble and lock-in, and human-like typing cadence.
 */
class TechArchiveAnimator {
  constructor(archiveSection) {
    this.archiveSection = archiveSection || document.getElementById('archive-section');
    this.listContainer = document.getElementById('tech-archive-list');
    if (!this.listContainer) return;

    this.cards = Array.from(this.listContainer.querySelectorAll('.tech-card'));
    this.cardStates = new Map();
    this.observer = null;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    if (this.cards.length === 0) return;

    // Enable CSS progressive enhancement
    this.listContainer.classList.add('tech-archive-ready');

    this.cards.forEach((card, index) => {
      const numEl = card.querySelector('.tech-card-num');
      const titleEl = card.querySelector('.tech-card-title');
      const descEl = card.querySelector('.tech-card-desc');
      const actionEl = card.querySelector('.tech-card-action');

      const originalNum = numEl ? numEl.textContent.trim() : `0${index + 1}`;
      const originalTitle = titleEl ? titleEl.textContent.trim() : '';
      const originalDesc = descEl ? descEl.textContent.trim() : '';

      // Initialize number structure with brackets: [ 01 ]
      if (numEl) {
        numEl.innerHTML = `<span class="num-bracket">[</span><span class="num-digits">${originalNum}</span><span class="num-bracket">]</span>`;
      }

      // Initialize title with zero-CLS dual span structure
      if (titleEl) {
        titleEl.innerHTML = `<span class="type-visible"></span><span class="tech-type-cursor" aria-hidden="true"></span><span class="type-ghost">${originalTitle}</span>`;
      }

      // Initialize description with zero-CLS dual span structure
      if (descEl) {
        descEl.innerHTML = `<span class="type-visible"></span><span class="tech-type-cursor desc-cursor" aria-hidden="true" style="display:none;"></span><span class="type-ghost">${originalDesc}</span>`;
      }

      this.cardStates.set(card, {
        index,
        numEl,
        titleEl,
        descEl,
        actionEl,
        originalNum,
        originalTitle,
        originalDesc,
        isAnimating: false,
        isCompleted: false,
        timeouts: [],
        intervals: []
      });

      // Ambient dynamic cursor lighting effect
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });

    this.setupObserver();
  }

  setupObserver() {
    if (this.isReducedMotion) {
      this.cards.forEach(card => this.completeCardImmediately(card));
      return;
    }

    // Observe elements entering and exiting the scrollport of archiveSection
    const options = {
      root: this.archiveSection,
      rootMargin: '0px 0px -4% 0px',
      threshold: [0, 0.15]
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const card = entry.target;
        const state = this.cardStates.get(card);
        if (!state) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          if (!state.isCompleted && !state.isAnimating) {
            this.animateCard(card);
          }
        } else if (!entry.isIntersecting || entry.intersectionRatio === 0) {
          // Whenever the card is no longer showing on the screen, reset so it reloads upon returning
          this.resetCard(card);
        }
      });
    }, options);

    this.cards.forEach(card => this.observer.observe(card));

    // Also observe the entire tech-archive-section container to reload all cards when section leaves view
    const techSection = document.getElementById('tech-archive-section');
    if (techSection) {
      this.sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting || entry.intersectionRatio === 0) {
            this.resetCards();
          }
        });
      }, {
        root: this.archiveSection,
        threshold: 0
      });
      this.sectionObserver.observe(techSection);
    }
  }

  animateCard(card) {
    const state = this.cardStates.get(card);
    if (!state || state.isAnimating || state.isCompleted) return;

    state.isAnimating = true;
    card.classList.add('writing-started');

    const numDigitsEl = state.numEl ? state.numEl.querySelector('.num-digits') : null;
    const titleVisible = state.titleEl.querySelector('.type-visible');
    const titleGhost = state.titleEl.querySelector('.type-ghost');
    const titleCursor = state.titleEl.querySelector('.tech-type-cursor');

    const descVisible = state.descEl.querySelector('.type-visible');
    const descGhost = state.descEl.querySelector('.type-ghost');
    const descCursor = state.descEl.querySelector('.tech-type-cursor');

    // 1. Digital Number Scramble & Power-on Sequence (~180ms)
    const scramblePool = ['0', '1', '2', '3', '7', '8', '9', 'X', '_', '·'];
    let scrambles = 0;
    const maxScrambles = 6;

    const intervalId = setInterval(() => {
      scrambles++;
      if (numDigitsEl) {
        const char = scramblePool[Math.floor(Math.random() * scramblePool.length)];
        numDigitsEl.textContent = `0${char}`;
      }

      if (scrambles >= maxScrambles) {
        clearInterval(intervalId);
        if (numDigitsEl) {
          numDigitsEl.textContent = state.originalNum;
          numDigitsEl.classList.add('num-locked');
        }

        // 2. Title Write-Up Animation (starts directly as number locks in)
        if (titleCursor) titleCursor.style.display = 'inline-block';
        this.typewriteText({
          fullText: state.originalTitle,
          visibleEl: titleVisible,
          ghostEl: titleGhost,
          cursorEl: titleCursor,
          speed: 26,
          state,
          onComplete: () => {
            if (titleCursor) titleCursor.style.display = 'none';

            // 3. Pause of 110ms then start Description Write-Up
            const tDesc = setTimeout(() => {
              if (descCursor) {
                descCursor.style.display = 'inline-block';
                descCursor.style.opacity = '1';
              }

              this.typewriteText({
                fullText: state.originalDesc,
                visibleEl: descVisible,
                ghostEl: descGhost,
                cursorEl: descCursor,
                speed: 11,
                humanVariance: true,
                state,
                onComplete: () => {
                  state.isAnimating = false;
                  state.isCompleted = true;
                  card.classList.add('writing-done');

                  // Graceful cursor fade
                  const tFade = setTimeout(() => {
                    if (descCursor) {
                      descCursor.style.opacity = '0';
                      const tHide = setTimeout(() => {
                        descCursor.style.display = 'none';
                      }, 400);
                      state.timeouts.push(tHide);
                    }
                  }, 650);
                  state.timeouts.push(tFade);
                }
              });
            }, 110);
            state.timeouts.push(tDesc);
          }
        });
      }
    }, 28);

    state.intervals.push(intervalId);
  }

  typewriteText({ fullText, visibleEl, ghostEl, cursorEl, speed = 20, humanVariance = false, state, onComplete }) {
    let charIndex = 0;
    const totalChars = fullText.length;

    if (cursorEl) {
      cursorEl.classList.add('is-typing');
    }

    const typeStep = () => {
      if (!state.isAnimating && !state.isCompleted) return;

      if (charIndex < totalChars) {
        charIndex++;
        visibleEl.textContent = fullText.substring(0, charIndex);
        ghostEl.textContent = fullText.substring(charIndex);

        let delay = speed;
        if (humanVariance) {
          const char = fullText[charIndex - 1];
          if (char === '.' || char === '!' || char === '?') {
            delay = speed + 80;
          } else if (char === ',' || char === ';') {
            delay = speed + 40;
          } else if (char === ' ') {
            delay = speed + 14;
          } else {
            delay = speed + (Math.random() * 8 - 4);
          }
        }

        const t = setTimeout(typeStep, Math.max(5, delay));
        state.timeouts.push(t);
      } else {
        if (cursorEl) {
          cursorEl.classList.remove('is-typing');
        }
        if (onComplete) onComplete();
      }
    };

    typeStep();
  }

  completeCardImmediately(card) {
    const state = this.cardStates.get(card);
    if (!state) return;

    state.isCompleted = true;
    state.isAnimating = false;
    card.classList.add('writing-started', 'writing-done');

    const numDigitsEl = state.numEl ? state.numEl.querySelector('.num-digits') : null;
    if (numDigitsEl) {
      numDigitsEl.textContent = state.originalNum;
      numDigitsEl.classList.add('num-locked');
    }

    const titleVisible = state.titleEl.querySelector('.type-visible');
    const titleGhost = state.titleEl.querySelector('.type-ghost');
    const titleCursor = state.titleEl.querySelector('.tech-type-cursor');
    if (titleVisible) titleVisible.textContent = state.originalTitle;
    if (titleGhost) titleGhost.textContent = '';
    if (titleCursor) titleCursor.style.display = 'none';

    const descVisible = state.descEl.querySelector('.type-visible');
    const descGhost = state.descEl.querySelector('.type-ghost');
    const descCursor = state.descEl.querySelector('.tech-type-cursor');
    if (descVisible) descVisible.textContent = state.originalDesc;
    if (descGhost) descGhost.textContent = '';
    if (descCursor) descCursor.style.display = 'none';
  }

  resetCard(card) {
    const state = this.cardStates.get(card);
    if (!state) return;

    state.timeouts.forEach(t => clearTimeout(t));
    state.timeouts = [];
    state.intervals.forEach(i => clearInterval(i));
    state.intervals = [];

    state.isAnimating = false;
    state.isCompleted = false;
    card.classList.remove('writing-started', 'writing-done');

    const numDigitsEl = state.numEl ? state.numEl.querySelector('.num-digits') : null;
    if (numDigitsEl) {
      numDigitsEl.textContent = state.originalNum;
      numDigitsEl.classList.remove('num-locked');
    }

    const titleVisible = state.titleEl.querySelector('.type-visible');
    const titleGhost = state.titleEl.querySelector('.type-ghost');
    const titleCursor = state.titleEl.querySelector('.tech-type-cursor');
    if (titleVisible) titleVisible.textContent = '';
    if (titleGhost) titleGhost.textContent = state.originalTitle;
    if (titleCursor) {
      titleCursor.style.display = 'inline-block';
      titleCursor.style.opacity = '1';
      titleCursor.classList.remove('is-typing');
    }

    const descVisible = state.descEl.querySelector('.type-visible');
    const descGhost = state.descEl.querySelector('.type-ghost');
    const descCursor = state.descEl.querySelector('.tech-type-cursor');
    if (descVisible) descVisible.textContent = '';
    if (descGhost) descGhost.textContent = state.originalDesc;
    if (descCursor) {
      descCursor.style.display = 'none';
      descCursor.style.opacity = '1';
      descCursor.classList.remove('is-typing');
    }
  }

  resetCards() {
    this.cards.forEach(card => this.resetCard(card));
  }

  onArchiveOpened() {
    setTimeout(() => {
      this.cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInView) {
          const state = this.cardStates.get(card);
          if (state && !state.isCompleted && !state.isAnimating) {
            this.animateCard(card);
          }
        }
      });
    }, 420);
  }

  onArchiveClosed() {
    this.resetCards();
  }
}

/**
 * ArchiveMobileSpotlight — Mobile-Only Scroll-Focus & Cross-Fade Engine
 * When in mobile view, detects the archive picture closest to the viewport center.
 * The centered picture stands in full focus and brilliance, while adjacent pictures
 * softly fade away. As user scrolls, pictures smoothly cross-fade.
 */
class ArchiveMobileSpotlight {
  constructor(archiveSection) {
    this.archiveSection = archiveSection || document.getElementById('archive-section');
    this.grid = document.getElementById('archive-grid');
    if (!this.archiveSection || !this.grid) return;

    this.cards = Array.from(this.grid.querySelectorAll('.archive-card'));
    if (this.cards.length === 0) return;

    this.isMobile = window.matchMedia('(max-width: 809px)').matches;
    this.ticking = false;
    this.currentFocusedCard = null;

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);

    this.init();
  }

  init() {
    this.updateMobileState();

    this.archiveSection.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    // Tapping a faded card smoothly scrolls it into the center
    this.cards.forEach(card => {
      card.addEventListener('click', () => {
        if (!this.isMobile) return;
        if (!card.classList.contains('is-in-focus')) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  updateMobileState() {
    this.isMobile = window.matchMedia('(max-width: 809px)').matches;
    if (this.isMobile) {
      this.grid.classList.add('mobile-spotlight-active');
      this.updateFocus();
    } else {
      this.grid.classList.remove('mobile-spotlight-active');
      this.clearFocus();
    }
  }

  onResize() {
    this.updateMobileState();
  }

  onScroll() {
    if (!this.isMobile) return;
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateFocus();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  updateFocus() {
    if (!this.isMobile || this.cards.length === 0) return;

    const containerRect = this.archiveSection.getBoundingClientRect();
    const viewportCenter = containerRect.top + containerRect.height * 0.48;

    let closestCard = null;
    let minDistance = Infinity;

    // Near the top of the archive gallery, guarantee first card is focused
    if (this.archiveSection.scrollTop < 60) {
      closestCard = this.cards[0];
    } else {
      for (let i = 0; i < this.cards.length; i++) {
        const card = this.cards[i];
        const imgWrapper = card.querySelector('.archive-image-wrapper') || card;
        const rect = imgWrapper.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      }
    }

    if (closestCard && closestCard !== this.currentFocusedCard) {
      this.cards.forEach(card => card.classList.remove('is-in-focus'));
      closestCard.classList.add('is-in-focus');
      this.currentFocusedCard = closestCard;
    }
  }

  clearFocus() {
    this.cards.forEach(card => card.classList.remove('is-in-focus'));
    this.currentFocusedCard = null;
  }

  onArchiveOpened() {
    this.updateMobileState();
    if (this.isMobile) {
      setTimeout(() => this.updateFocus(), 80);
    }
  }
}

// =========================================================
// FRAMER CHARACTER TEXT REVEAL ENGINE
// =========================================================
class FramerTextReveal {
  constructor() {
    this.items = [];
    this.observer = null;
    this.init();
  }

  init() {
    const targets = [
      { selector: '.about-philosophy-text', startDelay: 0.18, stagger: 0.018 }
    ];

    targets.forEach(cfg => {
      const el = document.querySelector(cfg.selector);
      if (!el) return;
      this.tokenize(el, cfg.startDelay, cfg.stagger);
      this.items.push({ el, cfg });
    });

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('framer-revealed');
          } else {
            entry.target.classList.remove('framer-revealed');
          }
        });
      }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.05
      });

      this.items.forEach(item => {
        this.observer.observe(item.el);
      });
    } else {
      this.items.forEach(item => item.el.classList.add('framer-revealed'));
    }
  }

  tokenize(el, startDelay, stagger) {
    const rawText = el.textContent.trim();
    if (!rawText) return;
    el.innerHTML = '';
    el.classList.add('framer-split-container');

    const words = rawText.split(/\s+/);
    let charCount = 0;

    words.forEach((word, wIdx) => {
      const wordWrap = document.createElement('span');
      wordWrap.className = 'framer-char-word';

      for (let i = 0; i < word.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.className = 'framer-char';
        charSpan.textContent = word[i];
        const delay = (startDelay + charCount * stagger).toFixed(3);
        charSpan.style.setProperty('--char-delay', `${delay}s`);
        wordWrap.appendChild(charSpan);
        charCount++;
      }

      el.appendChild(wordWrap);

      if (wIdx < words.length - 1) {
        const spaceNode = document.createTextNode(' ');
        el.appendChild(spaceNode);
      }
    });
  }

  trigger(viewName) {
    this.items.forEach(item => {
      const parentSection = item.el.closest('.about-section, .contact-section');
      if (parentSection && parentSection.id.includes(viewName)) {
        item.el.classList.remove('framer-revealed');
        void item.el.offsetWidth;
        setTimeout(() => {
          item.el.classList.add('framer-revealed');
        }, 60);
      }
    });
  }
}

// =========================================================
// TALK CARD DYNAMIC RADIAL SPOTLIGHT & 3D TILT
// =========================================================
class TalkCardSpotlight {
  constructor() {
    this.cards = document.querySelectorAll('.talk-card');
    if (this.cards.length === 0) return;
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--spot-x', `${x.toFixed(1)}px`);
        card.style.setProperty('--spot-y', `${y.toFixed(1)}px`);

        // Subtle luxury 3D perspective tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = ((y - centerY) / centerY) * -4.5;
        const tiltY = ((x - centerX) / centerX) * 4.5;
        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--spot-x', '50%');
        card.style.setProperty('--spot-y', '50%');
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }
}

// =========================================================
// ABOUT SECTION SCROLL MOTIONS & VIEWPORT PARALLAX
// =========================================================
class AboutScrollMotion {
  constructor(aboutSection) {
    this.aboutSection = aboutSection || document.getElementById('about-section');
    if (!this.aboutSection) return;

    this.progressBar = document.getElementById('about-scroll-bar');
    this.headline = this.aboutSection.querySelector('.about-hero-headline');
    this.heroImage = this.aboutSection.querySelector('.about-hero-image');
    this.heroImageWrap = this.aboutSection.querySelector('.about-hero-image-wrap');
    this.revealElements = Array.from(this.aboutSection.querySelectorAll('.scroll-reveal, .about-service-row, .talk-card'));

    this.isTicking = false;
    this.observer = null;

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.bindScroll();
  }

  setupIntersectionObserver() {
    const options = {
      root: this.aboutSection,
      rootMargin: '0px 0px -5% 0px',
      threshold: [0, 0.08, 0.2]
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.08) {
          entry.target.classList.add('is-in-view');
        } else if (!entry.isIntersecting || entry.intersectionRatio === 0) {
          entry.target.classList.remove('is-in-view');
        }
      });
    }, options);

    this.revealElements.forEach(el => {
      this.observer.observe(el);
    });
  }

  bindScroll() {
    this.aboutSection.addEventListener('scroll', () => {
      if (!this.isTicking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          this.isTicking = false;
        });
        this.isTicking = true;
      }
    }, { passive: true });
  }

  handleScroll() {
    const scrollTop = this.aboutSection.scrollTop;
    const maxScroll = this.aboutSection.scrollHeight - this.aboutSection.clientHeight;

    // 1. Dynamic Minimalist Scroll Progress Bar
    if (this.progressBar && maxScroll > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      this.progressBar.style.width = `${progress.toFixed(1)}%`;
    }

    // 2. Parallax Motion on Hero Elements
    if (scrollTop < 850) {
      if (this.headline) {
        const headlineY = scrollTop * -0.22;
        const opacity = Math.max(0, 1 - scrollTop / 420);
        this.headline.style.transform = `translateY(${headlineY.toFixed(1)}px)`;
        this.headline.style.opacity = opacity.toFixed(3);
      }

      if (this.heroImage) {
        const imgY = scrollTop * 0.15;
        const imgScale = 1 + scrollTop * 0.00015;
        this.heroImage.style.transform = `translateY(${imgY.toFixed(1)}px) scale(${imgScale.toFixed(4)})`;
      }
    }
  }

  onAboutOpened() {
    // Check initial visible elements in the viewport on open
    setTimeout(() => {
      this.revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
          el.classList.add('is-in-view');
        }
      });
    }, 120);
  }

  reset() {
    this.revealElements.forEach(el => {
      el.classList.remove('is-in-view');
    });

    if (this.progressBar) this.progressBar.style.width = '0%';
    if (this.headline) {
      this.headline.style.transform = '';
      this.headline.style.opacity = '';
    }
    if (this.heroImage) {
      this.heroImage.style.transform = '';
    }
  }
}

// =========================================================
// CONTACT SECTION SCROLL MOTIONS & VIEWPORT PARALLAX
// =========================================================
class ContactScrollMotion {
  constructor(contactSection) {
    this.contactSection = contactSection || document.getElementById('contact-section');
    if (!this.contactSection) return;

    this.progressBar = document.getElementById('contact-scroll-bar');
    this.giantTitle = this.contactSection.querySelector('.contact-giant-title');
    this.introText = this.contactSection.querySelector('.contact-intro-text');
    this.showcaseImage = this.contactSection.querySelector('.contact-showcase-img');
    this.showcaseWrap = this.contactSection.querySelector('.contact-showcase-wrap');
    this.revealElements = Array.from(this.contactSection.querySelectorAll('.scroll-reveal, .contact-info-row'));

    this.isTicking = false;
    this.observer = null;

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.bindScroll();
  }

  setupIntersectionObserver() {
    const options = {
      root: this.contactSection,
      rootMargin: '0px 0px -5% 0px',
      threshold: [0, 0.08, 0.2]
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.08) {
          entry.target.classList.add('is-in-view');
        } else if (!entry.isIntersecting || entry.intersectionRatio === 0) {
          entry.target.classList.remove('is-in-view');
        }
      });
    }, options);

    this.revealElements.forEach(el => {
      this.observer.observe(el);
    });
  }

  bindScroll() {
    this.contactSection.addEventListener('scroll', () => {
      if (!this.isTicking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          this.isTicking = false;
        });
        this.isTicking = true;
      }
    }, { passive: true });
  }

  handleScroll() {
    const scrollTop = this.contactSection.scrollTop;
    const maxScroll = this.contactSection.scrollHeight - this.contactSection.clientHeight;

    // Ambient Minimalist Scroll Progress Bar
    if (this.progressBar && maxScroll > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      this.progressBar.style.width = `${progress.toFixed(1)}%`;
    }

    // Parallax Motion matching About section
    if (scrollTop < 850) {
      if (this.giantTitle) {
        const titleY = scrollTop * -0.22;
        const opacity = Math.max(0, 1 - scrollTop / 420);
        this.giantTitle.style.transform = `translateY(${titleY.toFixed(1)}px)`;
        this.giantTitle.style.opacity = opacity.toFixed(3);
      }

      if (this.showcaseImage) {
        const imgY = scrollTop * 0.12;
        const imgScale = 1 + scrollTop * 0.00012;
        this.showcaseImage.style.transform = `translateY(${imgY.toFixed(1)}px) scale(${imgScale.toFixed(4)})`;
      }
    }
  }

  onContactOpened() {
    setTimeout(() => {
      this.revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
          el.classList.add('is-in-view');
        }
      });
    }, 120);
  }

  reset() {
    this.revealElements.forEach(el => {
      el.classList.remove('is-in-view');
    });

    if (this.progressBar) this.progressBar.style.width = '0%';
    if (this.giantTitle) {
      this.giantTitle.style.transform = '';
      this.giantTitle.style.opacity = '';
    }
    if (this.showcaseImage) {
      this.showcaseImage.style.transform = '';
    }
  }
}

// =========================================================
// PRIVACY POLICY MODAL CONTROLLER
// =========================================================
class PrivacyModalHandler {
  constructor() {
    this.backdrop = document.getElementById('privacy-modal-backdrop');
    this.closeBtn = document.getElementById('privacy-modal-close');
    this.ackBtn = document.getElementById('privacy-modal-ack-btn');
    this.triggers = document.querySelectorAll('.privacy-modal-trigger-btn, .privacy-link');

    if (!this.backdrop) return;
    this.init();
  }

  init() {
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.open();
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.ackBtn) {
      this.ackBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click outside card closes modal
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });

    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.backdrop.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  open() {
    this.backdrop.classList.add('is-open');
    this.backdrop.setAttribute('aria-hidden', 'false');
    if (this.closeBtn) {
      this.closeBtn.focus();
    }
  }

  close() {
    this.backdrop.classList.remove('is-open');
    this.backdrop.setAttribute('aria-hidden', 'true');
  }
}

// =========================================================
// CONTACT FORM HANDLER - DIRECT EMAIL DISPATCH
// =========================================================
class ContactFormHandler {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.submitBtn = document.getElementById('contact-submit-btn');
    this.toast = document.getElementById('form-feedback-toast');
    this.recipientEmail = 'idokoonu0@gmail.com';
    if (!this.form) return;

    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  async handleSubmit() {
    const firstName = this.form.querySelector('#form-first-name')?.value.trim();
    const lastName = this.form.querySelector('#form-last-name')?.value.trim();
    const email = this.form.querySelector('#form-email')?.value.trim();
    const company = this.form.querySelector('#form-company')?.value.trim() || 'Individual / Studio';
    const message = this.form.querySelector('#form-message')?.value.trim();
    const privacy = this.form.querySelector('#form-privacy')?.checked;

    if (!firstName || !lastName || !email || !message) {
      this.showToast('Please fill in all required fields before submitting.', 'is-error');
      return;
    }

    if (!privacy) {
      this.showToast('Please accept the privacy policy to submit your enquiry.', 'is-error');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showToast('Please enter a valid email address.', 'is-error');
      return;
    }

    if (this.submitBtn) {
      this.submitBtn.classList.add('is-loading');
      this.submitBtn.disabled = true;
    }

    const payload = {
      'First Name': firstName,
      'Last Name': lastName,
      'Email': email,
      'Company': company,
      'Message': message,
      '_subject': `New BJ Designs Inquiry: ${firstName} ${lastName}`,
      '_replyto': email,
      '_template': 'table'
    };

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${this.recipientEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        if (this.submitBtn) {
          this.submitBtn.classList.remove('is-loading');
          this.submitBtn.disabled = false;
        }
        this.form.reset();
        this.showToast(`Thank you, ${firstName}! Your message has been sent directly to ${this.recipientEmail}. We will be in touch shortly.`, 'is-success');
      } else {
        throw new Error('Form submission service responded with status ' + response.status);
      }
    } catch (err) {
      // Graceful fallback: trigger native mailto so user's message is never lost
      console.warn('FormSubmit AJAX fallback:', err);
      if (this.submitBtn) {
        this.submitBtn.classList.remove('is-loading');
        this.submitBtn.disabled = false;
      }
      const mailtoUrl = `mailto:${this.recipientEmail}?subject=${encodeURIComponent(`Project Inquiry: ${firstName} ${lastName}`)}&body=${encodeURIComponent(`Name: ${firstName} ${lastName}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`)}`;
      window.open(mailtoUrl, '_blank');
      this.form.reset();
      this.showToast(`Your message draft has been opened for ${this.recipientEmail}. You can also email me directly at ${this.recipientEmail}.`, 'is-success');
    }
  }

  showToast(msg, type) {
    if (!this.toast) return;
    this.toast.textContent = msg;
    this.toast.className = `form-feedback-toast ${type}`;
    this.toast.style.display = 'block';

    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.toast.style.display = 'none';
    }, 7000);
  }
}

class BJDesignsApp {
  constructor() {
    this.sceneContainer = document.getElementById('scene-container');
    this.viewport = document.getElementById('tunnel-viewport');

    // SPA View Switcher elements
    this.mainViewport = document.getElementById('main-viewport');
    this.archiveSection = document.getElementById('archive-section');
    this.aboutSection = document.getElementById('about-section');
    this.contactSection = document.getElementById('contact-section');
    this.dockHome = document.getElementById('dock-home') || document.getElementById('dock-index');
    this.dockWorks = document.getElementById('dock-works');
    this.dockAbout = document.getElementById('dock-about');
    this.dockContact = document.getElementById('dock-contact');
    this.siteName = document.getElementById('site-name');
    this.activeView = 'home';

    // Motion Transition Curtain elements
    this.curtain = document.getElementById('page-curtain');
    this.curtainPanel = document.getElementById('curtain-panel');
    this.isTransitioning = false;
    this.hasInitialized = false;

    // 3D Engine Parameters matching Framer's exact math
    this.cards = CARDS_DATA;
    this.numOriginalCards = this.cards.length;
    // 4 full cycles for smooth seamless loop
    this.totalCardsCount = this.numOriginalCards * 4;
    this.spacing = window.innerWidth <= 809 ? 180 : 240;
    this.totalLength = this.totalCardsCount * this.spacing;

    // Movement state
    this.targetZ = 0;
    this.currentZ = 0;
    this.scrollSensitivity = 0.9;
    this.isHoveringCard = false;
    this.hoveredCardId = null;

    // Pointer Drag Tracking
    this.isDragging = false;
    this.startY = 0;
    this.lastY = 0;
    this.velocity = 0;
    this.dragDistance = 0;

    // Card DOM element array
    this.cardElements = [];

    // Tech Archive Typewriter Animator
    this.techArchiveAnimator = new TechArchiveAnimator(this.archiveSection);

    // Mobile Archive Spotlight & Cross-Fade Animator
    this.archiveMobileSpotlight = new ArchiveMobileSpotlight(this.archiveSection);

    // Framer Character Text Reveal Animator
    this.framerTextReveal = new FramerTextReveal();

    // Talk Cards Interactive Radial Spotlight
    this.talkCardSpotlight = new TalkCardSpotlight();

    // Contact Form Handler with Direct Email
    this.contactFormHandler = new ContactFormHandler();

    // About Section Scroll Motion Engine
    this.aboutScrollMotion = new AboutScrollMotion(this.aboutSection);

    // Contact Section Scroll Motion Engine
    this.contactScrollMotion = new ContactScrollMotion(this.contactSection);

    // Privacy Policy Luxury Modal Handler
    this.privacyModalHandler = new PrivacyModalHandler();

    this.init();
  }

  init() {
    this.createCards();
    this.bindEvents();
    this.bindNavigation();
    this.startLoop();
  }

  // =========================================================
  // CARD GENERATION / HYDRATION
  // =========================================================
  createCards() {
    // If cards were pre-rendered into HTML (SSR), hydrate them
    const existingCards = this.sceneContainer.querySelectorAll('.tunnel-card');
    if (existingCards.length === this.totalCardsCount) {
      this.cardElements = [];
      existingCards.forEach((card, i) => {
        const cardData = this.cards[i % this.numOriginalCards];
        card.addEventListener('mouseenter', () => {
          this.isHoveringCard = true;
          this.hoveredCardId = i;
        });

        card.addEventListener('mouseleave', () => {
          this.isHoveringCard = false;
          this.hoveredCardId = null;
        });

        card.addEventListener('click', (e) => {
          e.preventDefault();
          if (this.dragDistance > 8) return;
          this.goToArchive(cardData.slug);
        });

        this.cardElements.push({
          element: card,
          baseOffset: -i * this.spacing,
          index: i,
          data: cardData
        });
      });
      return;
    }

    // Dynamic fallback generation
    this.sceneContainer.innerHTML = '';
    this.cardElements = [];

    for (let i = 0; i < this.totalCardsCount; i++) {
      const cardData = this.cards[i % this.numOriginalCards];
      const card = document.createElement('div');
      card.className = 'tunnel-card';
      card.id = `card-layer-${i}`;
      card.setAttribute('data-card-index', i);
      card.setAttribute('data-slug', cardData.slug);

      // Card link wrapper
      const link = document.createElement('a');
      link.href = '#';
      link.className = 'tunnel-card-link';
      link.setAttribute('aria-label', cardData.title);

      // Card image
      const img = document.createElement('img');
      img.className = 'tunnel-card-image';
      img.src = cardData.image;
      img.alt = cardData.title;
      img.loading = i < 6 ? 'eager' : 'lazy';

      // Subtle gradient sheen
      const sheen = document.createElement('div');
      sheen.className = 'tunnel-card-sheen';

      // Hover title tag
      const hoverTag = document.createElement('div');
      hoverTag.className = 'card-hover-tag';
      hoverTag.textContent = cardData.title;

      link.appendChild(img);
      link.appendChild(sheen);
      link.appendChild(hoverTag);
      card.appendChild(link);

      // Hover listeners
      card.addEventListener('mouseenter', () => {
        this.isHoveringCard = true;
        this.hoveredCardId = i;
      });

      card.addEventListener('mouseleave', () => {
        this.isHoveringCard = false;
        this.hoveredCardId = null;
      });

      // Click navigates straight to Archive section
      card.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.dragDistance > 8) return;
        this.goToArchive(cardData.slug);
      });

      this.sceneContainer.appendChild(card);
      this.cardElements.push({
        element: card,
        baseOffset: -i * this.spacing,
        index: i,
        data: cardData
      });
    }
  }

  // =========================================================
  // EVENT LISTENERS
  // =========================================================
  bindEvents() {
    // Wheel event (glides through Z-space seamlessly)
    window.addEventListener('wheel', (e) => {
      if (this.activeView === 'archive') return; // Allow natural scrolling in archive section
      e.preventDefault();
      const factor = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const delta = e.deltaY * factor * this.scrollSensitivity;
      this.targetZ += delta;
    }, { passive: false });

    // Pointer events for desktop drag and mobile swipe
    const onPointerDown = (e) => {
      // Ignore clicks on archive section or fixed UI navigation
      if (
        this.activeView === 'archive' ||
        e.target.closest('#archive-section') ||
        e.target.closest('#top-bar') ||
        e.target.closest('#bottom-dock-container')
      ) {
        return;
      }
      this.isDragging = true;
      this.startY = e.clientY;
      this.lastY = e.clientY;
      this.velocity = 0;
      this.dragDistance = 0;
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const currentY = e.clientY;
      const deltaY = currentY - this.lastY;
      this.lastY = currentY;
      this.velocity = deltaY;
      this.dragDistance += Math.abs(deltaY);
      this.targetZ -= deltaY * 2.8;
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Window resize
    window.addEventListener('resize', () => {
      this.spacing = window.innerWidth <= 809 ? 180 : 240;
      this.totalLength = this.totalCardsCount * this.spacing;
      this.cardElements.forEach((item, idx) => {
        item.baseOffset = -idx * this.spacing;
      });
    });

    // Keyboard Arrow Keys navigation
    window.addEventListener('keydown', (e) => {
      if (this.activeView === 'archive') return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        this.targetZ += 240;
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        this.targetZ -= 240;
      }
    });
  }

  // =========================================================
  // VIEW NAVIGATION & ARCHIVE ROUTING
  // =========================================================
  bindNavigation() {
    // Dock item clicks
    if (this.dockWorks) {
      this.dockWorks.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('archive');
      });
    }

    if (this.dockHome) {
      this.dockHome.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('home');
      });
    }

    if (this.dockAbout) {
      this.dockAbout.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('about');
      });
    }

    if (this.dockContact) {
      this.dockContact.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('contact');
      });
    }

    // Top bar site logo "BJ" returns to home view
    if (this.siteName) {
      this.siteName.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('home');
      });
    }

    // Handle hash change for browser back/forward buttons
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });

    // Check initial URL hash on load
    this.handleHashChange(true);
    this.hasInitialized = true;
  }

  handleHashChange(isInitial = false) {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#archive' || hash === '#works' || hash === '#tech-archive') {
      this.switchView('archive', false, null, isInitial);
      if (hash === '#tech-archive') {
        setTimeout(() => {
          const techSec = document.getElementById('tech-archive-section');
          if (techSec) techSec.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    } else if (hash === '#about') {
      this.switchView('about', false, null, isInitial);
    } else if (hash === '#contact') {
      this.switchView('contact', false, null, isInitial);
    } else if (hash === '#privacy') {
      this.switchView('contact', false, null, isInitial);
      setTimeout(() => {
        if (this.privacyModalHandler) this.privacyModalHandler.open();
      }, 250);
    } else {
      // Default to 'home' (#home, #index, or empty)
      this.switchView('home', false, null, isInitial);
    }
  }

  switchView(viewName, updateHash = true, targetSlug = null, isInitial = false) {
    if (this.isTransitioning) return;
    if (this.hasInitialized && viewName === this.activeView) {
      if (viewName === 'archive' && targetSlug) {
        this.scrollToArchiveCard(targetSlug);
      } else {
        this.replayCurrentViewTransitions(viewName);
      }
      return;
    }

    const previousView = this.activeView;
    const isForward = viewName !== 'home' && viewName !== 'index';

    // 1. Reset leaving view's motion states
    const resetMotionStates = () => {
      this.onViewLeave(previousView);
      if (this.aboutSection) this.aboutSection.classList.remove('motion-ready');
      if (this.contactSection) this.contactSection.classList.remove('motion-ready');
      if (this.archiveSection) this.archiveSection.classList.remove('motion-ready');
    };

    // 2. DOM Layout update (called while curtain fully covers screen)
    const domUpdate = () => {
      this.activeView = viewName;
      resetMotionStates();

      // Hide all views first
      if (this.mainViewport) this.mainViewport.classList.add('view-hidden');
      if (this.archiveSection) this.archiveSection.classList.remove('view-active');
      if (this.aboutSection) this.aboutSection.classList.remove('view-active');
      if (this.contactSection) this.contactSection.classList.remove('view-active');

      // Deactivate all dock items
      if (this.dockHome) this.dockHome.classList.remove('active');
      if (this.dockWorks) this.dockWorks.classList.remove('active');
      if (this.dockAbout) this.dockAbout.classList.remove('active');
      if (this.dockContact) this.dockContact.classList.remove('active');

      if (viewName === 'archive') {
        if (this.archiveSection) {
          this.archiveSection.classList.add('view-active');
          this.archiveSection.scrollTop = 0;
          this.archiveSection.setAttribute('tabindex', '-1');
          this.archiveSection.focus({ preventScroll: true });
        }
        if (this.dockWorks) this.dockWorks.classList.add('active');

        if (updateHash && window.location.hash !== '#archive') {
          history.pushState(null, '', '#archive');
        }
      } else if (viewName === 'about') {
        if (this.aboutSection) {
          this.aboutSection.classList.add('view-active');
          this.aboutSection.scrollTop = 0;
          this.aboutSection.setAttribute('tabindex', '-1');
          this.aboutSection.focus({ preventScroll: true });
        }
        if (this.dockAbout) this.dockAbout.classList.add('active');

        if (updateHash && window.location.hash !== '#about') {
          history.pushState(null, '', '#about');
        }
      } else if (viewName === 'contact') {
        if (this.contactSection) {
          this.contactSection.classList.add('view-active');
          this.contactSection.scrollTop = 0;
          this.contactSection.setAttribute('tabindex', '-1');
          this.contactSection.focus({ preventScroll: true });
        }
        if (this.dockContact) this.dockContact.classList.add('active');

        if (updateHash && window.location.hash !== '#contact') {
          history.pushState(null, '', '#contact');
        }
      } else {
        // 'home' / 'index'
        if (this.mainViewport) {
          this.mainViewport.classList.remove('view-hidden');
          this.mainViewport.setAttribute('tabindex', '-1');
          this.mainViewport.focus({ preventScroll: true });
        }
        if (this.dockHome) this.dockHome.classList.add('active');

        if (updateHash && window.location.hash !== '#home' && window.location.hash !== '') {
          history.pushState(null, '', '#home');
        }
      }
    };

    // 3. Motion callback: Fired AFTER curtain transition finishes sweeping out and screen is clear
    const onMotionReady = () => {
      this.onViewEnter(viewName, targetSlug);
    };

    // Skip motion curtain on cold initial page load, but still defer motions gracefully
    if (isInitial || !this.curtain || !this.curtainPanel) {
      domUpdate();
      requestAnimationFrame(() => {
        setTimeout(onMotionReady, 100);
      });
      return;
    }

    // Directional sweep: 'forward' (upward) or 'backward' (downward)
    this.runCurtainTransition(isForward ? 'forward' : 'backward', domUpdate, onMotionReady);
  }

  onViewLeave(viewName) {
    if (viewName === 'about') {
      if (this.aboutSection) {
        this.aboutSection.classList.remove('motion-ready');
        const lines = this.aboutSection.querySelectorAll('.evaporate-line');
        lines.forEach(l => {
          l.style.transition = 'none';
          l.style.opacity = '0.001';
          l.style.filter = 'blur(24px)';
          l.style.transform = 'translateY(-16px) scale(1.035)';
          l.style.letterSpacing = '0.035em';
        });
      }
      if (this.aboutScrollMotion) this.aboutScrollMotion.reset();
    } else if (viewName === 'contact') {
      if (this.contactSection) {
        this.contactSection.classList.remove('motion-ready');
        const lines = this.contactSection.querySelectorAll('.evaporate-line');
        lines.forEach(l => {
          l.style.transition = 'none';
          l.style.opacity = '0.001';
          l.style.filter = 'blur(24px)';
          l.style.transform = 'translateY(-16px) scale(1.035)';
          l.style.letterSpacing = '0.035em';
        });
      }
      if (this.contactScrollMotion) this.contactScrollMotion.reset();
    } else if (viewName === 'archive') {
      if (this.archiveSection) {
        this.archiveSection.classList.remove('motion-ready');
      }
      if (this.techArchiveAnimator) this.techArchiveAnimator.onArchiveClosed();
      if (this.archiveMobileSpotlight) this.archiveMobileSpotlight.clearFocus();
    }
  }

  onViewEnter(viewName, targetSlug = null) {
    if (viewName === 'archive') {
      if (this.archiveSection) {
        this.archiveSection.classList.add('motion-ready');
        const cards = this.archiveSection.querySelectorAll('.archive-card');
        cards.forEach((c) => {
          c.style.animation = 'none';
          void c.offsetWidth;
          c.style.animation = '';
        });
      }
      if (targetSlug) {
        setTimeout(() => this.scrollToArchiveCard(targetSlug), 160);
      }
      if (this.techArchiveAnimator) {
        this.techArchiveAnimator.onArchiveOpened();
      }
      if (this.archiveMobileSpotlight) {
        this.archiveMobileSpotlight.onArchiveOpened();
      }
    } else if (viewName === 'about') {
      if (this.aboutSection) {
        this.aboutSection.classList.add('motion-ready');
        const lines = this.aboutSection.querySelectorAll('.evaporate-line');
        if (lines && lines.length > 0) {
          void this.aboutSection.offsetWidth;
          requestAnimationFrame(() => {
            lines.forEach(l => {
              l.style.transition = '';
              l.style.opacity = '';
              l.style.filter = '';
              l.style.transform = '';
              l.style.letterSpacing = '';
            });
          });
        }
      }
      if (this.framerTextReveal) {
        this.framerTextReveal.trigger('about');
      }
      if (this.aboutScrollMotion) {
        this.aboutScrollMotion.onAboutOpened();
      }
    } else if (viewName === 'contact') {
      if (this.contactSection) {
        this.contactSection.classList.add('motion-ready');
        const lines = this.contactSection.querySelectorAll('.evaporate-line');
        if (lines && lines.length > 0) {
          void this.contactSection.offsetWidth;
          requestAnimationFrame(() => {
            lines.forEach(l => {
              l.style.transition = '';
              l.style.opacity = '';
              l.style.filter = '';
              l.style.transform = '';
              l.style.letterSpacing = '';
            });
          });
        }
      }
      if (this.contactScrollMotion) {
        this.contactScrollMotion.onContactOpened();
      }
    } else {
      // 'index'
      this.currentZ -= 140;
      this.retriggerHeroAnimation();
    }
  }

  replayCurrentViewTransitions(viewName) {
    this.onViewLeave(viewName);
    if (viewName === 'about' && this.aboutSection) {
      this.aboutSection.scrollTop = 0;
    } else if (viewName === 'contact' && this.contactSection) {
      this.contactSection.scrollTop = 0;
    } else if (viewName === 'archive' && this.archiveSection) {
      this.archiveSection.scrollTop = 0;
    }
    requestAnimationFrame(() => {
      this.onViewEnter(viewName);
    });
  }

  runCurtainTransition(direction, domUpdateCallback, onMotionReadyCallback) {
    this.isTransitioning = true;
    const inClass = direction === 'forward' ? 'sweep-in-up' : 'sweep-in-down';
    const outClass = direction === 'forward' ? 'sweep-out-up' : 'sweep-out-down';

    this.curtain.classList.add('curtain-active');
    this.curtainPanel.className = `curtain-panel ${inClass} curtain-covering`;

    // Midpoint: Screen is fully covered
    setTimeout(() => {
      // Execute DOM switch (supports View Transitions API if available)
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          domUpdateCallback();
        });
      } else {
        domUpdateCallback();
      }

      // Phase 2: Sweep out revealing destination view
      this.curtainPanel.className = `curtain-panel ${outClass}`;

      setTimeout(() => {
        this.curtainPanel.className = 'curtain-panel';
        this.curtain.classList.remove('curtain-active');
        this.isTransitioning = false;

        // Curtain is completely cleared — now trigger all entrance animations and motions to ease in!
        if (onMotionReadyCallback) {
          onMotionReadyCallback();
        }
      }, 420);
    }, 380);
  }

  retriggerHeroAnimation() {
    const heroOverlay = document.getElementById('hero-overlay');
    if (heroOverlay) {
      const chars = heroOverlay.querySelectorAll('.stagger-char');
      const desc = heroOverlay.querySelector('.studio-description');

      chars.forEach((char) => {
        char.style.animation = 'none';
        void char.offsetWidth;
        char.style.animation = '';
      });

      if (desc) {
        desc.style.animation = 'none';
        void desc.offsetWidth;
        desc.style.animation = '';
      }
    }
  }

  goToArchive(slug) {
    this.switchView('archive', true, slug);
  }

  scrollToArchiveCard(slug) {
    if (!slug || !this.archiveSection) return;
    const targetCard = this.archiveSection.querySelector(`.archive-card[data-slug="${slug}"]`);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetCard.classList.add('card-highlight');
      setTimeout(() => targetCard.classList.remove('card-highlight'), 1400);
    }
  }

  // =========================================================
  // ANIMATION LOOP & 3D MATH
  // =========================================================
  startLoop() {
    const loop = () => {
      // Ambient auto-drift when user is not actively interacting and in index view
      if (this.activeView !== 'archive' && !this.isHoveringCard && !this.isDragging) {
        this.targetZ += 0.42; // ~25px/s cinematic drift
      }

      // Smooth spring dampening (approaching targetZ)
      const diff = this.targetZ - this.currentZ;
      this.currentZ += diff * 0.08;

      // Dynamic camera tilt reacting to scroll velocity (Framer exact formula: -45deg + velocity tilt)
      const scrollVelocity = diff * 0.08;
      const tiltDelta = Math.max(-5, Math.min(5, (scrollVelocity / 15) * 5));
      const currentTilt = -45 + tiltDelta;
      this.sceneContainer.style.transform = `rotateX(${currentTilt.toFixed(2)}deg) rotateY(0deg)`;

      const halfTotal = this.totalLength * 0.5;

      // Update each 3D card
      for (let i = 0; i < this.cardElements.length; i++) {
        const item = this.cardElements[i];
        const cardEl = item.element;

        // Modulo math for infinite seamless loop along Z axis
        const rawZ = item.baseOffset + this.currentZ;
        const relZ = ((rawZ % this.totalLength) + this.totalLength) % this.totalLength - halfTotal;

        // Exact Framer Math
        const absZ = Math.abs(relZ);
        const maxFocus = halfTotal * 0.5; // 2040px focusRange = 0.5

        // Scale: 0.6 at -halfTotal, 1.0 at focal center, 1.4 at front
        const scale = 0.6 + ((relZ + halfTotal) / this.totalLength) * 0.8;

        // Opacity: focusRange = 0.5 (2040px)
        let opacity = 1.0;
        if (absZ <= maxFocus) {
          opacity = 1.0 - (absZ / maxFocus) * 0.8;
        } else {
          opacity = Math.max(0.0, 0.2 * (1.0 - (absZ - maxFocus) / maxFocus));
        }

        // Blur: blurFactor = 19
        let blur = 0;
        if (absZ <= maxFocus) {
          blur = (absZ / maxFocus) * 38.0;
        } else {
          blur = 38.0 + ((absZ - maxFocus) / maxFocus) * 152.0;
        }

        // Z-Index to guarantee correct rendering order
        const isHovered = this.hoveredCardId === i;
        const zIndex = isHovered ? 999999 : Math.round(5000 + relZ * 10);

        // Hover scale & elevation enhancement (-90px in 3D coordinate space)
        const finalScale = isHovered ? scale * 1.08 : scale;
        const finalY = isHovered ? 'calc(-50% - 90px)' : '-50%';
        const finalOpacity = isHovered ? 1.0 : opacity;
        const finalBlur = isHovered || blur < 0.5 ? 'none' : `blur(${blur.toFixed(1)}px)`;

        // Apply 3D transform with hardware acceleration matching Framer's exact CSS syntax
        cardEl.style.transform = `translateX(-50%) translateY(${finalY}) translateZ(${relZ.toFixed(1)}px) scale(${finalScale.toFixed(3)})`;
        cardEl.style.opacity = finalOpacity.toFixed(3);
        cardEl.style.filter = finalBlur;
        cardEl.style.zIndex = zIndex;
        cardEl.style.boxShadow = isHovered ? '0 35px 80px rgba(0, 0, 0, 0.95)' : '0 10px 40px rgba(0, 0, 0, 0.6)';
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

// Resilient initialization whether DOM is loading or already interactive/complete
function initBJDesignsApp() {
  new BJDesignsApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBJDesignsApp);
} else {
  initBJDesignsApp();
}
