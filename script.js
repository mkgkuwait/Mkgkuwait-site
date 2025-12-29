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

  /* ========= العمر ========= */
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

  /* ========= التوقيع (Touch + Mouse) ========= */
  const canvas = document.getElementById("sig");
  let ctx, drawing=false;

  if(canvas){
    ctx = canvas.getContext("2d");

    function initCanvas(){
      ctx.fillStyle="#ffffff";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.strokeStyle="#000000";
      ctx.lineWidth=2;
      ctx.lineCap="round";
    }
    initCanvas();

    function getPos(e){
      if(e.touches){
        const r = canvas.getBoundingClientRect();
        return {
          x: e.touches[0].clientX - r.left,
          y: e.touches[0].clientY - r.top
        };
      }
      return { x: e.offsetX, y: e.offsetY };
    }

    function startDraw(e){
      e.preventDefault();
      drawing=true;
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x,p.y);
    }

    function drawMove(e){
      if(!drawing) return;
      e.preventDefault();
      const p = getPos(e);
      ctx.lineTo(p.x,p.y);
      ctx.stroke();
    }

    function endDraw(){
      drawing=false;
    }

    // Mouse
    canvas.addEventListener("mousedown",startDraw);
    canvas.addEventListener("mousemove",drawMove);
    canvas.addEventListener("mouseup",endDraw);
    canvas.addEventListener("mouseleave",endDraw);

    // Touch
    canvas.addEventListener("touchstart",startDraw,{passive:false});
    canvas.addEventListener("touchmove",drawMove,{passive:false});
    canvas.addEventListener("touchend",endDraw);

    window.clearSig = ()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      initCanvas();
    };
  }

  /* ========= الإرسال ========= */
  const form = document.getElementById("volunteerForm");
  if(form){
    form.addEventListener("submit",(e)=>{
      e.preventDefault();

      const a = parseInt(form.age.value,10);
      if(isNaN(a)){
        alert("يرجى إدخال العمر");
        return;
      }

      emailjs.send(SERVICE_ID,TEMPLATE_ID,{
        name: form.name.value,
        civil: form.civil.value,
        age: form.age.value,
        field: form.field.value,
        gname: form.gname?.value || "",
        gphone: form.gphone?.value || "",
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
