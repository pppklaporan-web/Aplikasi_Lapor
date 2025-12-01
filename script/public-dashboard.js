const API_URL =
  "https://script.google.com/macros/s/AKfycbxcvVSxw6liSor0zj03SjbxBiMryQ9PE2vGYQOY786K6-GauDstEnsRUZ_zid5An3uZtA/exec?action=getReports";

async function loadPublicReports() {
  const container = document.getElementById("publicList");
  container.innerHTML = "<p>Memuat data...</p>";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!data || !data.reports || data.reports.length === 0) {
      container.innerHTML = "<p>Tidak ada laporan.</p>";
      return;
    }

    container.innerHTML = "";

    data.reports.forEach(rep => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${rep.nama}</h3>
        <div class="meta">
          <div>${rep.tanggal}</div>
          <div>Ruangan: ${rep.ruangan}</div>
          <div>Status: ${rep.status}</div>
        </div>
        <p>${rep.keterangan}</p>
        ${
          rep.fotoUrl
            ? `<a class="foto-link" href="${rep.fotoUrl}" target="_blank">Lihat Foto</a>`
            : ""
        }
      `;

      container.appendChild(div);
    });
  } catch (err) {
    container.innerHTML = "<p>Gagal memuat data (CORS atau server error).</p>";
    console.error(err);
  }
}

loadPublicReports();
