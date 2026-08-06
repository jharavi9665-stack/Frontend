/* ============================================================
   SCHOOL ERP  –  erp.js
============================================================ */

const viewInfo = {
  admission:    ['Admission Enquiry',      'Manage all prospective student enquiries'],
  visitor:      ['Visitor Book',           'Record and monitor visitors to the school'],
  dispatch:     ['Postal Dispatch',        'Track outgoing correspondence'],
  receive:      ['Postal Receive',         'Track incoming correspondence'],
  phone:        ['Phone Call Log',         'Maintain all school call records'],
  complaint:    ['Complaint List',         'Track and resolve complaints'],
  purpose:      ['Purpose Management',     'Configure enquiry and visitor purposes'],
  complaintType:['Complaint Type Mgmt',    'Configure complaint categories'],
  source:       ['Source Management',      'Configure enquiry sources'],
  reference:    ['Reference Management',   'Manage references'],
  // Student Information
  studentDetails:     ['Student Details',       'View and manage all enrolled students'],
  studentAdmission:   ['Student Admission',     'Admit new students to the school'],
  onlineAdmission:    ['Online Admission',      'Manage online admission requests'],
  disabledStudents:   ['Disabled Students',     'View students with disabled accounts'],
  bulkDelete:         ['Bulk Delete',           'Bulk remove student records'],
  studentCategories:  ['Student Categories',    'Manage student category types'],
  studentHouse:       ['Student House',         'Manage school house assignments'],
  disableReason:      ['Disable Reason',        'Configure reasons for disabling students']
};

const data = {
  admission: [
    ['Satish','8788825286','Notice Board','15-07-2026','—','15-07-2026'],
    ['Drishti Gupta','53820168065','via friend','29-06-2026','—','04-07-2026'],
    ['Drishti Gupta','9047378543','Newspaper','03-06-2026','—','12-06-2026'],
    ['Elan','9653453212','Newspaper','22-05-2026','—','22-05-2026']
  ],
  visitor: [
    ['Ravi Kumar','9845123045','Parents Meeting','15-07-2026','10:30 AM'],
    ['Meera Shah','9654123780','Admission Enquiry','14-07-2026','11:45 AM'],
    ['Ankit Singh','9811234567','General Visit','13-07-2026','09:20 AM']
  ],
  dispatch: [
    ['D-1001','Dept of Education','Important Documents','15-07-2026','Registered Post'],
    ['D-1002','Mr. Rajesh Kumar','Fee Receipt','14-07-2026','Courier']
  ],
  receive: [
    ['R-1001','Education Board','Circular No. 128','15-07-2026','Official'],
    ['R-1002','ABC Publications','Study Materials','13-07-2026','Courier']
  ],
  phone: [
    ['Priya Sharma','9876543210','Incoming','Admission Enquiry','15-07-2026'],
    ['Aman Verma','9812345678','Outgoing','Fee Discussion','14-07-2026'],
    ['Riya Singh','9865321478','Incoming','Transport','13-07-2026']
  ],
  complaint: [
    ['C-1001','Rahul Sharma','Transport','Bus delay issue','15-07-2026'],
    ['C-1002','Meera Patel','Academic','Classroom concern','14-07-2026']
  ],
  purpose: [
    ['Admission Enquiry','Prospective student enquiries'],
    ['Parents Meeting','Meetings with parents'],
    ['General Visit','General school visits'],
    ['Document Submission','Submitting school documents']
  ],
  complaintType: [
    ['Academic','Classroom-related concerns'],
    ['Transport','Bus route and transport concerns'],
    ['Facilities','School facility maintenance'],
    ['Fee','Fee payment concerns']
  ],
  source: [
    ['Website','Enquiries via school website'],
    ['Walk In','Direct visitors to school'],
    ['Newspaper','Newspaper advertisement'],
    ['Social Media','Social media channels']
  ],
  reference: [
    ['Mr. Anil Sharma','Parent reference for admissions'],
    ['Mrs. Neha Gupta','Teacher reference'],
    ['Education Board','Official school reference']
  ],
  // Student Information
  studentDetails: [
    ['Aarav Sharma','Class 5','Roll No. 12','9876543210','Active'],
    ['Priya Mehta','Class 3','Roll No. 07','9845123045','Active'],
    ['Rohan Verma','Class 8','Roll No. 21','9654123780','Active'],
    ['Ananya Singh','Class 6','Roll No. 15','9811234567','Active']
  ],
  studentAdmission: [
    ['Kunal Joshi','Class 1','2025-26','15-07-2026','Pending'],
    ['Sneha Patel','Class 2','2025-26','10-07-2026','Approved']
  ],
  onlineAdmission: [
    ['Riya Kapoor','Class 4','Online Form','12-07-2026','Pending'],
    ['Dev Sharma','Class 7','Online Form','08-07-2026','Reviewed']
  ],
  disabledStudents: [
    ['Vivek Rao','Class 5','Transfer','01-06-2026','Disabled'],
    ['Meena Jain','Class 3','Long Absence','15-05-2026','Disabled']
  ],
  studentCategories: [
    ['General','Default student category'],
    ['OBC','Other Backward Classes'],
    ['SC','Scheduled Caste'],
    ['ST','Scheduled Tribe']
  ],
  studentHouse: [
    ['Red House','Team Courage'],
    ['Blue House','Team Wisdom'],
    ['Green House','Team Nature'],
    ['Yellow House','Team Sunshine']
  ],
  disableReason: [
    ['Transfer','Student transferred to another school'],
    ['Long Absence','Extended unexplained absence'],
    ['Dropout','Student dropped out voluntarily']
  ]
};

let current = 'home';
let editing = false;
let chartMonthly = null;
let chartSession = null;
let chartIncome = null;
let chartExpense = null;

const $ = s => document.querySelector(s);
const title = s => s.replace(/\b\w/g, c => c.toUpperCase());

/* ============================================================
   DASHBOARD HOME VIEW
============================================================ */
function renderHome() {
  $('#app').innerHTML = `
    <!-- Operational Overview -->
    <p class="dash-section-title">Operational Overview</p>
    <div class="overview-grid">

      <div class="overview-card">
        <div class="overview-card-top">
          <svg class="ov-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="#5b7ab8" stroke-width="1.5"/>
            <path d="M3 10h18" stroke="#5b7ab8" stroke-width="1.5"/>
            <path d="M8 3v4M16 3v4" stroke="#5b7ab8" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M7 14h4M7 17h6" stroke="#5b7ab8" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="overview-card-label">FEES AWAITING PAYMENT</span>
        </div>
        <div class="overview-card-val">2 <span>/ 150</span></div>
      </div>

      <div class="overview-card">
        <div class="overview-card-top">
          <svg class="ov-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="7" r="3.5" stroke="#5b7ab8" stroke-width="1.5"/>
            <path d="M2 20c0-3.866 3.134-6 7-6" stroke="#5b7ab8" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="17" cy="8" r="3" stroke="#5b7ab8" stroke-width="1.5"/>
            <path d="M14 20c0-3.5 2.5-5.5 6-5.5" stroke="#5b7ab8" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M13 14.5l1.5 1.5-1.5 1.5" stroke="#5b7ab8" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="overview-card-label">STAFF APPROVED LEAVE</span>
        </div>
        <div class="overview-card-val">0 <span>/ 0</span></div>
      </div>

      <div class="overview-card">
        <div class="overview-card-top">
          <svg class="ov-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="7" r="3.5" stroke="#5b7ab8" stroke-width="1.5"/>
            <path d="M2 20c0-3.866 3.134-6 7-6h2" stroke="#5b7ab8" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="16" cy="8" r="3" stroke="#5b7ab8" stroke-width="1.5"/>
            <path d="M13 20c0-3.5 2.5-5.5 6-5.5" stroke="#5b7ab8" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M19 12l1.5 1.5L19 15" stroke="#5b7ab8" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="overview-card-label">STUDENT APPROVED LEAVE</span>
        </div>
        <div class="overview-card-val">0 <span>/ 0</span></div>
      </div>

      <div class="overview-card">
        <div class="overview-card-top">
          <svg class="ov-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6l4 6-4 6h14l4-6-4-6H3z" stroke="#5b7ab8" stroke-width="1.5" stroke-linejoin="round"/>
            <circle cx="17" cy="12" r="1.5" fill="#5b7ab8"/>
          </svg>
          <span class="overview-card-label">CONVERTED LEADS</span>
        </div>
        <div class="overview-card-val">0 <span>/ 1</span></div>
      </div>

      <div class="overview-card">
        <div class="overview-card-top">
          <svg class="ov-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="7" r="3.5" stroke="#5b7ab8" stroke-width="1.5"/>
            <path d="M2 20c0-3.866 3.134-6 7-6h2c3.866 0 7 2.134 7 6" stroke="#5b7ab8" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="17" cy="8" r="3" stroke="#5b7ab8" stroke-width="1.5"/>
            <path d="M20 18c1.1.5 2 1.4 2 2.5" stroke="#5b7ab8" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="overview-card-label">STAFF PRESENT TODAY</span>
        </div>
        <div class="overview-card-val">0 <span>/ 82</span></div>
      </div>

    </div>

    <!-- Charts Row 1 -->
    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-card-header">
          <span class="chart-card-title">Fees Collection &amp; Expenses For July 2026</span>
          <span class="chart-date-badge">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="16" height="14" rx="2" stroke="#56647b" stroke-width="1.5"/>
              <path d="M6 2v4M14 2v4M2 9h16" stroke="#56647b" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            July 2026
          </span>
        </div>
        <canvas id="chartMonthly" height="130"></canvas>
        <div class="chart-legend">
          <span class="legend-dot blue">Collection</span>
          <span class="legend-dot orange">Expenses</span>
        </div>
      </div>
      <div class="donut-card">
        <div class="chart-card-title" style="margin-bottom:10px">Income — July 2026</div>
        <div class="donut-wrapper">
          <canvas id="chartIncome"></canvas>
          <div class="donut-center">
            <span class="donut-pct" id="incomePct">100%</span>
            <span class="donut-pct-lbl">TOTAL</span>
          </div>
        </div>
        <div class="donut-label-text income-lbl">Total Income</div>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-card-header">
          <span class="chart-card-title">Fees Collection &amp; Expenses For Session 2025-26</span>
        </div>
        <canvas id="chartSession" height="130"></canvas>
        <div class="chart-legend">
          <span class="legend-dot blue">Collection</span>
          <span class="legend-dot orange">Expenses</span>
        </div>
      </div>
      <div class="donut-card">
        <div class="chart-card-title" style="margin-bottom:10px">Expense — July 2026</div>
        <div class="donut-wrapper">
          <canvas id="chartExpense"></canvas>
          <div class="donut-center">
            <span class="donut-pct" id="expensePct">100%</span>
            <span class="donut-pct-lbl">TOTAL</span>
          </div>
        </div>
        <div class="donut-label-text expense-lbl">Total Expense</div>
      </div>
    </div>

    <!-- ── Row 1: Overview stat cards ── -->
    <div class="stat-row">

      <!-- Fees Overview -->
      <div class="stat-card">
        <div class="stat-card-header">
          <svg class="stat-card-ico" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="5" width="18" height="14" rx="2.5" stroke="#6b7fa8" stroke-width="1.5"/>
            <path d="M2 9h18" stroke="#6b7fa8" stroke-width="1.5"/>
            <circle cx="6.5" cy="14" r="1.5" fill="#6b7fa8"/>
            <path d="M10 14h5" stroke="#6b7fa8" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M7 5V3.5A1.5 1.5 0 0115 3.5V5" stroke="#6b7fa8" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="stat-card-ttl">FEES OVERVIEW</span>
        </div>
        <div class="stat-sub-grid">
          <div class="stat-item"><span class="stat-val red">148</span><span class="stat-lbl">Unpaid</span></div>
          <div class="stat-item"><span class="stat-val orange">0</span><span class="stat-lbl">Partial</span></div>
          <div class="stat-item"><span class="stat-val green">2</span><span class="stat-lbl">Paid</span></div>
        </div>
      </div>

      <!-- Enquiry Overview -->
      <div class="stat-card">
        <div class="stat-card-header">
          <svg class="stat-card-ico" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H7l-4 4V4z" stroke="#6b7fa8" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M8 8h6M8 11h4" stroke="#6b7fa8" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="stat-card-ttl">ENQUIRY OVERVIEW</span>
        </div>
        <div class="stat-sub-grid">
          <div class="stat-item"><span class="stat-val blue">1</span><span class="stat-lbl">Active</span></div>
          <div class="stat-item"><span class="stat-val green">0</span><span class="stat-lbl">Won</span></div>
          <div class="stat-item"><span class="stat-val gray">0</span><span class="stat-lbl">Passive</span></div>
          <div class="stat-item"><span class="stat-val red">0</span><span class="stat-lbl">Lost</span></div>
          <div class="stat-item"><span class="stat-val gray">0</span><span class="stat-lbl">Dead</span></div>
        </div>
      </div>

      <!-- Library Overview -->
      <div class="stat-card">
        <div class="stat-card-header">
          <svg class="stat-card-ico" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 3h4v16H4zM10 3h4v16h-4z" stroke="#6b7fa8" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M16 3.5l3.5 15.5-3.8-.8" stroke="#6b7fa8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="stat-card-ttl">LIBRARY OVERVIEW</span>
        </div>
        <div class="stat-sub-grid">
          <div class="stat-item"><span class="stat-val blue">1</span><span class="stat-lbl">Due For<br>Return</span></div>
          <div class="stat-item"><span class="stat-val green">1</span><span class="stat-lbl">Returned</span></div>
          <div class="stat-item"><span class="stat-val gray">—</span><span class="stat-lbl">Issued<br>Out Of</span></div>
          <div class="stat-item"><span class="stat-val gray">—</span><span class="stat-lbl">Available<br>Out Of</span></div>
        </div>
      </div>

      <!-- Student Today Attendance -->
      <div class="stat-card">
        <div class="stat-card-header">
          <svg class="stat-card-ico" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7" cy="7" r="3" stroke="#6b7fa8" stroke-width="1.5"/>
            <path d="M1 19c0-3.314 2.686-5 6-5h2" stroke="#6b7fa8" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="15" cy="9" r="3" stroke="#6b7fa8" stroke-width="1.5"/>
            <path d="M9 19c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="#6b7fa8" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="stat-card-ttl">STUDENT TODAY ATTENDANCE</span>
        </div>
        <div class="attend-grid">
          <div class="attend-item">
            <div class="attend-bar-wrap"><div class="attend-bar attend-bar--green" style="height:0%"></div></div>
            <span class="attend-val green">0</span>
            <span class="attend-lbl">Present</span>
          </div>
          <div class="attend-item">
            <div class="attend-bar-wrap"><div class="attend-bar attend-bar--orange" style="height:0%"></div></div>
            <span class="attend-val orange">0</span>
            <span class="attend-lbl">Late</span>
          </div>
          <div class="attend-item">
            <div class="attend-bar-wrap"><div class="attend-bar attend-bar--red" style="height:0%"></div></div>
            <span class="attend-val red">0</span>
            <span class="attend-lbl">Absent</span>
          </div>
          <div class="attend-item">
            <div class="attend-bar-wrap"><div class="attend-bar attend-bar--blue" style="height:0%"></div></div>
            <span class="attend-val blue">0</span>
            <span class="attend-lbl">Half Day</span>
          </div>
        </div>
      </div>

    </div>

    <!-- ── Row 2: Summary cards ── -->
    <div class="summary-row">

      <div class="summary-card">
        <div class="summary-icon-circle blue-circle">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="14" rx="2.5" stroke="#3b82f6" stroke-width="1.6"/>
            <path d="M3 10h18" stroke="#3b82f6" stroke-width="1.6"/>
            <circle cx="12" cy="15" r="2.5" stroke="#3b82f6" stroke-width="1.4"/>
            <path d="M8 6V4.5a2 2 0 014 0V6M16 6V4.5a2 2 0 00-4 0" stroke="#3b82f6" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="summary-info">
          <span class="summary-lbl">MONTHLY FEES COLLECTION</span>
          <span class="summary-val">$0</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon-circle orange-circle">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2h12l2 4H4l2-4z" stroke="#f97316" stroke-width="1.5" stroke-linejoin="round"/>
            <rect x="4" y="6" width="16" height="16" rx="2" stroke="#f97316" stroke-width="1.5"/>
            <path d="M9 11h6M9 15h4" stroke="#f97316" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="summary-info">
          <span class="summary-lbl">MONTHLY EXPENSES</span>
          <span class="summary-val">$0</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon-circle purple-circle">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="#a855f7" stroke-width="1.6"/>
            <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#a855f7" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="summary-info">
          <span class="summary-lbl">STUDENT</span>
          <span class="summary-val">3212</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon-circle teal-circle">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="3.5" stroke="#14b8a6" stroke-width="1.5"/>
            <path d="M2 20c0-3.314 2.686-5.5 6-5.5h4c3.314 0 6 2.186 6 5.5" stroke="#14b8a6" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="17" cy="7" r="2.5" stroke="#14b8a6" stroke-width="1.5"/>
            <path d="M20 17c1.1.6 2 1.7 2 3" stroke="#14b8a6" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="summary-info">
          <span class="summary-lbl">STUDENT HEAD COUNT</span>
          <span class="summary-val">3212</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon-circle pink-circle">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="#ec4899" stroke-width="1.6"/>
            <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#ec4899" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="summary-info">
          <span class="summary-lbl">ADMIN</span>
          <span class="summary-val">3</span>
        </div>
      </div>

    </div>

    <!-- ── Row 3: Role cards ── -->
    <div class="role-row">

      <div class="role-card">
        <div class="role-icon-circle green-rc">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="7" r="4" stroke="#22c55e" stroke-width="1.6"/>
            <path d="M4 21c0-4 3.582-7 8-7s8 3 8 7" stroke="#22c55e" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M16 3l1.5 1.5L20 2" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="role-info"><span class="role-lbl">TEACHER</span><span class="role-val">72</span></div>
      </div>

      <div class="role-card">
        <div class="role-icon-circle yellow-rc">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2h12l2 5H4l2-5z" stroke="#eab308" stroke-width="1.5" stroke-linejoin="round"/>
            <rect x="4" y="7" width="16" height="15" rx="2" stroke="#eab308" stroke-width="1.5"/>
            <path d="M9 12h6M9 16h4" stroke="#eab308" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="role-info"><span class="role-lbl">ACCOUNTANT</span><span class="role-val">2</span></div>
      </div>

      <div class="role-card">
        <div class="role-icon-circle indigo-rc">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4h7v16H4zM13 4h7v16h-7z" stroke="#6366f1" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M7 9h1M17 9h1M7 13h1M17 13h1" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="role-info"><span class="role-lbl">LIBRARIAN</span><span class="role-val">2</span></div>
      </div>

      <div class="role-card">
        <div class="role-icon-circle rose-rc">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="#f43f5e" stroke-width="1.6"/>
            <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#f43f5e" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M17 3v4M15 5h4" stroke="#f43f5e" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="role-info"><span class="role-lbl">RECEPTIONIST</span><span class="role-val">2</span></div>
      </div>

      <div class="role-card">
        <div class="role-icon-circle navy-rc">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l8 4v6c0 4.418-3.582 8-8 9-4.418-1-8-4.582-8-9V6l8-4z" stroke="#3b4ea6" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M9 12l2 2 4-4" stroke="#3b4ea6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="role-info"><span class="role-lbl">SUPER ADMIN</span><span class="role-val">1</span></div>
      </div>

    </div>
  `;

  /* Defer chart render until DOM is painted */
  requestAnimationFrame(() => initCharts());
}

/* ============================================================
   CHART INITIALISATION
============================================================ */
function initCharts() {
  const monthLabels = ['01','05','09','13','17','21','25','29'];
  const sessionLabels = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

  const lineOpts = (labels, col, exp) => ({
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Collection',
          data: col,
          borderColor: '#10285f',
          backgroundColor: 'rgba(16,40,95,.08)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#10285f'
        },
        {
          label: 'Expenses',
          data: exp,
          borderColor: '#f3bf3b',
          backgroundColor: 'rgba(243,191,59,.07)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#f3bf3b'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: -1, max: 1,
          ticks: { font: { size: 10 }, color: '#8994a7' },
          grid: { color: '#f0f2f8' }
        },
        x: {
          ticks: { font: { size: 10 }, color: '#8994a7' },
          grid: { display: false }
        }
      }
    }
  });

  const donutOpts = (color, bg) => ({
    type: 'doughnut',
    data: {
      datasets: [{
        data: [100, 0],
        backgroundColor: [color, '#f0f2f8'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '72%',
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      animation: { duration: 900, easing: 'easeInOutQuart' }
    }
  });

  /* Destroy old instances if navigating back */
  [chartMonthly, chartSession, chartIncome, chartExpense].forEach(c => c && c.destroy());

  const mc = document.getElementById('chartMonthly');
  const sc = document.getElementById('chartSession');
  const ic = document.getElementById('chartIncome');
  const ec = document.getElementById('chartExpense');

  if (mc) chartMonthly = new Chart(mc, lineOpts(
    monthLabels,
    [0, 0, 0.1, -0.2, 0, 0.05, -0.1, 0],
    [0, 0, -0.15, -0.3, -0.2, -0.1, -0.25, -0.2]
  ));
  if (sc) chartSession = new Chart(sc, lineOpts(
    sessionLabels,
    [0, 0, 0, 0.1, -0.2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, -0.2, -0.3, -0.1, 0, 0, 0, 0, 0, 0]
  ));
  if (ic) chartIncome  = new Chart(ic,  donutOpts('#10285f', '#e8eef9'));
  if (ec) chartExpense = new Chart(ec,  donutOpts('#f3bf3b', '#fff4da'));
}

function formatDateForInput(dateStr) {
  if (!dateStr || dateStr === '—') return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return '';
}

function formatDateForDisplay(dateStr) {
  if (!dateStr || dateStr === '—') return '—';
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

/* ============================================================
   MODULE VIEW (tables, forms, etc.)
============================================================ */
function fields(type) {
  const common = {
    admission: ['Name *|Enter full name','Phone *|Enter phone number','Email|Enter email address','Address|Enter full address','Description|Enquiry details...','Note|Additional notes...','Date *|DD-MM-YYYY','Next Follow Up Date *|DD-MM-YYYY','Assigned|Select staff','Reference|Select reference','Source *|Select source','Class|Select class','Number Of Child|Enter number of children'],
    visitor:   ['Name *|Enter visitor name','Phone *|Enter phone number','Purpose *|Select purpose','Meeting With|Select staff','Date *|DD-MM-YYYY','In Time|10:30 AM','Out Time|Select out time','ID Proof|Enter ID proof number','Address|Enter address','Note|Additional notes...'],
    dispatch:  ['To Title *|Enter receiver name','Reference No.|Enter reference number','Address *|Enter full address','Note|Enter dispatch notes','From Title|School Office','Date *|DD-MM-YYYY','Type|Select dispatch type','Document|Choose file'],
    receive:   ['From Title *|Enter sender name','Reference No.|Enter reference number','Address|Enter address','Note|Enter receive notes','Date *|DD-MM-YYYY','Type|Select receive type','Document|Choose file'],
    phone:     ['Name *|Enter caller name','Phone *|Enter phone number','Date *|DD-MM-YYYY','Follow Up Date|DD-MM-YYYY','Call Type|Select call type','Duration|Enter call duration','Description|Enter call details','Note|Additional notes...'],
    complaint: ['Complain By *|Enter complainant name','Phone|Enter phone number','Date *|DD-MM-YYYY','Type *|Select complaint type','Source|Select source','Assigned|Select staff','Description *|Describe the complaint','Action Taken|Enter action taken'],
    purpose:   ['Purpose *|Enter purpose name','Description|Enter description'],
    complaintType:['Complaint Type *|Enter complaint type','Description|Enter description'],
    source:    ['Source *|Enter source name','Description|Enter description'],
    reference: ['Reference *|Enter reference name','Contact|Enter contact details','Description|Enter description'],
    // Student Information
    studentDetails:    ['First Name *|Enter first name','Last Name *|Enter last name','Phone *|Enter phone number','Email|Enter email address','Class *|Select class','Section|Select section','Roll No.|Enter roll number','Date of Birth|DD-MM-YYYY','Gender|Select gender','Address|Enter full address','Parent Name *|Enter parent name','Parent Phone *|Enter parent phone'],
    studentAdmission:  ['Student Name *|Enter student name','Class *|Select class','Section|Select section','Session *|Select session','Admission Date *|DD-MM-YYYY','Roll No.|Enter roll number','Parent Name *|Enter parent name','Parent Phone *|Enter parent phone','Address|Enter full address','Note|Additional notes...'],
    onlineAdmission:   ['Student Name *|Enter student name','Class *|Select class','Email *|Enter email address','Phone *|Enter phone number','Date *|DD-MM-YYYY','Address|Enter full address','Description|Additional information...'],
    disabledStudents:  ['Student Name *|Enter student name','Class *|Select class','Reason *|Select reason','Date *|DD-MM-YYYY','Note|Enter additional notes'],
    studentCategories: ['Category Name *|Enter category name','Description|Enter description'],
    studentHouse:      ['House Name *|Enter house name','Description|Enter description'],
    disableReason:     ['Reason *|Enter reason name','Description|Enter description']
  };
  return common[type] || common.admission;
}

function formFields(type, recordData = {}) {
  return fields(type).map((item, i) => {
    const [label, placeholder] = item.split('|');
    const fieldKey = label.replace(' *', '').replace(/\s+/g, '');
    const isTextarea = /Description|Address|Note|Action/.test(label);
    const isSelect   = /Select/.test(placeholder);

    const getVal = () => {
      if (type === 'admission') {
        switch (fieldKey) {
          case 'Name': return recordData.studentName || recordData.Name || '';
          case 'Phone': return recordData.phoneNumber || recordData.Phone || '';
          case 'Email': return recordData.emailAddress || recordData.Email || '';
          case 'Address': return recordData.address || recordData.Address || '';
          case 'Description': return recordData.description || recordData.Description || '';
          case 'Note': return recordData.note || recordData.Note || '';
          case 'Date': return formatDateForInput(recordData.enquiryDate || recordData.Date || '');
          case 'NextFollowUpDate': return formatDateForInput(recordData.nextFollowUpDate || recordData.NextFollowUpDate || '');
          case 'Assigned': return recordData.assigned || recordData.Assigned || '';
          case 'Reference': return recordData.reference || recordData.Reference || '';
          case 'Source': return recordData.source || recordData.Source || '';
          case 'Class': return recordData.studentClass || recordData.Class || '';
          case 'NumberOfChild': return recordData.numberOfChild || recordData.NumberOfChild || '';
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

/* ============================================================
   RENDER MODULE TABLE VIEW
============================================================ */
function render() {
  if (current === 'home') { renderHome(); return; }

  const info = viewInfo[current] || [title(current), 'This module is ready for configuration'];
  if (!viewInfo[current]) {
    $('#app').innerHTML = `<section class="info-card empty-view">
      <div class="big-icon">◈</div>
      <h1>${title(current)}</h1>
      <p>This area is available from the main school platform.</p>
    </section>`;
    return;
  }

  const admissionRaw = (window.StorageUtils && window.STORAGE_KEYS)
    ? StorageUtils.get(STORAGE_KEYS.ADMISSION, [
        { id: 'ENQ1001', studentName: 'Satish', phoneNumber: '8788825286', source: 'Notice Board', enquiryDate: '15-07-2026', lastFollowUpDate: '—', nextFollowUpDate: '15-07-2026', status: 'Active' },
        { id: 'ENQ1002', studentName: 'Drishti Gupta', phoneNumber: '53820168065', source: 'via friend', enquiryDate: '29-06-2026', lastFollowUpDate: '—', nextFollowUpDate: '04-07-2026', status: 'Active' },
        { id: 'ENQ1003', studentName: 'Drishti Gupta', phoneNumber: '9047378543', source: 'Newspaper', enquiryDate: '03-06-2026', lastFollowUpDate: '—', nextFollowUpDate: '12-06-2026', status: 'Active' },
        { id: 'ENQ1004', studentName: 'Elan', phoneNumber: '9653453212', source: 'Newspaper', enquiryDate: '22-05-2026', lastFollowUpDate: '—', nextFollowUpDate: '22-05-2026', status: 'Active' }
      ])
    : [];

  const rows = current === 'admission'
    ? admissionRaw.map(r => [r.studentName, r.phoneNumber, r.source, r.enquiryDate || '—', r.lastFollowUpDate || '—', r.nextFollowUpDate || '—', r.status || 'Active', r.id])
    : (data[current] || []);

  const columns = current === 'admission'
    ? ['Name','Phone','Source','Enquiry Date','Last Follow Up Date','Next Follow Up Date','Status','Action']
    : current === 'visitor'
    ? ['Visitor Name','Phone','Purpose','Date','In Time','Status','Action']
    : current === 'phone'
    ? ['Name','Phone','Call Type','Purpose','Date','Status','Action']
    : current === 'complaint'
    ? ['Complaint No.','Complain By','Type','Description','Date','Status','Action']
    : current === 'studentDetails'
    ? ['Student Name','Class','Roll No.','Phone','Status','Action']
    : current === 'studentAdmission'
    ? ['Student Name','Class','Session','Date','Status','Action']
    : current === 'onlineAdmission'
    ? ['Student Name','Class','Form Type','Date','Status','Action']
    : current === 'disabledStudents'
    ? ['Student Name','Class','Reason','Date','Status','Action']
    : ['Name','Description','Status','Action'];

  const rowsHtml = rows.map((r, rIdx) => {
    if (current === 'admission') {
      const avatarVariants = [
        { bg: '#e0e7ff', color: '#4338ca' },
        { bg: '#fef3c7', color: '#d97706' },
        { bg: '#f3e8ff', color: '#7e22ce' },
        { bg: '#ccfbf1', color: '#0d9488' }
      ];
      const av = avatarVariants[rIdx % avatarVariants.length];
      const isFriend = r[2] && r[2].toLowerCase().includes('friend');
      const dotColor = isFriend ? '#eab308' : '#6366f1';
      const badgeBg = isFriend ? '#fefce8' : '#f8fafc';
      const badgeBorder = isFriend ? '#fef08a' : '#e2e8f0';

      const calIcon = `<svg class="cell-cal-icon" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

      const recordId = r[7] || '';

      return `<tr data-id="${recordId}">
        <td>
          <span class="person">
            <span class="initial" style="background:${av.bg}; color:${av.color};">${(r[0]||'E')[0].toUpperCase()}</span>
            <span class="person-name">${r[0] || '—'}</span>
          </span>
        </td>
        <td>${r[1] || '—'}</td>
        <td>
          <span class="source-badge" style="background:${badgeBg}; border:1px solid ${badgeBorder};">
            <span class="source-dot" style="background:${dotColor};"></span>
            ${r[2] || '—'}
          </span>
        </td>
        <td><span class="date-cell">${calIcon} ${r[3]}</span></td>
        <td>${r[4] === '—' || !r[4] ? '—' : `<span class="date-cell">${calIcon} ${r[4]}</span>`}</td>
        <td><span class="date-cell">${calIcon} ${r[5]}</span></td>
        <td><span class="status status-active"><span class="status-dot">●</span> ${r[6] || 'Active'}</span></td>
        <td>
          <div class="row-actions">
            <button class="act-btn call" data-action="view" data-id="${recordId}" title="Call">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </button>
            <button class="act-btn edit" data-action="edit" data-id="${recordId}" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="act-btn delete" data-action="delete" data-id="${recordId}" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
    }

    return `<tr>
      ${columns.slice(0,-2).map((_,i) => i === 0
        ? `<td><span class="person"><span class="initial">${r[i][0]}</span>${r[i]}</span></td>`
        : `<td>${r[i] || '—'}</td>`).join('')}
      <td><span class="status status-active">● Active</span></td>
      <td><div class="row-actions">
        <button class="act-btn call" data-action="view" title="Call">📞</button>
        <button class="act-btn edit" data-action="edit" title="Edit">✎</button>
        <button class="act-btn delete" data-action="delete" title="Delete">🗑</button>
      </div></td>
    </tr>`;
  }).join('');

  const filters = ['admission','visitor'].includes(current)
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
                <select><option>Select Class</option></select>
              </div>
            </div>
            <div class="field">
              <label>Source</label>
              <div class="input-icon-group">
                <svg class="field-ico" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <select><option>Select Source</option></select>
              </div>
            </div>
            <div class="field">
              <label>Enquiry From Date *</label>
              <div class="input-icon-group">
                <svg class="field-ico" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input placeholder="DD-MM-YYYY">
              </div>
            </div>
            <div class="field">
              <label>Enquiry To Date *</label>
              <div class="input-icon-group">
                <svg class="field-ico" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input placeholder="DD-MM-YYYY">
              </div>
            </div>
            <div class="field">
              <label>Status</label>
              <select class="status-select"><option>● Active</option></select>
            </div>
          </div>
          <div class="criteria-right-col">
            <button class="field-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search
            </button>
            <div class="reset">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              Reset Filters
            </div>
          </div>
        </div>
      </section>` : '';

  const setupViews = ['purpose','complaintType','source','reference'];
  const setupTabs  = setupViews.includes(current)
    ? `<nav class="setup-tabs"><span>Setup Front Office</span>
        <a href="#purpose" data-view="purpose" class="${current==='purpose'?'active':''}">Purpose</a>
        <a href="#complaintType" data-view="complaintType" class="${current==='complaintType'?'active':''}">Complaint Type</a>
        <a href="#source" data-view="source" class="${current==='source'?'active':''}">Source Management</a>
        <a href="#reference" data-view="reference" class="${current==='reference'?'active':''}">Reference Management</a>
      </nav>` : '';

  const addNames = {admission:'Enquiry',visitor:'Visitor',phone:'Phone Call',complaint:'Complaint',purpose:'Purpose',complaintType:'Complaint Type',source:'Source',reference:'Reference',dispatch:'Postal Dispatch',receive:'Postal Receive',studentDetails:'Student',studentAdmission:'Student Admission',onlineAdmission:'Online Admission',disabledStudents:'Disabled Student',studentCategories:'Category',studentHouse:'House',disableReason:'Disable Reason'};
  const addName  = addNames[current] || title(current);

  $('#app').innerHTML = `
    ${filters}${setupTabs}
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
          <input placeholder="Search by name, phone or source...">
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
          <thead><tr>${columns.map(c=>`<th>${c} ${c === 'Action' ? '' : '<span class="sort-icon">↕</span>'}</th>`).join('')}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
      <div class="pager">
        <span>Showing 1 to ${rows.length} of ${rows.length} entries</span>
        <div class="pages">
          <button class="page-nav">‹</button><button class="current">1</button><button class="page-nav">›</button>
        </div>
      </div>
    </section>`;

  $('#addRecord').onclick = () => openModal('add');
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.onclick = () => {
      const row = btn.closest('tr');
      const recordId = btn.dataset.id || (row ? row.dataset.id : null);
      if (btn.dataset.action === 'delete') {
        if (current === 'admission' && recordId && window.StorageUtils) {
          if (confirm(`Are you sure you want to delete enquiry ${recordId}?`)) {
            StorageUtils.delete(STORAGE_KEYS.ADMISSION, recordId);
            render();
          }
        } else if (row) {
          row.remove();
        }
      } else {
        const idx = [...row.parentElement.children].indexOf(row);
        openModal(btn.dataset.action, rows[idx]);
      }
    };
  });
}

/* ============================================================
   DETAIL VIEW FOR MODAL
============================================================ */
function detailsFor(type, row) {
  if (type === 'admission') {
    const recordId = Array.isArray(row) ? row[7] : (row ? row.id : null);
    const r = (recordId && window.StorageUtils) ? (StorageUtils.getById(STORAGE_KEYS.ADMISSION, recordId) || {}) : (Array.isArray(row) ? { studentName: row[0], phoneNumber: row[1], source: row[2], enquiryDate: row[3], lastFollowUpDate: row[4], nextFollowUpDate: row[5], status: row[6] } : row || {});

    return [
      ['Student Name', r.studentName || '—'],
      ['Phone Number', r.phoneNumber || '—'],
      ['Source', r.source || '—'],
      ['Enquiry Date', formatDateForDisplay(r.enquiryDate)],
      ['Next Follow Up', formatDateForDisplay(r.nextFollowUpDate)],
      ['Status', r.status || 'Active'],
      ['Email', r.emailAddress || '—'],
      ['Class', r.studentClass || '—'],
      ['Reference', r.reference || '—'],
      ['Address', r.address || '—'],
      ['Description', r.description || '—']
    ];
  }
  const extra = {
    visitor:    [['Visitor Name',row[0]],['Phone Number',row[1]],['Purpose',row[2]],['Visit Date',row[3]],['In Time',row[4]],['Out Time','12:00 PM'],['Meeting With','Admin'],['ID Proof','Aadhaar Card'],['Status','Active'],['Address','New Delhi, India']],
    phone:      [['Caller Name',row[0]],['Phone Number',row[1]],['Call Type',row[2]],['Purpose',row[3]],['Call Date',row[4]],['Follow Up Date','20-07-2026'],['Call Duration','05:20 mins'],['Assigned To','Admin'],['Description','Parent called the school office.']],
    dispatch:   [['Reference No.',row[0]],['Sent To',row[1]],['Subject',row[2]],['Dispatch Date',row[3]],['Dispatch Type',row[4]],['From','Devryon Demo School'],['Address','New Delhi, India'],['Note','Document sent successfully.']],
    receive:    [['Reference No.',row[0]],['Received From',row[1]],['Subject',row[2]],['Receive Date',row[3]],['Receive Type',row[4]],['Received By','Admin'],['Address','New Delhi, India'],['Note','Document received and recorded.']],
    complaint:  [['Complaint No.',row[0]],['Complain By',row[1]],['Type',row[2]],['Description',row[3]],['Date',row[4]],['Status','Active'],['Assigned To','Admin'],['Action Taken','Under review.']]
  };
  return extra[type] || [['Name',row[0]],['Description',row[1]||'—'],['Status','Active'],['Created By','Admin']];
}

/* ============================================================
   MODAL
============================================================ */
let editingRecordId = null;

function openModal(mode, record) {
  editing = mode !== 'add';
  const isView = mode === 'view';
  const recId = record ? (Array.isArray(record) ? record[7] : record.id) : null;
  editingRecordId = (mode === 'edit') ? recId : null;

  const labels = {admission:'Admission Enquiry',visitor:'Visitor',dispatch:'Postal Dispatch',receive:'Postal Receive',phone:'Phone Call Log',complaint:'Complaint',purpose:'Purpose',complaintType:'Complaint Type',source:'Source',reference:'Reference'};
  const lbl    = labels[current] || title(current);
  const act    = isView ? 'View' : mode === 'edit' ? 'Edit' : 'Add';

  $('#modalTitle').textContent = `${act} ${lbl}`;
  $('#modalSub').textContent   = isView ? 'Record details and activity' : mode === 'edit' ? 'Update the selected record' : 'Capture details for school records';
  $('#saveText').textContent   = isView ? 'Close' : `${mode==='edit'?'Update':'Save'} ${lbl}`;

  let recordObj = {};
  if (recId && window.StorageUtils && current === 'admission') {
    recordObj = StorageUtils.getById(STORAGE_KEYS.ADMISSION, recId) || {};
  } else if (record) {
    if (Array.isArray(record)) {
      recordObj = { studentName: record[0], phoneNumber: record[1], source: record[2], enquiryDate: record[3], lastFollowUpDate: record[4], nextFollowUpDate: record[5], status: record[6], id: record[7] };
    } else {
      recordObj = record;
    }
  }

  $('#formFields').innerHTML = isView
    ? detailsFor(current, record).map(([key, val]) =>
        `<div class="detail-item ${/Address|Description|Note|Action/.test(key)?'wide':''}"><span>${key}</span><strong>${val || '—'}</strong></div>`
      ).join('')
    : formFields(current, recordObj);

  $('#recordModal').classList.add('show');
  $('#recordModal').setAttribute('aria-hidden','false');
}

function closeModal() {
  $('#recordModal').classList.remove('show');
  $('#recordModal').setAttribute('aria-hidden','true');
  editingRecordId = null;
}

/* ============================================================
   EVENT DELEGATION
============================================================ */
document.addEventListener('click', e => {
  /* Close modal */
  if (e.target.matches('[data-close]') || e.target === $('#recordModal')) closeModal();

  /* Nav group toggle (dropdown header) */
  const groupToggle = e.target.closest('.nav-group-toggle');
  if (groupToggle) {
    e.preventDefault();
    const group = groupToggle.closest('.nav-group');
    const isOpen = group.classList.contains('open');
    // Close all other groups first
    document.querySelectorAll('.nav-group.open').forEach(g => g.classList.remove('open'));
    if (!isOpen) group.classList.add('open');
    return;
  }

  /* Sub-menu item clicks */
  const subItem = e.target.closest('.nav-sub-item[data-view]');
  if (subItem) {
    e.preventDefault();
    current = subItem.dataset.view;
    // Mark active sub-item
    document.querySelectorAll('.nav-sub-item').forEach(a => a.classList.remove('active'));
    subItem.classList.add('active');
    // Keep group toggle highlighted
    document.querySelectorAll('.nav-group-toggle').forEach(a => a.classList.remove('active'));
    subItem.closest('.nav-group').querySelector('.nav-group-toggle').classList.add('active');
    // Deactivate plain nav links
    document.querySelectorAll('#mainNav > a').forEach(a => a.classList.remove('active'));
    render();
    if (innerWidth < 900) $('#sidebar').classList.remove('open');
    return;
  }

  /* Regular Nav links */
  const link = e.target.closest('#mainNav > a[data-view]');
  if (link) {
    e.preventDefault();
    current = link.dataset.view;
    document.querySelectorAll('#mainNav > a').forEach(a => a.classList.toggle('active', a === link));
    // Deactivate any sub-items & group toggles
    document.querySelectorAll('.nav-sub-item').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.nav-group-toggle').forEach(a => a.classList.remove('active'));
    // Close dropdowns
    document.querySelectorAll('.nav-group.open').forEach(g => g.classList.remove('open'));
    render();
    if (innerWidth < 900) $('#sidebar').classList.remove('open');
    return;
  }

  /* Setup tabs links */
  const setupLink = e.target.closest('[data-view]');
  if (setupLink && !setupLink.closest('#mainNav')) {
    e.preventDefault();
    current = setupLink.dataset.view;
    render();
  }
});

$('#recordForm').addEventListener('submit', e => {
  e.preventDefault();

  if (current === 'admission' && window.StorageUtils) {
    const formData = {};
    document.querySelectorAll('#formFields [data-field]').forEach(input => {
      formData[input.dataset.field] = input.value.trim();
    });

    const studentName = formData.Name || formData.StudentName;
    const phoneNumber = formData.Phone || formData.PhoneNumber;

    if (!studentName || !phoneNumber) {
      alert('Please enter Student Name and Phone Number.');
      return;
    }

    const source = (formData.Source && !formData.Source.includes('Select')) ? formData.Source : 'Notice Board';
    const rawDate = formData.Date || formData.EnquiryDate || '';
    const enquiryDate = formatDateForDisplay(rawDate) || formatDateForDisplay(new Date().toISOString().split('T')[0]);
    const rawNextDate = formData.NextFollowUpDate || '';
    const nextFollowUpDate = formatDateForDisplay(rawNextDate) || enquiryDate;

    const recordPayload = {
      studentName,
      phoneNumber,
      emailAddress: formData.Email || '',
      purpose: formData.Purpose || 'Admission',
      source,
      reference: formData.Reference || 'Self',
      enquiryDate,
      lastFollowUpDate: '—',
      nextFollowUpDate,
      status: formData.Status || 'Active',
      studentClass: (formData.Class && !formData.Class.includes('Select')) ? formData.Class : '',
      address: formData.Address || '',
      description: formData.Description || ''
    };

    if (editingRecordId) {
      StorageUtils.update(STORAGE_KEYS.ADMISSION, editingRecordId, recordPayload);
    } else {
      StorageUtils.add(STORAGE_KEYS.ADMISSION, recordPayload, 'id', 'ENQ');
    }

    render();
  }

  closeModal();
});
$('#menuToggle').onclick = () => $('#sidebar').classList.toggle('open');

window.addEventListener('hashchange', () => {
  const h = location.hash.slice(1);
  if (h && h !== current) { current = h; render(); }
});

/* ── Boot ── */
const frontOfficeViews = ['admission','visitor','dispatch','phone','receive','complaint','purpose','complaintType','source','reference'];
const studentViews     = ['studentDetails','studentAdmission','onlineAdmission','disabledStudents','bulkDelete','studentCategories','studentHouse','disableReason'];
current = location.hash.slice(1) || 'home';

// If booting into a front-office sub-view, open the dropdown and mark it active
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
  // Open Front Office group by default on home page too (matches second screenshot)
  const group = document.getElementById('navGroupFrontOffice');
  if (group) group.classList.add('open');
  const toggle = group && group.querySelector('.nav-group-toggle');
  if (toggle) toggle.classList.add('active');
}

render();
