const fetch = require('node-fetch');

(async ()=>{
  const base = 'http://127.0.0.1:8082';
  try{
    // create materia-prima
    const mpCode = 'MP_API_' + Date.now();
    let res = await fetch(base + '/materias-primas', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({codigo: mpCode, nome:'MP API Test', quantidadeEstoque: 50})});
    console.log('POST /materias-primas status', res.status);
    const mp = await res.json();
    console.log('Created materia-prima id', mp.id, 'codigo', mp.codigo);

    // create product
    const pCode = 'P_API_' + Date.now();
    res = await fetch(base + '/produtos', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({codigo: pCode, nome:'Produto API', valor: 12.34})});
    console.log('POST /produtos status', res.status);
    const p = await res.json();
    console.log('Created produto id', p.id, 'codigo', p.codigo);

    // create association
    const assoc = { produto: { id: p.id }, materiaPrima: { id: mp.id }, quantidadeNecessaria: 2 };
    res = await fetch(base + '/produtos-materias-primas', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(assoc)});
    console.log('POST /produtos-materias-primas status', res.status);
    const a = await res.json();
    console.log('Created association id', a.id);

    // lists
    res = await fetch(base + '/materias-primas'); console.log('GET /materias-primas status', res.status); console.log(await res.json());
    res = await fetch(base + '/produtos'); console.log('GET /produtos status', res.status); console.log(await res.json());
    res = await fetch(base + '/produtos-materias-primas'); console.log('GET /produtos-materias-primas status', res.status); console.log(await res.json());

    process.exit(0);
  }catch(e){ console.error(e); process.exit(1);} 
})();
