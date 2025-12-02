async function submitForm() {
  const nama = document.getElementById("nama").value;
  const ruangan = document.getElementById("ruangan").value;
  const ket = document.getElementById("keterangan").value;
  const fotoInput = document.getElementById("foto");

  let fotoBase64 = "";
  if (fotoInput.files.length > 0) {
    const file = fotoInput.files[0];
    fotoBase64 = await toBase64(file);
  }

  const payload = {
    nama: nama,
    ruangan: ruangan,
    keterangan: ket,
    foto: fotoBase64
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  if (json.status === "success") {
    alert("Berhasil dikirim");
  }
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
