/* leticia.ink 15/10/2026: uma tela por gesto, encaixando ("chegar e pá"), como o boook.ing.
   Avançando, a frase chega da direita; voltando, da esquerda. Roda, trackpad, dedo, setas e clique. */
(function(){
  var g=document.querySelector('main'); if(!g) return;
  var cs=[].slice.call(g.children), i=0, trava=0;
  document.documentElement.style.overflow='hidden'; document.body.style.overflow='hidden';
  var curva='transform .8s cubic-bezier(.22,.8,.18,1)'; g.style.transition=curva;
  function chega(card,dir){ var el=card.querySelector('h2'); if(!el) return;
    el.style.transition='none'; el.style.transform='translate3d('+(dir*220)+'px,0,0)'; el.style.opacity='0';
    requestAnimationFrame(function(){requestAnimationFrame(function(){ el.style.transition='transform 1s cubic-bezier(.16,1,.3,1) .15s, opacity .7s ease .15s'; el.style.transform='none'; el.style.opacity='1'; })}); }
  function vai(n){ if(document.documentElement.classList.contains('ed-on')) return; var j=Math.max(0,Math.min(cs.length-1,n)); if(j===i) return; var dir=j>i?1:-1; i=j;
    g.style.transition=curva; g.style.transform='translate3d('+(-i*innerWidth)+'px,0,0)'; chega(cs[i],dir); }
  addEventListener('wheel',function(e){ if(document.documentElement.classList.contains('ed-on')) return; e.preventDefault(); var d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY; if(Math.abs(d)<8) return; var t=Date.now(); if(t<trava){trava=t+180;return} trava=t+900; vai(i+(d>0?1:-1)); },{passive:false});
  var x0=null,y0=null;
  addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
  addEventListener('touchend',function(e){ if(x0===null) return; var dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0; var d=Math.abs(dx)>Math.abs(dy)?-dx:-dy; if(Math.abs(d)>40) vai(i+(d>0?1:-1)); x0=null; },{passive:true});
  addEventListener('keydown',function(e){ if(document.activeElement&&document.activeElement.isContentEditable) return; if(e.key==='ArrowRight'||e.key==='ArrowDown') vai(i+1); if(e.key==='ArrowLeft'||e.key==='ArrowUp') vai(i-1); });
  g.addEventListener('click',function(e){ if(document.documentElement.classList.contains('ed-on')||e.target.closest('iframe,#ed-pilula')) return; vai(e.clientX<innerWidth*0.25?i-1:i+1); });
  addEventListener('resize',function(){ g.style.transition='none'; g.style.transform='translate3d('+(-i*innerWidth)+'px,0,0)'; requestAnimationFrame(function(){g.style.transition=curva}); });
  chega(cs[0],1);
})();
