/* === GANTI DENGAN URL WEBAPP KAMU === */
const GAS_URL = "[https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec](https://script.google.com/macros/s/AKfycbwMnRtX47fiyahOf51qRBJeaj8JIif5IVvv5e7t1WSbE_uoDoFpVQlHtq6Q1wvUZAyMDA/exec)";

document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("laporForm");
const fotoFile = document.getElementById("fotoFile");
const previewWrap = document.getElementById("previewWrap");
const preview = document.getElementById("preview");
const clearPhoto = document.getElementById("clearPhoto");
const statusMsg = document.getElementById("statusMsg");
const submitBtn = document.getElementById("submitBtn");

let fotoBase64 = "";

// === PREVIEW FOTO ===
fotoFile.addEventListener("change", () => {
const file = fotoFile.files[0];
if (!file) return;

```
const reader = new FileReader();
reader.onload = () => {
  fotoBase64 = reader.result;
  preview.src = reader.result;
  previewWrap.classList.remove("hidden");
};
reader.readAsDataURL(file);
```

});

// === HAPUS FOTO ===
clearPhoto.addEventListener("click", () => {
fotoBase64 = "";
fotoFile.value = "";
preview.src = "";
previewWrap.classList.add("hidden");
});

// === SUBMIT FORM ===
form.addEventListener("submit", async (ev) => {
ev.preventDefault();

```
submitBtn.disabled = true;
statusMsg.textContent = "Mengirim...";

const fd = new FormData();
fd.append("nama", document.getElementById("nama").value.trim());
fd.append("ruangan", document.getElementById("ruangan").value.trim());
fd.append("keterangan", document.getElementById("keterangan").value.trim());
fd.append("foto", fotoBase64);

try {
  const res = await fetch(GAS_URL, {
    method: "POST",
    body: fd
  });

  const txt = await res.text();
  console.log("GAS response:", txt);

  if (txt.includes("OK")) {
    statusMsg.textContent = "Laporan berhasil terkirim!";
    form.reset();
    clearPhoto.click();
  } else {
    statusMsg.textContent = "Gagal: " + txt;
  }
} catch (err) {
  statusMsg.textContent = "Error jaringan: " + err.message;
}

submitBtn.disabled = false;
setTimeout(() => (statusMsg.textContent = ""), 3500);
```

});
});
