document.addEventListener("click", async function(e) {
  if (e.target.classList.contains("editBtn")) {

    const id = e.target.dataset.id;

    const status = prompt("Update status:");
    const teknisi = prompt("Nama teknisi:");

    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "update",
        id: id,
        status: status,
        teknisi: teknisi
      })
    });

    const out = await res.json();
    alert(out.status);
    location.reload();
  }
});
