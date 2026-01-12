const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbxXBgLyEnh0-9R6P3g9gUF835RU-fF3xTPMScrwJHmzd9i2NY6KVKc0h9xzZNhhf4By/exec";

const form = document.getElementById("regForm");
const msg = document.getElementById("msg");
const btn = document.getElementById("submitBtn");

function setMsg(text, ok = true) {
  msg.textContent = text;
  msg.style.color = ok ? "rgba(110,231,255,.95)" : "rgba(255,140,140,.95)";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fd = new FormData(form);
  const name = (fd.get("name") || "").toString().trim();
  if (!name) {
    setMsg("⚠️ Inserisci Nome e Cognome.", false);
    return;
  }

  btn.disabled = true;
  setMsg("Invio in corso…");

  // Crea un form “shadow” che invia senza CORS
  const shadow = document.createElement("form");
  shadow.action = ENDPOINT_URL;
  shadow.method = "GET";
  shadow.target = "hidden_iframe"; // invia nell'iframe nascosto

  // Copia campi
  const fields = {
    name: name,
    instagram: (fd.get("instagram") || "").toString().trim(),
    count: (fd.get("count") || "1").toString(),
    beer: form.querySelector('input[name="beer"]').checked ? "1" : "0",
    t: Date.now().toString()
  };

  Object.entries(fields).forEach(([k, v]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = k;
    input.value = v;
    shadow.appendChild(input);
  });

  document.body.appendChild(shadow);
  shadow.submit();

  // UX: non possiamo leggere la risposta (cross-origin), quindi assumiamo ok
  setTimeout(() => {
    form.reset();
    form.querySelector('input[name="beer"]').checked = true;
    setMsg("✅ Registrazione completata! Ci vediamo al TREBPARTY 🍻");
    btn.disabled = false;
    shadow.remove();
  }, 700);
});
