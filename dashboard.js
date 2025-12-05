const DATA_URL = "[https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec](https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec)"; // ganti dengan URL GAS-mu
const table = document.getElementById("tableLaporan");
const form = document.getElementById("laporForm");
const inputNama = document.getElementById("nama");
const inputRuangan = document.getElementById("ruangan");
const inputKeterangan = document.getElementById("kendala");
const inputFoto = document.getElementById("fotoFile");

let displayedData = {}; // simpan row yang sudah tampil

// --- Fungsi fetch laporan ---
async function fetchLaporan() {
try {
const response = await fetch(DATA_URL);
const data = await response.json();

```
// Tambahkan header jika tabel kosong
if (table.rows.length === 0) {
  const header = document.createElement("tr");
  header.innerHTML = "<th>ID</th><th>Waktu</th><th>Nama</th><th>Ruangan</th><th>Keterangan</th><th>Foto</th><th>Status</th><th>Petugas</th>";
  table.appendChild(header);
}

data.forEach(item => {
  if (displayedData[item.id]) {
    // Update row existing
    const row = displayedData[item.id];
    row.cells[1].textContent = item.waktu;
    row.cells[2].textContent = item.nama;
    row.cells[3].textContent = item.ruangan;
    row.cells[4].textContent = item.keterangan;
    row.cells[5].innerHTML = item.foto ? `<a href="${item.foto}" target="_blank">Lihat Foto</a>` : "";
    row.cells[6].textContent = item.status;
    row.cells[7].textContent = item.petugas;
  } else {
    // Tambah row baru
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
```

} catch (err) {
console.error("Error fetch laporan:", err);
}
}

// --- Fungsi submit laporan ---
async function submitLaporan(e) {
e.preventDefault();

const file = inputFoto.files[0];
let fotoBase64 = "";
if (file) {
fotoBase64 = await toBase64(file);
}

// Jika update, ambil ID dari input hidden (bisa ditambahkan di form)
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
if (result.status === "success") {
alert("Laporan berhasil dikirim!");
// Reset form
form.reset();
if (laporanIdInput) laporanIdInput.value = ""; // clear ID
// Fetch ulang untuk update tabel
fetchLaporan();
} else {
alert("Gagal kirim laporan: " + result.message);
}
} catch (err) {
console.error("Error submit laporan:", err);
alert("Terjadi error saat mengirim laporan");
}
}

// --- Helper: convert file ke Base64 ---
function toBase64(file) {
return new Promise((resolve, reject) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => resolve(reader.result);
reader.onerror = error => reject(error);
});
}

// Event listener form
form.addEventListener("submit", submitLaporan);

// Fetch pertama kali + auto-refresh tiap 10 detik
fetchLaporan();
setInterval(fetchLaporan, 10000);
