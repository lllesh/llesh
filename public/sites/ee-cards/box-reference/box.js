
(() => {
  // AS DUAS CAIXINHAS de ee.cards — abrir a caixinha leva pra dentro dela
  const F = (deck, n) => '/box-reference/caixa/img/' + deck + '/' + n + '.jpg';
  const face = (deck) => ({
    frente:F(deck,'frente'), verso:F(deck,'verso'),
    ladoA:F(deck,'ladoa'),  ladoB:F(deck,'ladob'),
    topo:F(deck,'topo'),    base:F(deck,'base')
  });
  const deck = new URLSearchParams(location.search).get('deck') || '';
  const next = '/cartas' + (deck ? '?deck=' + encodeURIComponent(deck) : '');
  const meta=window.eeActiveDeck;const jogos=[{nome:meta.name,vai:next,cor:'#FFF7E9',capa:'#805F4C',frente:meta.art,verso:meta.slug==='femea'?'/box-reference/caixa/img/leticia/verso.png':meta.art}];





  // A FITA: os books repetidos pros dois lados, a caixinha inicial NO MEIO.
  // Assim dá pra passar pra esquerda e pra direita sem fim, e nunca trava na ponta.
  // SÓ AS REDONDINHAS: um deck por tela, na caixinha de cantos arredondados.
  // (a versão com as duas — quadrada e redonda — ficou guardada no backup)
  const pares = jogos.map(j => ({ ...j, modelo:'r' }));
  const REP = 1;                                  // uma volta de folga de cada lado (a fita se recentra sozinha)
  const BLOCO = pares.length;
  const fita = [];
  for (let r = 0; r < REP; r++) pares.forEach(j => fita.push(j));
  const MEIO = Math.floor(REP / 2) * BLOCO;       // onde a fita começa: a 1ª caixinha, no meio

  const trilho = document.getElementById('trilho');
  const caixas = [];


  const molde = (i) => {
    const n = fita[i].nome;                  // cada caixinha passa o nome dela atrás
    // UMA caixinha por tela: primeiro a quadrada do deck, depois a redonda dele
    const corpo = fita[i].modelo === 'r'
    ? `
      <div class="caixinha"${fita[i].capa ? ` style="--cx-cor:${fita[i].capa}"` : ''}>
        <div class="cx-palco">
          <div class="cx" role="button" tabindex="0" aria-label="${n} — modelo redondo. gire com o dedo, toque para abrir">
            <i class="cx-folha cx-folha--frente">${fita[i].frente
              // tem arte → a arte dela na capa. Sem arte → capa lisa, na cor do
              // próprio projeto (nada escrito por cima: o nome passa atrás, no marquee).
              ? `<span class="cx-arte" style="background-image:url('${fita[i].frente}')"></span>`
              : ''}</i>
            <i class="cx-folha cx-folha--verso">${fita[i].verso
              ? `<span class="cx-arte" style="background-image:url('${fita[i].verso}')"></span>`
              : ''}</i>
          </div>
          <span class="cx-sombra" aria-hidden="true"></span>
        </div>
      </div>`
    : `
      <div class="sombra"></div>
      <div class="caixa">
        <div class="face tras"><img src="${fita[i].verso}" alt=""></div>
        <div class="face lado esq"></div>
        <div class="face lado dir"></div>
        <div class="face tampa topo"></div>
        <div class="face tampa base"></div>
        <div class="folhas"><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div class="charneira">
          <div class="capa">
            <div class="face frente"><img src="${fita[i].frente}" alt=""></div>
            <i class="guarda"></i>
          </div>
        </div>
      </div>`;
    return `
    <div class="slot">
      <div class="marquee"><span>${n} · ${n} · ${n} · </span><span>${n} · ${n} · ${n} · </span></div>
      ${corpo}
    </div>`;
  };
  trilho.innerHTML = fita.map((_, i) => molde(i)).join('');
  // entrega a cada caixinha os painéis dela: lombadas, topo e base
  [...trilho.querySelectorAll('.slot')].forEach((sl, i) => {
    const j = fita[i];
    sl.style.setProperty('--ladoA', `url("${j.ladoA}")`);
    sl.style.setProperty('--ladoB', `url("${j.ladoB}")`);
    sl.style.setProperty('--topo',  `url("${j.topo}")`);
    sl.style.setProperty('--base',  `url("${j.base}")`);
  });

  const slots = [...trilho.querySelectorAll('.slot')];
  const QUANTAS = fita.length;
  let atual = MEIO;

  slots.forEach((slot) => {
    const el = slot.querySelector('.caixa');
    const c = { el, slot, sombra: slot.querySelector('.sombra'),
                ry:-18, rx:4, vy:0, vx:0, drag:null, idle:0, aberta:false, desce:0, rastro:0, semPlastico:true, tampa:0, fora:null };
    caixas.push(c);
    // tela do modelo REDONDO: não tem caixa quadrada, o motor dela é o de baixo
    if (!el) return;

    el.addEventListener('pointerdown', e => {
      const r = el.getBoundingClientRect();
      // dedo na BOCA do livro (a borda de fora da capa, do lado direito) = puxar a capa
      // e abrir PRO LADO, como se abre um livro de verdade
      const naBoca = c.aberta ? true : e.clientX > r.left + r.width * 0.70;
      if (naBoca) {
        c.puxaCapa = { x:e.clientX, base:c.tampa };
        const larg = Math.max(120, r.width * 0.78);
        const mover = (ev) => {
          if (!c.puxaCapa) return;
          const d = c.puxaCapa.x - ev.clientX;           // puxar pra ESQUERDA abre
          poeCapa(c, Math.max(0, Math.min(1, c.puxaCapa.base + d / larg)));
        };
        const largar = () => {
          window.removeEventListener('pointermove', mover);
          window.removeEventListener('pointerup', largar);
          window.removeEventListener('pointercancel', largar);
          if (!c.puxaCapa) return;
          const mexeu = Math.abs(c.tampa - c.puxaCapa.base) > .02;
          c.puxaCapa = null;
          if (!mexeu) { c.aberta ? fecha(c) : abre(c); return; }   // só encostou = abre/fecha
          (c.tampa > .35) ? abre(c) : fecha(c);
        };
        window.addEventListener('pointermove', mover);
        window.addEventListener('pointerup', largar);
        return;
      }
      c.drag = { x:e.clientX, y:e.clientY, ry:c.ry, rx:c.rx, t:performance.now(), moveu:false };
      c.vy = c.vx = 0; c.idle = 0;
      el.classList.add('is-drag'); el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', e => {
      if (c.puxaCapa) {                                      // a capa acompanha o dedo
        const d = c.puxaCapa.x - e.clientX;
        const larg = Math.max(120, el.getBoundingClientRect().width * 0.78);
        poeCapa(c, Math.max(0, Math.min(1, c.puxaCapa.base + d / larg)));
        return;
      }
      if (!c.drag) return;
      const dx = e.clientX - c.drag.x, dy = e.clientY - c.drag.y;
      if (Math.hypot(dx,dy) > 4) c.drag.moveu = true;
      const nry = c.drag.ry + dx * 0.55;
      const nrx = c.drag.rx - dy * 0.5;          // sem trava: vira 360°, de cabeça pra baixo
      c.vy = (nry - c.ry) * 0.55; c.vx = (nrx - c.rx) * 0.55;
      c.ry = nry; c.rx = nrx;
    });
    const solta = e => {
      if (!c.drag) return;
      const toque = !c.drag.moveu && performance.now() - c.drag.t < 220;
      // JOGAR PRO LADO em cima da própria caixinha = passa pra próxima
      // (só num gesto horizontal e rápido; arrasto calmo continua girando a caixa)
      // sem limite de tempo: o que manda é o TANTO que andou pro lado (previsível,
      // rápido ou devagar dá no mesmo). De lado o bastante = passa; pouco ou pra
      // cima/baixo = continua girando a caixa.
      const ddx = e.clientX - c.drag.x, ddy = e.clientY - c.drag.y;
      const joga = Math.abs(ddx) > window.innerWidth * 0.62 && Math.abs(ddx) > Math.abs(ddy) * 3;
      c.drag = null; el.classList.remove('is-drag');
      try { el.releasePointerCapture(e.pointerId); } catch {}
      if (joga && !c.aberta) { c.vy = c.vx = 0; corre(ddx < 0 ? 1 : -1); return; }
      // com o plástico ainda na caixa, o toque não abre: tem que puxar a pontinha
      if (toque && c.semPlastico) c.aberta ? fecha(c) : abre(c);
    };
    el.addEventListener('pointerup', solta);
    el.addEventListener('pointercancel', solta);

  });

  // ===== LIVRETINHO: a capa vira na lombada e o livro abre pro lado =====
  // t = 0 fechado · 1 escancarado (capa deitada do lado esquerdo)
  const ABERTURA = 158;                       // quanto a capa gira, em graus
  function poeCapa(c, t){
    if (!c || !c.el) return;
    c.tampa = t;
    const cap = c.el.querySelector('.charneira');
    cap.style.transition = 'none';
    cap.style.transform = `rotateY(${-ABERTURA*t}deg)`;
    c.vy = 0; c.vx = 0;
  }
  function abre(c){
    if (!c || !c.el) return;
    c.aberta = true; c.tampa = 1;
    const cap = c.el.querySelector('.charneira');
    cap.style.transition = 'transform .72s cubic-bezier(.25,1.12,.35,1)';
    cap.style.transform = `rotateY(${-ABERTURA}deg)`;
    entra(c);                                   // abriu a caixinha = entra no que tem dentro
  }

  // ===== abriu a caixinha: a página de dentro vem =====
  let entrando = false;
  function entra(c){ entraIdx(caixas.indexOf(c)); }
  function entraIdx(i){
    const vai = fita[i] && fita[i].vai;
    if (!vai || entrando) return;
    entrando = true;
    const veu = document.createElement('div');
    veu.className = 'veu';
    const corDentro = fita[i].cor || '#131315';
    veu.style.background = corDentro;
    // a página inteira vai junto: caixa preta não pode abrir numa folha creme.
    // (ordem da Le, 09/08/2026) — o fundo, o tema do navegador e o miolo da
    // caixinha viram a cor de dentro dela.
    document.documentElement.style.background = corDentro;
    document.body.style.background = corDentro;
    const tema = document.querySelector('meta[name="theme-color"]');
    if (tema) tema.setAttribute('content', corDentro);
    document.body.appendChild(veu);
    requestAnimationFrame(() => veu.classList.add('cheio'));
    location.href = vai;
  }
  function fecha(c){
    if (!c || !c.el) return;
    c.aberta = false; c.tampa = 0;
    const cap = c.el.querySelector('.charneira');
    cap.style.transition = 'transform .62s cubic-bezier(.3,1.1,.4,1)';
    cap.style.transform = 'rotateY(0deg)';
    c.fora = null;
  }

  // gira até ficar de frente antes de abrir
  function endireita(c, pronto){
    const ry0 = ((c.ry % 360) + 360) % 360, alvo = ry0 > 180 ? 360 : 0;
    const rx0 = c.rx, t0 = performance.now(), dur = 420;
    (function p(){
      const t = Math.min(1,(performance.now()-t0)/dur), e = 1 - Math.pow(1-t,3);
      c.ry = ry0 + (alvo - ry0)*e; c.rx = rx0 + (0 - rx0)*e;
      if (t < 1) requestAnimationFrame(p); else pronto();
    })();
  }

  // ===== puxar uma cartinha =====
  // ===== trilho: passar de caixinha só com gesto deliberado =====
  const irPara = (i) => { const s = slots[i]; return s.offsetLeft + s.offsetWidth/2 - trilho.clientWidth/2; };
  trilho.scrollLeft = irPara(atual);

  let correndo = null;
  function corre(passo){
    if (correndo) return;
    const alvo = atual + passo;
    if (alvo < 0 || alvo > QUANTAS-1) return;
    fecha(caixas[atual]);
    const de = trilho.scrollLeft, pra = irPara(alvo), dist = pra - de, dur = 620, t0 = performance.now();
    correndo = true;
    const chegando = caixas[alvo];
    (function p(){
      const t = Math.min(1,(performance.now()-t0)/dur);
      trilho.scrollLeft = de + dist * (1 - Math.pow(1-t, 4.2));
      chegando.rastro = Math.max(0, 1 - t*1.55);
      if (t < 1) requestAnimationFrame(p);
      else { trilho.scrollLeft = pra; atual = alvo; correndo = null; chegando.rastro = 0; recentra(); }
    })();
  }
  // volta pro bloco do meio da fita — a mesma caixinha, sem a pessoa ver, pra
  // nunca chegar no fim de nenhum dos dois lados
  function recentra(){
    const igual = MEIO + ((atual % BLOCO) + BLOCO) % BLOCO;
    if (igual === atual) return;
    const de = caixas[atual], pra = caixas[igual];
    pra.ry = de.ry; pra.rx = de.rx; pra.vy = de.vy; pra.vx = de.vx;
    de.ry = -18; de.rx = 4; de.vy = de.vx = 0;
    atual = igual;
    trilho.scrollLeft = irPara(atual);
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') corre(1);
    if (e.key === 'ArrowLeft')  corre(-1);
  });

  // a caixinha NUNCA fica no meio do caminho: se a janela muda de tamanho
  // (a lateral do ee.cards abre e fecha por fora), ela volta pro centro na hora
  const centraDeNovo = () => { if (!correndo) trilho.scrollLeft = irPara(atual); };
  window.addEventListener('resize', centraDeNovo);
  if (window.ResizeObserver) new ResizeObserver(centraDeNovo).observe(trilho);

  let nav = null;
  trilho.addEventListener('pointerdown', e => {
    if (e.target.closest('.caixa') || e.target.closest('.caixinha')) return;
    nav = { x:e.clientX, t:performance.now(), base: trilho.scrollLeft };
  });
  trilho.addEventListener('pointermove', e => {
    if (!nav || correndo) return;
    trilho.scrollLeft = nav.base - (e.clientX - nav.x) * 0.32;
  });
  const soltaNav = e => {
    if (!nav) return;
    const dx = e.clientX - nav.x, dt = performance.now() - nav.t;
    const forte = Math.abs(dx) > window.innerWidth*0.38 || (Math.abs(dx) > 90 && dt < 220);
    nav = null;
    if (forte && !correndo) corre(dx < 0 ? 1 : -1); else volta();
  };
  trilho.addEventListener('pointerup', soltaNav);
  trilho.addEventListener('pointercancel', soltaNav);
  function volta(){
    const de = trilho.scrollLeft, pra = irPara(atual), t0 = performance.now();
    (function p(){
      const t = Math.min(1,(performance.now()-t0)/260);
      trilho.scrollLeft = de + (pra-de)*(1 - Math.pow(1-t,3));
      if (t < 1) requestAnimationFrame(p);
    })();
  }

  const IDLE = .18;
  function tick(){
    const meio = window.innerWidth/2;
    for (const c of caixas){
      if (!c.el) continue;                       // tela do modelo redondo: motor próprio
      if (!c.drag && !c.aberta){
        c.ry += c.vy; c.rx += c.vx;
        c.vy *= .955; c.vx *= .965;
      }
      const r0 = c.slot.getBoundingClientRect();
      if (r0.right < -80 || r0.left > window.innerWidth + 80) continue;
      const t = c.tampa || 0;                                  // o quanto o livro está aberto
      const desvio = ((r0.left + r0.width/2) - meio) / meio;
      const v = c.rastro || 0;
      // livro abrindo: encolhe (aberto ocupa duas larguras) e anda pra DIREITA,
      // porque a lombada — que é o meio do livro aberto — fica na borda esquerda do miolo
      const escala = (1 - v*.06) * (1 - t*.44);
      c.desce += ((t * 50 * escala) - c.desce) * .14;
      if (!c.drag && t > 0){
        c.rx += ((-5 * t) - c.rx) * .10;                        // inclina de leve pra ver as páginas
        c.ry += ((0 - c.ry) * .12);                             // vira de frente sozinho
      }
      const ry = c.ry + desvio * 26 * (1 - t);
      c.el.style.transform =
        `translateX(${c.desce}%) rotateX(${c.rx}deg) rotateY(${ry}deg) scale(${escala}) translateZ(${-v*120}px)`;
      c.el.style.filter = v > .02 ? `blur(${v*7}px)` : '';

      const r = ry*Math.PI/180, rX = c.rx*Math.PI/180;
      const largura = (Math.abs(Math.cos(r)) + Math.abs(Math.sin(r))*.28) * (1 + t*.85);
      const altura = .35 + Math.abs(Math.cos(rX))*.65;
      c.sombra.style.transform = `translate(-50%,-50%) translateX(${Math.sin(r)*16 + t*6}px) scale(${.55 + largura*.5}, ${altura})`;
      c.sombra.style.opacity = (.42 + largura*.3) * (1 - v*.7);
    }
    requestAnimationFrame(tick);
  }
  // A CINTA — as tabuinhas que contornam a caixa, encostadas uma na outra.
  // Serve pras caixinhas dos decks e pra caixinha da paleta.
  function cinta(w, h, r){
    const p = [];
    const arco = (cx, cy, a0, a1, n = 26) => {
      for (let k = 0; k <= n; k++){
        const a = a0 + ((a1 - a0) * k) / n;
        p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      }
    };
    p.push([r, 0]); p.push([w - r, 0]);
    arco(w - r, r, -Math.PI / 2, 0);
    p.push([w, h - r]);
    arco(w - r, h - r, 0, Math.PI / 2);
    p.push([r, h]);
    arco(r, h - r, Math.PI / 2, Math.PI);
    p.push([0, r]);
    arco(r, r, Math.PI, Math.PI * 1.5);
    const tabuas = [];
    for (let k = 0; k < p.length - 1; k++){
      const [x1, y1] = p[k], [x2, y2] = p[k + 1];
      const len = Math.hypot(x2 - x1, y2 - y1);
      if (len < 0.4) continue;
      tabuas.push({ len: len + 2.2,            // sobra maior: na caixinha escura a fresta aparecia
                    x: (x1 + x2) / 2, y: (y1 + y2) / 2,
                    ang: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI });
    }
    return tabuas;
  }

  // veste uma caixinha: põe as folhas na profundidade e monta a cinta em volta
  // RÉGUA DA GROSSURA — pra Le achar o ponto sem esperar deploy nenhum:
  // ponha ?g=28 no fim do endereço (28 = 28% de lombada no celular).
  // Sem ?g, valem os números fixos daqui, que são os mesmos do CSS.
  const _q = new URLSearchParams(location.search).get('g');
  const GROSSO_C = _q ? (parseFloat(_q) / 100) : 0.2500;   // celular: média, fechado
  const GROSSO_D = 0.1350;   // DESKTOP = femea.live clonado, fixo. A régua ?g só mexe no CELULAR.
  if (_q) document.documentElement.style.setProperty('--d', `calc(var(--w) * ${GROSSO_C})`);

  function vesteCaixa(cx, w, h){
    // a lombada e o raio seguem sempre a MENOR medida da face — assim a caixa
    // deitada (desktop) fica com a mesma lombada da caixa em pé (celular)
    const m = Math.min(w, h);
    // DESKTOP = a do femea.live (13,5% e 5,5%, sobre a LARGURA).
    // CELULAR = o MIX (19,89% e 10%, sobre a menor medida).
    // Os mesmos números do CSS — se mudar lá, muda aqui.
    const fem = window.matchMedia('(min-width: 1024px)').matches;
    const d = fem ? w * GROSSO_D : m * GROSSO_C;
    const r = fem ? w * 0.055  : m * 0.100;
    cx.querySelectorAll('.cx-tabua').forEach(t => t.remove());
    const f = cx.querySelector('.cx-folha--frente'), v = cx.querySelector('.cx-folha--verso');
    if (f) f.style.transform = `translateZ(${d / 2}px)`;
    if (v) v.style.transform = `translateZ(${-d / 2}px) rotateY(180deg)`;
    const frag = document.createDocumentFragment();
    cinta(w, h, r).forEach(t => {
      const b = document.createElement('i');
      b.className = 'cx-tabua';
      const luz = Math.abs(Math.cos((t.ang * Math.PI) / 180));
      b.style.cssText =
        `width:${t.len}px; height:${d + 1.6}px;` +
        `left:${t.x - t.len / 2}px; top:${t.y - (d + 1.6) / 2}px;` +
        `transform: rotateZ(${t.ang}deg) rotateX(90deg);` +
        `background: color-mix(in oklab, var(--cx-cor) ${(76 - 18 * luz).toFixed(1)}%, #000 ${(24 + 18 * luz).toFixed(1)}%);`;
      frag.appendChild(b);
    });
    cx.appendChild(frag);

  }

  // ===================================================================
  // MODELO REDONDO — o motor da caixinha de cantos arredondados,
  // trazida do line.braee.in (CaixinhaDia.jsx). É um BLOCO MACIÇO:
  // duas folhas (frente e verso) e uma CINTA de tábuas que dá a volta
  // no contorno — é ela que faz o canto sair redondo sem abrir fresta.
  // Gira com o dedo e segue com inércia; toque abre.
  // ===================================================================
  (function modeloRedondo(){
    // a cor da lateral sai da PRÓPRIA arte do deck — nada de cor inventada
    const corDaArte = (src) => new Promise((ok) => {
      const im = new Image();
      im.onload = () => {
        try {
          const cv = document.createElement('canvas');
          cv.width = cv.height = 24;
          const g = cv.getContext('2d');
          g.drawImage(im, 0, 0, 24, 24);
          const d = g.getImageData(0, 0, 24, 24).data;
          let r = 0, v = 0, b = 0, n = 0;
          for (let k = 0; k < d.length; k += 4){ r += d[k]; v += d[k+1]; b += d[k+2]; n++; }
          ok(`rgb(${Math.round(r/n)},${Math.round(v/n)},${Math.round(b/n)})`);
        } catch (_) { ok(null); }
      };
      im.onerror = () => ok(null);
      im.src = src;
    });

    slots.forEach((slot, i) => {
      const box = slot.querySelector('.caixinha');
      const el  = slot.querySelector('.cx');
      if (!box || !el) return;

      corDaArte(fita[i].frente).then(cor => { if (cor) box.style.setProperty('--cx-cor', cor); });

      // veste a caixa: põe as folhas na profundidade e monta a cinta
      let feita = '';
      const veste = () => {
        const w = el.offsetWidth, h = el.offsetHeight;
        if (!w || !h) return;
        const chave = `${w}x${h}`;
        if (chave === feita) return;
        feita = chave;
        vesteCaixa(el, w, h);
      };
      veste();
      new ResizeObserver(veste).observe(el);

      // o giro: o dedo leva junto, solta e ela segue e freia macio
      const c = { rx: 4, ry: -18, vx: 0, vy: 0, drag: null, parado: 0 };
      (function passo(){
        if (!c.drag){
          c.rx += c.vx; c.ry += c.vy;
          c.vx *= 0.972; c.vy *= 0.972;
          if (Math.abs(c.vx) < 0.012) c.vx = 0;
          if (Math.abs(c.vy) < 0.012) c.vy = 0;
          if (!c.vx && !c.vy){ c.parado++; if (c.parado > 70) c.ry += 0.09; }  // parada, roda devagarinho
          else c.parado = 0;
        }
        el.style.transform = `rotateX(${c.rx}deg) rotateY(${c.ry}deg)`;
        requestAnimationFrame(passo);
      })();

      el.addEventListener('pointerdown', e => {
        c.drag = { x: e.clientX, y: e.clientY, rx: c.rx, ry: c.ry, t: performance.now(), moveu: false };
        c.vx = c.vy = 0; c.parado = 0;
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
      });
      el.addEventListener('pointermove', e => {
        if (!c.drag) return;
        const dx = e.clientX - c.drag.x, dy = e.clientY - c.drag.y;
        if (Math.hypot(dx, dy) > 3) c.drag.moveu = true;
        const nry = c.drag.ry + dx * 0.9;       // sem trava: vira 360°
        const nrx = c.drag.rx - dy * 0.75;
        c.vy = nry - c.ry; c.vx = nrx - c.rx;
        c.ry = nry; c.rx = nrx;
        e.preventDefault();
      }, { passive: false });
      const solta = e => {
        if (!c.drag) return;
        const dx = e.clientX - c.drag.x, dy = e.clientY - c.drag.y;
        const toque = !c.drag.moveu && performance.now() - c.drag.t < 260;
        // jogar pro lado em cima da caixinha = passa pro próximo deck
        const joga = Math.abs(dx) > window.innerWidth * 0.62 && Math.abs(dx) > Math.abs(dy) * 3;
        c.drag = null;
        try { el.releasePointerCapture(e.pointerId); } catch (_) {}
        if (joga){ c.vx = c.vy = 0; corre(dx < 0 ? 1 : -1); return; }
        if (toque) entraIdx(i);
      };
      el.addEventListener('pointerup', solta);
      el.addEventListener('pointercancel', solta);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); entraIdx(i); }
      });
    });
  })();

  document.getElementById('macazinha').addEventListener('click',()=>{location.href='/decks'});
  tick();
})();
