/* ============================================================
   SCHOOL ERP – visitor.js
   Visitor Book Controller (LocalStorage-backed)
============================================================ */

const INITIAL_VISITORS = [
  {
    id: 'VIS1001',
    name: 'xyz',
    phone: '8788825286',
    purpose: 'Student Enquiry',
    meetingWith: 'Staff (Avantika Singh - 101)',
    noOfPerson: '0',
    idProof: '—',
    date: '03-06-2026',
    inTime: '04:46 PM',
    outTime: '04:46 PM',
    address: '14 Park Road, Delhi',
    note: 'Student enquiry for session 2026-27'
  },
  {
    id: 'VIS1002',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    purpose: 'Meeting Principal',
    meetingWith: 'Principal',
    noOfPerson: '1',
    idProof: 'Aadhaar 8921',
    date: '10-07-2026',
    inTime: '10:30 AM',
    outTime: '11:15 AM',
    address: 'Civil Lines, Delhi',
    note: 'Regarding admissions'
  },
  {
    id: 'VIS1003',
    name: 'Sunita Sharma',
    phone: '9012345678',
    purpose: 'Parent Meeting',
    meetingWith: 'Class Teacher',
    noOfPerson: '2',
    idProof: 'PAN ABCDE1234F',
    date: '12-07-2026',
    inTime: '09:00 AM',
    outTime: '09:45 AM',
    address: 'Sector 15, Gurgaon',
    note: "Regarding ward's performance"
  }
];

const VisitorModule = {
  storageKey: window.STORAGE_KEYS ? window.STORAGE_KEYS.VISITOR : 'school_erp_visitors',
  initialData: INITIAL_VISITORS,

  getRecords(filterParam = '') {
    // Ensure initial data if storage is empty
    let all = StorageUtils.get(this.storageKey, null);
    if (!all || !all.length) {
      StorageUtils.set(this.storageKey, this.initialData);
      all = this.initialData;
    }

    if (!filterParam) return all;

    let query = '';
    let purpose = '';
    let dateRange = '';

    if (typeof filterParam === 'string') {
      query = filterParam.toLowerCase().trim();
    } else if (typeof filterParam === 'object') {
      query = (filterParam.query || '').toLowerCase().trim();
      purpose = (filterParam.purpose || '').toLowerCase().trim();
      dateRange = (filterParam.dateRange || filterParam.date || '').trim();
    }

    return all.filter(r => {
      const matchQuery = !query ||
        (r.name || '').toLowerCase().includes(query) ||
        (r.phone || '').toLowerCase().includes(query) ||
        (r.purpose || '').toLowerCase().includes(query) ||
        (r.meetingWith || '').toLowerCase().includes(query) ||
        (r.idProof || '').toLowerCase().includes(query) ||
        (r.inTime || '').toLowerCase().includes(query) ||
        (r.outTime || '').toLowerCase().includes(query) ||
        (r.date || '').toLowerCase().includes(query);

      const matchPurpose = !purpose || purpose === 'all purpose' ||
        (r.purpose || '').toLowerCase() === purpose;

      const matchDate = !dateRange || (r.date || '').includes(dateRange);

      return matchQuery && matchPurpose && matchDate;
    });
  },

  getById(id) {
    return StorageUtils.getById(this.storageKey, id, 'id');
  },

  formatDisplayDate(d) {
    if (!d) return '—';
    if (/^\d{2}-\d{2}-\d{4}$/.test(d)) return d;
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  },

  renderRowsHtml(records) {
    if (!records || !records.length) {
      return `<tr><td colspan="10" class="empty-cell" style="text-align:center;padding:32px;color:#8994a7;">No records found.</td></tr>`;
    }

    return records.map(r => `
      <tr data-id="${r.id}">
        <td>
          <div class="purpose-badge">
            <span class="purpose-badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </span>
            <span>${r.purpose || 'Student Enquiry'}</span>
          </div>
        </td>
        <td>${r.meetingWith || '—'}</td>
        <td style="font-weight:600;color:#1e293b;">${r.name || '—'}</td>
        <td>
          <span class="cell-with-icon">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            ${r.phone || '—'}
          </span>
        </td>
        <td>
          <span class="cell-with-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h2M7 16h10"/></svg>
            ${r.idProof || '—'}
          </span>
        </td>
        <td>
          <span class="cell-with-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            ${r.noOfPerson ?? '0'}
          </span>
        </td>
        <td>
          <span class="cell-with-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${this.formatDisplayDate(r.date)}
          </span>
        </td>
        <td>
          <span class="cell-with-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${r.inTime || '—'}
          </span>
        </td>
        <td>
          <span class="cell-with-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${r.outTime || '—'}
          </span>
        </td>
        <td>
          <div class="row-actions" style="display:flex;gap:5px;justify-content:center;">
            <button class="visitor-act-btn view" data-action="view" data-id="${r.id}" title="View Details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button class="visitor-act-btn edit" data-action="edit" data-id="${r.id}" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="visitor-act-btn delete" data-action="delete" data-id="${r.id}" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  saveRecord(data, editId = null) {
    if (!data.name || !data.name.trim()) throw new Error('Visitor Name is required.');
    if (!data.phone || !data.phone.trim()) throw new Error('Phone Number is required.');

    const payload = {
      name:        data.name.trim(),
      phone:       data.phone.trim(),
      purpose:     data.purpose || 'Student Enquiry',
      meetingWith: data.meetingWith || '',
      noOfPerson:  data.noOfPerson !== undefined ? String(data.noOfPerson) : '0',
      idProof:     data.idProof || '—',
      date:        data.date || new Date().toISOString().split('T')[0],
      inTime:      data.inTime || '04:46 PM',
      outTime:     data.outTime || '04:46 PM',
      address:     data.address || '',
      note:        data.note || ''
    };

    if (editId) {
      return StorageUtils.update(this.storageKey, editId, payload);
    }
    return StorageUtils.add(this.storageKey, payload, 'id', 'VIS');
  },

  deleteRecord(id) {
    return StorageUtils.delete(this.storageKey, id);
  }
};

window.VisitorModule = VisitorModule;

/* ============================================================
   PAGE INITIALISATION (for standalone visitor.html)
============================================================ */
let currentVisitorEditId = null;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('visitorTable') || document.querySelector('.visitor-table')) {
    StorageUtils.get(VisitorModule.storageKey, VisitorModule.initialData);
    bindVisitorEvents();
    renderVisitorTable();
  }
});

function getActiveVisitorFilters() {
  return {
    query:     document.getElementById('tableSearchInput')?.value || '',
    purpose:   document.getElementById('filterPurpose')?.value || '',
    dateRange: document.getElementById('filterDateRange')?.value || ''
  };
}

function bindVisitorEvents() {
  const openBtn = document.getElementById('openAddModal') || document.getElementById('addRecord');
  if (openBtn) openBtn.addEventListener('click', openVisitorAddModal);

  document.querySelectorAll('[data-close-modal="visitorModal"]').forEach(btn => {
    btn.addEventListener('click', closeVisitorModal);
  });

  const form = document.getElementById('visitorForm');
  if (form) form.addEventListener('submit', handleVisitorFormSubmit);

  const searchInput = document.getElementById('tableSearchInput');
  if (searchInput) searchInput.addEventListener('input', renderVisitorTable);

  const purposeSelect = document.getElementById('filterPurpose');
  if (purposeSelect) purposeSelect.addEventListener('change', renderVisitorTable);

  const dateRangeInput = document.getElementById('filterDateRange');
  if (dateRangeInput) {
    dateRangeInput.addEventListener('input', renderVisitorTable);
    dateRangeInput.addEventListener('change', renderVisitorTable);
  }

  const btnReset = document.getElementById('btnResetFilters');
  if (btnReset) {
    btnReset.addEventListener('click', e => {
      e.preventDefault();
      if (searchInput) searchInput.value = '';
      if (purposeSelect) purposeSelect.selectedIndex = 0;
      if (dateRangeInput) dateRangeInput.value = '';
      renderVisitorTable();
    });
  }

  if (window.ExportUtils) ExportUtils.bindExportButtons();
}

function openVisitorAddModal() {
  currentVisitorEditId = null;
  const form = document.getElementById('visitorForm');
  if (form) form.reset();

  const dateField = document.getElementById('visitorDate');
  if (dateField) dateField.value = new Date().toISOString().split('T')[0];

  const inTimeField = document.getElementById('inTime');
  if (inTimeField && !inTimeField.value) inTimeField.value = '04:46 PM';

  const outTimeField = document.getElementById('outTime');
  if (outTimeField && !outTimeField.value) outTimeField.value = '04:46 PM';

  setModalTitle('Add Visitor');
  openModal('visitorModal');
}

function openVisitorEditModal(id) {
  const record = VisitorModule.getById(id);
  if (!record) { alert('Record not found.'); return; }

  currentVisitorEditId = id;

  const set = (fieldId, val) => {
    const el = document.getElementById(fieldId);
    if (el) el.value = val !== undefined ? val : '';
  };

  set('visitorName',    record.name);
  set('visitorPhone',   record.phone);
  set('visitorPurpose', record.purpose);
  set('meetingWith',    record.meetingWith);
  set('noOfPerson',     record.noOfPerson);
  set('idProof',        record.idProof);
  set('visitorDate',    record.date);
  set('inTime',         record.inTime);
  set('outTime',        record.outTime);
  set('visitorAddress', record.address);
  set('visitorNote',    record.note);

  setModalTitle('Edit Visitor');
  openModal('visitorModal');
}

function viewVisitorDetails(id) {
  const record = VisitorModule.getById(id);
  if (!record) return;

  const detailsHtml = `
    <div style="padding:10px 0;line-height:1.7;font-size:13px;color:#334155;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #eef2f6;">
        <span class="purpose-badge" style="font-size:13px;">${record.purpose || 'Student Enquiry'}</span>
        <span style="font-size:12px;color:#64748b;">ID: <strong>${record.id}</strong></span>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr><td style="padding:6px 0;font-weight:600;color:#102454;width:40%;">Visitor Name:</td><td>${record.name || '—'}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;color:#102454;">Meeting With:</td><td>${record.meetingWith || '—'}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;color:#102454;">Phone:</td><td>${record.phone || '—'}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;color:#102454;">ID Proof / Card:</td><td>${record.idProof || '—'}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;color:#102454;">Number Of Persons:</td><td>${record.noOfPerson ?? '0'}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;color:#102454;">Date:</td><td>${VisitorModule.formatDisplayDate(record.date)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;color:#102454;">In / Out Time:</td><td>${record.inTime || '—'} – ${record.outTime || '—'}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;color:#102454;">Address:</td><td>${record.address || '—'}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;color:#102454;">Note:</td><td>${record.note || '—'}</td></tr>
      </table>
    </div>
  `;

  if (document.getElementById('viewModalBody')) {
    document.getElementById('viewModalBody').innerHTML = detailsHtml;
    openModal('viewVisitorModal');
  } else {
    alert(`Visitor: ${record.name}\nPurpose: ${record.purpose}\nMeeting With: ${record.meetingWith}\nPhone: ${record.phone}\nDate: ${record.date}\nIn Time: ${record.inTime}\nOut Time: ${record.outTime}`);
  }
}

function closeVisitorModal() {
  closeModal('visitorModal');
  const form = document.getElementById('visitorForm');
  if (form) form.reset();
  currentVisitorEditId = null;
}

function handleVisitorFormSubmit(e) {
  e.preventDefault();
  try {
    const data = {
      name:        document.getElementById('visitorName')?.value,
      phone:       document.getElementById('visitorPhone')?.value,
      purpose:     document.getElementById('visitorPurpose')?.value,
      meetingWith: document.getElementById('meetingWith')?.value,
      noOfPerson:  document.getElementById('noOfPerson')?.value || '0',
      idProof:     document.getElementById('idProof')?.value || '—',
      date:        document.getElementById('visitorDate')?.value,
      inTime:      document.getElementById('inTime')?.value,
      outTime:     document.getElementById('outTime')?.value,
      address:     document.getElementById('visitorAddress')?.value,
      note:        document.getElementById('visitorNote')?.value
    };

    VisitorModule.saveRecord(data, currentVisitorEditId);
    closeVisitorModal();
    renderVisitorTable();
  } catch (err) {
    alert(err.message);
  }
}

function deleteVisitorRecord(id) {
  if (confirm('Are you sure you want to delete this visitor record?')) {
    VisitorModule.deleteRecord(id);
    renderVisitorTable();
  }
}

function renderVisitorTable() {
  const tbody  = document.querySelector('#visitorTable tbody') || document.querySelector('.visitor-table tbody');
  const pager  = document.querySelector('.visitor-pagination-bar .pagination-info') || document.querySelector('.pager span');
  if (!tbody) return;

  const filters = getActiveVisitorFilters();
  const records = VisitorModule.getRecords(filters);
  const total   = VisitorModule.getRecords().length;

  tbody.innerHTML = VisitorModule.renderRowsHtml(records);

  if (pager) {
    pager.textContent = records.length === 0
      ? 'No records found'
      : `Showing 1 to ${records.length} of ${total} entries`;
  }

  // Bind actions
  tbody.querySelectorAll('[data-action]').forEach(btn => {
    btn.onclick = e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === 'view') viewVisitorDetails(id);
      else if (action === 'edit') openVisitorEditModal(id);
      else if (action === 'delete') deleteVisitorRecord(id);
    };
  });

  if (window.ExportUtils) ExportUtils.bindExportButtons();
}

function setModalTitle(text) {
  const el = document.querySelector('#visitorModal .modal-head strong') || document.getElementById('modalTitle');
  if (el) el.textContent = text;
}

window.openVisitorEditModal  = openVisitorEditModal;
window.deleteVisitorRecord   = deleteVisitorRecord;
window.viewVisitorDetails    = viewVisitorDetails;
