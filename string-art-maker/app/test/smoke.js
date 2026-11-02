const { chromium } = require('playwright');
const fs = require('fs'); fs.mkdirSync(__dirname + '/out', { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto('http://localhost:8765/public/');

  for (const shape of ['circle', 'square']) {
    await page.click('#sample');
    await page.waitForFunction(() => !document.getElementById('run').disabled);
    await page.selectOption('#shape', shape);
    await page.fill('#pins', '120');
    await page.fill('#lines', '800');
    const t0 = Date.now();
    await page.click('#run');
    await page.waitForFunction(() => document.getElementById('status').textContent.startsWith('Done'), null, { timeout: 60000 });
    const status = await page.textContent('#status');
    const seqRows = (await page.textContent('#sequence')).trim().split('\n').length;
    const meas = await page.textContent('#measurements');
    console.log(`[${shape}] ${status} (${Date.now() - t0} ms wall) rows=${seqRows}`);
    console.log(meas.split('\n').slice(0, 2).join(' | '));
    await page.screenshot({ path: __dirname + `/out/shot-${shape}.png`, fullPage: true });
  }
  await page.click('#stepMode');
  await page.click('#stepNextBtn'); await page.click('#stepNextBtn');
  console.log('stepper:', (await page.textContent('#stepCount')), 'to', await page.textContent('#stepTo'));
  await page.screenshot({ path: __dirname + '/out/shot-stepper.png' });
  await page.click('#stepClose');
  console.log('errors:', errors.length ? errors : 'none');
  await browser.close();
})();
