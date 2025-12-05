const GAS_URL = "https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec"; // Ganti dengan URL WebApp kamu

const form = document.getElementById("laporForm");
const fotoFile = document.getElementById("fotoFile");
const preview = document.getElementById("preview");
const statusMsg = document.getElementById("statusMsg");

let fotoBase64 = "";

// === Preview Foto ===
fotoFile.addEventListener("change", () => {
  const file = fotoFile.files[0];
  if (!file) {
    preview.style.display = "none";
    fotoBase64 = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    fotoBase64 = e.target.result;
    preview.src = fotoBase64;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
});

// === Kirim Laporan ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusMsg.innerText = "Mengirim laporan...";
  statusMsg.style.color = "black";

  const data = {
    nama: document.getElementById("nama").value,
    kendala: document.getElementById("kendala").value, // Keterangan
    lokasi: document.getElementById("lokasi").value,   // Ruangan
    fotoBase64: fotoBase64
  };


  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.status === "success") {
      statusMsg.innerText = "Laporan berhasil dikirim ✔️";
      statusMsg.style.color = "green";
      form.reset();
      preview.style.display = "none";
      fotoBase64 = "";
    } else {
      statusMsg.innerText = "Gagal: " + result.message;
      statusMsg.style.color = "red";
    }

  } catch (error) {
    statusMsg.innerText = "Error jaringan: " + error;
    statusMsg.style.color = "red";
  }
});

