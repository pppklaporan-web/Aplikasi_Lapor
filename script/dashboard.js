const API_URL = "https://script.google.com/macros/s/AKfycbxcvVSxw6liSor0zj03SjbxBiMryQ9PE2vGYQOY786K6-GauDstEnsRUZ_zid5An3uZtA/exec";

let rawData = [], filteredData = [], currentPage = 1, rowsPerPage = 10;
let sortColumn = null, sortAsc = true;

// ========================================
// 1. LOAD DATA
// ========================================
async function loadData() {
  const loading = document.getElementById("loading");

  try {
    const res = await fetch(API_URL);
    const json = await res.json();

    if (json.status !== "success") {
      loading.innerText = "Gagal mengambil data";
      return;
    }

    // ===== FIX PEMETAAN DATA APPS SCRIPT =====
    rawData = json.data.map(d => ({
      waktu: d.waktu || d[0],
      nama: d.nama || d[1],
      ruangan: d.ruangan || d[2],
      keterangan: d.keterangan || d[3],
      foto: d.foto || d[4],     // now correct
      status: d.status || d[5], // now correct
      teknisi: d.teknisi || d[6]
    }));

    // Populate filter ruangan
    const ruanganSet = new Set(rawData.map(x => x.ruangan).filter(Boolean));
    const filter = document.getElementById("filterRuangan");
    filter.innerHTML = `<option value="all">Semua Ruangan</option>`;
    ruanganSet.forEach(r => filter.innerHTML += `<option value="${r}">${r}</option>`);

    applyFilters();

  } catch (err) {
    loading.innerText = "Terjadi error: " + err;
  }
}

// ========================================
// 2. FILTER + SEARCH
// ========================================
function applyFilters() {
  const filterVal = document.getElementById("filterRuangan").value;
  const searchVal = document.getElementById("searchInput").value.toLowerCase();

  filteredData = rawData.filter(d => {
    const matchFilter = filterVal === "all" || d.ruangan === filterVal;
    const matchSearch = Object.values(d).some(v => v?.toLowerCase?.().includes(searchVal));
    return matchFilter && matchSearch;
  });

  if (sortColumn) sortData();

  currentPage = 1;
  renderTable();
  renderPagination();
}

// ========================================
// 3. SORTING
// ========================================
function sortData() {
  filteredData.sort((a, b) => {
    let vA = a[sortColumn] || "";
    let vB = b[sortColumn] || "";
    return sortAsc ? vA.localeCompare(vB) : vB.localeCompare(vA);
  });
}

// ========================================
// 4. RENDER TABEL
// ========================================
function renderTable() {
  const loading = document.getElementById("loading");
  const table = document.getElementById("tabel");

  loading.style.display = "none";
  table.style.display = "table";

  const tbody = table.querySelector("tbody");
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
        : r.status?.toLowerCase() === "tertunda"
        ? "status-tertunda"
        : "status-menunggu";

    tbody.innerHTML += `
      <tr>
        <td>${r.waktu}</td>
        <td>${r.nama}</td>
        <td>${r.ruangan}</td>
        <td title="${r.keterangan}">${r.keterangan}</td>
        
        <td>
          ${
            r.foto
              ? `<img src="${r.foto}" class="foto-thumb" onclick="showModal('${r.foto}')">`
              : "-"
          }
        </td>

        <td><span class="status ${statusClass}">${r.status}</span></td>
        <td>${r.teknisi}</td>
      </tr>
    `;
  });
}

// ========================================
// 5. PAGINATION
// ========================================
function renderPagination() {
  const container = document.getElementById("pagination");
  container.innerHTML = "";

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

    container.appendChild(btn);
  }
}

// ========================================
// 6. SORT EVENT HANDLER
// ========================================
document.querySelectorAll("th[data-column]").forEach(th => {
  th.addEventListener("click", () => {
    const col = th.getAttribute("data-column");

    if (sortColumn === col) {
      sortAsc = !sortAsc;
    } else {
      sortColumn = col;
      sortAsc = true;
    }

    sortData();
    currentPage = 1;
    renderTable();
    renderPagination();
  });
});

// ========================================
// 7. MODAL FOTO
// ========================================
function showModal(src) {
  const modal = document.getElementById("modalFoto");
  const img = document.getElementById("modalImg");
  img.src = src;
  modal.style.display = "flex";

  modal.onclick = () => (modal.style.display = "none");
}

// Event listeners
document.getElementById("filterRuangan").addEventListener("change", applyFilters);
document.getElementById("searchInput").addEventListener("input", applyFilters);

// Load awal
loadData();
