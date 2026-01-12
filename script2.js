// === CONFIG ===
// 1) Pubblica un Google Apps Script come Web App e incolla qui l'URL:
const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbwDU-hBQaxLwR7TTLC8gWeeJt6gT6-2jkZa0EaGIg6WMNox8qYBUNjAPgnJ40VU5qAL/exec";

const form = document.getElementById("regForm");
const msg = document.getElementById("msg");
const btn = document.getElementById("submitBtn");

function setMsg(text, ok=true){
  msg.textContent = text;
  msg.style.color = ok ? "rgba(110,231,255,.95)" : "rgba(255,140,140,.95)";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!ENDPOINT_URL || ENDPOINT_URL.includes("PASTE_YOUR")){
    setMsg("⚠️ Prima devi configurare ENDPOINT_URL (Google Apps Script). Vedi README.", false);
    return;
  }

  btn.disabled = true;
  setMsg("Invio in corso…");

  const data = new FormData(form);
  const payload = {
    name: (data.get("name") || "").toString().trim(),
    instagram: (data.get("instagram") || "").toString().trim(),
    count: (data.get("count") || "1").toString(),
    beer: !!data.get("beer"),
    timestamp: new Date().toISOString()
  };

  try{
    const res = await fetch(ENDPOINT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("HTTP " + res.status);
    const out = await res.json();

    if (out && out.ok){
      form.reset();
      // keep beer checked by default
      form.querySelector('input[name="beer"]').checked = true;
      setMsg("✅ Registrazione completata! Ci vediamo al TREBPARTY 🍻");
    } else {
      throw new Error((out && out.error) ? out.error : "Errore sconosciuto");
    }
  }catch(err){
    setMsg("❌ Errore durante la registrazione. Riprova o avvisa l'organizzatore.", false);
    console.error(err);
  }finally{
    btn.disabled = false;
  }
});
