// Vercel Serverless Function — recebe o briefing preenchido e envia por e-mail via Resend.
// O e-mail vai com o texto das respostas no corpo (como sempre foi) e, anexado,
// um arquivo .md com as mesmas respostas, nomeado "Briefing - Nome da empresa.md".
// Se o formulário mandar arquivos (logo, etc.), eles vão anexados também.
//
// Variáveis de ambiente esperadas (configure no painel do Vercel, Project Settings > Environment Variables):
//   RESEND_API_KEY  (obrigatória) — sua chave da API em https://resend.com/api-keys
//   TO_EMAIL        (opcional)    — para quem enviar; padrão: pvrsantos.contato@gmail.com
//   FROM_EMAIL      (opcional)    — remetente; padrão: onboarding@resend.dev (funciona sem domínio verificado)

// Limite de anexos. A Vercel corta a requisição acima de 4,5 MB; o formulário já
// segura antes disso, aqui é só a última linha de defesa.
const MAX_ATTACH_BYTES = 4 * 1024 * 1024;

// Nome de arquivo seguro: sem barra, dois-pontos e companhia, e sempre terminando em .md quando for o briefing.
function safeFilename(name, fallback) {
  const clean = String(name || '')
    .replace(/[\\/:*?"<>|\r\n]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
  return clean || fallback;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { subject, text, replyTo, markdown, filename, attachments } = req.body || {};

  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Campo "text" é obrigatório.' });
    return;
  }

  // reply_to é um extra de conveniência (deixa você responder direto pro
  // cliente) — nunca deve derrubar o envio se o cliente digitou algo que
  // não é um e-mail válido no campo. Se não for válido, mandamos sem ele.
  // Aceita "maria@x.com" e também "Maria Souza — maria@x.com": pega o e-mail de dentro do texto.
  const EMAIL_RE = /[^\s<>@,;]+@[^\s<>@,;]+\.[A-Za-z]{2,}/;
  const achado = typeof replyTo === 'string' ? (replyTo.match(EMAIL_RE) || [])[0] : undefined;
  const safeReplyTo = achado ? achado.trim() : undefined;
  if (replyTo && !safeReplyTo) {
    console.warn('replyTo inválido recebido, enviando sem reply_to:', replyTo);
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY não configurada.');
    res.status(500).json({ error: 'Servidor sem RESEND_API_KEY configurada.' });
    return;
  }

  const toEmail = process.env.TO_EMAIL || 'pvrsantos.contato@gmail.com';
  const fromEmail = process.env.FROM_EMAIL || 'Faro <onboarding@resend.dev>';

  // 1) O .md com as respostas — é o anexo principal.
  const files = [];
  let bytes = 0;
  if (markdown && typeof markdown === 'string') {
    const content = Buffer.from(markdown, 'utf8');
    bytes += content.length;
    files.push({
      filename: safeFilename(filename, 'Briefing.md'),
      content: content.toString('base64'),
    });
  }

  // 2) Arquivos enviados pelo cliente no formulário (logo, manual de marca…).
  let ignorados = 0;
  if (Array.isArray(attachments)) {
    for (const a of attachments.slice(0, 20)) {
      if (!a || typeof a.content !== 'string' || !a.content) continue;
      const size = Math.ceil((a.content.length * 3) / 4); // base64 → bytes
      if (bytes + size > MAX_ATTACH_BYTES) {
        ignorados++;
        continue;
      }
      bytes += size;
      files.push({ filename: safeFilename(a.filename, 'anexo'), content: a.content });
    }
  }

  const corpo = ignorados
    ? text + '\n\n[' + ignorados + ' anexo(s) não coube(ram) no e-mail e não foi(ram) enviado(s).]'
    : text;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: subject || 'Novo briefing de site',
        text: corpo,
        reply_to: safeReplyTo,
        attachments: files.length ? files : undefined,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend respondeu com erro:', resendRes.status, errText);
      res.status(502).json({ error: 'Falha ao enviar e-mail.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao chamar a Resend:', err);
    res.status(500).json({ error: 'Erro interno ao enviar e-mail.' });
  }
};
