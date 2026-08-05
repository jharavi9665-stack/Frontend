/* ==========================================
   SCHOOL ERP - app.js
   Global JavaScript
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initSearch();
  initCalendar();
  initNotification();
});

/* ==========================================
   SIDEBAR ACTIVE MENU
========================================== */

function initSidebar() {
  const links = document.querySelectorAll(".sidebar-menu a");

  if (links.length === 0) return;

  links.forEach((link) => {
    link.addEventListener("click", function () {
      links.forEach((item) => {
        item.parentElement.classList.remove("active");
      });

      this.parentElement.classList.add("active");
    });
  });
}

/* ==========================================
   SEARCH BOX
========================================== */

function initSearch() {
  const search = document.querySelector(".search-box");

  if (!search) return;

  search.addEventListener("input", function () {
    console.log("Searching :", this.value);
  });
}

/* ==========================================
   CALENDAR BUTTON
========================================== */

function initCalendar() {
  const calendarBtn = document.querySelector(".calendar-btn");

  if (!calendarBtn) return;

  calendarBtn.addEventListener("click", () => {
    const today = new Date();

    alert(today.toDateString());
  });
}

/* ==========================================
   NOTIFICATION BUTTON
========================================== */

function initNotification() {
  const notificationBtn = document.querySelector(".notification-btn");

  if (!notificationBtn) return;

  notificationBtn.addEventListener("click", () => {
    alert("No new notifications");
  });
}
