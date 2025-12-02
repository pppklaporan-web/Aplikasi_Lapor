/* ============================================================
   DASHBOARD TEKNISI – FINAL FIXED
   ============================================================ */

const API_URL = "https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec";

const tbody = document.querySelector("#tabelTeknisi tbody");
const modal = document.getElementById("modalEdit");
const editId = document.getElementById("editId");
const editStatus = document.getElementById("editStatus");
const editTeknisi = document.getElementById("editTeknisi");
const btnSimpan = document.getElementById("btnSimpan");

let dataLaporan = [];

/* ============================================================
   LOAD DATA
   ============================================================ */
async function loadData() {
    tbody.innerHTML = "<tr><td colspan='9'>Memuat data...</td></tr>";

    try {
        const res = await fetch(API_URL + "?action=getReports");
        const json = await res.json();

        if (json.status !== "success") {
            tbody.innerHTML = "<tr><td colspan='9'>Gagal memuat data</td></tr>";
            return;
        }

        dataLaporan = json.data;
        renderTable();

    } catch (e) {
        tbody.innerHTML = "<tr><td colspan='9'>Error mengambil data</td></tr>";
    }
}

/* ============================================================
   RENDER TABLE
   ============================================================ */
function renderTable() {
    tbody.innerHTML = "";

    dataLaporan.forEach(r => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${r.id}</td>
            <td>${r.waktu}</td>
            <td>${r.nama}</td>
            <td>${r.ruangan}</td>
            <td>${r.keterangan}</td>

            <td>
                ${r.foto ?
                    `<img src="${r.foto}" class="foto-thumb" 
                     onclick="window.open('${r.foto}','_blank')">`
                 : "-"
                }
            </td>

            <td>${r.status}</td>
            <td>${r.teknisi || "-"}</td>

            <td>
                <button class="edit-button" onclick="openEditModal('${r.id}')">
                    Edit
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

/* ============================================================
   OPEN MODAL
   ============================================================ */
function openEditModal(id) {
    const item = dataLaporan.find(x => x.id === id);
    if (!item) return;

    editId.value = item.id;
    editStatus.value = item.status;
    editTeknisi.value = item.teknisi || "";

    modal.style.display = "flex";
}

/* ============================================================
   SAVE UPDATE
   ============================================================ */
btnSimpan.onclick = async function () {
    const payload = {
        action: "update",
        id: editId.value,
        status: editStatus.value,
        teknisi: editTeknisi.value
    };

    btnSimpan.innerText = "Menyimpan...";
    btnSimpan.disabled = true;

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
        });

        const json = await res.json();

        if (json.status === "success") {
            modal.style.display = "none";
            loadData(); // refresh tabel
        } else {
            alert("Gagal update: " + json.message);
        }

    } catch (e) {
        alert("Error menyimpan perubahan");
    }

    btnSimpan.innerText = "Simpan Perubahan";
    btnSimpan.disabled = false;
};

/* ============================================================
   CLOSE MODAL
   ============================================================ */
modal.onclick = e => {
    if (e.target === modal) modal.style.display = "none";
};

loadData();
