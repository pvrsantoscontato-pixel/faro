# Processo Faro — do briefing ao site no ar

Raciocínio usado para criar o site da Faro (set/2026), organizado para ser repetido em sites de clientes. A ordem importa: **quem → dor → prova → copy → estrutura → visual → código**. Quem começa pelo visual acaba com um site bonito que não vende.

---

## Checklist rápido (cole no início de cada projeto)

- [ ] Briefing preenchido (`/briefing`, S01–S09) + identidade visual + referências + material (fotos, logos, cases)
- [ ] Extração: cliente ideal, dor nas palavras dele, ação prioritária, diferenciais reais, prova disponível, tom
- [ ] Entrevista curta só sobre o que ficou em aberto (rodadas numeradas, com recomendação)
- [ ] Copy seção por seção (hero pela dor, CTA concreto, preço visível, promessa do tamanho da prova)
- [ ] Estrutura da landing definida (quais seções entram e quais saem)
- [ ] Visual com material real (prints, logos, foto do dono) — nada de banco de imagens genérico
- [ ] Build em HTML/CSS/JS puro, dados em arrays, formulário via `api/submit.js`
- [ ] Verificação: 1440px e 390px, simulador/cálculos, links, `POST /api/submit` 200, `og:image` absoluto
- [ ] Deploy Vercel, env vars, nome do projeto, preview do WhatsApp, bio do Instagram

---

## 1. Entradas

| O que | De onde |
|---|---|
| Briefing S01–S09 | formulário `/briefing` (negócio, público, concorrência, objetivo, diferenciais, tom, estrutura, funcionalidades, domínio) |
| Identidade visual | logo, paleta (3–4 cores), tipografia. Se não tiver: escuro + off-white + 1 cor de destaque, Montserrat |
| Referências | 1–2 sites que o cliente admira — usar para **estilo**, nunca para copiar estrutura (a camada que converte é invisível: pesquisa, não layout) |
| Material real | fotos do negócio/dono, logos de clientes, cases, números, depoimentos, sites já feitos |

## 2. Extrair do briefing (antes de qualquer pergunta)

Ler tudo e preencher esta tabela. O que o briefing já responde **não se pergunta de novo**.

| Campo | Onde achar | Exemplo Faro |
|---|---|---|
| Cliente ideal | S02 | empresa sem site ou fora do Google |
| Dor, nas palavras do cliente | S02 "dor que resolve" | "todo dia chega cliente perguntando *você trabalha com isso?*" |
| Ação prioritária | S04 | preencher briefing; 2º: WhatsApp |
| Meta mensurável | S04 "sucesso em 6–12 meses" | 20 solicitações/mês |
| Diferenciais **que ele cumpre** | S05 | 7 dias, copy, preço com parcelamento |
| Prova disponível | S05 + portfólio | 4 sites reais, zero depoimentos |
| Tom | S02 + S06 | formal, premium, direto; confiável / explicativa / tecnológica |
| Frase forte do cliente | qualquer campo | vira candidata a headline |

Regra: **uma frase literal do cliente vale mais que uma frase minha.** "Você trabalha com isso?" virou o H1 porque é exatamente o que o público-alvo ouve todo dia.

## 3. Entrevista (skill `grill-me`) — só o que ficou em aberto

Rodadas numeradas (`Q1`, `Q2`…), cada pergunta com **minha recomendação**. Decisões são do cliente; fatos eu busco sozinho (abrir o site dele, ver os sites do portfólio, checar domínio). Perguntas que costumam sobrar:

1. Nome × tagline × nome da pasta/projeto (não assumir)
2. Uma página com âncoras ou várias páginas
3. O que existe **hoje** vs. aspiração ("agência de serviços tecnológicos" → só entra o que ele entrega)
4. Preço público? Tabela real (tipos, extras, parcelamento, Pix)
5. Processo real, passo a passo, e o que o cliente precisa mandar
6. Para onde vai o formulário (e-mail, WhatsApp, os dois)
7. Prova social: pedir agora, lançar sem, ou depois
8. Identidade: escuro/claro, cor de destaque
9. Domínio e hospedagem
10. Regional ou nacional (promessa nacional, prova regional)

Parar quando não sobrar decisão sem resposta. Registrar tudo numa tabela "Decisões fechadas" antes de escrever copy.

## 4. Copy — princípios aplicados (skill `revenue-centric-design`)

| Princípio | Como aplicar | No site da Faro |
|---|---|---|
| **Teste dos 5 segundos** | abrir pela dor do visitante, não pelo serviço | "Chega de cliente perguntando 'vocês trabalham com isso?' no direct." em vez de "Criamos sites profissionais" |
| **Nível de consciência** | público que sente a dor mas não sabe a solução → hero fala da dor; público que já compara → hero fala do diferencial | dor primeiro; 7 dias e preço como prova logo abaixo |
| **Especificidade** | número, prazo, situação concreta | "no ar em até 7 dias", "a partir de R$ 900", "link na bio que só leva pro WhatsApp" |
| **CTA que responde 3 perguntas** | o que acontece / quanto tempo / quanto custa + gatilho embaixo | "Simular meu orçamento" + "Leva 30 segundos. Sem compromisso." |
| **Preço é filtro** | preço visível corta lead sem orçamento e reduz "quanto custa?" | simulador com total em tempo real |
| **Promessa do tamanho da prova** | só prometer o que dá pra mostrar; nunca inventar depoimento | portfólio real como prova; sem seção de depoimento até existir um |
| **Garantia** | reduz risco de quem nunca contratou | "7 dias, código próprio, revisões até aprovar" |
| **Sem saída** | nenhum link para fora, exceto WhatsApp e portfólio (abre em nova aba) | — |
| **Explicar jargão** | uma frase, onde o termo aparece | "Copy é o texto escrito para levar o visitante a agir." |

Tom: formal sem ser frio, frases curtas, verbo no início, "você"/"seu negócio", zero superlativo vazio ("o melhor", "a melhor solução").

## 5. Estrutura padrão da landing (ordem e função)

| # | Seção | Função | Conteúdo mínimo | Quando omitir |
|---|---|---|---|---|
| 1 | **Hero** (escuro) | dor + promessa + ação | eyebrow (para quem), H1 (dor), sub (o que faz + prazo), CTA primário + gatilho, CTA secundário, faixa de prova (3 números) | nunca |
| 2 | **Problema** (claro) | fazer o visitante se reconhecer | 3 dores concretas + fecho "X resolve os três" + visual da dor (mock) | se o público já sabe que precisa (alta consciência) |
| 3 | **Serviços** | o que vende, sem ambiguidade | 2–3 cards: título, benefício, 3–4 bullets, preço "a partir de", visual | nunca |
| 4 | **Portfólio / prova** (escuro) | mostrar, não dizer | cards com print real, clique abre o site, filtro por ramo | se não houver nada real — nunca usar exemplo fake |
| 5 | **Como funciona** | tirar o medo de quem nunca contratou | 4 passos com prazo e o que o cliente faz | se o serviço for trivial |
| 6 | **Quem faz** | rosto real = confiança | foto, 3 linhas, 4 números, botão de contato direto | se for empresa grande sem rosto |
| 7 | **Preço / simulador** | filtrar e converter | opções com preço, total ao vivo, garantia ao lado, CTA duplo (WhatsApp + formulário) | se o preço for 100% sob consulta (raro; tentar "a partir de") |
| 8 | **FAQ** | matar objeções | 5–6 perguntas que o cliente faz no WhatsApp ("já tenho Instagram, preciso?", "quanto custa?", "quanto tempo?") | nunca |
| 9 | **Clientes / logos** | prova social sem depoimento | logos reais em tiles | se não houver clientes |
| 10 | **CTA final** (escuro) | última chance | pergunta que gera curiosidade + 2 botões + fundo com prints | nunca |
| 11 | **Footer** | contato | logo, tagline, WhatsApp, e-mail | nunca |

Menu: 4 âncoras + botão de WhatsApp. WhatsApp flutuante sempre.

## 6. Visual e credibilidade

- **Material real > banco de imagens.** Prints dos sites do cliente (desktop 1440×900, mobile 390×844, longo 1440×2600 para efeito de rolagem), logos extraídos dos sites dos clientes dele, foto do dono, print do próprio formulário.
- **Mocks em CSS para a dor** (perfil de Instagram com link genérico e directs chegando; busca no Google onde o negócio não aparece; ficha do Google Meu Negócio). Zero imagem externa, carrega instantâneo, e mostra a dor melhor que foto.
- Paleta: blocos escuros e claros alternados, **uma** cor de destaque só para CTA e ênfase. Título das seções ocupando a largura toda; ~72px de respiro entre seções (não 112).
- Notificação/"toast" e badges ("No ar", "Revisão 2 · aprovado") dão vida sem custo.
- Antes de escrever CSS: contraste, posição do CTA (Fitts + padrão F) e confiança (rosto real, prova verificável, oferta coerente) movem mais que qualquer headline.

## 7. Build (HTML/CSS/JS puro)

```
index.html      seções na ordem acima, comentários <!-- ===== SEÇÃO ===== -->
styles.css      tokens em :root, componentes, responsivo no fim
script.js       PROJETOS[] (portfólio), PRECOS{} (simulador), menu; tudo que muda fica em array/objeto
assets/         favicon.svg, og.jpg (1200×630), portfolio/, logos/, foto do dono
comecar/        "Conte sobre o seu negócio", 10 perguntas → fetch('/api/submit')
detalhes/       "Detalhes do seu site", 44 perguntas (enviado depois do fechamento)
api/submit.js   Vercel Function → Resend (env RESEND_API_KEY, TO_EMAIL, FROM_EMAIL)
```

- Simulador: `subtotal = tipo + extras + 150 × páginas`; Pix −10%; cartão ÷ parcelas; mensal em linha separada; botão WhatsApp com `wa.me/55DDDNÚMERO?text=` + resumo; botão briefing com `?pacote=` resumo.
- Prints: Chrome headless via `puppeteer-core` (fechar banner de cookie antes; `isMobile: true` para mobile de verdade). `<img>` de mockup precisa de `height: auto` no CSS, senão o atributo `height` vence o `aspect-ratio`.
- `og:image` **absoluto** (`https://dominio/assets/og.jpg`), 1200×630, com a marca do cliente — senão o WhatsApp pega a primeira imagem da página.
- `.gitignore`: `.agents/`, `.claude/`, `skills-lock.json`, `.env*`. `.vercelignore`: `docs/`.

### Verificação antes de entregar

1. 1440px e 390px: todas as seções, sem rolagem horizontal, menu mobile abre/fecha
2. Simulador: 3 combinações calculadas à mão batem com a tela; mensagem do WhatsApp legível
3. Cada card do portfólio abre o site certo em nova aba
4. `POST /api/submit` no deploy responde `{"ok":true}` e o e-mail chega (marcar "não é spam" na 1ª vez)
5. Console sem erro; sem 404 de asset
6. Preview do link no WhatsApp mostra a imagem da marca

## 8. Entrega e pós-lançamento

1. Commit → GitHub → Vercel (Framework: Other; env `RESEND_API_KEY`)
2. Renomear projeto no Vercel (Settings → Domains) e depois domínio próprio
3. Link na bio do Instagram com título-promessa ("Simule seu site em 30s"), opcionalmente direto em `#orcamento`
4. Pedir 1–2 depoimentos aos clientes existentes → adicionar seção quando existir
5. Revisar copy após 30 dias com base nas perguntas que ainda chegam no WhatsApp: cada pergunta repetida é uma frase que falta no site
