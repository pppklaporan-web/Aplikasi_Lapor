const GAS_URL = "[https://script.google.com/macros/s/AKfycbxYCbIQWF1cMCXEHXg8iEREhbMhqZXiPj58Vtb-neJjDrCAmk4F4jkOYhtGR87TGy7ubw/exec](https://script.google.com/macros/s/AKfycbxYCbIQWF1cMCXEHXg8iEREhbMhqZXiPj58Vtb-neJjDrCAmk4F4jkOYhtGR87TGy7ubw/exec)";

document.addEventListener('DOMContentLoaded', () => {
const listWrap = document.getElementById('listWrap');
const loading = document.getElementById('loading');
const refreshBtn = document.getElementById('refreshBtn');
const search = document.getElementById('search');

async function fetchReports() {
loading.style.display = 'block';
listWrap.innerHTML = '';

```
try {
  const res = await fetch(`${GAS_URL}?action=getReports`, { cache: 'no-store' });
  const j = await res.json();

  if (j.status === 'success' && Array.isArray(j.data)) {
    renderList(j.data);
  } else {
    listWrap.innerHTML = '<p>Tidak ada data.</p>';
  }
} catch (err) {
  listWrap.innerHTML = `<p>Gagal mengambil data: ${err.message}</p>`;
} finally {
  loading.style.display = 'none';
}
```

}

function renderList(items) {
if (!items.length) {
listWrap.innerHTML = '<p>Tidak ada laporan.</p>';
return;
}

```
const q = (search.value || '').toLowerCase();

const filtered = items.filter(i =>
  [i.nama, i.ruangan, i.status, i.keterangan].join(' ').toLowerCase().includes(q)
);

if (!filtered.length) {
  listWrap.innerHTML = '<p>Tidak ada hasil pencarian.</p>';
  return;
}

listWrap.innerHTML = filtered.map(i => {
  const img = i.foto
    ? `<a href="${i.foto}" target="_blank"><img src="${i.foto}" style="max-width:100%;border-radius:6px;margin-top:8px"></a>`
    : '';

  const badgeClass = i.status === 'Selesai'
    ? 'selesai'
    : i.status === 'Proses'
    ? 'proses'
    : 'masuk';

  return `
    <div class="card-report">
      <h4>${escapeHtml(i.nama || '-')}</h4>
      <p>${escapeHtml(i.keterangan || '-')}</p>
      ${img}
      <div class="meta">
        <span class="badge ${badgeClass}">${escapeHtml(i.status || 'Masuk')}</span>
        <div style="margin-top:6px;font-size:12px;color:var(--muted)">
          ${escapeHtml(i.ruangan || '')} · ${escapeHtml(i.waktu || '')}
        </div>
      </div>
    </div>
  `;
}).join('');
```

}

function escapeHtml(s) {
return String(s || '').replace(/[&<>"']/g, m => ({
'&': '&',
'<': '<',
'>': '>',
'"': '"',
"'": '''
}[m]));
}

refreshBtn.addEventListener('click', fetchReports);
search.addEventListener('input', fetchReports);

fetchReports();
});
