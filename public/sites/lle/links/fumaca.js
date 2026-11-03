/* fumaca.js (lle.sh, 11/10/2026): a fumaça colorida do mouse (o fluido do modelo innoviseagency.netlify.app, em /sites/lle/links/fluido.js)
   + um pontinho piscando no canto de baixo, à direita; tocar nele abre o controle: a cor (as 7 da paleta) e a força (mais fraca ↔ mais forte).
   No celular também: o dedo arrastando faz a fumaça (o modelo já tinha toque).
   Uso: <script src="/sites/lle/links/fumaca.js" data-chave="links"></script>   (a escolha fica guardada neste navegador, por página) */
(function () {
  var eu = document.currentScript, CH = 'lle-' + (eu.getAttribute('data-chave') || 'links') + '-fumaca';
  var CORES = ['#F48591', '#FA8D85', '#FEA283', '#FFB872', '#8DA599', '#8D96C1', '#C18EA9'];
  var E = { cor: '#F48591', forca: 1 }; try { var g = JSON.parse(localStorage.getItem(CH) || 'null'); if (g) E = g } catch (e) {}

  var css = document.createElement('style');
  css.textContent =
    '#fluido-caixa{position:fixed;inset:0;width:100vw;height:100vh;z-index:44;pointer-events:none}#fluido-caixa #fluid{width:100%;height:100%;position:absolute}' +
    /* o pontinho: a bolinha que pulsa do badge (activitybadge), na cor da fumaça */
    '#fumaca-ponto{position:fixed;right:30px;bottom:calc(30px + env(safe-area-inset-bottom));z-index:37;width:30px;height:30px;padding:0;border:0;background:none;cursor:pointer;display:grid;place-items:center}' +
    '#fumaca-ponto i{position:absolute;left:10px;top:10px;width:10px;height:10px;border-radius:999px;background:var(--c);pointer-events:none}' +
    '#fumaca-ponto i.anel{opacity:0;animation:fumacaAnel 1.6s cubic-bezier(.44,0,.56,1) .4s infinite}' +
    '@keyframes fumacaAnel{0%{opacity:0;transform:scale(1)}1.5%{opacity:.75;transform:scale(1)}60%{opacity:0;transform:scale(2.4)}75%,100%{opacity:0;transform:scale(1)}}' +
    '#fumaca{position:fixed;right:68px;bottom:calc(23px + env(safe-area-inset-bottom));z-index:36;display:flex;align-items:center;gap:14px;height:44px;padding:0 22px;border-radius:100px;transition:opacity .25s,transform .35s cubic-bezier(.25,1,.35,1)}' +
    '#fumaca:not(.aberto){opacity:0;transform:translateX(12px);pointer-events:none}' +
    '#fumaca>*{position:relative;z-index:10}' +
    '#fumaca .cores{display:flex;gap:8px}' +
    '#fumaca .cor{width:16px;height:16px;padding:0;border-radius:50%;border:1px solid rgba(0,0,0,.12);box-shadow:0 0 0 2px rgba(255,255,255,.85),0 1px 3px rgba(0,0,0,.15);cursor:pointer}' +
    '#fumaca .cor.on{box-shadow:0 0 0 2px #fff,0 0 0 3.5px #1d1d1f}' +
    '#fumaca input{-webkit-appearance:none;appearance:none;width:110px;height:4px;border-radius:4px;background:rgba(0,0,0,.14);cursor:pointer}' +
    '#fumaca input::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#fff;border:1px solid rgba(0,0,0,.15);box-shadow:0 1px 3px rgba(0,0,0,.2)}' +
    '#fumaca input::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#fff;border:1px solid rgba(0,0,0,.15)}' +
    '#fumaca-ponto,#fumaca,#fumaca button,#fumaca input{outline:none;-webkit-tap-highlight-color:transparent}#fumaca :focus,#fumaca :focus-visible,#fumaca-ponto:focus,#fumaca-ponto:focus-visible{outline:none;box-shadow:none}' +
    'body:has(#app.foto-aberta) #fumaca,body:has(#app.foto-aberta) #fumaca-ponto{opacity:0;pointer-events:none}' +
    /* no celular (o dedo faz a fumaça também): tudo um pouco mais junto para caber ao lado do pontinho */
    '@media (max-width:760px){#fumaca-ponto{right:14px}#fumaca{right:46px;gap:10px;padding:0 16px;max-width:calc(100vw - 60px)}#fumaca .cores{gap:7px}#fumaca .cor{width:18px;height:18px}#fumaca input{width:64px}}';
  document.head.appendChild(css);

  function carrega(src) { return new Promise(function (ok, nao) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = nao; document.head.appendChild(s) }) }

  function comeca() {
    var cx = document.createElement('div'); cx.className = 'canvas-wrapper'; cx.id = 'fluido-caixa'; cx.innerHTML = '<canvas id="fluid"></canvas>';
    var app = document.getElementById('app'); if (app) { app.appendChild(cx); cx.style.zIndex = 18 } else document.body.appendChild(cx); // como o rastro antigo: a logo fica por cima
    var pt = document.createElement('button'); pt.type = 'button'; pt.id = 'fumaca-ponto'; pt.setAttribute('aria-label', 'cor e força da fumaça'); pt.innerHTML = '<i class="anel"></i><i></i>';
    var pn = document.createElement('div'); pn.id = 'fumaca'; pn.innerHTML = '<div class="cores"></div><input type="range" min="0.15" max="3" step="0.05" aria-label="força da fumaça">';
    document.body.appendChild(pn); document.body.appendChild(pt);
    var cs = pn.querySelector('.cores'), rg = pn.querySelector('input');
    function aplica() {
      var h = E.cor.replace('#', '');
      window.lleFumaca = { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255, forca: +E.forca };
      [].forEach.call(cs.children, function (b) { b.classList.toggle('on', b.dataset.c === E.cor) }); rg.value = E.forca;
      pt.style.setProperty('--c', E.cor);
      try { localStorage.setItem(CH, JSON.stringify(E)) } catch (e) {}
    }
    CORES.forEach(function (c) { var b = document.createElement('button'); b.type = 'button'; b.className = 'cor'; b.dataset.c = c; b.style.background = c; b.setAttribute('aria-label', c); b.onclick = function () { E.cor = c; aplica() }; cs.appendChild(b) });
    rg.addEventListener('input', function () { E.forca = +rg.value; aplica() });
    ['pointerdown', 'click', 'wheel', 'keydown'].forEach(function (t) { pn.addEventListener(t, function (e) { e.stopPropagation() }); pt.addEventListener(t, function (e) { e.stopPropagation() }) });
    pt.addEventListener('click', function () { pn.classList.toggle('aberto') });
    document.addEventListener('pointerdown', function () { pn.classList.remove('aberto') }); // tocar fora fecha
    aplica();
    (window.lleVidro ? Promise.resolve() : carrega('/sites/lle/links/vidro.js')).then(function () { window.lleVidro && lleVidro(pn) }).catch(function () { pn.style.background = 'rgba(255,255,255,.92)' });
    (window.lleFluido ? Promise.resolve() : carrega('/sites/lle/links/fluido.js')).then(function () { try { window.lleFluido() } catch (e) {} }).catch(function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', comeca); else comeca();
})();
