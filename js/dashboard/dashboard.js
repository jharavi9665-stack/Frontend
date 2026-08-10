/* ============================================================
   SCHOOL ERP – dashboard.js
   Admin Dashboard Main Orchestrator & View Controller
============================================================ */

/* ------------------------------------------------------------
   1. MODULE METADATA & CONFIGURATION
------------------------------------------------------------ */
const viewInfo = {
  admission:     ['Admission Enquiry',     'Manage all prospective student enquiries'],
  visitor:       ['Visitor Book',          'Record and monitor visitors to the school'],
  dispatch:      ['Postal Dispatch',       'Track outgoing correspondence'],
  receive:       ['Postal Receive',        'Track incoming correspondence'],
  phone:         ['Phone Call Log',        'Maintain all school call records'],
  complaint:     ['Complaint List',        'Track and resolve complaints'],
  purpose:       ['Purpose Management',    'Configure enquiry and visitor purposes'],
  complaintType: ['Complaint Type Mgmt',   'Configure complaint categories'],
  source:        ['Source Management',     'Configure enquiry sources'],
  reference:     ['Reference Management',  'Manage references'],

  // Student Information Sub-modules
  studentDetails:    ['Student Details',    'View and manage all enrolled students'],
  studentAdmission:  ['Student Admission',  'Admit new students to the school'],
  onlineAdmission:   ['Online Admission',   'Manage online admission requests'],
  disabledStudents:  ['Disabled Students',  'View students with disabled accounts'],
  bulkDelete:        ['Bulk Delete',        'Bulk remove student records'],
  studentCategories: ['Student Categories', 'Manage student category types'],
  studentHouse:      ['Student House',      'Manage school house assignments'],
  disableReason:     ['Disable Reason',     'Configure reasons for disabling students']
};

/** Form Field Definitions per Module */
function fields(type) {
  const definitions = {
    admission: [
      'Name *|Enter full name',
      'Phone *|Enter phone number',
      'Email|Enter email address',
      'Address|Enter full address',
      'Description|Enquiry details...',
      'Note|Additional notes...',
      'Date *|DD-MM-YYYY',
      'Next Follow Up Date *|DD-MM-YYYY',
      'Assigned|Select staff',
      'Reference|Select reference',
      'Source *|Select source',
      'Class|Select class',
      'Number Of Child|Enter number of children'
    ],
    visitor:   ['Name *|Enter visitor name','Phone *|Enter phone number','Purpose *|Select purpose','Meeting With|Select staff','Date *|DD-MM-YYYY','In Time|10:30 AM','Out Time|Select out time','ID Proof|Enter ID proof number','Address|Enter address','Note|Additional notes...'],
    dispatch:  ['To Title *|Enter receiver name','Reference No.|Enter reference number','Address *|Enter full address','Note|Enter dispatch notes','From Title|School Office','Date *|DD-MM-YYYY','Type|Select dispatch type','Document|Choose file'],
    receive:   ['From Title *|Enter sender name','Reference No.|Enter reference number','Address|Enter address','Note|Enter receive notes','Date *|DD-MM-YYYY','Type|Select receive type','Document|Choose file'],
    phone:     ['Name *|Enter caller name','Phone *|Enter phone number','Date *|DD-MM-YYYY','Follow Up Date|DD-MM-YYYY','Call Type|Select call type','Duration|Enter call duration','Description|Enter call details','Note|Additional notes...'],
    complaint: ['Complain By *|Enter complainant name','Phone|Enter phone number','Date *|DD-MM-YYYY','Type *|Select complaint type','Source|Select source','Assigned|Select staff','Description *|Describe the complaint','Action Taken|Enter action taken'],
    purpose:   ['Purpose *|Enter purpose name','Description|Enter description'],
    complaintType:['Complaint Type *|Enter complaint type','Description|Enter description'],
    source:    ['Source *|Enter source name','Description|Enter description'],
    reference: ['Reference *|Enter reference name','Contact|Enter contact details','Description|Enter description']
  };
  return definitions[type] || definitions.admission;
}

/* ------------------------------------------------------------
   2. DASHBOARD STATE & UTILITY HELPERS
------------------------------------------------------------ */
let current = 'home';
let editingRecordId = null;

let chartMonthly = null;
let chartSession = null;
let chartIncome = null;
let chartExpense = null;

const $ = s => document.querySelector(s);
const title = s => s.replace(/\b\w/g, c => c.toUpperCase());

/* ------------------------------------------------------------
   3. HOME VIEW & CHARTS RENDERER
------------------------------------------------------------ */
function renderHome() {
  $('#app').innerHTML = `
    <!-- Operational Overview -->
    <p class="dash-section-title">Operational Overview</p>
    <div class="overview-grid">
      <div class="overview-card">
        <div class="overview-card-top">
          <svg class="ov-ico" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="#5b7ab8" stroke-width="1.5"/><path d="M3 10h18M8 3v4M16 3v4" stroke="#5b7ab8" stroke-width="1.5"/><path d="M7 14h4M7 17h6" stroke="#5b7ab8" stroke-width="1.5"/></svg>
          <span class="overview-card-label">FEES AWAITING PAYMENT</span>
        </div>
        <div class="overview-card-val">2 <span>/ 150</span></div>
      </div>
      <div class="overview-card">
        <div class="overview-card-top">
          <svg class="ov-ico" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3.5" stroke="#5b7ab8" stroke-width="1.5"/><path d="M2 20c0-3.866 3.134-6 7-6" stroke="#5b7ab8" stroke-width="1.5"/><circle cx="17" cy="8" r="3" stroke="#5b7ab8" stroke-width="1.5"/><path d="M14 20c0-3.5 2.5-5.5 6-5.5" stroke="#5b7ab8" stroke-width="1.5"/></svg>
          <span class="overview-card-label">STAFF APPROVED LEAVE</span>
        </div>
        <div class="overview-card-val">0 <span>/ 0</span></div>
      </div>
      <div class="overview-card">
        <div class="overview-card-top">
          <svg class="ov-ico" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="7" r="3.5" stroke="#5b7ab8" stroke-width="1.5"/><path d="M2 20c0-3.866 3.134-6 7-6h2" stroke="#5b7ab8" stroke-width="1.5"/><circle cx="16" cy="8" r="3" stroke="#5b7ab8" stroke-width="1.5"/><path d="M13 20c0-3.5 2.5-5.5 6-5.5" stroke="#5b7ab8" stroke-width="1.5"/></svg>
          <span class="overview-card-label">STUDENT APPROVED LEAVE</span>
        </div>
        <div class="overview-card-val">0 <span>/ 0</span></div>
      </div>
      <div class="overview-card">
        <div class="overview-card-top">
          <svg class="ov-ico" viewBox="0 0 24 24" fill="none"><path d="M3 6l4 6-4 6h14l4-6-4-6H3z" stroke="#5b7ab8" stroke-width="1.5"/><circle cx="17" cy="12" r="1.5" fill="#5b7ab8"/></svg>
          <span class="overview-card-label">CONVERTED LEADS</span>
        </div>
        <div class="overview-card-val">0 <span>/ 1</span></div>
      </div>
      <div class="overview-card">
        <div class="overview-card-top">
          <svg class="ov-ico" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3.5" stroke="#5b7ab8" stroke-width="1.5"/><path d="M2 20c0-3.866 3.134-6 7-6h2c3.866 0 7 2.134 7 6" stroke="#5b7ab8" stroke-width="1.5"/></svg>
          <span class="overview-card-label">STAFF PRESENT TODAY</span>
        </div>
        <div class="overview-card-val">0 <span>/ 82</span></div>
      </div>
    </div>

    <!-- Charts Row 1: Monthly -->
    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-card-header">
          <span class="chart-card-title">Fees Collection & Expenses For July 2026</span>
          <span class="chart-date-badge">📅 July 2026</span>
        </div>
        <div class="chart-canvas-wrap" style="height:220px; position:relative;"><canvas id="chartMonthly"></canvas></div>
        <div class="chart-legend">
          <span class="legend-dot blue">Collection</span>
          <span class="legend-dot orange">Expenses</span>
        </div>
      </div>

      <div class="donut-card">
        <div class="chart-card-header" style="width:100%;"><span class="chart-card-title">Income — July 2026</span></div>
        <div class="donut-wrapper">
          <canvas id="chartIncome"></canvas>
          <div class="donut-center"><span class="donut-pct">100%</span><span class="donut-pct-lbl">TOTAL</span></div>
        </div>
        <div class="donut-label-text income-lbl">Total Income</div>
      </div>
    </div>

    <!-- Charts Row 2: Session -->
    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-card-header">
          <span class="chart-card-title">Fees Collection & Expenses For Session 2025-26</span>
          <span class="chart-date-badge">📅 Session 2025-26</span>
        </div>
        <div class="chart-canvas-wrap" style="height:220px; position:relative;"><canvas id="chartSession"></canvas></div>
        <div class="chart-legend">
          <span class="legend-dot blue">Collection</span>
          <span class="legend-dot orange">Expenses</span>
        </div>
      </div>

      <div class="donut-card">
        <div class="chart-card-header" style="width:100%;"><span class="chart-card-title">Expense — July 2026</span></div>
        <div class="donut-wrapper">
          <canvas id="chartExpense"></canvas>
          <div class="donut-center"><span class="donut-pct">100%</span><span class="donut-pct-lbl">TOTAL</span></div>
        </div>
        <div class="donut-label-text expense-lbl">Total Expense</div>
      </div>
    </div>`;

  initDashboardCharts();
}

function initDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  const monthLabels = ['01', '05', '09', '13', '17', '21', '25', '29'];
  const sessionLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

  const lineOpts = (labels, col, exp) => ({
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Collection', data: col, borderColor: '#10285f', backgroundColor: 'rgba(16,40,95,.08)', borderWidth: 2, tension: 0.4, fill: true, pointRadius: 3 },
        { label: 'Expenses', data: exp, borderColor: '#f3bf3b', backgroundColor: 'rgba(243,191,59,.07)', borderWidth: 2, tension: 0.4, fill: true, pointRadius: 3 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: -1, max: 1 }, x: { grid: { display: false } } } }
  });

  const donutOpts = (color, bg) => ({
    type: 'doughnut',
    data: { datasets: [{ data: [100, 0], backgroundColor: [color, bg || '#f0f2f8'], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } }
  });

  [chartMonthly, chartSession, chartIncome, chartExpense].forEach(c => c && c.destroy());

  const mc = document.getElementById('chartMonthly');
  const sc = document.getElementById('chartSession');
  const ic = document.getElementById('chartIncome');
  const ec = document.getElementById('chartExpense');

  if (mc) chartMonthly = new Chart(mc, lineOpts(monthLabels, [0, 0, 0.1, -0.2, 0, 0.05, -0.1, 0], [0, 0, -0.15, -0.3, -0.2, -0.1, -0.25, -0.2]));
  if (sc) chartSession = new Chart(sc, lineOpts(sessionLabels, [0, 0, 0, 0.1, -0.2, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, -0.2, -0.3, -0.1, 0, 0, 0, 0, 0, 0]));
  if (ic) chartIncome  = new Chart(ic, donutOpts('#10285f', '#e8eef9'));
  if (ec) chartExpense = new Chart(ec, donutOpts('#f3bf3b', '#fff4da'));
}

/* ------------------------------------------------------------
   4. SETUP FRONT OFFICE & MODULAR DATA HANDLERS
------------------------------------------------------------ */

const SetupFrontOfficeModule = {
  initialData: {
    purpose: [
      { id: 'PUR1001', name: 'Meeting Principal', description: 'Meeting with School Principal' },
      { id: 'PUR1002', name: 'Admission Enquiry', description: 'Enquiry for new student admission' },
      { id: 'PUR1003', name: 'Parent Meeting', description: 'General parent teacher meeting' },
      { id: 'PUR1004', name: 'Staff Meeting', description: 'Academic and administrative staff meeting' },
      { id: 'PUR1005', name: 'Official Work', description: 'Government and regulatory affairs' }
    ],
    complaintType: [
      { id: 'CT1001', name: 'Infrastructure', description: 'Facility and equipment issues' },
      { id: 'CT1002', name: 'Academic', description: 'Curriculum or teaching issues' },
      { id: 'CT1003', name: 'Behaviour', description: 'Student conduct matters' },
      { id: 'CT1004', name: 'Staff', description: 'Staff and teacher related feedback' }
    ],
    source: [
      { id: 'SRC1001', name: 'Notice Board', description: 'School front notice board' },
      { id: 'SRC1002', name: 'Newspaper', description: 'Print advertisement' },
      { id: 'SRC1003', name: 'Website', description: 'Official school portal' },
      { id: 'SRC1004', name: 'via friend', description: 'Word of mouth referral' },
      { id: 'SRC1005', name: 'Walk In', description: 'Direct visit to reception' }
    ],
    reference: [
      { id: 'REF1001', name: 'Rahul Sharma', contact: '9812345678', description: 'Parent referral' },
      { id: 'REF1002', name: 'Newspaper Ad', contact: '—', description: 'Daily Tribune feature' },
      { id: 'REF1003', name: 'Alumni Network', contact: 'alumni@school.edu', description: 'Devryon Alumni Association' }
    ]
  },

  getStorageKey(type) {
    const map = {
      purpose: (window.STORAGE_KEYS && STORAGE_KEYS.PURPOSE) || 'school_erp_purposes',
      complaintType: (window.STORAGE_KEYS && STORAGE_KEYS.COMPLAINT_TYPE) || 'school_erp_complaint_types',
      source: (window.STORAGE_KEYS && STORAGE_KEYS.SOURCE) || 'school_erp_sources',
      reference: (window.STORAGE_KEYS && STORAGE_KEYS.REFERENCE) || 'school_erp_references'
    };
    return map[type] || 'school_erp_' + type;
  },

  getRecords(type, query = '') {
    const key = this.getStorageKey(type);
    const initial = this.initialData[type] || [];
    const all = StorageUtils.get(key, initial);
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(r =>
      (r.name || '').toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q) ||
      (r.contact || '').toLowerCase().includes(q)
    );
  },

  getById(type, id) {
    const key = this.getStorageKey(type);
    return StorageUtils.getById(key, id);
  },

  saveRecord(type, data, editId = null) {
    if (!data.name || !data.name.trim()) {
      const titles = { purpose: 'Purpose', complaintType: 'Complaint Type', source: 'Source', reference: 'Reference' };
      throw new Error((titles[type] || 'Name') + ' is required.');
    }
    const key = this.getStorageKey(type);
    const prefixMap = { purpose: 'PUR', complaintType: 'CT', source: 'SRC', reference: 'REF' };
    const prefix = prefixMap[type] || 'SET';

    const payload = {
      name: data.name.trim(),
      description: data.description || '',
      ...(type === 'reference' ? { contact: data.contact || '' } : {})
    };

    if (editId) return StorageUtils.update(key, editId, payload);
    return StorageUtils.add(key, payload, 'id', prefix);
  },

  deleteRecord(type, id) {
    const key = this.getStorageKey(type);
    return StorageUtils.delete(key, id);
  }
};
window.SetupFrontOfficeModule = SetupFrontOfficeModule;

/** Column definitions for each module */
const moduleColumns = {
  admission:     ['Name', 'Phone', 'Source', 'Enquiry Date', 'Last Follow Up Date', 'Next Follow Up Date', 'Status', 'Action'],
  visitor:       ['Purpose', 'Meeting With', 'Visitor Name', 'Phone', 'ID Card', 'Number Of Person', 'Date', 'In Time', 'Out Time', 'Action'],
  dispatch:      ['#', 'To Title', 'Reference No.', 'From', 'Type', 'Date', 'Action'],
  receive:       ['#', 'From Title', 'Reference No.', 'Type', 'Date', 'Note', 'Action'],
  phone:         ['#', 'Name', 'Phone', 'Call Type', 'Date', 'Follow Up Date', 'Duration', 'Action'],
  complaint:     ['#', 'Complain By', 'Phone', 'Type', 'Date', 'Assigned To', 'Action'],
  purpose:       ['#', 'Purpose', 'Description', 'Action'],
  complaintType: ['#', 'Complaint Type', 'Description', 'Action'],
  source:        ['#', 'Source', 'Description', 'Action'],
  reference:     ['#', 'Reference', 'Contact', 'Description', 'Action']
};

/** Format a YYYY-MM-DD date string for display */
function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Render table rows for each module */
function renderModuleRows(mod, query) {
  const avatarColors = [
    { bg: '#e0e7ff', c: '#4338ca' }, { bg: '#fef3c7', c: '#d97706' },
    { bg: '#f3e8ff', c: '#7e22ce' }, { bg: '#ccfbf1', c: '#0d9488' }
  ];

  const person = (name, idx) => {
    const av = avatarColors[idx % 4];
    return `<span class="person">
      <span class="initial" style="background:${av.bg};color:${av.c};">${(name||'?')[0].toUpperCase()}</span>
      <span class="person-name">${name||'—'}</span>
    </span>`;
  };

  const typeBadge = t => `<span class="type-badge">${t||'—'}</span>`;
  const actBtns   = id => `
    <div class="row-actions">
      <button class="act-btn edit"   data-action="edit"   data-id="${id}" title="Edit">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>
      <button class="act-btn delete" data-action="delete" data-id="${id}" title="Delete">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
      </button>
    </div>`;

  const noRow = cols => `<tr><td colspan="${cols}" class="empty-cell" style="text-align:center;padding:28px;color:#8994a7;">No records found.</td></tr>`;

  if (mod === 'visitor' && window.VisitorModule) {
    const recs = VisitorModule.getRecords(query);
    const total = VisitorModule.getRecords().length;
    if (!recs.length) return { rows: noRow(10), total, count: 0 };
    return {
      rows: VisitorModule.renderRowsHtml(recs),
      total,
      count: recs.length
    };
  }

  if (mod === 'dispatch' && window.PostalDispatchModule) {
    const recs = PostalDispatchModule.getRecords(query);
    const total = PostalDispatchModule.getRecords().length;
    if (!recs.length) return { rows: noRow(7), total, count: 0 };
    return {
      rows: recs.map((r,i) => `<tr data-id="${r.id}">
        <td>${i+1}</td><td>${r.toTitle||'—'}</td><td>${r.referenceNo||'—'}</td>
        <td>${r.fromTitle||'—'}</td><td>${typeBadge(r.type)}</td>
        <td>${fmtDate(r.date)}</td><td>${actBtns(r.id)}</td>
      </tr>`).join(''),
      total,
      count: recs.length
    };
  }

  if (mod === 'receive' && window.PostalReceiveModule) {
    const recs = PostalReceiveModule.getRecords(query);
    const total = PostalReceiveModule.getRecords().length;
    if (!recs.length) return { rows: noRow(7), total, count: 0 };
    return {
      rows: recs.map((r,i) => `<tr data-id="${r.id}">
        <td>${i+1}</td><td>${r.fromTitle||'—'}</td><td>${r.referenceNo||'—'}</td>
        <td>${typeBadge(r.type)}</td><td>${fmtDate(r.date)}</td>
        <td>${r.note||'—'}</td><td>${actBtns(r.id)}</td>
      </tr>`).join(''),
      total,
      count: recs.length
    };
  }

  if (mod === 'phone' && window.PhoneLogModule) {
    const callBadge = t => {
      const map = { 'Incoming': ['#dcfce7','#16a34a'], 'Outgoing': ['#dbeafe','#1d4ed8'], 'Missed': ['#fee2e2','#dc2626'] };
      const [bg,c] = map[t] || map['Incoming'];
      return `<span class="type-badge" style="background:${bg};color:${c};">${t||'—'}</span>`;
    };
    const recs = PhoneLogModule.getRecords(query);
    const total = PhoneLogModule.getRecords().length;
    if (!recs.length) return { rows: noRow(8), total, count: 0 };
    return {
      rows: recs.map((r,i) => `<tr data-id="${r.id}">
        <td>${i+1}</td><td>${person(r.name,i)}</td><td>${r.phone||'—'}</td>
        <td>${callBadge(r.callType)}</td><td>${fmtDate(r.date)}</td>
        <td>${r.followUpDate ? fmtDate(r.followUpDate) : '—'}</td>
        <td>${r.duration||'—'}</td><td>${actBtns(r.id)}</td>
      </tr>`).join(''),
      total,
      count: recs.length
    };
  }

  if (mod === 'complaint' && window.ComplainModule) {
    const recs = ComplainModule.getRecords(query);
    const total = ComplainModule.getRecords().length;
    if (!recs.length) return { rows: noRow(7), total, count: 0 };
    return {
      rows: recs.map((r,i) => `<tr data-id="${r.id}">
        <td>${i+1}</td><td>${person(r.complainBy,i)}</td><td>${r.phone||'—'}</td>
        <td>${typeBadge(r.type)}</td><td>${fmtDate(r.date)}</td>
        <td>${r.assigned||'—'}</td><td>${actBtns(r.id)}</td>
      </tr>`).join(''),
      total,
      count: recs.length
    };
  }

  if (['purpose', 'complaintType', 'source', 'reference'].includes(mod)) {
    const recs = SetupFrontOfficeModule.getRecords(mod, query);
    const total = SetupFrontOfficeModule.getRecords(mod).length;
    const cols = mod === 'reference' ? 5 : 4;
    if (!recs.length) return { rows: noRow(cols), total, count: 0 };
    return {
      rows: recs.map((r,i) => `<tr data-id="${r.id}">
        <td>${i+1}</td>
        <td><strong>${r.name||'—'}</strong></td>
        ${mod === 'reference' ? `<td>${r.contact||'—'}</td>` : ''}
        <td>${r.description||'—'}</td>
        <td>${actBtns(r.id)}</td>
      </tr>`).join(''),
      total,
      count: recs.length
    };
  }

  return { rows: noRow(4), total: 0, count: 0 };
}

/** Get current active filter values */
function getActiveFilters() {
  return {
    query:        document.getElementById('tableSearchInput')?.value || '',
    purpose:      document.getElementById('filterPurpose')?.value || '',
    dateRange:    document.getElementById('filterDateRange')?.value || '',
    studentClass: document.getElementById('filterClass')?.value || '',
    source:       document.getElementById('filterSource')?.value || '',
    status:       document.getElementById('filterStatus')?.value || '',
    fromDate:     document.getElementById('filterFromDate')?.value || '',
    toDate:       document.getElementById('filterToDate')?.value || ''
  };
}

/** Update only table rows and pagination text without re-rendering the whole page */
function updateTableOnly() {
  const tbody     = document.querySelector('.table-wrap tbody') || document.querySelector('.visitor-table tbody');
  const pagerSpan = document.querySelector('.visitor-pagination-bar .pagination-info') || document.querySelector('.pager span');
  if (!tbody) return;

  const filters = getActiveFilters();
  let result;
  if (current === 'admission' && window.AdmissionModule) {
    const records = AdmissionModule.getRecords(filters);
    const total = AdmissionModule.getRecords().length;
    result = {
      rows: AdmissionModule.renderRowsHtml(records),
      total: total,
      count: records.length
    };
  } else if (current === 'visitor' && window.VisitorModule) {
    const records = VisitorModule.getRecords(filters);
    const total = VisitorModule.getRecords().length;
    result = {
      rows: VisitorModule.renderRowsHtml(records),
      total: total,
      count: records.length
    };
  } else {
    result = renderModuleRows(current, filters.query);
  }

  tbody.innerHTML = result.rows;

  if (pagerSpan) {
    pagerSpan.textContent = result.count === 0
      ? 'No records found'
      : `Showing 1 to ${result.count} of ${result.total} entries`;
  }

  bindRowActions();
  if (window.ExportUtils) ExportUtils.bindExportButtons();
}

/** Bind row edit and delete actions */
function bindRowActions() {
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.onclick = e => {
      e.stopPropagation();
      const row      = btn.closest('tr');
      const recordId = btn.dataset.id || (row ? row.dataset.id : null);
      const action   = btn.dataset.action;

      if (action === 'delete') {
        const labels = {
          admission: 'enquiry', visitor: 'visitor record', dispatch: 'dispatch record',
          receive: 'receive record', phone: 'call log', complaint: 'complaint',
          purpose: 'purpose', complaintType: 'complaint type', source: 'source', reference: 'reference'
        };
        if (!confirm(`Delete this ${labels[current] || 'record'}?`)) return;

        if (current === 'admission' && window.AdmissionModule)          AdmissionModule.deleteRecord(recordId);
        else if (current === 'visitor'   && window.VisitorModule)        VisitorModule.deleteRecord(recordId);
        else if (current === 'dispatch'  && window.PostalDispatchModule)  PostalDispatchModule.deleteRecord(recordId);
        else if (current === 'receive'   && window.PostalReceiveModule)   PostalReceiveModule.deleteRecord(recordId);
        else if (current === 'phone'     && window.PhoneLogModule)        PhoneLogModule.deleteRecord(recordId);
        else if (current === 'complaint' && window.ComplainModule)        ComplainModule.deleteRecord(recordId);
        else if (['purpose', 'complaintType', 'source', 'reference'].includes(current)) {
          SetupFrontOfficeModule.deleteRecord(current, recordId);
        }
        updateTableOnly();

      } else if (action === 'edit') {
        openModal('edit', recordId);
      } else if (action === 'view') {
        if (current === 'visitor' && window.viewVisitorDetails) {
          viewVisitorDetails(recordId);
        } else {
          openModal('view', recordId);
        }
      }
    };
  });
}

function render() {
  if (current === 'home') {
    renderHome();
    return;
  }

  // Specialized Visitor List view matching the image
  if (current === 'visitor') {
    const records = window.VisitorModule ? VisitorModule.getRecords() : [];
    const rowsHtml = window.VisitorModule ? VisitorModule.renderRowsHtml(records) : '';
    const totalCount = records.length;

    $('#app').innerHTML = `
      <!-- Header Card -->
      <section class="visitor-header-card">
        <div class="visitor-header-left">
          <div class="visitor-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="visitor-title-box">
            <h2>Visitor List</h2>
            <p>View and manage all visitors who have visited the school.</p>
          </div>
        </div>
        <button class="btn-add-visitor" id="addRecord" type="button">
          <span>+</span> Add Visitor
        </button>
      </section>

      <!-- Filter / Search Bar Card -->
      <section class="visitor-filter-card">
        <div class="visitor-search-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input id="tableSearchInput" placeholder="Search by visitor name, purpose, meeting with...">
        </div>

        <div class="visitor-purpose-select-wrap">
          <select id="filterPurpose">
            <option value="">All Purpose</option>
            <option value="Student Enquiry">Student Enquiry</option>
            <option value="Parent Meeting">Parent Meeting</option>
            <option value="Meeting Principal">Meeting Principal</option>
            <option value="Staff Meeting">Staff Meeting</option>
            <option value="Official Work">Official Work</option>
            <option value="Other">Other</option>
          </select>
          <svg class="select-caret" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <svg class="filter-funnel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        </div>

        <div class="visitor-date-range-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <input type="text" id="filterDateRange" placeholder="Select Date Range" onfocus="(this.type='date')" onblur="if(!this.value)this.type='text'">
        </div>

        <button class="btn-visitor-reset" id="btnResetFilters" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          Reset
        </button>
      </section>

      <!-- Table Card -->
      <section class="visitor-table-card">
        <div class="visitor-table-toolbar">
          <div class="show-entries-wrap">
            <span>Show</span>
            <select id="perPageSelect">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50" selected>50</option>
              <option value="100">100</option>
            </select>
            <span>entries</span>
          </div>
          <div class="table-actions-right">
            <button class="btn-export-main" title="Export">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>
            <button class="tool-icon-btn export" title="Export Excel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
            </button>
            <button class="tool-icon-btn export" title="Export PDF">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M10 12h4"/><path d="M10 16h4"/></svg>
            </button>
            <button class="tool-icon-btn export" title="Print">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
            <button class="tool-icon-btn export" title="Columns">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/><path d="M18 9l3 3-3 3"/></svg>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="table-wrap" style="overflow-x: auto;">
          <table class="visitor-table">
            <thead>
              <tr>
                <th>Purpose <span class="sort-icon">↕</span></th>
                <th>Meeting With <span class="sort-icon">↕</span></th>
                <th>Visitor Name <span class="sort-icon">↕</span></th>
                <th>Phone <span class="sort-icon">↕</span></th>
                <th>ID Card <span class="sort-icon">↕</span></th>
                <th>Number Of Person <span class="sort-icon">↕</span></th>
                <th>Date <span class="sort-icon">↕</span></th>
                <th>In Time <span class="sort-icon">↕</span></th>
                <th>Out Time <span class="sort-icon">↕</span></th>
                <th style="text-align:center;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <div class="visitor-pagination-bar">
          <span class="pagination-info">Showing 1 to ${totalCount} of ${totalCount} entries</span>
          <div class="pages" style="display:flex;gap:4px;">
            <button class="visitor-page-btn" type="button">‹</button>
            <button class="visitor-page-btn" type="button">1</button>
            <button class="visitor-page-btn active" type="button">2</button>
            <button class="visitor-page-btn" type="button">›</button>
          </div>
        </div>
      </section>

      <!-- Bottom Tip Banner -->
      <section class="visitor-tip-banner">
        <div class="visitor-tip-left">
          <div class="tip-info-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <span><strong>Tip:</strong> You can export the visitor list in Excel, PDF or print it for your records.</span>
        </div>
        <div class="visitor-tip-graphic">
          <svg width="40" height="34" viewBox="0 0 48 40" fill="none">
            <rect x="6" y="6" width="22" height="28" rx="3" fill="#e0e7ff" stroke="#6366f1" stroke-width="1.5"/>
            <rect x="11" y="2" width="12" height="6" rx="2" fill="#818cf8"/>
            <line x1="11" y1="14" x2="23" y2="14" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="11" y1="19" x2="23" y2="19" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="11" y1="24" x2="18" y2="24" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M36 12l8 4v8c0 7-8 12-8 12s-8-5-8-12v-8l8-4z" fill="#fef08a" stroke="#d97706" stroke-width="1.5"/>
            <path d="M33 22l2.5 2.5 5.5-5.5" stroke="#d97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </section>
    `;

    // Bind events
    const btnAdd = $('#addRecord');
    if (btnAdd) btnAdd.onclick = () => openModal('add');

    const searchInput = document.getElementById('tableSearchInput');
    if (searchInput) searchInput.addEventListener('input', updateTableOnly);

    const purposeSelect = document.getElementById('filterPurpose');
    if (purposeSelect) purposeSelect.addEventListener('change', updateTableOnly);

    const dateRangeInput = document.getElementById('filterDateRange');
    if (dateRangeInput) {
      dateRangeInput.addEventListener('input', updateTableOnly);
      dateRangeInput.addEventListener('change', updateTableOnly);
    }

    const btnReset = document.getElementById('btnResetFilters');
    if (btnReset) {
      btnReset.addEventListener('click', e => {
        e.preventDefault();
        if (searchInput) searchInput.value = '';
        if (purposeSelect) purposeSelect.selectedIndex = 0;
        if (dateRangeInput) dateRangeInput.value = '';
        updateTableOnly();
      });
    }

    bindRowActions();
    if (window.ExportUtils) ExportUtils.bindExportButtons();
    return;
  }

  const isSetup = ['purpose', 'complaintType', 'source', 'reference'].includes(current);
  const info = viewInfo[current] || [title(current), 'This module is ready for configuration'];
  if (!viewInfo[current]) {
    $('#app').innerHTML = `
      <section class="info-card empty-view">
        <div class="big-icon">◈</div>
        <h1>${title(current)}</h1>
        <p>This area is available from the main school platform.</p>
      </section>`;
    return;
  }

  const columns = moduleColumns[current] || ['Name', 'Description', 'Status', 'Action'];

  // Criteria Filters Template
  const filtersHtml = current === 'admission'
    ? `<section class="criteria">
        <div class="criteria-header">
          <div class="section-title-wrap">
            <span class="orange-accent-bar"></span>
            <span class="section-title-text">Select Criteria</span>
          </div>
        </div>
        <div class="criteria-grid-wrap">
          <div class="filter-grid">
            <div class="field">
              <label>Class</label>
              <div class="input-icon-group">
                <svg class="field-ico" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <select id="filterClass">
                  <option>Select Class</option>
                  <option>Class 1</option><option>Class 2</option><option>Class 3</option><option>Class 4</option><option>Class 5</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Source</label>
              <div class="input-icon-group">
                <svg class="field-ico" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <select id="filterSource">
                  <option>Select Source</option>
                  <option>Notice Board</option><option>via friend</option><option>Newspaper</option><option>Website</option><option>Walk In</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Enquiry From Date *</label>
              <div class="input-icon-group">
                <svg class="field-ico" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input type="date" id="filterFromDate">
              </div>
            </div>
            <div class="field">
              <label>Enquiry To Date *</label>
              <div class="input-icon-group">
                <svg class="field-ico" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input type="date" id="filterToDate">
              </div>
            </div>
            <div class="field">
              <label>Status</label>
              <select id="filterStatus" class="status-select">
                <option>● Active</option><option>All Status</option><option>Pending</option><option>Closed</option>
              </select>
            </div>
          </div>
          <div class="criteria-right-col">
            <button id="btnSearchCriteria" class="field-search" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search
            </button>
            <div id="btnResetFilters" class="reset" role="button" tabindex="0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              Reset Filters
            </div>
          </div>
        </div>
      </section>` : '';

  // Setup sub-navigation tabs
  const setupTabsHtml = isSetup
    ? `<div class="setup-tabs" style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
        <a href="#purpose" class="btn ${current==='purpose'?'primary':'ghost'}" data-view="purpose" style="text-decoration:none;font-size:13px;padding:8px 16px;">Purpose</a>
        <a href="#complaintType" class="btn ${current==='complaintType'?'primary':'ghost'}" data-view="complaintType" style="text-decoration:none;font-size:13px;padding:8px 16px;">Complaint Type</a>
        <a href="#source" class="btn ${current==='source'?'primary':'ghost'}" data-view="source" style="text-decoration:none;font-size:13px;padding:8px 16px;">Source</a>
        <a href="#reference" class="btn ${current==='reference'?'primary':'ghost'}" data-view="reference" style="text-decoration:none;font-size:13px;padding:8px 16px;">Reference</a>
      </div>`
    : '';

  // Initial table data
  let rowsHtml = '';
  let totalCount = 0;
  let activeCount = 0;

  if (current === 'admission' && window.AdmissionModule) {
    const records = AdmissionModule.getRecords();
    totalCount  = records.length;
    activeCount = records.length;
    rowsHtml    = AdmissionModule.renderRowsHtml(records);
  } else {
    const result = renderModuleRows(current, '');
    rowsHtml    = result.rows;
    totalCount  = result.total;
    activeCount = result.count;
  }

  const addName = isSetup ? title(current) : (info[0] || title(current));

  $('#app').innerHTML = `
    ${filtersHtml}
    ${setupTabsHtml}
    <section class="list-card">
      <div class="card-heading">
        <div class="section-title-wrap">
          <span class="orange-accent-bar"></span>
          <span class="section-title-text">${info[0]}</span>
        </div>
        <button class="btn primary" id="addRecord">+ Add ${addName}</button>
      </div>
      <div class="table-tools">
        <div class="search-input-wrap">
          <svg class="search-ico" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="tableSearchInput" placeholder="Search by name, phone or details...">
        </div>
        <div class="tool-actions">
          <select><option>50</option></select>
          <span class="per-page-text">per page</span>
          <div class="export-icon-group">
            <button class="export" title="Copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
            <button class="export" title="Export Excel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg></button>
            <button class="export" title="Export CSV"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></button>
            <button class="export" title="Export PDF"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M10 12h4"/><path d="M10 16h4"/></svg></button>
            <button class="export" title="Print"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></button>
            <button class="export" title="Columns"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/><path d="M18 9l3 3-3 3"/></svg></button>
          </div>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>${columns.map(c => `<th>${c} ${c === 'Action' ? '' : '<span class="sort-icon">↕</span>'}</th>`).join('')}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
      <div class="pager">
        <span>Showing 1 to ${activeCount} of ${totalCount} entries</span>
        <div class="pages">
          <button class="page-nav">‹</button><button class="current">1</button><button class="page-nav">›</button>
        </div>
      </div>
    </section>`;

  // Add Record Button Event
  const btnAdd = $('#addRecord');
  if (btnAdd) btnAdd.onclick = () => openModal('add');

  // Live search input listener
  const searchInput = document.getElementById('tableSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', updateTableOnly);
  }

  // Criteria filter event listeners
  ['filterClass', 'filterSource', 'filterStatus', 'filterFromDate', 'filterToDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', updateTableOnly);
      el.addEventListener('input', updateTableOnly);
    }
  });

  // Criteria search button
  const btnSearchCriteria = document.getElementById('btnSearchCriteria');
  if (btnSearchCriteria) {
    btnSearchCriteria.addEventListener('click', e => {
      e.preventDefault();
      updateTableOnly();
    });
  }

  // Reset filter button
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
      updateTableOnly();
    });
  }

  bindRowActions();
  if (window.ExportUtils) ExportUtils.bindExportButtons();
}

/* ------------------------------------------------------------
   5. MODAL FORM BUILDER & HANDLERS
------------------------------------------------------------ */

/** Retrieve a record from the correct module by ID */
function getRecordById(mod, id) {
  if (mod === 'admission'  && window.AdmissionModule)         return AdmissionModule.getById(id);
  if (mod === 'visitor'    && window.VisitorModule)           return VisitorModule.getById(id);
  if (mod === 'dispatch'   && window.PostalDispatchModule)     return PostalDispatchModule.getById(id);
  if (mod === 'receive'    && window.PostalReceiveModule)      return PostalReceiveModule.getById(id);
  if (mod === 'phone'      && window.PhoneLogModule)           return PhoneLogModule.getById(id);
  if (mod === 'complaint'  && window.ComplainModule)           return ComplainModule.getById(id);
  if (['purpose', 'complaintType', 'source', 'reference'].includes(mod)) return SetupFrontOfficeModule.getById(mod, id);
  return null;
}

/** Build the modal form HTML for each module */
function buildModalForm(mod, rec) {
  const today = new Date().toISOString().split('T')[0];
  rec = rec || {};

  const field = (label, id, type, val, opts) => {
    const req  = label.endsWith('*') ? ' required' : '';
    const lbl  = label.replace(' *', '');
    const wide = /Description|Address|Note|Action/.test(lbl) ? ' wide' : '';
    let inp;
    if (type === 'textarea') {
      inp = `<textarea data-field="${id}" placeholder="${opts||''}"${req}>${val||''}</textarea>`;
    } else if (type === 'select') {
      const options = opts.map(o => `<option value="${o}" ${val===o?'selected':''}>${o}</option>`).join('');
      inp = `<select data-field="${id}"${req}><option value="">Select ${lbl}</option>${options}</select>`;
    } else {
      inp = `<input type="${type}" data-field="${id}" placeholder="${opts||''}" value="${val||''}"${req}>`;
    }
    return `<div class="form-field${wide}"><label>${lbl}${req?' <span style="color:#ef4444">*</span>':''}</label>${inp}</div>`;
  };

  const sources   = ['Notice Board','via friend','Newspaper','Website','Walk In','Reference'];
  const classes   = ['Class 1','Class 2','Class 3','Class 4','Class 5'];
  const purposes  = ['Student Enquiry','Parent Meeting','Meeting Principal','Staff Meeting','Official Work','Other'];
  const callTypes = ['Incoming','Outgoing','Missed'];
  const postTypes = ['Letter','Parcel','Notice','Courier','Other'];
  const compTypes = ['Infrastructure','Behaviour','Academic','Administration','Staff','General','Other'];
  const compSrcs  = ['Parent','Student','Staff','Anonymous','Written','Other'];

  if (mod === 'admission') {
    const fmtIn = d => AdmissionModule ? AdmissionModule.formatInputDate(d) : (d||'');
    return [
      field('Student Name *',   'studentName',     'text',     rec.studentName,     'Enter student name'),
      field('Phone Number *',   'phoneNumber',     'tel',      rec.phoneNumber,      'Enter phone number'),
      field('Email',            'emailAddress',    'email',    rec.emailAddress,     'Enter email'),
      field('Class',            'studentClass',    'select',   rec.studentClass,     classes),
      field('Purpose',          'purpose',         'select',   rec.purpose,          ['Admission','Scholarship','Transport','Hostel','General Inquiry']),
      field('Source *',         'source',          'select',   rec.source,           sources),
      field('Reference',        'reference',       'text',     rec.reference,        'Reference name'),
      field('Enquiry Date',     'enquiryDate',     'date',     fmtIn(rec.enquiryDate)||today, ''),
      field('Next Follow Up',   'nextFollowUpDate','date',     fmtIn(rec.nextFollowUpDate)||today, ''),
      field('Status',           'status',          'select',   rec.status||'Active', ['Active','Pending','Closed']),
      field('Address',          'address',         'textarea', rec.address,          'Enter address'),
      field('Description',      'description',     'textarea', rec.description,      'Enter description')
    ].join('');
  }

  if (mod === 'visitor') {
    return [
      field('Purpose *',         'visitorPurpose', 'select',   rec.purpose||'Student Enquiry', purposes),
      field('Meeting With',      'meetingWith',    'text',     rec.meetingWith, 'e.g. Staff (Avantika Singh - 101)'),
      field('Visitor Name *',    'visitorName',    'text',     rec.name,        'Enter visitor name'),
      field('Phone *',           'visitorPhone',   'tel',      rec.phone,       'Enter phone number'),
      field('ID Card / Proof',   'idProof',        'text',     rec.idProof,     'e.g. Aadhaar 1234, PAN, —'),
      field('Number Of Persons', 'noOfPerson',     'number',   rec.noOfPerson ?? '0', '0'),
      field('Date *',            'visitorDate',    'date',     rec.date||today, ''),
      field('In Time',           'inTime',         'text',     rec.inTime||'04:46 PM',      '04:46 PM'),
      field('Out Time',          'outTime',        'text',     rec.outTime||'04:46 PM',     '04:46 PM'),
      field('Address',           'visitorAddress', 'textarea', rec.address,     'Enter address'),
      field('Note',              'visitorNote',    'textarea', rec.note,        'Additional notes')
    ].join('');
  }

  if (mod === 'dispatch') {
    return [
      field('To Title *',      'toTitle',      'text',     rec.toTitle,     'Receiver name / title'),
      field('Reference No.',   'referenceNo',  'text',     rec.referenceNo, 'Reference number'),
      field('From Title',      'fromTitle',    'text',     rec.fromTitle||'School Office', 'Sender'),
      field('Date *',          'dispatchDate', 'date',     rec.date||today, ''),
      field('Type',            'dispatchType', 'select',   rec.type||'Letter', postTypes),
      field('Address *',       'address',      'textarea', rec.address,     'Receiver address'),
      field('Note',            'note',         'textarea', rec.note,        'Additional notes')
    ].join('');
  }

  if (mod === 'receive') {
    return [
      field('From Title *',    'fromTitle',    'text',     rec.fromTitle,   'Sender name / title'),
      field('Reference No.',   'referenceNo',  'text',     rec.referenceNo, 'Reference number'),
      field('Date *',          'receiveDate',  'date',     rec.date||today, ''),
      field('Type',            'receiveType',  'select',   rec.type||'Letter', postTypes),
      field('Address',         'address',      'textarea', rec.address,     'Sender address'),
      field('Note',            'note',         'textarea', rec.note,        'Additional notes')
    ].join('');
  }

  if (mod === 'phone') {
    return [
      field('Caller Name *',   'callerName',   'text',     rec.name,         'Enter caller name'),
      field('Phone *',         'callerPhone',  'tel',      rec.phone,        'Enter phone number'),
      field('Date *',          'callDate',     'date',     rec.date||today,  ''),
      field('Follow Up Date',  'followUpDate', 'date',     rec.followUpDate, ''),
      field('Call Type',       'callType',     'select',   rec.callType||'Incoming', callTypes),
      field('Duration',        'callDuration', 'text',     rec.duration,     'e.g. 5 min'),
      field('Description *',   'callDesc',     'textarea', rec.description,  'Call purpose / discussion'),
      field('Note',            'callNote',     'textarea', rec.note,         'Additional notes')
    ].join('');
  }

  if (mod === 'complaint') {
    return [
      field('Complain By *',   'complainBy',     'text',     rec.complainBy,  'Enter complainant name'),
      field('Phone',           'complainPhone',  'tel',      rec.phone,       'Enter phone number'),
      field('Date *',          'complainDate',   'date',     rec.date||today, ''),
      field('Type *',          'complainType',   'select',   rec.type,        compTypes),
      field('Source',          'complainSource', 'select',   rec.source,      compSrcs),
      field('Assigned To',     'assigned',       'text',     rec.assigned,    'e.g. Principal'),
      field('Description *',   'complainDesc',   'textarea', rec.description, 'Describe the complaint'),
      field('Action Taken',    'actionTaken',    'textarea', rec.actionTaken, 'What action was taken')
    ].join('');
  }

  if (mod === 'purpose') {
    return [
      field('Purpose *',   'name',        'text',     rec.name,        'Enter purpose name'),
      field('Description', 'description', 'textarea', rec.description, 'Enter description')
    ].join('');
  }

  if (mod === 'complaintType') {
    return [
      field('Complaint Type *', 'name',        'text',     rec.name,        'Enter complaint type'),
      field('Description',      'description', 'textarea', rec.description, 'Enter description')
    ].join('');
  }

  if (mod === 'source') {
    return [
      field('Source *',    'name',        'text',     rec.name,        'Enter source name'),
      field('Description', 'description', 'textarea', rec.description, 'Enter description')
    ].join('');
  }

  if (mod === 'reference') {
    return [
      field('Reference Name *', 'name',        'text',     rec.name,        'Enter reference name'),
      field('Contact',          'contact',     'text',     rec.contact,     'Phone or email'),
      field('Description',      'description', 'textarea', rec.description, 'Enter description')
    ].join('');
  }

  return '<p style="color:#8994a7;padding:16px;">Form not available for this module.</p>';
}

/** Read form fields and save to the correct module */
function saveCurrentModule(editId) {
  const f = id => document.querySelector(`[data-field="${id}"]`)?.value?.trim() || '';

  if (current === 'admission' && window.AdmissionModule) {
    return AdmissionModule.saveRecord({
      studentName:      f('studentName'),
      phoneNumber:      f('phoneNumber'),
      emailAddress:     f('emailAddress'),
      studentClass:     f('studentClass'),
      purpose:          f('purpose'),
      source:           f('source'),
      reference:        f('reference'),
      enquiryDate:      f('enquiryDate'),
      nextFollowUpDate: f('nextFollowUpDate'),
      status:           f('status'),
      address:          f('address'),
      description:      f('description')
    }, editId);
  }

  if (current === 'visitor' && window.VisitorModule) {
    return VisitorModule.saveRecord({
      name:        f('visitorName'),
      phone:       f('visitorPhone'),
      purpose:     f('visitorPurpose'),
      meetingWith: f('meetingWith'),
      noOfPerson:  f('noOfPerson') || '0',
      idProof:     f('idProof') || '—',
      date:        f('visitorDate'),
      inTime:      f('inTime'),
      outTime:     f('outTime'),
      address:     f('visitorAddress'),
      note:        f('visitorNote')
    }, editId);
  }

  if (current === 'dispatch' && window.PostalDispatchModule) {
    return PostalDispatchModule.saveRecord({
      toTitle:     f('toTitle'),
      referenceNo: f('referenceNo'),
      fromTitle:   f('fromTitle'),
      date:        f('dispatchDate'),
      type:        f('dispatchType'),
      address:     f('address'),
      note:        f('note')
    }, editId);
  }

  if (current === 'receive' && window.PostalReceiveModule) {
    return PostalReceiveModule.saveRecord({
      fromTitle:   f('fromTitle'),
      referenceNo: f('referenceNo'),
      date:        f('receiveDate'),
      type:        f('receiveType'),
      address:     f('address'),
      note:        f('note')
    }, editId);
  }

  if (current === 'phone' && window.PhoneLogModule) {
    return PhoneLogModule.saveRecord({
      name:         f('callerName'),
      phone:        f('callerPhone'),
      date:         f('callDate'),
      followUpDate: f('followUpDate'),
      callType:     f('callType'),
      duration:     f('callDuration'),
      description:  f('callDesc'),
      note:         f('callNote')
    }, editId);
  }

  if (current === 'complaint' && window.ComplainModule) {
    return ComplainModule.saveRecord({
      complainBy:  f('complainBy'),
      phone:       f('complainPhone'),
      date:        f('complainDate'),
      type:        f('complainType'),
      source:      f('complainSource'),
      assigned:    f('assigned'),
      description: f('complainDesc'),
      actionTaken: f('actionTaken')
    }, editId);
  }

  if (['purpose', 'complaintType', 'source', 'reference'].includes(current)) {
    return SetupFrontOfficeModule.saveRecord(current, {
      name:        f('name'),
      contact:     f('contact'),
      description: f('description')
    }, editId);
  }

  throw new Error('Module not supported yet.');
}

function openModal(mode, recordId) {
  editingRecordId = (mode === 'edit') ? recordId : null;

  const labels = {
    admission: 'Admission Enquiry', visitor: 'Visitor', dispatch: 'Postal Dispatch',
    receive: 'Postal Receive', phone: 'Phone Call Log', complaint: 'Complaint',
    purpose: 'Purpose', complaintType: 'Complaint Type', source: 'Source', reference: 'Reference'
  };
  const lbl = labels[current] || title(current);
  const act = mode === 'edit' ? 'Edit' : (mode === 'view' ? 'View' : 'Add');

  $('#modalTitle').textContent = `${act} ${lbl}`;
  $('#modalSub').textContent   = mode === 'edit' ? 'Update the selected record' : (mode === 'view' ? 'Record Details' : 'Fill in the details below');
  $('#saveText').textContent   = mode === 'edit' ? `Update ${lbl}` : `Save ${lbl}`;

  const rec = recordId ? getRecordById(current, recordId) : null;
  $('#formFields').innerHTML = buildModalForm(current, rec);

  const saveBtn = $('#recordForm button[type="submit"]');
  if (saveBtn) {
    saveBtn.style.display = (mode === 'view') ? 'none' : 'inline-flex';
  }

  $('#recordModal').classList.add('show');
  $('#recordModal').setAttribute('aria-hidden', 'false');
}

function closeModal() {
  $('#recordModal').classList.remove('show');
  $('#recordModal').setAttribute('aria-hidden', 'true');
  editingRecordId = null;
}

/* ------------------------------------------------------------
   6. EVENT LISTENERS & ROUTING BOOTSTRAP
------------------------------------------------------------ */
function setActiveView(viewName) {
  if (!viewName) return;
  current = viewName;
  sessionStorage.setItem('school_erp_active_view', viewName);

  if (location.hash !== '#' + viewName) {
    history.replaceState(null, '', '#' + viewName);
  }

  updateSidebarActiveStyles();
  render();
}

function updateSidebarActiveStyles() {
  document.querySelectorAll('.nav-sub-item').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.nav-group-toggle').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('#mainNav > a').forEach(a => a.classList.remove('active'));

  const frontOfficeViews = ['admission','visitor','dispatch','phone','receive','complaint','purpose','complaintType','source','reference'];
  const studentViews = ['studentDetails','studentAdmission','onlineAdmission','disabledStudents','bulkDelete','studentCategories','studentHouse','disableReason'];

  if (frontOfficeViews.includes(current)) {
    const group = document.getElementById('navGroupFrontOffice');
    if (group) group.classList.add('open');
    const toggle = group && group.querySelector('.nav-group-toggle');
    if (toggle) toggle.classList.add('active');
    const subItem = document.querySelector(`.nav-sub-item[data-view="${current}"]`);
    if (subItem) subItem.classList.add('active');
  } else if (studentViews.includes(current)) {
    const group = document.getElementById('navGroupStudents');
    if (group) group.classList.add('open');
    const toggle = group && group.querySelector('.nav-group-toggle');
    if (toggle) toggle.classList.add('active');
    const subItem = document.querySelector(`.nav-sub-item[data-view="${current}"]`);
    if (subItem) subItem.classList.add('active');
  } else if (current === 'home') {
    const mainLink = document.querySelector('#mainNav > a[data-view="home"]');
    if (mainLink) mainLink.classList.add('active');
  }
}

document.addEventListener('click', e => {
  if (e.target.matches('[data-close]') || e.target === $('#recordModal')) closeModal();

  // Brand Logo / Text Clicks -> Return to Home Dashboard Overview
  const brandClick = e.target.closest('.sidebar-brand, .header-brand');
  if (brandClick) {
    e.preventDefault();
    setActiveView('home');
    if (innerWidth < 900) $('#sidebar').classList.remove('open');
    return;
  }

  // Sidebar Submenu Toggles
  const groupToggle = e.target.closest('.nav-group-toggle');
  if (groupToggle) {
    e.preventDefault();
    const group = groupToggle.closest('.nav-group');
    const isOpen = group.classList.contains('open');
    document.querySelectorAll('.nav-group.open').forEach(g => g.classList.remove('open'));
    if (!isOpen) group.classList.add('open');
    return;
  }

  // Navigation Item Clicks
  const subItem = e.target.closest('.nav-sub-item[data-view], .setup-tabs [data-view]');
  if (subItem) {
    e.preventDefault();
    setActiveView(subItem.dataset.view);
    if (innerWidth < 900) $('#sidebar').classList.remove('open');
    return;
  }

  const link = e.target.closest('#mainNav > a[data-view]');
  if (link) {
    e.preventDefault();
    setActiveView(link.dataset.view);
    if (innerWidth < 900) $('#sidebar').classList.remove('open');
    return;
  }
});

// Modal Form Submit Event
$('#recordForm').addEventListener('submit', e => {
  e.preventDefault();
  try {
    saveCurrentModule(editingRecordId);
    closeModal();
    updateTableOnly();
  } catch (err) {
    alert(err.message || 'Error saving record');
  }
});

// Toggle Sidebar (Desktop & Mobile)
if ($('#menuToggle')) {
  $('#menuToggle').onclick = () => {
    const sidebar = $('#sidebar');
    if (!sidebar) return;
    if (window.innerWidth <= 900) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('closed');
    }
    setTimeout(() => {
      if (current === 'home') initDashboardCharts();
    }, 260);
  };
}

// Hash Routing Listener
window.addEventListener('hashchange', () => {
  const h = location.hash.slice(1);
  if (h && h !== current) {
    setActiveView(h);
  }
});

/* App Boot */
const initialHash = location.hash.slice(1);
const savedView = sessionStorage.getItem('school_erp_active_view');

current = initialHash || savedView || 'home';
sessionStorage.setItem('school_erp_active_view', current);

if (location.hash !== '#' + current) {
  history.replaceState(null, '', '#' + current);
}

updateSidebarActiveStyles();
render();

