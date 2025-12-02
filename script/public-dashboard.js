/* ============================================================
   PUBLIC DASHBOARD – FINAL FIX
   ============================================================ */

const API_URL =
  "https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec";

let rawData = [];
let filteredData = [];

let currentPage = 1;
const rowsPerPage = 10;

let sortColumn = null;
let sortAsc = true;

/* ============================================================
   LOAD DATA
   ============================================================ */
async function loadData() {
  const loading = document.getElementById("loading");

  try {
    loading.style.display = "block";

    const res = await fetch(API_URL + "?action=getReports");
    const json = await res.json();

    if (json.status !== "success") {
      loading.innerText = "Gagal memuat data...";
      return;
    }

    rawData = json.data;
    fillFilter();
    applyFilters();

  } catch (err) {
    loading.innerText = "Error mengambil data";
  }
}

/* ============================================================
   FILL DROPDOWN RUANGAN
   ============================================================ */
function fillFilter() {
  const select = document.getElementById("filterRuangan");
  const ruanganSet = new Set(rawData.map(r => r.ruangan).filter(r => r));

  select.innerHTML = `<option value="all">Semua Ruangan</option>`;
  ruanganSet.forEach(r => {
    select.innerHTML += `<option value="${r}">${r}</option>`;
  });
}

/* ============================================================
   APPLY FILTER + SEARCH
   ============================================================ */
function applyFilters() {
  const filterRuangan = document.getElementById("filterRuangan").value;
  const search = document.getElementById("searchInput").value.toLowerCase();

  filteredData = rawData.filter(r => {
    const byRoom = filterRuangan === "all" || r.ruangan === filterRuangan;

    const bySearch = Object.values(r)
      .join(" ")
      .toLowerCase()
      .includes(search);

    return byRoom && bySearch;
  });

  if (sortColumn) {
    sortData();
  }

  currentPage = 1;
  renderTable();
  renderPagination();
}

/* ============================================================
   SORTING
   ============================================================ */
function sortData() {
  filteredData.sort((a, b) => {
    let A = (a[sortColumn] || "").toString().toLowerCase();
    let B = (b[sortColumn] || "").toString().toLowerCase();

    return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
  });
}

/* ============================================================
   RENDER TABLE
   ============================================================ */
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
    const statusClass =
      r.status?.toLowerCase() === "selesai"
        ? "status-selesai"
        : r.status?.toLowerCase() === "proses"
        ? "status-proses"
        : r.status?.toLowerCase() === "ditolak"
        ? "status-ditolak"
        : "status-menunggu";

    const row = `
      <tr>
        <td>${r.waktu}</td>
        <td>${r.nama}</td>
        <td>${r.ruangan}</td>
        <td>${r.keterangan}</td>

        <td>
          ${
            r.foto
              ? `<img src="${r.foto}" class="foto-thumb"
                    onclick="showModal('${r.foto}')">`
              : "-"
          }
        </td>

        <td><span class="status ${statusClass}">${r.status}</span></td>
        <td>${r.teknisi || "-"}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  document.getElementById("loading").style.display = "none";
}

/* ============================================================
   PAGINATION
   ============================================================ */
function renderPagination() {
  const box = document.getElementById("pagination");
  box.innerHTML = "";

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
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

/* ============================================================
   EVENT SORTING
   ============================================================ */
document.querySelectorAll("th[data-column]").forEach(th => {
  th.addEventListener("click", () => {
    const col = th.dataset.column;

    if (sortColumn === col) {
      sortAsc = !sortAsc;
    } else {
      sortAsc = true;
      sortColumn = col;
    }

    sortData();
    renderTable();
    renderPagination();
  });
});

/* ============================================================
   MODAL FOTO
   ============================================================ */
function showModal(src) {
  document.getElementById("modalImg").src = src;
  document.getElementById("modalFoto").style.display = "flex";
}

document.getElementById("modalFoto").onclick = () => {
  document.getElementById("modalFoto").style.display = "none";
};

/* ============================================================
   EVENT LISTENER
   ============================================================ */
document.getElementById("filterRuangan").addEventListener("change", applyFilters);
document.getElementById("searchInput").addEventListener("input", applyFilters);

/* ============================================================
   AUTO LOAD
   ============================================================ */
loadData();

/* ============================================================
   AUTO REFRESH (opsional)
   ============================================================ */
// refresh data setiap 10 detik
setInterval(loadData, 10000);
