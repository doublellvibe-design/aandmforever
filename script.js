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

// Begin playback on the visitor's first scroll or tap (not when they hit the button)
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
