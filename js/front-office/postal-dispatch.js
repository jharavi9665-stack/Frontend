/* ============================================================
   SCHOOL ERP – postal-dispatch.js
   Postal Dispatch Controller (LocalStorage-backed)
============================================================ */

const INITIAL_DISPATCH = [
  {
    id: 'PD1001',
    toTitle:     'Ministry of Education',
    referenceNo: 'REF-2026-001',
    address:     'Shastri Bhavan, New Delhi',
    note:        'Regarding annual report submission.',
    fromTitle:   'School Office',
    date:        '2026-07-05',
    type:        'Letter',
    document:    ''
  },
  {
    id: 'PD1002',
    toTitle:     'CBSE Regional Office',
    referenceNo: 'REF-2026-002',
    address:     'PS-1-2, Institutional Area, Delhi',
    note:        'Affiliation renewal documents.',
    fromTitle:   'School Office',
    date:        '2026-07-08',
    type:        'Parcel',
    document:    ''
  }
];

const PostalDispatchModule = {
  storageKey: window.STORAGE_KEYS ? window.STORAGE_KEYS.POSTAL_DISPATCH : 'school_erp_postal_dispatch',
  initialData: INITIAL_DISPATCH,

  getRecords(query = '') {
    const all = StorageUtils.get(this.storageKey, this.initialData);
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(r =>
      (r.toTitle || '').toLowerCase().includes(q) ||
      (r.referenceNo || '').toLowerCase().includes(q) ||
      (r.type || '').toLowerCase().includes(q) ||
      (r.address || '').toLowerCase().includes(q)
    );
  },

  getById(id) {
    return StorageUtils.getById(this.storageKey, id, 'id');
  },

  saveRecord(data, editId = null) {
    if (!data.toTitle || !data.toTitle.trim()) throw new Error('"To Title" is required.');
    if (!data.date) throw new Error('Date is required.');

    const payload = {
      toTitle:     data.toTitle.trim(),
      referenceNo: data.referenceNo || '',
      address:     data.address || '',
      note:        data.note || '',
      fromTitle:   data.fromTitle || 'School Office',
      date:        data.date,
      type:        data.type || 'Letter',
      document:    data.document || ''
    };

    if (editId) return StorageUtils.update(this.storageKey, editId, payload);
    return StorageUtils.add(this.storageKey, payload, 'id', 'PD');
  },

  deleteRecord(id) {
    return StorageUtils.delete(this.storageKey, id);
  }
};

window.PostalDispatchModule = PostalDispatchModule;

/* ============================================================
   PAGE INITIALISATION
============================================================ */
let currentDispatchEditId = null;

document.addEventListener('DOMContentLoaded', () => {
  StorageUtils.get(PostalDispatchModule.storageKey, PostalDispatchModule.initialData);
  bindDispatchEvents();
  renderDispatchTable();
});

function bindDispatchEvents() {
  const openBtn = document.getElementById('openAddModal');
  if (openBtn) openBtn.addEventListener('click', openDispatchAddModal);

  document.querySelectorAll('[data-close-modal="dispatchModal"]').forEach(btn => {
    btn.addEventListener('click', closeDispatchModal);
  });

  const form = document.getElementById('dispatchForm');
  if (form) form.addEventListener('submit', handleDispatchFormSubmit);

  const searchInput = document.getElementById('tableSearchInput');
  if (searchInput) searchInput.addEventListener('input', renderDispatchTable);

  if (window.ExportUtils) ExportUtils.bindExportButtons();
}

function openDispatchAddModal() {
  currentDispatchEditId = null;
  const form = document.getElementById('dispatchForm');
  if (form) form.reset();

  const dateField = document.getElementById('dispatchDate');
  if (dateField) dateField.value = new Date().toISOString().split('T')[0];

  setModalTitle('dispatchModal', 'Add Postal Dispatch');
  openModal('dispatchModal');
}

function openDispatchEditModal(id) {
  const record = PostalDispatchModule.getById(id);
  if (!record) { alert('Record not found.'); return; }

  currentDispatchEditId = id;

  const set = (fieldId, val) => {
    const el = document.getElementById(fieldId);
    if (el) el.value = val || '';
  };

  set('toTitle',     record.toTitle);
  set('referenceNo', record.referenceNo);
  set('address',     record.address);
  set('note',        record.note);
  set('fromTitle',   record.fromTitle);
  set('dispatchDate', record.date);
  set('dispatchType', record.type);

  setModalTitle('dispatchModal', 'Edit Postal Dispatch');
  openModal('dispatchModal');
}

function closeDispatchModal() {
  closeModal('dispatchModal');
  const form = document.getElementById('dispatchForm');
  if (form) form.reset();
  currentDispatchEditId = null;
}

function handleDispatchFormSubmit(e) {
  e.preventDefault();
  try {
    const data = {
      toTitle:     document.getElementById('toTitle')?.value,
      referenceNo: document.getElementById('referenceNo')?.value,
      address:     document.getElementById('address')?.value,
      note:        document.getElementById('note')?.value,
      fromTitle:   document.getElementById('fromTitle')?.value,
      date:        document.getElementById('dispatchDate')?.value,
      type:        document.getElementById('dispatchType')?.value
    };

    PostalDispatchModule.saveRecord(data, currentDispatchEditId);
    closeDispatchModal();
    renderDispatchTable();
  } catch (err) {
    alert(err.message);
  }
}

function deleteDispatchRecord(id) {
  if (confirm('Are you sure you want to delete this dispatch record?')) {
    PostalDispatchModule.deleteRecord(id);
    renderDispatchTable();
  }
}

function renderDispatchTable() {
  const tbody = document.querySelector('#dispatchTable tbody');
  const pager = document.querySelector('.pager span');
  if (!tbody) return;

  const query   = document.getElementById('tableSearchInput')?.value || '';
  const records = PostalDispatchModule.getRecords(query);
  const total   = PostalDispatchModule.getRecords().length;

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-cell">No postal dispatch records found.</td></tr>`;
  } else {
    tbody.innerHTML = records.map((r, idx) => `
      <tr data-id="${r.id}">
        <td>${idx + 1}</td>
        <td>${r.toTitle || '—'}</td>
        <td>${r.referenceNo || '—'}</td>
        <td>${r.fromTitle || '—'}</td>
        <td><span class="type-badge">${r.type || '—'}</span></td>
        <td>${formatDate(r.date)}</td>
        <td>
          <div class="row-actions">
            <button class="act-btn edit" onclick="openDispatchEditModal('${r.id}')" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="act-btn delete" onclick="deleteDispatchRecord('${r.id}')" title="Delete">
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
function setModalTitle(modalId, text) {
  const el = document.querySelector(`#${modalId} .modal-head strong`);
  if (el) el.textContent = text;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

window.openDispatchEditModal = openDispatchEditModal;
window.deleteDispatchRecord  = deleteDispatchRecord;
