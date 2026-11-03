/* escreve (15/10/2026): mostra paginas.json (só moldura e imagens do Canva) de lado, uma por gesto ("chegar e pá"),
   e grava o que a Dra Lê escreve em cada página no banco (escreve_leticia_ink.paginas). Sem porta. */
(function(){
  var SB='https://gqeipjiidtrcbmnrnknc.supabase.co', K=document.currentScript.dataset.chave, PERFIL='escreve_leticia_ink';
  var DESIGN=document.currentScript.dataset.design, BASE=document.currentScript.dataset.base;
  var trilho=document.getElementById('trilho');
  var D=null, textos={}, i=0, telas={}, trava=0, NS='http://www.w3.org/2000/svg';
  var ini=parseInt((location.hash||'').slice(1),10); if(ini>0) i=ini-1;

  function el(t,a,pai){ var e=document.createElementNS(NS,t); for(var k in a) e.setAttribute(k,a[k]); if(pai) pai.appendChild(e); return e; }
  var uid=0;
  function grad(defs,g){ var id='g'+(++uid), G;
    if(g.tipo==='radial') G=el('radialGradient',{id:id},defs);
    else G=el('linearGradient',{id:id,gradientTransform:'rotate('+(g.ang||0)+' .5 .5)'},defs);
    (g.paradas||[]).forEach(function(p){ el('stop',{offset:p[0]+'%','stop-color':p[1]||'#000'},G); });
    return 'url(#'+id+')'; }
  function shape(e,pai,attrs){ var f=e.forma||{}, out=[];
    if(f.caminhos){ var s=el('svg',{x:e.x,y:e.y,width:e.w,height:e.h,overflow:'visible',preserveAspectRatio:'none',viewBox:'0 0 '+(f.caminhos[0].w||e.w)+' '+(f.caminhos[0].h||e.h)},pai);
      f.caminhos.forEach(function(c){ var a={d:c.d}; for(var k in attrs) a[k]=attrs[k]; if(c.sem_fundo) a.fill='none';
        if(a['stroke-width']) a['stroke-width']=a['stroke-width']*((c.w||e.w)/e.w); out.push(el('path',a,s)); }); return out; }
    var a={}; for(var k in attrs) a[k]=attrs[k];
    if(f.pre==='ellipse'){ a.cx=e.x+e.w/2; a.cy=e.y+e.h/2; a.rx=e.w/2; a.ry=e.h/2; return [el('ellipse',a,pai)]; }
    a.x=e.x; a.y=e.y; a.width=e.w; a.height=e.h;
    if(f.pre==='roundRect'){ a.rx=a.ry=Math.min(e.w,e.h)*((f.adj||16667)/100000); }
    return [el('rect',a,pai)]; }
  function pagina(n){
    var p=D.paginas[n], W=D.largura, H=D.altura;
    var svg=el('svg',{viewBox:'0 0 '+W+' '+H,preserveAspectRatio:'none'}), defs=el('defs',{},svg);
    var f=p.fundo||{};
    if(f.img) el('image',{href:BASE+f.img,x:0,y:0,width:W,height:H,preserveAspectRatio:'xMidYMid slice'},svg);
    else el('rect',{x:0,y:0,width:W,height:H,fill:f.gradiente?grad(defs,f.gradiente):(f.cor||'#FFFFFF')},svg);
    p.els.forEach(function(e){
      var g=el('g',{},svg), cx=e.x+e.w/2, cy=e.y+e.h/2, tr='';
      if(e.rot) tr+='rotate('+e.rot+' '+cx+' '+cy+') ';
      if(e.fh||e.fv) tr+='translate('+cx+' '+cy+') scale('+(e.fh?-1:1)+' '+(e.fv?-1:1)+') translate('+(-cx)+' '+(-cy)+')';
      if(tr) g.setAttribute('transform',tr);
      if(e.op!=null) g.setAttribute('opacity',e.op);
      var b=e.borda;
      if(e.t==='imagem'){
        var c=e.corte||[0,0,0,0], vw=1-(c[0]+c[2])/100||1, vh=1-(c[1]+c[3])/100||1, iw=e.w/vw, ih=e.h/vh;
        var id='c'+(++uid), cp=el('clipPath',{id:id},defs); shape(e,cp,{});
        el('image',{href:BASE+e.src,x:e.x-c[0]/100*iw,y:e.y-c[1]/100*ih,width:iw,height:ih,preserveAspectRatio:'none','clip-path':'url(#'+id+')'},g);
        if(b) shape(e,g,{fill:'none',stroke:b.cor,'stroke-width':b.larg});
      } else if(e.t==='forma'){
        var a={fill:e.gradiente?grad(defs,e.gradiente):(e.preench||'none')}; if(b){a.stroke=b.cor;a['stroke-width']=b.larg;}
        shape(e,g,a);
      } else if(e.t==='linha'){
        el('line',{x1:e.x,y1:e.y,x2:e.x+e.w,y2:e.y+e.h,stroke:(b||{}).cor||'#000','stroke-width':(b||{}).larg||1},g);
      }
    });
    return svg;
  }
  function mede(pg){ var W=D.largura,H=D.altura, mw=innerWidth*(innerWidth<700?.9:.84), mh=innerHeight*.84, s=Math.min(mw/W,mh/H);
    pg.style.width=Math.round(W*s)+'px'; pg.style.height=Math.round(H*s)+'px';
    var es=pg.querySelector('.escrita'); if(es){ var t=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--escrita-tamanho'))||.055; es.style.fontSize=(W*s*t)+'px'; } }
  var salva={};
  function grava(n,texto){ textos[n]=texto; clearTimeout(salva[n]); salva[n]=setTimeout(function(){
    fetch(SB+'/rest/v1/paginas?on_conflict=design,pagina',{method:'POST',keepalive:true,headers:{apikey:K,Authorization:'Bearer '+K,'Content-Type':'application/json','Content-Profile':PERFIL,Prefer:'resolution=merge-duplicates,return=minimal'},
      body:JSON.stringify([{design:DESIGN,pagina:n+1,texto:texto,atualizado:new Date().toISOString()}])}).catch(function(){}); },600); }
  function tela(n){
    if(telas[n]) return telas[n];
    var t=document.createElement('div'); t.className='tela'; var pg=document.createElement('div'); pg.className='pg';
    pg.appendChild(pagina(n));
    var es=document.createElement('div'); es.className='escrita'; es.contentEditable='true'; es.spellcheck=false; es.textContent=textos[n]||'';
    es.addEventListener('input',function(){ grava(n,es.innerText); });
    es.addEventListener('blur',function(){ clearTimeout(salva[n]); salva[n]=null; grava(n,es.innerText); });
    ['pointerdown','touchstart','touchend','wheel','keydown'].forEach(function(ev){ es.addEventListener(ev,function(e){ if(document.activeElement===es) e.stopPropagation(); },{passive:true}); });
    pg.appendChild(es); t.appendChild(pg); trilho.appendChild(t); mede(pg); telas[n]=t; return t; }
  var curva='transform .8s cubic-bezier(.22,.8,.18,1)';
  function poe(anim){
    for(var k in telas){ k=+k; if(Math.abs(k-i)>1){ if(document.activeElement && telas[k].contains(document.activeElement)) continue; telas[k].remove(); delete telas[k]; } }
    for(var n=Math.max(0,i-1); n<=Math.min(D.paginas.length-1,i+1); n++){ var t=tela(n); t.style.transition=anim?curva:'none'; t.style.transform='translate3d('+((n-i)*100)+'vw,0,0)'; }
    try{ history.replaceState(null,'','#'+(i+1)); }catch(e){} }
  function vai(n){ if(!D) return; var j=Math.max(0,Math.min(D.paginas.length-1,n)); if(j===i) return;
    if(document.activeElement && document.activeElement.blur) document.activeElement.blur();
    var antes=i; i=j;
    for(var m=Math.max(0,i-1); m<=Math.min(D.paginas.length-1,i+1); m++){ var t=tela(m); if(!t.style.transform){ t.style.transition='none'; t.style.transform='translate3d('+((m-antes)*100)+'vw,0,0)'; } }
    requestAnimationFrame(function(){ poe(true); }); }
  addEventListener('wheel',function(e){ if(document.activeElement&&document.activeElement.isContentEditable) return; e.preventDefault(); var d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY; if(Math.abs(d)<8) return; var t=Date.now(); if(t<trava){trava=t+180;return} trava=t+700; vai(i+(d>0?1:-1)); },{passive:false});
  var x0=null,y0=null;
  addEventListener('touchstart',function(e){ x0=e.touches[0].clientX; y0=e.touches[0].clientY; },{passive:true});
  addEventListener('touchend',function(e){ if(x0===null) return; var dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0; var d=Math.abs(dx)>Math.abs(dy)?-dx:-dy; if(Math.abs(d)>40 && !(document.activeElement&&document.activeElement.isContentEditable)) vai(i+(d>0?1:-1)); x0=null; },{passive:true});
  addEventListener('keydown',function(e){ if(document.activeElement&&document.activeElement.isContentEditable) return; if(e.key==='ArrowRight'||e.key==='ArrowDown') vai(i+1); if(e.key==='ArrowLeft'||e.key==='ArrowUp') vai(i-1); });
  trilho.addEventListener('click',function(e){ if(e.target.closest('.escrita')) return; if(document.activeElement&&document.activeElement.isContentEditable){ document.activeElement.blur(); return; } vai(e.clientX<innerWidth*.25?i-1:i+1); });
  addEventListener('resize',function(){ if(!D) return; for(var k in telas) mede(telas[k].querySelector('.pg')); poe(false); });
  Promise.all([
    fetch(BASE+'paginas.json',{cache:'no-cache'}).then(function(r){return r.json()}),
    fetch(SB+'/rest/v1/paginas?design=eq.'+DESIGN+'&select=pagina,texto',{headers:{apikey:K,Authorization:'Bearer '+K,'Accept-Profile':PERFIL}}).then(function(r){return r.ok?r.json():[]}).catch(function(){return []})
  ]).then(function(r){ D=r[0]; (r[1]||[]).forEach(function(l){ textos[l.pagina-1]=l.texto; }); if(i>D.paginas.length-1) i=0; poe(false); });
})();
