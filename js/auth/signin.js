document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const { showError, clearError, setupPasswordToggle } = window.AuthUtils || {};

  function validateForm() {
    let isValid = true;
    let firstInvalidField = null;

    const markInvalid = (inputElement, errorElementId, message) => {
      if (!firstInvalidField) {
        firstInvalidField = inputElement;
      }

      showError?.(inputElement, errorElementId, message);
      isValid = false;
    };

    if (usernameInput.value.trim() === '') {
      markInvalid(usernameInput, 'usernameError', 'Username is required');
    } else {
      clearError?.(usernameInput, 'usernameError');
    }

    if (passwordInput.value === '') {
      markInvalid(passwordInput, 'passwordError', 'Password is required');
    } else {
      clearError?.(passwordInput, 'passwordError');
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return isValid;
  }

  setupPasswordToggle?.(togglePasswordBtn, passwordInput);

  usernameInput?.addEventListener('input', () => clearError?.(usernameInput, 'usernameError'));
  passwordInput?.addEventListener('input', () => clearError?.(passwordInput, 'passwordError'));

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitBtn = loginForm.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Signing In... <span class="btn-arrow">&rarr;</span>`;
    }

    setTimeout(() => {
      window.location.href = '../dashboard/index.html';
    }, 700);
  });
});
