const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const urls = [
    'http://localhost:3001',
    'http://localhost:3000'
  ];

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // try both frontend ports
    let opened = false;
    for (const url of urls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 5000 });
        console.log('Opened', url);
        opened = true;
        break;
      } catch (e) {
        console.log('Failed to open', url, e.message);
      }
    }
    if (!opened) throw new Error('Could not open frontend on known ports');

    // navigate to Matérias-Primas tab (assumes a nav button exists)
    // adjust selectors to match the app structure
    // Use page.evaluate for DOM interactions to avoid compatibility issues
    await page.evaluate(() => {
      // try to click a tab/button that contains 'Matérias-Primas'
      const tab = Array.from(document.querySelectorAll('button, a')).find(el => /materias?-primas/i.test(el.textContent) || /matérias?-primas/i.test(el.textContent));
      if (tab) tab.click();
    });

    await new Promise(r => setTimeout(r, 500));

    // Fill fields and submit via DOM
    await page.evaluate(() => {
      const codigo = document.querySelector('input[name=codigo]') || document.querySelector('input[placeholder="Código"]');
      const nome = document.querySelector('input[name=nome]') || document.querySelector('input[placeholder="Nome"]');
      const quantidade = document.querySelector('input[name=quantidadeEstoque]') || document.querySelector('input[placeholder*="quantidade"]');
      if (codigo) codigo.value = 'MP_E2E_' + Date.now();
      if (nome) nome.value = 'E2E Test';
      if (quantidade) quantidade.value = '7';

      // find button with 'Adicionar' text
      const add = Array.from(document.querySelectorAll('button')).find(b => /adicionar/i.test(b.textContent));
      if (add) add.click(); else {
        // try submitting first form
        const f = document.querySelector('form'); if (f) f.submit();
      }
    });

    // wait and capture result
    await page.waitForTimeout ? await page.waitForTimeout(1000) : await new Promise(r => setTimeout(r, 1000));

    // take screenshot
    const screenshotPath = path.join(__dirname, 'e2e-result.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to', screenshotPath);

    // fetch materias-primas list via backend API to confirm
    const res = await page.evaluate(() => fetch('http://localhost:8082/materias-primas').then(r => r.json()));
    console.log('Materias-primas count after add:', res.length);

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('E2E error', err);
    if (browser) await browser.close();
    process.exit(2);
  }
})();
