// script/pelapor.js
// GANTI nilai WEB_APP_URL dengan URL Web App Apps Script setelah kamu deploy
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwDVdO4HSX9fecZToS7tmPJifr3Lzbwso7qJ_MkXqSerlav7iwcdqAD7XDqIoWnLl7LRQ/exec';


const form = document.getElementById('reportForm');
const statusMsg = document.getElementById('statusMsg');


form.addEventListener('submit', async (e)=>{
e.preventDefault();
statusMsg.textContent = 'Mengirim laporan...';


const nama = document.getElementById('nama').value.trim();
const ruangan = document.getElementById('ruangan').value.trim();
const keterangan = document.getElementById('keterangan').value.trim();
const fotoInput = document.getElementById('foto');


const data = new FormData();
data.append('action','submitReport');
data.append('nama', nama);
data.append('ruangan', ruangan);
data.append('keterangan', keterangan);
data.append('timestamp', new Date().toISOString());


if (fotoInput.files.length>0){
data.append('foto', fotoInput.files[0]);
}


try{
const res = await fetch(WEB_APP_URL, {method:'POST', body: data});
const j = await res.json();
if (j.success){
statusMsg.textContent = 'Laporan terkirim. Terima kasih!';
form.reset();
} else {
statusMsg.textContent = 'Gagal: ' + (j.message || 'server error');
}
} catch(err){
console.error(err);
statusMsg.textContent = 'Terjadi kesalahan koneksi.';
}
});