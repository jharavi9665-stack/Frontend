document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');

  const eyeOpenSvg = `
    <svg viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;

  const eyeClosedSvg = `
    <svg viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  `;

  function showError(inputElement, errorElementId, message) {
    const formGroup = inputElement.closest('.form-group');
    const errorText = document.getElementById(errorElementId);

    if (formGroup) {
      formGroup.classList.add('error');
    }

    inputElement.setAttribute('aria-invalid', 'true');

    if (errorText) {
      errorText.textContent = message;
    }
  }

  function clearError(inputElement, errorElementId) {
    const formGroup = inputElement.closest('.form-group');
    const errorText = document.getElementById(errorElementId);

    if (formGroup) {
      formGroup.classList.remove('error');
    }

    inputElement.removeAttribute('aria-invalid');

    if (errorText) {
      errorText.textContent = '';
    }
  }

  function validateForm() {
    let isValid = true;
    let firstInvalidField = null;

    const markInvalid = (inputElement, errorElementId, message) => {
      if (!firstInvalidField) {
        firstInvalidField = inputElement;
      }

      showError(inputElement, errorElementId, message);
      isValid = false;
    };

    if (usernameInput.value.trim() === '') {
      markInvalid(usernameInput, 'usernameError', 'Username is required');
    } else {
      clearError(usernameInput, 'usernameError');
    }

    if (passwordInput.value === '') {
      markInvalid(passwordInput, 'passwordError', 'Password is required');
    } else {
      clearError(passwordInput, 'passwordError');
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return isValid;
  }

  togglePasswordBtn?.addEventListener('click', (event) => {
    event.preventDefault();

    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.innerHTML = isPassword ? eyeClosedSvg : eyeOpenSvg;
    togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });

  usernameInput?.addEventListener('input', () => clearError(usernameInput, 'usernameError'));
  passwordInput?.addEventListener('input', () => clearError(passwordInput, 'passwordError'));

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
      window.location.href = 'html/dashboard.html';
    }, 700);
  });
});
