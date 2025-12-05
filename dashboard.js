const GAS_URL = "https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec";

async function loadLaporan() {
  try {
    const res = await fetch(GAS_URL);
    const data = await res.json();

    const tbody = document.querySelector("#laporanTable tbody");
    tbody.innerHTML = "";

    data.forEach(item => {
      let statusClass = "";
      if (item.status === "Menunggu") statusClass = "status-menunggu";
      if (item.status === "Diproses") statusClass = "status-proses";
      if (item.status === "Selesai") statusClass = "status-selesai";

      const row = `
        <tr>
          <td>${item.id}</td>
          <td>${item.waktu}</td>
          <td>${item.ruangan}</td>
          <td>${item.keterangan}</td>
          <td class="${statusClass}">${item.status}</td>
          <td>
            ${item.foto ? `<a href="${item.foto}" target="_blank">Lihat</a>` : "-"}
          </td>
        </tr>`;
      tbody.innerHTML += row;
    });

  } catch (err) {
    console.error("Gagal mengambil data:", err);
  }
}

loadLaporan();
setInterval(loadLaporan, 10000); // auto refresh tiap 10 detik
