# Faro — site

Landing page da **Faro** (criação de sites e Google Meu Negócio para pequenos e médios negócios), com simulador de orçamento, portfólio e os dois formulários de briefing (`/briefing` e `/briefing-completo`). Tudo em HTML/CSS/JS puro, sem build — publica direto no Vercel.

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
vercel.json           redirecionamento por país: fora do BR → /en/, no BR → /; ?lang=xx fura a regra

briefing/             briefing rápido (10 perguntas) — público, é o link da landing
briefing-completo/    briefing de produção (44 perguntas) — link enviado por você depois do fechamento
en/briefing/          quick brief (EN)          en/full-brief/  production brief (EN)
assets/briefing.css   estilo dos quatro formulários
assets/briefing.js    motor dos quatro: progresso, campos condicionais, validação, texto + .md, envio
api/submit.js         função serverless (Vercel) que envia o briefing por e-mail via Resend

Google Analytics 4: propriedade "Faro - Site" (G-F0MR56LW12), tag em todas as páginas (landing PT/EN + os 4 briefings). Eventos enviados por script.js:
whatsapp_click, quote_whatsapp (PT) / quote_email (EN), briefing_click, portfolio_click, generate_lead (briefing e formulário EN).
```

## Editar conteúdo

- **Adicionar um site ao portfólio**: em `script.js`, acrescente um item no array `PROJETOS` (nome, categoria, cidade, descrição, URL e os caminhos dos prints em `assets/portfolio/`). Os prints não precisam ser feitos à mão: `npm run prints` gera os três de cada site (precisa de `npm install` antes). As categorias do filtro estão no HTML (`#filters`) — crie um chip novo se precisar de um ramo novo.
- **Prints do portfólio sempre atualizados**: a rotina `.github/workflows/prints-portfolio.yml` roda toda segunda-feira às 6h (Brasília), recaptura os sites listados em `PROJETOS`, e faz commit só se alguma imagem mudou — o Vercel republica sozinho. Para forçar uma atualização: GitHub → aba *Actions* → *Prints do portfólio* → *Run workflow*. Se um site estiver fora do ar naquele dia, o print antigo é mantido.
- **Mudar preços do simulador**: em `script.js`, edite o objeto `PRECOS` (tipos de site, opcionais, pagamento). O total, a mensagem do WhatsApp e o resumo enviado ao briefing atualizam sozinhos.
- **Mexer nas perguntas do briefing**: o HTML só descreve as perguntas. Cada pergunta é um `<div class="field" data-label="RÓTULO">` dentro de uma `<section class="block" data-block="Nome do bloco">`; `data-required` torna obrigatória, e um `<div class="conditional" data-show="nome-do-radio" data-show-values="flag">` só aparece quando aquela resposta é marcada. O rótulo é o que sai no e-mail e no .md. Mudou a pergunta em um idioma, mude no outro.
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
5. Teste: abra `/briefing`, preencha e envie — chega um e-mail com assunto "Briefing rápido — [empresa]", as respostas no corpo, **um anexo `Briefing - [empresa].md`** e Reply-To no e-mail do cliente.

## Os dois briefings

| | Briefing rápido | Briefing de produção |
|---|---|---|
| Onde | `/briefing` — link público na landing | `/briefing-completo` — você manda o link |
| Quando | antes de fechar, para montar a primeira versão do site | junto com a confirmação do pagamento |
| Tamanho | 10 perguntas, menos de 6 minutos | 44 perguntas em 9 blocos, dá para salvar e voltar |
| Anexo no e-mail | `Briefing - [empresa].md` | `Briefing completo - [empresa].md` |

Regra que define onde cada pergunta entra: se dá para descobrir a resposta sozinho (Instagram, Google Maps, site atual), ela não entra no briefing rápido. Em inglês: `/en/briefing` e `/en/full-brief`.

Arquivos: o formulário aceita anexo pequeno (logo, manual de marca) até 3,5 MB no total — acima disso a Vercel corta a requisição, então fotos e vídeos vão por link ou WhatsApp.

O projeto antigo `formulario-seusitenoar.vercel.app` pode ser desativado ou redirecionado para `/briefing` do novo domínio.
