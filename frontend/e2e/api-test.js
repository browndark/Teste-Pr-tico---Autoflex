const fetch = require('node-fetch');

(async ()=>{
  const base = 'http://127.0.0.1:8082';
  try{
    // create raw material
    const mpCode = 'RM_API_' + Date.now();
    let res = await fetch(base + '/raw-materials', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({code: mpCode, name:'Raw Material API Test', stockQuantity: 50})});
    console.log('POST /raw-materials status', res.status);
    const mp = await res.json();
    console.log('Created raw material id', mp.id, 'code', mp.code);

    // create product
    const pCode = 'P_API_' + Date.now();
    res = await fetch(base + '/products', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({code: pCode, name:'Product API', price: 12.34, quantity: 0})});
    console.log('POST /products status', res.status);
    const p = await res.json();
    console.log('Created product id', p.id, 'code', p.code);

    // create association
    const assoc = { product: { id: p.id }, rawMaterial: { id: mp.id }, requiredQuantity: 2 };
    res = await fetch(base + '/products-raw-materials', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(assoc)});
    console.log('POST /products-raw-materials status', res.status);
    const a = await res.json();
    console.log('Created association id', a.id);

    // lists
    res = await fetch(base + '/raw-materials'); console.log('GET /raw-materials status', res.status); console.log(await res.json());
    res = await fetch(base + '/products'); console.log('GET /products status', res.status); console.log(await res.json());
    res = await fetch(base + '/products-raw-materials'); console.log('GET /products-raw-materials status', res.status); console.log(await res.json());

    process.exit(0);
  }catch(e){ console.error(e); process.exit(1);} 
})();
