const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxcvVSxw6liSor0zj03SjbxBiMryQ9PE2vGYQOY786K6-GauDstEnsRUZ_zid5An3uZtA/exec";

const form = document.getElementById("reportForm");
const fotoInput = document.getElementById("foto");
const previewBox = document.getElementById("previewBox");
const previewImg = document.getElementById("previewImg");

const alertSuccess = document.getElementById("alertSuccess");
const alertError = document.getElementById("alertError");
const loading = document.getElementById("loading");
const btnSubmit = document.getElementById("btnSubmit");


// 📌 Preview Foto --------------------------------------------------------
fotoInput.addEventListener("change", () => {
  const file = fotoInput.files[0];
  if (!file) {
    previewBox.style.display = "none";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewBox.style.display = "block";
  };
  reader.readAsDataURL(file);
});


// 📌 Submit Form --------------------------------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  alertSuccess.style.display = "none";
  alertError.style.display = "none";

  // Validasi sederhana
  if (!nama.value.trim() || !ruangan.value.trim() || !keterangan.value.trim()){
    alertError.textContent = "Mohon lengkapi semua data!";
    alertError.style.display = "block";
    return;
  }

  // Disable tombol & tampilkan loading
  btnSubmit.disabled = true;
  loading.style.display = "block";

  const data = new FormData();
  data.append("action", "submitReport");
  data.append("nama", nama.value.trim());
  data.append("ruangan", ruangan.value.trim());
  data.append("keterangan", keterangan.value.trim());

  if (fotoInput.files.length > 0){
    data.append("foto", fotoInput.files[0]);
  }

  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      body: data
    });

    const j = await res.json();

    if (j.success){
      alertSuccess.style.display = "block";
      form.reset();
      previewBox.style.display = "none";
    } else {
      alertError.textContent = "Gagal: " + j.message;
      alertError.style.display = "block";
    }

  } catch (err){
    alertError.textContent = "Kesalahan koneksi.";
    alertError.style.display = "block";
  }

  btnSubmit.disabled = false;
  loading.style.display = "none";
});
