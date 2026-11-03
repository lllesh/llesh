/* leticia.land 15/10/2026: uma tela por gesto, encaixando ("chegar e pá"), como o boook.ing.
   Avançando, a frase chega da direita; voltando, da esquerda. Roda, trackpad, dedo, setas e clique. */
(function(){
  var g=document.querySelector('main'); if(!g) return;
  var cs=g.children, i=0, trava=0; /* 17/10: lista viva, para a folha nova que nasce no fim (folhas.js) */
  document.documentElement.style.overflow='hidden'; document.body.style.overflow='hidden';
  var curva='transform .8s cubic-bezier(.22,.8,.18,1)'; g.style.transition=curva;
  // 15/10 (pedido da Dra Lê): efeito das letras = o do letras.umbii.boo — a frase dividida em trechos,
  // todos apagados (vermelho a 35%), e os trechos ACENDEM um depois do outro (cor .45s), como lá
  var LIGA=/^(and|but|or|so|as|while|where|which|that|e|mas|ou|que|onde|quando|como|enquanto)$/i, MAX=9;
  function trechos(texto){ var ps=texto.split(/(\s+)/), out=[], a='', n=0;
    for(var k=0;k<ps.length;k++){ var w=ps[k]; if(/^\s+$/.test(w)){a+=w;continue}
      if(n>=4&&LIGA.test(w)&&a.trim()){out.push(a);a='';n=0} a+=w;n++;
      if(/[,.;:!?—–]$/.test(w)||n>=MAX){out.push(a);a='';n=0} }
    if(a) out.push(a); return out; }
  var st=document.createElement('style'); st.textContent='main h2 .t{color:rgba(255,13,13,.35);transition:color .45s ease}main h2 .t.on{color:#ff0d0d}'; document.head.appendChild(st);
  function acende(el){ if(document.documentElement.classList.contains('ed-on')) return;
    var texto=el.dataset.alvo||el.textContent; el.dataset.alvo=texto; (el._tm||[]).forEach(clearTimeout); el._tm=[];
    el.textContent=''; var ts=trechos(texto).map(function(t){ var s=document.createElement('span'); s.className='t'; s.textContent=t; el.appendChild(s); return s; });
    ts.forEach(function(s,k){ el._tm.push(setTimeout(function(){ s.classList.add('on') }, 450+k*380)); });
    el._tm.push(setTimeout(function(){ el.textContent=texto; delete el.dataset.alvo; }, 450+ts.length*380+500)); }
  function chega(card,dir){ var el=card.querySelector('h2'); if(!el) return;
    el.style.transition='none'; el.style.transform='translate3d('+(dir*220)+'px,0,0)'; el.style.opacity='0';
    requestAnimationFrame(function(){requestAnimationFrame(function(){ el.style.transition='transform 1s cubic-bezier(.16,1,.3,1) .15s, opacity .7s ease .15s'; el.style.transform='none'; el.style.opacity='1'; })}); acende(el); }
  // 17/10 (como o wholee.land): a janela nunca rola sozinha (foco no texto ou num site de fundo fazia a página parar no meio); a largura é a da própria página
  var R=document.documentElement;
  function zera(){ var e=document.scrollingElement||R; if(e.scrollLeft||e.scrollTop){e.scrollLeft=0;e.scrollTop=0} if(document.body.scrollLeft||document.body.scrollTop){document.body.scrollLeft=0;document.body.scrollTop=0} if(g.scrollLeft) g.scrollLeft=0; }
  addEventListener('scroll',zera,true);
  function larg(){ var c=g.firstElementChild; return (c&&c.getBoundingClientRect().width)||innerWidth; }
  function poe(sem){ zera(); g.style.transition=sem?'none':curva; g.style.transform='translate3d('+(-i*larg())+'px,0,0)'; if(sem) requestAnimationFrame(function(){g.style.transition=curva}); }
  function sai(){ var b=document.getElementById('ed-pilula'); if(b&&R.classList.contains('ed-on')) b.click(); } /* passar de lado encerra a escrita */
  function vai(n){ if(R.classList.contains('ed-on')) return; var j=Math.max(0,Math.min(cs.length-1,n)); if(j===i) return; var dir=j>i?1:-1; i=j;
    poe(); chega(cs[i],dir); }
  addEventListener('wheel',function(e){ e.preventDefault(); if(R.classList.contains('ed-on')){ var d0=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY; if(Math.abs(d0)<8) return; sai(); } var d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY; if(Math.abs(d)<8) return; var t=Date.now(); if(t<trava){trava=t+180;return} trava=t+900; vai(i+(d>0?1:-1)); },{passive:false});
  var x0=null,y0=null;
  addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
  addEventListener('touchend',function(e){ if(x0===null) return; var dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0; var d=Math.abs(dx)>Math.abs(dy)?-dx:-dy; if(Math.abs(d)>40&&R.classList.contains('ed-on')&&!e.target.closest('[contenteditable]')) sai(); if(Math.abs(d)>40) vai(i+(d>0?1:-1)); x0=null; },{passive:true});
  addEventListener('keydown',function(e){ if(document.activeElement&&document.activeElement.isContentEditable) return; if(e.key==='ArrowRight'||e.key==='ArrowDown') vai(i+1); if(e.key==='ArrowLeft'||e.key==='ArrowUp') vai(i-1); });
  g.addEventListener('click',function(e){ if(document.documentElement.classList.contains('ed-on')||e.target.closest('iframe,#ed-pilula')) return; vai(e.clientX<innerWidth*0.25?i-1:i+1); });
  addEventListener('resize',function(){ poe(true); });
  // 15/10: cada kit tem endereço (leticia.land/a, /b, /c) — abre direto na primeira tela daquele kit
  var k=location.pathname.replace(/\//g,'').toLowerCase(), alvo=k&&g.querySelector('[data-kit="'+k+'"]');
  if(alvo){ i=[].indexOf.call(cs,alvo); poe(true); }
  window.__encaixa={chega:function(card){chega(card,1)}}; /* 17/10: o texto que ela acabou de escrever aparece com o mesmo efeito */
  chega(cs[i],1);
})();
