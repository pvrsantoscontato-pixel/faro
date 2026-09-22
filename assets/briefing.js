/* =========================================================
   Motor dos formulários de briefing (os quatro usam este arquivo).

   O HTML só descreve as perguntas; tudo que é comportamento está aqui:
   progresso, campos que aparecem conforme a resposta, validação,
   montagem do texto do e-mail, montagem do .md e envio para /api/submit.

   Como o HTML marca as coisas:
     <form data-brief data-lang="pt" data-kind="rapido"
           data-title="Briefing rápido" data-file="Briefing">
     <section class="block" data-block="A · Rodapé e dados legais">
     <div class="field" data-label="EMPRESA" data-required> ... </div>
     conditional: <div class="conditional" data-show="preco" data-show-values="sim">
                  e o radio/checkbox que manda: data-flag="sim" (ou o próprio value)
   Um campo pode ter vários inputs: os valores saem juntos, separados por " — ".
   ========================================================= */
(function () {
  'use strict';

  const form = document.querySelector('form[data-brief]');
  if (!form) return;

  const LANG = form.dataset.lang === 'en' ? 'en' : 'pt';
  const TARGET_EMAIL = 'pvrsantos.contato@gmail.com';
  const MAX_TOTAL_BYTES = 3.5 * 1024 * 1024; // limite do corpo da requisição na Vercel (4.5 MB)

  const T = {
    pt: {
      progress: (d, t) => d + ' / ' + t + ' campos preenchidos',
      empty: '— não respondido',
      sent: 'Enviando…',
      missing: 'Faltou responder: ',
      filesTooBig: 'Os arquivos somam mais que o limite do formulário. Tire algum e mande o resto pelo WhatsApp.',
      filesSkipped: '\n\n[Os anexos não couberam no e-mail e não foram enviados.]',
      attached: (n) => n + ' arquivo(s) anexado(s)',
      subjectFallback: 'Briefing de site',
      company: 'cliente',
      sentAt: 'Enviado em',
      pkg: 'Pacote simulado',
      download: 'Baixar o arquivo .md',
      draftSaved: 'rascunho salvo ✓',
    },
    en: {
      progress: (d, t) => d + ' / ' + t + ' fields filled in',
      empty: '— not answered',
      sent: 'Sending…',
      missing: 'Still missing: ',
      filesTooBig: 'Those files are over the form limit. Remove one and send the rest by email.',
      filesSkipped: '\n\n[The attachments did not fit in the email and were not sent.]',
      attached: (n) => n + ' file(s) attached',
      subjectFallback: 'Website brief',
      company: 'client',
      sentAt: 'Sent on',
      pkg: 'Simulated package',
      download: 'Download the .md file',
      draftSaved: 'draft saved ✓',
    },
  }[LANG];

  const $ = (id) => document.getElementById(id);
  const fields = () => Array.from(form.querySelectorAll('.field[data-label]'));
  const visible = (el) => !!el.offsetParent;

  /* ---------- Campos que dependem de outra resposta ---------- */
  function syncConditionals() {
    document.querySelectorAll('.conditional[data-show]').forEach((box) => {
      const name = box.dataset.show;
      const wanted = (box.dataset.showValues || '').split('|').filter(Boolean);
      const checked = Array.from(form.querySelectorAll('input[name="' + name + '"]:checked'));
      const on = checked.some((i) => wanted.length === 0 || wanted.includes(i.dataset.flag || i.value));
      box.classList.toggle('show', on);
    });
  }

  /* ---------- Leitura de um campo ---------- */
  function readField(el) {
    const parts = [];

    // radios e checkboxes marcados (ignora os que estão dentro de um conditional escondido)
    Array.from(el.querySelectorAll('input[type="radio"], input[type="checkbox"]'))
      .filter((i) => i.checked && visible(i.closest('.conditional') || i))
      .forEach((i) => parts.push(i.value));

    // textos, e-mails, telefones, datas e textareas com conteúdo
    Array.from(el.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], input[type="date"], textarea'))
      .filter((i) => i.value.trim() && (!i.closest('.conditional') || i.closest('.conditional').classList.contains('show')))
      .forEach((i) => parts.push(i.value.trim()));

    // arquivos: o nome entra na resposta, o conteúdo vai como anexo
    Array.from(el.querySelectorAll('input[type="file"]')).forEach((i) => {
      Array.from(i.files || []).forEach((f) => parts.push(f.name));
    });

    return parts.join(' — ');
  }

  /* ---------- Progresso ---------- */
  const progressFill = $('progressFill');
  const progressLabel = $('progressLabel');
  const progressRail = $('progressRail');

  function updateProgress() {
    const items = fields().filter(visible);
    let done = 0;
    items.forEach((el) => {
      const ok = readField(el).length > 0;
      el.classList.toggle('answered', ok);
      if (ok) {
        done++;
        el.classList.remove('missing');
      }
    });
    const pct = items.length ? Math.round((done / items.length) * 100) : 0;
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressLabel) progressLabel.textContent = T.progress(done, items.length);
  }

  /* ---------- Rascunho no navegador (formulário longo: dá para fechar e voltar) ----------
     Arquivo anexado não é salvo — o navegador não deixa. */
  const DRAFT_KEY = form.dataset.autosave || '';
  const draftStatus = $('draftStatus');
  let draftTimer = null;
  let enviado = false; // depois do envio nada mais volta a gravar rascunho

  function draftId(input) {
    if (input.type === 'checkbox' || input.type === 'radio') return 'chk:' + input.name + ':' + input.value;
    return input.id ? 'txt:' + input.id : '';
  }

  function saveDraft() {
    if (!DRAFT_KEY || enviado) return;
    const data = {};
    form.querySelectorAll('input, textarea').forEach((i) => {
      const key = draftId(i);
      if (!key || i.type === 'file') return;
      if (i.type === 'checkbox' || i.type === 'radio') { if (i.checked) data[key] = true; }
      else if (i.value.trim()) data[key] = i.value;
    });
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      if (draftStatus) draftStatus.textContent = T.draftSaved;
    } catch (err) { /* navegador sem localStorage: o formulário continua funcionando */ }
  }

  function restoreDraft() {
    if (!DRAFT_KEY) return;
    let data;
    try { data = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}'); } catch (err) { return; }
    if (!data || !Object.keys(data).length) return;
    form.querySelectorAll('input, textarea').forEach((i) => {
      const key = draftId(i);
      if (!key || !(key in data) || i.type === 'file') return;
      if (i.type === 'checkbox' || i.type === 'radio') i.checked = true;
      else i.value = data[key];
    });
    if (draftStatus) draftStatus.textContent = T.draftSaved;
  }

  function clearDraft() {
    enviado = true;
    clearTimeout(draftTimer);
    if (!DRAFT_KEY) return;
    try { localStorage.removeItem(DRAFT_KEY); } catch (err) { /* nada a limpar */ }
  }

  document.addEventListener('input', () => {
    syncConditionals();
    updateProgress();
    clearTimeout(draftTimer);
    draftTimer = setTimeout(saveDraft, 600);
  });
  document.addEventListener('change', () => { syncConditionals(); updateProgress(); checkFileSize(); saveDraft(); });

  /* ---------- Anexos ---------- */
  const fileNote = $('fileNote');

  function allFiles() {
    const out = [];
    form.querySelectorAll('input[type="file"]').forEach((i) => {
      Array.from(i.files || []).forEach((f) => out.push(f));
    });
    return out;
  }

  function checkFileSize() {
    if (!fileNote) return true;
    const files = allFiles();
    const total = files.reduce((s, f) => s + f.size, 0);
    const over = total > MAX_TOTAL_BYTES;
    if (!files.length) {
      fileNote.textContent = '';
      fileNote.classList.remove('over');
    } else {
      fileNote.textContent = over
        ? T.filesTooBig
        : T.attached(files.length) + ' · ' + (total / 1024 / 1024).toFixed(1) + ' MB';
      fileNote.classList.toggle('over', over);
    }
    return !over;
  }

  function readAsBase64(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(',')[1] || '');
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  async function collectAttachments() {
    const files = allFiles();
    const total = files.reduce((s, f) => s + f.size, 0);
    if (!files.length || total > MAX_TOTAL_BYTES) return { list: [], skipped: files.length > 0 };
    const list = [];
    for (const f of files) list.push({ filename: f.name, content: await readAsBase64(f) });
    return { list, skipped: false };
  }

  /* ---------- Montagem das respostas ---------- */
  function groups() {
    const out = [];
    form.querySelectorAll('section.block').forEach((section) => {
      const items = Array.from(section.querySelectorAll('.field[data-label]'))
        .filter((el) => visible(el) || el.dataset.always === 'true')
        .map((el) => [el.dataset.label, readField(el)]);
      if (items.length) out.push({ name: section.dataset.block || '', items: items });
    });
    return out;
  }

  function nowLabel() {
    const d = new Date();
    return d.toLocaleDateString(LANG === 'en' ? 'en-US' : 'pt-BR') + ' ' +
      d.toLocaleTimeString(LANG === 'en' ? 'en-US' : 'pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // Texto puro: é o corpo do e-mail, igual ao que chegava antes.
  function buildText(gs, empresa, pacote) {
    let out = (form.dataset.title || T.subjectFallback).toUpperCase() + ' — ' + empresa.toUpperCase() + '\n';
    out += T.sentAt + ' ' + nowLabel() + '\n';
    if (pacote) out += T.pkg + ': ' + pacote + '\n';
    gs.forEach((g) => {
      out += '\n' + g.name.toUpperCase() + '\n';
      g.items.forEach(([label, value]) => {
        out += '  ' + label + ': ' + (value || T.empty) + '\n';
      });
    });
    return out.trim();
  }

  // Markdown: é o anexo, feito para ser lido e colado no gerador de projetos.
  function buildMarkdown(gs, empresa, pacote) {
    let out = '# ' + (form.dataset.title || T.subjectFallback) + ' — ' + empresa + '\n\n';
    out += '- **' + T.sentAt + ':** ' + nowLabel() + '\n';
    if (pacote) out += '- **' + T.pkg + ':** ' + pacote + '\n';
    gs.forEach((g) => {
      out += '\n## ' + g.name + '\n';
      g.items.forEach(([label, value]) => {
        out += '\n### ' + label + '\n\n' + (value || T.empty) + '\n';
      });
    });
    return out.trim() + '\n';
  }

  function safeName(s) {
    return s.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim().slice(0, 80);
  }

  /* ---------- Validação (feita aqui, e não pelo required do HTML,
       para que campo escondido por conditional nunca trave o envio) ---------- */
  function validate() {
    const faltando = [];
    fields().forEach((el) => {
      const obrigatorio = el.hasAttribute('data-required');
      const ok = !obrigatorio || !visible(el) || readField(el).length > 0;
      el.classList.toggle('missing', !ok);
      if (!ok) faltando.push(el);
    });
    if (faltando.length) {
      const first = faltando[0];
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const focusable = first.querySelector('input, textarea, select');
      if (focusable) setTimeout(() => focusable.focus({ preventScroll: true }), 400);
      const alerta = $('validationError');
      if (alerta) {
        alerta.querySelector('p').textContent = T.missing + faltando.map((f) => f.dataset.label).join(', ');
        alerta.hidden = false;
      }
      return false;
    }
    const alerta = $('validationError');
    if (alerta) alerta.hidden = true;
    return true;
  }

  /* ---------- Pacote simulado vindo do simulador da landing (?pacote=) ---------- */
  const PACOTE = new URLSearchParams(location.search).get('pacote') || '';
  if (PACOTE && $('pacote')) {
    $('pacoteTexto').textContent = PACOTE;
    $('pacote').hidden = false;
  }

  /* ---------- Envio ---------- */
  const submitBtn = $('submitBtn');
  const confirmBox = $('confirmBox');
  const states = ['sendingState', 'successState', 'fallbackState'];

  function showState(id) {
    states.forEach((s) => { const el = $(s); if (el) el.classList.remove('show'); });
    const el = $(id);
    if (el) el.classList.add('show');
  }

  function wireFallback(text, markdown, filename, empresa, subject) {
    const ta = $('summaryText');
    if (ta) ta.value = text;

    const mailBtn = $('mailBtn');
    if (mailBtn) {
      mailBtn.onclick = () => {
        window.location.href = 'mailto:' + TARGET_EMAIL +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(text);
      };
    }

    const dlBtn = $('downloadBtn');
    if (dlBtn) {
      dlBtn.textContent = T.download;
      dlBtn.onclick = () => {
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      };
    }

    const copyBtn = $('copyBtn');
    const copyStatus = $('copyStatus');
    if (copyBtn) {
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch (err) {
          if (ta) { ta.focus(); ta.select(); try { document.execCommand('copy'); } catch (e) { /* fica selecionado para copiar na mão */ } }
        }
        if (copyStatus) {
          copyStatus.classList.add('show');
          setTimeout(() => copyStatus.classList.remove('show'), 2500);
        }
      };
    }
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validate()) return;
    if (!checkFileSize()) {
      const note = $('fileNote');
      if (note) note.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = T.sent;

    const empresa = (form.querySelector('[data-company]') || {}).value || '';
    const nome = (empresa || '').trim() || T.company;
    const gs = groups();
    let text = buildText(gs, nome, PACOTE);
    const markdown = buildMarkdown(gs, nome, PACOTE);
    const filename = safeName((form.dataset.file || 'Briefing') + ' - ' + nome) + '.md';
    const subject = (form.dataset.title || T.subjectFallback) + ' — ' + nome;
    const replyToEl = form.querySelector('[data-replyto]');

    form.hidden = true;
    if (progressRail) progressRail.hidden = true;
    confirmBox.classList.add('show');
    showState('sendingState');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const anexos = await collectAttachments();
    if (anexos.skipped) text += T.filesSkipped;

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject,
          text: text,
          markdown: markdown,
          filename: filename,
          replyTo: replyToEl && replyToEl.value.trim() ? replyToEl.value.trim() : undefined,
          attachments: anexos.list,
        }),
      });
      if (!res.ok) throw new Error('send failed');
      clearDraft();
      showState('successState');
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          lead_type: 'briefing_' + (form.dataset.kind || ''),
          lang: document.documentElement.lang,
        });
      }
    } catch (err) {
      wireFallback(text, markdown, filename, nome, subject);
      showState('fallbackState');
    }
  });

  restoreDraft();
  syncConditionals();
  updateProgress();
})();
