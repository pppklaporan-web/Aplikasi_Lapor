const DATA_URL = "https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec"; // ganti sesuai GAS
const table = document.getElementById("tableLaporan");
const form = document.getElementById("laporForm");
const inputNama = document.getElementById("nama");
const inputRuangan = document.getElementById("ruangan");
const inputKeterangan = document.getElementById("kendala");
const inputFoto = document.getElementById("fotoFile");

let displayedData = {}; // simpan row yang sudah tampil

async function fetchLaporan() {
  if(!table) return; // jika halaman tidak ada tabel
  try {
    const response = await fetch(DATA_URL);
    const data = await response.json();

    if (table.rows.length === 0) {
      const header = document.createElement("tr");
      header.innerHTML = "<th>ID</th><th>Waktu</th><th>Nama</th><th>Ruangan</th><th>Keterangan</th><th>Foto</th><th>Status</th><th>Petugas</th>";
      table.appendChild(header);
    }

    data.forEach(item => {
      if (displayedData[item.id]) {
        const row = displayedData[item.id];
        row.cells[1].textContent = item.waktu;
        row.cells[2].textContent = item.nama;
        row.cells[3].textContent = item.ruangan;
        row.cells[4].textContent = item.keterangan;
        row.cells[5].innerHTML = item.foto ? `<a href="${item.foto}" target="_blank">Lihat Foto</a>` : "";
        row.cells[6].textContent = item.status;
        row.cells[7].textContent = item.petugas;
      } else {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.waktu}</td>
          <td>${item.nama}</td>
          <td>${item.ruangan}</td>
          <td>${item.keterangan}</td>
          <td>${item.foto ? `<a href="${item.foto}" target="_blank">Lihat Foto</a>` : ""}</td>
          <td>${item.status}</td>
          <td>${item.petugas}</td>
        `;
        table.appendChild(row);
        displayedData[item.id] = row;
      }
    });

  } catch (err) {
    console.error("Error fetch laporan:", err);
  }
}

async function submitLaporan(e) {
  if(!form) return;
  e.preventDefault();
  const file = inputFoto.files[0];
  let fotoBase64 = "";
  if(file) fotoBase64 = await toBase64(file);

  const laporanIdInput = document.getElementById("laporanId");
  const id = laporanIdInput ? laporanIdInput.value : undefined;

  const payload = {
    id: id,
    nama: inputNama.value,
    lokasi: inputRuangan.value,
    kendala: inputKeterangan.value,
    fotoBase64: fotoBase64
  };

  try {
    const response = await fetch(DATA_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if(result.status === "success") {
      alert("Laporan berhasil dikirim!");
      form.reset();
      if(laporanIdInput) laporanIdInput.value = "";
      fetchLaporan();
    } else {
      alert("Gagal kirim laporan: " + result.message);
    }
  } catch(err) {
    console.error("Error submit laporan:", err);
    alert("Terjadi error saat mengirim laporan");
  }
}

function toBase64(file) {
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ()=>resolve(reader.result);
    reader.onerror = e=>reject(e);
  });
}

if(form) form.addEventListener("submit", submitLaporan);
fetchLaporan();
setInterval(fetchLaporan, 10000);
