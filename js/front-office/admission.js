/* ============================================================
   SCHOOL ERP – admission.js
   Admission Enquiry Controller (LocalStorage & Modular API)
============================================================ */

const INITIAL_ENQUIRIES = [
  {
    id: 'ENQ1001',
    studentName: 'Satish',
    phoneNumber: '8788825286',
    emailAddress: 'satish@example.com',
    purpose: 'Admission',
    source: 'Notice Board',
    reference: 'Self',
    enquiryDate: '15-07-2026',
    lastFollowUpDate: '—',
    nextFollowUpDate: '15-07-2026',
    status: 'Active',
    studentClass: 'Class 1',
    address: '14 Park Road, Delhi',
    description: 'Looking for Class 1 admission details.'
  },
  {
    id: 'ENQ1002',
    studentName: 'Drishti Gupta',
    phoneNumber: '53820168065',
    emailAddress: 'drishti1@example.com',
    purpose: 'Scholarship',
    source: 'via friend',
    reference: 'Rahul Sharma',
    enquiryDate: '29-06-2026',
    lastFollowUpDate: '—',
    nextFollowUpDate: '04-07-2026',
    status: 'Active',
    studentClass: 'Class 2',
    address: 'Sector 15, Gurgaon',
    description: 'Enquired about merit scholarship schemes.'
  },
  {
    id: 'ENQ1003',
    studentName: 'Drishti Gupta',
    phoneNumber: '9047378543',
    emailAddress: 'drishti2@example.com',
    purpose: 'General Inquiry',
    source: 'Newspaper',
    reference: 'Newspaper Ad',
    enquiryDate: '03-06-2026',
    lastFollowUpDate: '—',
    nextFollowUpDate: '12-06-2026',
    status: 'Active',
    studentClass: 'Class 3',
    address: 'Civil Lines, Delhi',
    description: 'Inquired regarding fee structure and syllabus.'
  },
  {
    id: 'ENQ1004',
    studentName: 'Elan',
    phoneNumber: '9653453212',
    emailAddress: 'elan@example.com',
    purpose: 'Transport',
    source: 'Newspaper',
    reference: 'Self',
    enquiryDate: '22-05-2026',
    lastFollowUpDate: '—',
    nextFollowUpDate: '22-05-2026',
    status: 'Active',
    studentClass: 'Class 4',
    address: 'Vasant Kunj, Delhi',
    description: 'Transport route and bus timings enquiry.'
  }
];

/**
 * Admission Module Object
 */
const AdmissionModule = {
  storageKey: window.STORAGE_KEYS ? window.STORAGE_KEYS.ADMISSION : 'school_erp_admission_enquiries',
  initialData: INITIAL_ENQUIRIES,

  /**
   * Helper: Format Date for Display (DD-MM-YYYY)
   */
  formatDisplayDate(dateStr) {
    if (!dateStr || dateStr === '—') return '—';
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  },

  /**
   * Helper: Format Date for <input type="date"> (YYYY-MM-DD)
   */
  formatInputDate(dateStr) {
    if (!dateStr || dateStr === '—') return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return '';
  },

  /**
   * Get all admission records from LocalStorage with optional filters
   */
  getRecords(filters = {}) {
    const allRecords = StorageUtils.get(this.storageKey, this.initialData);
    const { query = '', studentClass = '', source = '', status = '', fromDate = '', toDate = '' } = filters;

    return allRecords.filter(r => {
      // Search Query Filter
      if (query) {
        const q = query.toLowerCase();
        const matchName = (r.studentName || '').toLowerCase().includes(q);
        const matchPhone = (r.phoneNumber || '').toLowerCase().includes(q);
        const matchSource = (r.source || '').toLowerCase().includes(q);
        const matchId = (r.id || '').toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchSource && !matchId) return false;
      }
      // Class Filter
      if (studentClass && studentClass !== 'Select Class') {
        if ((r.studentClass || '') !== studentClass) return false;
      }
      // Source Filter
      if (source && source !== 'Select Source') {
        if ((r.source || '').toLowerCase() !== source.toLowerCase()) return false;
      }
      // Status Filter
      if (status && status !== 'All Status' && status !== '● Active') {
        const statusClean = status.replace(/[●\s]/g, '');
        if ((r.status || '').toLowerCase() !== statusClean.toLowerCase()) return false;
      }
      return true;
    });
  },

  /**
   * Get single record by ID
   */
  getById(id) {
    return StorageUtils.getById(this.storageKey, id);
  },

  /**
   * Save or Update Record
   */
  saveRecord(recordData, editId = null) {
    if (!recordData.studentName || !recordData.phoneNumber) {
      throw new Error('Student Name and Phone Number are required.');
    }

    const payload = {
      studentName: recordData.studentName,
      phoneNumber: recordData.phoneNumber,
      emailAddress: recordData.emailAddress || '',
      purpose: recordData.purpose || 'Admission',
      source: recordData.source || 'Notice Board',
      reference: recordData.reference || 'Self',
      enquiryDate: this.formatDisplayDate(recordData.enquiryDate) || this.formatDisplayDate(new Date().toISOString().split('T')[0]),
      lastFollowUpDate: recordData.lastFollowUpDate || '—',
      nextFollowUpDate: this.formatDisplayDate(recordData.nextFollowUpDate) || this.formatDisplayDate(recordData.enquiryDate),
      status: recordData.status || 'Active',
      studentClass: recordData.studentClass || '',
      address: recordData.address || '',
      description: recordData.description || ''
    };

    if (editId) {
      return StorageUtils.update(this.storageKey, editId, payload);
    } else {
      return StorageUtils.add(this.storageKey, payload, 'id', 'ENQ');
    }
  },

  /**
   * Delete Record
   */
  deleteRecord(id) {
    return StorageUtils.delete(this.storageKey, id);
  },

  /**
   * Generate HTML for Table Rows
   */
  renderRowsHtml(records) {
    const avatarVariants = [
      { bg: '#e0e7ff', color: '#4338ca' },
      { bg: '#fef3c7', color: '#d97706' },
      { bg: '#f3e8ff', color: '#7e22ce' },
      { bg: '#ccfbf1', color: '#0d9488' }
    ];

    if (!records || records.length === 0) {
      return `<tr><td colspan="8" style="text-align:center; padding: 24px; color: #8994a7;">No admission enquiries found matching your criteria.</td></tr>`;
    }

    return records.map((r, idx) => {
      const av = avatarVariants[idx % avatarVariants.length];
      const initial = (r.studentName || 'E')[0].toUpperCase();
      const isFriend = (r.source || '').toLowerCase().includes('friend');
      const dotColor = isFriend ? '#eab308' : '#6366f1';
      const badgeBg = isFriend ? '#fefce8' : '#f8fafc';
      const badgeBorder = isFriend ? '#fef08a' : '#e2e8f0';

      const calIcon = `<svg class="cell-cal-icon" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

      const displayEnquiryDate = this.formatDisplayDate(r.enquiryDate);
      const displayLastFollowUp = this.formatDisplayDate(r.lastFollowUpDate);
      const displayNextFollowUp = this.formatDisplayDate(r.nextFollowUpDate);

      return `<tr data-id="${r.id}">
        <td>
          <span class="person">
            <span class="initial" style="background:${av.bg}; color:${av.color};">${initial}</span>
            <span class="person-name">${r.studentName || '—'}</span>
          </span>
        </td>
        <td>${r.phoneNumber || '—'}</td>
        <td>
          <span class="source-badge" style="background:${badgeBg}; border:1px solid ${badgeBorder};">
            <span class="source-dot" style="background:${dotColor};"></span>
            ${r.source || '—'}
          </span>
        </td>
        <td><span class="date-cell">${calIcon} ${displayEnquiryDate}</span></td>
        <td>${displayLastFollowUp === '—' || !displayLastFollowUp ? '—' : `<span class="date-cell">${calIcon} ${displayLastFollowUp}</span>`}</td>
        <td><span class="date-cell">${calIcon} ${displayNextFollowUp}</span></td>
        <td><span class="status status-active"><span class="status-dot">●</span> ${r.status || 'Active'}</span></td>
        <td>
          <div class="row-actions">
            <button class="act-btn call" data-action="view" data-id="${r.id}" title="Call" onclick="window.location.href='tel:${r.phoneNumber || ''}'">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </button>
            <button class="act-btn edit" data-action="edit" data-id="${r.id}" title="Edit" onclick="if(window.openEditModal) openEditModal('${r.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="act-btn delete" data-action="delete" data-id="${r.id}" title="Delete" onclick="if(window.deleteEnquiry) deleteEnquiry('${r.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }
};

window.AdmissionModule = AdmissionModule;

/* Standalone Page Initialization for admission.html */
let currentEditId = null;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('admissionForm') && document.querySelector('.table-wrap tbody')) {
    initAdmissionStandalonePage();
  }
});

function initAdmissionStandalonePage() {
  StorageUtils.get(AdmissionModule.storageKey, AdmissionModule.initialData);

  const form = document.getElementById('admissionForm');
  const openBtn = document.getElementById('openAddModal');
  const closeBtns = document.querySelectorAll('.close-btn');

  if (openBtn) openBtn.addEventListener('click', openAddModal);
  closeBtns.forEach(btn => btn.addEventListener('click', closeAdmissionModal));

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      try {
        const formData = {
          studentName: document.getElementById('studentName')?.value.trim(),
          phoneNumber: document.getElementById('phoneNumber')?.value.trim(),
          emailAddress: document.getElementById('emailAddress')?.value.trim(),
          studentClass: document.getElementById('studentClass')?.value,
          purpose: document.getElementById('purpose')?.value,
          source: document.getElementById('source')?.value,
          reference: document.getElementById('reference')?.value.trim(),
          enquiryDate: document.getElementById('enquiryDate')?.value,
          nextFollowUpDate: document.getElementById('nextFollowUpDate')?.value,
          status: document.getElementById('status')?.value,
          address: document.getElementById('address')?.value.trim(),
          description: document.getElementById('description')?.value.trim()
        };

        AdmissionModule.saveRecord(formData, currentEditId);
        closeAdmissionModal();
        renderAdmissionTable();
      } catch (err) {
        alert(err.message);
      }
    });
  }

  // Bind Filter Events
  const triggers = ['tableSearchInput', 'filterClass', 'filterSource', 'filterStatus', 'filterFromDate', 'filterToDate'];
  triggers.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', renderAdmissionTable);
      el.addEventListener('change', renderAdmissionTable);
    }
  });

  const btnReset = document.getElementById('btnResetFilters');
  if (btnReset) {
    btnReset.addEventListener('click', e => {
      e.preventDefault();
      ['tableSearchInput', 'filterClass', 'filterSource', 'filterStatus', 'filterFromDate', 'filterToDate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          if (el.tagName === 'SELECT') el.selectedIndex = 0;
          else el.value = '';
        }
      });
      renderAdmissionTable();
    });
  }

  renderAdmissionTable();
}

function openAddModal() {
  const modal = document.getElementById('addModal');
  const form = document.getElementById('admissionForm');
  const modalTitle = document.querySelector('#addModal .modal-header h3');
  const submitBtn = document.querySelector('#addModal button[type="submit"]');

  currentEditId = null;
  if (form) form.reset();

  const todayISO = new Date().toISOString().split('T')[0];
  if (document.getElementById('enquiryDate')) document.getElementById('enquiryDate').value = todayISO;
  if (document.getElementById('nextFollowUpDate')) document.getElementById('nextFollowUpDate').value = todayISO;

  if (modalTitle) modalTitle.textContent = 'Add Admission Enquiry';
  if (submitBtn) submitBtn.textContent = 'Save Enquiry';

  if (modal) modal.classList.add('active');
}

function openEditModal(id) {
  const record = AdmissionModule.getById(id);
  if (!record) return;

  currentEditId = id;
  const modal = document.getElementById('addModal');
  const modalTitle = document.querySelector('#addModal .modal-header h3');
  const submitBtn = document.querySelector('#addModal button[type="submit"]');

  const setVal = (fieldId, val) => {
    const el = document.getElementById(fieldId);
    if (el) el.value = val || '';
  };

  setVal('studentName', record.studentName);
  setVal('phoneNumber', record.phoneNumber);
  setVal('emailAddress', record.emailAddress);
  setVal('studentClass', record.studentClass || 'Select Class');
  setVal('purpose', record.purpose || 'Select Purpose');
  setVal('source', record.source || 'Select Source');
  setVal('reference', record.reference);
  setVal('enquiryDate', AdmissionModule.formatInputDate(record.enquiryDate));
  setVal('nextFollowUpDate', AdmissionModule.formatInputDate(record.nextFollowUpDate));
  setVal('status', record.status || 'Active');
  setVal('address', record.address);
  setVal('description', record.description);

  if (modalTitle) modalTitle.textContent = 'Edit Admission Enquiry';
  if (submitBtn) submitBtn.textContent = 'Update Enquiry';

  if (modal) modal.classList.add('active');
}

function closeAdmissionModal() {
  const modal = document.getElementById('addModal');
  const form = document.getElementById('admissionForm');
  if (modal) modal.classList.remove('active');
  if (form) form.reset();
  currentEditId = null;
}

function deleteEnquiry(id) {
  if (confirm(`Are you sure you want to delete enquiry ${id}?`)) {
    AdmissionModule.deleteRecord(id);
    renderAdmissionTable();
  }
}

function renderAdmissionTable() {
  const tbody = document.querySelector('.table-wrap tbody');
  const pagerText = document.querySelector('.pager span');
  if (!tbody) return;

  const filters = {
    query: document.getElementById('tableSearchInput')?.value || '',
    studentClass: document.getElementById('filterClass')?.value || '',
    source: document.getElementById('filterSource')?.value || '',
    status: document.getElementById('filterStatus')?.value || ''
  };

  const records = AdmissionModule.getRecords(filters);
  const totalCount = AdmissionModule.getRecords().length;

  tbody.innerHTML = AdmissionModule.renderRowsHtml(records);

  if (pagerText) {
    pagerText.textContent = `Showing 1 to ${records.length} of ${totalCount} entries`;
  }

  if (window.ExportUtils) {
    ExportUtils.bindExportButtons();
  }
}

window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.deleteEnquiry = deleteEnquiry;
