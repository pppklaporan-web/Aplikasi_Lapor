const API_URL = "https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec";

let rawData = [];
let filteredData = [];
let currentPage = 1;
let rowsPerPage = 10;

let sortColumn = null;
let sortAsc = true;

// ----------------------------------------------------
// 1. LOAD DATA
// ----------------------------------------------------
async function loadData() {
  const loading = document.getElementById("loading");

  try {
    const res = await fetch(API_URL + "?action=getReports");
    const json = await res.json();

    if (json.status !== "success") {
      loading.innerText = "Gagal memuat data";
      return;
    }

    // === DATA FORMAT SUDAH SESUAI APPS SCRIPT (OBJECT) ===
    rawData = json.data.map(r => ({
      id: r.id,
      waktu: r.waktu,
      nama: r.nama,
      ruangan: r.ruangan,
      keterangan: r.keterangan,
      foto: r.foto,
      status: r.status,
      teknisi: r.teknisi
    }));

    // --- FILL FILTER RUANGAN ---
    const ruanganSet = new Set(rawData.map(r => r.ruangan).filter(Boolean));
    const select = document.getElementById("filterRuangan");
    select.innerHTML = `<option value="all">Semua Ruangan</option>`;
    ruanganSet.forEach(r => select.innerHTML += `<option value="${r}">${r}</option>`);

    applyFilters();

  } catch (err) {
    loading.innerText = "Error: " + err;
  }
}

// ----------------------------------------------------
// 2. FILTER & SEARCH
// ----------------------------------------------------
function applyFilters() {
  const filterVal = document.getElementById("filterRuangan").value;
  const searchVal = document.getElementById("searchInput").value.toLowerCase();

  filteredData = rawData.filter(r => {
    const matchFilter = filterVal === "all" || r.ruangan === filterVal;
    const matchSearch = Object.values(r).some(v =>
      (v + "").toLowerCase().includes(searchVal)
    );
    return matchFilter && matchSearch;
  });

  if (sortColumn) sortData();

  currentPage = 1;
  renderTable();
  renderPagination();
}

// ----------------------------------------------------
// 3. SORTING
// ----------------------------------------------------
function sortData() {
  filteredData.sort((a, b) => {
    let vA = (a[sortColumn] || "") + "";
    let vB = (b[sortColumn] || "") + "";
    return sortAsc ? vA.localeCompare(vB) : vB.localeCompare(vA);
  });
}

// ----------------------------------------------------
// 4. RENDER TABLE
// ----------------------------------------------------
function renderTable() {
  const table = document.getElementById("tabel");
  const tbody = table.querySelector("tbody");

  table.style.display = "table";
  tbody.innerHTML = "";

  if (filteredData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">Tidak ada data</td></tr>`;
    return;
  }

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = filteredData.slice(start, end);

  pageData.forEach(r => {
    let statusClass =
      r.status?.toLowerCase() === "selesai" ? "status-selesai" :
      r.status?.toLowerCase() === "tertunda" ? "status-tertunda" :
      "status-menunggu";

    tbody.innerHTML += `
      <tr>
        <td>${r.waktu}</td>
        <td>${r.nama}</td>
        <td>${r.ruangan}</td>
        <td>${r.keterangan}</td>

        <td>
          ${
            r.foto
              ? `<img src="${r.foto}" class="foto-thumb" onclick="showModal('${r.foto}')">`
              : "-"
          }
        </td>

        <td><span class="status ${statusClass}">${r.status}</span></td>
        <td>${r.teknisi || "-"}</td>
      </tr>
    `;
  });
}

// ----------------------------------------------------
// 5. PAGINATION
// ----------------------------------------------------
function renderPagination() {
  const box = document.getElementById("pagination");
  box.innerHTML = "";

  const total = Math.ceil(filteredData.length / rowsPerPage);
  if (total <= 1) return;

  for (let i = 1; i <= total; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn" + (i === currentPage ? " active" : "");
    btn.innerText = i;

    btn.onclick = () => {
      currentPage = i;
      renderTable();
      renderPagination();
    };

    box.appendChild(btn);
  }
}

// ----------------------------------------------------
// 6. SORT EVENT
// ----------------------------------------------------
document.querySelectorAll("th[data-column]").forEach(th => {
  th.addEventListener("click", () => {
    const col = th.getAttribute("data-column");
    sortAsc = sortColumn === col ? !sortAsc : true;
    sortColumn = col;
    sortData();
    renderTable();
    renderPagination();
  });
});

// ----------------------------------------------------
// 7. MODAL FOTO
// ----------------------------------------------------
function showModal(src) {
  const modal = document.getElementById("modalFoto");
  const img = document.getElementById("modalImg");

  img.src = src;
  modal.style.display = "flex";

  modal.onclick = () => modal.style.display = "none";
}

// ----------------------------------------------------
document.getElementById("filterRuangan").addEventListener("change", applyFilters);
document.getElementById("searchInput").addEventListener("input", applyFilters);

loadData();
