// Vercel Serverless Function — recebe o briefing preenchido e envia por e-mail via Resend.
// Variáveis de ambiente esperadas (configure no painel do Vercel, Project Settings > Environment Variables):
//   RESEND_API_KEY  (obrigatória) — sua chave da API em https://resend.com/api-keys
//   TO_EMAIL        (opcional)    — para quem enviar; padrão: pvrsantos.contato@gmail.com
//   FROM_EMAIL      (opcional)    — remetente; padrão: onboarding@resend.dev (funciona sem domínio verificado)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { subject, text, replyTo } = req.body || {};

  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Campo "text" é obrigatório.' });
    return;
  }

  // reply_to é um extra de conveniência (deixa você responder direto pro
  // cliente) — nunca deve derrubar o envio se o cliente digitou algo que
  // não é um e-mail válido no campo. Se não for válido, mandamos sem ele.
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const safeReplyTo =
    typeof replyTo === 'string' && EMAIL_RE.test(replyTo.trim())
      ? replyTo.trim()
      : undefined;
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
        text,
        reply_to: safeReplyTo,
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
