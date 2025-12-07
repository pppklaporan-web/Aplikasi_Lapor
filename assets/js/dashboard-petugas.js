const GAS_URL = "https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec";
const tableBody = document.querySelector("#laporanTable tbody");

// === Fetch data dan render tabel ===
async function fetchLaporan() {
  try {
    const res = await fetch(GAS_URL);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center">Tidak ada laporan</td></tr>';
      return;
    }

    tableBody.innerHTML = data.map(row => `
      <tr>
        <td>${row.id}</td>
        <td>${new Date(row.waktu).toLocaleString()}</td>
        <td>${row.nama}</td>
        <td>${row.ruangan}</td>
        <td>${row.keterangan}</td>
        <td>${row.foto ? `<a href="${row.foto}" target="_blank"><img src="${row.foto}" alt="Foto"/></a>` : 'Tidak ada'}</td>

        <td>
          <select data-id="${row.id}" onchange="updateStatus('${row.id}', this.value)"
            style="color:${row.status==='Proses'?'red':row.status==='Selesai'?'green':'black'}">
            <option value="Menunggu" ${row.status==='Menunggu'?'selected':''}>Menunggu</option>
            <option value="Proses" ${row.status==='Proses'?'selected':''}>Proses</option>
            <option value="Selesai" ${row.status==='Selesai'?'selected':''}>Selesai</option>
          </select>
        </td>

        <td>
          <input type="text" data-id="${row.id}" value="${row.petugas || ''}"
            placeholder="Nama Petugas"
            onchange="updatePetugas('${row.id}', this.value)">
        </td>

        <td>${row.catatan || "-"}</td>

        <td>
          <button onclick="openEdit('${row.id}','${row.status}','${row.petugas || ''}','${row.catatan || ''}')"
            style="padding:6px 10px; background:#20a65e; color:white; border-radius:6px;">
            Edit
          </button>
        </td>

      </tr>
    `).join('');

  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:red;">Error: ${err}</td></tr>`;
  }
}

// === Update status ===
async function updateStatus(id, status) {
  const petugasInput = document.querySelector(`input[data-id="${id}"]`);
  const petugas = petugasInput ? petugasInput.value : "";

  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "update_status",
        id,
        status,
        petugas
      })
    });

    const result = await res.json();
    if (result.status !== "success") alert("Update gagal: " + result.message);
    fetchLaporan();

  } catch (err) {
    alert("Error jaringan: " + err);
  }
}

// === Update nama petugas ===
async function updatePetugas(id, petugas) {
  const statusSelect = document.querySelector(`select[data-id="${id}"]`);
  const status = statusSelect ? statusSelect.value : "Menunggu";

  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "update_status",
        id,
        status,
        petugas
      })
    });

    const result = await res.json();
    if (result.status !== "success") alert("Update gagal: " + result.message);

  } catch (err) {
    alert("Error jaringan: " + err);
  }
}

// === Refresh otomatis setiap 5 detik ===
fetchLaporan();
setInterval(fetchLaporan, 5000);

// ===== MODAL OPEN =====
function openEdit(id, status, petugas) {
  document.getElementById("editId").value = id;
  document.getElementById("editStatus").value = status;
  document.getElementById("editPetugas").value = petugas;

  document.getElementById("editModal").style.display = "block";
}

// ===== MODAL CLOSE =====
function closeEdit() {
  document.getElementById("editModal").style.display = "none";
}

// ===== UPDATE DATA DARI MODAL =====
async function updateLaporan() {
  const id = document.getElementById("editId").value;
  const status = document.getElementById("editStatus").value;
  const petugas = document.getElementById("editPetugas").value;

  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "update_status",
        id,
        status,
        petugas
      })
    });

    const result = await res.json();

    if (result.status === "success") {
      alert("Berhasil diperbarui!");
      closeEdit();
      fetchLaporan();
    } else {
      alert("Gagal update: " + result.message);
    }

  } catch (err) {
    alert("Gagal update, cek koneksi.");
  }
}

