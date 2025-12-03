const GAS_URL = "https://script.google.com/macros/s/AKfycbyLiUdp9emngrQXkM3taZyr-aktjytU2sU059o7BEPSN-C293OaUkwWLU6gpdEkyL-8/exec";

const TBODY = document.querySelector("#lapTable tbody");

async function loadData() {
TBODY.innerHTML = `<tr><td colspan="6">Memuat...</td></tr>`;
const res = await fetch(GAS_URL);
const json = await res.json();
render(json.data || []);
}

function render(rows) {
TBODY.innerHTML = "";

rows.forEach(r => {
const tr = document.createElement("tr");

```
const st = (r.status || "").toLowerCase();
if (st === "baru" || st === "proses") {
  tr.style.background = "#ffe2e2";
  tr.style.borderLeft = "6px solid #ff3b3b";
}
if (st === "selesai") {
  tr.style.background = "#e1ffe1";
  tr.style.borderLeft = "6px solid #1aae1a";
}

tr.innerHTML = `
  <td>${r.id}</td>
  <td>${r.timestamp}</td>
  <td>${r.nama} (${r.ruangan})</td>
  <td>${r.keterangan}</td>
  <td>${r.status}</td>
  <td>
    <input class="tekInput" data-id="${r.id}" placeholder="Nama teknisi">
    <button onclick="update('${r.id}')">Selesai</button>
  </td>
`;

TBODY.appendChild(tr);
```

});
}

async function update(id) {
const input = document.querySelector(`.tekInput[data-id="${id}"]`);
if (!input.value.trim()) return alert("Isi nama teknisi!");

const fd = new FormData();
fd.append("action", "update");
fd.append("id", id);
fd.append("status", "Selesai");
fd.append("teknisi", input.value);

const res = await fetch(GAS_URL, { method: "POST", body: fd });
const json = await res.json();

if (json.status === "success") {
loadData();
} else {
alert("Gagal: " + json.message);
}
}

loadData();
