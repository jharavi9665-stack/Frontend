const modal = document.getElementById("addModal");

const openBtn = document.getElementById("openAddModal");

const closeButtons = document.querySelectorAll(".close-btn");

if (openBtn) {
  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });
}

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modal.classList.remove("active");
  });
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});
