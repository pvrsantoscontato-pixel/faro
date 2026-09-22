/* =========================================================
   Faro — script da landing page (PT em / e EN em /en/)
   1. PROJETOS  → portfólio (adicionar um site = adicionar um item aqui + prints)
   2. PRECOS    → simulador de orçamento (mudar um valor = mudar aqui)
   3. T         → textos do script nos dois idiomas
   4. Menu mobile, ano do rodapé
   O idioma vem do <html lang="..."> da página.
   ========================================================= */

const WHATSAPP = '5533987395357';

// Google Analytics: envia um evento se a tag estiver carregada (nunca quebra o site se não estiver).
function track(name, params) {
  if (typeof window.gtag === 'function') window.gtag('event', name, Object.assign({ lang: LANG }, params || {}));
}
const LANG = (document.documentElement.lang || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt';
// Links internos da versão EN levam ?lang=en para furar o redirect por país (quem testa do Brasil).
const BRIEFING = LANG === 'en' ? 'briefing/?lang=en&' : 'comecar/?';
const CONTACT_EMAIL = 'pvrsantos.contato@gmail.com';

// Pega o campo no idioma da página: t(item, 'nome') → item.nome_en em inglês, item.nome em português.
const t = (obj, key) => (LANG === 'en' && obj[key + '_en'] != null ? obj[key + '_en'] : obj[key]);

/* ---------- 3. Textos do script ---------- */
const T = {
  pt: {
    cats: { 'Comércio': 'Comércio', 'Consultoria': 'Consultoria', 'Serviços': 'Serviços' },
    openSite: 'Abrir site ↗', openSiteAria: (n) => `Abrir o site ${n} em nova aba`,
    imgDesktop: (n) => `Site ${n} no computador`, imgMobile: (n) => `Site ${n} no celular`,
    emptyCat: 'Ainda não há projetos nesse ramo — o seu pode ser o primeiro.',
    perMonth: '/mês', perPage: '/pág.', minusPage: 'Menos uma página', plusPage: 'Mais uma página',
    estimate: 'Estimativa:',
    pixDetail: (pct, sub) => `No Pix, com ${pct}% de desconto (de ${sub}).`,
    cardDetail: (n, v) => `Ou ${n}x de ${v} sem juros no cartão.`,
    stripeDetail: 'Pagamento por cartão via Stripe.',
    monthly: (v) => `+ ${v}/mês de manutenção`,
    wa: { intro: 'Olá! Simulei um orçamento no site da Faro:', type: 'Tipo', extras: 'Opcionais', none: 'nenhum', maint: 'Manutenção mensal', yes: 'sim', no: 'não', pay: 'Pagamento', pixTag: ' (10% off)', cardTag: ' (até 4x)', perMonth: '/mês', close: 'Quero receber a proposta.' },
    menuOpen: 'Abrir menu', menuClose: 'Fechar menu',
  },
  en: {
    cats: { 'Comércio': 'Retail', 'Consultoria': 'Consulting', 'Serviços': 'Home services' },
    openSite: 'Open site ↗', openSiteAria: (n) => `Open the ${n} website in a new tab`,
    imgDesktop: (n) => `${n} website on desktop`, imgMobile: (n) => `${n} website on mobile`,
    emptyCat: 'No projects in this category yet — yours could be the first.',
    perMonth: '/mo', perPage: '/page', minusPage: 'One page less', plusPage: 'One more page',
    estimate: 'Estimate:',
    pixDetail: (pct, sub) => `With Pix, ${pct}% off (from ${sub}).`,
    cardDetail: (n, v) => `Or ${n}× ${v} interest-free on card.`,
    stripeDetail: 'Secure card payment via Stripe. You get the invoice with the proposal.',
    monthly: (v) => `+ ${v}/mo maintenance`,
    mailSubject: 'Quote request — Faro', wa: { intro: 'Hi Paulo, I ran a quote on the Faro website:', type: 'Type', extras: 'Add-ons', none: 'none', maint: 'Monthly maintenance', yes: 'yes', no: 'no', pay: 'Payment', pixTag: ' (10% off)', cardTag: ' (up to 4×)', perMonth: '/mo', close: 'I’d like to receive the proposal.' },
    menuOpen: 'Open menu', menuClose: 'Close menu',
  },
}[LANG];

/* ---------- 1. Portfólio ---------- */
const PROJETOS = [
  {
    nome: 'Utimóveis',
    categoria: 'Comércio',
    cidade: '8 lojas em MG', cidade_en: '8 stores in MG, Brazil',
    descricao: 'Loja de móveis com mais de 30 anos, agora com catálogo e condições de pagamento online.',
    descricao_en: 'A 30-year-old furniture retailer, now with an online catalogue and payment terms.',
    url: 'https://redeutimoveis.com.br/',
    imgDesktop: '/assets/portfolio/utimoveis-desktop.jpg',
    imgLong: '/assets/portfolio/utimoveis-long.jpg',
    imgMobile: '/assets/portfolio/utimoveis-mobile.jpg',
  },
  {
    nome: 'LIR Consultoria',
    categoria: 'Consultoria',
    cidade: 'Belo Horizonte · MG', cidade_en: 'Belo Horizonte · MG, Brazil',
    descricao: 'Antecipação de precatórios explicada com clareza para gerar contato.',
    descricao_en: 'Court-debt advance services explained clearly to generate leads.',
    url: 'https://lirconsultoria.com.br/',
    imgDesktop: '/assets/portfolio/lir-desktop.jpg',
    imgLong: '/assets/portfolio/lir-long.jpg',
    imgMobile: '/assets/portfolio/lir-mobile.jpg',
  },
  {
    nome: 'AM Consultoria Ambiental',
    categoria: 'Consultoria',
    cidade: 'Guanhães · MG', cidade_en: 'Guanhães · MG, Brazil',
    descricao: 'Meio ambiente, topografia e engenharia em um só lugar.',
    descricao_en: 'Environmental consulting, surveying and engineering in one place.',
    url: 'https://pvrsantoscontato-pixel.github.io/AM-consultoria/',
    imgDesktop: '/assets/portfolio/am-desktop.jpg',
    imgLong: '/assets/portfolio/am-long.jpg',
    imgMobile: '/assets/portfolio/am-mobile.jpg',
  },
  {
    nome: 'Arkad Elétrica',
    categoria: 'Serviços',
    cidade: 'Região de Guanhães · MG', cidade_en: 'Guanhães region · MG, Brazil',
    descricao: 'Eletricista com site: serviços, segurança e WhatsApp em um clique.',
    descricao_en: 'An electrician with a website: services, safety and WhatsApp in one tap.',
    url: 'https://arkad-eletrica.vercel.app/',
    imgDesktop: '/assets/portfolio/arkad-desktop.jpg',
    imgLong: '/assets/portfolio/arkad-long.jpg',
    imgMobile: '/assets/portfolio/arkad-mobile.jpg',
  },
];

function renderPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  grid.innerHTML = PROJETOS.map((p) => `
    <a class="project" href="${p.url}" target="_blank" rel="noopener" data-cat="${p.categoria}" aria-label="${T.openSiteAria(p.nome)}">
      <div class="mockup">
        <div class="mockup__desktop">
          <div class="mockup__bar"><i></i><i></i><i></i></div>
          <img src="${p.imgLong || p.imgDesktop}" alt="${T.imgDesktop(p.nome)}" loading="lazy" width="1440" height="900">
        </div>
        <div class="mockup__mobile">
          <img src="${p.imgMobile}" alt="${T.imgMobile(p.nome)}" loading="lazy" width="390" height="844">
        </div>
      </div>
      <div class="project__body">
        <div>
          <p class="project__meta">${T.cats[p.categoria] || p.categoria} · ${t(p, 'cidade')}</p>
          <h3>${p.nome}</h3>
          <p>${t(p, 'descricao')}</p>
        </div>
        <span class="project__open">${T.openSite}</span>
      </div>
    </a>
  `).join('');

  const filters = document.getElementById('filters');
  if (!filters) return;
  filters.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const cat = chip.dataset.cat;
    filters.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    let visible = 0;
    grid.querySelectorAll('.project').forEach((card) => {
      const show = cat === 'todos' || card.dataset.cat === cat;
      card.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    let empty = grid.querySelector('.portfolio__empty');
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement('p');
        empty.className = 'portfolio__empty';
        empty.textContent = T.emptyCat;
        grid.appendChild(empty);
      }
    } else if (empty) {
      empty.remove();
    }
  });
}

/* ---------- 2. Simulador de orçamento ---------- */
const PRECOS = {
  tipos: [
    { id: 'landing', nome: 'Landing Page', nome_en: 'Landing page', desc: 'Uma página, foco em contato e vendas.', desc_en: 'One page, focused on contact and sales.', preco: 900, preco_en: 400, padrao: true },
    { id: 'completo', nome: 'Site completo', nome_en: 'Full website', desc: 'Até 4 páginas. Para negócios com vários serviços ou institucional.', desc_en: 'Up to 4 pages. For businesses with several services or a corporate site.', preco: 1500, preco_en: 700, tag: 'Mais completo', tag_en: 'Most complete' },
  ],
  extras: [
    { id: 'gmn', nome: 'Google Meu Negócio', nome_en: 'Google Business Profile', desc: 'Apareça no Google e no Maps.', desc_en: 'Show up on Google and Maps.', preco: 400, preco_en: 180, tag: 'Recomendado', tag_en: 'Recommended' },
    { id: 'dominio', nome: 'Configuração de domínio + hospedagem', nome_en: 'Domain + hosting setup', desc: 'Custo do domínio/hospedagem pago à parte ao provedor.', desc_en: 'Domain/hosting fees paid separately to the provider.', preco: 200, preco_en: 90 },
    { id: 'blog', nome: 'Blog', nome_en: 'Blog', desc: 'Artigos para aparecer em mais buscas.', desc_en: 'Articles to rank for more searches.', preco: 300, preco_en: 130 },
    { id: 'paginas', nome: 'Página adicional', nome_en: 'Extra page', desc: 'R$ 150 por página extra.', desc_en: 'US$ 70 per extra page.', preco: 150, preco_en: 70, quantidade: true, max: 10 },
    { id: 'manutencao', nome: 'Manutenção mensal', nome_en: 'Monthly maintenance', desc: 'Até 2 alterações por mês, correções e suporte.', desc_en: 'Up to 2 changes a month, fixes and support.', preco: 80, preco_en: 40, mensal: true },
  ],
  pagamentos: [
    { id: 'pix', nome: 'Pix', nome_en: 'Pix', desc: '10% de desconto', desc_en: '10% off', desconto: 0.10, padrao: true },
    { id: 'cartao', nome: 'Cartão', nome_en: 'Card', desc: 'Até 4x sem juros', desc_en: 'Up to 4× interest-free', parcelas: 4 },
  ],
  // Versão em inglês: pagamento por cartão via Stripe, sem desconto.
  pagamentos_en: [
    { id: 'stripe', nome: 'Cartão (Stripe)', nome_en: 'Card via Stripe', desc: 'Checkout seguro', desc_en: 'Secure checkout · invoice sent with the proposal', stripe: true, padrao: true },
  ],
};
if (LANG === 'en') PRECOS.pagamentos = PRECOS.pagamentos_en;

const LOCALE = LANG === 'en' ? 'en-US' : 'pt-BR';
const CURRENCY = LANG === 'en' ? 'USD' : 'BRL';
const brl = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 });
const brlCents = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 });
// Preço no idioma da página (preco_en em inglês, preco em português).
const price = (item) => (LANG === 'en' && item.preco_en != null ? item.preco_en : item.preco);

function optionHTML({ kind, group, item }) {
  const isRadio = kind === 'radio';
  const priceLabel = item.mensal ? `${brl.format(price(item))}${T.perMonth}`
    : item.quantidade ? `${brl.format(price(item))}${T.perPage}`
    : item.desconto != null || item.parcelas ? ''
    : brl.format(price(item));
  const stepper = item.quantidade ? `
    <span class="stepper" data-stepper="${item.id}">
      <button type="button" data-step="-1" aria-label="${T.minusPage}">−</button>
      <output name="${item.id}_qtd" aria-live="polite">0</output>
      <button type="button" data-step="1" aria-label="${T.plusPage}">+</button>
    </span>` : '';
  const tag = t(item, 'tag');

  return `
    <label class="opt ${isRadio ? 'opt--radio' : ''}">
      <input type="${kind}" name="${group}" value="${item.id}" ${item.padrao ? 'checked' : ''} ${item.quantidade ? 'data-quantidade' : ''}>
      <span class="opt__box" aria-hidden="true"></span>
      <span class="opt__body">
        <span class="opt__title">${t(item, 'nome')}${tag ? ` <span class="tag">${tag}</span>` : ''}${priceLabel ? ` <span class="opt__price">${priceLabel}</span>` : ''}</span>
        <span class="opt__desc">${t(item, 'desc')}</span>
      </span>
      ${stepper}
    </label>`;
}

function initSimulador() {
  const form = document.getElementById('simForm');
  if (!form) return;

  document.getElementById('tipoOptions').innerHTML = PRECOS.tipos.map((item) => optionHTML({ kind: 'radio', group: 'tipo', item })).join('');
  document.getElementById('extrasOptions').innerHTML = PRECOS.extras.map((item) => optionHTML({ kind: 'checkbox', group: 'extra', item })).join('');
  document.getElementById('pagamentoOptions').innerHTML = PRECOS.pagamentos.map((item) => optionHTML({ kind: 'radio', group: 'pagamento', item })).join('');

  const qtd = {};
  PRECOS.extras.filter((e) => e.quantidade).forEach((e) => { qtd[e.id] = 0; });

  // Stepper de quantidade: marca o checkbox quando > 0, desmarca quando volta a 0.
  form.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-step]');
    if (!btn) return;
    e.preventDefault();
    const wrap = btn.closest('[data-stepper]');
    const id = wrap.dataset.stepper;
    const item = PRECOS.extras.find((x) => x.id === id);
    qtd[id] = Math.min(item.max, Math.max(0, qtd[id] + Number(btn.dataset.step)));
    wrap.querySelector('output').value = qtd[id];
    const input = form.querySelector(`input[value="${id}"]`);
    input.checked = qtd[id] > 0;
    calcular();
  });

  form.addEventListener('change', (e) => {
    // Marcar a checkbox de página adicional direto (sem stepper) começa em 1.
    if (e.target.dataset.quantidade !== undefined) {
      const id = e.target.value;
      if (e.target.checked && qtd[id] === 0) qtd[id] = 1;
      if (!e.target.checked) qtd[id] = 0;
      form.querySelector(`[data-stepper="${id}"] output`).value = qtd[id];
    }
    calcular();
  });

  function calcular() {
    const tipoId = form.querySelector('input[name="tipo"]:checked')?.value;
    const tipo = PRECOS.tipos.find((x) => x.id === tipoId) || PRECOS.tipos[0];
    const pagId = form.querySelector('input[name="pagamento"]:checked')?.value;
    const pag = PRECOS.pagamentos.find((x) => x.id === pagId) || PRECOS.pagamentos[0];

    const marcados = [...form.querySelectorAll('input[name="extra"]:checked')].map((i) => PRECOS.extras.find((x) => x.id === i.value));
    const unicos = marcados.filter((x) => !x.mensal);
    const mensais = marcados.filter((x) => x.mensal);

    let subtotal = price(tipo);
    const linhas = [];
    unicos.forEach((x) => {
      const n = x.quantidade ? qtd[x.id] : 1;
      subtotal += price(x) * n;
      linhas.push(x.quantidade ? `${t(x, 'nome')} (${n})` : t(x, 'nome'));
    });
    const mensal = mensais.reduce((s, x) => s + price(x), 0);

    let total = subtotal;
    let detalhe = '';
    if (pag.desconto) {
      total = Math.round(subtotal * (1 - pag.desconto));
      detalhe = T.pixDetail(Math.round(pag.desconto * 100), brl.format(subtotal));
    } else if (pag.parcelas) {
      detalhe = T.cardDetail(pag.parcelas, brlCents.format(subtotal / pag.parcelas));
    } else if (pag.stripe) {
      detalhe = T.stripeDetail;
    }

    document.getElementById('simPrefix').textContent = T.estimate;
    document.getElementById('simTotal').textContent = brl.format(total);
    document.getElementById('simDetail').textContent = detalhe;
    const m = document.getElementById('simMonthly');
    m.hidden = mensal === 0;
    m.textContent = mensal ? T.monthly(brl.format(mensal)) : '';

    // Mensagem do WhatsApp
    const w = T.wa;
    const msg = [
      w.intro,
      `• ${w.type}: ${t(tipo, 'nome')}`,
      `• ${w.extras}: ${linhas.length ? linhas.join(', ') : w.none}`,
      `• ${w.maint}: ${mensal ? w.yes : w.no}`,
      `• ${w.pay}: ${t(pag, 'nome')}${pag.desconto ? w.pixTag : pag.parcelas ? w.cardTag : ''} — ${brl.format(total)}${mensal ? ` + ${brl.format(mensal)}${w.perMonth}` : ''}`,
      w.close,
    ].join('\n');
    // PT: abre o WhatsApp com o resumo. EN: abre o e-mail com o resumo (público que não usa WhatsApp).
    const cta = document.getElementById('simWhats');
    cta.href = LANG === 'en'
      ? `mailto:${cta.dataset.email || CONTACT_EMAIL}?subject=${encodeURIComponent(T.mailSubject)}&body=${encodeURIComponent(msg)}`
      : `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

    // Resumo curto para o briefing
    const resumo = `${t(tipo, 'nome')}${linhas.length ? ' + ' + linhas.join(', ') : ''} — ${brl.format(total)} (${t(pag, 'nome')})`;
    document.getElementById('simBriefing').href = `${BRIEFING}pacote=${encodeURIComponent(resumo)}`;
    form.dataset.tipo = tipo.id;
    form.dataset.total = total;
  }

  // Eventos do simulador (conversões): clique no WhatsApp/e-mail e no briefing
  document.getElementById('simWhats').addEventListener('click', () => track(LANG === 'en' ? 'quote_email' : 'quote_whatsapp', { tipo: form.dataset.tipo, value: Number(form.dataset.total), currency: CURRENCY }));
  document.getElementById('simBriefing').addEventListener('click', () => track('briefing_click', { origem: 'simulador', tipo: form.dataset.tipo }));

  calcular();
}

/* ---------- 4. Menu mobile e rodapé ---------- */
function initMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;
  const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', T.menuOpen); };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? T.menuClose : T.menuOpen);
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ---------- 5. Formulário de contato (EN) → /api/submit ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('contactStatus');
  const btn = document.getElementById('contactSubmit');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const f = new FormData(form);
    const name = (f.get('name') || '').trim();
    const email = (f.get('email') || '').trim();
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Business: ${(f.get('business') || '').trim() || '-'}`,
      '',
      (f.get('message') || '').trim(),
    ].join('\n');
    btn.disabled = true;
    const label = btn.textContent;
    btn.textContent = 'Sending…';
    status.textContent = '';
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: `Contact (EN) — ${name}`, text, replyTo: email }),
      });
      if (!res.ok) throw new Error('send failed');
      form.reset();
      status.textContent = 'Thanks! Your message is in. I’ll reply within one business day.';
      track('generate_lead', { lead_type: 'contact_form' });
    } catch (err) {
      const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Website inquiry — ' + name)}&body=${encodeURIComponent(text)}`;
      status.innerHTML = `Something went wrong sending the form. <a href="${mailto}">Click here to send it by email instead</a>.`;
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });
}

/* ---------- 6. Eventos de clique (WhatsApp e briefing) ---------- */
function initTracking() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const sec = a.closest('section, header, footer');
    const origem = sec ? (sec.id || sec.className.split(' ')[0]) : 'page';
    if (a.href.includes('wa.me/') && a.id !== 'simWhats') track('whatsapp_click', { origem });
    else if (/(comecar|briefing)\//.test(a.getAttribute('href') || '') && a.id !== 'simBriefing') track('briefing_click', { origem });
    else if (a.classList.contains('project')) track('portfolio_click', { site: a.querySelector('h3')?.textContent });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTracking();
  initContactForm();
  renderPortfolio();
  initSimulador();
  initMenu();
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
});
