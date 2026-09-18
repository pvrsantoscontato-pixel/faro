// Atualiza os prints da seção "Sites no ar" (assets/portfolio).
// Lê a lista de sites direto do PROJETOS em script.js — adicionar um site lá basta.
// Para cada site gera: <slug>-desktop.jpg (1440x900), <slug>-long.jpg (1440x2600) e <slug>-mobile.jpg (390x844 @2x).
// Se um site não carregar, o print antigo é mantido e o script segue para o próximo.
//
// Local:  npm run prints        (usa o Chrome instalado se PUPPETEER_EXECUTABLE_PATH estiver definido)
// GitHub: .github/workflows/prints-portfolio.yml roda toda segunda-feira e faz commit se algo mudou.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function lerProjetos() {
  const src = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');
  const m = src.match(/const PROJETOS = (\[[\s\S]*?\n\]);/);
  if (!m) throw new Error('Não achei "const PROJETOS = [...]" em script.js');
  return new Function(`return ${m[1]}`)();
}

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1 };
const MOBILE = {
  viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
};
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function fecharCookies(page) {
  await page.evaluate(() => {
    const re = /^(aceitar|aceito|ok|entendi|concordo|recusar|fechar|accept|got it)/i;
    for (const el of document.querySelectorAll('button, a, [role="button"]')) {
      const t = (el.innerText || '').trim();
      if (re.test(t) && t.length < 30) el.click();
    }
  });
  await espera(800);
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('div, section, aside')) {
      const cs = getComputedStyle(el);
      if ((cs.position === 'fixed' || cs.position === 'sticky') && /cookie/i.test(el.innerText || '') && el.innerText.length < 600) el.remove();
    }
  });
}

// Rola a página inteira para disparar lazy-load e animações de entrada, depois volta ao topo.
async function rolarTudo(page) {
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); }
    window.scrollTo(0, 0);
  });
  await espera(800);
}

async function abrir(browser, url, kind) {
  const page = await browser.newPage();
  if (kind === 'desktop') await page.setViewport(DESKTOP);
  else { await page.setUserAgent(MOBILE.userAgent); await page.setViewport(MOBILE.viewport); }
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await espera(1500);
  await fecharCookies(page);
  await rolarTudo(page);
  return page;
}

// Grava primeiro num .tmp e só substitui o arquivo final se a captura deu certo.
async function capturar(page, destino, opts) {
  const tmp = destino + '.tmp';
  await page.screenshot(Object.assign({ path: tmp, type: 'jpeg' }, opts));
  fs.renameSync(tmp, destino);
  console.log('ok ', path.relative(ROOT, destino));
}

(async () => {
  const projetos = lerProjetos();
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--no-first-run', '--hide-scrollbars'],
  });
  let falhas = 0;

  for (const p of projetos) {
    const dest = (campo) => path.join(ROOT, p[campo].replace(/^\//, ''));
    try {
      const desk = await abrir(browser, p.url, 'desktop');
      await capturar(desk, dest('imgDesktop'), { quality: 82 });
      if (p.imgLong) {
        await capturar(desk, dest('imgLong'), { quality: 78, clip: { x: 0, y: 0, width: 1440, height: 2600 }, captureBeyondViewport: true });
      }
      await desk.close();

      const mob = await abrir(browser, p.url, 'mobile');
      await capturar(mob, dest('imgMobile'), { quality: 82 });
      await mob.close();
    } catch (e) {
      falhas++;
      console.error(`ERRO ${p.nome} (${p.url}): ${e.message} — prints antigos mantidos`);
    }
  }

  await browser.close();
  console.log(falhas ? `${falhas} site(s) com erro` : 'todos os prints atualizados');
})();
