const form = document.querySelector('#apply-form');
const statusEl = document.querySelector('#form-status');
const retryButton = document.querySelector('#retry-submit');

const requiredFields = ['name', 'phone', 'email'];
const fieldErrorMessage = {
  name: '이름은 필수입니다.',
  phone: '연락처는 필수입니다.',
  email: '이메일은 필수입니다.'
};

const formatErrorMessage = {
  phone: '연락처 형식을 확인해 주세요. (예: 010-1234-5678)',
  email: '이메일 형식을 확인해 주세요.'
};

const phonePattern = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let isSubmitting = false;

function setFieldError(fieldName, message) {
  const field = form.elements[fieldName];
  const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
  errorEl.textContent = message;
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function clearErrors() {
  requiredFields.forEach((fieldName) => setFieldError(fieldName, ''));
}

function getPayload() {
  return {
    name: form.elements.name.value.trim(),
    phone: form.elements.phone.value.trim(),
    email: form.elements.email.value.trim()
  };
}

function validate(payload) {
  let valid = true;

  requiredFields.forEach((fieldName) => {
    if (!payload[fieldName]) {
      setFieldError(fieldName, fieldErrorMessage[fieldName]);
      valid = false;
    }
  });

  if (payload.phone && !phonePattern.test(payload.phone)) {
    setFieldError('phone', formatErrorMessage.phone);
    valid = false;
  }

  if (payload.email && !emailPattern.test(payload.email)) {
    setFieldError('email', formatErrorMessage.email);
    valid = false;
  }

  return valid;
}

function fakeSubmit(payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (payload.email.toLowerCase() === 'fail@example.com') {
        reject(new Error('SUBMIT_FAILED'));
        return;
      }
      resolve({ ok: true });
    }, 250);
  });
}

function setSubmittingState(nextState) {
  isSubmitting = nextState;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = nextState;
  retryButton.disabled = nextState;
}

async function submit(payload) {
  if (isSubmitting) return;
  setSubmittingState(true);

  try {
    await fakeSubmit(payload);
    statusEl.textContent = '신청이 완료되었습니다. 문자/이메일로 안내드리겠습니다.';
    retryButton.hidden = true;
  } catch {
    statusEl.textContent = '제출에 실패했습니다. 다시 시도해 주세요.';
    retryButton.hidden = false;
  } finally {
    setSubmittingState(false);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearErrors();
  statusEl.textContent = '';

  const payload = getPayload();
  if (!validate(payload)) return;

  await submit(payload);
});

retryButton.addEventListener('click', async () => {
  clearErrors();
  statusEl.textContent = '';

  const payload = getPayload();
  if (!validate(payload)) return;

  await submit(payload);
});
