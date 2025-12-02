const API_URL = "GANTI_DENGAN_URL_EXEC_WEB_APP";
let rawData = [], filteredData = [], currentPage = 1, rowsPerPage = 10;
let sortColumn = null, sortAsc = true;

async function loadData(){
  const loading = document.getElementById("loading");
  try{
    const res = await fetch(API_URL);
    const json = await res.json();
    if(json.status!=="success"){ loading.innerText="Gagal mengambil data"; return; }
    rawData=json.data;

    // populate filter
    const ruanganSet = new Set(rawData.map(d=>d.ruangan).filter(r=>r));
    const filterSelect=document.getElementById("filterRuangan");
    filterSelect.innerHTML='<option value="all">Semua Ruangan</option>';
    ruanganSet.forEach(r=> filterSelect.innerHTML+=`<option value="${r}">${r}</option>`);

    applyFilters();
  }catch(e){ loading.innerText="Terjadi error: "+e; }
}

function applyFilters(){
  const filterValue=document.getElementById("filterRuangan").value;
  const searchValue=document.getElementById("searchInput").value.toLowerCase();
  filteredData = rawData.filter(d=>{
    const matchesFilter = filterValue==="all" || d.ruangan===filterValue;
    const matchesSearch = Object.values(d).some(v=>v && v.toLowerCase().includes(searchValue));
    return matchesFilter && matchesSearch;
  });
  if(sortColumn) sortData();
  currentPage=1; renderTable(); renderPagination();
}

function sortData(){
  filteredData.sort((a,b)=>{
    let valA=a[sortColumn]||"", valB=b[sortColumn]||"";
    return sortAsc? valA.localeCompare(valB) : valB.localeCompare(valA);
  });
}

function renderTable(){
  const loading=document.getElementById("loading");
  const table=document.getElementById("tabel");
  loading.style.display="none"; table.style.display="table";

  const tbody=table.querySelector("tbody"); tbody.innerHTML="";
  if(filteredData.length===0){ tbody.innerHTML="<tr><td colspan='7'>Tidak ada data</td></tr>"; return; }

  const start=(currentPage-1)*rowsPerPage;
  const end=start+rowsPerPage;
  const pageData=filteredData.slice(start,end);

  pageData.forEach(r=>{
    const statusClass = r.status.toLowerCase()==="selesai"?"status-selesai":r.status.toLowerCase()==="tertunda"?"status-tertunda":"status-menunggu";
    tbody.innerHTML+=`
      <tr>
        <td>${r.waktu}</td>
        <td>${r.nama}</td>
        <td>${r.ruangan}</td>
        <td title="${r.keterangan}">${r.keterangan}</td>
        <td>${r.foto?`<img src="${r.foto}" class="foto-thumb" onclick="showModal('${r.foto}')">`:"-"}</td>
        <td><span class="status ${statusClass}">${r.status}</span></td>
        <td>${r.teknisi}</td>
      </tr>`;
  });
}

function renderPagination(){
  const container=document.getElementById("pagination"); container.innerHTML="";
  const pageCount=Math.ceil(filteredData.length/rowsPerPage);
  if(pageCount<=1) return;
  for(let i=1;i<=pageCount;i++){
    const btn=document.createElement("button");
    btn.className="page-btn"+(i===currentPage?" active":"");
    btn.innerText=i;
    btn.onclick=()=>{ currentPage=i; renderTable(); renderPagination(); };
    container.appendChild(btn);
  }
}

document.getElementById("filterRuangan").addEventListener("change",applyFilters);
document.getElementById("searchInput").addEventListener("input",applyFilters);
document.querySelectorAll("th[data-column]").forEach(th=>{
  th.addEventListener("click",()=>{
    const col=th.getAttribute("data-column");
    if(sortColumn===col) sortAsc=!sortAsc; else{ sortColumn=col; sortAsc=true; }
    sortData(); currentPage=1; renderTable(); renderPagination();
  });
});

// Modal Foto
function showModal(src){
  const modal=document.getElementById("modalFoto");
  const img=document.getElementById("modalImg");
  img.src=src; modal.style.display="flex";
  modal.onclick=function(){ modal.style.display="none"; }
}

loadData();
