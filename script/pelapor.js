document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("laporForm");
  const statusEl = document.getElementById("status");

  // URL Apps Script Anda
  const API_URL = "https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.innerHTML = "Mengirim laporan...";

    const formData = new FormData();

    formData.append("nama", document.getElementById("nama").value);
    formData.append("ruangan", document.getElementById("ruangan").value);
    formData.append("keterangan", document.getElementById("keterangan").value);
    formData.append("action", "add");

    const fotoInput = document.getElementById("foto");

    if (fotoInput.files.length > 0) {
      const file = fotoInput.files[0];
      const base64 = await toBase64(file);

      formData.append("foto_base64", base64.split(",")[1]); // hanya isi base64
      formData.append("foto_name", file.name);
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData
      });

      const json = await res.json();

      if (json.status === "success") {
        statusEl.innerHTML = "Laporan berhasil dikirim ✔";
        form.reset();
      } else {
        statusEl.innerHTML = "Gagal: " + json.message;
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
