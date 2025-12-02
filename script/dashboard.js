const API_URL = "https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec";

let rawData = [], filteredData = [], currentPage = 1, rowsPerPage = 10;
let sortColumn = null, sortAsc = true;

// ========================================
// 1. LOAD DATA
// ========================================
async function loadData() {
  const loading = document.getElementById("loading");

  try {
    const res = await fetch(API_URL + "?action=getReports");
    const json = await res.json();

    if (json.status !== "success") {
      loading.innerText = "Gagal mengambil data";
      return;
    }

    // PEMETAAN BARU – SESUAI APPS SCRIPT:
    // [0]=id, [1]=waktu, [2]=nama, [3]=ruangan, [4]=keterangan,
    // [5]=foto, [6]=status, [7]=teknisi
    rawData = json.data.map(r => ({
      id: r.id || r[0],
      waktu: r.waktu || r[1],
      nama: r.nama || r[2],
      ruangan: r.ruangan || r[3],
      keterangan: r.keterangan || r[4],
      foto: r.foto || r[5],
      status: r.status || r[6],
      teknisi: r.teknisi || r[7]
    }));

    // Filter ruangan otomatis
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
    const f1 = filterVal === "all" || d.ruangan === filterVal;
    const f2 = Object.values(d).some(v => v?.toString().toLowerCase().includes(searchVal));
    return f1 && f2;
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
        : r.status?.toLowerCase() === "tertunda"
        ? "status-tertunda"
        : "status-menunggu";

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
    sortAsc = sortColumn === col ? !sortAsc : true;
    sortColumn = col;
    sortData();
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

document.getElementById("filterRuangan").addEventListener("change", applyFilters);
document.getElementById("searchInput").addEventListener("input", applyFilters);

loadData();
