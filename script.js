const LANG_KEY = "site_lang";

function applyLang(lang){
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  // النصوص
  document.querySelectorAll("[data-ar]").forEach(el=>{
    el.textContent = lang === "ar" ? el.dataset.ar : el.dataset.en;
  });

  // الـ placeholders
  document.querySelectorAll("[data-ph-ar]").forEach(el=>{
    el.placeholder = lang === "ar" ? el.dataset.phAr : el.dataset.phEn;
  });
}

function toggleLang(){
  const next = (localStorage.getItem(LANG_KEY) || "ar") === "ar" ? "en" : "ar";
  localStorage.setItem(LANG_KEY, next);
  applyLang(next);
}

document.addEventListener("DOMContentLoaded",()=>{
  applyLang(localStorage.getItem(LANG_KEY) || "ar");
});
