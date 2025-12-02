const API_URL = "https://script.google.com/macros/s/AKfycbye-HYr7mlljZBqn5ucGfAXUGx3UN_7PHuLsuc3maPchJ3d9rnrl_Io6Oq5FUw50eee8Q/exec";

// =============================
// LOAD DATA
// =============================
async function loadReports() {
    try {
        const res = await fetch(`${API_URL}?action=getReports`);
        const json = await res.json();

        if (json.status !== "success") {
            console.error("Gagal load:", json.message);
            return;
        }

        renderTable(json.data);
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

// =============================
// RENDER TABEL
// =============================
function renderTable(data) {
    const tbody = document.getElementById("data-body");
    tbody.innerHTML = "";

    data.forEach(item => {
        const row = `
            <tr>
                <td>${item.waktu}</td>
                <td>${item.nama}</td>
                <td>${item.ruangan}</td>
                <td>${item.keterangan}</td>
                <td>${item.status}</td>
                <td>
                    ${item.foto ? `<a href="${item.foto}" target="_blank">Lihat Foto</a>` : "-"}
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// =============================
// UPDATE STATUS (DARI TEKNISI)
// =============================
async function updateStatus(id, status, teknisi) {
    try {
        const payload = {
            action: "update",
            id,
            status,
            teknisi
        };

        const res = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"        // ★ WAJIB
            },
            body: JSON.stringify(payload)                // ★ WAJIB
        });

        const json = await res.json();

        if (json.status === "success") {
            alert("Status berhasil diperbarui!");
            loadReports(); // refresh otomatis
        } else {
            alert("Gagal update: " + json.message);
        }
    } catch (err) {
        console.error("Update error:", err);
        alert("Gagal update (Network Error)");
    }
}

// AUTO REFRESH SETIAP 5 DETIK
setInterval(loadReports, 5000);

// Load pertama kali
loadReports();
