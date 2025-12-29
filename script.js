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
   EmailJS
====================== */
emailjs.init("Xi6nq5svDk-vUU0b4");
const SERVICE_ID="service_3jvh0md";
const TEMPLATE_ID="template_jznlquo";


document.addEventListener("DOMContentLoaded",()=>{

  /* ========= منطق العمر ========= */
  const age = document.getElementById("age");
  const guardian = document.getElementById("guardian");

  if(guardian) guardian.style.display="none";

  if(age && guardian){
    age.addEventListener("input",()=>{
      const a = parseInt(age.value,10);

      if(!isNaN(a) && a < 18){
        guardian.style.display="block";
      }else{
        guardian.style.display="none";
      }
    });
  }

  /* ========= التوقيع ========= */
  const canvas = document.getElementById("sig");
  let ctx, drawing=false;

  if(canvas){
    ctx = canvas.getContext("2d");

    /* خلفية بيضاء ثابتة */
    ctx.fillStyle="#ffffff";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    /* قلم أسود واضح */
    ctx.strokeStyle="#000000";
    ctx.lineWidth=2;
    ctx.lineCap="round";

    canvas.addEventListener("mousedown",(e)=>{
      drawing=true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX,e.offsetY);
    });

    canvas.addEventListener("mousemove",(e)=>{
      if(drawing){
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
      }
    });

    canvas.addEventListener("mouseup",()=>drawing=false);
    canvas.addEventListener("mouseleave",()=>drawing=false);

    window.clearSig=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle="#ffffff";
      ctx.fillRect(0,0,canvas.width,canvas.height);
    };
  }

  /* ========= الإرسال ========= */
  const form = document.getElementById("volunteerForm");
  if(form){
    form.addEventListener("submit",(e)=>{
      e.preventDefault();

      emailjs.send(SERVICE_ID,TEMPLATE_ID,{
        name: form.name.value,
        civil: form.civil.value,
        age: form.age.value,
        field: form.field.value,
        gname: form.gname.value || "",
        gphone: form.gphone.value || "",
        signature: canvas ? canvas.toDataURL("image/png") : ""
      }).then(()=>{
        window.location.href="thankyou.html";
      }).catch(err=>{
        alert("حدث خطأ أثناء الإرسال");
        console.error(err);
      });
    });
  }

});
