/* ============================================================
   SCHOOL ERP – complain.js
   Complain Controller (LocalStorage-backed)
============================================================ */

const INITIAL_COMPLAINTS = [
  {
    id: 'COM1001',
    complainBy:   'Anita Rao',
    phone:        '9876501234',
    date:         '2026-07-06',
    type:         'Infrastructure',
    source:       'Parent',
    assigned:     'Vice Principal',
    description:  'Broken furniture in classroom 5B.',
    actionTaken:  'Reported to maintenance team.'
  },
  {
    id: 'COM1002',
    complainBy:   'Suresh Pillai',
    phone:        '9012312345',
    date:         '2026-07-11',
    type:         'Behaviour',
    source:       'Student',
    assigned:     'Counsellor',
    description:  'Bullying incident reported near the canteen.',
    actionTaken:  'Under investigation.'
  }
];

const ComplainModule = {
  storageKey: window.STORAGE_KEYS ? window.STORAGE_KEYS.COMPLAINTS : 'school_erp_complaints',
  initialData: INITIAL_COMPLAINTS,

  getRecords(query = '') {
    const all = StorageUtils.get(this.storageKey, this.initialData);
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(r =>
      (r.complainBy || '').toLowerCase().includes(q) ||
      (r.phone || '').toLowerCase().includes(q) ||
      (r.type || '').toLowerCase().includes(q) ||
      (r.source || '').toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q)
    );
  },

  getById(id) {
    return StorageUtils.getById(this.storageKey, id, 'id');
  },

  saveRecord(data, editId = null) {
    if (!data.complainBy || !data.complainBy.trim()) throw new Error('"Complain By" name is required.');
    if (!data.date) throw new Error('Date is required.');
    if (!data.description || !data.description.trim()) throw new Error('Description is required.');

    const payload = {
      complainBy:  data.complainBy.trim(),
      phone:       data.phone || '',
      date:        data.date,
      type:        data.type || 'General',
      source:      data.source || '',
      assigned:    data.assigned || '',
      description: data.description.trim(),
      actionTaken: data.actionTaken || ''
    };

    if (editId) return StorageUtils.update(this.storageKey, editId, payload);
    return StorageUtils.add(this.storageKey, payload, 'id', 'COM');
  },

  deleteRecord(id) {
    return StorageUtils.delete(this.storageKey, id);
  }
};

window.ComplainModule = ComplainModule;

/* ============================================================
   PAGE INITIALISATION
============================================================ */
let currentComplainEditId = null;

document.addEventListener('DOMContentLoaded', () => {
  StorageUtils.get(ComplainModule.storageKey, ComplainModule.initialData);
  bindComplainEvents();
  renderComplainTable();
});

function bindComplainEvents() {
  const openBtn = document.getElementById('openAddModal');
  if (openBtn) openBtn.addEventListener('click', openComplainAddModal);

  document.querySelectorAll('[data-close-modal="complainModal"]').forEach(btn => {
    btn.addEventListener('click', closeComplainModal);
  });

  const form = document.getElementById('complainForm');
  if (form) form.addEventListener('submit', handleComplainFormSubmit);

  const searchInput = document.getElementById('tableSearchInput');
  if (searchInput) searchInput.addEventListener('input', renderComplainTable);

  if (window.ExportUtils) ExportUtils.bindExportButtons();
}

function openComplainAddModal() {
  currentComplainEditId = null;
  const form = document.getElementById('complainForm');
  if (form) form.reset();

  const dateField = document.getElementById('complainDate');
  if (dateField) dateField.value = new Date().toISOString().split('T')[0];

  setModalTitle('Add Complain');
  openModal('complainModal');
}

function openComplainEditModal(id) {
  const record = ComplainModule.getById(id);
  if (!record) { alert('Record not found.'); return; }

  currentComplainEditId = id;

  const set = (fieldId, val) => {
    const el = document.getElementById(fieldId);
    if (el) el.value = val || '';
  };

  set('complainBy',   record.complainBy);
  set('complainPhone', record.phone);
  set('complainDate', record.date);
  set('complainType', record.type);
  set('complainSource', record.source);
  set('assigned',     record.assigned);
  set('complainDesc', record.description);
  set('actionTaken',  record.actionTaken);

  setModalTitle('Edit Complain');
  openModal('complainModal');
}

function closeComplainModal() {
  closeModal('complainModal');
  const form = document.getElementById('complainForm');
  if (form) form.reset();
  currentComplainEditId = null;
}

function handleComplainFormSubmit(e) {
  e.preventDefault();
  try {
    const data = {
      complainBy:  document.getElementById('complainBy')?.value,
      phone:       document.getElementById('complainPhone')?.value,
      date:        document.getElementById('complainDate')?.value,
      type:        document.getElementById('complainType')?.value,
      source:      document.getElementById('complainSource')?.value,
      assigned:    document.getElementById('assigned')?.value,
      description: document.getElementById('complainDesc')?.value,
      actionTaken: document.getElementById('actionTaken')?.value
    };

    ComplainModule.saveRecord(data, currentComplainEditId);
    closeComplainModal();
    renderComplainTable();
  } catch (err) {
    alert(err.message);
  }
}

function deleteComplainRecord(id) {
  if (confirm('Are you sure you want to delete this complaint?')) {
    ComplainModule.deleteRecord(id);
    renderComplainTable();
  }
}

function renderComplainTable() {
  const tbody = document.querySelector('#complainTable tbody');
  const pager = document.querySelector('.pager span');
  if (!tbody) return;

  const query   = document.getElementById('tableSearchInput')?.value || '';
  const records = ComplainModule.getRecords(query);
  const total   = ComplainModule.getRecords().length;

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-cell">No complaint records found.</td></tr>`;
  } else {
    tbody.innerHTML = records.map((r, idx) => `
      <tr data-id="${r.id}">
        <td>${idx + 1}</td>
        <td><span class="person">
          <span class="initial" style="background:#fee2e2;color:#dc2626;">${(r.complainBy || 'C')[0].toUpperCase()}</span>
          <span class="person-name">${r.complainBy || '—'}</span>
        </span></td>
        <td>${r.phone || '—'}</td>
        <td><span class="type-badge">${r.type || '—'}</span></td>
        <td>${formatDate(r.date)}</td>
        <td>${r.assigned || '—'}</td>
        <td>
          <div class="row-actions">
            <button class="act-btn edit" onclick="openComplainEditModal('${r.id}')" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="act-btn delete" onclick="deleteComplainRecord('${r.id}')" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  if (pager) pager.textContent = `Showing 1 to ${records.length} of ${total} entries`;
  if (window.ExportUtils) ExportUtils.bindExportButtons();
}

/* ---- Utilities ---- */
function setModalTitle(text) {
  const el = document.querySelector('#complainModal .modal-head strong');
  if (el) el.textContent = text;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

window.openComplainEditModal = openComplainEditModal;
window.deleteComplainRecord  = deleteComplainRecord;
