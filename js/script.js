/* ============================================================================
   PORTFOLIO INTERACTIVE LOGIC — FACHRIAL ARKAAN RASENDRIYA
   Monochrome theme | Fade transitions | Cursor trail dots
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initGreeting();
  initNavigation();
  initCanvasParticles();
  initCursorTrail();
  initCertificates();
  initProjects();
  initContactForm();
});

/* ============================================================================
   1. MULTILINGUAL GREETING
   ============================================================================ */
function initGreeting() {
  const greeting = document.getElementById('greetingText');
  if (!greeting) return;

  const greetings = ['Halo', 'Hello', 'こんにちは', '你好', 'สวัสดี', 'Привет', 'Xin chào'];
  let currentGreeting = 0;

  setInterval(() => {
    currentGreeting = (currentGreeting + 1) % greetings.length;
    greeting.classList.remove('greeting-drop');
    void greeting.offsetWidth;
    greeting.textContent = greetings[currentGreeting];
    greeting.classList.add('greeting-drop');
  }, 2800);
}

/* ============================================================================
   2. INTRO LOADER
   ============================================================================ */
function initLoader() {
  const loader = document.getElementById('introOverlay');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('fade-out');
    }, 800);
  });
}

/* ============================================================================
   2. FADE NAVIGATION
   ============================================================================ */
let currentPanel = 0;
const totalPanels = 4;
let isTransitioning = false;

function initNavigation() {
  const navBtns   = document.querySelectorAll('.nav-btn');
  const dots      = document.querySelectorAll('.dot');
  const panels    = document.querySelectorAll('.section-panel');

  window.navigateTo = function(index) {
    if (isTransitioning) return;
    const target = ((index % totalPanels) + totalPanels) % totalPanels;
    if (target === currentPanel) return;

    isTransitioning = true;

    // Fade out current panel
    panels[currentPanel].classList.remove('active');

    // Fade in target panel after a tiny gap
    setTimeout(() => {
      currentPanel = target;
      panels[currentPanel].classList.add('active');

      navBtns.forEach((btn, i) => btn.classList.toggle('active', i === currentPanel));
      dots.forEach((dot, i)    => dot.classList.toggle('active', i === currentPanel));

      isTransitioning = false;
    }, 80); // small gap so both panels aren't simultaneously visible
  };

  // Header button clicks
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(parseInt(btn.getAttribute('data-index'), 10));
    });
  });

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      navigateTo(parseInt(dot.getAttribute('data-index'), 10));
    });
  });

  // Keyboard: Left / Right arrows
  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'ArrowRight') navigateTo(currentPanel + 1);
    if (e.key === 'ArrowLeft')  navigateTo(currentPanel - 1);
  });

  // Mouse wheel
  window.addEventListener('wheel', (e) => {
    // Allow scroll inside cards / modals
    const path = e.composedPath();
    const scrollable = path.find(el =>
      el.classList && (el.classList.contains('glass-card') || el.classList.contains('modal-content'))
    );

    if (scrollable) {
      const down        = e.deltaY > 0;
      const atBottom    = scrollable.scrollHeight - scrollable.scrollTop <= scrollable.clientHeight + 1;
      const atTop       = scrollable.scrollTop === 0;
      if (down && !atBottom) return;
      if (!down && !atTop)   return;
    }

    e.preventDefault();
    if (isTransitioning) return;

    if (e.deltaY > 30)       navigateTo(currentPanel + 1);
    else if (e.deltaY < -30) navigateTo(currentPanel - 1);
  }, { passive: false });
}

/* ============================================================================
   3. CANVAS FLOATING PARTICLES (Monochrome — subtle white dots)
   ============================================================================ */
function initCanvasParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const particles = [];
  const COUNT = 55;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x       = Math.random() * W;
      this.y       = H + Math.random() * 80;
      this.r       = Math.random() * 2.5 + 0.8;
      this.vx      = Math.random() * 0.5 - 0.25;
      this.vy      = -(Math.random() * 0.8 + 0.2);
      this.opacity = Math.random() * 0.25 + 0.08;
    }
    update() {
      this.y += this.vy;
      this.x += this.vx;
      if (this.y < -5) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) {
    const p = new Particle();
    p.y = Math.random() * H;  // distribute on first render
    particles.push(p);
  }

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  (function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  })();
}

/* ============================================================================
   4. CURSOR TRAIL DOTS
   ============================================================================ */
function initCursorTrail() {
  // Main cursor dot (follows pointer exactly)
  const dot = document.createElement('div');
  dot.id = 'cursorDot';
  document.body.appendChild(dot);

  // Trail configuration
  const TRAIL_COUNT   = 10;    // how many trail dots to spawn per move event
  const MAX_SIZE      = 7;     // px — largest trail dot
  const MIN_SIZE      = 2;     // px — smallest
  const LIFETIME      = 600;   // ms before dot disappears

  let lastX = -100, lastY = -100;

  document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Move main dot
    dot.style.left = x + 'px';
    dot.style.top  = y + 'px';

    // Throttle trail spawning based on distance moved
    const dist = Math.hypot(x - lastX, y - lastY);
    if (dist < 8) return;  // only spawn when cursor actually moves enough
    lastX = x; lastY = y;

    spawnTrailDot(x, y);
  });

  function spawnTrailDot(x, y) {
    const d = document.createElement('div');
    d.className = 'cursor-trail-dot';

    // Random size between MIN and MAX
    const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
    // Small random offset so dots don't stack exactly
    const ox = (Math.random() - 0.5) * 12;
    const oy = (Math.random() - 0.5) * 12;

    d.style.width    = size + 'px';
    d.style.height   = size + 'px';
    d.style.left     = (x + ox) + 'px';
    d.style.top      = (y + oy) + 'px';
    d.style.animationDuration = LIFETIME + 'ms';

    document.body.appendChild(d);

    // Remove from DOM once animation ends
    setTimeout(() => d.remove(), LIFETIME);
  }

  // Hide custom dot when cursor leaves window
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });
}

/* ============================================================================
   5. CERTIFICATES — LOCAL STORAGE SYSTEM
   ============================================================================ */
let certificateStore = [];

function initCertificates() {
  const btn = document.getElementById('openUploadModalBtn');
  if (btn) btn.addEventListener('click', () => openModal('uploadModal'));
  loadSavedCertificates();
}

window.openModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
};

window.closeModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
};

let selectedFileBase64 = null;

window.handleFileSelect = function(input) {
  const file = input.files[0];
  const preview = document.getElementById('filePreviewContainer');
  if (!file || !preview) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    selectedFileBase64 = e.target.result;
    preview.innerHTML = `<img src="${selectedFileBase64}" class="file-preview-img" alt="Preview">`;
  };
  reader.readAsDataURL(file);
};

window.handleCertificateUpload = function(e) {
  e.preventDefault();

  const title  = document.getElementById('certTitleInput').value.trim();
  const issuer = document.getElementById('certIssuerInput').value.trim();
  const date   = document.getElementById('certDateInput').value.trim();
  const desc   = document.getElementById('certDescInput').value.trim()
                 || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

  if (!selectedFileBase64) { alert('Please select a certificate image.'); return; }

  const cert = { id: 'cert-' + Date.now(), title, issuer, date, desc, imageBase64: selectedFileBase64 };
  certificateStore.push(cert);
  localStorage.setItem('fachrial_certificates', JSON.stringify(certificateStore));

  renderNewCertificateCard(cert);

  document.getElementById('uploadForm').reset();
  document.getElementById('filePreviewContainer').innerHTML = '';
  selectedFileBase64 = null;
  closeModal('uploadModal');
};

function loadSavedCertificates() {
  const saved = localStorage.getItem('fachrial_certificates');
  if (!saved) return;
  try {
    certificateStore = JSON.parse(saved);
    certificateStore.forEach(cert => renderNewCertificateCard(cert));
  } catch (e) {
    console.error('Failed to load saved certificates', e);
  }
}

function renderNewCertificateCard(cert) {
  const grid       = document.getElementById('certificatesGrid');
  const uploadCard = document.getElementById('openUploadModalBtn');
  if (!grid || !uploadCard) return;

  const card = document.createElement('div');
  card.className = 'cert-card glass-subcard';
  card.innerHTML = `
    <div class="cert-img-wrapper">
      <img src="${cert.imageBase64}" class="cert-uploaded-img" alt="${cert.title}">
      <div class="cert-overlay">
        <button class="cert-view-btn" onclick="zoomCertificate(this)">
          <i class="fa-solid fa-magnifying-glass-plus"></i> Preview
        </button>
      </div>
    </div>
    <div class="cert-info">
      <h3 class="cert-title">${cert.title}</h3>
      <span class="cert-issuer"><i class="fa-solid fa-building"></i> ${cert.issuer}</span>
      <span class="cert-date"><i class="fa-solid fa-calendar-days"></i> ${cert.date}</span>
      <p class="cert-desc">${cert.desc}</p>
    </div>
  `;
  grid.insertBefore(card, uploadCard);
}

window.zoomCertificate = function(el) {
  const card = el.closest('.cert-card');
  if (!card) return;

  const img = card.querySelector('.cert-uploaded-img');
  const svg = card.querySelector('.cert-placeholder');

  document.getElementById('zoomTitle').innerText      = card.querySelector('.cert-title').innerText;
  document.getElementById('zoomIssuerDate').innerText =
    `${card.querySelector('.cert-issuer').innerText} | ${card.querySelector('.cert-date').innerText}`;
  document.getElementById('zoomDesc').innerText       = card.querySelector('.cert-desc').innerText;

  const wrapper = document.getElementById('zoomImgWrapper');
  if (img)      { wrapper.innerHTML = `<img src="${img.src}" alt="Certificate">`; }
  else if (svg) {
    const clone = svg.cloneNode(true);
    clone.removeAttribute('class');
    wrapper.innerHTML = '';
    wrapper.appendChild(clone);
  }

  openModal('zoomModal');
};

/* ============================================================================
   6. PROJECTS — FILTER & DETAIL MODAL
   ============================================================================ */
function initProjects() {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        card.classList.toggle('hidden', filter !== 'all' && cat !== filter);
      });
    });
  });
}

window.openProjectDetail = function(button) {
  const card = button.closest('.project-card');
  if (!card) return;

  const name     = card.querySelector('.project-name').innerText;
  const category = card.getAttribute('data-category').toUpperCase();
  const svg      = card.querySelector('.project-placeholder');
  const tags     = card.querySelectorAll('.project-tags .tag');

  document.getElementById('projectDetailName').innerText  = name;
  document.getElementById('projectDetailBadge').innerText = category;

  const tagsEl = document.getElementById('projectDetailTags');
  tagsEl.innerHTML = '';
  tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.innerText = t.innerText;
    tagsEl.appendChild(span);
  });

  const imgWrapper = document.getElementById('projectDetailImgWrapper');
  if (svg) {
    const clone = svg.cloneNode(true);
    clone.removeAttribute('class');
    imgWrapper.innerHTML = '';
    imgWrapper.appendChild(clone);
  }

  openModal('projectDetailModal');
};

/* ============================================================================
   7. CONTACT FORM (simulated send)
   ============================================================================ */
function initContactForm() {
  // registered via onsubmit attribute in HTML
}

window.handleContactSubmit = function(e) {
  e.preventDefault();
  const feedback = document.getElementById('formFeedback');
  if (!feedback) return;

  feedback.innerHTML  = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  feedback.className  = 'form-feedback';

  setTimeout(() => {
    feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message sent successfully!';
    feedback.className = 'form-feedback success';
    document.getElementById('contactForm').reset();
  }, 1400);
};
