/* ======================
   Language (AR / EN)
====================== */
const LANG_KEY = "site_lang";

function applyLang(lang){
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-ar]").forEach(el=>{
    el.textContent = lang === "ar" ? el.dataset.ar : el.dataset.en;
  });

  document.querySelectorAll("[data-ph-ar]").forEach(el=>{
    el.placeholder = lang === "ar" ? el.dataset.phAr : el.dataset.phEn;
  });
}

function toggleLang(){
  const next =
    (localStorage.getItem(LANG_KEY) || "ar") === "ar" ? "en" : "ar";
  localStorage.setItem(LANG_KEY, next);
  applyLang(next);
}

document.addEventListener("DOMContentLoaded",()=>{
  applyLang(localStorage.getItem(LANG_KEY) || "ar");
});


/* ======================
   Volunteer Form Logic
====================== */
document.addEventListener("DOMContentLoaded",()=>{

  const form     = document.getElementById("volunteerForm");
  const age      = document.getElementById("age");
  const guardian = document.getElementById("guardian");
  const agree    = document.getElementById("agree");
  const canvas   = document.getElementById("sig");

  /* ===== ولي الأمر حسب العمر ===== */
  if(age && guardian){
    guardian.style.display = "none";

    age.addEventListener("input",()=>{
      const a = parseInt(age.value,10);

      if(a < 10){
        alert("لا يسمح بالتسجيل لمن هم أقل من 10 سنوات");
        age.value = "";
        guardian.style.display = "none";
        if(agree) agree.required = false;
        return;
      }

      if(a <= 17){
        guardian.style.display = "block";
        if(agree) agree.required = true;
      } else {
        guardian.style.display = "none";
        if(agree) agree.required = false;
      }
    });
  }

  /* ======================
     Signature Canvas (FIXED)
  ====================== */
  let ctx, drawing = false;

  if(canvas){
    ctx = canvas.getContext("2d");

    function resetCanvas(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
    }
    resetCanvas();

    function getPos(e){
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const p = e.touches ? e.touches[0] : e;

      return {
        x: (p.clientX - rect.left) * scaleX,
        y: (p.clientY - rect.top)  * scaleY
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

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", drawMove);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseleave", endDraw);

    canvas.addEventListener("touchstart", startDraw, {passive:false});
    canvas.addEventListener("touchmove", drawMove, {passive:false});
    canvas.addEventListener("touchend", endDraw);

    window.clearSig = resetCanvas;
  }

  /* ======================
     Submit → Google Script
  ====================== */
  if(form){
    form.addEventListener("submit",(e)=>{
      e.preventDefault();

      const a = parseInt(age.value,10);
      if(isNaN(a) || a < 10 || a > 70){
        alert("يرجى إدخال عمر صحيح بين 10 و70");
        return;
      }

      if(a <= 17){
        if(!agree || !agree.checked){
          alert("يجب موافقة ولي الأمر");
          return;
        }
      }

      const data = new FormData(form);

      if(a <= 17 && canvas){
        data.append(
          "Guardian_Signature_Base64",
          canvas.toDataURL("image/png")
        );
      }

      fetch(
        "https://script.google.com/macros/s/AKfycbyDCbO5OAaeY8391ZxiIskjA1L_57P4e6nHOEK6dQoYoHm27HGqiYYUwxOi7h0XWs7WUQ/exec",
        {
          method: "POST",
          body: data
        }
      )
      .then(()=> window.location.href = "thankyou.html")
      .catch(()=> alert("فشل إرسال البيانات، حاول مرة أخرى"));
    });
  }

});
