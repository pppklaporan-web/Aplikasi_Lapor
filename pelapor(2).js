// script/pelapor.js
// GANTI dengan URL Web App Apps Script
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxcvVSxw6liSor0zj03SjbxBiMryQ9PE2vGYQOY786K6-GauDstEnsRUZ_zid5An3uZtA/exec";

const form = document.getElementById("reportForm");
const statusMsg = document.getElementById("statusMsg");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusMsg.textContent = "Mengirim laporan...";

    const nama = document.getElementById("nama").value.trim();
    const ruangan = document.getElementById("ruangan").value.trim();
    const keterangan = document.getElementById("keterangan").value.trim();
    const foto = document.getElementById("foto").files[0];

    const data = new FormData();
    data.append("action", "submitReport");
    data.append("nama", nama);
    data.append("ruangan", ruangan);
    data.append("keterangan", keterangan);
    data.append("timestamp", new Date().toISOString());

    if (foto) {
        data.append("foto", foto, foto.name);
    }

    try {
        const res = await fetch(WEB_APP_URL, {
            method: "POST",
            body: data
        });

        const j = await res.json();
        console.log(j);

        if (j.success) {
            statusMsg.textContent = "Laporan berhasil dikirim!";
            form.reset();
        } else {
            statusMsg.textContent = "Gagal: " + j.message;
        }
    } catch (err) {
        statusMsg.textContent = "Terjadi kesalahan koneksi.";
        console.error(err);
    }
});
