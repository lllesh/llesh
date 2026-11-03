/* leticia.cards é ABERTO: todo mundo vê, sem porta nem login (12/10/2026).
   Só a dona edita: entra pelo i.lle.sh (leticia.cards/entrar) e volta com a chave (#sso=…), que vale 30 dias. */
(function () {
  function le(k) { try { return localStorage.getItem(k) } catch (e) { return null } }
  function poe(k, v) { try { localStorage.setItem(k, v) } catch (e) {} }
  function tira(k) { try { localStorage.removeItem(k) } catch (e) {} }
  var chave = le('porta-chave');
  var vale = !!chave && +String(chave).split('.')[0] > Date.now();
  var sso = (location.hash.match(/[#&]sso=([^&]+)/) || [])[1];
  if (sso) {
    history.replaceState(null, '', location.pathname + location.search);
    try {
      var x = new XMLHttpRequest();
      x.open('POST', '/api/porta', false);
      x.setRequestHeader('Authorization', 'Bearer ' + decodeURIComponent(sso));
      x.send();
      var j = JSON.parse(x.responseText || '{}');
      if (j.ok && j.chave) { poe('porta-chave', j.chave); chave = j.chave; vale = true }
    } catch (e) {}
  }
  if (vale) poe('sr1-chave', chave); else { tira('porta-chave'); tira('sr1-chave') }
})();
