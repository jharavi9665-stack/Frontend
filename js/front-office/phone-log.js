/* ============================================================
   SCHOOL ERP – phone-log.js
   Phone Call Log Controller (LocalStorage-backed)
============================================================ */

const INITIAL_PHONE_LOGS = [
  {
    id: 'PH1001',
    name:          'Mrs. Priya Verma',
    phone:         '9871234560',
    date:          '2026-07-09',
    followUpDate:  '2026-07-16',
    callType:      'Incoming',
    duration:      '8 min',
    description:   'Query about Class 3 admission process.',
    note:          'Will call back after documents are ready.'
  },
  {
    id: 'PH1002',
    name:          'Mr. Arjun Nair',
    phone:         '9988776655',
    date:          '2026-07-10',
    followUpDate:  '',
    callType:      'Outgoing',
    duration:      '5 min',
    description:   'Reminder for fee payment due this Friday.',
    note:          ''
  }
];

const PhoneLogModule = {
  storageKey: window.STORAGE_KEYS ? window.STORAGE_KEYS.PHONE_LOG : 'school_erp_phone_logs',
  initialData: INITIAL_PHONE_LOGS,

  getRecords(query = '') {
    const all = StorageUtils.get(this.storageKey, this.initialData);
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(r =>
      (r.name || '').toLowerCase().includes(q) ||
      (r.phone || '').toLowerCase().includes(q) ||
      (r.callType || '').toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q)
    );
  },

  getById(id) {
    return StorageUtils.getById(this.storageKey, id, 'id');
  },

  saveRecord(data, editId = null) {
    if (!data.name || !data.name.trim()) throw new Error('Caller Name is required.');
    if (!data.phone || !data.phone.trim()) throw new Error('Phone Number is required.');
    if (!data.date) throw new Error('Date is required.');

    const payload = {
      name:         data.name.trim(),
      phone:        data.phone.trim(),
      date:         data.date,
      followUpDate: data.followUpDate || '',
      callType:     data.callType || 'Incoming',
      duration:     data.duration || '',
      description:  data.description || '',
      note:         data.note || ''
    };

    if (editId) return StorageUtils.update(this.storageKey, editId, payload);
    return StorageUtils.add(this.storageKey, payload, 'id', 'PH');
  },

  deleteRecord(id) {
    return StorageUtils.delete(this.storageKey, id);
  }
};

window.PhoneLogModule = PhoneLogModule;

/* ============================================================
   PAGE INITIALISATION
============================================================ */
let currentPhoneEditId = null;

document.addEventListener('DOMContentLoaded', () => {
  StorageUtils.get(PhoneLogModule.storageKey, PhoneLogModule.initialData);
  bindPhoneLogEvents();
  renderPhoneLogTable();
});

function bindPhoneLogEvents() {
  const openBtn = document.getElementById('openAddModal');
  if (openBtn) openBtn.addEventListener('click', openPhoneLogAddModal);

  document.querySelectorAll('[data-close-modal="phoneModal"]').forEach(btn => {
    btn.addEventListener('click', closePhoneLogModal);
  });

  const form = document.getElementById('phoneForm');
  if (form) form.addEventListener('submit', handlePhoneFormSubmit);

  const searchInput = document.getElementById('tableSearchInput');
  if (searchInput) searchInput.addEventListener('input', renderPhoneLogTable);

  if (window.ExportUtils) ExportUtils.bindExportButtons();
}

function openPhoneLogAddModal() {
  currentPhoneEditId = null;
  const form = document.getElementById('phoneForm');
  if (form) form.reset();

  const dateField = document.getElementById('callDate');
  if (dateField) dateField.value = new Date().toISOString().split('T')[0];

  setModalTitle('Add Phone Call Log');
  openModal('phoneModal');
}

function openPhoneLogEditModal(id) {
  const record = PhoneLogModule.getById(id);
  if (!record) { alert('Record not found.'); return; }

  currentPhoneEditId = id;

  const set = (fieldId, val) => {
    const el = document.getElementById(fieldId);
    if (el) el.value = val || '';
  };

  set('callerName',     record.name);
  set('callerPhone',    record.phone);
  set('callDate',       record.date);
  set('followUpDate',   record.followUpDate);
  set('callType',       record.callType);
  set('callDuration',   record.duration);
  set('callDesc',       record.description);
  set('callNote',       record.note);

  setModalTitle('Edit Phone Call Log');
  openModal('phoneModal');
}

function closePhoneLogModal() {
  closeModal('phoneModal');
  const form = document.getElementById('phoneForm');
  if (form) form.reset();
  currentPhoneEditId = null;
}

function handlePhoneFormSubmit(e) {
  e.preventDefault();
  try {
    const data = {
      name:         document.getElementById('callerName')?.value,
      phone:        document.getElementById('callerPhone')?.value,
      date:         document.getElementById('callDate')?.value,
      followUpDate: document.getElementById('followUpDate')?.value,
      callType:     document.getElementById('callType')?.value,
      duration:     document.getElementById('callDuration')?.value,
      description:  document.getElementById('callDesc')?.value,
      note:         document.getElementById('callNote')?.value
    };

    PhoneLogModule.saveRecord(data, currentPhoneEditId);
    closePhoneLogModal();
    renderPhoneLogTable();
  } catch (err) {
    alert(err.message);
  }
}

function deletePhoneLogRecord(id) {
  if (confirm('Are you sure you want to delete this call log?')) {
    PhoneLogModule.deleteRecord(id);
    renderPhoneLogTable();
  }
}

function renderPhoneLogTable() {
  const tbody = document.querySelector('#phoneTable tbody');
  const pager = document.querySelector('.pager span');
  if (!tbody) return;

  const query   = document.getElementById('tableSearchInput')?.value || '';
  const records = PhoneLogModule.getRecords(query);
  const total   = PhoneLogModule.getRecords().length;

  const callTypeBadge = (type) => {
    const map = {
      'Incoming': { bg: '#dcfce7', color: '#16a34a' },
      'Outgoing': { bg: '#dbeafe', color: '#1d4ed8' },
      'Missed':   { bg: '#fee2e2', color: '#dc2626' }
    };
    const s = map[type] || map['Incoming'];
    return `<span class="type-badge" style="background:${s.bg};color:${s.color};">${type}</span>`;
  };

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-cell">No phone call log records found.</td></tr>`;
  } else {
    tbody.innerHTML = records.map((r, idx) => `
      <tr data-id="${r.id}">
        <td>${idx + 1}</td>
        <td><span class="person">
          <span class="initial" style="background:#fef3c7;color:#d97706;">${(r.name || 'P')[0].toUpperCase()}</span>
          <span class="person-name">${r.name || '—'}</span>
        </span></td>
        <td>${r.phone || '—'}</td>
        <td>${callTypeBadge(r.callType || 'Incoming')}</td>
        <td>${formatDate(r.date)}</td>
        <td>${r.followUpDate ? formatDate(r.followUpDate) : '—'}</td>
        <td>${r.duration || '—'}</td>
        <td>
          <div class="row-actions">
            <button class="act-btn edit" onclick="openPhoneLogEditModal('${r.id}')" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="act-btn delete" onclick="deletePhoneLogRecord('${r.id}')" title="Delete">
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
  const el = document.querySelector('#phoneModal .modal-head strong');
  if (el) el.textContent = text;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

window.openPhoneLogEditModal = openPhoneLogEditModal;
window.deletePhoneLogRecord  = deletePhoneLogRecord;
