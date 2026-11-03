(()=>{ const backgrounds=[['claro','#FFFBF3'],['escuro','#0E0E10'],['marrom','#34160B'],['vinho','#551122']];let background=0;
 try{background=Math.max(0,backgrounds.findIndex(x=>x[0]===localStorage.getItem('femea-fundo')))}catch{}
 const backgroundButton=document.createElement('button');backgroundButton.className='background-dot';backgroundButton.type='button';backgroundButton.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.1"/></svg>';
 function setBackground(){const [name,color]=backgrounds[background];document.documentElement.dataset.fundo=name;document.documentElement.style.setProperty('--page-bg',color);backgroundButton.setAttribute('aria-label','Fundo '+name+'. Mudar para '+backgrounds[(background+1)%4][0]);backgroundButton.title=backgroundButton.getAttribute('aria-label');try{localStorage.setItem('femea-fundo',name)}catch{}}
 backgroundButton.onclick=()=>{background=(background+1)%backgrounds.length;setBackground()};setBackground();document.body.append(backgroundButton);


if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});})();