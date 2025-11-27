// Ganti URL ini dengan URL deploy terbaru dari GAS Web App
const GAS_URL = 'https://script.google.com/macros/s/AKfycbycJc7oMgPazk-IPfeE7F7GaFsMK9NWZM6bylP91rP8kgtqP07XH6goyqGltE32jIl6/exec';

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
  const text = await resp.text();
  try{
    return JSON.parse(text);
  } catch(e){
    throw 'Response bukan JSON: '+text;
  }
}

async function getData(url){
  const resp = await fetch(url);
  const text = await resp.text();
  try{
    return JSON.parse(text);
  } catch(e){
    throw 'Response bukan JSON: '+text;
  }
}
