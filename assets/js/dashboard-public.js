const GAS_URL = "https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec";
const tableBody = document.querySelector("#laporanTable tbody");

async function fetchLaporanPublic() {
  try {
    const res = await fetch(GAS_URL);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center">Tidak ada laporan</td></tr>';
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
        <td style="color:${row.status==='Proses'?'red':row.status==='Selesai'?'green':'black'}">${row.status}</td>
        <td>${row.petugas}</td>
        <td>${item.catatan || "-"}</td> <!-- 🔥 Tambahan -->
      </tr>
    `).join('');

  } catch(err) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:red;">Error: ${err}</td></tr>`;
  }
}

// Refresh otomatis setiap 5 detik
fetchLaporanPublic();
setInterval(fetchLaporanPublic, 5000);

