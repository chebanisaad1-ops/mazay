/* ============================================
   MAZAY INTERIORS - Main JavaScript
   Animations, Interactions & Utilities
   ============================================ */

'use strict';

/* ─── LOADER ─────────────────────────────────── */
const Loader = {
  init() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    const percent = loader.querySelector('.loader-percent');
    let count = 0;

    const tick = setInterval(() => {
      count += Math.floor(Math.random() * 12) + 3;
      if (count >= 100) {
        count = 100;
        clearInterval(tick);
        setTimeout(() => this.hide(loader), 400);
      }
      if (percent) percent.textContent = count + '%';
    }, 80);
  },

  hide(loader) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
};

/* ─── NAVBAR ─────────────────────────────────── */
const Navbar = {
  init() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    // Scroll behavior
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Active link highlight
    const path = window.location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('.nav-links a').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });

    // Mobile menu
    const toggle = nav.querySelector('.nav-toggle');
    const mobile = document.querySelector('.mobile-menu');
    if (toggle && mobile) {
      toggle.addEventListener('click', () => {
        mobile.classList.toggle('open');
        document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
        const spans = toggle.querySelectorAll('span');
        if (mobile.classList.contains('open')) {
          gsap.to(spans[0], { rotation: 45, y: 6, duration: 0.3 });
          gsap.to(spans[1], { opacity: 0, duration: 0.3 });
          gsap.to(spans[2], { rotation: -45, y: -6, duration: 0.3 });
        } else {
          gsap.to(spans, { rotation: 0, y: 0, opacity: 1, duration: 0.3 });
        }
      });

      mobile.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mobile.classList.remove('open');
          document.body.style.overflow = '';
          gsap.to(toggle.querySelectorAll('span'), { rotation: 0, y: 0, opacity: 1, duration: 0.3 });
        });
      });
    }
  }
};

/* ─── SCROLL REVEAL ──────────────────────────── */
const ScrollReveal = {
  init() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
  }
};

/* ─── MARQUEE ────────────────────────────────── */
const Marquee = {
  init() {
    const track = document.querySelector('.marquee-track');
    if (!track) return;
    // Duplicate items for seamless loop
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);
  }
};

/* ─── BEFORE / AFTER SLIDER ──────────────────── */
const BeforeAfter = {
  init() {
    const slider = document.querySelector('.before-after-slider');
    if (!slider) return;

    const after = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    let isDragging = false;

    const setPos = (x) => {
      const rect = slider.getBoundingClientRect();
      let pct = Math.max(5, Math.min(95, ((x - rect.left) / rect.width) * 100));
      after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + '%';
    };

    // Initial position
    setPos(slider.getBoundingClientRect().left + slider.offsetWidth / 2);

    slider.addEventListener('mousedown', e => { isDragging = true; setPos(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', e => { if (isDragging) setPos(e.clientX); });

    // Touch
    slider.addEventListener('touchstart', e => { isDragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', e => { if (isDragging) setPos(e.touches[0].clientX); }, { passive: true });
  }
};

/* ─── PORTFOLIO FILTER ───────────────────────── */
const Portfolio = {
  init() {
    const filters = document.querySelectorAll('.filter-btn');
    const grid = document.querySelector('.portfolio-grid');
    if (!filters.length || !grid) return;

    const items = Array.from(grid.children);
    items.forEach((item, i) => item.dataset.index = i);

    const restoreOrder = () => {
      const current = Array.from(grid.children);
      current.sort((a, b) => parseInt(a.dataset.index) - parseInt(b.dataset.index));
      current.forEach(el => grid.appendChild(el));
    };

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter;
        const isAll = cat === 'all';
        const current = Array.from(grid.children);

        if (isAll) {
          grid.classList.remove('filter-active');
          restoreOrder();
          current.forEach(item => {
            item.style.display = '';
            item.style.pointerEvents = 'auto';
            gsap.to(item, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
          });
        } else {
          grid.classList.add('filter-active');
          const match = [];
          const rest = [];
          current.forEach(item => {
            (item.dataset.category === cat ? match : rest).push(item);
          });
          match.forEach(el => grid.appendChild(el));
          rest.forEach(el => grid.appendChild(el));
          match.forEach(item => { item.style.display = ''; item.style.pointerEvents = 'auto'; });
          rest.forEach(item => { item.style.pointerEvents = 'none'; });
          [...match, ...rest].forEach(item => {
            const show = item.dataset.category === cat;
            gsap.to(item, {
              opacity: show ? 1 : 0,
              scale: show ? 1 : 0.96,
              duration: 0.4,
              ease: 'power2.out',
              onComplete: () => { if (!show) item.style.display = 'none'; }
            });
          });
        }
      });
    });
  }
};

/* ─── COUNTER ANIMATION ──────────────────────── */
const Counters = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const duration = 1800;
          const start = performance.now();

          const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(ease * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
          };

          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }
};

/* ─── PARTICLES ──────────────────────────────── */
const Particles = {
  init() {
    document.querySelectorAll('.particles-container').forEach(container => {
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `
          left: ${Math.random() * 100}%;
          bottom: ${Math.random() * 20}%;
          --dur: ${5 + Math.random() * 10}s;
          --delay: ${Math.random() * 8}s;
        `;
        container.appendChild(p);
      }
    });
  }
};

/* ─── PARALLAX ───────────────────────────────── */
const Parallax = {
  init() {
    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }
};

/* ─── SMOOTH SCROLL ──────────────────────────── */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
};

/* ─── CONTACT FORM ───────────────────────────── */
const ContactForm = {
  init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Floating label effect
    form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      input.addEventListener('blur', () => {
        if (!input.value) input.parentElement.classList.remove('focused');
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('.submit-btn');
      const btnText = btn.querySelector('span');
      const original = btnText.textContent;

      // Validate
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
          setTimeout(() => field.style.borderColor = '', 2000);
        }
      });

      if (!valid) return;

      // Loading state
      btnText.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate API call (replace with PHP endpoint)
      // const endpoint = form.dataset.apiEndpoint || '/api/contact.php';
      // const data = Object.fromEntries(new FormData(form));
      // const res = await fetch(endpoint, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });

      await new Promise(r => setTimeout(r, 1500)); // Remove when PHP is ready

      // Success
      btnText.textContent = 'Message Sent ✓';
      btn.style.background = '#2a6e4f';

      setTimeout(() => {
        btnText.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }
};

/* ─── GSAP HERO ANIMATIONS ───────────────────── */
const HeroAnimations = {
  init() {
    if (typeof gsap === 'undefined') return;

    // Stagger service cards on load
    gsap.utils.toArray('.service-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: i * 0.1,
        ease: 'power2.out'
      });
    });

    // Portfolio items
    gsap.utils.toArray('.portfolio-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.08,
        ease: 'power3.out'
      });
    });

    // Section title splits
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.from(title, {
        scrollTrigger: { trigger: title, start: 'top 80%' },
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out'
      });
    });
  }
};

/* ─── IMAGE HOVER ZOOM ───────────────────────── */
const ImageHover = {
  init() {
    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        item.querySelector('.portfolio-thumb')?.style.setProperty('transform', `scale(1.08) translate(${x}px, ${y}px)`);
      });

      item.addEventListener('mouseleave', () => {
        const thumb = item.querySelector('.portfolio-thumb');
        if (thumb) thumb.style.transform = '';
      });
    });
  }
};

/* ─── FLOATING NAV LOGO ANIMATION ───────────── */
const LogoFloat = {
  init() {
    const logo = document.querySelector('.nav-logo');
    if (!logo || typeof gsap === 'undefined') return;

    gsap.to(logo, {
      y: -3,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }
};

/* ─── INIT ALL ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Prevent scrolling during load
  document.body.style.overflow = 'hidden';

  Loader.init();
  Navbar.init();
  Marquee.init();
  ScrollReveal.init();
  BeforeAfter.init();
  Portfolio.init();
  Counters.init();
  Particles.init();
  SmoothScroll.init();
  ContactForm.init();

  ImageHover.init();
  Parallax.init();

  // GSAP-dependent inits (loaded via CDN)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    HeroAnimations.init();
    LogoFloat.init();
  }
});