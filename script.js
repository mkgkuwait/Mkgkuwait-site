document.addEventListener("DOMContentLoaded", ()=>{

  /* =====================
     منطق العمر
  ===================== */
  const age = document.getElementById("age");
  const guardian = document.getElementById("guardian");
  const agree = document.getElementById("guardianAgree");
  const hiddenSig = document.getElementById("guardian_signature");

  function checkAge(){
    const a = parseInt(age.value,10);

    if(!isNaN(a) && a >= 10 && a <= 17){
      guardian.style.display = "block";
      if(agree) agree.required = true;
    }else{
      guardian.style.display = "none";
      if(agree) agree.required = false;
      if(hiddenSig) hiddenSig.value = "";
      if(typeof clearSig === "function") clearSig();
    }
  }

  if(age){
    age.addEventListener("input", checkAge);
    age.addEventListener("change", checkAge);
    checkAge();
  }

  /* =====================
     التوقيع (Mouse فقط)
  ===================== */
  const canvas = document.getElementById("sig");
  if(!canvas) return;

  const ctx = canvas.getContext("2d");
  let drawing = false;

  function resetCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#ffffff";   // خلفية بيضاء
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "#000000"; // قلم أسود
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

  /* زر مسح التوقيع */
  window.clearSig = resetCanvas;

  /* =====================
     حفظ التوقيع قبل الإرسال
  ===================== */
  const form = document.querySelector("form");
  if(form){
    form.addEventListener("submit", ()=>{
      const a = parseInt(age.value,10);
      if(a >= 10 && a <= 17 && hiddenSig){
        hiddenSig.value = canvas.toDataURL("image/png");
      }
    });
  }

});
