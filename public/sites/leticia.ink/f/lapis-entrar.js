/* 17/10/2026: site aberto. Quem não é a dona não vê lápis; a dona sem a chave neste aparelho vê um lápis que leva para entrar e volta. */
(function () {
  try { var x = new XMLHttpRequest(); x.open('GET', '/api/editar', false); x.send(); if (x.status === 200) return; } catch (e) {}
  var a = document.createElement('a'); a.href = '/entrar?volta=' + encodeURIComponent(location.pathname); a.setAttribute('aria-label', 'escrever');
  a.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
  a.style.cssText = 'position:fixed;left:calc(4vw - 21px);top:50%;transform:translateY(-50%);z-index:30;padding:10px;color:#A39B9D;line-height:0;opacity:.6';
  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(a); });
  if (document.body) document.body.appendChild(a);
})();
