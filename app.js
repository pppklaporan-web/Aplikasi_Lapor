const GAS_URL = 'PASTE_GAS_WEBAPP_URL_DISINI'; // Ganti dengan URL Web App baru

function dataURLfromFile(file){
  return new Promise((res, rej)=>{
    if(!file){ res(null); return; }
    const reader = new FileReader();
    reader.onload = ()=>res(reader.result);
    reader.onerror=()=>rej('Gagal convert file');
    reader.readAsDataURL(file);
  });
}

async function postData(url, payload){
  const resp = await fetch(url,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  return await resp.json();
}

async function getData(url){
  const resp = await fetch(url);
  return await resp.json();
}
