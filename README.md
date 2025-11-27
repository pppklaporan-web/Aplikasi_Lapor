# Aplikasi Lapor Kerusakan Kantor

**Fitur:**
- Form laporan dengan foto
- Panel teknisi (update status & pilih teknisi)
- Dashboard publik
- PWA (bisa install di HP)
- Upload foto ke Google Drive

**Setup:**
1. Deploy Code.gs di Google Apps Script.
2. Set SHEET_ID, FOLDER_ID, dan publish Web App.
3. Ganti `GAS_URL` di lapor.html dengan Web App URL.
4. Upload folder ini ke GitHub Pages jika ingin hosting frontend.

**Folder Struktur:**
- index.html
- lapor.html
- teknisi.html
- dashboard.html
- style.css
- manifest.json
- service-worker.js
- icon-192.png
- icon-512.png
