/* ============================================================
   SCHOOL ERP – sidebar-template.js
   Injects the shared Front Office sidebar into #sidebar.
   Each standalone page includes this script and the sidebar
   is rendered consistently across all pages.
============================================================ */

(function renderSidebar() {
  const sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;

  // Determine the relative base path from the current page back to the
  // project root. All front-office pages live in pages/front-office/ so
  // the path prefix to reach assets / css / js is always "../../"
  const base = '../../';

  sidebarEl.innerHTML = `
    <!-- Brand -->
    <div class="sidebar-brand" onclick="window.location.href='${base}pages/dashboard/index.html'">
      <div class="brand-logo-box">
        <img src="${base}assets/images/branding/school-logo.png" alt="School Logo" class="brand-logo-img">
      </div>
      <div class="brand-text">
        <span class="brand-name">Devryon</span>
        <span class="brand-sub">Demo School</span>
      </div>
    </div>

    <!-- Session chip -->
    <div class="session-pill-wrap">
      <div class="session-pill">
        <svg class="session-pill-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="16" height="14" rx="2" stroke="#a8bce0" stroke-width="1.5"/>
          <path d="M6 2v4M14 2v4M2 9h16" stroke="#a8bce0" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span>Current Session: 2025-26</span>
      </div>
    </div>

    <!-- Nav label -->
    <p class="nav-label">FRONT OFFICE</p>

    <!-- Nav -->
    <nav id="mainNav">
      <!-- Front Office group -->
      <div class="nav-group open" id="navGroupFrontOffice">
        <div class="nav-group-toggle active">
          <span class="nav-icon">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M7.5 18V13h5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="nav-text">Front Office</span>
          <span class="nav-arrow nav-arrow--dropdown">
            <svg viewBox="0 0 10 16" fill="none"><path d="M2 2l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </div>
        <div class="nav-submenu" id="submenuFrontOffice" style="max-height:400px;">
          <a href="admission.html" data-view="admission" class="nav-sub-item">
            <span class="sub-dot"></span>Admission Enquiry
          </a>
          <a href="visitor.html" data-view="visitor" class="nav-sub-item">
            <span class="sub-dot"></span>Visitor Book
          </a>
          <a href="postal-dispatch.html" data-view="dispatch" class="nav-sub-item">
            <span class="sub-dot"></span>Postal Dispatch
          </a>
          <a href="phone-log.html" data-view="phone" class="nav-sub-item">
            <span class="sub-dot"></span>Phone Call Log
          </a>
          <a href="postal-receive.html" data-view="receive" class="nav-sub-item">
            <span class="sub-dot"></span>Postal Receive
          </a>
          <a href="complain.html" data-view="complaint" class="nav-sub-item">
            <span class="sub-dot"></span>Complain
          </a>
        </div>
      </div>

      <!-- Back to Dashboard -->
      <a href="${base}pages/dashboard/index.html" data-view="home">
        <span class="nav-icon">
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </span>
        <span class="nav-text">Dashboard</span>
        <span class="nav-arrow">
          <svg viewBox="0 0 10 16" fill="none"><path d="M2 2l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </a>
    </nav>
  `;
})();
