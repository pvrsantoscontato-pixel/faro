# Faro — site

Landing page da **Faro** (criação de sites e Google Meu Negócio para pequenos e médios negócios), com simulador de orçamento, portfólio e o questionário de briefing em `/briefing`. Tudo em HTML/CSS/JS puro, sem build — publica direto no Vercel.

## Estrutura

```
index.html            landing page (hero, problema, serviços, portfólio, como funciona, quem faz, simulador, FAQ, clientes, CTA)
styles.css            estilos (paleta: navy #0F1620, off-white #E6E3DD, verde #A6C639, Montserrat) + mockups/visual
script.js             portfólio (lista PROJETOS), simulador (tabela PRECOS), menu mobile
assets/favicon.svg    ícone
assets/portfolio/     prints desktop (1440×900), longos (1440×2600) e mobile (390×844) dos sites do portfólio
assets/logos/         logos dos clientes (faixa "Clientes")
assets/paulo.jpg      foto da seção "Quem faz"
en/index.html         versão em inglês (preços em US$, pagamento via Stripe; script.js lê o <html lang>)
en/briefing/index.html questionário em inglês (mesmo /api/submit)
vercel.json           redirecionamento por país: fora do BR → /en/, no BR → /; ?lang=xx fura a regra
briefing/index.html   questionário de briefing (S01–S09) — envia por e-mail via /api/submit
api/submit.js         função serverless (Vercel) que envia o briefing por e-mail via Resend

Google Analytics 4: propriedade "Faro - Site" (G-F0MR56LW12), tag nas 4 páginas. Eventos enviados por script.js:
whatsapp_click, quote_whatsapp (PT) / quote_email (EN), briefing_click, portfolio_click, generate_lead (briefing e formulário EN).
```

## Editar conteúdo

- **Adicionar um site ao portfólio**: em `script.js`, acrescente um item no array `PROJETOS` (nome, categoria, cidade, descrição, URL e os dois prints em `assets/portfolio/`). As categorias do filtro estão no HTML (`#filters`) — crie um chip novo se precisar de um ramo novo.
- **Mudar preços do simulador**: em `script.js`, edite o objeto `PRECOS` (tipos de site, opcionais, pagamento). O total, a mensagem do WhatsApp e o resumo enviado ao briefing atualizam sozinhos.
- **Copy**: direto no `index.html`, seção por seção (comentários `<!-- ===== ... ===== -->`).
- **WhatsApp**: constante `WHATSAPP` em `script.js` e os links `wa.me` no `index.html`.

## Rodar localmente

```bash
npx -y serve -l 5500 .
```

Abre em http://localhost:5500. O envio do briefing (`/api/submit`) só funciona no Vercel (ou com `vercel dev` + `.env`); localmente o formulário cai no plano B (texto para copiar + `mailto:`).

## Publicar no Vercel

1. Suba a pasta para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. Framework: **Other**.
3. Em **Project Settings → Environment Variables**, adicione:

   | Nome | Valor |
   |---|---|
   | `RESEND_API_KEY` | chave da [Resend](https://resend.com/api-keys) (a mesma do projeto antigo do formulário) |
   | `TO_EMAIL` | `pvrsantos.contato@gmail.com` (opcional — já é o padrão) |
   | `FROM_EMAIL` | `Faro <onboarding@resend.dev>` (opcional — já é o padrão) |

4. Deploy. Depois disso, todo `git push` na `main` publica uma nova versão.
5. Teste: abra `/briefing`, preencha e envie — o e-mail chega com assunto "Briefing de site — [empresa]" e Reply-To no e-mail do cliente.

O projeto antigo `formulario-seusitenoar.vercel.app` pode ser desativado ou redirecionado para `/briefing` do novo domínio.
