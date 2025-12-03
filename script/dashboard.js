// ==========================
// CONFIG
// ==========================
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec";

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

    const data = json.data || [];
    const filter = filterStatus.value;

    const filtered = filter
      ? data.filter((r) => r.status === filter)
      : data;

    renderRows(filtered);
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

  rows.forEach((r) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${safe(r.id)}</td>
      <td>${safe(r.timestamp)}</td>
      <td>${safe(r.nama)}</td>
      <td>${safe(r.ruangan)}</td>
      <td>${safe(r.keterangan)}</td>
      <td>${renderFoto(r.foto)}</td>
      <td>${safe(r.status)}</td>
      <td>${safe(r.teknisi)}</td>
    `;

    // ==========================
    // WARNA BARIS BERDASARKAN STATUS
    // ==========================
    const s = (r.status || "").toLowerCase();

    if (s.includes("baru")) {
      tr.style.background = "#ffe5e5";
      tr.style.borderLeft = "6px solid #ff0000";
    }
    if (s.includes("proses")) {
      tr.style.background = "#fff8d1";
      tr.style.borderLeft = "6px solid #e6b800";
    }
    if (s.includes("selesai")) {
      tr.style.background = "#e6ffe6";
      tr.style.borderLeft = "6px solid #00b300";
    }

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

  const thumb = `https://drive.google.com/thumbnail?id=${fileId}`;
  const view = `https://drive.google.com/uc?export=view&id=${fileId}`;

  return `
    <a href="${view}" target="_blank">
      <img src="${thumb}" style="width:60px;border-radius:6px;cursor:pointer;" />
    </a>
  `;
}

// ==========================
// FORM KIRIM LAPORAN
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
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    if (json.status === "success") {
      statusDiv.textContent = "Terkirim ✓";
      form.reset();

      setTimeout(() => {
        modal.style.display = "none";
        statusDiv.textContent = "";
      }, 800);

      loadData();
    } else {
      statusDiv.textContent =
        "Gagal: " + (json.message || "Server error");
    }
  } catch (err) {
    statusDiv.textContent = "Error koneksi: " + err.message;
  }
});

// ==========================
// FILE TO BASE64
// ==========================
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ==========================
// HTML ESCAPE
// ==========================
function safe(s) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ==========================
// START
// ==========================
loadData();
