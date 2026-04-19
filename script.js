const form = document.querySelector('#apply-form');
const statusEl = document.querySelector('#form-status');
const retryButton = document.querySelector('#retry-submit');

let lastPayload = null;

const requiredFields = [
  { name: 'name', label: '이름' },
  { name: 'phone', label: '연락처' },
  { name: 'email', label: '이메일' }
];

function setFieldError(fieldName, message) {
  const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
  errorEl.textContent = message;
}

function clearErrors() {
  requiredFields.forEach((field) => setFieldError(field.name, ''));
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

  if (!payload.name) {
    setFieldError('name', '이름은 필수입니다.');
    valid = false;
  }
  if (!payload.phone) {
    setFieldError('phone', '연락처는 필수입니다.');
    valid = false;
  }
  if (!payload.email) {
    setFieldError('email', '이메일은 필수입니다.');
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

async function submit(payload) {
  try {
    await fakeSubmit(payload);
    statusEl.textContent = '신청이 완료되었습니다. 문자/이메일로 안내드리겠습니다.';
    retryButton.hidden = true;
  } catch {
    statusEl.textContent = '제출에 실패했습니다. 다시 시도해 주세요.';
    retryButton.hidden = false;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearErrors();
  statusEl.textContent = '';

  const payload = getPayload();
  if (!validate(payload)) return;

  lastPayload = payload;
  await submit(payload);
});

retryButton.addEventListener('click', async () => {
  clearErrors();
  statusEl.textContent = '';

  const payload = getPayload();
  if (!validate(payload)) return;

  lastPayload = payload;
  await submit(lastPayload);
});
