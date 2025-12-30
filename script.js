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

  /* ===== منطق العمر (بعد الكتابة) ===== */
  if(age && guardian){
    guardian.style.display = "none";

    age.addEventListener("blur", ()=>{
      const a = parseInt(age.value,10);

      if(isNaN(a)){
        guardian.style.display = "none";
        if(agree) agree.required = false;
        return;
      }

      if(a < 10){
        alert("لا يسمح بالتسجيل لمن هم أقل من 10 سنوات");
        age.value = "";
        guardian.style.display = "none";
        if(agree) agree.required = false;
        return;
      }

      if(a >= 10 && a <= 17){
        guardian.style.display = "block";
        if(agree) agree.required = true;
      } else {
        guardian.style.display = "none";
        if(agree) agree.required = false;
      }
    });
  }

  /* ======================
     SIGNATURE CANVAS (FIXED)
  ====================== */
  if(canvas){
    const ctx = canvas.getContext("2d");
    let drawing = false;

    function init(){
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle="#fff";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.strokeStyle="#000";
      ctx.lineWidth=2;
      ctx.lineCap="round";
    }
    init();

    function getPos(e){
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const p = e.touches ? e.touches[0] : e;

      return {
        x:(p.clientX - rect.left) * scaleX,
        y:(p.clientY - rect.top)  * scaleY
      };
    }

    function start(e){
      e.preventDefault();
      drawing = true;
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }

    function move(e){
      if(!drawing) return;
      e.preventDefault();
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    function end(){
      drawing = false;
    }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);

    canvas.addEventListener("touchstart", start, {passive:false});
    canvas.addEventListener("touchmove", move, {passive:false});
    canvas.addEventListener("touchend", end);

    window.clearSig = init;

    console.log("Signature READY");
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
        "https://script.google.com/macros/s/AKfycbx4mZh6Ygr-hi7HEz-P--ZrjNaryLV7dyVmpnI3xzZyVDJIbAYddEA36Yx8_OvkCy7tIA/exec",
        { method:"POST", body:data }
      )
      .then(()=> window.location.href = "thankyou.html")
      .catch(()=> alert("فشل إرسال البيانات، حاول مرة أخرى"));
    });
  }

});
