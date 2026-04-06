const fs = require("fs");

const files = [
  "frontend/index.html",
  "frontend/pages/dashboard.html",
  "frontend/pages/report.html",
  "frontend/pages/feed.html",
  "frontend/pages/volunteer.html"
];

// ─── The CSS we inject ───────────────────────────────────────────────────────
const HAMBURGER_CSS = `
/* ═══════════════════════════════════════════════════
   HAMBURGER MENU — MOBILE NAV (Road Track BD)
   ═══════════════════════════════════════════════════ */

/* Hamburger button — hidden on desktop */
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1200;
  margin-left: 8px;
}
.hamburger-btn .bar {
  width: 100%;
  height: 2px;
  background: #00ff88;
  border-radius: 2px;
  transition: all 0.3s ease;
}
/* Animated X when open */
.hamburger-btn.open .bar:nth-child(1) { transform: translateY(9px) rotate(45deg); }
.hamburger-btn.open .bar:nth-child(2) { opacity: 0; }
.hamburger-btn.open .bar:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

/* Mobile drawer */
.mobile-drawer {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(2,10,5,0.97);
  z-index: 1100;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  opacity: 0;
  transition: opacity 0.25s ease;
}
.mobile-drawer.open {
  display: flex;
  opacity: 1;
}
.mobile-drawer .drawer-link {
  width: 100%;
  padding: 20px 40px;
  font-size: 1.3rem;
  font-family: 'Noto Sans Bengali', 'Exo 2', sans-serif;
  color: rgba(180,255,210,0.7);
  text-decoration: none;
  border-bottom: 1px solid rgba(0,255,136,0.08);
  text-align: center;
  transition: all 0.2s;
  letter-spacing: 1px;
}
.mobile-drawer .drawer-link:first-child { border-top: 1px solid rgba(0,255,136,0.08); }
.mobile-drawer .drawer-link:hover,
.mobile-drawer .drawer-link.active {
  color: #00ff88;
  background: rgba(0,255,136,0.06);
  text-shadow: 0 0 15px rgba(0,255,136,0.5);
}
.mobile-drawer .drawer-link .link-icon { margin-right: 12px; font-size: 1.1rem; }

.mobile-drawer .drawer-close {
  position: absolute;
  top: 20px; right: 20px;
  background: none; border: none;
  color: rgba(0,255,136,0.6);
  font-size: 1.8rem; cursor: pointer;
  line-height: 1;
}
.mobile-drawer .drawer-close:hover { color: #00ff88; }

/* ─── @media: Switch to mobile layout at 768px ─── */
@media screen and (max-width: 768px) {
  nav {
    padding: 0 1rem !important;
    height: 60px !important;
    flex-wrap: nowrap !important;
    align-items: center !important;
    justify-content: space-between !important;
  }

  /* Hide desktop nav links completely */
  .nav-links { display: none !important; }

  /* Show hamburger */
  .hamburger-btn { display: flex !important; }

  /* Brand: show logo small, hide subtitle text */
  .brand-title { font-size: 0.9rem !important; letter-spacing: 1px !important; }
  .brand-sub { display: none !important; }
  .brand-logo { height: 30px !important; }

  /* Right nav buttons: shrink */
  #whiteboxTrigger span:last-child { display: none !important; }
  #whiteboxTrigger { padding: 6px 8px !important; }

  /* Page wrappers */
  .dash-wrap { padding: 75px 0.8rem 2rem !important; }
  .main-container, .page-wrap { padding-top: 75px !important; }

  /* Grids: single column */
  .kpi-grid,
  .charts-grid,
  .form-grid,
  .vol-grid { grid-template-columns: 1fr !important; gap: 10px !important; }

  /* Inputs: prevent iOS auto-zoom */
  input, select, textarea { font-size: 16px !important; }

  /* Modals: full width */
  .modal-box, .auth-modal-inner { width: 94% !important; padding: 1.4rem !important; max-height: 90vh !important; overflow-y: auto !important; }
}
`;

// ─── The JS we inject (at body close) ───────────────────────────────────────
const HAMBURGER_JS = `
<script>
/* ─── Hamburger menu logic ─── */
(function() {
  var btn = document.querySelector('.hamburger-btn');
  var drawer = document.querySelector('.mobile-drawer');
  if (!btn || !drawer) return;

  btn.addEventListener('click', function() {
    var isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      btn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close drawer when a link is clicked
  drawer.querySelectorAll('.drawer-link').forEach(function(link) {
    link.addEventListener('click', function() {
      drawer.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();
</script>
`;

// ─── Detect nav links from desktop nav and build drawer HTML ────────────────
function buildDrawer(content) {
  // Try to extract links from .nav-links div
  var navLinksMatch = content.match(/<div class="nav-links">([\s\S]*?)<\/div>/);
  var linksHTML = '';
  if (navLinksMatch) {
    var raw = navLinksMatch[1];
    var linkRe = /<a[^>]*class="nav-link[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
    var match;
    while ((match = linkRe.exec(raw)) !== null) {
      var href = match[1];
      var label = match[2].trim().replace(/<[^>]+>/g,'');
      // icon map
      var icons = { '/': '🗺️', '/report': '📝', '/feed': '📡', '/dashboard': '📊', '/volunteer': '🤝' };
      var icon = icons[href] || '🔗';
      linksHTML += `      <a class="drawer-link" href="${href}"><span class="link-icon">${icon}</span>${label}</a>\n`;
    }
  }

  return `
<!-- Mobile Drawer -->
<div class="mobile-drawer" id="mobileDrawer">
  <button class="drawer-close" onclick="(function(){var d=document.querySelector('.mobile-drawer');var b=document.querySelector('.hamburger-btn');d.classList.remove('open');b.classList.remove('open');document.body.style.overflow='';}())">✕</button>
${linksHTML}
</div>
`;
}

// ─── Process each file ───────────────────────────────────────────────────────
files.forEach(function(file) {
  if (!fs.existsSync(file)) { console.log('SKIP (not found): ' + file); return; }

  var content = fs.readFileSync(file, 'utf8');

  // 1. Remove ALL previous "MOBILE RESPONSIVENESS FIXES" blocks injected before
  content = content.replace(/\n?\/\* --- MOBILE RESPONSIVENESS FIXES --- \*\/[\s\S]*?(?=<\/style>)/g, '');

  // 2. Remove conflicting old media query that does display:none on nav-links
  //    Pattern: @media(max-width:768px) { nav { ... } .nav-links { display: none; } ... }
  content = content.replace(/@media\(max-width:768px\)\s*\{[\s\S]*?\}/g, function(match) {
    // Remove the whole block (it will be replaced by our new CSS)
    return '/* old media query removed */';
  });

  // 3. Inject hamburger CSS before first </style>
  if (!content.includes('HAMBURGER MENU')) {
    content = content.replace('</style>', HAMBURGER_CSS + '\n</style>');
  }

  // 4. Inject hamburger button HTML into nav (after </div> closing .nav-brand)
  if (!content.includes('hamburger-btn')) {
    // Insert button just before the closing </nav>
    content = content.replace('</nav>', `  <button class="hamburger-btn" id="hamburgerBtn" aria-label="Menu">
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
  </button>
</nav>`);
  }

  // 5. Inject mobile drawer HTML after opening <body> (or after <nav>)
  if (!content.includes('mobile-drawer')) {
    var drawer = buildDrawer(content);
    content = content.replace('</nav>', '</nav>\n' + drawer);
  }

  // 6. Inject JS before </body>
  if (!content.includes('Hamburger menu logic')) {
    content = content.replace('</body>', HAMBURGER_JS + '\n</body>');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('✅ Fixed: ' + file);
});

console.log('\nAll files updated with proper hamburger menu!');
