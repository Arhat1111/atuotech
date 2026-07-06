const body = document.body;
const cursorGlow = document.querySelector('.cursor-glow');
const scrollProgress = document.querySelector('.scroll-progress');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const revealEls = document.querySelectorAll('.reveal');
const parallaxEls = document.querySelectorAll('[data-parallax]');
const bgSlides = document.querySelectorAll('.bg-slide');
const heroProducts = document.querySelectorAll('.hero-product');
const galleryTrack = document.querySelector('.gallery-track');
const galleryPrev = document.querySelector('.gallery-btn.prev');
const galleryNext = document.querySelector('.gallery-btn.next');
const timelineLine = document.querySelector('.timeline-line span');

let heroIndex = 0;
let galleryIndex = 0;
let galleryTimer;

const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

function updateScrollProgress() {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight <= 0 ? 0 : (window.scrollY / scrollHeight) * 100;
  scrollProgress.style.width = `${progress}%`;

  if (timelineLine) {
    const rect = document.querySelector('.fitment')?.getBoundingClientRect();
    if (rect) {
      const local = clamp((window.innerHeight - rect.top) / (rect.height + window.innerHeight), 0, 1);
      timelineLine.style.setProperty('--timeline', `${local * 100}%`);
    }
  }
}

function moveParallax() {
  const vh = window.innerHeight;
  parallaxEls.forEach((el) => {
    const speed = Number(el.dataset.parallax || 0);
    const rect = el.getBoundingClientRect();
    const offset = (rect.top - vh / 2) * speed;
    el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  });
}

window.addEventListener('scroll', () => {
  updateScrollProgress();
  moveParallax();
}, { passive: true });

window.addEventListener('load', () => {
  updateScrollProgress();
  moveParallax();
  revealEls.forEach((el, index) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setTimeout(() => el.classList.add('visible'), index * 70);
    }
  });
});

if (cursorGlow) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

navToggle?.addEventListener('click', () => {
  const open = !body.classList.contains('nav-open');
  body.classList.toggle('nav-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealEls.forEach((el) => revealObserver.observe(el));

function cycleHero() {
  if (!bgSlides.length || !heroProducts.length) return;
  bgSlides[heroIndex].classList.remove('is-active');
  heroProducts[heroIndex % heroProducts.length].classList.remove('active');
  heroIndex = (heroIndex + 1) % bgSlides.length;
  bgSlides[heroIndex].classList.add('is-active');
  heroProducts[heroIndex % heroProducts.length].classList.add('active');
}

setInterval(cycleHero, 4200);

function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    const duration = target > 1000 ? 1600 : 1100;
    const start = performance.now();

    function tick(now) {
      const progress = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString('en-IN') + (target === 350 ? '+' : target === 7 ? '+' : '');
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const stats = document.querySelector('.quick-stats');
if (stats) statsObserver.observe(stats);

// 3D tilt for premium card motion
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-5px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

// Magnetic buttons
const magneticEls = document.querySelectorAll('.magnetic');
magneticEls.forEach((el) => {
  el.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * 0.16}px, ${y * 0.2}px)`;
  });
  el.addEventListener('pointerleave', () => {
    el.style.transform = '';
  });
});

// Active section links
const sections = [...document.querySelectorAll('main section[id]')];
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 150;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

// Cabin configurator
const configData = {
  '7d': {
    product: '7D Mat',
    images: {
      black: 'https://www.autotechmotors.com/static/src/assets/images/7D-mat-black%281%29.png',
      tan: 'https://www.autotechmotors.com/static/src/assets/images/7D-mat-tan%281%29.png',
      red: 'https://www.autotechmotors.com/static/src/assets/images/7D-mat-red-black.png',
      blue: 'https://www.autotechmotors.com/static/src/assets/images/7D-mat-Blue-Black.png',
      beige: 'https://www.autotechmotors.com/static/src/assets/images/7D-mat-beige.png'
    }
  },
  seat: {
    product: 'Seat Cover',
    images: {
      black: 'https://www.autotechmotors.com/static/src/assets/images/product-2.png',
      tan: 'https://www.autotechmotors.com/static/src/assets/images/product-1.png',
      red: 'https://www.autotechmotors.com/static/src/assets/images/product-1.png',
      blue: 'https://www.autotechmotors.com/static/src/assets/images/product-4.png',
      beige: 'https://www.autotechmotors.com/static/src/assets/images/product-3.png'
    }
  },
  support: {
    product: 'Comfort Support',
    images: {
      black: 'https://www.autotechmotors.com/static/src/assets/images/cushion-desk.webp',
      tan: 'https://www.autotechmotors.com/static/src/assets/images/cushion-desk.webp',
      red: 'https://www.autotechmotors.com/static/src/assets/images/cushion-desk.webp',
      blue: 'https://www.autotechmotors.com/static/src/assets/images/cushion-desk.webp',
      beige: 'https://www.autotechmotors.com/static/src/assets/images/cushion-desk.webp'
    }
  }
};

let currentType = '7d';
let currentColor = 'black';
const tabs = document.querySelectorAll('.config-tab');
const dots = document.querySelectorAll('.color-dot');
const carModel = document.querySelector('#carModel');
const configImage = document.querySelector('#configImage');
const configProduct = document.querySelector('#configProduct');
const configFinish = document.querySelector('#configFinish');
const configMode = document.querySelector('#configMode');

function updateConfigurator() {
  if (!configImage) return;
  const data = configData[currentType];
  configImage.style.opacity = '0';
  configImage.style.transform = 'translateY(16px) scale(0.96)';
  setTimeout(() => {
    configImage.src = data.images[currentColor];
    configProduct.textContent = data.product;
    configFinish.textContent = currentColor.replace(/\b\w/g, (char) => char.toUpperCase());
    configMode.textContent = carModel?.value || 'City Drive';
    setTimeout(() => {
      configImage.style.opacity = '1';
      configImage.style.transform = '';
    }, 90);
  }, 180);
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');
    currentType = tab.dataset.type;
    updateConfigurator();
  });
});

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    dots.forEach((item) => item.classList.remove('active'));
    dot.classList.add('active');
    currentColor = dot.dataset.color;
    updateConfigurator();
  });
});

carModel?.addEventListener('change', updateConfigurator);

// Gallery slider with drag support
function galleryPerView() {
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 980) return 2;
  return 3;
}

function updateGallery() {
  if (!galleryTrack) return;
  const figures = galleryTrack.querySelectorAll('figure');
  const maxIndex = Math.max(0, figures.length - galleryPerView());
  galleryIndex = clamp(galleryIndex, 0, maxIndex);
  galleryTrack.style.transform = `translateX(-${galleryIndex * (100 / galleryPerView())}%)`;
}

function startGalleryTimer() {
  clearInterval(galleryTimer);
  galleryTimer = setInterval(() => {
    const figures = galleryTrack?.querySelectorAll('figure') || [];
    const maxIndex = Math.max(0, figures.length - galleryPerView());
    galleryIndex = galleryIndex >= maxIndex ? 0 : galleryIndex + 1;
    updateGallery();
  }, 3200);
}

galleryNext?.addEventListener('click', () => {
  const figures = galleryTrack?.querySelectorAll('figure') || [];
  galleryIndex = clamp(galleryIndex + 1, 0, Math.max(0, figures.length - galleryPerView()));
  updateGallery();
  startGalleryTimer();
});

galleryPrev?.addEventListener('click', () => {
  galleryIndex = clamp(galleryIndex - 1, 0, 100);
  updateGallery();
  startGalleryTimer();
});

let dragStart = 0;
let isDragging = false;

galleryTrack?.addEventListener('pointerdown', (event) => {
  isDragging = true;
  dragStart = event.clientX;
  galleryTrack.setPointerCapture(event.pointerId);
});

galleryTrack?.addEventListener('pointerup', (event) => {
  if (!isDragging) return;
  const diff = event.clientX - dragStart;
  if (Math.abs(diff) > 45) {
    galleryIndex += diff < 0 ? 1 : -1;
    updateGallery();
    startGalleryTimer();
  }
  isDragging = false;
});

window.addEventListener('resize', updateGallery);
updateGallery();
startGalleryTimer();

// Graceful image fallback for remote original assets
const fallbackSvg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='900' height='600' viewBox='0 0 900 600'><defs><linearGradient id='g' x1='0' x2='1'><stop stop-color='#080808'/><stop offset='1' stop-color='#260509'/></linearGradient></defs><rect width='900' height='600' fill='url(#g)'/><circle cx='670' cy='160' r='180' fill='#e40c18' opacity='.18'/><text x='70' y='295' fill='#fff' font-family='Arial' font-size='54' font-weight='700'>AUTOTECH</text><text x='70' y='350' fill='#e4bd81' font-family='Arial' font-size='24'>Premium car accessories</text></svg>`);
document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', () => {
    img.src = `data:image/svg+xml,${fallbackSvg}`;
  }, { once: true });
});
