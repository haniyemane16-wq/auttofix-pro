/* ============================================================
   AutoFix Pro — Main JavaScript
   ============================================================ */

'use strict';

/* ===== NAVBAR: scroll effect + active link ===== */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function updateActiveLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveLink();
  updateScrollTop();
}, { passive: true });

updateNavbar();

/* ===== MOBILE MENU ===== */
const navToggle  = document.getElementById('navToggle');
const navLinksList = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinksList.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Menu sluiten' : 'Menu openen');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
document.querySelectorAll('#navLinks a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksList.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (navLinksList.classList.contains('open') &&
      !navLinksList.contains(e.target) &&
      !navToggle.contains(e.target)) {
    navLinksList.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ===== SMOOTH SCROLL (for older Safari) ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current = Math.min(Math.round(increment * step), target);
    el.textContent = current.toLocaleString('nl-NL');
    if (step >= steps) clearInterval(timer);
  }, duration / steps);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-item__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ===== FORM VALIDATION & SUBMIT ===== */
const form      = document.getElementById('appointmentForm');
const successEl = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

function showError(fieldId, msg) {
  const el = document.getElementById(`${fieldId}-error`);
  if (el) el.textContent = msg;
}

function clearError(fieldId) {
  const el = document.getElementById(`${fieldId}-error`);
  if (el) el.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[\d\s\-+()]{8,}$/.test(phone.trim());
}

if (form) {
  // Live validation
  form.querySelector('#naam').addEventListener('blur', () => {
    const val = form.naam.value.trim();
    showError('naam', val.length < 2 ? 'Vul uw naam in (minimaal 2 tekens).' : '');
  });

  form.querySelector('#telefoon').addEventListener('blur', () => {
    const val = form.telefoon.value.trim();
    showError('telefoon', !validatePhone(val) ? 'Vul een geldig telefoonnummer in.' : '');
  });

  form.querySelector('#email').addEventListener('blur', () => {
    const val = form.email.value.trim();
    showError('email', !validateEmail(val) ? 'Vul een geldig e-mailadres in.' : '');
  });

  form.querySelector('#dienst').addEventListener('change', () => {
    clearError('dienst');
  });

  // Kenteken: auto uppercase
  form.querySelector('#kenteken').addEventListener('input', function() {
    this.value = this.value.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;

    const naam = form.naam.value.trim();
    if (naam.length < 2) { showError('naam', 'Vul uw naam in.'); valid = false; } else clearError('naam');

    const telefoon = form.telefoon.value.trim();
    if (!validatePhone(telefoon)) { showError('telefoon', 'Vul een geldig telefoonnummer in.'); valid = false; } else clearError('telefoon');

    const email = form.email.value.trim();
    if (!validateEmail(email)) { showError('email', 'Vul een geldig e-mailadres in.'); valid = false; } else clearError('email');

    const dienst = form.dienst.value;
    if (!dienst) { showError('dienst', 'Selecteer een dienst.'); valid = false; } else clearError('dienst');

    if (!form.akkoord.checked) { showError('akkoord', 'U dient akkoord te gaan met de voorwaarden.'); valid = false; } else clearError('akkoord');

    if (!valid) return;

    // Simulate submit (in production: real API call)
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Versturen...</span>';

    await new Promise(resolve => setTimeout(resolve, 1800));

    form.reset();
    form.style.display = 'none';
    successEl.style.display = 'block';

    // Scroll to success
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ===== SCROLL TO TOP ===== */
const scrollTopBtn = document.getElementById('scrollTop');

function updateScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== MIN DATE for appointment form ===== */
const datumInput = document.getElementById('datum');
if (datumInput) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  datumInput.min = tomorrow.toISOString().split('T')[0];

  // Disable weekends optionally — set max 60 days from now
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 60);
  datumInput.max = maxDate.toISOString().split('T')[0];
}

/* ===== PARALLAX on hero image ===== */
const heroImg = document.querySelector('.hero__img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
    }
  }, { passive: true });
}

/* ===== LAZY LOADING images ===== */
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.src = img.src;
  });
} else {
  // Fallback for older browsers
  const lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        lazyObserver.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[loading="lazy"]').forEach(img => lazyObserver.observe(img));
}

/* ===== PRICING CARD hover sound effect (visual pulse) ===== */
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.3s';
  });
});

/* ===== COOKIE BANNER ===== */
const cookieBanner  = document.getElementById('cookieBanner');
const cookieAccept  = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

function hideCookie() {
  cookieBanner.classList.remove('visible');
  setTimeout(() => cookieBanner.remove(), 400);
}

if (!localStorage.getItem('afp_cookie')) {
  setTimeout(() => cookieBanner.classList.add('visible'), 1800);
}

cookieAccept?.addEventListener('click', () => {
  localStorage.setItem('afp_cookie', 'accepted');
  hideCookie();
});

cookieDecline?.addEventListener('click', () => {
  localStorage.setItem('afp_cookie', 'declined');
  hideCookie();
});

/* ===== MOBILE CTA: hide when inside appointment section ===== */
const mobileCta = document.getElementById('mobileCta');
const apptSection = document.getElementById('afspraak');

if (mobileCta && apptSection) {
  const apptObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      mobileCta.style.opacity = e.isIntersecting ? '0' : '1';
      mobileCta.style.pointerEvents = e.isIntersecting ? 'none' : 'all';
    });
  }, { threshold: 0.3 });
  apptObserver.observe(apptSection);
}

/* ===== Init on load ===== */
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  updateActiveLink();
  updateScrollTop();
});
