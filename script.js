/* ===== اللغة ===== */
const LANG_KEY="site_lang";

function applyLang(lang){
  document.documentElement.dir = lang==="ar"?"rtl":"ltr";

  document.querySelectorAll("[data-ar]").forEach(el=>{
    el.textContent = lang==="ar"?el.dataset.ar:el.dataset.en;
  });

  document.querySelectorAll("[placeholder]").forEach(el=>{
    if(el.dataset.ar){
      el.placeholder = lang==="ar"?el.dataset.ar:el.dataset.en;
    }
  });
}

function toggleLang(){
  const next = (localStorage.getItem(LANG_KEY)||"ar")==="ar"?"en":"ar";
  localStorage.setItem(LANG_KEY,next);
  applyLang(next);
}

document.addEventListener("DOMContentLoaded",()=>{
  applyLang(localStorage.getItem(LANG_KEY)||"ar");
});

/* ===== التوقيع ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const canvas=document.getElementById("sig");
  if(!canvas) return;

  const ctx=canvas.getContext("2d");
  let drawing=false;

  function reset(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="#000";
    ctx.lineWidth=2;
  }
  reset();

  function pos(e){
    const r=canvas.getBoundingClientRect();
    const t=e.touches?e.touches[0]:e;
    return {x:t.clientX-r.left,y:t.clientY-r.top};
  }

  function start(e){e.preventDefault();drawing=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);}
  function move(e){if(!drawing)return;e.preventDefault();const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();}
  function end(){drawing=false;}

  canvas.addEventListener("mousedown",start);
  canvas.addEventListener("mousemove",move);
  canvas.addEventListener("mouseup",end);
  canvas.addEventListener("mouseleave",end);
  canvas.addEventListener("touchstart",start,{passive:false});
  canvas.addEventListener("touchmove",move,{passive:false});
  canvas.addEventListener("touchend",end);

  window.clearSig=reset;
});
