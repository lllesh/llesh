(()=>{
  function cinta(w, h, r){
    const p = [];
    const arco = (cx, cy, a0, a1, n = 10) => {
      for (let k = 0; k <= n; k++){
        const a = a0 + ((a1 - a0) * k) / n;
        p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      }
    };
    p.push([r, 0]); p.push([w - r, 0]);
    arco(w - r, r, -Math.PI / 2, 0);
    p.push([w, h - r]);
    arco(w - r, h - r, 0, Math.PI / 2);
    p.push([r, h]);
    arco(r, h - r, Math.PI / 2, Math.PI);
    p.push([0, r]);
    arco(r, r, Math.PI, Math.PI * 1.5);
    const tabuas = [];
    for (let k = 0; k < p.length - 1; k++){
      const [x1, y1] = p[k], [x2, y2] = p[k + 1];
      const len = Math.hypot(x2 - x1, y2 - y1);
      if (len < 0.4) continue;
      tabuas.push({ len: len + 2.2,            // sobra maior: na caixinha escura a fresta aparecia
                    x: (x1 + x2) / 2, y: (y1 + y2) / 2,
                    ang: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI });
    }
    return tabuas;
  }

  // veste uma caixinha: põe as folhas na profundidade e monta a cinta em volta
  // RÉGUA DA GROSSURA — pra Le achar o ponto sem esperar deploy nenhum:
  // ponha ?g=28 no fim do endereço (28 = 28% de lombada no celular).
  // Sem ?g, valem os números fixos daqui, que são os mesmos do CSS.
  const _q = new URLSearchParams(location.search).get('g');
  const GROSSO_C = _q ? (parseFloat(_q) / 100) : 0.2500;   // celular: média, fechado
  const GROSSO_D = 0.1350;   // DESKTOP = femea.live clonado, fixo. A régua ?g só mexe no CELULAR.
  if (_q) document.documentElement.style.setProperty('--d', `calc(var(--w) * ${GROSSO_C})`);

  function vesteCaixa(cx, w, h){
    // a lombada e o raio seguem sempre a MENOR medida da face — assim a caixa
    // deitada (desktop) fica com a mesma lombada da caixa em pé (celular)
    const m = Math.min(w, h);
    // DESKTOP = a do femea.live (13,5% e 5,5%, sobre a LARGURA).
    // CELULAR = o MIX (19,89% e 10%, sobre a menor medida).
    // Os mesmos números do CSS — se mudar lá, muda aqui.
    const fem = window.matchMedia('(min-width: 768px)').matches;
    const d = fem ? w * GROSSO_D : m * GROSSO_C;
    const r = fem ? w * 0.055  : m * 0.100;
    cx.querySelectorAll('.cx-tabua').forEach(t => t.remove());
    const f = cx.querySelector('.cx-folha--frente'), v = cx.querySelector('.cx-folha--verso');
    if (f) f.style.transform = `translateZ(${d / 2}px)`;
    if (v) v.style.transform = `translateZ(${-d / 2}px) rotateY(180deg)`;
    const frag = document.createDocumentFragment();
    cinta(w, h, r).forEach(t => {
      const b = document.createElement('i');
      b.className = 'cx-tabua';
      const luz = Math.abs(Math.cos((t.ang * Math.PI) / 180));
      b.style.cssText =
        `width:${t.len}px; height:${d + 1.6}px;` +
        `left:${t.x - t.len / 2}px; top:${t.y - (d + 1.6) / 2}px;` +
        `transform: rotateZ(${t.ang}deg) rotateX(90deg);` +
        `background: color-mix(in srgb, #805F4C ${(82 - 12 * luz).toFixed(1)}%, #34160B ${(18 + 12 * luz).toFixed(1)}%);`;
      frag.appendChild(b);
    });
    cx.appendChild(frag);

  }


const stages=[...document.querySelectorAll('.native-box-stage')],items=[...document.querySelectorAll('.collection-item-project')];
const active=new Set();const sizes=new WeakMap();
function build(stage){const box=stage.querySelector('.native-ready-box'),w=box.offsetWidth,h=box.offsetHeight,key=w+'x'+h;if(!w||!h||sizes.get(box)===key)return;sizes.set(box,key);box.style.setProperty('--box-w',w+'px');box.style.setProperty('--box-h',h+'px');box.style.setProperty('--cx-raio',w*(innerWidth>=768?.055:.1)+'px');vesteCaixa(box,w,h)}
const observer=new IntersectionObserver(entries=>{for(const e of entries){const stage=e.target;if(e.isIntersecting){stage.classList.add('box-near');active.add(stage);build(stage)}else{stage.classList.remove('box-near');active.delete(stage)}}},{rootMargin:'900px 0px'});stages.forEach(s=>observer.observe(s));
let resizeFrame=0;window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{for(const s of active)build(s)})});
window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});})();