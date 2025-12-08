const GAS_URL = "https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec";

async function fetchLaporanPublic() {
  try {
    const res = await fetch(GAS_URL);
    const data = await res.json();

    const tableBody = document.querySelector("#laporanTable tbody");

    // >>> Tampilkan item terbaru di atas
    data.laporan.reverse();

    if (!Array.isArray(data.laporan) || data.laporan.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center">Tidak ada laporan</td></tr>';
      updateSummary(0,0,0);
      updateProgressBar(0);
      return;
    }

    tableBody.innerHTML = data.laporan.map(row => `
      <tr class="${
          row.status === 'Menunggu' ? 'row-menunggu'
        : row.status === 'Proses'   ? 'row-proses'
        : 'row-selesai'
      }">
        <td>${row.id}</td>
        <td>${new Date(row.timestamp).toLocaleString()}</td>
        <td>${row.nama}</td>
        <td>${row.ruangan}</td>
        <td>${row.keterangan}</td>
        <td>${row.foto ? `<a href="${row.foto}" target="_blank"><img src="${row.foto}" alt="Foto"/></a>`:'Tidak ada'}</td>
        <td style="color:${row.status==='Proses'?'#007bff':row.status==='Selesai'?'#28a745':'#FFA500'}">${row.status}</td>
        <td>${row.petugas || '-'}</td>
        <td>${row.catatan || '-'}</td>
      </tr>
    `).join('');

    const total = data.summary.total || 0;
    const selesai = data.summary.selesai || 0;
    const proses = data.summary.proses || 0;
    updateSummary(total, selesai, proses);

    const persen = data.summary.persen || 0;
    updateProgressBar(persen);
    updateRunningText(data.laporan);

  } catch(err) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:red;">Error: ${err}</td></tr>`;
    updateSummary(0,0,0);
    updateProgressBar(0);
  }
}

function updateSummary(total, selesai, proses){
  document.getElementById('sumTotal').textContent = total;
  document.getElementById('sumDone').textContent = selesai;
  document.getElementById('sumProcess').textContent = proses;
}

function updateProgressBar(persen){
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  progressBar.style.width = persen + '%';

  if(persen>=80) progressBar.style.backgroundColor='#28a745';
  else if(persen>=50) progressBar.style.backgroundColor='#007bff';
  else progressBar.style.backgroundColor='#FFA500';

  progressText.textContent = persen + '% selesai';
}

function updateRunningText(laporan) {
  const now = new Date();

  // Tanggal hari ini dalam format YYYY-MM-DD
  const today = now.toISOString().split("T")[0];

  // Filter laporan:
  // 1. Hanya laporan hari ini
  // 2. Status selain "Selesai"
  const todayReports = laporan.filter(r => {
    const tgl = new Date(r.timestamp).toISOString().split("T")[0];
    return tgl === today && r.status !== "Selesai";
  });

  let text = "";

  if (todayReports.length === 0) {
    text = "Tidak ada laporan baru hari ini (Menunggu / Proses)";
  } else {
    text = todayReports
      .map(r => {
        const time = new Date(r.timestamp).toLocaleTimeString();
        return `${time} → ${r.nama} (${r.ruangan}) melapor: ${r.keterangan}`;
      })
      .join("   |   ");
  }

  document.getElementById("runningText").textContent = text;
}


fetchLaporanPublic();
setInterval(fetchLaporanPublic, 5000);
