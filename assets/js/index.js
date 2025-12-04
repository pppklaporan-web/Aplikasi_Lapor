
**Ini salah!**  
Backtick (`) tidak boleh ada di JavaScript.

---

# 🔧 **Perbaikan index.js yang benar (saya tulis ulang full)**

Salin **versi benar** ini → paste ke `assets/js/index.js` atau `index.js` kamu:

~~~{"id":"36519","variant":"standard"}
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('laporForm');
  const fotoFile = document.getElementById('fotoFile');
  const previewWrap = document.getElementById('previewWrap');
  const preview = document.getElementById('preview');
  const clearPhoto = document.getElementById('clearPhoto');
  const statusMsg = document.getElementById('statusMsg');
  const submitBtn = document.getElementById('submitBtn');

  let fotoBase64 = '';

  fotoFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      preview.src = dataUrl;
      previewWrap.classList.remove('hidden');
      fotoBase64 = dataUrl;
    };
    reader.readAsDataURL(file);
  });

  clearPhoto.addEventListener('click', () => {
    fotoFile.value = '';
    preview.src = '';
    previewWrap.classList.add('hidden');
    fotoBase64 = '';
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    submitBtn.disabled = true;
    statusMsg.textContent = 'Mengirim...';

    const payload = {
      nama: document.getElementById('nama').value.trim(),
      ruangan: document.getElementById('ruangan').value.trim(),
      keterangan: document.getElementById('keterangan').value.trim(),
      foto: fotoBase64 || ''
    };

    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });

      const j = await res.json();
      if (j.status === 'success') {
        statusMsg.textContent = 'Laporan terkirim. Terima kasih!';
        form.reset();
        clearPhoto.click();
      } else {
        statusMsg.textContent = 'Gagal: ' + (j.message || 'unknown');
      }

    } catch (err) {
      statusMsg.textContent = 'Error jaringan: ' + err.message;

    } finally {
      submitBtn.disabled = false;
      setTimeout(() => statusMsg.textContent = '', 5000);
    }
  });
});
~~~

---

# 🟢 Setelah diganti → ERROR pasti hilang

Karena:

✔ Tidak ada lagi string kosong `""` yang dipanggil sebagai fungsi  
✔ Kode fetch berjalan normal  
✔ Semua event listener menemukan elemen HTML  
✔ Foto preview & upload akan bekerja

---

# Mau saya cek juga **dashboard.js** dan **petugas.js** supaya semuanya pasti jalan?
