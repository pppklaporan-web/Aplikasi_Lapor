// ==========================
// CONFIG
// ==========================
const GAS_URL = 'https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec';

const TABLE = document.querySelector('#laporanTable tbody');
const modal = document.getElementById('modalForm');
const form = document.getElementById('laporForm');
const statusDiv = document.getElementById('status');
const filterStatus = document.getElementById('filterStatus');

// ==========================
// EVENT HANDLERS
// ==========================
document.getElementById('btnOpenForm').onclick = () => {
  modal.style.display = 'flex';
  statusDiv.textContent = '';
};

document.getElementById('btnCloseModal').onclick = () => {
  modal.style.display = 'none';
};

document.getElementById('btnRefresh').onclick = loadData;
filterStatus.onchange = loadData;

window.onclick = e => {
  if (e.target === modal) modal.style.display = 'none';
};

// ==========================
// LOAD DATA
// ==========================
async function loadData() {
  TABLE.innerHTML = '<tr><td colspan="8">Memuat...</td></tr>';

  try {
    const res = await fetch(GAS_URL);
    const json = await res.json();

    if (json.status !== 'success') throw new Error('Gagal mengambil data dari server');

    const filter = filterStatus.value;
    const rows = json.data || [];

    const filtered = filter ? rows.filter(r => r.status === filter) : rows;

    renderRows(filtered);

  } catch (err) {
    TABLE.innerHTML = `<tr><td colspan="8">Gagal memuat data: ${err.message}</td></tr>`;
  }
}

// ==========================
// HELPERS
// ==========================
function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, m => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[m]));
}

function renderFoto(url) {
  if (!url) return '';

  let fileId = '';
  try {
    fileId = url.split("id=")[1].split("&")[0];
  } catch (e) {
    return '';
  }

  const thumb = `https://drive.google.com/thumbnail?id=${fileId}`;
  const view = `https://drive.google.com/uc?export=view&id=${fileId}`;

  return `
    <a href="${view}" target="_blank">
      <img src="${thumb}" style="width:60px; border-radius:6px; cursor:pointer;" />
    </a>
  `;
}

// ==========================
// RENDER TABLE
// ==========================
function renderRows(rows) {
  if (!rows.length) {
    TABLE.innerHTML = '<tr><td colspan="8">Belum ada laporan</td></tr>';
    return;
  }

  TABLE.innerHTML = '';

  rows.forEach(r => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${escapeHtml(r.id)}</td>
      <td>${escapeHtml(r.timestamp)}</td>
      <td>${escapeHtml(r.nama)}</td>
      <td>${escapeHtml(r.ruangan)}</td>
      <td>${escapeHtml(r.keterangan)}</td>
      <td>${renderFoto(r.foto)}</td>
      <td>${escapeHtml(r.status || 'Baru')}</td>
      <td>${escapeHtml(r.teknisi || '')}</td>
    `;

    TABLE.appendChild(tr);
  });
}

// ==========================
// FORM SUBMIT (ADD LAPORAN)
// ==========================
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusDiv.textContent = 'Mengirim...';

  const formData = new FormData(form);

  // jika ada foto → ubah ke Base64
  const file = document.getElementById('foto').files[0];
  if (file) {
    const base64 = await toBase64(file);
    formData.append('foto_base64', base64);
    formData.append('foto_name', file.name);
  }

  formData.append('action', 'add');

  try {
    const res = await fetch(GAS_URL, { method: 'POST', body: formData });
    const json = await res.json();

    if (json.status === 'success') {
      statusDiv.textContent = 'Terkirim ✓';
      form.reset();

      setTimeout(() => {
        modal.style.display = 'none';
        statusDiv.textContent = '';
      }, 900);

      loadData();
    } else {
      statusDiv.textContent = 'Gagal: ' + (json.message || 'Server error');
    }
  } catch (err) {
    statusDiv.textContent = 'Gagal koneksi: ' + err.message;
  }
});

// Convert File → Base64 (untuk upload ke Apps Script)
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

// ==========================
// INITIAL LOAD
// ==========================
loadData();
