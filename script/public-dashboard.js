// ================== dashboard.js ==================

// Contoh ID sheet / endpoint GAS
const GAS_URL = "https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec";

// Ambil laporan dari GAS dan tampilkan di tabel
async function loadReports() {
  try {
    const res = await fetch(`${GAS_URL}?action=getReports`);
    const data = await res.json();

    if (data.status === "success") {
      renderTable(data.data);
    } else {
      console.error("Error getReports:", data.message);
    }
  } catch (err) {
    console.error("Fetch error getReports:", err);
  }
}

// Render data ke tabel HTML (contoh sederhana)
function renderTable(reports) {
  const tbody = document.querySelector("#reportTable tbody");
  tbody.innerHTML = "";

  reports.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.waktu}</td>
      <td>${r.nama}</td>
      <td>${r.ruangan}</td>
      <td>${r.keterangan}</td>
      <td><a href="${r.foto}" target="_blank">Lihat Foto</a></td>
      <td>${r.status}</td>
      <td>${r.teknisi}</td>
      <td>
        <button onclick="updateStatus('${r.id}')">Update</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Update status laporan
async function updateStatus(id) {
  const status = prompt("Masukkan status baru (Misal: Selesai):");
  const teknisi = prompt("Masukkan nama teknisi:");

  if (!status || !teknisi) return alert("Status dan teknisi wajib diisi");

  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "update",
        id: id,
        status: status,
        teknisi: teknisi
      }),
      headers: { "Content-Type": "application/json" }
    });

    const result = await res.json();

    if (result.status === "success") {
      alert("✅ Update berhasil: " + result.message);
      // Reload tabel untuk melihat perubahan
      loadReports();
    } else {
      alert("❌ Update gagal: " + result.message);
      console.error("Update error:", result);
    }
  } catch (err) {
    alert("❌ Terjadi error saat update. Cek console.");
    console.error("Fetch update error:", err);
  }
}

// Panggil loadReports saat halaman siap
document.addEventListener("DOMContentLoaded", () => {
  loadReports();
});
