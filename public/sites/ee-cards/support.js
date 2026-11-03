
(()=>{
 const removeBadge=()=>{document.querySelectorAll('a[href="https://www.framer.com"],a[href="https://framer.com"]').forEach(e=>e.remove());document.querySelectorAll('a[href*="/:"]').forEach(e=>{e.removeAttribute('href');e.setAttribute('aria-disabled','true');e.setAttribute('tabindex','-1')})};
 removeBadge();new MutationObserver(removeBadge).observe(document.documentElement,{childList:true,subtree:true});
 if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
})();
// Keep navigation on this project's published pages instead of Framer's source router.
window.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const anchor=event.target.closest('a[href]');if(!anchor||anchor.hasAttribute('download')||anchor.target==='_blank')return;
 const next=new URL(anchor.href,location.href);if(next.origin!==location.origin||next.pathname===location.pathname&&next.search===location.search)return;
 event.preventDefault();event.stopImmediatePropagation();location.assign(next.href);
},true);
