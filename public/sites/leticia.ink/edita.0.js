/* leticia.study/edita.js (15/10/2026, cópia de x.appp.to/z/bleibt): a Dra Lê escreve direto em cima do texto e troca as fotos.
   Todo mundo vê o que ela gravou (banco leticia_study, projeto u m b i g o); só quem tem a chave dela (link #k=…, guardada neste aparelho) vê a pílula "editar".
   Roda síncrono antes dos scripts do template: o texto gravado entra antes das animações que quebram o texto em letras. */
(function () {
  var SB = 'https://gqeipjiidtrcbmnrnknc.supabase.co';
  var PUB = 'sb_publishable_5PMV1M5XkgU6xzdnwCcWgQ_xy-9fLLV';
  var FOTO = SB + '/functions/v1/leticia-study-foto';
  var LS = 'leticia-study-chave';
  var pagina = location.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';

  var chave = '';
  var m = location.hash.match(/(?:^#|&)k=([a-z0-9]{32})/);
  try {
    if (m) { localStorage.setItem(LS, m[1]); history.replaceState(null, '', location.pathname + location.search); }
    chave = localStorage.getItem(LS) || '';
  } catch (e) { if (m) chave = m[1]; }

  // 1. o que está gravado (síncrono, para entrar antes das animações)
  var dados = { textos: {}, fotos: {} };
  try {
    var x = new XMLHttpRequest();
    x.open('GET', SB + '/rest/v1/rpc/le?pagina=' + encodeURIComponent(pagina), false);
    x.setRequestHeader('apikey', PUB);
    x.setRequestHeader('Accept-Profile', 'leticia_study');
    x.send();
    if (x.status === 200) dados = JSON.parse(x.responseText) || dados;
  } catch (e) {}
  var salvos = dados.textos || {}, fotos = dados.fotos || {};

  // 2. cada texto ganha um nome estável: o texto original + quantas vezes ele já apareceu antes
  var PULA = /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|SVG|IFRAME|VIDEO|AUDIO|CANVAS|IMG|INPUT|TEXTAREA|SELECT|OPTION)$/;
  function proprio(el) { for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) return true; return false; }
  function plano(el) { // texto puro, <br> vira quebra de linha
    var s = '';
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) s += n.nodeValue;
      else if (n.nodeType === 1) { if (n.tagName === 'BR') s += '\n'; else if (!PULA.test(n.tagName)) { if (n.tagName === 'DIV' && s && s.slice(-1) !== '\n') s += '\n'; s += plano(n); } }
    }
    return s;
  }
  function poePlano(el, t) {
    el.textContent = '';
    t.split('\n').forEach(function (p, i) { if (i) el.appendChild(document.createElement('br')); if (p) el.appendChild(document.createTextNode(p)); });
  }
  var nome = function (t) { return t.replace(/\s+/g, ' ').trim().slice(0, 300); };

  var unidades = [], hosts = [], vistos = {};
  function marcaTextos() {
    var els = [];
    document.querySelectorAll('body *').forEach(function (el) {
      if (PULA.test(el.tagName.toUpperCase()) || el.closest('svg,script,style,noscript,template,#ed-pilula')) return;
      if (proprio(el)) els.push(el);
    });
    var set = new Set(els);
    els.forEach(function (el) {
      var temDentro = false;
      for (var i = 0; i < els.length && !temDentro; i++) if (els[i] !== el && el.contains(els[i])) temDentro = true;
      var dentroDeOutro = false;
      for (var p = el.parentElement; p; p = p.parentElement) if (set.has(p)) { dentroDeOutro = true; break; }
      if (!dentroDeOutro) { hosts.push(el); el.setAttribute('data-ed-host', ''); }
      if (!temDentro) {
        var o = plano(el), b = nome(o), k = b + '#' + (vistos[b] = (vistos[b] || 0) + 1);
        unidades.push({ tipo: 'el', el: el, k: k, orig: o });
      } else { // tem outros textos dentro: cada pedaço de texto direto dele é uma unidade
        for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) {
          var b2 = nome(n.nodeValue), k2 = b2 + '#' + (vistos[b2] = (vistos[b2] || 0) + 1);
          unidades.push({ tipo: 'tn', no: n, el: el, k: k2, orig: n.nodeValue });
        }
      }
    });
    unidades.forEach(function (u) {
      if (u.tipo === 'el') u.el.setAttribute('data-ed', u.k);
      var t = salvos[u.k];
      if (t == null) return;
      if (u.tipo === 'el') poePlano(u.el, t); else u.no.nodeValue = t;
    });
  }
  function valor(u) { return u.tipo === 'el' ? plano(u.el) : u.no.nodeValue; }

  // 3. fotos: <img> e fundo com imagem; nome = arquivo original + vez
  var imgs = [], fundos = null, vistasF = {};
  var arq = function (src) { return String(src || '').split('?')[0].split('/').pop(); };
  function marcaFotos() {
    document.querySelectorAll('body img').forEach(function (im) {
      var a = arq(im.getAttribute('src')); if (!a) return;
      var k = a + '#' + (vistasF[a] = (vistasF[a] || 0) + 1);
      im.setAttribute('data-ed-foto', k); imgs.push(im);
      if (fotos[k]) poeFoto(im, fotos[k]);
    });
    if (Object.keys(fotos).some(function (k) { return k.indexOf('bg:') === 0 })) marcaFundos();
  }
  function marcaFundos() {
    if (fundos) return; fundos = [];
    document.querySelectorAll('body *').forEach(function (el) {
      if (el.closest('#ed-pilula')) return;
      var bg = getComputedStyle(el).backgroundImage, mm = bg && bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (!mm) return;
      var a = 'bg:' + arq(mm[1]), k = a + '#' + (vistasF[a] = (vistasF[a] || 0) + 1);
      el.setAttribute('data-ed-foto', k); fundos.push(el);
      if (fotos[k]) poeFoto(el, fotos[k]);
    });
  }
  function poeFoto(el, url) {
    if (el.tagName === 'IMG') { el.removeAttribute('srcset'); el.removeAttribute('sizes'); el.src = url;
      var pic = el.parentElement; if (pic && pic.tagName === 'PICTURE') pic.querySelectorAll('source').forEach(function (s) { s.remove() }); }
    else el.style.backgroundImage = 'url("' + url + '")';
  }

  marcaTextos();
  marcaFotos();

  if (!chave) return; // visitante: só lê

  // 4. a dona: pílula, escrever, gravar
  var ligado = false, pendentes = new Set(), timer = 0, ultimo = {};
  unidades.forEach(function (u) { ultimo[u.k] = salvos[u.k] != null ? salvos[u.k] : u.orig; });

  function rpc(fn, corpo, keep) {
    return fetch(SB + '/rest/v1/rpc/' + fn, { method: 'POST', keepalive: !!keep,
      headers: { apikey: PUB, 'Content-Type': 'application/json', 'Content-Profile': 'leticia_study', 'Accept-Profile': 'leticia_study' },
      body: JSON.stringify(corpo) });
  }
  function grava(keep) {
    clearTimeout(timer);
    pendentes.forEach(function (h) {
      unidades.forEach(function (u) {
        if (!h.contains(u.el) || (u.tipo === 'tn' && !u.no.isConnected)) return;
        var t = valor(u);
        if (t === ultimo[u.k]) return;
        ultimo[u.k] = t;
        rpc('salva_texto', { k: chave, pagina: pagina, chave: u.k, texto: t }, keep)
          .then(function (r) { if (!r.ok) { delete ultimo[u.k]; pendentes.add(h); agenda(); } })
          .catch(function () { delete ultimo[u.k]; pendentes.add(h); agenda(); });
      });
    });
    pendentes.clear();
  }
  function agenda() { clearTimeout(timer); timer = setTimeout(grava, 800); }

  var css = document.createElement('style');
  css.textContent =
    '#ed-pilula{position:fixed;right:12px;top:50%;margin-top:-14px;z-index:2147483647;height:28px;padding:0 13px;border:0;border-radius:999px;background:#1d1d1f;color:#fff;font:500 12px/28px -apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif;letter-spacing:.02em;cursor:pointer;opacity:.85;outline:none;-webkit-tap-highlight-color:transparent;box-shadow:none}' +
    '#ed-pilula:focus,#ed-pilula:focus-visible{outline:none;box-shadow:none}' +
    'html.ed-on [data-ed-host]{-webkit-user-select:text!important;user-select:text!important;cursor:text!important;outline:none!important}' +
    'html.ed-on [data-ed-host]:focus{outline:none!important;box-shadow:none!important;background-color:rgba(255,236,150,.28)}' +
    'html.ed-on [data-ed-foto]{cursor:copy!important}';
  document.head.appendChild(css);

  var pil = document.createElement('button');
  pil.id = 'ed-pilula'; pil.type = 'button'; pil.textContent = 'editar';
  pil.addEventListener('click', function (e) {
    e.stopPropagation(); e.preventDefault();
    ligado = !ligado;
    document.documentElement.classList.toggle('ed-on', ligado);
    pil.textContent = ligado ? 'pronto' : 'editar';
    if (ligado) marcaFundos();
    hosts.forEach(function (h) {
      if (ligado) { h.setAttribute('contenteditable', 'true'); h.setAttribute('spellcheck', 'false'); }
      else { h.removeAttribute('contenteditable'); pendentes.add(h); }
    });
    if (!ligado) grava();
  });

  // editando: nada navega nem abre; tocar numa foto troca a foto
  var escolhe = document.createElement('input');
  escolhe.type = 'file'; escolhe.accept = 'image/*'; escolhe.style.display = 'none';
  var alvoFoto = null;
  function fotoNoPonto(x, y) {
    var pilha = document.elementsFromPoint(x, y);
    for (var i = 0; i < pilha.length; i++) {
      var el = pilha[i];
      if (el === pil) return null;
      if (el.closest('[data-ed-host]') && !el.hasAttribute('data-ed-foto')) return null; // é texto: escreve
      if (el.hasAttribute('data-ed-foto')) return el;
    }
    return null;
  }
  // texto coberto por uma camada transparente do template: o toque atravessa e o cursor vai para o texto de baixo
  function textoNoPonto(x, y) {
    var pilha = document.elementsFromPoint(x, y);
    for (var i = 0; i < pilha.length; i++) { if (pilha[i] === pil) return null; var h = pilha[i].closest('[data-ed-host]'); if (h) return h; if (pilha[i].hasAttribute('data-ed-foto')) return null; }
    return null;
  }
  document.addEventListener('pointerdown', function (e) {
    if (!ligado || e.target === pil || (e.target.closest && e.target.closest('[data-ed-host]'))) return;
    var h = textoNoPonto(e.clientX, e.clientY);
    if (!h) return;
    e.preventDefault();
    h.focus({ preventScroll: true });
    var r = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null;
    if (!r && document.caretPositionFromPoint) { var cp = document.caretPositionFromPoint(e.clientX, e.clientY); if (cp) { r = document.createRange(); r.setStart(cp.offsetNode, cp.offset); } }
    if (r && h.contains(r.startContainer)) { var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  }, true);
  document.addEventListener('click', function (e) {
    if (!ligado || e.target === pil || e.target === escolhe) return;
    var f = fotoNoPonto(e.clientX, e.clientY);
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    if (f) { alvoFoto = f; escolhe.value = ''; escolhe.click(); }
  }, true);
  ['mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'dblclick'].forEach(function (t) {
    document.addEventListener(t, function (e) { if (ligado && e.target !== pil) e.stopImmediatePropagation(); }, true);
  });
  document.addEventListener('keydown', function (e) {
    if (!ligado || !e.target.closest || !e.target.closest('[data-ed-host]')) return;
    e.stopPropagation();
    if (e.key === 'Enter') { e.preventDefault(); document.execCommand('insertLineBreak'); }
  }, true);
  document.addEventListener('paste', function (e) {
    if (!ligado || !e.target.closest || !e.target.closest('[data-ed-host]')) return;
    e.preventDefault();
    var t = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, t);
  }, true);
  document.addEventListener('input', function (e) {
    if (!ligado) return;
    var h = e.target.closest && e.target.closest('[data-ed-host]');
    if (h) { pendentes.add(h); agenda(); }
  }, true);
  document.addEventListener('focusout', function (e) {
    var h = ligado && e.target.closest && e.target.closest('[data-ed-host]');
    if (h) { pendentes.add(h); grava(); }
  }, true);
  addEventListener('pagehide', function () { if (pendentes.size) grava(true); });
  document.addEventListener('visibilitychange', function () { if (document.hidden && pendentes.size) grava(true); });

  function encolhe(file) { // foto grande: até 2400px, mantém transparência (webp) ou jpeg
    return new Promise(function (ok) {
      if (/gif|svg/.test(file.type) || file.size < 2.5e6 && /jpeg|png|webp|avif/.test(file.type)) return ok(file);
      var im = new Image();
      im.onload = function () {
        var s = Math.min(1, 2400 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas');
        c.width = Math.round(im.naturalWidth * s); c.height = Math.round(im.naturalHeight * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        var tipo = /png|webp/.test(file.type) ? 'image/webp' : 'image/jpeg';
        c.toBlob(function (b) { ok(b && /jpeg|png|webp/.test(b.type) ? b : file); }, tipo, .9);
      };
      im.onerror = function () { ok(file); };
      im.src = URL.createObjectURL(file);
    });
  }
  escolhe.addEventListener('change', function () {
    var file = escolhe.files && escolhe.files[0], el = alvoFoto;
    if (!file || !el) return;
    pil.textContent = '…';
    encolhe(file).then(function (b) {
      return fetch(FOTO, { method: 'POST', headers: { 'Content-Type': b.type || file.type, 'x-chave': chave, 'x-pagina': encodeURIComponent(pagina), 'x-alvo': encodeURIComponent(el.getAttribute('data-ed-foto')) }, body: b });
    }).then(function (r) { return r.json(); }).then(function (o) {
      pil.textContent = ligado ? 'pronto' : 'editar';
      if (!o || !o.ok) return;
      poeFoto(el, o.url);
      if (el.closest('#canvasContainer')) location.reload(); // a foto do efeito 3D é lida só quando a página abre
    }).catch(function () { pil.textContent = ligado ? 'pronto' : 'editar'; });
  });

  // a pílula só aparece se a chave for mesmo a dela
  rpc('e_dona', { k: chave }).then(function (r) { return r.json(); }).then(function (ok) {
    if (ok !== true) return;
    var poe = function () { document.body.appendChild(pil); document.body.appendChild(escolhe); };
    if (document.body) poe(); else document.addEventListener('DOMContentLoaded', poe);
  }).catch(function () {});
})();
