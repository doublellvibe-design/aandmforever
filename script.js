/* ===========================================================
   Ulwamkelo Luka Makoti — interactions
   =========================================================== */

// --- Mobile navigation toggle ---
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

links?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

// --- Scroll reveal ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- Background music (starts on first scroll/tap, per browser autoplay rules) ---
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('musicToggle');

function playBgm() {
  if (!bgm) return;
  bgm.play().then(() => {
    musicBtn?.classList.add('playing');
    musicBtn?.setAttribute('aria-pressed', 'true');
  }).catch(() => { /* autoplay blocked or file missing — ignore */ });
}
function pauseBgm() {
  bgm?.pause();
  musicBtn?.classList.remove('playing');
  musicBtn?.setAttribute('aria-pressed', 'false');
}

musicBtn?.addEventListener('click', () => {
  if (bgm && bgm.paused) playBgm(); else pauseBgm();
});

let musicStarted = false;
function startOnFirstInteraction(e) {
  if (musicStarted) return;
  if (e && e.target && e.target.closest && e.target.closest('#musicToggle')) return;
  musicStarted = true;
  playBgm();
  window.removeEventListener('scroll', startOnFirstInteraction);
  window.removeEventListener('pointerdown', startOnFirstInteraction);
}
window.addEventListener('scroll', startOnFirstInteraction, { passive: true });
window.addEventListener('pointerdown', startOnFirstInteraction);

// --- Photo slideshow ---
const slideshow = document.querySelector('.slideshow');
if (slideshow) {
  const slides = Array.from(slideshow.querySelectorAll('.slide'));
  const dotsWrap = slideshow.querySelector('.dots');
  const prevBtn = slideshow.querySelector('.slide-btn.prev');
  const nextBtn = slideshow.querySelector('.slide-btn.next');
  let current = 0;
  let timer = null;

  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (idx === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Go to photo ' + (idx + 1));
    dot.addEventListener('click', () => { show(idx); restart(); });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === current));
    dots.forEach((d, idx) => d.classList.toggle('is-active', idx === current));
  }
  function next() { show(current + 1); }
  function prev() { show(current - 1); }
  function start() { stop(); timer = setInterval(next, 5000); }
  function stop() { if (timer) clearInterval(timer); }
  function restart() { stop(); start(); }

  nextBtn.addEventListener('click', () => { next(); restart(); });
  prevBtn.addEventListener('click', () => { prev(); restart(); });
  slideshow.addEventListener('mouseenter', stop);
  slideshow.addEventListener('mouseleave', start);

  show(0);
  start();
}
