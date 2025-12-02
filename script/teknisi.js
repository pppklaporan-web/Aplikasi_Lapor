const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxcvVSxw6liSor0zj03SjbxBiMryQ9PE2vGYQOY786K6-GauDstEnsRUZ_zid5An3uZtA/exec";

const tableBody = document.querySelector("#tabelTeknisi tbody");
const modal = document.getElementById("modalEdit");
const editId = document.getElementById("editId");
const editStatus = document.getElementById("editStatus");
const editTeknisi = document.getElementById("editTeknisi");

/* -------------------- AMBIL DATA LAPORAN -------------------- */
async function loadData() {
  const res = await fetch(`${WEBAPP_URL}?action=getReports`);
  const json = await res.json();

  tableBody.innerHTML = "";

  json.data.forEach(row => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.id}</td>
      <td>${row.waktu}</td>
      <td>${row.nama}</td>
      <td>${row.ruangan}</td>
      <td>${row.keterangan}</td>
      <td>${row.foto ? `<img src="${row.foto}" width="80">` : "-"}</td>
      <td>${row.status}</td>
      <td>${row.teknisi}</td>
      <td><button class="edit-button" data-id="${row.id}" data-status="${row.status}" data-teknisi="${row.teknisi}">Edit</button></td>
    `;

    tableBody.appendChild(tr);
  });
}

loadData();

/* -------------------- BUKA MODAL EDIT -------------------- */
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("edit-button")) {
    const id = e.target.dataset.id;
    const status = e.target.dataset.status;
    const teknisi = e.target.dataset.teknisi;

    editId.value = id;
    editStatus.value = status;
    editTeknisi.value = teknisi;

    modal.style.display = "flex";
  }
});

/* -------------------- SIMPAN UPDATE -------------------- */
document.getElementById("btnSimpan").addEventListener("click", async () => {
  const res = await fetch(WEBAPP_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "update",
      id: editId.value,
      status: editStatus.value,
      teknisi: editTeknisi.value
    })
  });

  const json = await res.json();

  alert("Data berhasil diupdate!");
  modal.style.display = "none";
  loadData();
});

/* -------------------- TUTUP MODAL jika klik luar -------------------- */
window.addEventListener("click", function(e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
