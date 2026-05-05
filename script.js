/* ================================================================
   AHMED MANSOUR — Script Principal
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. FEATHER ICONS ─────────────────────────────────────── */
  if (typeof feather !== 'undefined') feather.replace();

  /* ── 2. PAGE LOADER ───────────────────────────────────────── */
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initHeroCounters();
    }, 1800);
  });
  document.body.style.overflow = 'hidden';

  /* ── 3. CUSTOM CURSOR ─────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverEls = document.querySelectorAll('a, button, .portfolio-item, .service-card, .filter-btn');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        follower.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        follower.classList.remove('hovering');
      });
    });
  }

  /* ── 4. NAVBAR ────────────────────────────────────────────── */
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    overlay.classList.toggle('show', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  overlay.addEventListener('click', closeNav);
  navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeNav));

  function closeNav() {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observerNav.observe(s));

  /* ── 5. SCROLL REVEAL ─────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.scroll-reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── 6. HERO COUNTERS ─────────────────────────────────────── */
  function initHeroCounters() {
    document.querySelectorAll('.hero-stat .stat-num').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target), 1800);
    });
  }

  /* ── 7. ANIMATED COUNTERS ─────────────────────────────────── */
  function animateCounter(el, target, duration) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  }

  const statBigs = document.querySelectorAll('.stat-big[data-target]');
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        animateCounter(el, parseInt(el.dataset.target), 2000);
        statsObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statBigs.forEach(el => statsObs.observe(el));

  /* ── 8. PARALLAX ──────────────────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  const statsBg = document.querySelector('.stats-bg');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (heroBg) heroBg.style.transform = `translateY(${sy * 0.25}px) scale(1)`;
    if (statsBg) {
      const rect = statsBg.closest('.stats-banner').getBoundingClientRect();
      statsBg.style.transform = `translateY(${-rect.top * 0.15}px)`;
    }
  }, { passive: true });

  /* ── 9. PORTFOLIO FILTER ──────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      portfolioItems.forEach((item, i) => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;
        item.classList.add('filtering');
        setTimeout(() => {
          item.classList.remove('filtering');
          item.classList.toggle('hidden', !show);
        }, i * 40);
      });
    });
  });

  /* ── 10. LIGHTBOX ─────────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightboxImg');
  const lbPlaceholder = document.getElementById('lightboxPlaceholder');
  const lbTitle  = document.getElementById('lightboxTitle');
  const lbLoc    = document.getElementById('lightboxLocation');
  const lbClose  = document.getElementById('lightboxClose');
  const lbPrev   = document.getElementById('lightboxPrev');
  const lbNext   = document.getElementById('lightboxNext');
  const lbBd     = document.getElementById('lightboxBackdrop');

  let lbItems = [];
  let lbIndex = 0;

  document.querySelectorAll('.portfolio-zoom').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const src   = btn.dataset.src;
      const title = btn.dataset.title;
      const loc   = btn.dataset.location;
      // Build list from visible items
      lbItems = Array.from(document.querySelectorAll('.portfolio-zoom'));
      lbIndex = lbItems.indexOf(btn);
      openLightbox(src, title, loc);
    });
  });

  function openLightbox(src, title, loc) {
    lbTitle.textContent = title;
    lbLoc.textContent   = loc;
    // Show placeholder with gradient as the "photo"
    lbImg.style.display = 'none';
    lbPlaceholder.style.display = 'flex';
    // Try loading real image if it exists
    const img = new Image();
    img.onload = () => {
      lbPlaceholder.style.display = 'none';
      lbImg.src = src;
      lbImg.alt = title;
      lbImg.style.display = 'block';
    };
    img.onerror = () => {
      // Keep placeholder with the item's gradient color
      const item = lbItems[lbIndex]?.closest('.portfolio-item');
      if (item) {
        const bg = getComputedStyle(item.querySelector('.portfolio-img')).backgroundImage;
        lbPlaceholder.style.background = bg.replace(/url\([^)]+\),?\s*/g,'') || 'linear-gradient(135deg, #6B4226, #C4956A)';
      }
      lbPlaceholder.style.display = 'flex';
      lbImg.style.display = 'none';
    };
    img.src = src;

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof feather !== 'undefined') feather.replace();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; lbImg.style.display = 'none'; }, 400);
  }

  lbClose.addEventListener('click', closeLightbox);
  lbBd.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
  });

  function navigateLightbox(dir) {
    lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
    const btn = lbItems[lbIndex];
    openLightbox(btn.dataset.src, btn.dataset.title, btn.dataset.location);
  }

  lbNext.addEventListener('click', () => navigateLightbox(1));
  lbPrev.addEventListener('click', () => navigateLightbox(-1));

  /* ── 11. TESTIMONIALS CAROUSEL ────────────────────────────── */
  const carousel    = document.getElementById('testimonialsCarousel');
  const dotsWrap    = document.getElementById('carouselDots');
  const prevBtn     = document.getElementById('carouselPrev');
  const nextBtn     = document.getElementById('carouselNext');
  const cards       = carousel.querySelectorAll('.testimonial-card');

  let carouselIndex = 0;
  let cardsVisible  = getCardsVisible();
  let totalSlides   = Math.ceil(cards.length / cardsVisible);
  let autoInterval  = null;

  function getCardsVisible() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    totalSlides = Math.ceil(cards.length / cardsVisible);
    for (let i = 0; i < totalSlides; i++) {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(d);
    }
  }

  function goToSlide(i) {
    carouselIndex = Math.max(0, Math.min(i, totalSlides - 1));
    const cardW = carousel.querySelector('.testimonial-card').offsetWidth;
    const gap   = 28;
    carousel.style.transform = `translateX(-${carouselIndex * (cardW + gap) * cardsVisible}px)`;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, idx) => {
      d.classList.toggle('active', idx === carouselIndex);
    });
  }

  prevBtn.addEventListener('click', () => {
    goToSlide(carouselIndex - 1 < 0 ? totalSlides - 1 : carouselIndex - 1);
    resetAutoplay();
  });
  nextBtn.addEventListener('click', () => {
    goToSlide((carouselIndex + 1) % totalSlides);
    resetAutoplay();
  });

  function startAutoplay() {
    autoInterval = setInterval(() => {
      goToSlide((carouselIndex + 1) % totalSlides);
    }, 5000);
  }
  function resetAutoplay() {
    clearInterval(autoInterval);
    startAutoplay();
  }

  buildDots();
  startAutoplay();

  window.addEventListener('resize', () => {
    const newVisible = getCardsVisible();
    if (newVisible !== cardsVisible) {
      cardsVisible = newVisible;
      carouselIndex = 0;
      buildDots();
      goToSlide(0);
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? (carouselIndex + 1) % totalSlides : (carouselIndex - 1 + totalSlides) % totalSlides);
      resetAutoplay();
    }
  });

  /* ── 12. CONTACT FORM → Formspree → jbelimouadh5@gmail.com ── */
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/jbelimouadh5@gmail.com';
  const WHATSAPP_NUM       = '21621030900'; // numéro de secours

  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) { field.classList.add('error'); valid = false; }
      if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        field.classList.add('error'); valid = false;
      }
    });
    if (!valid) { form.querySelector('.error')?.focus(); return; }

    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText   = submitBtn.querySelector('.btn-text');
    btnText.textContent = 'Envoi en cours…';
    submitBtn.disabled  = true;

    // Libellés lisibles pour les valeurs du menu déroulant
    const serviceLabels = {
      'placo':      'Placoplâtre (Placo / BA13)',
      'deco-placo': 'Décoration en placoplâtre',
      'staff':      "Staff l'arbi — الجبس العربي",
      'peinture':   'Peinture & finitions',
      'autre':      'Autre projet',
    };
    const serviceVal = form.service.value;

    // Données à envoyer
    const payload = {
      'Prénom':     form.firstName.value.trim(),
      'Nom':        form.lastName.value.trim(),
      'Email':      form.email.value.trim(),
      'Téléphone':  form.phone.value.trim() || '—',
      'Service':    serviceLabels[serviceVal] || serviceVal || '—',
      'Message':    form.message.value.trim(),
      '_subject':   `Nouvelle demande de devis — ${form.firstName.value.trim()} ${form.lastName.value.trim()}`,
      '_replyto':   form.email.value.trim(),
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(payload),
      });
      

      if (res.ok) {
        showSuccess();
        form.reset();
      } else {
        // Formspree non encore activé → fallback WhatsApp
        fallbackWhatsApp(payload);
      }
    } catch {
      // Pas de réseau → fallback WhatsApp
      fallbackWhatsApp(payload);
    }

    btnText.textContent = 'Envoyer ma demande';
    submitBtn.disabled  = false;
  });

  function showSuccess() {
    success.classList.add('show');
    if (typeof feather !== 'undefined') feather.replace();
  }

  function fallbackWhatsApp(d) {
    const msg = [
      `Bonjour Ahmed 👋`,
      `Je vous contacte via votre site web.`,
      ``,
      `👤 ${d['Prénom']} ${d['Nom']}`,
      `📧 ${d['Email']}`,
      `📞 ${d['Téléphone']}`,
      `🔨 Service : ${d['Service']}`,
      ``,
      `📝 ${d['Message']}`,
    ].join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    showSuccess();
  }

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });

  /* ── 13. BACK TO TOP ──────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── 14. SMOOTH ANCHOR SCROLL ─────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
