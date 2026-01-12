 // === CONFIG ===
const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbwDU-hBQaxLwR7TTLC8gWeeJt6gT6-2jkZa0EaGIg6WMNox8qYBUNjAPgnJ40VU5qAL/exec";

const form = document.getElementById("regForm");
const msg = document.getElementById("msg");
const btn = document.getElementById("submitBtn");

function setMsg(text, ok = true) {
  msg.textContent = text;
  msg.style.color = ok ? "rgba(110,231,255,.95)" : "rgba(255,140,140,.95)";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!ENDPOINT_URL) {
    setMsg("⚠️ ENDPOINT_URL non configurato.", false);
    return;
  }

  btn.disabled = true;
  setMsg("Invio in corso…");

  const data = new FormData(form);
  const name = (data.get("name") || "").toString().trim();
  const instagram = (data.get("instagram") || "").toString().trim();
  const count = (data.get("count") || "1").toString();
  const beer = form.querySelector('input[name="beer"]').checked ? "1" : "0";

  if (!name) {
    setMsg("⚠️ Inserisci Nome e Cognome.", false);
    btn.disabled = false;
    return;
  }

  // GET querystring
  const qs = new URLSearchParams({
    name,
    instagram,
    count,
    beer,
    t: Date.now().toString(), // cache-buster
  });

  try {
    const res = await fetch(`${ENDPOINT_URL}?${qs.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    // Se qui arriva, non è più "HTTP 0"
    if (!res.ok) throw new Error("HTTP " + res.status);

    const out = await res.json();
    if (out && out.ok) {
      form.reset();
      form.querySelector('input[name="beer"]').checked = true;
      setMsg("✅ Registrazione completata! Ci vediamo al TREBPARTY 🍻");
    } else {
      throw new Error(out?.error || "Errore sconosciuto");
    }
  } catch (err) {
    setMsg("❌ Errore durante la registrazione. Riprova o avvisa l'organizzatore.", false);
    console.error(err);
  } finally {
    btn.disabled = false;
  }
});
