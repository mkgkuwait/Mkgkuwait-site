/* ===== اللغة ===== */
const LANG_KEY="site_lang";

function applyLang(l){
  document.documentElement.dir = l==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-ar]").forEach(el=>{
    el.textContent = l==="ar"?el.dataset.ar:el.dataset.en;
  });
  document.querySelectorAll("[data-ph-ar]").forEach(el=>{
    el.placeholder = l==="ar"?el.dataset.phAr:el.dataset.phEn;
  });
}
function toggleLang(){
  const n=(localStorage.getItem(LANG_KEY)||"ar")==="ar"?"en":"ar";
  localStorage.setItem(LANG_KEY,n);
  applyLang(n);
}
document.addEventListener("DOMContentLoaded",()=>{
  applyLang(localStorage.getItem(LANG_KEY)||"ar");
});

/* ===== التوقيع ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const canvas=document.getElementById("sig");
  if(!canvas) return;

  const ctx=canvas.getContext("2d");
  let draw=false;

  function reset(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="#000";
    ctx.lineWidth=2;
    ctx.lineCap="round";
  }
  reset();

  function pos(e){
    const r=canvas.getBoundingClientRect();
    const p=e.touches?e.touches[0]:e;
    return {x:p.clientX-r.left,y:p.clientY-r.top};
  }

  canvas.addEventListener("mousedown",e=>{
    draw=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);
  });
  canvas.addEventListener("mousemove",e=>{
    if(!draw) return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();
  });
  canvas.addEventListener("mouseup",()=>draw=false);
  canvas.addEventListener("mouseleave",()=>draw=false);

  canvas.addEventListener("touchstart",e=>{
    e.preventDefault();draw=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);
  },{passive:false});
  canvas.addEventListener("touchmove",e=>{
    e.preventDefault();if(!draw)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();
  },{passive:false});
  canvas.addEventListener("touchend",()=>draw=false);

  window.clearSig=reset;
});
