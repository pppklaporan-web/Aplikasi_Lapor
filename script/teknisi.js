const GAS_URL = 'https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec';
const TBODY = document.querySelector('#lapTable tbody');

async function loadData() {
  TBODY.innerHTML = '<tr><td colspan="6">Memuat...</td></tr>';
  try {
    const res = await fetch(GAS_URL);
    const json = await res.json();

    if (json.status !== 'success') throw new Error('Data gagal diambil');

    render(json.data || []);

  } catch (err) {
    TBODY.innerHTML = `<tr><td colspan="6">Error: ${err.message}</td></tr>`;
  }
}

function render(rows) {
  if (!rows.length) {
    TBODY.innerHTML = '<tr><td colspan="6">Tidak ada laporan</td></tr>';
    return;
  }

  TBODY.innerHTML = '';

  rows.forEach(r => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.timestamp}</td>
      <td>${r.nama} (${r.ruangan})</td>
      <td>${r.keterangan}</td>
      <td>${r.status || 'Baru'}</td>
      <td>
        <div class="form-inline">
          <input type="text" placeholder="Nama Teknisi" class="teknisiInput" data-id="${r.id}">
          <button class="btn" onclick="setSelesai('${r.id}')">Selesai</button>
        </div>
      </td>
    `;

    TBODY.appendChild(tr);
  });
}

async function setSelesai(id) {
  const input = document.querySelector(`.teknisiInput[data-id="${id}"]`);
  const teknisi = input.value.trim();

  if (!teknisi) return alert("Isi nama teknisi!");

  // Kirim hanya status 'Selesai'
  const body = new FormData();
  body.append("action", "update");
  body.append("id", id);
  body.append("status", "Selesai");
  body.append("teknisi", teknisi);

  try {
    const res = await fetch(GAS_URL, { method: "POST", body });
    const json = await res.json();

    if (json.status === "success") {
      alert("Update berhasil");
      loadData();
    } else {
      alert("Gagal: " + json.message);
    }

  } catch (err) {
    alert("Gagal koneksi: " + err.message);
  }
}

loadData();
