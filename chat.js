const chatBox = document.querySelector("#chat-box");
const inputField = document.querySelector("#user-input");
const sendBtn = document.querySelector("#send-btn");

async function sendMessage() {
  const message = inputField.value.trim();
  if (!message) return;

  // Visa elevens meddelande
  appendMessage("user", message);
  inputField.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error("Serverfel");
    const data = await res.json();
    appendMessage("juan", data.reply);
  } catch (err) {
    appendMessage("juan", "Fel vid kontakt med servern, po 😅");
  }
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = sender === "user" ? "user-msg" : "juan-msg";
  div.innerHTML =
    sender === "juan"
      ? `<img src="public/Juan Antonio (1).webp" class="avatar"/> <p>${text}</p>`
      : `<p>${text}</p>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Hälsning när sidan laddas
window.onload = () => {
  appendMessage(
    "juan",
    "¡Hola! Soy Juan Antonio, tu amigo cóndor. Jag är här för att hjälpa dig med spanskan. ¿Cómo te llamas y en qué curso estás?"
  );
};
// Fakta och slanglistor
const chileFacts = [
  "Chile är det längsta landet i världen från norr till söder, cachai?",
  "Chilenare säger ofta 'po' i slutet av meningar – det betyder egentligen bara 'pues'.",
  "Empanadas de pino är en klassisk chilensk rätt med kött, ägg och oliver.",
  "Santiago ligger omgiven av Anderna – ibland kan man åka skidor och bada samma dag!",
  "Chilenare använder 'bacán' för att säga att något är riktigt bra!"
];

const chileSlang = [
  "Po – kort för 'pues', används för att förstärka (t.ex. 'sí, po!')",
  "Cachai – betyder 'fattar du?' eller 'hänger du med?'",
  "Luca – slang för 1000 pesos 💸",
  "Fome – tråkig eller ointressant",
  "Al tiro – betyder 'på direkten!'"
];

function randomChileInfo() {
  const all = [...chileFacts, ...chileSlang];
  const random = all[Math.floor(Math.random() * all.length)];
  appendMessage("juan", random);
}

// Klick på bilden
document
  .querySelector(".avatar")
  ?.addEventListener("click", randomChileInfo);
