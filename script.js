/* =========================================================
   Faro — script da landing page
   1. PROJETOS  → portfólio (adicionar um site = adicionar um item aqui + 2 prints)
   2. PRECOS    → simulador de orçamento (mudar um valor = mudar aqui)
   3. Menu mobile, ano do rodapé
   ========================================================= */

const WHATSAPP = '5533987395357';

/* ---------- 1. Portfólio ---------- */
const PROJETOS = [
  {
    nome: 'Utimóveis',
    categoria: 'Comércio',
    cidade: '8 lojas em MG',
    descricao: 'Loja de móveis com mais de 30 anos, agora com catálogo e condições de pagamento online.',
    url: 'https://redeutimoveis.com.br/',
    imgDesktop: 'assets/portfolio/utimoveis-desktop.jpg',
    imgLong: 'assets/portfolio/utimoveis-long.jpg',
    imgMobile: 'assets/portfolio/utimoveis-mobile.jpg',
  },
  {
    nome: 'LIR Consultoria',
    categoria: 'Consultoria',
    cidade: 'Belo Horizonte · MG',
    descricao: 'Antecipação de precatórios explicada com clareza para gerar contato.',
    url: 'https://lirconsultoria.com.br/',
    imgDesktop: 'assets/portfolio/lir-desktop.jpg',
    imgLong: 'assets/portfolio/lir-long.jpg',
    imgMobile: 'assets/portfolio/lir-mobile.jpg',
  },
  {
    nome: 'AM Consultoria Ambiental',
    categoria: 'Consultoria',
    cidade: 'Guanhães · MG',
    descricao: 'Meio ambiente, topografia e engenharia em um só lugar.',
    url: 'https://pvrsantoscontato-pixel.github.io/AM-consultoria/',
    imgDesktop: 'assets/portfolio/am-desktop.jpg',
    imgLong: 'assets/portfolio/am-long.jpg',
    imgMobile: 'assets/portfolio/am-mobile.jpg',
  },
  {
    nome: 'Arkad Elétrica',
    categoria: 'Serviços',
    cidade: 'Região de Guanhães · MG',
    descricao: 'Eletricista com site: serviços, segurança e WhatsApp em um clique.',
    url: 'https://arkad-eletrica.vercel.app/',
    imgDesktop: 'assets/portfolio/arkad-desktop.jpg',
    imgLong: 'assets/portfolio/arkad-long.jpg',
    imgMobile: 'assets/portfolio/arkad-mobile.jpg',
  },
];

function renderPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  grid.innerHTML = PROJETOS.map((p) => `
    <a class="project" href="${p.url}" target="_blank" rel="noopener" data-cat="${p.categoria}" aria-label="Abrir o site ${p.nome} em nova aba">
      <div class="mockup">
        <div class="mockup__desktop">
          <div class="mockup__bar"><i></i><i></i><i></i></div>
          <img src="${p.imgLong || p.imgDesktop}" alt="Site ${p.nome} no computador" loading="lazy" width="1440" height="900">
        </div>
        <div class="mockup__mobile">
          <img src="${p.imgMobile}" alt="Site ${p.nome} no celular" loading="lazy" width="390" height="844">
        </div>
      </div>
      <div class="project__body">
        <div>
          <p class="project__meta">${p.categoria} · ${p.cidade}</p>
          <h3>${p.nome}</h3>
          <p>${p.descricao}</p>
        </div>
        <span class="project__open">Abrir site ↗</span>
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
        empty.textContent = 'Ainda não há projetos nesse ramo — o seu pode ser o primeiro.';
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
    { id: 'landing', nome: 'Landing Page', desc: 'Uma página, foco em contato e vendas.', preco: 900, padrao: true },
    { id: 'completo', nome: 'Site completo', desc: 'Até 4 páginas. Para negócios com vários serviços ou institucional.', preco: 1500, tag: 'Mais completo' },
  ],
  extras: [
    { id: 'gmn', nome: 'Google Meu Negócio', desc: 'Apareça no Google e no Maps.', preco: 400, tag: 'Recomendado' },
    { id: 'dominio', nome: 'Configuração de domínio + hospedagem', desc: 'Custo do domínio/hospedagem pago à parte ao provedor.', preco: 200 },
    { id: 'blog', nome: 'Blog', desc: 'Artigos para aparecer em mais buscas.', preco: 300 },
    { id: 'paginas', nome: 'Página adicional', desc: 'R$ 150 por página extra.', preco: 150, quantidade: true, max: 10 },
    { id: 'manutencao', nome: 'Manutenção mensal', desc: 'Até 2 alterações por mês, correções e suporte.', preco: 80, mensal: true },
  ],
  pagamentos: [
    { id: 'pix', nome: 'Pix', desc: '10% de desconto', desconto: 0.10, padrao: true },
    { id: 'cartao', nome: 'Cartão', desc: 'Até 4x sem juros', parcelas: 4 },
  ],
};

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const brlCents = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

function optionHTML({ kind, group, item }) {
  const isRadio = kind === 'radio';
  const priceLabel = item.mensal ? `${brl.format(item.preco)}/mês`
    : item.quantidade ? `${brl.format(item.preco)}/pág.`
    : item.desconto != null || item.parcelas ? ''
    : brl.format(item.preco);
  const stepper = item.quantidade ? `
    <span class="stepper" data-stepper="${item.id}">
      <button type="button" data-step="-1" aria-label="Menos uma página">−</button>
      <output name="${item.id}_qtd" aria-live="polite">0</output>
      <button type="button" data-step="1" aria-label="Mais uma página">+</button>
    </span>` : '';

  return `
    <label class="opt ${isRadio ? 'opt--radio' : ''}">
      <input type="${kind}" name="${group}" value="${item.id}" ${item.padrao ? 'checked' : ''} ${item.quantidade ? 'data-quantidade' : ''}>
      <span class="opt__box" aria-hidden="true"></span>
      <span class="opt__body">
        <span class="opt__title">${item.nome}${item.tag ? ` <span class="tag">${item.tag}</span>` : ''}${priceLabel ? ` <span class="opt__price">${priceLabel}</span>` : ''}</span>
        <span class="opt__desc">${item.desc}</span>
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
    const tipo = PRECOS.tipos.find((t) => t.id === tipoId) || PRECOS.tipos[0];
    const pagId = form.querySelector('input[name="pagamento"]:checked')?.value;
    const pag = PRECOS.pagamentos.find((p) => p.id === pagId) || PRECOS.pagamentos[0];

    const marcados = [...form.querySelectorAll('input[name="extra"]:checked')].map((i) => PRECOS.extras.find((x) => x.id === i.value));
    const unicos = marcados.filter((x) => !x.mensal);
    const mensais = marcados.filter((x) => x.mensal);

    let subtotal = tipo.preco;
    const linhas = [];
    unicos.forEach((x) => {
      const n = x.quantidade ? qtd[x.id] : 1;
      subtotal += x.preco * n;
      linhas.push(x.quantidade ? `${x.nome} (${n})` : x.nome);
    });
    const mensal = mensais.reduce((s, x) => s + x.preco, 0);

    let total = subtotal;
    let detalhe = '';
    if (pag.desconto) {
      total = Math.round(subtotal * (1 - pag.desconto));
      detalhe = `No Pix, com ${Math.round(pag.desconto * 100)}% de desconto (de ${brl.format(subtotal)}).`;
    } else if (pag.parcelas) {
      detalhe = `Ou ${pag.parcelas}x de ${brlCents.format(subtotal / pag.parcelas)} sem juros no cartão.`;
    }

    document.getElementById('simPrefix').textContent = 'Estimativa:';
    document.getElementById('simTotal').textContent = brl.format(total);
    document.getElementById('simDetail').textContent = detalhe;
    const m = document.getElementById('simMonthly');
    m.hidden = mensal === 0;
    m.textContent = mensal ? `+ ${brl.format(mensal)}/mês de manutenção` : '';

    // Mensagem do WhatsApp
    const msg = [
      'Olá! Simulei um orçamento no site da Faro:',
      `• Tipo: ${tipo.nome}`,
      `• Opcionais: ${linhas.length ? linhas.join(', ') : 'nenhum'}`,
      `• Manutenção mensal: ${mensal ? 'sim' : 'não'}`,
      `• Pagamento: ${pag.nome}${pag.desconto ? ' (10% off)' : ' (até 4x)'} — ${brl.format(total)}${mensal ? ` + ${brl.format(mensal)}/mês` : ''}`,
      'Quero receber a proposta.',
    ].join('\n');
    document.getElementById('simWhats').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

    // Resumo curto para o briefing
    const resumo = `${tipo.nome}${linhas.length ? ' + ' + linhas.join(', ') : ''} — ${brl.format(total)} (${pag.nome})`;
    document.getElementById('simBriefing').href = `briefing/?pacote=${encodeURIComponent(resumo)}`;
  }

  calcular();
}

/* ---------- 3. Menu mobile e rodapé ---------- */
function initMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;
  const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu'); };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();
  initSimulador();
  initMenu();
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
});
