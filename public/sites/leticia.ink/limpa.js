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
    // 08/10/2026: botão de loja que faz parte do desenho (ex.: o DOWNLOAD do dropz) fica, só perde o link; selo de venda solto continua saindo
    document.querySelectorAll(SEL).forEach(function (el) {
      var loja = /gumroad\.com|lemonsqueezy\.com|polar\.sh/.test(el.getAttribute('href') || ''), t = (el.innerText || '').trim(), alvo = alvoDe(el);
      if (loja && !/^(buy|purchase|get|order|comprar)\b|template/i.test(t) && getComputedStyle(alvo).position !== 'fixed') { el.removeAttribute('href'); el.removeAttribute('target'); el.style.cursor = 'default'; return }
      alvo.remove();
    });
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
  // o mesmo template pode estar no endereço com número (/z/00550.margaret/) ou só com o nome (/z/margaret/)
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
/* 05/10/2026: navegação dentro do template. O Framer troca o endereço sozinho (ex.: /works em vez de /z/<nome>/works/), e a página
   não abre de novo ao recarregar. Aqui: (1) links que começam com "/" (fora do /z/) ganham o /z/<nome>/ na frente; (2) clique em link
   de dentro abre a página certa de verdade, no endereço certo. */
(function(){var m=location.pathname.match(/^\/z\/([^\/]+)\//)||location.pathname.match(/^\/([^\/]+)\//);if(!m)return;var pre='/z/'+m[1];
function arruma(){document.querySelectorAll('a[href^="/"]').forEach(function(a){var h=a.getAttribute('href');if(/^\/(z\/|\/)/.test(h))return;var q=h.match(/^([^?#]*)(.*)$/);var c=q[1]==='/'?'/':q[1].replace(/\/?$/,'/');a.setAttribute('href',pre+c+q[2])})}
document.addEventListener('click',function(e){if(e.defaultPrevented&&!e.isTrusted)return;var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target==='_blank'||e.metaKey||e.ctrlKey)return;var h=a.getAttribute('href');if(!h||h.charAt(0)==='#')return;
  if(h.charAt(0)==='/'&&!/^\/(z\/|\/)/.test(h)){var q=h.match(/^([^?#]*)(.*)$/);h=pre+(q[1]==='/'?'/':q[1].replace(/\/?$/,'/'))+q[2]}
  if(h.indexOf(pre+'/')===0||h===pre){if(h.split('#')[0]===location.pathname&&h.indexOf('#')>0)return;e.preventDefault();e.stopPropagation();location.href=h}},true);
arruma();new MutationObserver(arruma).observe(document.documentElement,{childList:true,subtree:true})})();
/* 07/10/2026 (Dra Lê: "não quero nome de ninguém"): some com os créditos dos autores dos modelos
   ("created by …", "made by …", "designed by …", "template by …", "made in framer", "get this template", "remix") */
(function(){var RE=/^\s*(?:[\w\s.&-]{0,40}\s)?(?:created|made|designed|built|crafted|developed|template|component|remix(?:ed)?|powered)\s+(?:by|in|with)\b|made\s+in\s+framer|get\s+(?:this|the)\s+(?:template|component)|buy\s+(?:this\s+)?template|use\s+for\s+free/i;
function some(){var vistos=[];document.querySelectorAll('a,p,span,div,button,h6,small').forEach(function(e){if(e.__semCredito)return;var t=(e.textContent||'').trim();if(!t||t.length>70||!RE.test(t))return;
  var alvo=e;while(alvo.parentElement&&alvo.parentElement!==document.body&&(alvo.parentElement.textContent||'').trim()===t)alvo=alvo.parentElement;
  alvo.__semCredito=1;alvo.style.setProperty('display','none','important')})}
some();new MutationObserver(function(){clearTimeout(some.t);some.t=setTimeout(some,120)}).observe(document.documentElement,{childList:true,subtree:true,characterData:true})})();
/* 07/10/2026 (Dra Lê: "substitua todas as fotos pelas minhas fotos, todos os nomes com o nosso nome, nada de fora"):
   toda foto e vídeo dos modelos vira foto/vídeo DELA (as do ll e.s h), e o nome da aba vira ll e.s h */
(function(){
var EXATO=['/z/echoa.2'];if(/^\/z\/[^\/]+\.exato(\/|$)/.test(location.pathname)||EXATO.some(function(x){return location.pathname.indexOf(x+'/')===0||location.pathname===x}))return;
var F=['1172f348','254b262b','344f5a3d','514e8591','6c5a5971','a4654008','bd4de308','bde98e81','cefe1b9a','d460484a','dde3dfb1','e4fad7d2'].map(function(i){return 'https://lle.sh/img/o/'+i+'.jpg'}).concat(['0effa6ac','3df3a9f2','8c1d5b21','aebe2238'].map(function(i){return 'https://lle.sh/img/t/'+i+'.jpg'}));
var V=['0effa6ac','3df3a9f2','8c1d5b21','aebe2238'].map(function(i){return 'https://lle.sh/img/leve/'+i+'.mp4'});
var FORA=/(framerusercontent\.com\/(images|assets)\/|images\.unsplash\.com|cdn\.prod\.website-files\.com|uploads-ssl\.webflow\.com|images\.pexels\.com|cdn\.dribbble\.com|cdn\.sanity\.io)/i;
function h(t){var x=0;for(var i=0;i<t.length;i++)x=(x*31+t.charCodeAt(i))>>>0;return x}
// 08/10/2026: PNG e GIF são ícones, logos e recortes com forma própria: ficam os do modelo (só as fotos viram fotos da Dra Lê)
var PNGSIM=['/z/methodicaldance'].some(function(x){return location.pathname.indexOf(x)===0});
// 08/10/2026, ordem da Dra Lê: os clones ficam com as fotos do PRÓPRIO tema (as dela atrapalham o raciocínio). A troca fica guardada aqui, desligada
var TROCA=false;
function nova(u){if(!TROCA)return null;if(!u||!FORA.test(u)||/\.svg(\?|$)/i.test(u))return null;if(!PNGSIM&&/\.(png|gif)(\?|$)/i.test(u))return null;var id=(u.match(/\/([A-Za-z0-9_-]{6,})\.(jpe?g|png|webp|avif|gif|mp4|webm|mov|m4v)/i)||[,u])[1];
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u)?V[h(id)%V.length]:F[h(id)%F.length]}
function srcset(v){return v.split(',').map(function(p){p=p.trim();var a=p.split(/\s+/),n=nova(a[0]);if(n)a[0]=n;return a.join(' ')}).join(', ')}
function el(e){if(e.nodeType!==1)return;
  ['src','poster','data-src'].forEach(function(k){var v=e.getAttribute&&e.getAttribute(k),n=v&&nova(v);if(n&&v!==n)e.setAttribute(k,n)});
  ['srcset','data-srcset'].forEach(function(k){var v=e.getAttribute&&e.getAttribute(k);if(v&&FORA.test(v)){var n=srcset(v);if(n!==v)e.setAttribute(k,n)}});
  var st=e.getAttribute&&e.getAttribute('style');if(st&&FORA.test(st)){var s2=st.replace(/url\((['"]?)([^)'"]+)\1\)/g,function(m,q,u){var n=nova(u);return n?'url("'+n+'")':m});if(s2!==st)e.setAttribute('style',s2)}
  if(e.tagName==='VIDEO'&&e.currentSrc&&FORA.test(e.currentSrc)){var n=nova(e.currentSrc);if(n){e.src=n;try{e.load();e.play()}catch(_){}}}}
// também as fotos que o código do modelo carrega sozinho (carrosséis 3D, canvas): troca na hora de pedir
try{var D=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');Object.defineProperty(HTMLImageElement.prototype,'src',{get:function(){return D.get.call(this)},set:function(v){D.set.call(this,nova(v)||v)},configurable:true})}catch(_){}
try{var DV=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'src');Object.defineProperty(HTMLMediaElement.prototype,'src',{get:function(){return DV.get.call(this)},set:function(v){DV.set.call(this,nova(v)||v)},configurable:true})}catch(_){}
try{var FE=window.fetch;window.fetch=function(i,o){var u=typeof i==='string'?i:(i&&i.url),n=u&&nova(u);return FE.call(this,n||i,o)}}catch(_){}
function tudo(r){el(r);r.querySelectorAll&&r.querySelectorAll('img,source,video,[style*="url("]').forEach(el)}
function nome(){if(document.title!=='ll e.s h')document.title='ll e.s h'}
tudo(document.documentElement);nome();
new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='attributes')el(m.target);else m.addedNodes.forEach(function(n){tudo(n)})});nome()}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','srcset','poster','style','data-src','data-srcset']});
document.addEventListener('DOMContentLoaded',function(){tudo(document.documentElement);nome()});
})();
/* 07/10/2026: textos trocados a pedido da Dra Lê, por cópia (o que ela escreveu, letra por letra) */
(function(){var T={'/z/legobutton':[[/click\s*(here|me)/ig,'PISE AQUI']],'/z/theparticletextpro':[[/PARTICLE/g,'ENDOMETRIOSE']]};var k=Object.keys(T).filter(function(p){return location.pathname.indexOf(p)===0})[0];if(!k)return;
function tt(v){if(typeof v!=='string')return v;T[k].forEach(function(r){v=v.replace(r[0],r[1])});return v}
['fillText','strokeText','measureText'].forEach(function(f){var o=CanvasRenderingContext2D.prototype[f];CanvasRenderingContext2D.prototype[f]=function(t){var a=[].slice.call(arguments);a[0]=tt(t);return o.apply(this,a)}});
function anda(n){if(n.nodeType===3){var v=n.nodeValue,w=v;T[k].forEach(function(r){w=w.replace(r[0],r[1])});if(w!==v)n.nodeValue=w}else if(n.childNodes)n.childNodes.forEach(anda)}
anda(document.body);new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(anda);if(m.type==='characterData')anda(m.target)})}).observe(document.body,{childList:true,subtree:true,characterData:true})})();

/* 08/10/2026: versão EXATA de cada cópia (lle.sh/z/<nome>.exato/): fotos do modelo, e os links continuam dentro da versão exata */
(function(){var m=location.pathname.match(/^\/z\/([^\/]+)\.exato(\/|$)/);if(!m)return;var n=m[1],de='/z/'+n+'/',para='/z/'+n+'.exato/';
function ar(){document.querySelectorAll('a[href^="'+de+'"],a[href="/z/'+n+'"]').forEach(function(a){var h=a.getAttribute('href');a.setAttribute('href',h==='/z/'+n?para:para+h.slice(de.length))})}
ar();new MutationObserver(ar).observe(document.documentElement,{childList:true,subtree:true})})();

/* 08/10/2026: o DOCK (methodicaldance) com as fotos da Dra Lê em forma de aplicativo: cantos de app, folga em volta e pulinho */
(function(){return;/* desligado junto com a troca de fotos (08/10/2026) */if(location.pathname.indexOf('/z/methodicaldance')!==0)return;var st=document.createElement('style');
st.textContent="img{object-fit:cover!important;border-radius:23%!important;transform:scale(.82);transition:transform .25s cubic-bezier(.3,1.6,.5,1)!important;box-shadow:0 6px 14px rgba(0,0,0,.35)}"+
"img:hover{animation:dockPula .6s cubic-bezier(.3,1.6,.5,1)}"+
"@keyframes dockPula{0%{transform:scale(.82) translateY(0)}35%{transform:scale(.86) translateY(-18%)}65%{transform:scale(.8) translateY(2%)}100%{transform:scale(.82) translateY(0)}}";
document.head.appendChild(st)})();
/* 08/10/2026: carrinho do Webflow fora do Webflow não conecta e apaga o número; volta a mostrar 0, como no original */
(function(){function zero(){document.querySelectorAll('.w-commerce-commercecartopenlinkcount').forEach(function(e){if(!e.textContent.trim())e.textContent='0'})}
setInterval(zero,800);document.addEventListener('DOMContentLoaded',zero)})();
