const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxcvVSxw6liSor0zj03SjbxBiMryQ9PE2vGYQOY786K6-GauDstEnsRUZ_zid5An3uZtA/exec";

const form = document.getElementById("reportForm");
const statusMsg = document.getElementById("statusMsg");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    statusMsg.textContent = "Mengirim...";

    const data = new FormData(form);
    data.append("action", "submitReport");

    const foto = document.getElementById("foto").files[0];

    if (foto) {
        // encode foto ke base64
        const base64 = await toBase64(foto);
        data.append("foto", base64.replace(/^data:image\/\w+;base64,/, ""));
    }

    try {
        const res = await fetch(WEB_APP_URL, {
            method: "POST",
            body: data
        });

        const j = await res.json();

        if (j.success) {
            statusMsg.textContent = "Laporan terkirim!";
            form.reset();
        } else {
            statusMsg.textContent = "Gagal: " + j.message;
        }

    } catch (err) {
        statusMsg.textContent = "Error koneksi.";
        console.error(err);
    }
});

// konversi file ke base64
function toBase64(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
