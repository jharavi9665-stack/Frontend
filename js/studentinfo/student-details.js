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
     5. RENDER METHODS
  ------------------------------------------------------------ */
  function renderEmptyState() {
    return `
      <div class="sd-empty-state-wrap">
        <div class="sd-empty-graphic">
          <!-- Vector illustration matching Image 1: soft circular backdrop, folder, magnifying glass -->
          <svg width="170" height="120" viewBox="0 0 170 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Backdrop soft circle and dots -->
            <circle cx="85" cy="60" r="54" fill="#eef4ff"/>
            <circle cx="28" cy="78" r="3" fill="#cbd5e1" opacity="0.5"/>
            <circle cx="140" cy="38" r="2.5" fill="#cbd5e1" opacity="0.5"/>
            <path d="M22 45C24 35 34 30 42 32" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
            <path d="M148 75C146 85 136 90 128 88" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>

            <!-- Soft decorative foliage/branch -->
            <path d="M30 85C35 70 50 68 55 75C48 82 40 86 30 85Z" fill="#dbeafe" opacity="0.7"/>
            <path d="M140 85C135 70 120 68 115 75C122 82 130 86 140 85Z" fill="#dbeafe" opacity="0.7"/>

            <!-- Yellow Folder -->
            <path d="M52 46C52 43.8 53.8 42 56 42H74L80 48H114C116.2 48 118 49.8 118 52V88C118 90.2 116.2 92 114 92H56C53.8 92 52 90.2 52 88V46Z" fill="#f59e0b"/>
            
            <!-- Document inside folder -->
            <rect x="62" y="32" width="46" height="42" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <line x1="68" y1="40" x2="88" y2="40" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
            <line x1="68" y1="46" x2="100" y2="46" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="68" y1="52" x2="96" y2="52" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="68" y1="58" x2="85" y2="58" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>

            <!-- Folder Front Flap -->
            <path d="M50 56C50 53.8 51.8 52 54 52H116C118.2 52 120 53.8 120 56V88C120 90.2 118.2 92 116 92H54C51.8 92 50 90.2 50 88V56Z" fill="#fbbf24"/>

            <!-- Magnifying Glass with Blue Rim -->
            <g transform="translate(86, 44)">
              <circle cx="16" cy="16" r="13" fill="#ffffff" fill-opacity="0.85" stroke="#1d4ed8" stroke-width="3.5"/>
              <path d="M11 11L21 21" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/>
              <!-- Handle -->
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

    // Calculate pagination slice
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

    // Bind page click events
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
     6. ROW & MODAL ACTION HANDLERS
  ------------------------------------------------------------ */
  function bindEmptyStateActions() {
    const addLink = document.getElementById('emptyAddRecordLink');
    if (addLink) {
      addLink.onclick = () => openStudentModal('add');
    }
  }

  function bindRowActions() {
    document.querySelectorAll('[data-action]').forEach(btn => {
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

      // Suggest next admission number
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
     7. EXPORT ACTIONS
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
     8. ATTACH EVENT LISTENERS & BOOTSTRAP
  ------------------------------------------------------------ */
  function initEventListeners() {
    // Search Button
    const btnSearch = document.getElementById('btnSearch');
    if (btnSearch) {
      btnSearch.onclick = () => {
        state.hasSearched = true;
        state.filterClass = document.getElementById('criteriaClass').value;
        state.filterSection = document.getElementById('criteriaSection').value;
        state.filterKeyword = document.getElementById('criteriaKeyword').value;
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
        state.hasSearched = true; // Show results after adding/editing
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

  // App Init
  function init() {
    initEventListeners();
    renderCurrentView();
  }

  // Run on DOM ready
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
    openStudentModal
  };
})();
