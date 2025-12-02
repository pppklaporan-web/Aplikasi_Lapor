// === dashboard.js (FINAL) ===
// Auto-refresh dashboard + correct status display from Google Apps Script

const API_URL = "https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec";

// Interval auto-refresh 5 detik
setInterval(loadData, 5000);

window.onload = () => {
  loadData();
};

async function loadData() {
  const container = document.getElementById("data-container");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (result.status !== "success") {
      container.innerHTML = "<p>Gagal memuat data...</p>";
      return;
    }

    renderTable(result.data);

  } catch (err) {
    container.innerHTML = `<p>Error: ${err}</p>`;
  }
}

function renderTable(data) {
  if (!Array.isArray(data) || data.length === 0) {
    document.getElementById("data-container").innerHTML = "<p>Tidak ada data.</p>";
    return;
  }

  let html = `<table>
      <thead>
        <tr>
          <th>Waktu</th>
          <th>Nama</th>
          <th>Ruangan</th>
          <th>Keterangan</th>
          <th>Foto</th>
          <th>Status</th>
          <th>Teknisi</th>
        </tr>
      </thead>
      <tbody>`;

  data.forEach(row => {
    const fotoLink = row.foto ? `<a href="${row.foto}" target="_blank">Lihat Foto</a>` : "-";

    html += `
      <tr>
        <td>${row.waktu || "-"}</td>
        <td>${row.nama || "-"}</td>
        <td>${row.ruangan || "-"}</td>
        <td>${row.keterangan || "-"}</td>
        <td>${fotoLink}</td>
        <td><span class="status-badge ${cleanStatus(row.status)}">${row.status}</span></td>
        <td>${row.teknisi || "-"}</td>
      </tr>`;
  });

  html += `</tbody></table>`;
  document.getElementById("data-container").innerHTML = html;
}

// Membersihkan teks status untuk dipakai sebagai class CSS
function cleanStatus(text) {
  if (!text) return "unknown";
  return text.toLowerCase().replace(/\s+/g, "-");
}
