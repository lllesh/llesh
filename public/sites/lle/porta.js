/* SITE ABERTO (17/10/2026, ordem da Dra Lê: só umbig.ooo tem porta): qualquer um lê, sem tela de entrar.
   Gravar continua só da dona: o servidor confere a chave. A versão com porta ficou guardada fora da publicação.
   Dona, para editar: i.lle.sh/sso?volta=<este endereço> (volta com #sso=… e a chave fica guardada aqui). */
(function () {
  function le(k) { try { return localStorage.getItem(k) } catch (e) { return null } }
  function poe(k, v) { try { localStorage.setItem(k, v) } catch (e) {} }
  function tira(k) { try { localStorage.removeItem(k) } catch (e) {} }
  var sso = (location.hash.match(/[#&]sso=([^&]+)/) || [])[1];
  if (sso) {
    history.replaceState(null, '', location.pathname + location.search);
    fetch('/api/porta', { method: 'POST', headers: { Authorization: 'Bearer ' + decodeURIComponent(sso) } })
      .then(function (r) { return r.json() })
      .then(function (j) { if (j.ok && j.chave) { poe('porta-chave', j.chave); location.reload() } })
      .catch(function () {});
    return;
  }
  var chave = le('porta-chave');
  if (chave && !(+String(chave).split('.')[0] > Date.now())) { tira('porta-chave'); chave = null }
  if (chave) {
    poe('sr1-chave', chave); poe('ish-gate', 'ok');
    try { sessionStorage.setItem('ooooh-unlocked', '1'); sessionStorage.removeItem('so-olhar') } catch (e) {}
    fetch('/api/porta', { headers: { 'x-edit-key': chave }, cache: 'no-store' }).then(function (r) { return r.json() })
      .then(function (j) { if (j && j.ok === false) { tira('porta-chave'); tira('sr1-chave') } }).catch(function () {});
  }
})();
