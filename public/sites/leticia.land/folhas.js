/* leticia.land (17/10/2026, pedido da Dra Lê): depois da primeira tela, as folhas chegam EM BRANCO e ela escreve com o lápis,
   no mesmo vermelho e com o mesmo efeito. Sempre uma folha vazia no fim. Banco só do leticia.land (api/folhas.js → leticia_land_folhas.folhas).
   Colar um link numa folha (escrevendo) = o site vira o fundo da folha inteira; o texto fica branco com sombra. Esc tira o fundo.
   Roda depois do edita.js e antes do encaixa.js. */
(function () {
  var g = document.querySelector('main'); if (!g) return;
  var primeira = g.querySelector('section'); if (!primeira) return;
  var linhas = [];
  try { var x = new XMLHttpRequest(); x.open('GET', '/api/folhas', false); x.send(); if (x.status === 200) linhas = JSON.parse(x.responseText) || []; } catch (e) {}
  var dona = (function () { try { var y = new XMLHttpRequest(); y.open('GET', '/api/editar', false); y.send(); return y.status === 200; } catch (e) { return false; } })();
  var por = {}, max = 0;
  linhas.forEach(function (l) { por[l.n] = l; if ((l.texto && l.texto.trim()) || l.link) max = Math.max(max, l.n); });

  var css = document.createElement('style');
  css.textContent =
    'section[data-folha]{position:relative;overflow:hidden}' +
    'section[data-folha] h2{position:relative;z-index:1;min-width:min(86vw,100%);min-height:.9em}' +
    'section[data-folha] .fundo{position:absolute;inset:0;z-index:0;width:100%;height:100%;border:0;display:block;pointer-events:none;background:#fafafa center top/cover no-repeat}' +
    'section[data-folha].comfundo h2{color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.5)}' +
    /* 17/10: a letra por cima do fundo é a MESMA do vermelho, também escrevendo (nada que o Chrome enfie no meio troca a fonte) */
    'main section[data-folha] h2,main section[data-folha] h2 *{font-family:S,Arial,sans-serif!important;font-weight:900!important;font-style:normal!important}' +
    'main section[data-folha] h2 *{font-size:inherit!important;letter-spacing:inherit!important;line-height:inherit!important;background:none!important}' +
    'html:not(.folhas-fonte) main section[data-folha] h2{visibility:hidden}' +
    'main section[data-folha].comfundo h2 .t{color:rgba(255,255,255,.35)}main section[data-folha].comfundo h2 .t.on{color:#fff}';
  document.head.appendChild(css);
  // a letra só aparece depois que a fonte do vermelho carregou (nunca uma fonte do sistema no lugar)
  (function () { var ok = function () { document.documentElement.classList.add('folhas-fonte'); };
    try { Promise.all([document.fonts.load('900 82px S', 'abc'), document.fonts.load('700 82px S', 'abc')]).then(ok, ok); } catch (e) { ok(); } setTimeout(ok, 3000); })();

  function poeTexto(h, t) { h.textContent = ''; String(t || '').split('\n').forEach(function (p, i) { if (i) h.appendChild(document.createElement('br')); if (p) h.appendChild(document.createTextNode(p)); }); }
  function plano(el) { var s = ''; for (var n = el.firstChild; n; n = n.nextSibling) { if (n.nodeType === 3) s += n.nodeValue; else if (n.nodeType === 1) { if (n.tagName === 'BR') s += '\n'; else { if (n.tagName === 'DIV' && s && s.slice(-1) !== '\n') s += '\n'; s += plano(n); } } } return s; }
  function poeFundo(sec, link, fundo) {
    var f = sec.querySelector('.fundo'); if (f) f.remove();
    sec.classList.toggle('comfundo', !!link);
    if (!link) return;
    if (fundo) { f = document.createElement('div'); f.style.backgroundImage = 'url("' + fundo + '")'; }
    else { f = document.createElement('iframe'); f.src = link; f.setAttribute('loading', 'lazy'); f.setAttribute('tabindex', '-1'); f.setAttribute('inert', ''); f.title = 'fundo'; } /* 17/10: o site de fundo nunca pega o foco (a tela de entrar dele roubava o que ela escrevia) */
    f.className = 'fundo'; sec.insertBefore(f, sec.firstChild);
  }
  function folha(n) {
    var s = document.createElement('section'); s.className = 'cima'; s.setAttribute('data-folha', n);
    var h = document.createElement('h2'); h.setAttribute('data-ed-host', ''); s.appendChild(h);
    var l = por[n]; if (l) { poeTexto(h, l.texto); poeFundo(s, l.link, l.fundo); }
    return s;
  }
  var depois = primeira;
  for (var n = 1; n <= max + 1; n++) { var s = folha(n); depois.after(s); depois = s; }
  if (!dona) return;

  // a dona escreve
  var ultimo = {}, timer = 0, editada = null;
  function folhas() { return [].slice.call(g.querySelectorAll('section[data-folha]')); }
  folhas().forEach(function (s) { ultimo[s.dataset.folha] = plano(s.querySelector('h2')); });
  function post(corpo, keep) { return fetch('/api/folhas', { method: 'POST', keepalive: !!keep, credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) }); }
  function grava(keep) {
    clearTimeout(timer);
    folhas().forEach(function (s) {
      var n = s.dataset.folha, t = plano(s.querySelector('h2'));
      if (t === ultimo[n]) return; ultimo[n] = t;
      post({ n: +n, texto: t }, keep).then(function (r) { if (!r.ok) { delete ultimo[n]; agenda(); } }).catch(function () { delete ultimo[n]; agenda(); });
    });
  }
  function agenda() { clearTimeout(timer); timer = setTimeout(grava, 800); }
  function novaNoFim() {
    var fs = folhas(), u = fs[fs.length - 1];
    if (plano(u.querySelector('h2')).trim() || u.classList.contains('comfundo')) { var s = folha(+u.dataset.folha + 1); u.after(s); if (ligado()) liga(s.querySelector('h2'), true); }
  }
  // 17/10: o cursor vai sozinho para o fim do texto da folha (ela escreve sem precisar achar onde clicar)
  function cursorNoFim(sec) { var h = sec && sec.querySelector('h2'); if (!h || !ligado()) return; h.focus({ preventScroll: true }); var r = document.createRange(); r.selectNodeContents(h); r.collapse(false); var sl = getSelection(); sl.removeAllRanges(); sl.addRange(r); }
  function ligado() { return document.documentElement.classList.contains('ed-on'); }
  function liga(h, on) { if (on) { h.setAttribute('contenteditable', 'true'); h.setAttribute('spellcheck', 'false'); } else h.removeAttribute('contenteditable'); }
  var antes = ligado();
  new MutationObserver(function () {
    var on = ligado(); if (on === antes) return; antes = on;
    folhas().forEach(function (s) { liga(s.querySelector('h2'), on); });
    if (on) { var v0 = naTela(); if (v0 && v0.hasAttribute('data-folha')) setTimeout(function () { cursorNoFim(v0); }, 0); }
    if (!on) { grava(); novaNoFim(); if (editada && window.__encaixa) { window.__encaixa.chega(editada); } editada = null; }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('input', function (e) { var s = e.target.closest && e.target.closest('section[data-folha]'); if (s && ligado()) { editada = s; agenda(); } }, true);
  document.addEventListener('focusout', function (e) { if (e.target.closest && e.target.closest('section[data-folha]')) grava(); }, true);
  addEventListener('pagehide', function () { grava(true); });
  // colar um link = o site vira o fundo da folha (vem antes do colar do edita.js)
  // 17/10: vale colar em QUALQUER lugar da folha que está na tela (com o cursor no texto ou não); a 1ª tela fica como está
  function naTela() { var ss = g.children; for (var k = 0; k < ss.length; k++) { var r = ss[k].getBoundingClientRect(); if (r.left > -innerWidth / 2 && r.left < innerWidth / 2) return ss[k]; } return null; }
  addEventListener('paste', function (e) {
    if (!ligado()) return;
    var s = e.target.closest && e.target.closest('section[data-folha]');
    if (!s) { if (e.target.closest && e.target.closest('[data-ed-host]')) return; var v = naTela(); s = v && v.hasAttribute('data-folha') ? v : null; }
    if (!s) return;
    var cd = e.clipboardData || window.clipboardData; if (!cd) return;
    var t = (cd.getData('text/plain') || cd.getData('text/uri-list') || '').trim();
    if (!/^https?:\/\/\S+$/i.test(t)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    poeFundo(s, t, null); editada = s; cursorNoFim(s);
    post({ n: +s.dataset.folha, link: t }).then(function (r) { return r.json(); }).then(function (o) { if (o && o.ok) poeFundo(s, o.link, o.fundo); }).catch(function () {});
  }, true);
  // se mesmo assim um site de fundo puxar o foco, o cursor volta para o texto da folha
  addEventListener('blur', function () { setTimeout(function () { var a = document.activeElement; if (ligado() && a && a.classList && a.classList.contains('fundo')) { a.blur(); cursorNoFim(a.closest('section[data-folha]')); } }, 0); });
  // tocar em qualquer lugar da folha (fora das letras) = cursor no fim do texto dela
  document.addEventListener('pointerdown', function (e) {
    if (!ligado() || !e.target.closest || e.target.closest('h2,#ed-pilula')) return;
    var s = e.target.closest('section[data-folha]'); if (!s) return;
    e.preventDefault(); e.stopImmediatePropagation(); cursorNoFim(s);
  }, true);
  addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !ligado()) return;
    var s = e.target.closest && e.target.closest('section[data-folha].comfundo'); if (!s) return;
    e.preventDefault(); poeFundo(s, null); post({ n: +s.dataset.folha, link: '' });
  }, true);
})();
