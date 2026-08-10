/* ============================================================
   SCHOOL ERP – front-office.js
   Shared utilities for all Front Office standalone pages.
   Handles: sidebar toggle, active nav highlighting, modal
   open/close helpers, and the column-toggle popover style.
============================================================ */

/**
 * Inject the column-toggle popover CSS once into <head>.
 * Keeps individual CSS files free of this utility rule.
 */
(function injectUtilityCSS() {
  if (document.getElementById('fo-utility-style')) return;
  const style = document.createElement('style');
  style.id = 'fo-utility-style';
  style.textContent = `
    /* ---- Column Toggle Popover ---- */
    .column-toggle-popover {
      position: absolute; top: 100%; right: 0;
      background: #fff; border: 1px solid #e2e8f0;
      border-radius: 8px; padding: 10px;
      box-shadow: 0 6px 20px rgba(0,0,0,.12);
      z-index: 9999; min-width: 180px;
    }
    .column-popover-title {
      font-size: 11px; font-weight: 700; color: #475569;
      text-transform: uppercase; letter-spacing: .06em;
      margin-bottom: 8px; padding-bottom: 6px;
      border-bottom: 1px solid #f1f5f9;
    }
    .column-toggle-item {
      display: flex; align-items: center; gap: 8px;
      padding: 5px 2px; font-size: 12px; color: #334155;
      cursor: pointer; user-select: none;
    }
    .column-toggle-item input { cursor: pointer; }

    /* ---- Export Toast ---- */
    .export-toast-message {
      position: fixed; bottom: 24px; left: 50%;
      transform: translateX(-50%) translateY(12px);
      background: #10285f; color: #fff;
      padding: 10px 20px; border-radius: 8px;
      font-size: 13px; font-weight: 500;
      opacity: 0; transition: opacity .25s, transform .25s;
      pointer-events: none; z-index: 99999;
    }
    .export-toast-message.show {
      opacity: 1; transform: translateX(-50%) translateY(0);
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   SIDEBAR: Hamburger toggle + nav-group accordion
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar    = document.getElementById('sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // Nav-group toggles (accordion expand/collapse)
  document.querySelectorAll('.nav-group-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const group  = toggle.closest('.nav-group');
      const isOpen = group.classList.contains('open');
      // Close all groups, then open the clicked one if it was closed
      document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
      if (!isOpen) group.classList.add('open');
    });
  });

  // Mark the currently active nav sub-item based on the page filename
  highlightActiveSidebarItem();
});

/**
 * Reads the current filename and marks the matching sidebar link active.
 */
function highlightActiveSidebarItem() {
  const filename = window.location.pathname.split('/').pop().toLowerCase().replace('.html', '');

  // Map filename → data-view attribute used on .nav-sub-item elements
  const fileToView = {
    'admission':        'admission',
    'visitor':          'visitor',
    'postal-dispatch':  'dispatch',
    'postal-receive':   'receive',
    'phone-log':        'phone',
    'complain':         'complaint',
    'complaint':        'complaint',
    'setup':            'purpose'
  };

  const viewKey = fileToView[filename];
  if (!viewKey) return;

  document.querySelectorAll('.nav-sub-item').forEach(a => a.classList.remove('active'));

  const target = document.querySelector(`.nav-sub-item[data-view="${viewKey}"]`);
  if (target) {
    target.classList.add('active');
    // Ensure parent nav-group is open
    const group = target.closest('.nav-group');
    if (group) group.classList.add('open');
    const toggle = group && group.querySelector('.nav-group-toggle');
    if (toggle) toggle.classList.add('active');
  }
}

/* ============================================================
   MODAL HELPERS
   Generic open/close used by all modules that follow the
   pattern: modal element has class "modal", opens via
   class "open".
============================================================ */

/**
 * Open a modal by its element ID.
 * @param {string} modalId
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Close a modal by its element ID.
 * @param {string} modalId
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Close any open modal when clicking the backdrop.
 * Attach once per page.
 */
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal') && e.target.classList.contains('open')) {
    e.target.classList.remove('open');
    e.target.setAttribute('aria-hidden', 'true');
  }
});

window.openModal  = openModal;
window.closeModal = closeModal;
