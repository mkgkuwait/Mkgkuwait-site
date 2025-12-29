/* ======================
   Language (AR / EN)
====================== */
const LANG_KEY="site_lang";
function setLang(l){
  localStorage.setItem(LANG_KEY,l);
  document.documentElement.dir = l==="ar"?"rtl":"ltr";
}
function toggleLang(){
  setLang((localStorage.getItem(LANG_KEY)||"ar")==="ar"?"en":"ar");
}
(function(){ setLang(localStorage.getItem(LANG_KEY)||"ar"); })();


/* ======================
   EmailJS Init
====================== */
emailjs.init("Xi6nq5svDk-vUU0b4"); // Public Key

const SERVICE_ID = "service_3jvh0md";
const TEMPLATE_ID = "template_jznlquo"; // ← هذا اللي تسأل عنه


/* ======================
   Page Logic
====================== */
document.addEventListener("DOMContentLoaded",()=>{

  /* عمر المتطوع */
  const age=document.getElementById("age");
  const guardian=document.getElementById("guardian");
  /* ======================
   منطق العمر الواضح
====================== */
const ageNote = document.getElementById("ageNote");

if(age && guardian && ageNote){
  guardian.style.display = "none";
  ageNote.innerText = "";

  age.addEventListener("input", ()=>{
    const a = parseInt(age.value,10);

    // أقل من 10
    if(isNaN(a) || a < 10){
      guardian.style.display = "none";
      ageNote.style.color = "#ff4d4d";
      ageNote.innerText = "التطوع متاح من عمر 10 سنوات فما فوق.";
    }

    // من 10 إلى 17
    else if(a >= 10 && a <= 17){
      guardian.style.display = "block";
      ageNote.style.color = "#ffcc00";
      ageNote.innerText = "يتطلب هذا العمر موافقة ولي الأمر والتوقيع.";
    }

    // من 18 إلى 70
    else if(a >= 18 && a <= 70){
      guardian.style.display = "none";
      ageNote.style.color = "#4caf50";
      ageNote.innerText = "لا يتطلب هذا العمر موافقة ولي الأمر.";
    }

    // أكبر من 70
    else{
      guardian.style.display = "none";
      ageNote.style.color = "#ff4d4d";
      ageNote.innerText = "العمر المدخل خارج نطاق التسجيل.";
    }
  });
}
/* التوقيع */
const canvas=document.getElementById("sig");
let ctx, draw=false;

if(canvas){
  ctx=canvas.getContext("2d");

  /* خلفية بيضاء ثابتة */
  ctx.fillStyle="#fff";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  /* لون التوقيع أسود */
  ctx.strokeStyle="#000";
  ctx.lineWidth=2;
  ctx.lineCap="round";

  canvas.onmousedown=()=>draw=true;
  canvas.onmouseup=()=>draw=false;
  canvas.onmouseleave=()=>draw=false;

  canvas.onmousemove=e=>{
    if(draw){
      ctx.lineTo(e.offsetX,e.offsetY);
      ctx.stroke();
    }
  };

  window.clearSig=()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  };
}

  /* الإرسال */
  const form=document.getElementById("volunteerForm");
  if(form){
    form.addEventListener("submit",(e)=>{
      e.preventDefault();

      emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name: form.name.value,
        civil: form.civil.value,
        age: form.age.value,
        field: form.field.value,
        gname: form.gname.value,
        gphone: form.gphone.value,
        signature: canvas ? canvas.toDataURL("image/png") : ""
      }).then(()=>{
        window.location.href="thankyou.html";
      }).catch(err=>{
        alert("خطأ في الإرسال");
        console.error(err);
      });

    });
  }

});
