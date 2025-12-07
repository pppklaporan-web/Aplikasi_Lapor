const GAS_URL = "https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec";
const tableBody = document.querySelector("#laporanTable tbody");

// === Fetch data dan render tabel ===
async function fetchLaporan() {
  try {
    const res = await fetch(GAS_URL);
    const json = await res.json();
    const data = json.laporan || [];

    // >>> tampilkan laporan terbaru di paling atas
    data.reverse();

    if (!Array.isArray(data) || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center">Tidak ada laporan</td></tr>';
      return;
    }

    tableBody.innerHTML = data.map(row => `
      <tr class="${
          row.status === 'Menunggu' ? 'row-menunggu'
        : row.status === 'Proses'   ? 'row-proses'
        : 'row-selesai'
      }">

        <td data-label="ID">${row.id}</td>

        <td data-label="Waktu">${new Date(row.timestamp).toLocaleString()}</td>

        <td data-label="Nama">${row.nama}</td>

        <td data-label="Ruangan">${row.ruangan}</td>

        <td data-label="Keterangan">${row.keterangan}</td>

        <td data-label="Foto">
          ${row.foto ? 
            `<a href="${row.foto}" target="_blank">
               <img src="${row.foto}" alt="Foto" style="max-width:60px; max-height:60px; border-radius:4px;"/>
             </a>` 
            : 'Tidak ada'}
        </td>

        <td data-label="Status">
          <select data-id="${row.id}" onchange="updateStatus('${row.id}', this.value)"
            style="color:${row.status==='Proses'?'red':row.status==='Selesai'?'green':'black'}">
            <option value="Menunggu" ${row.status==='Menunggu'?'selected':''}>Menunggu</option>
            <option value="Proses" ${row.status==='Proses'?'selected':''}>Proses</option>
            <option value="Selesai" ${row.status==='Selesai'?'selected':''}>Selesai</option>
          </select>
        </td>

        <td data-label="Petugas">
          <input type="text" data-id="${row.id}" value="${row.petugas || ''}"
            placeholder="Nama Petugas"
            onchange="updatePetugas('${row.id}', this.value)">
        </td>

        <td data-label="Catatan">${row.catatan || "-"}</td>

        <td data-label="Aksi">
          <button onclick="openEdit('${row.id}','${row.status}','${row.petugas || ''}','${row.catatan || ''}')"
            style="padding:6px 10px; background:#20a65e; color:white; border-radius:6px;">
            Edit
          </button>
        </td>
      </tr>
    `).join('');

  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Error: ${err}</td></tr>`;
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
function openEdit(id, status, petugas, catatan) {
  document.getElementById("editId").value = id;
  document.getElementById("editStatus").value = status;
  document.getElementById("editPetugas").value = petugas;
  document.getElementById("editCatatan").value = catatan || "";
  document.getElementById("editModal").style.display = "flex";
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
  const catatan = document.getElementById("editCatatan").value;

  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "update_status",
        id,
        status,
        petugas,
        catatan
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
