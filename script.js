document.addEventListener("DOMContentLoaded", ()=>{

  /* ===== منطق العمر ===== */
  const age = document.getElementById("age");
  const guardian = document.getElementById("guardian");

  function checkAge(){
    const a = parseInt(age.value,10);
    guardian.style.display = (!isNaN(a) && a < 18) ? "block" : "none";
  }

  age.addEventListener("input", checkAge);
  age.addEventListener("change", checkAge);
  checkAge();

  /* ===== التوقيع (Mouse فقط – ويندوز مضمون) ===== */
  const canvas = document.getElementById("sig");
  if(!canvas) return;

  const ctx = canvas.getContext("2d");
  let drawing = false;

  function resetCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }

  resetCanvas();

  canvas.addEventListener("mousedown", e=>{
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mousemove", e=>{
    if(!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });

  ["mouseup","mouseleave"].forEach(ev=>{
    canvas.addEventListener(ev, ()=> drawing=false);
  });

  window.clearSig = resetCanvas;

});
