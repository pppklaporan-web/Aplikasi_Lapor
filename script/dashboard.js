// CONFIG: ganti sesuai Apps Script URL Anda jika perlu
const GAS_URL = 'https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec';
const TABLE = document.querySelector('#laporanTable tbody');
const modal = document.getElementById('modalForm');
const form = document.getElementById('laporForm');
const statusDiv = document.getElementById('status');
const filterStatus = document.getElementById('filterStatus');

document.getElementById('btnOpenForm').onclick = () => { modal.style.display = 'flex'; statusDiv.textContent = ''; };
document.getElementById('btnCloseModal').onclick = () => { modal.style.display = 'none'; };
document.getElementById('btnRefresh').onclick = loadData;
filterStatus.onchange = loadData;

window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

async function loadData() {
  TABLE.innerHTML = '<tr><td colspan="8">Memuat...</td></tr>';
  try {
    const res = await fetch(GAS_URL);
    const json = await res.json();
    if (json.status !== 'success') throw new Error('Gagal ambil data');
    const data = json.data || [];
    const filter = filterStatus.value;
    renderRows(data.filter(r => !filter || r.status === filter));
  } catch (err) {
    TABLE.innerHTML = `<tr><td colspan="8">Gagal memuat data: ${err.message}</td></tr>`;
  }
}

function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

function renderRows(rows){
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
      <td>${r.foto ? `<a href="${r.foto}" target="_blank"><img class="foto-thumb" src="${r.foto}" alt="foto" /></a>` : ''}</td>
      <td>${escapeHtml(r.status || 'Baru')}</td>
      <td>${escapeHtml(r.teknisi || '')}</td>
    `;
    TABLE.appendChild(tr);
  });
}

// handle submission (upload foto as base64 via Apps Script POST)
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusDiv.textContent = 'Mengirim...';
  const formData = new FormData(form);
  // if there is a file, convert to base64
  const file = document.getElementById('foto').files[0];
  if (file) {
    const b64 = await toBase64(file);
    formData.append('foto_base64', b64);
    formData.append('foto_name', file.name);
  }
  // action add
  formData.append('action', 'add');

  try {
    const res = await fetch(GAS_URL, { method: 'POST', body: formData });
    const json = await res.json();
    if (json.status === 'success') {
      statusDiv.textContent = 'Terkirim ✓';
      form.reset();
      setTimeout(()=>{ modal.style.display='none'; statusDiv.textContent=''; }, 900);
      loadData();
    } else {
      statusDiv.textContent = 'Gagal: '+(json.message || 'server error');
    }
  } catch (err) {
    statusDiv.textContent = 'Gagal koneksi: '+err.message;
  }
});

function toBase64(file){
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result.split(',')[1]);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// initial load
loadData();
