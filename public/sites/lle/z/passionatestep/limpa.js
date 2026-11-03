(function () {
  // removes the Framer badge and the template seller's buy widgets (never just hides them)
  var SEL = '#__framer-badge-container, a[href*="lemonsqueezy.com"], a[href*="gumroad.com"], a[href*="polar.sh"], .w-webflow-badge, #lovable-badge';
  function alvoDe(el) {
    if (el.id === '__framer-badge-container' || el.id === 'lovable-badge' || el.classList.contains('w-webflow-badge')) return el;
    // a floating buy widget: take the whole small fixed box (preview, close button and all)
    for (var p = el; p && p !== document.body; p = p.parentElement) {
      var s = getComputedStyle(p);
      if (s.position === 'fixed') { var r = p.getBoundingClientRect(); if (r.width < innerWidth * .5 && r.height < innerHeight * .6) return p; break; }
    }
    return el.closest('[data-framer-name="Button"]') || el;
  }
  // 01/10/2026: também os botões do vendedor do template ("Remix template", "Use for free", "Buy template", "Get it for FREE"…)
  // 03/10/2026: e os selos e créditos do autor ("Made in Framer", "Built with Framer", "Made by Flux", "Visit Store", "More templates"…);
  //             link de conteúdo que leva para o Framer/Webflow (ex.: o cartão "Framer Award" do Mirak) fica, só perde o link
  var SEL2 = 'a[href*="framer.com"], a[href*="framer.link"], a[href*="webflow.com"], a[href*="webflow.io"], a[href*="lovable.dev"]';
  var TXT = /^(purchase|powered by webflow|made in webflow|made (in|with) framer|built (in|with) framer|create a free website with framer|edit with lovable|remix( this)? template|remix for free|use (it )?for free|buy (this )?template|get (it|this) for free|get (the )?template|get free template|purchase template|duplicate template|unlock for)/i;
  var CRED = /^(visit store|more templates|get started free|(made|created|designed|built) by \S+)/i; // só quando o link leva para o Framer/Webflow
  function limpa() {
    document.querySelectorAll(SEL).forEach(function (el) { alvoDe(el).remove(); });
    document.querySelectorAll(SEL2).forEach(function (el) {
      var alvo = alvoDe(el), t = (el.innerText || '').trim();
      var fixo = alvo !== el && getComputedStyle(alvo).position === 'fixed';
      if (fixo || (t.length < 60 && (TXT.test(t) || CRED.test(t))) || /framer\.com\/(marketplace|projects|remix|templates)|framer\.link/.test(el.href) && t.length < 40 && /^(get|buy|remix|purchase|use|duplicate)\b/i.test(t)) alvo.remove();
      else { el.removeAttribute('href'); el.style.cursor = 'default'; }
    });
    document.querySelectorAll('a, button').forEach(function (el) { var t = (el.innerText || '').trim(); if (t.length < 40 && TXT.test(t)) alvoDe(el).remove(); });
  }
  var foi = false;
  function comeca() { if (foi) return; foi = true; limpa(); var mo = new MutationObserver(limpa); mo.observe(document.body, { childList: true, subtree: true }); }
  // 03/10/2026: não depende só do "load" (página com vídeo às vezes nunca termina de carregar e o selo ficava)
  if (document.readyState === 'complete') setTimeout(comeca, 800); else { addEventListener('load', function () { setTimeout(comeca, 800); }); setTimeout(function () { if (document.body) comeca(); }, 3000); }
})();
(function () {
  // 01/10/2026: no celular, ao abrir um menu, o Framer põe o foco no primeiro link e o Safari desenha um contorno em volta (ex.: "Concept" no NIDO).
  // Tira esse contorno de links e botões tocados ou focados pelo próprio site; quem navega pelo teclado (Tab) continua vendo onde está.
  var st = document.createElement('style');
  st.textContent = 'html:not(.teclado) a:focus,html:not(.teclado) button:focus,html:not(.teclado) [tabindex]:focus,html:not(.teclado) [role=button]:focus{outline:none!important;box-shadow:none!important}';
  (document.head || document.documentElement).appendChild(st);
  addEventListener('keydown', function (e) { if (e.key === 'Tab') document.documentElement.classList.add('teclado'); }, true);
  ['mousedown', 'touchstart', 'pointerdown'].forEach(function (n) { addEventListener(n, function () { document.documentElement.classList.remove('teclado'); }, true); });
})();
(function () {
  // 02/10/2026: link que leva para outro projeto (fora deste template) abre em aba nova; os de dentro continuam na mesma aba
  // o mesmo template pode estar no endereço com número (/sites/lle/z/00550.margaret/) ou só com o nome (/sites/lle/z/margaret/)
  var nomeDe = function (p) { var m = p.match(/^\/z\/([^\/]+)/); return m ? m[1].replace(/^\d{5}\./, '') : null; };
  var base = nomeDe(location.pathname);
  function marca() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href') || '';
      if (/^(#|mailto:|tel:|javascript:)/.test(h)) return;
      var u; try { u = new URL(h, location.href) } catch (e) { return }
      var dentro = u.origin === location.origin && base && nomeDe(u.pathname) === base;
      if (!dentro && a.target !== '_blank') { a.target = '_blank'; a.rel = 'noopener'; }
    });
  }
  function comeca() { marca(); new MutationObserver(marca).observe(document.body, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', comeca); else comeca();
})();
/* 05/10/2026: navegação dentro do template. O Framer troca o endereço sozinho (ex.: /works em vez de /sites/lle/z/<nome>/works/), e a página
   não abre de novo ao recarregar. Aqui: (1) links que começam com "/" (fora do /sites/lle/z/) ganham o /sites/lle/z/<nome>/ na frente; (2) clique em link
   de dentro abre a página certa de verdade, no endereço certo. */
(function(){var m=location.pathname.match(/^\/z\/([^\/]+)\//)||location.pathname.match(/^\/([^\/]+)\//);if(!m)return;var pre='/sites/lle/z/'+m[1];
function arruma(){document.querySelectorAll('a[href^="/"]').forEach(function(a){var h=a.getAttribute('href');if(/^\/(z\/|\/)/.test(h))return;var q=h.match(/^([^?#]*)(.*)$/);var c=q[1]==='/'?'/':q[1].replace(/\/?$/,'/');a.setAttribute('href',pre+c+q[2])})}
document.addEventListener('click',function(e){if(e.defaultPrevented&&!e.isTrusted)return;var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target==='_blank'||e.metaKey||e.ctrlKey)return;var h=a.getAttribute('href');if(!h||h.charAt(0)==='#')return;
  if(h.charAt(0)==='/'&&!/^\/(z\/|\/)/.test(h)){var q=h.match(/^([^?#]*)(.*)$/);h=pre+(q[1]==='/'?'/':q[1].replace(/\/?$/,'/'))+q[2]}
  if(h.indexOf(pre+'/')===0||h===pre){if(h.split('#')[0]===location.pathname&&h.indexOf('#')>0)return;e.preventDefault();e.stopPropagation();location.href=h}},true);
arruma();new MutationObserver(arruma).observe(document.documentElement,{childList:true,subtree:true})})();
