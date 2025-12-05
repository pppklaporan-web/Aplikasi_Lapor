const GAS_URL = "https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec";

document.getElementById('laporForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nama = document.getElementById('nama').value;
  const kendala = document.getElementById('kendala').value;
  const fotoFile = document.getElementById('fotoFile').files[0];

  let base64Image = null;

  if (fotoFile) {
    base64Image = await toBase64(fotoFile);
  }

  const data = {
    nama,
    kendala,
    image: base64Image
  };

  document.getElementById('status').innerText = "Mengirim...";

  fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify(data),
    muteHttpExceptions: true
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        document.getElementById('status').innerText = "Laporan berhasil dikirim!";
        document.getElementById('laporForm').reset();
      } else {
        document.getElementById('status').innerText = "Gagal: " + res.message;
      }
    })
    .catch(err => {
      document.getElementById('status').innerText = "Error: " + err;
    });
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}
