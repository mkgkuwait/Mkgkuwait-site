/* =====================
   Language (AR / EN)
===================== */
const LANG_KEY = "site_lang";

function applyLang(lang){
  document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";

  // النصوص
  document.querySelectorAll("[data-ar]").forEach(el=>{
    el.textContent = (lang === "ar") ? el.dataset.ar : el.dataset.en;
  });

  // placeholders
  document.querySelectorAll("[data-ph-ar]").forEach(el=>{
    el.placeholder = (lang === "ar") ? el.dataset.phAr : el.dataset.phEn;
  });
}

function toggleLang(){
  const current = localStorage.getItem(LANG_KEY) || "ar";
  const next = (current === "ar") ? "en" : "ar";
  localStorage.setItem(LANG_KEY, next);
  applyLang(next);
}

document.addEventListener("DOMContentLoaded", ()=>{
  applyLang(localStorage.getItem(LANG_KEY) || "ar");
});


/* =====================
   Signature Canvas
   (Windows + iOS)
===================== */
document.addEventListener("DOMContentLoaded", ()=>{

  const canvas = document.getElementById("sig");
  if(!canvas) return; // فقط صفحة التسجيل

  const ctx = canvas.getContext("2d");
  let drawing = false;

  function initCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }
  initCanvas();

  function getPos(e){
    const rect = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return {
      x: p.clientX - rect.left,
      y: p.clientY - rect.top
    };
  }

  function startDraw(e){
    e.preventDefault();
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function drawMove(e){
    if(!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function endDraw(){
    drawing = false;
  }

  // Mouse
  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", drawMove);
  canvas.addEventListener("mouseup", endDraw);
  canvas.addEventListener("mouseleave", endDraw);

  // Touch (iOS)
  canvas.addEventListener("touchstart", startDraw, {passive:false});
  canvas.addEventListener("touchmove", drawMove, {passive:false});
  canvas.addEventListener("touchend", endDraw);

  // مسح التوقيع
  window.clearSig = initCanvas;
});
