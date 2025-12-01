// script/dashboard.js
// GANTI nilai WEB_APP_URL dengan URL Web App Apps Script setelah kamu deploy
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwDVdO4HSX9fecZToS7tmPJifr3Lzbwso7qJ_MkXqSerlav7iwcdqAD7XDqIoWnLl7LRQ/exec';


const reportsList = document.getElementById('reportsList');
const tpl = document.getElementById('cardTpl');


async function loadReports(){
reportsList.innerHTML = '<div class="muted">Memuat laporan...</div>';
try{
const res = await fetch(WEB_APP_URL+'?action=getReports');
const j = await res.json();
if (!j.success){ reportsList.innerHTML = '<div class="muted">Tidak ada data.</div>'; return; }


const data = j.data || [];
reportsList.innerHTML = '';
data.reverse().forEach(row => {
const node = tpl.content.cloneNode(true);
node.querySelector('.report-name').textContent = row.nama || '—';
node.querySelector('.report-date').textContent = new Date(row.timestamp).toLocaleString();
node.querySelector('.report-room').textContent = row.ruangan || '';
node.querySelector('.report-desc').textContent = row.keterangan || '';
const fotoLink = node.querySelector('.foto-link');
if (row.fotoUrl){ fotoLink.href = row.fotoUrl; fotoLink.textContent = 'Lihat Foto'; } else { fotoLink.style.display = 'none'; }


const inputTeknisi = node.querySelector('.input-teknisi'); inputTeknisi.value = row.teknisi || '';
const selectStatus = node.querySelector('.select-status'); selectStatus.value = row.status || 'Proses';


const btn = node.querySelector('.btn-update');
btn.addEventListener('click', async ()=>{
btn.textContent = 'Menyimpan...'; btn.disabled = true;
const payload = {
action:'updateReport',
id: row.id,
teknisi: inputTeknisi.value || '',
status: selectStatus.value || 'Proses'
};
try{
const r = await fetch(WEB_APP_URL, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
const jr = await r.json();
if (jr.success){ btn.textContent='Tersimpan'; setTimeout(()=>{btn.textContent='Update'; btn.disabled=false},900); }
else { btn.textContent='Error'; btn.disabled=false; }
}catch(e){ console.error(e); btn.textContent='Error'; btn.disabled=false; }
});


reportsList.appendChild(node);
});


}catch(err){
console.error(err);
reportsList.innerHTML = '<div class="muted">Gagal memuat data.</div>';
}
}


window.addEventListener('load', loadReports);