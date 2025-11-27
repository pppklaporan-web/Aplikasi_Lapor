const GAS_URL = 'https://script.google.com/macros/s/AKfycbycJc7oMgPazk-IPfeE7F7GaFsMK9NWZM6bylP91rP8kgtqP07XH6goyqGltE32jIl6/exec';

async function kirimLaporan(data){
  try{
    const resp = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-Type':'application/json'}
    });
    return await resp.json();
  }catch(err){
    console.error(err);
    return {success:false,error:err.toString()};
  }
}

async function fetchLaporan(){
  try{
    const resp = await fetch(GAS_URL+'?action=list');
    return await resp.json();
  }catch(err){
    console.error(err);
    return {success:false,error:err.toString()};
  }
}

async function fetchTeknisi(){
  try{
    const resp = await fetch(GAS_URL+'?action=techs');
    return await resp.json();
  }catch(err){
    console.error(err);
    return {success:false,error:err.toString()};
  }
}

async function updateLaporan(rowId, status, teknisi){
  return await kirimLaporan({action:'update', rowId, status, teknisi});
}
