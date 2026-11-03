// cópia do clone do Trello (x.appp.to/z/trello) em leticia.land/eu/quadro, 16/10/2026: os dados ficam no banco quadro_leticia_ink.quadros (linha 'principal').
// O terminal escreve aqui com ~/ferramentas.do.claude/quadro/poe.py. Cada cartão é um projeto: link (site) + ícone (favicon ou logo dela no bucket quadro-leticia-ink).
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const svg = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 16 16" fill="none" aria-hidden="true">${IC[n] || ''}</svg>`;
  const uid = () => Math.random().toString(36).slice(2, 9);
  // ícones desenhados iguais aos dos prints dela
  const T = 'stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  Object.assign(IC, {
    'recolher': `<path ${T} d="M1.5 8h4.5M3.8 5.7L6 8 3.8 10.3M14.5 8H10M12.2 5.7L10 8l2.2 2.3"/>`,
    'modelo': `<path ${T} d="M8 2.75H3.75a1 1 0 0 0-1 1v8.5a1 1 0 0 0 1 1h8.5a1 1 0 0 0 1-1V8"/><path ${T} d="M12.25 1.25v4.5M10 3.5h4.5"/>`,
    'diag': `<path ${T} d="M9.5 2.5h4v4M13.5 2.5L9.25 6.75M6.5 13.5h-4v-4M2.5 13.5l4.25-4.25"/>`,
    'feito-verde': `<circle cx="8" cy="8" r="7" fill="#6A9A2A"/><path d="M4.8 8.2l2.1 2.1 4.3-4.4" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    'check-selo': `<rect ${T} x="2.25" y="2.25" width="11.5" height="11.5" rx="1.5"/><path ${T} d="M5.2 8.1l1.9 1.9 3.7-3.8"/>`,
    'onda': `<path ${T} d="M2 6.5v3M4.4 4.5v7M6.8 6v4M9.2 2.5v11M11.6 5v6M14 6.5v3"/>`,
    'refaz': `<path ${T} d="M13 6.5A5 5 0 0 0 4.2 4.3L3 5.5M3 2.5v3h3M3 9.5a5 5 0 0 0 8.8 2.2l1.2-1.2M13 13.5v-3h-3"/>`,
    'tocar': `<path d="M5 3.2v9.6L12.5 8z" fill="currentColor"/>`,
    'colunas': `<path ${T} d="M2.5 3v10M6.2 3v7M9.8 3v10M13.5 3v5"/>`,
  });
  const CORES_ETI = [['#4BCE97', 'verde'], ['#F5CD47', 'amarelo'], ['#FEA362', 'laranja'], ['#F87168', 'vermelho'], ['#9F8FEF', 'roxo'], ['#579DFF', 'azul']];
  const FUNDOS = ['linear-gradient(159deg,#6655C2 0%,#9A67BE 45%,#D879B8 100%)', 'linear-gradient(135deg,#0C66E4,#37B4C3)', 'linear-gradient(135deg,#22A06B,#94C748)', 'linear-gradient(135deg,#E2B203,#F87168)', 'linear-gradient(135deg,#1D2125,#5E4DB2)', 'linear-gradient(135deg,#CD519D,#F87168)'];
  const DIAS = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  // ---------- dados (os do quadro dela, 14/10) ----------
  function inicial() {
    return {
      v: 1,
      cartoes: {},
      caixa: [],
      quadros: [{ id: 'projetos', nome: 'projetos', fundo: 0, estrela: false, vis: 'Área de trabalho', listas: [
        { id: 'l1', nome: 'urgente e importante', cartoes: [] },
        { id: 'l2', nome: 'importante', cartoes: [] },
        { id: 'l3', nome: 'urgente', cartoes: [] },
        { id: 'l4', nome: 'depois', cartoes: [] },
      ] }],
      atual: 'projetos',
      painel: { caixa: false, plan: false, quadro: true },
      faixa: true,
      notif: [],
      consolide: false,
    };
  }
  // ---------- banco (no lugar do localStorage) ----------
  const SB = 'https://gqeipjiidtrcbmnrnknc.supabase.co', AK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZWlwamlpZHRyY2JtbnJua25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNDgyNzIsImV4cCI6MjEwMjcyNDI3Mn0.k1qPBRqSf-6cISubj-gBh1-iOf7WRRLmrTRKcOLiMw4', LINHA = 'principal', BALDE = 'quadro-leticia-ink';
  const HB = { apikey: AK, Authorization: 'Bearer ' + AK, 'Accept-Profile': 'quadro_leticia_ink', 'Content-Profile': 'quadro_leticia_ink', 'Content-Type': 'application/json' };
  let E = inicial();
  let rev = 0, carregado = false, gravado = '', tGrava = null, gravando = false;
  const salva = () => { if (!carregado || JSON.stringify(E) === gravado) return; clearTimeout(tGrava); tGrava = setTimeout(gravaJa, 500); };
  async function gravaJa() {
    if (gravando) { clearTimeout(tGrava); tGrava = setTimeout(gravaJa, 300); return; }
    const j = JSON.stringify(E); if (j === gravado) return;
    gravando = true;
    try {
      const r = await fetch(SB + '/rest/v1/quadros?id=eq.' + LINHA + '&rev=eq.' + rev, { method: 'PATCH', headers: Object.assign({ Prefer: 'return=representation' }, HB), body: JSON.stringify({ dados: E, rev: rev + 1, atualizado: new Date().toISOString() }) });
      if (!r.ok) throw new Error(r.status);
      const l = await r.json();
      if (l.length) { rev = l[0].rev; gravado = j; }
      else { gravando = false; await carrega(); aviso('O quadro mudou em outro lugar: carreguei o que está no banco.'); return; }
    } catch (e) { clearTimeout(tGrava); tGrava = setTimeout(gravaJa, 3000); }
    gravando = false;
  }
  async function carrega() {
    const r = await fetch(SB + '/rest/v1/quadros?id=eq.' + LINHA + '&select=dados,rev', { headers: HB, cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    const l = await r.json();
    if (!l.length) { const n = inicial(); await fetch(SB + '/rest/v1/quadros', { method: 'POST', headers: Object.assign({ Prefer: 'return=minimal' }, HB), body: JSON.stringify({ id: LINHA, dados: n, rev: 1 }) }); E = n; rev = 1; }
    else { E = l[0].dados; rev = l[0].rev; }
    gravado = JSON.stringify(E); carregado = true; render();
  }
  // o que o poe.py escreveu aparece ao voltar para a aba (sem atrapalhar quem está digitando ou arrastando)
  const quieto = () => !modal && !popAberto && !dr && !compondo && !novaLista && !renomeandoLista && !gravando && JSON.stringify(E) === gravado && !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || '');
  async function confere() {
    if (!carregado || !quieto()) return;
    try { const r = await fetch(SB + '/rest/v1/quadros?id=eq.' + LINHA + '&select=rev', { headers: HB, cache: 'no-store' }); const l = await r.json(); if (l[0] && l[0].rev !== rev && quieto()) await carrega(); } catch (e) {}
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') confere(); else if (carregado && JSON.stringify(E) !== gravado) gravaJa(); });
  addEventListener('focus', confere);
  // ícone do projeto: o logo dela; sem logo, o ícone grande do site (apple-touch-icon), e se não houver, o favicon em 256px
  const host = (u) => { try { return new URL(u).hostname } catch (e) { return '' } };
  const icone = (c, cls) => {
    const h = c.site ? host(c.site) : '';
    if (!c.logo && !h) return '';
    const g = 'https://www.google.com/s2/favicons?domain=' + h + '&sz=256';
    const img = c.logo ? `<img src="${esc(c.logo)}" alt="" draggable="false">` : `<img src="https://${h}/apple-touch-icon.png" alt="" draggable="false" onerror="this.onerror=null;this.src='${g}'">`;
    return c.site ? `<a class="${cls}" href="${esc(c.site)}" target="_blank" rel="noopener" data-acao="link">${img}</a>` : `<span class="${cls}">${img}</span>`;
  };
  const arrumaLink = (u) => { u = u.trim(); return !u ? '' : /^[a-z]+:\/\//i.test(u) ? u : 'https://' + u; };
  async function sobeLogo(id, f) {
    if (!f || !/^image\//.test(f.type)) { aviso('Isso não é uma imagem.'); return; }
    aviso('Enviando o logo…');
    const ext = ((f.name || '').match(/\.[a-z0-9]+$/i) || ['.png'])[0].toLowerCase();
    const nome = id + '-' + Date.now() + ext;
    try {
      const r = await fetch(SB + '/storage/v1/object/' + BALDE + '/' + nome, { method: 'POST', headers: { apikey: AK, Authorization: 'Bearer ' + AK, 'Content-Type': f.type }, body: f });
      if (!r.ok) throw new Error(r.status);
    } catch (e) { aviso('Não consegui enviar o logo.'); return; }
    const c = C(id); if (!c) return;
    c.logo = SB + '/storage/v1/object/public/' + BALDE + '/' + nome;
    render(); if (aberto === id) desenhaCartao(); aviso('Logo posto no cartão.');
  }
  const Q = () => E.quadros.find((q) => q.id === E.atual) || E.quadros[0];
  const C = (id) => E.cartoes[id];
  const ondeEsta = (id) => {
    if (E.caixa.includes(id)) return { lista: null, arr: E.caixa, nome: 'Caixa de entrada' };
    for (const q of E.quadros) for (const l of q.listas) if (l.cartoes.includes(id)) return { lista: l, arr: l.cartoes, nome: l.nome, quadro: q };
    return null;
  };
  let filtro = '';
  let busca = '';

  // ---------- desenho ----------
  const app = $('#app');
  function render() {
    const p = E.painel;
    const so = p.quadro && !p.caixa && !p.plan ? 'so-quadro' : (!p.quadro && p.plan && !p.caixa ? 'so-planejador' : '');
    document.body.className = so;
    const q = Q();
    app.innerHTML = `
      ${topo()}
      <div class="area"><div class="paineis">
        ${p.caixa ? painelCaixa() : ''}
        ${p.plan ? painelPlan(!p.quadro && !p.caixa) : ''}
        ${p.quadro ? painelQuadro(q) : ''}
      </div></div>
      ${nav()}`;
    const pq = $('.p-quadro'); if (pq) pq.style.background = FUNDOS[q.fundo] || FUNDOS[0];
    if (so === 'so-quadro') $('.topo').style.background = q.fundo ? 'rgba(0,0,0,.35)' : '#443794';
    if (so === 'so-quadro') document.body.style.background = FUNDOS[q.fundo] || FUNDOS[0]; else document.body.style.background = '#fff';
    salva();
  }

  function topo() {
    return `<header class="topo">
      <button class="tb" data-pop="apps" aria-label="Alternar aplicativos">${svg('app-switcher')}</button>
      <a class="marca" href="#" data-acao="inicio"><span class="m"><b></b></span>Trello</a>
      <label class="busca">${svg('search')}<input id="busca" placeholder="Pesquisar" value="${esc(busca)}" autocomplete="off"></label>
      <button class="criar" data-pop="criar">${svg('ai-sparkle')}<span>Criar</span></button>
      <div class="direita">
        <button class="teste" data-pop="teste">${svg('ai-sparkle')}14 dias restantes</button>
        <button class="tb" data-pop="novidades" aria-label="Novidades">${svg('megaphone')}</button>
        <button class="tb" data-pop="notif" aria-label="Notificações">${svg('notification')}</button>
        <button class="tb" data-pop="ajuda" aria-label="Ajuda">${svg('question-circle')}</button>
        <button class="tb av-b" data-pop="conta" aria-label="Conta"><span class="av">LP</span></button>
      </div>
    </header>`;
  }

  function nav() {
    const p = E.painel;
    const temNovo = E.caixa.some((id) => C(id)?.novo);
    return `<div class="nav"><div class="nav-in">
      <button class="nv ${p.caixa ? 'on' : ''}" data-acao="painel" data-p="caixa">${svg('inbox')}${temNovo && !p.caixa ? '<i class="bolinha"></i>' : ''}Caixa de entrada</button>
      <button class="nv ${p.plan ? 'on' : ''}" data-acao="painel" data-p="plan">${svg('calendar')}Planejador</button>
      <button class="nv ${p.quadro ? 'on' : ''}" data-acao="painel" data-p="quadro">${svg('board')}Quadro</button>
      <span class="sep"></span>
      <button class="nv" data-acao="mudar">${svg('boards')}Mudar de quadros</button>
    </div>${p.caixa || p.plan ? `<button class="voz" data-acao="voz" aria-label="Capturar com a voz">${svg('onda')}</button>` : ''}</div>`;
  }

  function cartaoHTML(id, onde) {
    const c = C(id); if (!c) return '';
    if (filtro && !c.nome.toLowerCase().includes(filtro)) return '';
    if (c.link) return `<div class="cartao link" data-id="${id}" data-onde="${onde}">
      ${c.capa ? `<img class="capa" src="${c.capa}" alt="" draggable="false">` : ''}
      <div class="corpo"><div class="lk"><span class="loom">✳</span><a href="${esc(c.link)}" target="_blank" rel="noopener" data-acao="link">${esc(c.nome)}</a></div>
      <div class="fonte"><span class="loom">✳</span>${esc(c.fonte || '')}<button class="exp" data-acao="abrir" data-id="${id}" aria-label="Abrir">${svg('diag')}</button></div></div></div>`;
    const feitas = c.check.filter((x) => x.f).length;
    const selos = [];
    if (c.visto) selos.push(`<span class="selo" title="Você está seguindo este cartão">${svg('eye-open')}</span>`);
    if (c.data) { const d = new Date(c.data + 'T12:00'); const atrasado = !c.feito && d < new Date(new Date().toDateString()); selos.push(`<span class="selo ${c.feito ? 'verde' : atrasado ? 'vermelho' : ''}">${svg('clock')}${d.getDate()} de ${MESES[d.getMonth()].slice(0, 3)}.</span>`); }
    if (c.desc) selos.push(`<span class="selo" title="Este cartão tem uma descrição.">${svg('align-text-left')}</span>`);
    if (c.coments.length) selos.push(`<span class="selo">${svg('comment')}${c.coments.length}</span>`);
    if (c.anexos.length) selos.push(`<span class="selo">${svg('attachment')}${c.anexos.length}</span>`);
    if (c.check.length) selos.push(`<span class="selo ${feitas === c.check.length ? 'verde' : ''}">${svg('check-selo')}${feitas}/${c.check.length}</span>`);
    if (c.email) selos.push(`<span class="selo">${svg('email')}</span>`);
    const membros = c.membros.map((m) => `<span class="av">${m}</span>`).join('');
    return `<div class="cartao ${c.feito ? 'feito' : ''}" data-id="${id}" data-onde="${onde}">
      ${c.novo ? '<i class="ponto"></i>' : ''}
      ${c.capa ? `<img class="capa" src="${c.capa}" alt="" draggable="false">` : ''}
      <div class="corpo">
        ${icone(c, 'app-ic')}
        ${c.eti.length ? `<div class="eti">${c.eti.map((e) => `<i style="background:${e}"></i>`).join('')}</div>` : ''}
        <div class="nome">${c.feito ? `<span class="ok" data-acao="feito" data-id="${id}" title="Marcar como não concluído">${svg('feito-verde', 'ok')}</span>` : `<span class="circ" data-acao="feito" data-id="${id}" title="Marcar como concluído">${svg('check-circle-unchecked')}</span>`}<span>${esc(c.nome)}</span></div>
        ${selos.length || membros ? `<div class="selos">${selos.join('')}${membros}</div>` : ''}
      </div>
      <button class="lapis" data-acao="abrir" data-id="${id}" aria-label="Editar cartão">${svg('edit')}</button>
    </div>`;
  }

  function painelCaixa() {
    return `<section class="painel p-caixa">
      <div class="cx-topo"><div class="cx-titulo">${svg('inbox')}Caixa de entrada</div>
        <button class="tb" data-pop="cx-filtro" aria-label="Filtrar">${svg('filter')}</button>
        <button class="tb" data-pop="cx-menu" aria-label="Mais">${svg('show-more-horizontal')}</button></div>
      <form class="cx-add" data-form="caixa"><input name="t" placeholder="Adicionar um cartão" autocomplete="off"></form>
      <div class="cx-lista" data-alvo="caixa">${E.caixa.map((id) => cartaoHTML(id, 'caixa')).join('')}</div>
      <button class="consolide ${E.consolide ? 'aberto' : ''}" data-acao="consolide">${E.consolide
        ? `<b style="font-size:14px;color:#292A2E;text-align:left">Consolide suas tarefas</b><span style="text-align:left;font-size:13px;line-height:18px">Encaminhe e-mails, mensagens do Slack e do Teams e páginas do Chrome para a sua Caixa de entrada.</span><span style="display:flex;gap:8px"><img src="f/consolide.png" alt="" style="width:60px;height:40px"></span><span style="text-align:left;color:#1868DB;font-weight:500;font-size:13px">Mostrar menos ⌃</span>`
        : `<img src="f/consolide.png" alt=""><span>Consolide suas tarefas</span>${svg('chevron-up')}`}</button>
    </section>`;
  }

  function painelPlan(largo) {
    const hoje = new Date();
    const datas = [];
    for (let i = 0; i < 21; i++) { const d = new Date(hoje); d.setDate(hoje.getDate() + i); datas.push(d); }
    const ymd = (d) => d.toISOString().slice(0, 10);
    const todos = Object.values(E.cartoes);
    const dia = (d, i) => {
      const ks = todos.filter((c) => c.data === ymd(new Date(d.getTime() - d.getTimezoneOffset() * 6e4)));
      const t = i === 0 ? `<b>Hoje</b>${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}` : i === 1 ? `<b>Amanhã</b>${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}` : `<b>${DIAS[d.getDay()]}</b>${d.getDate()} de ${MESES[d.getMonth()]}`;
      const iso = ymd(new Date(d.getTime() - d.getTimezoneOffset() * 6e4));
      return `<div class="dia"><h4>${t}</h4><div class="cartoes" data-alvo="dia" data-dia="${iso}">${ks.map((c) => cartaoHTML(c.id, 'dia')).join('')}</div>${ks.length ? '' : `<p>${i === 0 ? 'Nada planejado para hoje' : 'Nada planejado'}</p>`}</div>`;
    };
    return `<section class="painel p-plan ${largo ? 'largo' : ''}">
      <div class="pl-topo">
        <button class="bt mes" data-pop="pl-mes">${svg('calendar')}${MESES[hoje.getMonth()].slice(0, 3)}. ${svg('chevron-down')}</button>
        <button class="bt q" data-acao="pl-ant" aria-label="Anterior">${svg('chevron-left')}</button>
        <button class="bt" data-acao="pl-hoje">Hoje</button>
        <button class="bt q" data-acao="pl-prox" aria-label="Próximo">${svg('chevron-right')}</button>
        <span class="pl-esp"></span>
        <button class="bt" data-pop="pl-modo">${svg('list-bulleted')}${largo ? 'Agenda ' : ''}${svg('chevron-down')}</button>
        <button class="bt q" data-pop="pl-menu" aria-label="Mais">${svg('show-more-horizontal')}</button>
      </div>
      <div class="pl-corpo">
        ${E.faixa ? `<div class="faixa"><i class="risco a"></i><i class="risco b"></i><img class="ilu" src="f/banner.png" alt="">
          <div style="position:relative"><h3>Conecte sua conta de calendário</h3><p>Veja todos os seus eventos. Arraste, solte e pronto. Programe suas tarefas no calendário e reserve tempo para o que realmente importa.</p></div>
          <button class="conectar" data-pop="conectar">${svg('refaz')}Conectar uma conta</button>
          <button class="tb fechar" data-acao="fecha-faixa" aria-label="Fechar">${svg('cross')}</button></div>` : ''}
        ${datas.map(dia).join('')}
      </div>
    </section>`;
  }

  function painelQuadro(q) {
    return `<section class="painel p-quadro">
      <div class="q-topo">
        <h1 class="q-nome" data-acao="renomear-q" style="margin:0">${esc(q.nome)}</h1>
        <button class="qb sempre" data-pop="vis" aria-label="Visualizações">${svg('colunas')}${svg('chevron-down')}</button>
        <span class="q-esp"></span>
        <span class="av-q"><span class="av">LP</span><small>${svg('person')}</small></span>
        <button class="qb" data-pop="powerups" aria-label="Power-Ups">${svg('power-plug')}</button>
        <button class="qb" data-pop="automacao" aria-label="Automação">${svg('automation')}</button>
        <button class="qb ${filtro ? 'on' : ''}" data-pop="filtro" aria-label="Filtrar cartões">${svg('filter')}</button>
        <button class="qb" data-acao="estrela" aria-label="Favoritar">${q.estrela ? `<span class="star-on">${svg('star-starred')}</span>` : svg('star-unstarred')}</button>
        <button class="qb" data-pop="visibilidade" aria-label="Visibilidade">${svg(q.vis === 'Público' ? 'globe' : 'lock-locked')}</button>
        <button class="compartilhar" data-acao="compartilhar">${svg('person-add')}<span>Compartilhar</span></button>
        <button class="qb sempre" data-acao="menu-q" aria-label="Mostrar Menu">${svg('show-more-horizontal')}</button>
      </div>
      <div class="listas" data-alvo="listas">
        ${q.listas.map((l) => listaHTML(l)).join('')}
        ${novaLista ? `<form class="nova-lista" data-form="lista"><input name="t" placeholder="Insira o nome da lista…" autocomplete="off"><div class="compositor" style="padding:0"><div class="linha"><button class="azul">Adicionar lista</button><button type="button" class="x" data-acao="fecha-lista" aria-label="Cancelar">${svg('cross')}</button></div></div></form>`
          : `<button class="add-lista" data-acao="nova-lista">${svg('add')}Adicionar outra lista</button>`}
        <span style="flex:none;width:8px"></span>
      </div>
    </section>`;
  }
  let novaLista = false;
  let compondo = null; // id da lista com o compositor aberto
  let renomeandoLista = null;

  function listaHTML(l) {
    if (l.recolhida) return `<div class="lw" data-lista="${l.id}"><div class="lista recolhida" data-acao="expandir" data-l="${l.id}" title="Expandir lista"><button class="lb" aria-label="Expandir">${svg('expand-horizontal')}</button><div class="rec">${esc(l.nome)} <em>${l.cartoes.length}</em></div></div></div>`;
    return `<div class="lw" data-lista="${l.id}"><div class="lista">
      <div class="l-topo" data-arrasta-lista="${l.id}">
        ${renomeandoLista === l.id ? `<textarea class="l-nome-input" data-ren-lista="${l.id}" rows="1">${esc(l.nome)}</textarea>` : `<h2 class="l-nome" data-acao="ren-lista" data-l="${l.id}" style="margin:0">${esc(l.nome)}</h2>`}
        <span class="l-conta">${l.cartoes.length}</span>
        <button class="lb" data-acao="recolher" data-l="${l.id}" aria-label="Recolher lista">${svg('recolher')}</button>
        <button class="lb" data-pop="lista-menu" data-l="${l.id}" aria-label="Ações da lista">${svg('show-more-horizontal')}</button>
      </div>
      <div class="l-cartoes" data-alvo="lista" data-l="${l.id}">${l.cartoes.map((id) => cartaoHTML(id, l.id)).join('')}</div>
      ${compondo === l.id ? `<form class="compositor" data-form="cartao" data-l="${l.id}"><textarea name="t" placeholder="Insira um título ou cole um link"></textarea><div class="linha"><button class="azul">Adicionar cartão</button><button type="button" class="x" data-acao="fecha-comp" aria-label="Cancelar">${svg('cross')}</button></div></form>`
        : `<div class="l-pe"><button class="add-cartao" data-acao="compor" data-l="${l.id}">${svg('add')}Adicionar um cartão</button><button class="modelo" data-pop="modelo" data-l="${l.id}" aria-label="Criar a partir de um modelo">${svg('modelo')}</button></div>`}
    </div></div>`;
  }

  // ---------- janelinhas (popovers) ----------
  let popAberto = null;
  function fechaPop() { if (popAberto) { popAberto.remove(); popAberto = null; } }
  function abrePop(chave, alvo, extra = {}) {
    const ja = popAberto && popAberto.dataset.chave === chave && popAberto.dataset.de === (alvo.dataset.l || alvo.dataset.id || '');
    fechaPop(); if (ja) return;
    const html = POPS[chave] ? POPS[chave](alvo, extra) : null; if (html == null) return;
    const el = document.createElement('div'); el.className = 'pop'; el.dataset.chave = chave; el.dataset.de = alvo.dataset.l || alvo.dataset.id || '';
    el.innerHTML = html; document.body.appendChild(el); popAberto = el;
    const r = alvo.getBoundingClientRect(); const w = el.offsetWidth; const h = el.offsetHeight;
    let left = Math.min(r.left, innerWidth - w - 8); left = Math.max(8, left);
    let top = r.bottom + 6; if (top + h > innerHeight - 8) top = Math.max(8, r.top - h - 6);
    el.style.left = left + 'px'; el.style.top = top + 'px';
    const f = el.querySelector('input,textarea'); if (f) setTimeout(() => f.focus(), 0);
  }
  const topoPop = (t) => `<div class="pop-topo"><h5>${t}</h5><button class="x" data-acao="fecha-pop" aria-label="Fechar">${svg('cross')}</button></div>`;
  const item = (acao, rot, sub = '', ic = '', extra = '') => `<button class="item" data-acao="${acao}" ${extra}>${ic ? svg(ic) : ''}<span>${rot}${sub ? `<small>${sub}</small>` : ''}</span></button>`;

  const POPS = {
    apps: () => topoPop('Mais da Atlassian') + item('aviso', 'Trello', 'Gerencie tarefas e projetos', 'board', 'data-m="Você já está no Trello."') + item('ext', 'Jira', 'Planeje e acompanhe projetos', 'dashboard', 'data-url="https://www.atlassian.com/software/jira"') + item('ext', 'Confluence', 'Documentos em equipe', 'text', 'data-url="https://www.atlassian.com/software/confluence"') + item('ext', 'Loom', 'Vídeos rápidos', 'image', 'data-url="https://www.loom.com"'),
    criar: () => item('criar-quadro', 'Criar quadro', 'Um quadro é feito de cartões organizados em listas.', 'board') + item('criar-modelo', 'Começar com um modelo', 'Comece mais rápido com um modelo de quadro.', 'copy') + item('criar-ws', 'Criar Área de trabalho', 'Uma Área de trabalho é um grupo de quadros e pessoas.', 'people-group'),
    teste: () => topoPop('Teste do Premium') + `<p style="margin:0 0 12px;color:#505258">Restam 14 dias do seu teste gratuito do Trello Premium. Aproveite visualizações, automação e muito mais.</p>` + item('aviso', 'Ver planos', '', 'arrow-right', 'data-m="Os planos abririam aqui."'),
    novidades: () => topoPop('Novidades') + `<div style="padding:4px 4px 8px"><b>Caixa de entrada e Planejador</b><p style="margin:6px 0 0;color:#505258">Capture tarefas de qualquer lugar e planeje seu dia num só lugar.</p></div>`,
    notif: () => topoPop('Notificações') + `<label class="item" style="justify-content:space-between"><span>Mostrar apenas não lidas</span><input type="checkbox" data-acao="so-nao-lidas"></label><hr>` + E.notif.map((n, i) => `<button class="item" data-acao="lida" data-i="${i}" style="${n.lida ? 'opacity:.6' : ''}"><span class="av">LP</span><span>${esc(n.t)}<small>${n.quando}${n.lida ? '' : ' · não lida'}</small></span></button>`).join('') + `<hr><button class="item" data-acao="todas-lidas">Marcar todas como lidas</button>`,
    ajuda: () => topoPop('Ajuda') + item('ext', 'Central de ajuda', '', 'question-circle', 'data-url="https://support.atlassian.com/trello/"') + item('ext', 'Atalhos do teclado', '', 'list-bulleted', 'data-url="https://trello.com/shortcuts"') + item('ext', 'Guia do Trello', '', 'board', 'data-url="https://trello.com/guide"'),
    conta: () => `<div style="padding:8px 12px 4px;font-size:11px;font-weight:700;color:#505258;letter-spacing:.04em">CONTA</div><div class="item" style="cursor:default"><span class="av" style="width:40px;height:40px;font-size:14px">LP</span><span>Letícia Piccolo<small>le@lle.sh</small></span></div>` + item('aviso', 'Mudar de conta', '', '', 'data-m="Só há esta conta aqui."') + item('aviso', 'Gerenciar conta', '', 'settings', 'data-m="Gerenciar conta abriria aqui."') + '<hr>' + item('aviso', 'Perfil e visibilidade', '', 'person', 'data-m="Perfil abriria aqui."') + item('aviso', 'Atividade', '', 'clock', 'data-m="Atividade abriria aqui."') + item('aviso', 'Configurações', '', 'settings', 'data-m="Configurações abririam aqui."') + '<hr>' + item('recomecar', 'Recomeçar o quadro de exemplo', 'Volta tudo ao início', 'delete'),
    vis: () => topoPop('Visualizações') + item('fecha-pop', 'Quadro', '', 'board') + item('aviso', 'Tabela', '', 'list-bulleted', 'data-m="A visualização Tabela faz parte do Premium."') + item('aviso', 'Calendário', '', 'calendar', 'data-m="A visualização Calendário faz parte do Premium."') + item('aviso', 'Painel', '', 'dashboard', 'data-m="A visualização Painel faz parte do Premium."'),
    powerups: () => topoPop('Power-Ups') + `<p style="margin:0 0 8px;color:#505258">Adicione recursos ao seu quadro.</p>` + item('aviso', 'Calendário', '', 'calendar', 'data-m="Power-Up adicionado."') + item('aviso', 'Campos personalizados', '', 'list-checklist', 'data-m="Power-Up adicionado."'),
    automacao: () => topoPop('Automação') + item('aviso', 'Regras', 'Quando algo acontece, faça algo', 'automation', 'data-m="As regras abririam aqui."') + item('aviso', 'Botões', '', 'automation', 'data-m="Os botões abririam aqui."'),
    filtro: () => topoPop('Filtrar') + `<div class="rot">Palavra-chave</div><input type="text" id="f-in" placeholder="Insira uma palavra-chave…" value="${esc(filtro)}"><p style="margin:6px 0 8px;font-size:12px;color:#6B6E76">Pesquisa cartões, membros, etiquetas e mais.</p>` + item('limpa-filtro', 'Limpar filtro', '', 'cross'),
    visibilidade: () => topoPop('Alterar visibilidade') + ['Privado', 'Área de trabalho', 'Público'].map((v) => item('vis-q', v + (Q().vis === v ? ' ✓' : ''), v === 'Privado' ? 'Só membros do quadro podem ver.' : v === 'Público' ? 'Qualquer pessoa na internet pode ver.' : 'Todos da Área de trabalho podem ver.', v === 'Público' ? 'globe' : 'lock-locked', `data-v="${v}"`)).join(''),
    'lista-menu': (a) => topoPop('Ações da lista') + item('compor', 'Adicionar cartão', '', '', `data-l="${a.dataset.l}"`) + item('copiar-lista', 'Copiar lista', '', '', `data-l="${a.dataset.l}"`) + item('pop-mover-lista', 'Mover lista', '', '', `data-l="${a.dataset.l}"`) + item('seguir-lista', 'Seguir', '', '', `data-l="${a.dataset.l}"`) + '<hr>' + item('ordenar', 'Ordenar por nome', '', '', `data-l="${a.dataset.l}"`) + '<hr>' + item('arquivar-cartoes', 'Arquivar todos os cartões nesta lista', '', '', `data-l="${a.dataset.l}"`) + item('arquivar-lista', 'Arquivar esta lista', '', '', `data-l="${a.dataset.l}"`),
    'mover-lista': (a) => topoPop('Mover lista') + Q().listas.map((l, i) => item('mover-lista', `Posição ${i + 1}`, l.nome, '', `data-l="${a.dataset.l}" data-i="${i}"`)).join(''),
    modelo: (a) => topoPop('Modelos de cartão') + `<p style="margin:0 0 8px;color:#505258">Você ainda não tem modelos. Crie um para copiar cartões rapidamente.</p>` + item('criar-modelo-cartao', 'Criar um novo modelo', '', 'add', `data-l="${a.dataset.l}"`),
    'cx-filtro': () => topoPop('Filtrar Caixa de entrada') + item('aviso', 'Só e-mails', '', 'email', 'data-m="Mostrando todos: só há um e-mail."') + item('aviso', 'Todos', '', 'inbox', 'data-m="Mostrando tudo."'),
    'cx-menu': () => topoPop('Caixa de entrada') + item('aviso', 'Encaminhar e-mails para o Trello', 'Seu endereço: le+caixa@inbox.trello.com', 'email', 'data-m="Copie o endereço e encaminhe e-mails."') + item('limpar-caixa', 'Arquivar todos os cartões', '', 'archive-box'),
    'pl-mes': () => topoPop('Mês') + MESES.map((m, i) => item('aviso', m, '', '', `data-m="Mostrando ${m}."`)).join(''),
    'pl-modo': () => topoPop('Visualização') + item('fecha-pop', 'Agenda ✓', '', 'list-bulleted') + item('aviso', 'Dia', '', 'calendar', 'data-m="Visualização por dia."') + item('aviso', 'Semana', '', 'calendar', 'data-m="Visualização por semana."'),
    'pl-menu': () => topoPop('Planejador') + item('reabre-faixa', 'Conectar calendário', '', 'calendar') + item('aviso', 'Configurações do Planejador', '', 'settings', 'data-m="Configurações abririam aqui."'),
    conectar: () => topoPop('Conectar uma conta') + item('ext', 'Google Agenda', '', 'calendar', 'data-url="https://calendar.google.com"') + item('ext', 'Outlook', '', 'calendar', 'data-url="https://outlook.live.com/calendar"'),
    'cm-lista': (a) => topoPop('Mover cartão') + `<div class="rot">Quadro</div><div style="margin-bottom:8px">${esc(Q().nome)}</div><div class="rot">Lista</div>` + `<button class="item" data-acao="mover-cartao" data-id="${a.dataset.id}" data-para="caixa">Caixa de entrada</button>` + Q().listas.map((l) => `<button class="item" data-acao="mover-cartao" data-id="${a.dataset.id}" data-para="${l.id}">${esc(l.nome)}</button>`).join(''),
    'cm-eti': (a) => { const c = C(a.dataset.id); return topoPop('Etiquetas') + `<div class="etis">${CORES_ETI.map(([cor, n]) => `<label><input type="checkbox" data-acao="eti" data-id="${c.id}" data-cor="${cor}" ${c.eti.includes(cor) ? 'checked' : ''}><i style="background:${cor}" title="${n}"></i></label>`).join('')}</div>`; },
    'cm-data': (a) => { const c = C(a.dataset.id); return topoPop('Datas') + `<div class="rot">Data de entrega</div><input type="date" data-data="${c.id}" value="${c.data || ''}"><div style="display:flex;gap:8px;margin-top:12px"><button class="azul" data-acao="fecha-pop">Salvar</button><button class="bt" data-acao="tira-data" data-id="${c.id}">Remover</button></div>`; },
    'cm-membros': (a) => { const c = C(a.dataset.id); return topoPop('Membros') + `<button class="item" data-acao="membro" data-id="${c.id}"><span class="av">LP</span><span>Letícia Piccolo${c.membros.includes('LP') ? ' ✓' : ''}</span></button>`; },
    'cm-add': (a) => topoPop('Adicionar ao cartão') + item('pop-cm-eti', 'Etiquetas', 'Organize, categorize e priorize', 'tag', `data-id="${a.dataset.id}"`) + item('pop-cm-data', 'Datas', 'Datas de início e entrega', 'clock', `data-id="${a.dataset.id}"`) + item('add-check', 'Checklist', 'Adicione subtarefas', 'list-checklist', `data-id="${a.dataset.id}"`) + item('pop-cm-membros', 'Membros', 'Atribua membros', 'person', `data-id="${a.dataset.id}"`) + item('add-anexo', 'Anexo', 'Adicione links e imagens', 'attachment', `data-id="${a.dataset.id}"`),
    'cm-mais': (a) => topoPop('Ações') + item('cm-seguir', C(a.dataset.id).visto ? 'Deixar de seguir' : 'Seguir', '', 'eye-open', `data-id="${a.dataset.id}"`) + item('copiar-cartao', 'Copiar', '', 'copy', `data-id="${a.dataset.id}"`) + item('pop-cm-lista', 'Mover', '', 'arrow-right', `data-id="${a.dataset.id}"`) + '<hr>' + item('arquivar-cartao', 'Arquivar', '', 'archive-box', `data-id="${a.dataset.id}"`),
    busca: () => {
      const t = busca.toLowerCase();
      const ach = Object.values(E.cartoes).filter((c) => c.nome.toLowerCase().includes(t)).slice(0, 8);
      const qs = E.quadros.filter((q) => q.nome.toLowerCase().includes(t));
      return `<div class="rot">${t ? 'Resultados' : 'Visualizados recentemente'}</div>` + qs.map((q) => `<button class="item" data-acao="ir-quadro" data-q="${q.id}"><span style="width:32px;height:24px;border-radius:3px;background:${FUNDOS[q.fundo]}"></span><span>${esc(q.nome)}<small>Área de trabalho do Trello</small></span></button>`).join('') + (t ? ach.map((c) => `<button class="item" data-acao="abrir" data-id="${c.id}">${svg('card')}<span>${esc(c.nome)}<small>${esc(ondeEsta(c.id)?.nome || '')}</small></span></button>`).join('') || (ach.length || qs.length ? '' : '<p style="color:#6B6E76;margin:8px 12px">Nada encontrado.</p>') : '');
    },
  };

  // ---------- modais ----------
  let modal = null;
  function fechaModal() { document.body.classList.remove('voz-aberta'); if (modal) { modal.remove(); modal = null; } const g = $('.gravador'); if (g) g.remove(); if (rec) { try { rec.stop() } catch (e) {} rec = null; } }
  function abreModal(html, claro) { fechaPop(); fechaModal(); modal = document.createElement('div'); modal.className = 'fundo' + (claro === 'desfoca' ? ' desfoca' : claro === 'escuro' ? ' escuro' : claro ? ' claro' : ''); modal.innerHTML = html; document.body.appendChild(modal); return modal; }

  function mudarQuadros() {
    const q = (t) => E.quadros.filter((x) => x.nome.toLowerCase().includes(t)).map((x) => `<button class="tile" data-acao="ir-quadro" data-q="${x.id}"><div class="cor" style="background:${FUNDOS[x.fundo]}"></div><span>${esc(x.nome)}</span></button>`).join('');
    abreModal(`<div class="modal mq" role="dialog" aria-label="Mudar de quadros">
      <div class="mq-busca"><label>${svg('search')}<input id="mq-in" placeholder="Pesquisar seus quadros" autocomplete="off"></label>
        <button class="bt" data-acao="aviso" data-m="Visualização em lista." aria-label="Lista">${svg('list-bulleted')}</button><button class="bt" data-acao="aviso" data-m="Quadros fixados aparecem primeiro." aria-label="Fixar">${svg('pin')}</button></div>
      <div class="chips"><button class="chip on" data-acao="chip">Tudo</button><button class="chip" data-acao="chip">Área de trabalho do Trello</button></div>
      <h6>${svg('clock')}Recente</h6><div class="tiles" id="mq-rec">${q('')}</div>
      <button class="ws" data-acao="ws-abre">${svg(wsAberta ? 'chevron-down' : 'chevron-right')}Área de trabalho do Trello</button>
      <div class="tiles" id="mq-ws" style="margin-top:14px;${wsAberta ? '' : 'display:none'}">${q('')}<button class="tile novo" data-acao="criar-quadro">Criar novo quadro</button></div>
    </div>`, 'desfoca');
    setTimeout(() => $('#mq-in')?.focus(), 0);
    $('#mq-in').addEventListener('input', (e) => { const t = e.target.value.toLowerCase(); $('#mq-rec').innerHTML = q(t) || '<p style="color:#6B6E76;margin:0">Nenhum quadro encontrado.</p>'; });
  }
  let wsAberta = false;

  let rec = null;
  function voz() {
    document.body.classList.add('voz-aberta');
    abreModal(`<div class="modal vz" role="dialog" aria-label="Capturar com a voz">
      <button class="x" data-acao="fecha-modal" style="position:absolute;right:16px;top:16px" aria-label="Fechar">${svg('cross')}</button>
      <div class="vz-aviso"><img src="f/mic.png" alt=""><div><b id="vz-t">Ative seu microfone</b><p id="vz-p">Para continuar, permita o acesso ao microfone nas configurações do seu navegador.</p></div></div>
      <div class="vz-cartao">Reservar restaurante para o almoço da equipe<q>O restaurante deve ter uma opção vegetariana.</q><span style="display:flex;align-items:center;gap:6px;color:#505258">${svg('clock')}Qui</span></div>
      <div class="vz-dica"><small>Tente dizer</small><strong>“Quero reservar um restaurante para o almoço da equipe na quinta-feira. Precisa ter uma opção vegetariana.”</strong></div>
      <div class="vz-pe"><span>ⓘ Usa IA. Verifique os resultados.</span><span class="beta">Beta</span></div>
    </div>`, 'escuro');
    const g = document.createElement('button'); g.className = 'gravador'; g.dataset.acao = 'gravar';
    g.innerHTML = `${svg('tocar')}<i></i><em>Sem áudio</em><i></i>${svg('check-mark')}`; document.body.appendChild(g);
  }
  function gravar() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const g = $('.gravador');
    if (!SR) { aviso('Este navegador não deixa usar o microfone aqui.'); return; }
    if (rec) { try { rec.stop() } catch (e) {} return; }
    rec = new SR(); rec.lang = 'pt-BR'; rec.interimResults = true;
    let texto = '';
    rec.onresult = (ev) => { texto = [...ev.results].map((r) => r[0].transcript).join(' '); g.querySelector('em').textContent = texto || 'Ouvindo…'; };
    rec.onstart = () => { g.classList.add('ouvindo'); g.querySelector('em').textContent = 'Ouvindo…'; const t = $('#vz-t'); if (t) { t.textContent = 'Pode falar'; $('#vz-p').textContent = 'Quando terminar, toque de novo para criar o cartão na Caixa de entrada.'; } };
    rec.onerror = () => { aviso('O microfone não foi liberado.'); };
    rec.onend = () => { rec = null; g.classList.remove('ouvindo'); if (texto.trim()) { const id = uid(); E.cartoes[id] = { id, nome: texto.trim(), desc: '', check: [], anexos: [], feito: false, membros: [], eti: [], data: '', coments: [], visto: false }; E.caixa.unshift(id); E.painel.caixa = true; fechaModal(); render(); aviso('Cartão criado na Caixa de entrada.'); } else g.querySelector('em').textContent = 'Sem áudio'; };
    try { rec.start() } catch (e) {}
  }

  function compartilhar() {
    abreModal(`<div class="modal" style="width:584px;margin-top:120px;padding:24px" role="dialog" aria-label="Compartilhar quadro">
      <div style="display:flex;align-items:center;margin-bottom:20px"><h2 style="margin:0;font-size:20px;flex:1;font-weight:600">Compartilhar quadro</h2><button class="x" data-acao="fecha-modal" aria-label="Fechar">${svg('cross')}</button></div>
      <form data-form="convite" style="display:flex;gap:8px"><input name="t" type="text" placeholder="Endereço de e-mail ou nome" style="flex:1;height:36px;border:1px solid #8590A2;border-radius:3px;padding:0 10px"><button class="azul" style="height:36px">Compartilhar</button></form>
      <div style="display:flex;align-items:center;gap:12px;margin:20px 0 8px"><span style="width:32px;height:32px;border-radius:4px;background:#F1F2F4;display:grid;place-items:center">${svg('link')}</span><span style="flex:1">Compartilhe este quadro com um link<br><button data-acao="copiar-link" style="color:#1868DB;font-size:12px">Copiar link</button></span></div>
      <hr style="border:0;border-top:1px solid #DCDFE4;margin:16px 0">
      <div style="font-weight:600;margin-bottom:10px">Membros do quadro</div>
      <div style="display:flex;align-items:center;gap:12px"><span class="av" style="width:32px;height:32px;font-size:12px">LP</span><span style="flex:1">Letícia Piccolo (você)<br><small style="color:#6B6E76">@leticiapiccolo · Administrador da Área de trabalho</small></span><button class="bt">Administrador</button></div>
      <div id="convidados"></div>
    </div>`);
  }

  function menuQuadro() {
    fechaPop();
    const ja = $('.menu-q'); if (ja) { ja.remove(); return; }
    const q = Q();
    const el = document.createElement('aside'); el.className = 'menu-q';
    el.innerHTML = `<div class="pop-topo"><h5>Menu</h5><button class="x" data-acao="fecha-menu-q" aria-label="Fechar">${svg('cross')}</button></div>
      <div class="lista-m">
        <div class="pop" style="position:static;box-shadow:none;width:auto;padding:0;max-height:none">
        ${item('aviso', 'Sobre este quadro', 'Adicione uma descrição ao seu quadro', 'people-group', 'data-m="A descrição do quadro abriria aqui."')}
        ${item('aviso', 'Visibilidade: ' + q.vis, '', 'lock-locked', 'data-m="Use o cadeado no topo para mudar a visibilidade."')}
        ${item('aviso', 'Imprimir, exportar e compartilhar', '', 'share', 'data-m="Exportar abriria aqui."')}
        ${item('estrela', q.estrela ? 'Desfavoritar' : 'Favoritar', '', 'star-unstarred')}
        <hr>
        ${item('aviso', 'Configurações', '', 'settings', 'data-m="Configurações do quadro."')}
        <div class="rot" style="margin:12px 12px 0">Alterar plano de fundo</div>
        <div class="cores" style="padding:0 12px">${FUNDOS.map((f, i) => `<button data-acao="fundo" data-i="${i}" class="${q.fundo === i ? 'on' : ''}" style="background:${f}" aria-label="Fundo ${i + 1}"></button>`).join('')}</div>
        <hr>
        ${item('aviso', 'Itens arquivados', 'Cartões e listas arquivados', 'archive-box', `data-m="${arquivados.length} item(ns) arquivado(s)."`)}
        ${item('copiar-quadro', 'Copiar quadro', '', 'copy')}
        ${item('fechar-quadro', 'Fechar quadro', '', 'cross')}
        </div>
      </div>`;
    document.body.appendChild(el);
  }
  let arquivados = [];

  // cartão aberto
  let aberto = null, editTitulo = false, editDesc = false;
  function abreCartao(id) {
    const c = C(id); if (!c) return;
    if (c.novo) { c.novo = false; }
    aberto = id; editTitulo = false; editDesc = false;
    desenhaCartao();
  }
  function desenhaCartao() {
    const c = C(aberto); if (!c) { fechaModal(); return; }
    const onde = ondeEsta(c.id) || { nome: '' };
    const feitas = c.check.filter((x) => x.f).length;
    const pct = c.check.length ? Math.round((feitas / c.check.length) * 100) : 0;
    const html = `<div class="modal cm" role="dialog" aria-label="${esc(c.nome)}">
      ${c.capa ? `<div class="cm-capa" style="background-image:url(${c.capa})"></div>` : ''}
      <div class="cm-barra"><button class="cm-lista" data-pop="cm-lista" data-id="${c.id}">${esc(onde.nome)} ${svg('chevron-down', 'ic16')}</button><span class="esp"></span>
        <button class="tb" data-acao="capa" data-id="${c.id}" aria-label="Capa">${svg('image')}</button>
        <button class="tb" data-acao="cm-seguir" data-id="${c.id}" aria-label="Seguir">${svg('eye-open')}</button>
        <button class="tb" data-pop="cm-mais" data-id="${c.id}" aria-label="Ações">${svg('show-more-horizontal')}</button>
        <button class="tb" data-acao="fecha-modal" aria-label="Fechar">${svg('cross')}</button></div>
      <div class="cm-grade"><div class="cm-esq">
        <div class="cm-titulo"><button class="ck" data-acao="feito" data-id="${c.id}" aria-label="Concluir">${svg(c.feito ? 'check-circle' : 'check-circle-unchecked', 'ck')}</button>
          ${editTitulo ? `<textarea id="cm-t" rows="1">${esc(c.nome)}</textarea>` : `<h2 data-acao="edit-titulo">${esc(c.nome)}</h2>`}</div>
        <div class="cm-acoes">
          <button class="bt" data-pop="cm-add" data-id="${c.id}">${svg('add')}Adicionar</button>
          <button class="bt" data-pop="cm-eti" data-id="${c.id}">${svg('tag')}Etiquetas</button>
          <button class="bt" data-pop="cm-data" data-id="${c.id}">${svg('clock')}Datas</button>
          <button class="bt" data-acao="add-check" data-id="${c.id}">${svg('list-checklist')}Checklist</button>
          <button class="bt" data-pop="cm-membros" data-id="${c.id}">${svg('person')}Membros</button>
        </div>
        ${c.membros.length || c.eti.length || c.data ? `<div class="cm-info">
          ${c.membros.length ? `<div><div class="rot">Membros</div><span class="av" style="width:32px;height:32px;font-size:12px">LP</span></div>` : ''}
          ${c.eti.length ? `<div><div class="rot">Etiquetas</div><div class="eti">${c.eti.map((e) => `<i style="background:${e}"></i>`).join('')}</div></div>` : ''}
          ${c.data ? `<div><div class="rot">Data de entrega</div><button class="bt" data-pop="cm-data" data-id="${c.id}">${new Date(c.data + 'T12:00').toLocaleDateString('pt-BR')}</button></div>` : ''}
        </div>` : ''}
        ${!c.link ? `<div class="cm-sec"><div class="cm-sec-t">${svg('link')}<h3>Link</h3></div><div class="cm-site">${icone(c, 'app-ic')}<input id="cm-site" data-id="${c.id}" value="${esc(c.site || '')}" placeholder="Cole o link do projeto…" autocomplete="off"></div></div>` : ''}
        ${c.link ? `<div class="cm-sec"><div class="cm-sec-t">${svg('link')}<h3>Link</h3></div><div style="margin-left:32px"><a href="${esc(c.link)}" target="_blank" rel="noopener" style="color:#1868DB">${esc(c.nome)}</a></div></div>` : ''}
        <div class="cm-sec"><div class="cm-sec-t">${svg('align-text-left')}<h3>Descrição</h3>${c.desc && !editDesc ? `<button class="bt" data-acao="edit-desc">Editar</button>` : ''}</div>
          ${editDesc ? `<div class="cm-desc-ed"><textarea id="cm-d" placeholder="Adicione uma descrição mais detalhada…">${esc(c.desc)}</textarea><div style="display:flex;gap:8px;margin-top:8px"><button class="azul" data-acao="salva-desc">Salvar</button><button class="bt sem" data-acao="cancela-desc">Cancelar</button></div></div>`
            : `<div class="cm-desc ${c.desc ? 'cheia' : ''}" data-acao="edit-desc">${c.desc ? esc(c.desc) : 'Adicione uma descrição mais detalhada…'}</div>`}</div>
        ${c.anexos.length ? `<div class="cm-sec"><div class="cm-sec-t">${svg('attachment')}<h3>Anexos</h3><button class="bt" data-acao="add-anexo" data-id="${c.id}">Adicionar</button></div>${c.anexos.map((a, i) => `<div class="cm-anexo" style="margin-bottom:8px"><span class="mini" style="background-image:url(${a.capa || ''})"></span><span><b>${esc(a.nome)}</b><br><small style="color:#6B6E76">Adicionado hoje · <button data-acao="tira-anexo" data-id="${c.id}" data-i="${i}" style="text-decoration:underline">Excluir</button></small></span></div>`).join('')}</div>` : ''}
        ${c.check.length ? `<div class="cm-sec"><div class="cm-sec-t">${svg('list-checklist')}<h3>Checklist</h3><button class="bt" data-acao="tira-check" data-id="${c.id}">Excluir</button></div>
          <div class="cm-check"><div class="barra-p ${pct === 100 ? 'cheia' : ''}"><span>${pct}%</span><i><b style="width:${pct}%"></b></i></div>
          ${c.check.map((x, i) => `<label class="ci ${x.f ? 'feito' : ''}"><input type="checkbox" data-acao="ci" data-id="${c.id}" data-i="${i}" ${x.f ? 'checked' : ''}><span>${esc(x.t)}</span><button class="x" data-acao="tira-ci" data-id="${c.id}" data-i="${i}" aria-label="Excluir item">${svg('cross')}</button></label>`).join('')}
          <form data-form="ci" data-id="${c.id}" style="display:flex;gap:8px;margin-top:8px"><input name="t" placeholder="Adicionar um item" style="flex:1;height:32px;border:1px solid #DADDE2;border-radius:6px;padding:0 10px"><button class="bt">Adicionar</button></form></div></div>` : ''}
      </div>
      <div class="cm-dir"><div class="cm-sec-t">${svg('comment')}<h3>Comentários e atividade</h3><button class="bt" data-acao="aviso" data-m="Mostrando todos os detalhes.">Mostrar detalhes</button></div>
        <form class="com-in" data-form="coment" data-id="${c.id}"><textarea name="t" rows="1" placeholder="Escrever um comentário…"></textarea><button class="azul">Salvar</button></form>
        ${c.coments.slice().reverse().map((m) => `<div class="ativ"><span class="av">LP</span><div class="txt"><b>Letícia Piccolo</b><div class="bolha">${esc(m.t)}</div><small>${m.quando}</small></div></div>`).join('')}
        <div class="ativ"><span class="av">LP</span><div class="txt"><b>Letícia Piccolo</b> adicionou este cartão a ${esc(onde.nome)}<small>hoje</small></div></div>
      </div></div></div>`;
    if (!modal || !modal.querySelector('.cm')) abreModal(html); else modal.innerHTML = html;
    const t = $('#cm-t'); if (t) { t.focus(); t.select(); }
    const d = $('#cm-d'); if (d) d.focus();
  }

  // ---------- mudar coisas ----------
  function tira(id) { for (const q of E.quadros) for (const l of q.listas) { const i = l.cartoes.indexOf(id); if (i >= 0) l.cartoes.splice(i, 1); } const j = E.caixa.indexOf(id); if (j >= 0) E.caixa.splice(j, 1); }
  function novoCartao(nome) { const id = uid(); E.cartoes[id] = { id, nome, desc: '', check: [], anexos: [], feito: false, membros: [], eti: [], data: '', coments: [], visto: false, site: '', logo: '' }; return id; }
  function aviso(m) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); }
  function lista(id) { return Q().listas.find((l) => l.id === id); }

  const ACOES = {
    'fecha-pop': fechaPop,
    'fecha-modal': () => { aberto = null; fechaModal(); render(); },
    aviso: (a) => { fechaPop(); aviso(a.dataset.m || 'Pronto.'); },
    ext: (a) => { fechaPop(); window.open(a.dataset.url, '_blank', 'noopener'); },
    inicio: () => { E.painel = { caixa: false, plan: false, quadro: true }; fechaPop(); render(); },
    painel: (a) => { const p = a.dataset.p; E.painel[p] = !E.painel[p]; if (!E.painel.caixa && !E.painel.plan && !E.painel.quadro) E.painel[p] = true; if (innerWidth < 760 && E.painel[p]) { E.painel = { caixa: false, plan: false, quadro: false }; E.painel[p] = true; } render(); },
    mudar: mudarQuadros,
    voz,
    gravar,
    compartilhar,
    'menu-q': menuQuadro,
    'fecha-menu-q': () => $('.menu-q')?.remove(),
    'ws-abre': () => { wsAberta = !wsAberta; mudarQuadros(); },
    chip: (a) => { $$('.chip').forEach((c) => c.classList.toggle('on', c === a)); },
    'ir-quadro': (a) => { E.atual = a.dataset.q; E.painel.quadro = true; fechaModal(); fechaPop(); render(); },
    'criar-quadro': () => { fechaModal(); fechaPop(); const n = { id: uid(), nome: 'Novo quadro', fundo: (E.quadros.length) % FUNDOS.length, estrela: false, vis: 'Área de trabalho', listas: [{ id: uid(), nome: 'A fazer', cartoes: [] }, { id: uid(), nome: 'Fazendo', cartoes: [] }, { id: uid(), nome: 'Feito', cartoes: [] }] }; E.quadros.push(n); E.atual = n.id; E.painel.quadro = true; render(); setTimeout(() => $('.q-nome')?.click(), 50); },
    'criar-modelo': () => { fechaPop(); ACOES['criar-quadro'](); aviso('Quadro criado a partir do modelo básico.'); },
    'criar-ws': () => { fechaPop(); aviso('Área de trabalho criada.'); },
    'copiar-quadro': () => { const q = Q(); const n = JSON.parse(JSON.stringify(q)); n.id = uid(); n.nome = q.nome + ' (cópia)'; n.listas.forEach((l) => { l.id = uid(); l.cartoes = l.cartoes.map((id) => { const c = JSON.parse(JSON.stringify(C(id))); c.id = uid(); E.cartoes[c.id] = c; return c.id; }); }); E.quadros.push(n); E.atual = n.id; $('.menu-q')?.remove(); render(); aviso('Quadro copiado.'); },
    'fechar-quadro': () => { if (E.quadros.length < 2) { aviso('Este é o único quadro: crie outro antes de fechar.'); return; } const q = Q(); E.quadros = E.quadros.filter((x) => x !== q); arquivados.push(q.nome); E.atual = E.quadros[0].id; $('.menu-q')?.remove(); render(); aviso('Quadro fechado.'); },
    fundo: (a) => { Q().fundo = +a.dataset.i; render(); menuQuadro(); menuQuadro(); },
    estrela: () => { Q().estrela = !Q().estrela; fechaPop(); render(); aviso(Q().estrela ? 'Quadro favoritado.' : 'Removido dos favoritos.'); },
    'vis-q': (a) => { Q().vis = a.dataset.v; fechaPop(); render(); aviso('Visibilidade: ' + a.dataset.v); },
    'renomear-q': (a) => { const q = Q(); const i = document.createElement('input'); i.className = 'q-nome-input'; i.value = q.nome; a.replaceWith(i); i.focus(); i.select(); const ok = () => { q.nome = i.value.trim() || q.nome; render(); }; i.addEventListener('blur', ok); i.addEventListener('keydown', (e) => { if (e.key === 'Enter') i.blur(); if (e.key === 'Escape') { i.value = q.nome; i.blur(); } }); },
    'limpa-filtro': () => { filtro = ''; fechaPop(); render(); },
    'nova-lista': () => { novaLista = true; render(); $('.nova-lista input')?.focus(); },
    'fecha-lista': () => { novaLista = false; render(); },
    compor: (a) => { fechaPop(); compondo = a.dataset.l; render(); const t = $(`form[data-l="${compondo}"] textarea`); if (t) { t.focus(); t.closest('.lista').querySelector('.l-cartoes').scrollTop = 1e6; } },
    'fecha-comp': () => { compondo = null; render(); },
    recolher: (a) => { lista(a.dataset.l).recolhida = true; render(); },
    expandir: (a) => { lista(a.dataset.l).recolhida = false; render(); },
    'ren-lista': (a) => { renomeandoLista = a.dataset.l; render(); const t = $(`[data-ren-lista="${renomeandoLista}"]`); t.focus(); t.select(); const fim = () => { const l = lista(t.dataset.renLista); if (l) l.nome = t.value.trim() || l.nome; renomeandoLista = null; render(); }; t.addEventListener('blur', fim); t.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); t.blur(); } if (e.key === 'Escape') { t.value = lista(t.dataset.renLista).nome; t.blur(); } }); },
    'copiar-lista': (a) => { const q = Q(); const l = lista(a.dataset.l); const n = { id: uid(), nome: l.nome, cartoes: l.cartoes.map((id) => { const c = JSON.parse(JSON.stringify(C(id))); c.id = uid(); E.cartoes[c.id] = c; return c.id; }) }; q.listas.splice(q.listas.indexOf(l) + 1, 0, n); fechaPop(); render(); },
    'pop-mover-lista': (a) => abrePop('mover-lista', a),
    'mover-lista': (a) => { const q = Q(); const l = lista(a.dataset.l); q.listas.splice(q.listas.indexOf(l), 1); q.listas.splice(+a.dataset.i, 0, l); fechaPop(); render(); },
    'seguir-lista': () => { fechaPop(); aviso('Você está seguindo esta lista.'); },
    ordenar: (a) => { const l = lista(a.dataset.l); l.cartoes.sort((x, y) => C(x).nome.localeCompare(C(y).nome, 'pt')); fechaPop(); render(); },
    'arquivar-cartoes': (a) => { const l = lista(a.dataset.l); arquivados.push(...l.cartoes); l.cartoes = []; fechaPop(); render(); aviso('Cartões arquivados.'); },
    'arquivar-lista': (a) => { const q = Q(); const l = lista(a.dataset.l); q.listas = q.listas.filter((x) => x !== l); arquivados.push(l.nome); fechaPop(); render(); aviso('Lista arquivada.'); },
    'criar-modelo-cartao': (a) => { const id = novoCartao('Modelo de cartão'); lista(a.dataset.l).cartoes.push(id); fechaPop(); render(); abreCartao(id); },
    consolide: () => { E.consolide = !E.consolide; render(); },
    'limpar-caixa': () => { arquivados.push(...E.caixa); E.caixa = []; fechaPop(); render(); aviso('Caixa de entrada arquivada.'); },
    'fecha-faixa': () => { E.faixa = false; render(); },
    'reabre-faixa': () => { E.faixa = true; fechaPop(); render(); },
    'pl-hoje': () => { $('.pl-corpo')?.scrollTo({ top: 0, behavior: 'smooth' }); },
    'pl-prox': () => { const c = $('.pl-corpo'); c?.scrollBy({ top: c.clientHeight * 0.8, behavior: 'smooth' }); },
    'pl-ant': () => { const c = $('.pl-corpo'); c?.scrollBy({ top: -c.clientHeight * 0.8, behavior: 'smooth' }); },
    lida: (a) => { E.notif[+a.dataset.i].lida = true; salva(); fechaPop(); },
    'todas-lidas': () => { E.notif.forEach((n) => (n.lida = true)); salva(); fechaPop(); aviso('Todas marcadas como lidas.'); },
    recomecar: () => { fechaPop(); E = inicial(); render(); aviso('Quadro de exemplo recomeçado.'); },
    'copiar-link': () => { navigator.clipboard?.writeText(location.href).then(() => aviso('Link copiado.')).catch(() => aviso(location.href)); },
    link: () => {},
    // cartão
    abrir: (a) => { fechaPop(); abreCartao(a.dataset.id); },
    feito: (a) => { const c = C(a.dataset.id); c.feito = !c.feito; render(); if (aberto) desenhaCartao(); },
    'edit-titulo': () => { editTitulo = true; desenhaCartao(); const t = $('#cm-t'); const fim = () => { const c = C(aberto); if (c) c.nome = t.value.trim() || c.nome; editTitulo = false; render(); desenhaCartao(); }; t.addEventListener('blur', fim); t.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); t.blur(); } }); },
    'edit-desc': () => { editDesc = true; desenhaCartao(); },
    'salva-desc': () => { C(aberto).desc = $('#cm-d').value.trim(); editDesc = false; render(); desenhaCartao(); },
    'cancela-desc': () => { editDesc = false; desenhaCartao(); },
    'add-check': (a) => { fechaPop(); const c = C(a.dataset.id); if (!c.check.length) c.check.push({ t: 'Primeiro item', f: false }); render(); desenhaCartao(); setTimeout(() => $('form[data-form=ci] input')?.focus(), 0); },
    'tira-check': (a) => { C(a.dataset.id).check = []; render(); desenhaCartao(); },
    ci: (a) => { const c = C(a.dataset.id); c.check[+a.dataset.i].f = a.checked; render(); desenhaCartao(); },
    'tira-ci': (a) => { C(a.dataset.id).check.splice(+a.dataset.i, 1); render(); desenhaCartao(); },
    'pop-cm-eti': (a) => abrePop('cm-eti', $(`.cm-acoes [data-pop="cm-eti"]`) || a),
    'pop-cm-data': (a) => abrePop('cm-data', $(`.cm-acoes [data-pop="cm-data"]`) || a),
    'pop-cm-membros': (a) => abrePop('cm-membros', $(`.cm-acoes [data-pop="cm-membros"]`) || a),
    'pop-cm-lista': (a) => abrePop('cm-lista', $('.cm-lista') || a),
    eti: (a) => { const c = C(a.dataset.id); const cor = a.dataset.cor; c.eti = a.checked ? [...c.eti, cor] : c.eti.filter((x) => x !== cor); render(); const p = popAberto; desenhaCartao(); if (p) document.body.appendChild(p); },
    'tira-data': (a) => { C(a.dataset.id).data = ''; fechaPop(); render(); desenhaCartao(); },
    membro: (a) => { const c = C(a.dataset.id); c.membros = c.membros.includes('LP') ? [] : ['LP']; fechaPop(); render(); desenhaCartao(); },
    'add-anexo': (a) => { fechaPop(); const c = C(a.dataset.id || aberto); const n = 'anexo-' + (c.anexos.length + 1) + '.png'; c.anexos.push({ nome: n, capa: c.capa || '' }); render(); desenhaCartao(); },
    'tira-anexo': (a) => { C(a.dataset.id).anexos.splice(+a.dataset.i, 1); render(); desenhaCartao(); },
    capa: (a) => { const c = C(a.dataset.id); const caps = ['f/capa1.png', 'f/capa2.png', 'f/capa3.png', '']; c.capa = caps[(caps.indexOf(c.capa || '') + 1) % caps.length]; render(); desenhaCartao(); },
    'cm-seguir': (a) => { const c = C(a.dataset.id); c.visto = !c.visto; fechaPop(); render(); desenhaCartao(); aviso(c.visto ? 'Você está seguindo este cartão.' : 'Você deixou de seguir.'); },
    'copiar-cartao': (a) => { const o = ondeEsta(a.dataset.id); const c = JSON.parse(JSON.stringify(C(a.dataset.id))); c.id = uid(); c.nome += ' (cópia)'; E.cartoes[c.id] = c; o.arr.splice(o.arr.indexOf(a.dataset.id) + 1, 0, c.id); fechaPop(); render(); aviso('Cartão copiado.'); },
    'arquivar-cartao': (a) => { tira(a.dataset.id); arquivados.push(a.dataset.id); fechaPop(); aberto = null; fechaModal(); render(); aviso('Cartão arquivado.'); },
    'mover-cartao': (a) => { const id = a.dataset.id; tira(id); if (a.dataset.para === 'caixa') E.caixa.unshift(id); else lista(a.dataset.para).cartoes.push(id); fechaPop(); render(); desenhaCartao(); },
  };

  // ---------- eventos ----------
  let arrastou = false;
  document.addEventListener('click', (e) => {
    if (arrastou) { arrastou = false; e.preventDefault(); return; }
    const a = e.target.closest('[data-acao],[data-pop]');
    if (popAberto && !popAberto.contains(e.target) && !(a && a.dataset.pop)) { fechaPop(); if (!a) return; }
    if (!a) {
      const c = e.target.closest('.cartao');
      if (c && !e.target.closest('a')) { abreCartao(c.dataset.id); return; }
      if (modal && e.target === modal) { aberto = null; fechaModal(); render(); }
      return;
    }
    if (a.tagName === 'A' && a.dataset.acao === 'link') return; // link do cartão abre em aba nova
    if (a.tagName === 'A' || a.closest('a.marca')) e.preventDefault();
    if (a.dataset.pop) { abrePop(a.dataset.pop, a); return; }
    if (a.tagName === 'INPUT' && a.type === 'checkbox') { ACOES[a.dataset.acao]?.(a); return; }
    if (a.tagName === 'LABEL') return;
    const f = ACOES[a.dataset.acao]; if (f) { e.preventDefault(); f(a); }
  });
  document.addEventListener('change', (e) => {
    const d = e.target.dataset.data; if (d) { C(d).data = e.target.value; render(); desenhaCartao(); }
    if (e.target.id === 'cm-site') { const c = C(e.target.dataset.id); if (c) { c.site = arrumaLink(e.target.value); render(); desenhaCartao(); } }
  });
  // arrastar uma imagem para o cartão (no quadro ou aberto) = logo do projeto
  const temArquivo = (e) => [...(e.dataTransfer?.types || [])].includes('Files');
  const alvoLogo = (e) => { const k = e.target.closest?.('.cartao'); if (k) return { el: k, id: k.dataset.id }; const m = e.target.closest?.('.cm'); if (m && aberto) return { el: m, id: aberto }; return null; };
  document.addEventListener('dragover', (e) => { if (!temArquivo(e)) return; e.preventDefault(); $$('.solta').forEach((x) => x.classList.remove('solta')); const a = alvoLogo(e); if (a) { a.el.classList.add('solta'); e.dataTransfer.dropEffect = 'copy'; } else e.dataTransfer.dropEffect = 'none'; });
  document.addEventListener('dragleave', (e) => { if (!e.relatedTarget) $$('.solta').forEach((x) => x.classList.remove('solta')); });
  document.addEventListener('drop', (e) => { if (!temArquivo(e)) return; e.preventDefault(); $$('.solta').forEach((x) => x.classList.remove('solta')); const a = alvoLogo(e); const f = e.dataTransfer.files[0]; if (a && f) sobeLogo(a.id, f); });
  document.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target; const t = (f.t?.value || '').trim();
    const tipo = f.dataset.form;
    if (tipo === 'caixa' && t) { E.caixa.unshift(novoCartao(t)); render(); $('.cx-add input')?.focus(); }
    if (tipo === 'cartao') { if (!t) { f.t.focus(); return; } lista(f.dataset.l).cartoes.push(novoCartao(t)); render(); const n = $(`form[data-l="${compondo}"] textarea`); if (n) { n.focus(); n.closest('.lista').querySelector('.l-cartoes').scrollTop = 1e6; } }
    if (tipo === 'lista' && t) { Q().listas.push({ id: uid(), nome: t, cartoes: [] }); render(); setTimeout(() => { const i = $('.nova-lista input'); i?.focus(); $('.listas').scrollLeft = 1e6; }, 0); }
    if (tipo === 'ci' && t) { C(f.dataset.id).check.push({ t, f: false }); render(); desenhaCartao(); setTimeout(() => $('form[data-form=ci] input')?.focus(), 0); }
    if (tipo === 'coment' && t) { C(f.dataset.id).coments.push({ t, quando: 'agora mesmo' }); render(); desenhaCartao(); }
    if (tipo === 'convite' && t) { $('#convidados').insertAdjacentHTML('beforeend', `<div style="display:flex;align-items:center;gap:12px;margin-top:12px"><span class="av" style="width:32px;height:32px;font-size:12px;background:#579DFF">${esc(t[0].toUpperCase())}</span><span style="flex:1">${esc(t)}<br><small style="color:#6B6E76">Convite enviado</small></span></div>`); f.reset(); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (popAberto) return fechaPop(); if ($('.menu-q')) return $('.menu-q').remove(); if (modal) { aberto = null; fechaModal(); render(); return; } if (compondo) { compondo = null; render(); } if (novaLista) { novaLista = false; render(); } }
    if (e.key === 'Enter' && !e.shiftKey && e.target.closest('.compositor') && e.target.tagName === 'TEXTAREA') { e.preventDefault(); e.target.form.requestSubmit(); }
    if (e.key === 'Enter' && !e.shiftKey && e.target.closest('.com-in')) { e.preventDefault(); e.target.form.requestSubmit(); }
    if (e.key === 'Enter' && e.target.id === 'cm-site') { e.preventDefault(); e.target.blur(); }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'busca') { busca = e.target.value; const b = $('.busca'); abrePopBusca(b); }
    if (e.target.id === 'f-in') { filtro = e.target.value.toLowerCase(); const el = popAberto; render(); if (el) { document.body.appendChild(el); popAberto = el; const i = $('#f-in'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
  });
  document.addEventListener('focusin', (e) => { if (e.target.id === 'busca') abrePopBusca($('.busca')); });
  function abrePopBusca(b) { if (popAberto && popAberto.dataset.chave === 'busca') { popAberto.innerHTML = POPS.busca(); return; } abrePop('busca', b); if (popAberto) { popAberto.style.width = b.offsetWidth + 'px'; } $('#busca')?.focus(); }

  // ---------- arrastar (cartões e listas) ----------
  let dr = null;
  document.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const card = e.target.closest('.cartao');
    const topoL = e.target.closest('[data-arrasta-lista]');
    if (e.target.closest('button,a,input,textarea,[data-acao="feito"],.l-nome')) return;
    if (card && !modal) dr = { tipo: 'cartao', el: card, id: card.dataset.id, x: e.clientX, y: e.clientY, ativo: false };
    else if (topoL && !e.target.closest('.l-nome-input') && !modal) dr = { tipo: 'lista', el: topoL.closest('.lw'), id: topoL.dataset.arrastaLista, x: e.clientX, y: e.clientY, ativo: false };
  });
  document.addEventListener('pointermove', (e) => {
    if (!dr) return;
    if (!dr.ativo) {
      if (Math.hypot(e.clientX - dr.x, e.clientY - dr.y) < 6) return;
      dr.ativo = true;
      const r = dr.el.getBoundingClientRect();
      dr.dx = e.clientX - r.left; dr.dy = e.clientY - r.top;
      dr.fant = dr.el.cloneNode(true); dr.fant.classList.add('arrastando'); dr.fant.style.width = r.width + 'px'; dr.fant.style.height = r.height + 'px';
      document.body.appendChild(dr.fant);
      dr.vaga = document.createElement('div'); dr.vaga.className = 'vaga'; dr.vaga.style.height = r.height + 'px';
      if (dr.tipo === 'lista') { dr.vaga.style.width = r.width + 'px'; dr.vaga.style.margin = '0 6px'; dr.vaga.style.borderRadius = '12px'; dr.vaga.style.background = 'rgba(0,0,0,.18)'; dr.vaga.style.height = Math.min(r.height, 400) + 'px'; }
      dr.el.after(dr.vaga); dr.el.style.display = 'none';
      document.body.style.cursor = 'grabbing';
    }
    e.preventDefault();
    dr.fant.style.left = e.clientX - dr.dx + 'px'; dr.fant.style.top = e.clientY - dr.dy + 'px';
    const sob = document.elementFromPoint(e.clientX, e.clientY);
    if (dr.tipo === 'cartao') {
      let alvo = sob && (sob.closest('[data-alvo="lista"],[data-alvo="caixa"],[data-alvo="dia"]') || sob.closest('.lista')?.querySelector('[data-alvo="lista"]') || sob.closest('.dia')?.querySelector('[data-alvo="dia"]'));
      if (alvo) {
        const filhos = [...alvo.children].filter((c) => c.classList.contains('cartao') && c !== dr.el);
        const antes = filhos.find((c) => { const r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
        if (antes) alvo.insertBefore(dr.vaga, antes); else alvo.appendChild(dr.vaga);
      }
    } else {
      const ls = $('.listas'); if (!ls) return;
      const ws = [...ls.querySelectorAll('.lw')].filter((w) => w !== dr.el);
      const antes = ws.find((w) => { const r = w.getBoundingClientRect(); return e.clientX < r.left + r.width / 2; });
      if (antes) ls.insertBefore(dr.vaga, antes); else ls.insertBefore(dr.vaga, ls.querySelector('.add-lista,.nova-lista'));
    }
    const ls = $('.listas');
    if (ls) { const r = ls.getBoundingClientRect(); if (e.clientX > r.right - 60) ls.scrollLeft += 14; else if (e.clientX < r.left + 60) ls.scrollLeft -= 14; }
    const lc = sob?.closest('.l-cartoes,.cx-lista,.pl-corpo'); if (lc) { const r = lc.getBoundingClientRect(); if (e.clientY > r.bottom - 40) lc.scrollTop += 10; else if (e.clientY < r.top + 40) lc.scrollTop -= 10; }
  }, { passive: false });
  document.addEventListener('pointerup', () => {
    if (!dr) return;
    const d = dr; dr = null; document.body.style.cursor = '';
    if (!d.ativo) return;
    arrastou = true; setTimeout(() => (arrastou = false), 0);
    d.fant.remove();
    if (d.tipo === 'cartao') {
      const alvo = d.vaga.parentElement;
      const pos = [...alvo.children].filter((c) => (c.classList.contains('cartao') && c !== d.el) || c === d.vaga).indexOf(d.vaga);
      if (alvo.dataset.alvo === 'dia') { C(d.id).data = alvo.dataset.dia; render(); aviso('Planejado para ' + new Date(alvo.dataset.dia + 'T12:00').toLocaleDateString('pt-BR') + '.'); return; }
      tira(d.id);
      if (alvo.dataset.alvo === 'caixa') E.caixa.splice(pos, 0, d.id);
      else if (alvo.dataset.alvo === 'lista') lista(alvo.dataset.l).cartoes.splice(pos, 0, d.id);
      if (C(d.id).novo && alvo.dataset.alvo !== 'caixa') C(d.id).novo = false;
    } else {
      const q = Q(); const l = lista(d.id);
      const ordem = [...$('.listas').children].filter((c) => (c.classList.contains('lw') && c !== d.el) || c === d.vaga);
      const pos = ordem.indexOf(d.vaga);
      q.listas.splice(q.listas.indexOf(l), 1); q.listas.splice(pos, 0, l);
    }
    render();
  });
  carrega().catch(() => { render(); aviso('Sem conexão com o banco: nada do que mudar agora será guardado.'); });
})();
