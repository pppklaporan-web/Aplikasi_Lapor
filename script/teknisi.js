const GAS_URL = 'https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec';
const TBODY = document.querySelector('#lapTable tbody');
const filterTek = document.getElementById('filterStatusTek');
filterTek.onchange = loadData;

async function loadData(){
  TBODY.innerHTML = '<tr><td colspan="6">Memuat...</td></tr>';
  try {
    const res = await fetch(GAS_URL);
    const json = await res.json();
    if (json.status !== 'success') throw new Error('Gagal ambil');
    let rows = json.data || [];
    const filt = filterTek.value;
    if (filt) rows = rows.filter(r=>r.status===filt);
    render(rows);
  } catch(err){
    TBODY.innerHTML = `<tr><td colspan="6">Gagal: ${err.message}</td></tr>`;
  }
}

function render(rows){
  if(!rows.length){ TBODY.innerHTML = '<tr><td colspan="6">Tidak ada laporan</td></tr>'; return; }
  TBODY.innerHTML = '';
  rows.forEach(r=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.timestamp}</td>
      <td>${r.nama} (${r.ruangan})</td>
      <td>${r.keterangan}</td>
      <td>${r.status || 'Baru'}</td>
      <td>
        <div class="form-inline">
          <input placeholder="Nama teknisi" data-id="${r.id}" class="techname" />
          <select data-id="${r.id}" class="statusSel">
            <option value="Baru">Baru</option>
            <option value="Proses">Proses</option>
            <option value="Selesai">Selesai</option>
          </select>
          <button class="btn" data-id="${r.id}" onclick="ambilKerja('${r.id}')">Ambil</button>
          <button class="btn" data-id="${r.id}" onclick="updateStatus('${r.id}')">Update</button>
        </div>
      </td>
    `;
    TBODY.appendChild(tr);
  });
}

// helper to find inputs
function getInputsById(id){
  const te = document.querySelector(`.techname[data-id="${id}"]`);
  const st = document.querySelector(`.statusSel[data-id="${id}"]`);
  return {te, st};
}

async function ambilKerja(id){
  const {te, st} = getInputsById(id);
  if(!te.value) return alert('Masukkan nama teknisi');
  st.value = 'Proses';
  await sendUpdate(id, st.value, te.value);
}

async function updateStatus(id){
  const {te, st} = getInputsById(id);
  if(!st.value) return alert('Pilih status');
  await sendUpdate(id, st.value, te.value || '');
}

async function sendUpdate(id, status, teknisi){
  try {
    const body = new FormData();
    body.append('action','update');
    body.append('id', id);
    body.append('status', status);
    body.append('teknisi', teknisi);
    const res = await fetch(GAS_URL, { method:'POST', body });
    const json = await res.json();
    if (json.status === 'success') {
      alert('Berhasil update');
      loadData();
      // optionally notify public dashboard by forcing reload or rely on clients to refresh
    } else {
      alert('Gagal: '+(json.message||'error'));
    }
  } catch (err) {
    alert('Gagal koneksi: '+err.message);
  }
}

// initial
loadData();
