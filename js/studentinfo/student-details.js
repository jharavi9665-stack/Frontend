/* ============================================================
   SCHOOL ERP – student-details.js
   Student Details Controller & Data Module
   Handles criteria searching, List/Details view switching,
   sorting, pagination, storage, and export tools.
============================================================ */

(function () {
  'use strict';

  /* ------------------------------------------------------------
     1. INITIAL SAMPLE DATA & STORAGE SETUP
  ------------------------------------------------------------ */
  const STORAGE_KEY = 'school_erp_students';

  const defaultStudents = [
    {
      id: 'STU1001',
      admissionNo: 'ADM2025001',
      studentName: 'Aarav Sharma',
      rollNo: '101',
      class: 'Class 1',
      section: 'A',
      fatherName: 'Rajesh Sharma',
      dob: '2019-05-14',
      gender: 'Male',
      category: 'General',
      mobileNumber: '9876543210',
      email: 'aarav.sharma@example.com'
    },
    {
      id: 'STU1002',
      admissionNo: 'ADM2025002',
      studentName: 'Ananya Verma',
      rollNo: '102',
      class: 'Class 1',
      section: 'A',
      fatherName: 'Sunil Verma',
      dob: '2019-08-22',
      gender: 'Female',
      category: 'OBC',
      mobileNumber: '9876543211',
      email: 'ananya.v@example.com'
    },
    {
      id: 'STU1003',
      admissionNo: 'ADM2025003',
      studentName: 'Rohan Gupta',
      rollNo: '103',
      class: 'Class 2',
      section: 'B',
      fatherName: 'Vikas Gupta',
      dob: '2018-03-10',
      gender: 'Male',
      category: 'General',
      mobileNumber: '9876543212',
      email: 'rohan.gupta@example.com'
    },
    {
      id: 'STU1004',
      admissionNo: 'ADM2025004',
      studentName: 'Diya Patel',
      rollNo: '104',
      class: 'Class 3',
      section: 'A',
      fatherName: 'Prakash Patel',
      dob: '2017-11-05',
      gender: 'Female',
      category: 'General',
      mobileNumber: '9876543213',
      email: 'diya.p@example.com'
    },
    {
      id: 'STU1005',
      admissionNo: 'ADM2025005',
      studentName: 'Kabir Singh',
      rollNo: '105',
      class: 'Class 4',
      section: 'C',
      fatherName: 'Manjit Singh',
      dob: '2016-07-19',
      gender: 'Male',
      category: 'OBC',
      mobileNumber: '9876543214',
      email: 'kabir.s@example.com'
    }
  ];

  /* ------------------------------------------------------------
     2. MODULE STATE
  ------------------------------------------------------------ */
  const state = {
    hasSearched: false,      // Initially false to match Image 1 (shows empty table state until search is triggered)
    currentView: 'list',     // 'list' or 'details'
    currentPage: 1,
    perPage: 50,
    sortCol: null,
    sortAsc: true,
    filterClass: '',
    filterSection: '',
    filterKeyword: '',
    editingStudentId: null
  };

  /* ------------------------------------------------------------
     3. DATA ACCESS METHODS
  ------------------------------------------------------------ */
  function getAllStudents() {
    if (window.StorageUtils) {
      return StorageUtils.get(STORAGE_KEY, defaultStudents);
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultStudents;
  }

  function saveStudents(list) {
    if (window.StorageUtils) {
      StorageUtils.set(STORAGE_KEY, list);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  }

  function getStudentById(id) {
    const list = getAllStudents();
    return list.find(s => s.id === id || s.admissionNo === id);
  }

  function saveStudent(studentData, editId = null) {
    const list = getAllStudents();
    if (editId) {
      const idx = list.findIndex(s => s.id === editId || s.admissionNo === editId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...studentData };
      }
    } else {
      const newId = 'STU' + (1000 + list.length + 1);
      list.push({ id: newId, ...studentData });
    }
    saveStudents(list);
  }

  function deleteStudent(id) {
    let list = getAllStudents();
    list = list.filter(s => s.id !== id && s.admissionNo !== id);
    saveStudents(list);
  }

  /* ------------------------------------------------------------
     4. FILTER & SORT LOGIC
  ------------------------------------------------------------ */
  function getFilteredStudents() {
    if (!state.hasSearched) {
      // Return empty list before initial search, exactly as in target Image 1
      return [];
    }

    let records = getAllStudents();

    if (state.filterClass) {
      records = records.filter(s => (s.class || '').toLowerCase() === state.filterClass.toLowerCase());
    }

    if (state.filterSection) {
      records = records.filter(s => (s.section || '').toLowerCase() === state.filterSection.toLowerCase());
    }

    if (state.filterKeyword) {
      const kw = state.filterKeyword.toLowerCase().trim();
      records = records.filter(s =>
        (s.studentName || '').toLowerCase().includes(kw) ||
        (s.admissionNo || '').toLowerCase().includes(kw) ||
        (s.rollNo || '').toLowerCase().includes(kw) ||
        (s.fatherName || '').toLowerCase().includes(kw) ||
        (s.mobileNumber || '').toLowerCase().includes(kw)
      );
    }

    if (state.sortCol) {
      records.sort((a, b) => {
        const valA = (a[state.sortCol] || '').toString().toLowerCase();
        const valB = (b[state.sortCol] || '').toString().toLowerCase();
        if (valA < valB) return state.sortAsc ? -1 : 1;
        if (valA > valB) return state.sortAsc ? 1 : -1;
        return 0;
      });
    }

    return records;
  }

  /* ------------------------------------------------------------
     5. HTML TEMPLATE BUILDER (For Dashboard & Standalone View)
  ------------------------------------------------------------ */
  function getTemplateHtml() {
    return `
      <div class="student-details-container">
        <!-- ==================== 1. HEADER BANNER CARD ==================== -->
        <section class="sd-banner-card">
          <div class="sd-banner-left">
            <div class="sd-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="#f59e0b"/>
                <path d="M5 13.18V17.5C5 19.99 8.13 22 12 22C15.87 22 19 19.99 19 17.5V13.18L12 17L5 13.18Z" fill="#f59e0b"/>
                <circle cx="12" cy="11.5" r="3.2" fill="#ffffff"/>
                <path d="M7 19C7 16.5 9.24 14.5 12 14.5C14.76 14.5 17 16.5 17 19" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="sd-title-box">
              <h1 class="sd-title">Student Details</h1>
              <p class="sd-subtitle">Search and manage student information efficiently.</p>
            </div>
          </div>

          <div class="sd-banner-right">
            <svg class="sd-banner-illustration" viewBox="0 0 280 88" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.45">
                <circle cx="35" cy="22" r="3" fill="#cbd5e1"/>
                <circle cx="28" cy="36" r="2.5" fill="#e2e8f0"/>
                <circle cx="45" cy="45" r="2" fill="#cbd5e1"/>
                <path d="M22 65C26 50 38 42 50 40C44 48 42 58 38 65" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                <path d="M34 52C28 48 24 40 28 34C34 38 36 46 34 52Z" fill="#e2e8f0"/>
                <path d="M42 46C46 38 52 34 58 38C54 44 48 46 42 46Z" fill="#e2e8f0"/>
              </g>
              <g transform="translate(68, 8)">
                <rect x="0" y="8" width="92" height="60" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.04))"/>
                <rect x="0" y="8" width="92" height="60" rx="8" fill="#f8fafc"/>
                <circle cx="26" cy="35" r="12" fill="#334155"/>
                <circle cx="26" cy="30" r="5" fill="#ffffff"/>
                <path d="M17 43C17 38.5 21 36.5 26 36.5C31 36.5 35 38.5 35 43" fill="#ffffff"/>
                <rect x="46" y="24" width="34" height="4" rx="2" fill="#cbd5e1"/>
                <rect x="46" y="32" width="26" height="3.5" rx="1.75" fill="#e2e8f0"/>
                <rect x="46" y="39" width="30" height="3.5" rx="1.75" fill="#e2e8f0"/>
                <rect x="46" y="46" width="18" height="3.5" rx="1.75" fill="#e2e8f0"/>
              </g>
              <g transform="translate(162, 4)">
                <path d="M12 66H82C84.2 66 86 64.2 86 62V55C86 52.8 84.2 51 82 51H12C9.8 51 8 52.8 8 55V62C8 64.2 9.8 66 12 66Z" fill="#f59e0b"/>
                <path d="M14 55H84V62H14V55Z" fill="#fbbf24"/>
                <rect x="18" y="57" width="62" height="2" fill="#ffffff" opacity="0.6"/>
                <path d="M16 51H78C80.2 51 82 49.2 82 47V41C82 38.8 80.2 37 78 37H16C13.8 37 12 38.8 12 41V47C12 49.2 13.8 51 16 51Z" fill="#3b82f6"/>
                <rect x="18" y="40" width="58" height="8" fill="#60a5fa"/>
                <rect x="22" y="43" width="48" height="2" fill="#ffffff" opacity="0.6"/>
                <path d="M48 10L10 24L48 38L86 24L48 10Z" fill="#0f172a"/>
                <path d="M48 13L16 24L48 35L80 24L48 13Z" fill="#1e293b"/>
                <path d="M26 30V43C26 43 36 49 48 49C60 49 70 43 70 43V30L48 38L26 30Z" fill="#0f172a"/>
                <path d="M48 24C48 24 74 27 74 36V45" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
                <circle cx="74" cy="46" r="3.5" fill="#f59e0b"/>
              </g>
            </svg>
          </div>
        </section>

        <!-- ==================== 2. SELECT CRITERIA CARD ==================== -->
        <section class="sd-criteria-card">
          <div class="sd-criteria-header">
            <div class="sd-criteria-title">
              <svg class="sd-criteria-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 5h14M5 10h10M8 15h4" stroke-linecap="round"/>
              </svg>
              <span>Select Criteria</span>
            </div>
            <div class="sd-dots-icon" aria-hidden="true">
              <span class="sd-dot"></span><span class="sd-dot"></span><span class="sd-dot"></span>
              <span class="sd-dot"></span><span class="sd-dot"></span><span class="sd-dot"></span>
            </div>
          </div>

          <form id="criteriaForm" onsubmit="return false;">
            <div class="sd-criteria-grid">
              <div class="sd-form-group">
                <label for="criteriaClass">Class <span class="sd-req">*</span></label>
                <div class="sd-select-wrapper">
                  <select id="criteriaClass" class="sd-select">
                    <option value="">Select Class</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                  <svg class="sd-select-caret" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>

              <div class="sd-form-group">
                <label for="criteriaSection">Section</label>
                <div class="sd-select-wrapper">
                  <select id="criteriaSection" class="sd-select">
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                    <option value="E">Section E</option>
                  </select>
                  <svg class="sd-select-caret" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>

              <div class="sd-form-group">
                <label for="criteriaKeyword">Search By Keyword</label>
                <input type="text" id="criteriaKeyword" class="sd-input" placeholder="Search by Student Name, Roll Number, Enroll Number, National Id, Local Id etc.">
              </div>
            </div>

            <div class="sd-search-btn-wrap">
              <button type="button" id="btnSearch" class="sd-btn-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span>Search</span>
              </button>
            </div>
          </form>
        </section>

        <!-- ==================== 3. TABLE & VIEW CARD ==================== -->
        <section class="sd-table-card">
          <div class="sd-toolbar">
            <div class="sd-view-tabs">
              <button type="button" class="sd-tab active" id="tabListView" data-view="list">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M3 5h2M7 5h10M3 10h2M7 10h10M3 15h2M7 15h10" stroke-linecap="round"/>
                </svg>
                <span>List View</span>
              </button>
              <button type="button" class="sd-tab" id="tabDetailsView" data-view="details">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="3" y="3" width="5.5" height="5.5" rx="1.2"/>
                  <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.2"/>
                  <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.2"/>
                  <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.2"/>
                </svg>
                <span>Details View</span>
              </button>
            </div>

            <div class="sd-toolbar-right">
              <div class="sd-per-page-wrap">
                <select id="sdPerPage" class="sd-per-page-select">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50" selected>50</option>
                  <option value="100">100</option>
                </select>
                <svg class="sd-per-page-caret" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>

              <div class="sd-tool-btn-group">
                <button type="button" class="sd-tool-btn" id="btnCopy" title="Copy to clipboard">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
                <button type="button" class="sd-tool-btn excel-btn" id="btnExcel" title="Export to Excel">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="8" y1="13" x2="16" y2="17"></line>
                    <line x1="16" y1="13" x2="8" y2="17"></line>
                  </svg>
                </button>
                <button type="button" class="sd-tool-btn pdf-btn" id="btnPdf" title="Export to PDF">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                    <line x1="9" y1="11" x2="15" y2="11"></line>
                  </svg>
                </button>
                <button type="button" class="sd-tool-btn" id="btnPrint" title="Print Table">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                </button>
                <button type="button" class="sd-tool-btn" id="btnColumns" title="Column Visibility">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                    <line x1="15" y1="3" x2="15" y2="21"></line>
                  </svg>
                </button>
                <button type="button" class="sd-tool-btn" id="btnToggleFilter" title="Toggle Filters">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div id="listViewContainer" class="sd-table-wrap">
            <table class="sd-table">
              <thead>
                <tr>
                  <th class="sortable" data-col="admissionNo">Admission No <span class="sd-sort-icon">⇅</span></th>
                  <th class="sortable" data-col="studentName">Student Name <span class="sd-sort-icon">⇅</span></th>
                  <th class="sortable" data-col="rollNo">Roll No. <span class="sd-sort-icon">⇅</span></th>
                  <th class="sortable" data-col="class">Class <span class="sd-sort-icon">⇅</span></th>
                  <th class="sortable" data-col="fatherName">Father Name <span class="sd-sort-icon">⇅</span></th>
                  <th class="sortable" data-col="dob">Date Of Birth <span class="sd-sort-icon">⇅</span></th>
                  <th class="sortable" data-col="gender">Gender <span class="sd-sort-icon">⇅</span></th>
                  <th class="sortable" data-col="category">Category <span class="sd-sort-icon">⇅</span></th>
                  <th class="sortable" data-col="mobileNumber">Mobile Number <span class="sd-sort-icon">⇅</span></th>
                  <th style="text-align:center;">Action</th>
                </tr>
              </thead>
              <tbody id="studentTableBody">
              </tbody>
            </table>
          </div>

          <div id="detailsViewContainer" class="sd-details-grid" style="display:none;">
          </div>

          <div class="sd-pagination-bar">
            <span class="sd-page-info" id="paginationInfo">Showing 0 to 0 of 0 entries</span>
            <div class="sd-page-controls" id="paginationControls">
              <button class="sd-page-btn" id="btnPrevPage" disabled>‹</button>
              <button class="sd-page-btn active">1</button>
              <button class="sd-page-btn" id="btnNextPage" disabled>›</button>
            </div>
          </div>
        </section>
      </div>

      <!-- MODAL (if not already present in body) -->
      <div class="modal" id="studentModal" aria-hidden="true">
        <div class="modal-card">
          <div class="modal-head">
            <div>
              <span class="modal-icon">✦</span>
              <span>
                <strong id="modalTitle">Add Student Details</strong>
                <small id="modalSub">Fill in the student information below</small>
              </span>
            </div>
            <button class="modal-close" id="btnCloseModal" aria-label="Close">×</button>
          </div>
          <form id="studentForm">
            <div class="modal-body">
              <div class="sd-modal-grid">
                <div class="sd-modal-field">
                  <label>Admission No *</label>
                  <input type="text" id="mAdmissionNo" placeholder="e.g. ADM2026001" required>
                </div>
                <div class="sd-modal-field">
                  <label>Roll Number *</label>
                  <input type="text" id="mRollNo" placeholder="e.g. 101" required>
                </div>
                <div class="sd-modal-field full-span">
                  <label>Student Full Name *</label>
                  <input type="text" id="mStudentName" placeholder="Enter student full name" required>
                </div>
                <div class="sd-modal-field">
                  <label>Class *</label>
                  <select id="mClass" required>
                    <option value="">Select Class</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
                <div class="sd-modal-field">
                  <label>Section *</label>
                  <select id="mSection" required>
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
                <div class="sd-modal-field">
                  <label>Father Name</label>
                  <input type="text" id="mFatherName" placeholder="Enter father's name">
                </div>
                <div class="sd-modal-field">
                  <label>Date Of Birth</label>
                  <input type="date" id="mDob">
                </div>
                <div class="sd-modal-field">
                  <label>Gender</label>
                  <select id="mGender">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div class="sd-modal-field">
                  <label>Category</label>
                  <select id="mCategory">
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div class="sd-modal-field full-span">
                  <label>Mobile Number</label>
                  <input type="tel" id="mMobile" placeholder="e.g. 9876543210">
                </div>
              </div>
            </div>
            <div class="modal-foot">
              <button type="button" class="btn ghost" id="btnCancelModal">Cancel</button>
              <button type="submit" class="btn primary" id="btnSaveStudent">▣ &nbsp;Save Student&nbsp;→</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  /* ------------------------------------------------------------
     6. RENDER METHODS
  ------------------------------------------------------------ */
  function renderEmptyState() {
    return `
      <div class="sd-empty-state-wrap">
        <div class="sd-empty-graphic">
          <!-- Vector illustration matching Image 1: soft circular backdrop, folder, magnifying glass -->
          <svg width="170" height="120" viewBox="0 0 170 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="85" cy="60" r="54" fill="#eef4ff"/>
            <circle cx="28" cy="78" r="3" fill="#cbd5e1" opacity="0.5"/>
            <circle cx="140" cy="38" r="2.5" fill="#cbd5e1" opacity="0.5"/>
            <path d="M22 45C24 35 34 30 42 32" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
            <path d="M148 75C146 85 136 90 128 88" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
            <path d="M30 85C35 70 50 68 55 75C48 82 40 86 30 85Z" fill="#dbeafe" opacity="0.7"/>
            <path d="M140 85C135 70 120 68 115 75C122 82 130 86 140 85Z" fill="#dbeafe" opacity="0.7"/>
            <path d="M52 46C52 43.8 53.8 42 56 42H74L80 48H114C116.2 48 118 49.8 118 52V88C118 90.2 116.2 92 114 92H56C53.8 92 52 90.2 52 88V46Z" fill="#f59e0b"/>
            <rect x="62" y="32" width="46" height="42" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <line x1="68" y1="40" x2="88" y2="40" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
            <line x1="68" y1="46" x2="100" y2="46" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="68" y1="52" x2="96" y2="52" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="68" y1="58" x2="85" y2="58" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M50 56C50 53.8 51.8 52 54 52H116C118.2 52 120 53.8 120 56V88C120 90.2 118.2 92 116 92H54C51.8 92 50 90.2 50 88V56Z" fill="#fbbf24"/>
            <g transform="translate(86, 44)">
              <circle cx="16" cy="16" r="13" fill="#ffffff" fill-opacity="0.85" stroke="#1d4ed8" stroke-width="3.5"/>
              <path d="M11 11L21 21" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/>
              <path d="M26 26L38 38" stroke="#1d4ed8" stroke-width="4.5" stroke-linecap="round"/>
              <path d="M26 26L38 38" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>
            </g>
          </svg>
        </div>
        <h3 class="sd-empty-title">No data available in table</h3>
        <p class="sd-empty-subtitle">Try adjusting your search criteria or add a new student.</p>
        <a href="javascript:void(0)" class="sd-empty-action-link" id="emptyAddRecordLink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add new record or search with different criteria.</span>
        </a>
      </div>
    `;
  }

  function renderListView(records) {
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) return;

    if (!records.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="padding: 0; border: none;">
            ${renderEmptyState()}
          </td>
        </tr>
      `;
      bindEmptyStateActions();
      return;
    }

    const startIdx = (state.currentPage - 1) * state.perPage;
    const endIdx = startIdx + state.perPage;
    const pageRecords = records.slice(startIdx, endIdx);

    const rowsHtml = pageRecords.map(student => {
      const initial = (student.studentName || '?')[0].toUpperCase();
      const dobFormatted = student.dob || '—';

      return `
        <tr data-id="${student.id || student.admissionNo}">
          <td><strong>${student.admissionNo || '—'}</strong></td>
          <td>
            <div class="sd-student-cell">
              <div class="sd-avatar-circle">${initial}</div>
              <div>
                <strong style="color:#0f172a;">${student.studentName || '—'}</strong>
                <div style="font-size:11.5px;color:#64748b;">${student.email || ''}</div>
              </div>
            </div>
          </td>
          <td>${student.rollNo || '—'}</td>
          <td><span style="font-weight:600;color:#0b1a3d;">${student.class || '—'} ${student.section ? '(' + student.section + ')' : ''}</span></td>
          <td>${student.fatherName || '—'}</td>
          <td>${dobFormatted}</td>
          <td>${student.gender || '—'}</td>
          <td><span class="sd-category-badge">${student.category || 'General'}</span></td>
          <td>${student.mobileNumber || '—'}</td>
          <td style="text-align:center;">
            <div class="sd-row-actions" style="justify-content:center;">
              <button type="button" class="sd-act-btn edit" data-action="edit" data-id="${student.id || student.admissionNo}" title="Edit Student">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button type="button" class="sd-act-btn delete" data-action="delete" data-id="${student.id || student.admissionNo}" title="Delete Student">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rowsHtml;
    bindRowActions();
  }

  function renderDetailsView(records) {
    const grid = document.getElementById('detailsViewContainer');
    if (!grid) return;

    if (!records.length) {
      grid.innerHTML = renderEmptyState();
      bindEmptyStateActions();
      return;
    }

    const startIdx = (state.currentPage - 1) * state.perPage;
    const endIdx = startIdx + state.perPage;
    const pageRecords = records.slice(startIdx, endIdx);

    const cardsHtml = pageRecords.map(student => {
      const initial = (student.studentName || '?')[0].toUpperCase();
      return `
        <div class="sd-student-card" data-id="${student.id || student.admissionNo}">
          <div class="sd-card-top">
            <div class="sd-card-avatar">${initial}</div>
            <div class="sd-card-info">
              <h4>${student.studentName || '—'}</h4>
              <p>${student.class || '—'} • Section ${student.section || '—'}</p>
            </div>
          </div>
          <div class="sd-card-details">
            <div class="sd-card-detail-item">
              <span>Admission No</span>
              <span>${student.admissionNo || '—'}</span>
            </div>
            <div class="sd-card-detail-item">
              <span>Roll No.</span>
              <span>${student.rollNo || '—'}</span>
            </div>
            <div class="sd-card-detail-item">
              <span>Father's Name</span>
              <span>${student.fatherName || '—'}</span>
            </div>
            <div class="sd-card-detail-item">
              <span>Mobile No.</span>
              <span>${student.mobileNumber || '—'}</span>
            </div>
            <div class="sd-card-detail-item">
              <span>Gender</span>
              <span>${student.gender || '—'}</span>
            </div>
            <div class="sd-card-detail-item">
              <span>Category</span>
              <span>${student.category || 'General'}</span>
            </div>
          </div>
          <div class="sd-card-footer">
            <span style="font-size:11.5px;color:#64748b;">DOB: ${student.dob || '—'}</span>
            <div class="sd-row-actions">
              <button type="button" class="sd-act-btn edit" data-action="edit" data-id="${student.id || student.admissionNo}" title="Edit Student">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button type="button" class="sd-act-btn delete" data-action="delete" data-id="${student.id || student.admissionNo}" title="Delete Student">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.innerHTML = cardsHtml;
    bindRowActions();
  }

  function updatePagination(totalRecords) {
    const info = document.getElementById('paginationInfo');
    const controls = document.getElementById('paginationControls');
    if (!info || !controls) return;

    if (totalRecords === 0) {
      info.textContent = 'Showing 0 to 0 of 0 entries';
      controls.innerHTML = `
        <button class="sd-page-btn" id="btnPrevPage" disabled>‹</button>
        <button class="sd-page-btn active">1</button>
        <button class="sd-page-btn" id="btnNextPage" disabled>›</button>
      `;
      return;
    }

    const totalPages = Math.ceil(totalRecords / state.perPage) || 1;
    if (state.currentPage > totalPages) state.currentPage = totalPages;

    const start = (state.currentPage - 1) * state.perPage + 1;
    const end = Math.min(state.currentPage * state.perPage, totalRecords);

    info.textContent = `Showing ${start} to ${end} of ${totalRecords} entries`;

    let btnsHtml = `<button class="sd-page-btn" id="btnPrevPage" ${state.currentPage <= 1 ? 'disabled' : ''}>‹</button>`;
    for (let p = 1; p <= totalPages; p++) {
      btnsHtml += `<button class="sd-page-btn ${p === state.currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
    btnsHtml += `<button class="sd-page-btn" id="btnNextPage" ${state.currentPage >= totalPages ? 'disabled' : ''}>›</button>`;

    controls.innerHTML = btnsHtml;

    controls.querySelectorAll('[data-page]').forEach(btn => {
      btn.onclick = () => {
        state.currentPage = parseInt(btn.dataset.page, 10);
        renderCurrentView();
      };
    });

    const prevBtn = document.getElementById('btnPrevPage');
    if (prevBtn) {
      prevBtn.onclick = () => {
        if (state.currentPage > 1) {
          state.currentPage--;
          renderCurrentView();
        }
      };
    }

    const nextBtn = document.getElementById('btnNextPage');
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (state.currentPage < totalPages) {
          state.currentPage++;
          renderCurrentView();
        }
      };
    }
  }

  function renderCurrentView() {
    const records = getFilteredStudents();
    const listView = document.getElementById('listViewContainer');
    const detailsView = document.getElementById('detailsViewContainer');

    if (state.currentView === 'list') {
      if (listView) listView.style.display = 'block';
      if (detailsView) detailsView.style.display = 'none';
      renderListView(records);
    } else {
      if (listView) listView.style.display = 'none';
      if (detailsView) detailsView.style.display = 'grid';
      renderDetailsView(records);
    }

    updatePagination(records.length);
  }

  /* ------------------------------------------------------------
     7. ROW & MODAL ACTION HANDLERS
  ------------------------------------------------------------ */
  function bindEmptyStateActions() {
    const addLink = document.getElementById('emptyAddRecordLink');
    if (addLink) {
      addLink.onclick = () => openStudentModal('add');
    }
  }

  function bindRowActions() {
    document.querySelectorAll('.sd-act-btn[data-action]').forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;

        if (action === 'delete') {
          if (confirm('Are you sure you want to delete this student record?')) {
            deleteStudent(id);
            renderCurrentView();
          }
        } else if (action === 'edit') {
          openStudentModal('edit', id);
        }
      };
    });
  }

  function openStudentModal(mode = 'add', studentId = null) {
    state.editingStudentId = mode === 'edit' ? studentId : null;
    const modal = document.getElementById('studentModal');
    const form = document.getElementById('studentForm');
    const titleEl = document.getElementById('modalTitle');
    const subEl = document.getElementById('modalSub');
    const saveBtn = document.getElementById('btnSaveStudent');

    if (!modal || !form) return;

    if (mode === 'edit' && studentId) {
      const st = getStudentById(studentId);
      if (st) {
        titleEl.textContent = 'Edit Student Details';
        subEl.textContent = 'Update the student record below';
        saveBtn.innerHTML = '▣ &nbsp;Update Student&nbsp;→';

        document.getElementById('mAdmissionNo').value = st.admissionNo || '';
        document.getElementById('mRollNo').value = st.rollNo || '';
        document.getElementById('mStudentName').value = st.studentName || '';
        document.getElementById('mClass').value = st.class || '';
        document.getElementById('mSection').value = st.section || '';
        document.getElementById('mFatherName').value = st.fatherName || '';
        document.getElementById('mDob').value = st.dob || '';
        document.getElementById('mGender').value = st.gender || 'Male';
        document.getElementById('mCategory').value = st.category || 'General';
        document.getElementById('mMobile').value = st.mobileNumber || '';
      }
    } else {
      titleEl.textContent = 'Add Student Details';
      subEl.textContent = 'Fill in the student information below';
      saveBtn.innerHTML = '▣ &nbsp;Save Student&nbsp;→';
      form.reset();

      const all = getAllStudents();
      const nextNum = 'ADM2026' + String(all.length + 1).padStart(3, '0');
      document.getElementById('mAdmissionNo').value = nextNum;
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeStudentModal() {
    const modal = document.getElementById('studentModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    state.editingStudentId = null;
  }

  /* ------------------------------------------------------------
     8. EXPORT ACTIONS
  ------------------------------------------------------------ */
  function exportToCsv() {
    const records = getFilteredStudents();
    if (!records.length) {
      alert('No student records to export.');
      return;
    }

    const headers = ['Admission No', 'Student Name', 'Roll No.', 'Class', 'Section', 'Father Name', 'Date Of Birth', 'Gender', 'Category', 'Mobile Number', 'Email'];
    const rows = records.map(s => [
      s.admissionNo || '',
      `"${(s.studentName || '').replace(/"/g, '""')}"`,
      s.rollNo || '',
      s.class || '',
      s.section || '',
      `"${(s.fatherName || '').replace(/"/g, '""')}"`,
      s.dob || '',
      s.gender || '',
      s.category || '',
      s.mobileNumber || '',
      s.email || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Student_Details_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function copyToClipboard() {
    const records = getFilteredStudents();
    if (!records.length) {
      alert('No student records to copy.');
      return;
    }

    const text = records.map(s =>
      `${s.admissionNo}\t${s.studentName}\t${s.rollNo}\t${s.class}\t${s.section}\t${s.fatherName}\t${s.dob}\t${s.gender}\t${s.category}\t${s.mobileNumber}`
    ).join('\n');

    navigator.clipboard.writeText(text).then(() => {
      alert('Student records copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard.');
    });
  }

  function printStudentTable() {
    window.print();
  }

  /* ------------------------------------------------------------
     9. ATTACH EVENT LISTENERS
  ------------------------------------------------------------ */
  function initEventListeners() {
    // Search Button
    const btnSearch = document.getElementById('btnSearch');
    if (btnSearch) {
      btnSearch.onclick = () => {
        state.hasSearched = true;
        state.filterClass = document.getElementById('criteriaClass') ? document.getElementById('criteriaClass').value : '';
        state.filterSection = document.getElementById('criteriaSection') ? document.getElementById('criteriaSection').value : '';
        state.filterKeyword = document.getElementById('criteriaKeyword') ? document.getElementById('criteriaKeyword').value : '';
        state.currentPage = 1;
        renderCurrentView();
      };
    }

    // View Switcher Tabs
    const tabList = document.getElementById('tabListView');
    const tabDetails = document.getElementById('tabDetailsView');

    if (tabList && tabDetails) {
      tabList.onclick = () => {
        tabList.classList.add('active');
        tabDetails.classList.remove('active');
        state.currentView = 'list';
        renderCurrentView();
      };

      tabDetails.onclick = () => {
        tabDetails.classList.add('active');
        tabList.classList.remove('active');
        state.currentView = 'details';
        renderCurrentView();
      };
    }

    // Entries per page
    const perPageSelect = document.getElementById('sdPerPage');
    if (perPageSelect) {
      perPageSelect.onchange = () => {
        state.perPage = parseInt(perPageSelect.value, 10) || 50;
        state.currentPage = 1;
        renderCurrentView();
      };
    }

    // Table Header Sorting
    document.querySelectorAll('.sd-table th.sortable').forEach(th => {
      th.onclick = () => {
        const col = th.dataset.col;
        if (state.sortCol === col) {
          state.sortAsc = !state.sortAsc;
        } else {
          state.sortCol = col;
          state.sortAsc = true;
        }
        renderCurrentView();
      };
    });

    // Tool Icon Buttons
    const btnCopy = document.getElementById('btnCopy');
    if (btnCopy) btnCopy.onclick = copyToClipboard;

    const btnExcel = document.getElementById('btnExcel');
    if (btnExcel) btnExcel.onclick = exportToCsv;

    const btnPdf = document.getElementById('btnPdf');
    if (btnPdf) btnPdf.onclick = printStudentTable;

    const btnPrint = document.getElementById('btnPrint');
    if (btnPrint) btnPrint.onclick = printStudentTable;

    // Modal Events
    const btnCloseModal = document.getElementById('btnCloseModal');
    if (btnCloseModal) btnCloseModal.onclick = closeStudentModal;

    const btnCancelModal = document.getElementById('btnCancelModal');
    if (btnCancelModal) btnCancelModal.onclick = closeStudentModal;

    const modal = document.getElementById('studentModal');
    if (modal) {
      modal.onclick = e => {
        if (e.target === modal) closeStudentModal();
      };
    }

    // Modal Form Submit
    const form = document.getElementById('studentForm');
    if (form) {
      form.onsubmit = e => {
        e.preventDefault();
        const studentData = {
          admissionNo: document.getElementById('mAdmissionNo').value.trim(),
          rollNo: document.getElementById('mRollNo').value.trim(),
          studentName: document.getElementById('mStudentName').value.trim(),
          class: document.getElementById('mClass').value,
          section: document.getElementById('mSection').value,
          fatherName: document.getElementById('mFatherName').value.trim(),
          dob: document.getElementById('mDob').value,
          gender: document.getElementById('mGender').value,
          category: document.getElementById('mCategory').value,
          mobileNumber: document.getElementById('mMobile').value.trim()
        };

        saveStudent(studentData, state.editingStudentId);
        closeStudentModal();
        state.hasSearched = true;
        renderCurrentView();
      };
    }

    // Sidebar Mobile Toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
      menuToggle.onclick = () => {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        if (window.innerWidth <= 900) {
          sidebar.classList.toggle('open');
        } else {
          sidebar.classList.toggle('closed');
        }
      };
    }
  }

  /* ------------------------------------------------------------
     10. DUAL-MODE CONTAINER RENDERER
  ------------------------------------------------------------ */
  function renderInContainer(container) {
    if (!container) return;
    container.innerHTML = getTemplateHtml();
    initEventListeners();
    renderCurrentView();
  }

  function init() {
    // If standalone page has static structure
    if (document.getElementById('criteriaForm')) {
      initEventListeners();
      renderCurrentView();
    }
  }

  // Run on DOM ready if elements exist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export module globally
  window.StudentDetailsModule = {
    getAllStudents,
    saveStudent,
    deleteStudent,
    renderCurrentView,
    openStudentModal,
    renderInContainer,
    getTemplateHtml
  };
})();
