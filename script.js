/* ======================
   Language (AR / EN)
====================== */
const LANG_KEY = "site_lang";
function setLang(l){
  localStorage.setItem(LANG_KEY,l);
  document.documentElement.dir = l==="ar" ? "rtl" : "ltr";
}
function toggleLang(){
  setLang((localStorage.getItem(LANG_KEY)||"ar")==="ar"?"en":"ar");
}
(function(){
  setLang(localStorage.getItem(LANG_KEY)||"ar");
})();


/* ======================
   EmailJS
====================== */
emailjs.init("Xi6nq5svDk-vUU0b4");
const SERVICE_ID = "service_3jvh0md";
const TEMPLATE_ID = "template_jznlquo";


document.addEventListener("DOMContentLoaded", ()=>{

  /* ========= منطق العمر (حازم) ========= */
  const age = document.getElementById("age");
  const guardian = document.getElementById("guardian");

  // إخفاء إجباري عند التحميل
  if(guardian) guardian.style.display = "none";

  function checkAge(){
    const a = parseInt(age.value,10);

    if(!isNaN(a) && a < 18){
      guardian.style.display = "block";
    }else{
      guardian.style.display = "none";
    }
  }

  if(age && guardian){
    age.addEventListener("input", checkAge);
    age.addEventListener("change", checkAge);
    checkAge(); // فحص فوري
  }

  /* ========= التوقيع (ويندوز + ماوس مضمون) ========= */
  const canvas = document.getElementById("sig");
  let ctx;
  let drawing = false;

  if(canvas){
    ctx = canvas.getContext("2d");

    function resetCanvas(){
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
    }

    resetCanvas();

    function startDraw(e){
      drawing = true;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      ctx.beginPath();
      ctx.moveTo(x,y);
    }

    function draw(e){
      if(!drawing) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      ctx.lineTo(x,y);
      ctx.stroke();
    }

    function stopDraw(){
      drawing = false;
    }

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseleave", stopDraw);

    window.clearSig = resetCanvas;
  }

  /* ========= الإرسال ========= */
  const form = document.getElementById("volunteerForm");
  if(form){
    form.addEventListener("submit", (e)=>{
      e.preventDefault();

      const a = parseInt(form.age.value,10);
      if(isNaN(a)){
        alert("يرجى إدخال العمر");
        return;
      }

      emailjs.send(SERVICE_ID, TEMPLATE_ID, {
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
