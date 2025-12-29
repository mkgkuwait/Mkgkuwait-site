// حفظ اللغة
const LANG_KEY="site_lang";
function setLang(l){
  localStorage.setItem(LANG_KEY,l);
  document.documentElement.dir = l==="ar"?"rtl":"ltr";
}
function toggleLang(){
  setLang((localStorage.getItem(LANG_KEY)||"ar")==="ar"?"en":"ar");
}
(function(){ setLang(localStorage.getItem(LANG_KEY)||"ar"); })();

// منطق العمر + التوقيع
document.addEventListener("DOMContentLoaded",()=>{
  const age=document.getElementById("age");
  const guardian=document.getElementById("guardian");
  if(age && guardian){
    guardian.style.display="none";
    age.oninput=()=>guardian.style.display = age.value<18?"block":"none";
  }

  const canvas=document.getElementById("sig");
  if(canvas){
    const ctx=canvas.getContext("2d");
    ctx.strokeStyle="#000";
    let draw=false;
    canvas.onmousedown=()=>draw=true;
    canvas.onmouseup=()=>draw=false;
    canvas.onmousemove=e=>{
      if(draw){ ctx.lineTo(e.offsetX,e.offsetY); ctx.stroke(); }
    };
    window.clearSig=()=>ctx.clearRect(0,0,canvas.width,canvas.height);

    const form=document.querySelector("form");
    if(form){
      form.addEventListener("submit",()=>{
        document.getElementById("guardian_signature").value =
          canvas.toDataURL("image/png");
      });
    }
  }
});
