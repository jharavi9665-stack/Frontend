/* ============================================================
   SCHOOL ERP – postal-receive.js
   Postal Receive Controller (LocalStorage-backed)
============================================================ */

const INITIAL_RECEIVE = [
  {
    id: 'PR1001',
    fromTitle:   'District Education Officer',
    referenceNo: 'DEO-2026-045',
    address:     'District Office, Delhi',
    note:        'Inspection schedule for upcoming month.',
    date:        '2026-07-03',
    type:        'Letter',
    document:    ''
  },
  {
    id: 'PR1002',
    fromTitle:   'CBSE',
    referenceNo: 'CBSE-2026-112',
    address:     'CBSE Headquarters, New Delhi',
    note:        'Circular regarding exam fee revision.',
    date:        '2026-07-07',
    type:        'Notice',
    document:    ''
  }
];

const PostalReceiveModule = {
  storageKey: window.STORAGE_KEYS ? window.STORAGE_KEYS.POSTAL_RECEIVE : 'school_erp_postal_receive',
  initialData: INITIAL_RECEIVE,

  getRecords(query = '') {
    const all = StorageUtils.get(this.storageKey, this.initialData);
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(r =>
      (r.fromTitle || '').toLowerCase().includes(q) ||
      (r.referenceNo || '').toLowerCase().includes(q) ||
      (r.type || '').toLowerCase().includes(q) ||
      (r.address || '').toLowerCase().includes(q)
    );
  },

  getById(id) {
    return StorageUtils.getById(this.storageKey, id, 'id');
  },

  saveRecord(data, editId = null) {
    if (!data.fromTitle || !data.fromTitle.trim()) throw new Error('"From Title" is required.');
    if (!data.date) throw new Error('Date is required.');

    const payload = {
      fromTitle:   data.fromTitle.trim(),
      referenceNo: data.referenceNo || '',
      address:     data.address || '',
      note:        data.note || '',
      date:        data.date,
      type:        data.type || 'Letter',
      document:    data.document || ''
    };

    if (editId) return StorageUtils.update(this.storageKey, editId, payload);
    return StorageUtils.add(this.storageKey, payload, 'id', 'PR');
  },

  deleteRecord(id) {
    return StorageUtils.delete(this.storageKey, id);
  }
};

window.PostalReceiveModule = PostalReceiveModule;

/* ============================================================
   PAGE INITIALISATION
============================================================ */
let currentReceiveEditId = null;

document.addEventListener('DOMContentLoaded', () => {
  StorageUtils.get(PostalReceiveModule.storageKey, PostalReceiveModule.initialData);
  bindReceiveEvents();
  renderReceiveTable();
});

function bindReceiveEvents() {
  const openBtn = document.getElementById('openAddModal');
  if (openBtn) openBtn.addEventListener('click', openReceiveAddModal);

  document.querySelectorAll('[data-close-modal="receiveModal"]').forEach(btn => {
    btn.addEventListener('click', closeReceiveModal);
  });

  const form = document.getElementById('receiveForm');
  if (form) form.addEventListener('submit', handleReceiveFormSubmit);

  const searchInput = document.getElementById('tableSearchInput');
  if (searchInput) searchInput.addEventListener('input', renderReceiveTable);

  if (window.ExportUtils) ExportUtils.bindExportButtons();
}

function openReceiveAddModal() {
  currentReceiveEditId = null;
  const form = document.getElementById('receiveForm');
  if (form) form.reset();

  const dateField = document.getElementById('receiveDate');
  if (dateField) dateField.value = new Date().toISOString().split('T')[0];

  setModalTitle('Add Postal Receive');
  openModal('receiveModal');
}

function openReceiveEditModal(id) {
  const record = PostalReceiveModule.getById(id);
  if (!record) { alert('Record not found.'); return; }

  currentReceiveEditId = id;

  const set = (fieldId, val) => {
    const el = document.getElementById(fieldId);
    if (el) el.value = val || '';
  };

  set('fromTitle',   record.fromTitle);
  set('referenceNo', record.referenceNo);
  set('address',     record.address);
  set('note',        record.note);
  set('receiveDate', record.date);
  set('receiveType', record.type);

  setModalTitle('Edit Postal Receive');
  openModal('receiveModal');
}

function closeReceiveModal() {
  closeModal('receiveModal');
  const form = document.getElementById('receiveForm');
  if (form) form.reset();
  currentReceiveEditId = null;
}

function handleReceiveFormSubmit(e) {
  e.preventDefault();
  try {
    const data = {
      fromTitle:   document.getElementById('fromTitle')?.value,
      referenceNo: document.getElementById('referenceNo')?.value,
      address:     document.getElementById('address')?.value,
      note:        document.getElementById('note')?.value,
      date:        document.getElementById('receiveDate')?.value,
      type:        document.getElementById('receiveType')?.value
    };

    PostalReceiveModule.saveRecord(data, currentReceiveEditId);
    closeReceiveModal();
    renderReceiveTable();
  } catch (err) {
    alert(err.message);
  }
}

function deleteReceiveRecord(id) {
  if (confirm('Are you sure you want to delete this receive record?')) {
    PostalReceiveModule.deleteRecord(id);
    renderReceiveTable();
  }
}

function renderReceiveTable() {
  const tbody = document.querySelector('#receiveTable tbody');
  const pager = document.querySelector('.pager span');
  if (!tbody) return;

  const query   = document.getElementById('tableSearchInput')?.value || '';
  const records = PostalReceiveModule.getRecords(query);
  const total   = PostalReceiveModule.getRecords().length;

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-cell">No postal receive records found.</td></tr>`;
  } else {
    tbody.innerHTML = records.map((r, idx) => `
      <tr data-id="${r.id}">
        <td>${idx + 1}</td>
        <td>${r.fromTitle || '—'}</td>
        <td>${r.referenceNo || '—'}</td>
        <td><span class="type-badge">${r.type || '—'}</span></td>
        <td>${formatDate(r.date)}</td>
        <td>${r.note || '—'}</td>
        <td>
          <div class="row-actions">
            <button class="act-btn edit" onclick="openReceiveEditModal('${r.id}')" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="act-btn delete" onclick="deleteReceiveRecord('${r.id}')" title="Delete">
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
  const el = document.querySelector('#receiveModal .modal-head strong');
  if (el) el.textContent = text;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

window.openReceiveEditModal = openReceiveEditModal;
window.deleteReceiveRecord  = deleteReceiveRecord;
