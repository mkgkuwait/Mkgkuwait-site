<script>
document.getElementById("volunteerForm").addEventListener("submit", function(e){
  e.preventDefault();

  const age = parseInt(document.getElementById("age").value,10);
  const data = new FormData(this);

  if(age >= 10 && age <= 17){
    const canvas = document.getElementById("sig");
    if(canvas){
      data.append("Guardian_Signature_Base64", canvas.toDataURL("image/png"));
    }
  }

  fetch("https://script.google.com/macros/s/AKfycbygn8i590rV6sLcHtjZV2HrcUVSE-VILFyrqqj-bvpIotdPMxK9TpNbvSWeGuMtO_YYMA/exec", {
    method: "POST",
    body: data
  })
  .then(()=> window.location.href="thankyou.html")
  .catch(()=> alert("حدث خطأ أثناء الإرسال"));
});
</script>
