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
  if(age && guardian){
    guardian.style.display="none";
    age.oninput=()=>guardian.style.display = age.value<18?"block":"none";
  }

  /* التوقيع */
  const canvas=document.getElementById("sig");
  let ctx, draw=false;
  if(canvas){
    ctx=canvas.getContext("2d");
    ctx.strokeStyle="#000";
    ctx.lineWidth=2;

    canvas.onmousedown=()=>draw=true;
    canvas.onmouseup=()=>draw=false;
    canvas.onmousemove=e=>{
      if(draw){
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
      }
    };
    window.clearSig=()=>ctx.clearRect(0,0,canvas.width,canvas.height);
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
