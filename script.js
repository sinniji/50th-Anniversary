// GASのWebアプリURLをここに貼り付けてください
const gasApiUrl = 'https://script.google.com/macros/s/AKfycbyOGC00pgRKzD6G6CktIViHuo8_JgNVPexglgITrQMU1KGuVmXuf4xgOr2zjSqjmdsF/exec';

const participants = document.getElementById('participants');
for (let i = 0; i < 5; i++) {
  participants.innerHTML += `
    <div class="input-row person-row">
      <span class="required-star">${i === 0 ? '*' : ''}</span>
      <input type="text" name="name" class="name-field" data-index="${i}">
      <select name="hearingStatus" class="hearing-status-field">
        <option value=""></option>
        <option value="聴者">聴者</option>
        <option value="ろう者">ろう者</option>
      </select>
      <select name="affiliation" class="affiliation-field">
        <option value=""></option>
        <option value="会員">会員</option>
        <option value="ろう者（市内）">ろう者（市内）</option>
        <option value="ろう者（市外）">ろう者（市外）</option>
        <option value="サークル会員(以外)">サークル会員(以外)</option>
        <option value="一般">一般</option>
      </select>
      <input type="text" name="contact" class="contact-field" data-index="${i}" placeholder="半角入力">
    </div>
    <div class="error-message" id="error-message-${i}"></div>
  `;
}

const nameFields = document.querySelectorAll('.name-field');
const contactFields = document.querySelectorAll('.contact-field');
const personRows = document.querySelectorAll('.person-row');
const submitButton = document.getElementById('submitButton');
const totalTicketsSpan = document.getElementById('totalTickets');
const loadingSpinner = document.getElementById('loadingSpinner');

nameFields.forEach(field => field.addEventListener('input', calculateTotalTickets));

function calculateTotalTickets() {
  let count = 0;
  nameFields.forEach(field => {
    if (field.value.trim() !== '') count++;
  });
  totalTicketsSpan.textContent = count;
}

function isHalfWidth(str) {
  return !/[^\x00-\x7F]/.test(str);
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function toggleLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.style.display = isLoading ? 'none' : 'block';
  loadingSpinner.style.display = isLoading ? 'block' : 'none';
}

submitButton.addEventListener('click', async () => {
  clearErrors();

  let isValid = true;
  const entries = [];

  personRows.forEach((row, i) => {
    const name = row.querySelector('.name-field').value.trim();
    const hearingStatus = row.querySelector('.hearing-status-field').value;
    const affiliation = row.querySelector('.affiliation-field').value;
    const contact = row.querySelector('.contact-field').value.trim();
    const errorEl = document.getElementById(`error-message-${i}`);

    if (i === 0 && (!name || !contact)) {
      errorEl.textContent = !name ? '氏名は必ず入力してください。' : 'Mailは必ず入力してください。';
      errorEl.style.display = 'block';
      row.querySelector('.name-field').classList.add('error');
      row.querySelector('.contact-field').classList.add('error');
      isValid = false;
      return;
    }

    if (contact && !isHalfWidth(contact)) {
      errorEl.textContent = 'Mailは半角で入力してください。';
      errorEl.style.display = 'block';
      row.querySelector('.contact-field').classList.add('error');
      isValid = false;
      return;
    }

    if (name) {
      entries.push({ name, hearingStatus, affiliation, contact });
    }
  });

  if (!isValid) return;

  const formData = {
    entries,
    comments: document.getElementById('additionalComments').value,
    totalTickets: totalTicketsSpan.textContent
  };

  toggleLoading(true);

  try {
    const response = await fetch(gasApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      alert('送信が完了しました。');
      document.getElementById('anniversaryForm').reset();
      calculateTotalTickets();
    } else {
      alert('送信中にエラーが発生しました: ' + result.message);
    }
  } catch (error) {
    alert('送信中にエラーが発生しました: ' + error.message);
  } finally {
    toggleLoading(false);
  }
});
