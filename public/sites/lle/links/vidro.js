/* vidro.js (lle.sh/links, 09/10/2026): a pílula de vidro líquido do modelo que a Dra Lê mandou (hungry-empathy-610677.framer.app),
   portada do componente dele (mesmo filtro SVG com feDisplacementMap, mesmas camadas, mesmos valores do modelo).
   window.lleVidro(el, props) transforma el numa superfície de vidro; o conteúdo dele fica por cima (z-index 10). */
(function () {
  var PADRAO = { borderRadius: 100, borderWidth: .05, brightness: 100, glassOpacity: .29, blur: 4, displace: .8, liquidBlur: 1, backgroundOpacity: .04, saturation: .6, distortionScale: -160, chromaAmount: 0, centerStability: 0 };
  var NS = 'http://www.w3.org/2000/svg', n = 0;
  function el(tag, at, pai) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (pai) pai.appendChild(e); return e }
  function suportaUrl() {
    var ua = navigator.userAgent, chrome = /Chrome\//.test(ua) && !/Edg\//.test(ua), edge = /Edg\//.test(ua);
    if (!chrome && !edge) return false;
    var d = document.createElement('div'); d.style.backdropFilter = 'url(#x)'; return d.style.backdropFilter !== '';
  }
  window.lleVidro = function (alvo, props) {
    var p = {}; for (var k in PADRAO) p[k] = PADRAO[k]; for (k in props || {}) p[k] = props[k];
    var id = 'lv' + (++n), gf = 'gf-' + id, rg = 'rg-' + id, bg = 'bg-' + id;
    var escuro = false; // a página é clara (creme)
    var temBF = CSS.supports('backdrop-filter', 'blur(10px)') || CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
    var url = suportaUrl();
    var sombra = '0 0 2px 1px rgba(0,0,0,0.15) inset, 0 0 10px 4px rgba(0,0,0,0.10) inset, 0 4px 16px rgba(17,17,26,0.05), 0 8px 24px rgba(17,17,26,0.05), 0 16px 56px rgba(17,17,26,0.05), 0 4px 16px rgba(17,17,26,0.05) inset, 0 8px 24px rgba(17,17,26,0.05) inset, 0 16px 56px rgba(17,17,26,0.05) inset';
    var s = alvo.style; s.borderRadius = p.borderRadius + 'px'; s.overflow = 'hidden'; s.isolation = 'isolate';
    if (url) { s.background = 'hsl(0 0% 100% / ' + p.backgroundOpacity + ')'; s.backdropFilter = s.webkitBackdropFilter = 'url(#' + gf + ') saturate(' + p.saturation + ')'; s.boxShadow = sombra }
    else if (temBF) { s.boxShadow = sombra }
    else { s.background = 'rgba(255,255,255,0.45)'; s.boxShadow = '0 0 2px 1px rgba(0,0,0,0.10) inset, 0 0 8px 3px rgba(0,0,0,0.06) inset, inset 0 1px 0 rgba(255,255,255,0.45)' }
    // o filtro (igual ao do modelo)
    var svg = el('svg', { style: 'width:100%;height:100%;pointer-events:none;position:absolute;inset:0;opacity:0;z-index:-10' });
    var f = el('filter', { id: gf, 'color-interpolation-filters': 'sRGB', x: '0%', y: '0%', width: '100%', height: '100%' }, el('defs', {}, svg));
    var img = el('feImage', { x: 0, y: 0, width: '100%', height: '100%', preserveAspectRatio: 'none', result: 'map' }, f);
    var dR = el('feDisplacementMap', { in: 'SourceGraphic', in2: 'map', result: 'dispRed' }, f);
    el('feColorMatrix', { in: 'dispRed', type: 'matrix', values: '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0', result: 'red' }, f);
    var dG = el('feDisplacementMap', { in: 'SourceGraphic', in2: 'map', result: 'dispGreen' }, f);
    el('feColorMatrix', { in: 'dispGreen', type: 'matrix', values: '0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0', result: 'green' }, f);
    var dB = el('feDisplacementMap', { in: 'SourceGraphic', in2: 'map', result: 'dispBlue' }, f);
    el('feColorMatrix', { in: 'dispBlue', type: 'matrix', values: '0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0', result: 'blue' }, f);
    el('feBlend', { in: 'red', in2: 'green', mode: 'screen', result: 'rg' }, f);
    el('feBlend', { in: 'rg', in2: 'blue', mode: 'screen', result: 'output' }, f);
    var fa = el('feFuncA', { type: 'linear', slope: '0.45' }, el('feComponentTransfer', { in: 'output', result: 'softOutput' }, f));
    el('feBlend', { in: 'softOutput', in2: 'SourceGraphic', mode: 'normal', result: 'mixedOutput' }, f);
    var gb = el('feGaussianBlur', { in: 'mixedOutput', stdDeviation: '0.7' }, f);
    alvo.insertBefore(svg, alvo.firstChild);
    // as camadas por cima do fundo (iguais às do modelo)
    var t = url ? .75 : 1, nb = Math.max(12, p.blur + 8);
    function camada(css) { var d = document.createElement('div'); d.style.cssText = 'position:absolute;inset:0;border-radius:inherit;pointer-events:none;' + css; alvo.insertBefore(d, svg.nextSibling); return d }
    var cs = [];
    if (temBF && (!url || p.backgroundOpacity < .001)) cs.push('z-index:1;backdrop-filter:blur(' + nb + 'px) saturate(' + (p.saturation * 1.4) + ') brightness(1.08);-webkit-backdrop-filter:blur(' + nb + 'px) saturate(' + (p.saturation * 1.4) + ') brightness(1.08)');
    cs.push('z-index:2;background:rgba(255,255,255,' + ((.1 + p.backgroundOpacity * .35) * t) + ')');
    cs.push('z-index:3;background:linear-gradient(176deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 30%, transparent 55%, rgba(0,0,0,0.02) 100%);opacity:' + t);
    cs.push('z-index:4;padding:1px;-webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;background:conic-gradient(from 180deg, rgba(255,120,180,0.18), rgba(120,180,255,0.18), rgba(180,255,120,0.18), rgba(255,180,120,0.18), rgba(255,120,180,0.18));opacity:' + ((p.chromaAmount > 0 ? Math.min(1, p.chromaAmount / 20) : 0) * t));
    cs.push('z-index:5;border:1px solid rgba(255,255,255,' + (.5 * t) + ')');
    cs.reverse().forEach(camada);
    // o mapa de refração, refeito quando a pílula muda de tamanho
    function mapa() {
      var r = alvo.getBoundingClientRect(), w = r.width || 400, h = r.height || 200, i = Math.min(w, h) * (p.borderWidth * .5), a = Math.max(0, w - i * 2), o = Math.max(0, h - i * 2);
      var sv = '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="' + rg + '" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient><linearGradient id="' + bg + '" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient></defs><rect x="0" y="0" width="' + w + '" height="' + h + '" fill="black"/><rect x="0" y="0" width="' + w + '" height="' + h + '" rx="' + p.borderRadius + '" fill="url(#' + rg + ')"/><rect x="0" y="0" width="' + w + '" height="' + h + '" rx="' + p.borderRadius + '" fill="url(#' + bg + ')" style="mix-blend-mode:difference"/><rect x="' + i + '" y="' + i + '" width="' + a + '" height="' + o + '" rx="' + p.borderRadius + '" fill="hsl(0 0% ' + p.brightness + '% / ' + p.glassOpacity + ')" style="filter:blur(' + p.blur + 'px)"/></svg>';
      img.setAttribute('href', 'data:image/svg+xml,' + encodeURIComponent(sv));
      var k = Math.min(1, Math.max(.58, h / 120)), esc = p.distortionScale * k;
      [[dR, 0], [dG, p.chromaAmount * .5], [dB, p.chromaAmount]].forEach(function (x) { x[0].setAttribute('scale', String(esc + x[1])); x[0].setAttribute('xChannelSelector', 'R'); x[0].setAttribute('yChannelSelector', 'G') });
      gb.setAttribute('stdDeviation', String(p.displace + p.liquidBlur));
      fa.setAttribute('slope', String(Math.max(.25, 1 - p.centerStability)));
    }
    mapa();
    if (window.ResizeObserver) new ResizeObserver(function () { setTimeout(mapa, 0) }).observe(alvo);
    return { mapa: mapa };
  };
})();
