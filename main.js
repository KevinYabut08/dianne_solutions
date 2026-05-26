'use strict';

// ── NAV: scrolled state ───────────────────────
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── MOBILE MENU ───────────────────────────────
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
}));

// ── SMOOTH SCROLL ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── ACCORDION ─────────────────────────────────
document.querySelectorAll('.acc-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item    = trigger.closest('.acc-item');
    const panel   = item.querySelector('.acc-panel');
    const isOpen  = trigger.getAttribute('aria-expanded') === 'true';

    // Close all other open panels
    document.querySelectorAll('.acc-trigger[aria-expanded="true"]').forEach(t => {
      if (t !== trigger) {
        t.setAttribute('aria-expanded', 'false');
        t.closest('.acc-item').querySelector('.acc-panel').classList.remove('open');
      }
    });

    // Toggle this one
    trigger.setAttribute('aria-expanded', String(!isOpen));
    panel.classList.toggle('open', !isOpen);
  });
});

// Open first item by default
const firstTrigger = document.querySelector('.acc-trigger');
if (firstTrigger) {
  firstTrigger.setAttribute('aria-expanded', 'true');
  firstTrigger.closest('.acc-item').querySelector('.acc-panel').classList.add('open');
}

// ── SCROLL REVEAL ─────────────────────────────
const revealEls = document.querySelectorAll(
  '.svc-card, .logo-card, .acc-item, .ask-header, .about-text, .about-photo-col, .contact-header, .contact-cards, .contact-disclaimer, .section-title, .section-sub, .section-tag, .qs-inner'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
revealEls.forEach(el => observer.observe(el));

// ── NAV ACTIVE HIGHLIGHT ──────────────────────
document.querySelectorAll('section[id]').forEach(s => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(l => {
          l.style.color = l.getAttribute('href') === `#${e.target.id}` ? 'var(--c-navy)' : '';
        });
      }
    });
  }, { threshold: 0.35 }).observe(s);
});

// ── LOGO CARD TILT ────────────────────────────
document.querySelectorAll('.logo-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 6;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 6;
    card.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});