const GAS_URL = "https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec";
const tableBody = document.querySelector("#laporanTable tbody");

// Ambil elemen summary & progress
const sumTotal = document.getElementById("sumTotal");
const sumDone = document.getElementById("sumDone");
const sumProcess = document.getElementById("sumProcess");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

async function fetchLaporanPublic() {
  try {
    const res = await fetch(GAS_URL);
    const json = await res.json();

    const data = json.laporan || []; // ← ambil array laporan dari object

    if (!Array.isArray(data) || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center">Tidak ada laporan</td></tr>';
      // reset summary & progress
      sumTotal.textContent = 0;
      sumDone.textContent = 0;
      sumProcess.textContent = 0;
      progressText.textContent = "Selesai 0 dari 0 laporan (0%)";
      progressBar.style.width = "0%";
      return;
    }

    // render tabel lama tanpa perubahan
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
        <td>${row.catatan || "-"}</td>
      </tr>
    `).join('');

    // ===== Update summary & progress =====
    const summary = json.summary || { total:0, selesai:0, proses:0, persen:0 };
    sumTotal.textContent = summary.total;
    sumDone.textContent = summary.selesai;
    sumProcess.textContent = summary.proses;
    progressText.textContent = `Selesai ${summary.selesai} dari ${summary.total} laporan (${summary.persen}%)`;
    progressBar.style.width = summary.persen + "%";

  } catch(err) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:red;">Error: ${err}</td></tr>`;
  }
}

// fetch & auto refresh
fetchLaporanPublic();
setInterval(fetchLaporanPublic, 5000);
