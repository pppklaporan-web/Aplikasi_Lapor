const GAS_URL = "https://script.google.com/macros/s/AKfycbyLiUdp9emngrQXkM3taZyr-aktjytU2sU059o7BEPSN-C293OaUkwWLU6gpdEkyL-8/exec";

const TABLE = document.querySelector("#laporanTable tbody");
const modal = document.getElementById("modalForm");
const form = document.getElementById("laporForm");
const statusDiv = document.getElementById("status");
const filterStatus = document.getElementById("filterStatus");

document.getElementById("btnOpenForm").onclick = () => modal.style.display = "flex";
document.getElementById("btnCloseModal").onclick = () => modal.style.display = "none";
document.getElementById("btnRefresh").onclick = loadData;
filterStatus.onchange = loadData;

async function loadData() {
TABLE.innerHTML = `<tr><td colspan="8">Memuat...</td></tr>`;

try {
const res = await fetch(GAS_URL);
const json = await res.json();
renderRows(json.data || []);

} catch (err) {
TABLE.innerHTML = `<tr><td colspan="8">Error: ${err.message}</td></tr>`;
}
}

function renderRows(rows) {
TABLE.innerHTML = "";

rows.forEach(r => {
const tr = document.createElement("tr");

```
const st = (r.status || "baru").toLowerCase();
if (st === "baru" || st === "proses") {
  tr.style.background = "#ffe2e2";
  tr.style.borderLeft = "6px solid #ff3b3b";
}
if (st === "selesai") {
  tr.style.background = "#e7ffe7";
  tr.style.borderLeft = "6px solid #18b618";
}

let foto = "-";
if (r.foto && r.foto.includes("id=")) {
  const idFoto = r.foto.split("id=")[1].split("&")[0];
  const thumb = `https://drive.google.com/thumbnail?id=${idFoto}`;
  const view = `https://drive.google.com/uc?export=view&id=${idFoto}`;
  foto = `<a href="${view}" target="_blank"><img src="${thumb}" style="width:50px;border-radius:6px"></a>`;
}

tr.innerHTML = `
  <td>${r.id || "-"}</td>
  <td>${r.timestamp || "-"}</td>
  <td>${r.nama || "-"}</td>
  <td>${r.ruangan || "-"}</td>
  <td>${r.keterangan || "-"}</td>
  <td>${foto}</td>
  <td>${r.status || "-"}</td>
  <td>${r.teknisi || "-"}</td>
`;

TABLE.appendChild(tr);
```

});
}

form.addEventListener("submit", async (e) => {
e.preventDefault();
statusDiv.innerHTML = "Mengirim...";

const data = new FormData(form);
data.append("action", "add");

const file = document.getElementById("foto").files[0];
if (file) {
const base64 = await toBase64(file);
data.append("foto_base64", base64);
data.append("foto_name", file.name);
}

const res = await fetch(GAS_URL, { method: "POST", body: data });
const json = await res.json();

if (json.status === "success") {
statusDiv.innerHTML = "Terkirim ✓";
form.reset();
modal.style.display = "none";
loadData();
} else {
statusDiv.innerHTML = "Gagal: " + json.message;
}
});

function toBase64(file) {
return new Promise((res, rej) => {
const r = new FileReader();
r.onload = () => res(r.result.split(",")[1]);
r.onerror = rej;
r.readAsDataURL(file);
});
}

loadData();
