// petugas.js — tampilkan daftar dan formulir update status (POST action=update)
document.addEventListener('DOMContentLoaded', () => {
const listWrap = document.getElementById('listWrap');

async function fetchReports() {
listWrap.innerHTML = 'Memuat...';
try {
const res = await fetch(`${GAS_URL}?action=getReports`, {cache:'no-store'});
const j = await res.json();
if (j.status === 'success' && Array.isArray(j.data)) {
renderList(j.data);
} else {
listWrap.innerHTML = '<p>Tidak ada data.</p>';
}
} catch (err) {
listWrap.innerHTML = `<p>Gagal: ${err.message}</p>`;
}
}

function renderList(items) {
if (!items.length) {
listWrap.innerHTML = '<p>Tidak ada laporan.</p>';
return;
}
listWrap.innerHTML = items.map(i => {
return `       <div class="card-report">         <h4>${escapeHtml(i.nama||'-')}</h4>         <p>${escapeHtml(i.keterangan||'-')}</p>         <div class="meta">ID: ${escapeHtml(i.id)} · ${escapeHtml(i.waktu)}</div>         <div style="margin-top:8px">           <label>Status             <select data-id="${escapeHtml(i.id)}" class="statusSel">               <option value="Masuk" ${i.status==='Masuk'?'selected':''}>Masuk</option>               <option value="Proses" ${i.status==='Proses'?'selected':''}>Proses</option>               <option value="Selesai" ${i.status==='Selesai'?'selected':''}>Selesai</option>             </select>           </label>           <label style="margin-top:8px">
            Petugas             <input type="text" data-id="${escapeHtml(i.id)}" class="petugasInput" placeholder="Nama petugas" value="${escapeHtml(i.petugas||'')}" />           </label>           <div style="margin-top:8px">             <button class="updateBtn small" data-id="${escapeHtml(i.id)}">Simpan</button>           </div>         </div>       </div>`;
}).join('');

```
// bind update buttons
Array.from(document.getElementsByClassName('updateBtn')).forEach(btn=>{
  btn.addEventListener('click', async () => {
    const id = btn.dataset.id;
    const sel = document.querySelector(`select[data-id="${id}"]`);
    const pet = document.querySelector(`input[data-id="${id}"]`);
    btn.disabled = true;
    btn.textContent = 'Menyimpan...';
    try {
      const payload = { action: 'update', id, status: sel.value, petugas: pet.value || '' };
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const j = await res.json();
      if (j.status === 'success') {
        btn.textContent = 'Tersimpan';
        setTimeout(()=>{ btn.textContent = 'Simpan'; },1500);
      } else {
        btn.textContent = 'Gagal';
        setTimeout(()=>{ btn.textContent = 'Simpan'; },2000);
      }
    } catch (err) {
      btn.textContent = 'Error';
      setTimeout(()=>{ btn.textContent = 'Simpan'; },2000);
    } finally {
      btn.disabled = false;
    }
  });
});
```

}

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, ch=>({'&':'&','<':'<','>':'>','"':'"',"'":'''}[ch])); }

fetchReports();
});
