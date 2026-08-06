/* ============================================================
   SCHOOL ERP – export-utils.js
   Reusable Table Export Utilities (Copy, Excel, CSV, PDF, Print, Column Visibility)
============================================================ */

const ExportUtils = {
  /**
   * Helper: Extract data matrix [headers, rows] from nearest <table>
   */
  getTableData(containerElement = document) {
    const table = containerElement.querySelector('table');
    if (!table) return null;

    // Extract visible headers (excluding 'Action')
    const headers = [];
    const headerCells = table.querySelectorAll('thead th');
    const headerIndices = [];

    headerCells.forEach((th, idx) => {
      const text = th.innerText.replace(/[↕\u2195]/g, '').trim();
      if (text.toLowerCase() !== 'action' && th.style.display !== 'none') {
        headers.push(text);
        headerIndices.push(idx);
      }
    });

    // Extract visible rows matching header indices
    const rows = [];
    const rowElements = table.querySelectorAll('tbody tr');

    rowElements.forEach(tr => {
      if (tr.children.length <= 1 && tr.innerText.includes('No ')) return;

      const rowData = [];
      const cells = tr.children;

      headerIndices.forEach(idx => {
        if (cells[idx]) {
          let val = cells[idx].innerText.replace(/\s+/g, ' ').trim();
          rowData.push(val);
        }
      });

      if (rowData.length > 0) {
        rows.push(rowData);
      }
    });

    const pageTitle = document.querySelector('.section-title-text')?.innerText || 'Export';
    return { headers, rows, title: pageTitle };
  },

  /**
   * 1. Copy Table Data to Clipboard
   */
  copyToClipboard(container = document) {
    const data = this.getTableData(container);
    if (!data || data.rows.length === 0) {
      alert('No data available to copy.');
      return;
    }

    const tsv = [
      data.headers.join('\t'),
      ...data.rows.map(r => r.join('\t'))
    ].join('\n');

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(tsv).then(() => {
        this.showToast('✓ Table data copied to clipboard!');
      }).catch(() => {
        this.fallbackCopy(tsv);
      });
    } else {
      this.fallbackCopy(tsv);
    }
  },

  fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      this.showToast('✓ Table data copied to clipboard!');
    } catch (e) {
      alert('Failed to copy text.');
    }
    document.body.removeChild(ta);
  },

  /**
   * 2. Export to Excel (.xls)
   */
  exportToExcel(container = document) {
    const data = this.getTableData(container);
    if (!data || data.rows.length === 0) {
      alert('No data available to export.');
      return;
    }

    const filename = `${data.title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xls`;

    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${data.title}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>
          th { background: #10285f; color: #ffffff; font-weight: bold; text-align: left; }
          td, th { border: 0.5pt solid #d1d5db; padding: 6px 10px; font-family: Arial, sans-serif; font-size: 11pt; }
        </style>
      </head>
      <body>
        <h3>${data.title} Report</h3>
        <table>
          <thead><tr>${data.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${data.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </body>
    </html>`;

    const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    this.downloadFile(blob, filename);
    this.showToast('✓ Excel file downloaded!');
  },

  /**
   * 3. Export to CSV (.csv)
   */
  exportToCSV(container = document) {
    const data = this.getTableData(container);
    if (!data || data.rows.length === 0) {
      alert('No data available to export.');
      return;
    }

    const filename = `${data.title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;

    const sanitize = val => `"${String(val).replace(/"/g, '""')}"`;
    const csvContent = [
      data.headers.map(sanitize).join(','),
      ...data.rows.map(row => row.map(sanitize).join(','))
    ].join('\r\n');

    const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8' });
    this.downloadFile(blob, filename);
    this.showToast('✓ CSV file downloaded!');
  },

  /**
   * 4. Export to PDF / Printable Report
   */
  exportToPDF(container = document) {
    const data = this.getTableData(container);
    if (!data || data.rows.length === 0) {
      alert('No data available to export.');
      return;
    }

    const printWin = window.open('', '_blank', 'width=900,height=650');
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${data.title} - PDF Report</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 24px; color: #1e293b; }
          .report-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10285f; padding-bottom: 12px; margin-bottom: 20px; }
          .report-title { font-size: 20px; font-weight: bold; color: #10285f; }
          .report-date { font-size: 12px; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background-color: #10285f; color: white; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 10px; text-align: left; }
          td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div>
            <div class="report-title">Devryon Demo School</div>
            <div style="font-size:14px; font-weight:600; color:#475569; margin-top:2px;">${data.title} Report</div>
          </div>
          <div class="report-date">Generated on: ${new Date().toLocaleDateString()}</div>
        </div>
        <table>
          <thead><tr>${data.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${data.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  },

  /**
   * 5. Print Document View
   */
  printTable() {
    window.print();
  },

  /**
   * 6. Toggle Column Visibility Dropdown
   */
  toggleColumnMenu(buttonElement, container = document) {
    const table = container.querySelector('table');
    if (!table) return;

    let existingMenu = document.getElementById('columnToggleDropdown');
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    const ths = table.querySelectorAll('thead th');
    const menu = document.createElement('div');
    menu.id = 'columnToggleDropdown';
    menu.className = 'column-toggle-popover';

    let itemsHtml = '<div class="column-popover-title">Toggle Columns</div>';
    ths.forEach((th, idx) => {
      const colName = th.innerText.replace(/[↕\u2195]/g, '').trim();
      const isVisible = th.style.display !== 'none';
      itemsHtml += `
        <label class="column-toggle-item">
          <input type="checkbox" data-col-idx="${idx}" ${isVisible ? 'checked' : ''}>
          <span>${colName}</span>
        </label>
      `;
    });

    menu.innerHTML = itemsHtml;
    buttonElement.style.position = 'relative';
    buttonElement.appendChild(menu);

    menu.querySelectorAll('input').forEach(chk => {
      chk.addEventListener('change', e => {
        const colIdx = parseInt(e.target.dataset.colIdx, 10);
        const show = e.target.checked;

        table.querySelectorAll('tr').forEach(tr => {
          if (tr.children[colIdx]) {
            tr.children[colIdx].style.display = show ? '' : 'none';
          }
        });
      });
    });

    const closeListener = e => {
      if (!menu.contains(e.target) && e.target !== buttonElement && !buttonElement.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeListener);
      }
    };
    setTimeout(() => document.addEventListener('click', closeListener), 10);
  },

  /**
   * Download helper blob
   */
  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Toast notification UI
   */
  showToast(message) {
    let toast = document.getElementById('exportToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'exportToast';
      toast.className = 'export-toast-message';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  },

  /**
   * Automatic Event Delegation Binder for Export Icon Buttons
   */
  bindExportButtons(container = document) {
    container.querySelectorAll('.export-icon-group .export').forEach(btn => {
      btn.onclick = e => {
        e.preventDefault();
        e.stopPropagation();

        const btnTitle = (btn.getAttribute('title') || btn.getAttribute('data-export') || '').toLowerCase();

        if (btnTitle.includes('copy')) {
          this.copyToClipboard(container);
        } else if (btnTitle.includes('excel')) {
          this.exportToExcel(container);
        } else if (btnTitle.includes('csv')) {
          this.exportToCSV(container);
        } else if (btnTitle.includes('pdf')) {
          this.exportToPDF(container);
        } else if (btnTitle.includes('print')) {
          this.printTable();
        } else if (btnTitle.includes('column')) {
          this.toggleColumnMenu(btn, container);
        }
      };
    });
  }
};

window.ExportUtils = ExportUtils;

document.addEventListener('DOMContentLoaded', () => {
  ExportUtils.bindExportButtons();
});
