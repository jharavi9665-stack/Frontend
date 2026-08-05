/**
 * Devryon ERP - Sign Up Page Logic
 * Features: Password toggle, Vanilla JS form validation, Error handling
 */

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const termsCheckbox = document.getElementById('terms');
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

  function setupPasswordToggle(button, inputField) {
    if (!button || !inputField) return;

    button.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = inputField.type === 'password';
      inputField.type = isPassword ? 'text' : 'password';
      button.innerHTML = isPassword ? eyeClosedSvg : eyeOpenSvg;
      button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }

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

    const usernameValue = usernameInput.value.trim();
    if (usernameValue === '') {
      markInvalid(usernameInput, 'usernameError', 'Username is required');
    } else if (usernameValue.length < 3) {
      markInvalid(usernameInput, 'usernameError', 'Username must be at least 3 characters');
    } else {
      clearError(usernameInput, 'usernameError');
    }

    const passwordValue = passwordInput.value;
    if (passwordValue === '') {
      markInvalid(passwordInput, 'passwordError', 'Password is required');
    } else if (passwordValue.length < 8) {
      markInvalid(passwordInput, 'passwordError', 'Password must be at least 8 characters');
    } else {
      clearError(passwordInput, 'passwordError');
    }

    if (!termsCheckbox.checked) {
      markInvalid(termsCheckbox, 'termsError', 'You must agree to the Terms & Conditions');
    } else {
      clearError(termsCheckbox, 'termsError');
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return isValid;
  }

  setupPasswordToggle(togglePasswordBtn, passwordInput);

  usernameInput?.addEventListener('input', () => clearError(usernameInput, 'usernameError'));
  passwordInput?.addEventListener('input', () => clearError(passwordInput, 'passwordError'));
  termsCheckbox?.addEventListener('change', () => clearError(termsCheckbox, 'termsError'));

  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitBtn = signupForm.querySelector('.submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Creating Account... <span class="btn-arrow">&rarr;</span>`;
      }

      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1200);
    }
  });
});
