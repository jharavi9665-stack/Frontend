/* ============================================================
   SCHOOL ERP – admission.js
   Admission Enquiry Controller (LocalStorage Integrated)
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
    enquiryDate: '2026-07-15',
    lastFollowUpDate: '—',
    nextFollowUpDate: '2026-07-15',
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
    enquiryDate: '2026-06-29',
    lastFollowUpDate: '—',
    nextFollowUpDate: '2026-07-04',
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
    enquiryDate: '2026-06-03',
    lastFollowUpDate: '—',
    nextFollowUpDate: '2026-06-12',
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
    enquiryDate: '2026-05-22',
    lastFollowUpDate: '—',
    nextFollowUpDate: '2026-05-22',
    status: 'Active',
    studentClass: 'Class 4',
    address: 'Vasant Kunj, Delhi',
    description: 'Transport route and bus timings enquiry.'
  }
];

let currentEditId = null;

document.addEventListener('DOMContentLoaded', () => {
  initAdmissionModule();
});

function initAdmissionModule() {
  // Ensure default seed data is in localStorage if empty
  StorageUtils.get(STORAGE_KEYS.ADMISSION, INITIAL_ENQUIRIES);

  bindFormEvents();
  bindFilterEvents();
  renderAdmissionTable();
}

/**
 * Format YYYY-MM-DD to DD-MM-YYYY for table display
 */
function formatDateForDisplay(dateStr) {
  if (!dateStr || dateStr === '—') return '—';
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

/**
 * Format date for <input type="date"> (YYYY-MM-DD)
 */
function formatDateForInput(dateStr) {
  if (!dateStr || dateStr === '—') return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return '';
}

/**
 * Bind Add / Edit Form submission & Modal opening
 */
function bindFormEvents() {
  const modal = document.getElementById('addModal');
  const openBtn = document.getElementById('openAddModal');
  const form = document.getElementById('admissionForm');
  const closeBtns = document.querySelectorAll('.close-btn');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      openAddModal();
    });
  }

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAdmissionModal();
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveEnquiry();
    });
  }
}

function openAddModal() {
  const modal = document.getElementById('addModal');
  const form = document.getElementById('admissionForm');
  const modalTitle = document.querySelector('#addModal .modal-header h3');
  const submitBtn = document.querySelector('#addModal button[type="submit"]');

  currentEditId = null;
  if (form) form.reset();

  // Set default dates if empty
  const todayISO = new Date().toISOString().split('T')[0];
  const enquiryDateInput = document.getElementById('enquiryDate');
  const nextFollowUpInput = document.getElementById('nextFollowUpDate');
  if (enquiryDateInput) enquiryDateInput.value = todayISO;
  if (nextFollowUpInput) nextFollowUpInput.value = todayISO;

  if (modalTitle) modalTitle.textContent = 'Add Admission Enquiry';
  if (submitBtn) submitBtn.textContent = 'Save Enquiry';

  if (modal) modal.classList.add('active');
}

function openEditModal(id) {
  const record = StorageUtils.getById(STORAGE_KEYS.ADMISSION, id);
  if (!record) return;

  currentEditId = id;
  const modal = document.getElementById('addModal');
  const modalTitle = document.querySelector('#addModal .modal-header h3');
  const submitBtn = document.querySelector('#addModal button[type="submit"]');

  // Populate form fields
  setFieldValue('studentName', record.studentName || '');
  setFieldValue('phoneNumber', record.phoneNumber || '');
  setFieldValue('emailAddress', record.emailAddress || '');
  setFieldValue('purpose', record.purpose || 'Select Purpose');
  setFieldValue('source', record.source || 'Select Source');
  setFieldValue('reference', record.reference || '');
  setFieldValue('enquiryDate', formatDateForInput(record.enquiryDate));
  setFieldValue('nextFollowUpDate', formatDateForInput(record.nextFollowUpDate));
  setFieldValue('status', record.status || 'Active');
  setFieldValue('studentClass', record.studentClass || 'Select Class');
  setFieldValue('address', record.address || '');
  setFieldValue('description', record.description || '');

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

function setFieldValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function getFieldValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

/**
 * Save or Update Admission Enquiry
 */
function saveEnquiry() {
  const studentName = getFieldValue('studentName');
  const phoneNumber = getFieldValue('phoneNumber');
  const emailAddress = getFieldValue('emailAddress');
  const purpose = getFieldValue('purpose');
  const source = getFieldValue('source');
  const reference = getFieldValue('reference');
  const rawEnquiryDate = getFieldValue('enquiryDate');
  const rawNextFollowUp = getFieldValue('nextFollowUpDate');
  const status = getFieldValue('status') || 'Active';
  const studentClass = getFieldValue('studentClass');
  const address = getFieldValue('address');
  const description = getFieldValue('description');

  // Validation
  if (!studentName) {
    alert('Please enter the Student Name.');
    document.getElementById('studentName')?.focus();
    return;
  }
  if (!phoneNumber) {
    alert('Please enter the Phone Number.');
    document.getElementById('phoneNumber')?.focus();
    return;
  }
  if (!source || source === 'Select Source') {
    alert('Please select a Source.');
    document.getElementById('source')?.focus();
    return;
  }

  const enquiryDate = formatDateForDisplay(rawEnquiryDate) || formatDateForDisplay(new Date().toISOString().split('T')[0]);
  const nextFollowUpDate = formatDateForDisplay(rawNextFollowUp) || enquiryDate;

  const recordData = {
    studentName,
    phoneNumber,
    emailAddress,
    purpose: purpose === 'Select Purpose' ? 'Admission' : purpose,
    source,
    reference,
    enquiryDate,
    lastFollowUpDate: '—',
    nextFollowUpDate,
    status,
    studentClass: studentClass === 'Select Class' ? '' : studentClass,
    address,
    description
  };

  if (currentEditId) {
    StorageUtils.update(STORAGE_KEYS.ADMISSION, currentEditId, recordData);
  } else {
    StorageUtils.add(STORAGE_KEYS.ADMISSION, recordData, 'id', 'ENQ');
  }

  closeAdmissionModal();
  renderAdmissionTable();
}

/**
 * Delete Record
 */
function deleteEnquiry(id) {
  if (confirm(`Are you sure you want to delete enquiry ${id}?`)) {
    StorageUtils.delete(STORAGE_KEYS.ADMISSION, id);
    renderAdmissionTable();
  }
}

/**
 * Bind Search & Filter controls
 */
function bindFilterEvents() {
  const searchInput = document.getElementById('tableSearchInput');
  const filterClass = document.getElementById('filterClass');
  const filterSource = document.getElementById('filterSource');
  const filterStatus = document.getElementById('filterStatus');
  const filterFromDate = document.getElementById('filterFromDate');
  const filterToDate = document.getElementById('filterToDate');
  const btnSearch = document.getElementById('btnSearchCriteria');
  const btnReset = document.getElementById('btnResetFilters');

  const triggers = [searchInput, filterClass, filterSource, filterStatus, filterFromDate, filterToDate];
  triggers.forEach(el => {
    if (el) el.addEventListener('input', renderAdmissionTable);
    if (el) el.addEventListener('change', renderAdmissionTable);
  });

  if (btnSearch) {
    btnSearch.addEventListener('click', (e) => {
      e.preventDefault();
      renderAdmissionTable();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInput) searchInput.value = '';
      if (filterClass) filterClass.selectedIndex = 0;
      if (filterSource) filterSource.selectedIndex = 0;
      if (filterStatus) filterStatus.selectedIndex = 0;
      if (filterFromDate) filterFromDate.value = '';
      if (filterToDate) filterToDate.value = '';
      renderAdmissionTable();
    });
  }
}

/**
 * Render Table from LocalStorage with active Filters
 */
function renderAdmissionTable() {
  const tbody = document.querySelector('.table-wrap tbody');
  const pagerText = document.querySelector('.pager span');
  if (!tbody) return;

  const allRecords = StorageUtils.get(STORAGE_KEYS.ADMISSION, INITIAL_ENQUIRIES);

  // Read filter values
  const query = (document.getElementById('tableSearchInput')?.value || '').toLowerCase().trim();
  const selClass = document.getElementById('filterClass')?.value || '';
  const selSource = document.getElementById('filterSource')?.value || '';
  const selStatus = document.getElementById('filterStatus')?.value || '';
  const fromDate = document.getElementById('filterFromDate')?.value || '';
  const toDate = document.getElementById('filterToDate')?.value || '';

  const filtered = allRecords.filter(r => {
    // Search query match (name, phone, source, ID)
    if (query) {
      const matchName = (r.studentName || '').toLowerCase().includes(query);
      const matchPhone = (r.phoneNumber || '').toLowerCase().includes(query);
      const matchSource = (r.source || '').toLowerCase().includes(query);
      const matchId = (r.id || '').toLowerCase().includes(query);
      if (!matchName && !matchPhone && !matchSource && !matchId) return false;
    }

    // Class match
    if (selClass && selClass !== 'Select Class') {
      if ((r.studentClass || '') !== selClass) return false;
    }

    // Source match
    if (selSource && selSource !== 'Select Source') {
      if ((r.source || '').toLowerCase() !== selSource.toLowerCase()) return false;
    }

    // Status match
    if (selStatus && selStatus !== 'All Status' && selStatus !== '● Active') {
      const statusClean = selStatus.replace(/[●\s]/g, '');
      if ((r.status || '').toLowerCase() !== statusClean.toLowerCase()) return false;
    }

    return true;
  });

  // Render Rows
  const avatarColors = [
    { bg: '#e0e7ff', color: '#4338ca' },
    { bg: '#fef3c7', color: '#d97706' },
    { bg: '#f3e8ff', color: '#7e22ce' },
    { bg: '#ccfbf1', color: '#0d9488' }
  ];

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 24px; color: #8994a7;">No admission enquiries found matching your criteria.</td></tr>`;
  } else {
    tbody.innerHTML = filtered.map((r, idx) => {
      const av = avatarColors[idx % avatarColors.length];
      const initial = (r.studentName || 'E')[0].toUpperCase();
      const isFriend = (r.source || '').toLowerCase().includes('friend');
      const dotColor = isFriend ? '#eab308' : '#6366f1';
      const badgeBg = isFriend ? '#fefce8' : '#f8fafc';
      const badgeBorder = isFriend ? '#fef08a' : '#e2e8f0';

      const calIcon = `<svg class="cell-cal-icon" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

      const displayEnquiryDate = formatDateForDisplay(r.enquiryDate);
      const displayLastFollowUp = formatDateForDisplay(r.lastFollowUpDate);
      const displayNextFollowUp = formatDateForDisplay(r.nextFollowUpDate);

      return `<tr>
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
            <button class="act-btn call" title="Call ${r.phoneNumber || ''}" onclick="window.location.href='tel:${r.phoneNumber || ''}'">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </button>
            <button class="act-btn edit" title="Edit" onclick="openEditModal('${r.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="act-btn delete" title="Delete" onclick="deleteEnquiry('${r.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  // Update Pager count text
  if (pagerText) {
    pagerText.textContent = `Showing 1 to ${filtered.length} of ${allRecords.length} entries`;
  }
}

// Global scope export for inline onclick attributes
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.deleteEnquiry = deleteEnquiry;
