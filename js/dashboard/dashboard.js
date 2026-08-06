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
   4. MODULE TABLE RENDERER & ROUTER
------------------------------------------------------------ */
function render() {
  if (current === 'home') {
    renderHome();
    return;
  }

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

  const columns = current === 'admission'
    ? ['Name', 'Phone', 'Source', 'Enquiry Date', 'Last Follow Up Date', 'Next Follow Up Date', 'Status', 'Action']
    : ['Name', 'Description', 'Status', 'Action'];

  // Criteria Filters Template
  const filtersHtml = ['admission'].includes(current)
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
            <button id="btnSearchCriteria" class="field-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search
            </button>
            <div id="btnResetFilters" class="reset">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              Reset Filters
            </div>
          </div>
        </div>
      </section>` : '';

  // Get table rows based on active module
  let rowsHtml = '';
  let totalCount = 0;
  let activeCount = 0;

  if (current === 'admission' && window.AdmissionModule) {
    const filters = {
      query: document.getElementById('tableSearchInput')?.value || '',
      studentClass: document.getElementById('filterClass')?.value || '',
      source: document.getElementById('filterSource')?.value || '',
      status: document.getElementById('filterStatus')?.value || ''
    };
    const records = AdmissionModule.getRecords(filters);
    totalCount = AdmissionModule.getRecords().length;
    activeCount = records.length;
    rowsHtml = AdmissionModule.renderRowsHtml(records);
  } else {
    rowsHtml = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#8994a7;">No records available.</td></tr>`;
  }

  const addName = title(current);

  $('#app').innerHTML = `
    ${filtersHtml}
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
          <input id="tableSearchInput" placeholder="Search by name, phone or source...">
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
  $('#addRecord').onclick = () => openModal('add');

  // Bind live filter triggers
  ['tableSearchInput', 'filterClass', 'filterSource', 'filterStatus'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', render);
      el.addEventListener('change', render);
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
      render();
    });
  }

  // Row Actions (View, Edit, Delete)
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.onclick = () => {
      const row = btn.closest('tr');
      const recordId = btn.dataset.id || (row ? row.dataset.id : null);
      const action = btn.dataset.action;

      if (action === 'delete') {
        if (current === 'admission' && recordId && window.AdmissionModule) {
          if (confirm(`Are you sure you want to delete enquiry ${recordId}?`)) {
            AdmissionModule.deleteRecord(recordId);
            render();
          }
        }
      } else if (action === 'edit' || action === 'view') {
        openModal(action, recordId);
      }
    };
  });

  if (window.ExportUtils) {
    ExportUtils.bindExportButtons();
  }
}

/* ------------------------------------------------------------
   5. MODAL FORM BUILDER & HANDLERS
------------------------------------------------------------ */
function formFields(type, recordData = {}) {
  return fields(type).map((item, i) => {
    const [label, placeholder] = item.split('|');
    const fieldKey = label.replace(' *', '').replace(/\s+/g, '');
    const isTextarea = /Description|Address|Note|Action/.test(label);
    const isSelect   = /Select/.test(placeholder);

    const getVal = () => {
      if (type === 'admission') {
        switch (fieldKey) {
          case 'Name': return recordData.studentName || '';
          case 'Phone': return recordData.phoneNumber || '';
          case 'Email': return recordData.emailAddress || '';
          case 'Address': return recordData.address || '';
          case 'Description': return recordData.description || '';
          case 'Note': return recordData.note || '';
          case 'Date': return AdmissionModule ? AdmissionModule.formatInputDate(recordData.enquiryDate) : (recordData.enquiryDate || '');
          case 'NextFollowUpDate': return AdmissionModule ? AdmissionModule.formatInputDate(recordData.nextFollowUpDate) : (recordData.nextFollowUpDate || '');
          case 'Reference': return recordData.reference || '';
          case 'Source': return recordData.source || '';
          case 'Class': return recordData.studentClass || '';
          default: return recordData[fieldKey] || '';
        }
      }
      return recordData[fieldKey] || (Array.isArray(recordData) ? recordData[i] : '') || '';
    };

    const val = getVal();
    let inputHtml = '';

    if (isTextarea) {
      inputHtml = `<textarea data-field="${fieldKey}" placeholder="${placeholder}">${val}</textarea>`;
    } else if (isSelect || fieldKey === 'Source' || fieldKey === 'Class') {
      let optionsHtml = `<option value="">Select ${label.replace(' *','')}</option>`;
      if (fieldKey === 'Source') {
        const sources = ['Notice Board', 'via friend', 'Newspaper', 'Website', 'Walk In', 'Reference', 'Facebook', 'Instagram'];
        optionsHtml = `<option value="">Select source</option>` + sources.map(s => `<option value="${s}" ${val.toLowerCase() === s.toLowerCase() ? 'selected' : ''}>${s}</option>`).join('');
      } else if (fieldKey === 'Class') {
        const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];
        optionsHtml = `<option value="">Select class</option>` + classes.map(c => `<option value="${c}" ${val.toLowerCase() === c.toLowerCase() ? 'selected' : ''}>${c}</option>`).join('');
      } else {
        optionsHtml = `<option>${placeholder}</option><option ${val==='Active'?'selected':''}>Active</option><option ${val==='Pending'?'selected':''}>Pending</option><option ${val==='Closed'?'selected':''}>Closed</option>`;
      }
      inputHtml = `<select data-field="${fieldKey}">${optionsHtml}</select>`;
    } else if (/Date/.test(label)) {
      inputHtml = `<input type="date" data-field="${fieldKey}" placeholder="${placeholder}" value="${val}">`;
    } else {
      inputHtml = `<input data-field="${fieldKey}" placeholder="${placeholder}" value="${val}">`;
    }

    return `<div class="form-field ${isTextarea ? 'wide' : ''}">
      <label>${label}</label>
      ${inputHtml}
    </div>`;
  }).join('');
}

function openModal(mode, recordId) {
  const isView = mode === 'view';
  editingRecordId = (mode === 'edit') ? recordId : null;

  const labels = { admission: 'Admission Enquiry', visitor: 'Visitor', dispatch: 'Postal Dispatch', receive: 'Postal Receive', phone: 'Phone Call Log', complaint: 'Complaint' };
  const lbl = labels[current] || title(current);
  const act = isView ? 'View' : mode === 'edit' ? 'Edit' : 'Add';

  $('#modalTitle').textContent = `${act} ${lbl}`;
  $('#modalSub').textContent   = isView ? 'Record details and activity' : mode === 'edit' ? 'Update the selected record' : 'Capture details for school records';
  $('#saveText').textContent   = isView ? 'Close' : `${mode === 'edit' ? 'Update' : 'Save'} ${lbl}`;

  let recordObj = {};
  if (recordId && window.AdmissionModule && current === 'admission') {
    recordObj = AdmissionModule.getById(recordId) || {};
  }

  if (isView) {
    const details = [
      ['Student Name', recordObj.studentName || '—'],
      ['Phone Number', recordObj.phoneNumber || '—'],
      ['Source', recordObj.source || '—'],
      ['Enquiry Date', recordObj.enquiryDate || '—'],
      ['Next Follow Up', recordObj.nextFollowUpDate || '—'],
      ['Status', recordObj.status || 'Active'],
      ['Email', recordObj.emailAddress || '—'],
      ['Class', recordObj.studentClass || '—'],
      ['Reference', recordObj.reference || '—'],
      ['Address', recordObj.address || '—'],
      ['Description', recordObj.description || '—']
    ];

    $('#formFields').innerHTML = details.map(([key, val]) =>
      `<div class="detail-item ${/Address|Description|Note|Action/.test(key)?'wide':''}"><span>${key}</span><strong>${val || '—'}</strong></div>`
    ).join('');
  } else {
    $('#formFields').innerHTML = formFields(current, recordObj);
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
  const subItem = e.target.closest('.nav-sub-item[data-view]');
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

  if (current === 'admission' && window.AdmissionModule) {
    const formData = {};
    document.querySelectorAll('#formFields [data-field]').forEach(input => {
      formData[input.dataset.field] = input.value.trim();
    });

    try {
      AdmissionModule.saveRecord({
        studentName: formData.Name || formData.StudentName,
        phoneNumber: formData.Phone || formData.PhoneNumber,
        emailAddress: formData.Email || '',
        purpose: formData.Purpose || 'Admission',
        source: formData.Source || 'Notice Board',
        reference: formData.Reference || 'Self',
        enquiryDate: formData.Date || '',
        nextFollowUpDate: formData.NextFollowUpDate || '',
        status: formData.Status || 'Active',
        studentClass: formData.Class || '',
        address: formData.Address || '',
        description: formData.Description || ''
      }, editingRecordId);

      render();
      closeModal();
    } catch (err) {
      alert(err.message);
    }
    return;
  }

  closeModal();
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
