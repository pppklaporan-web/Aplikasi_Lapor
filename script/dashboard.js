// ==========================
// CONFIG
// ==========================
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbyKFTfFmqmBF5YWpL4MOXM8mc0zn0PcK6cEW2M6c_hEdYOr3serYaaJ45kXesux1sLjfw/exec";

const TABLE = document.querySelector("#laporanTable tbody");
const modal = document.getElementById("modalForm");
const form = document.getElementById("laporForm");
const statusDiv = document.getElementById("status");
const filterStatus = document.getElementById("filterStatus");

// ==========================
// EVENT HANDLER
// ==========================
document.getElementById("btnOpenForm").onclick = () => {
  modal.style.display = "flex";
  statusDiv.textContent = "";
};

document.getElementById("btnCloseModal").onclick = () => {
  modal.style.display = "none";
};

document.getElementById("btnRefresh").onclick = loadData;
filterStatus.onchange = loadData;

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// ==========================
// LOAD DATA
// ==========================
async function loadData() {
  TABLE.innerHTML = `<tr><td colspan="8">Memuat data...</td></tr>`;

  try {
    const res = await fetch(GAS_URL);
    const json = await res.json();

    if (json.status !== "success")
      throw new Error("Gagal mengambil data dari server.");

    let rows = json.data || [];

    const filter = filterStatus.value;
    if (filter) rows = rows.filter(r => r.status === filter);

    renderRows(rows);
  } catch (err) {
    TABLE.innerHTML = `<tr><td colspan="8">Error: ${err.message}</td></tr>`;
  }
}

// ==========================
// RENDER TABLE
// ==========================
function renderRows(rows) {
  if (!rows.length) {
    TABLE.innerHTML = `<tr><td colspan="8">Belum ada laporan</td></tr>`;
    return;
  }

  TABLE.innerHTML = "";

  rows.forEach(r => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.timestamp}</td>
      <td>${r.nama}</td>
      <td>${r.ruangan}</td>
      <td>${r.keterangan}</td>
      <td>${renderFoto(r.foto)}</td>
      <td>${r.status}</td>
      <td>${r.teknisi}</td>
    `;

    const s = (r.status || "").toLowerCase();

    if (s.includes("baru")) tr.style.background = "#ffe5e5";
    if (s.includes("proses")) tr.style.background = "#fff7cc";
    if (s.includes("selesai")) tr.style.background = "#e6ffe6";

    TABLE.appendChild(tr);
  });
}

// ==========================
// FOTO THUMBNAIL
// ==========================
function renderFoto(url) {
  if (!url) return "-";

  let fileId = "";
  try {
    fileId = url.split("id=")[1].split("&")[0];
  } catch (e) {
    return "-";
  }

  return `
    <img src="https://drive.google.com/thumbnail?id=${fileId}"
    style="width:60px;border-radius:6px;cursor:pointer"
    onclick="window.open('https://drive.google.com/uc?export=view&id=${fileId}')">
  `;
}

// ==========================
// KIRIM LAPORAN
// ==========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusDiv.textContent = "Mengirim...";

  const formData = new FormData(form);

  const file = document.getElementById("foto").files[0];
  if (file) {
    const base64 = await toBase64(file);
    formData.append("foto_base64", base64);
    formData.append("foto_name", file.name);
  }

  formData.append("action", "add");

  try {
    const res = await fetch(GAS_URL, { method: "POST", body: formData });
    const json = await res.json();

    if (json.status === "success") {
      statusDiv.textContent = "Terkirim ✓";
      form.reset();

      setTimeout(() => {
        modal.style.display = "none";
        statusDiv.textContent = "";
      }, 600);

      loadData();
    } else {
      statusDiv.textContent = "Gagal: " + json.message;
    }
  } catch (err) {
    statusDiv.textContent = "Error: " + err.message;
  }
});

// ==========================
// FILE → BASE64
// ==========================
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// START
loadData();
