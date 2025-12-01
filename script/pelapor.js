document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("laporForm");
  const statusEl = document.getElementById("status");

  // GANTI URL BERIKUT DENGAN URL APPS SCRIPT ANDA
  const API_URL = "https://script.google.com/macros/s/AKfycbxcvVSxw6liSor0zj03SjbxBiMryQ9PE2vGYQOY786K6-GauDstEnsRUZ_zid5An3uZtA/exec";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.innerHTML = "Mengirim laporan...";

    const nama = document.getElementById("nama").value;
    const ruangan = document.getElementById("ruangan").value;
    const keterangan = document.getElementById("keterangan").value;
    const fotoInput = document.getElementById("foto");

    let fotoBase64 = ""; // default

    // Jika ada foto → ubah ke base64
    if (fotoInput.files.length > 0) {
      fotoBase64 = await toBase64(fotoInput.files[0]);
    }

    const payload = {
      nama,
      ruangan,
      keterangan,
      foto: fotoBase64
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.status === "success") {
        statusEl.innerHTML = "Laporan berhasil dikirim ✔";
        form.reset();
      } else {
        statusEl.innerHTML = "Gagal: " + result.message;
      }

    } catch (err) {
      console.error(err);
      statusEl.innerHTML = "Terjadi kesalahan jaringan!";
    }
  });
});


function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}
