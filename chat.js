// ==== Grundinställning ====
const messagesDiv = document.getElementById("messages");
const inputField = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// ==== Funktion för att lägga till meddelande ====
function addMessage(text, sender = "bot") {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerHTML = sender === "bot"
    ? `<img src="juan-antonio.png" class="mini-avatar" /> ${text}`
    : `<div class="user-bubble">${text}</div>`;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ==== Startmeddelande ====
window.addEventListener("load", () => {
  addMessage("¡Hola! Soy Juan Antonio, tu amigo cóndor. Jag är här för att hjälpa dig med spanskan. ¿Cómo te llamas y en qué curso estás?");
});

// ==== Skicka meddelanden ====
sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userText = inputField.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  inputField.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });
    const data = await res.json();

    if (data.error) throw new Error(data.error);
    addMessage(data.reply);
  } catch (err) {
    addMessage("Fel vid kontakt med servern, po 😅");
  }
}

// ==== Fakta och uttryck (klick på bilden) ====
const juanFacts = [
  { es: "¿Sabías que el cóndor puede volar hasta 7000 metros?", sv: "Visste du att kondoren kan flyga upp till 7000 meter högt?" },
  { es: "En Chile decimos 'bacán' för något som är coolt.", sv: "I Chile säger vi 'bacán' när något är coolt." },
  { es: "‘Po’ betyder egentligen inget – vi bara säger det, po 😄", sv: "‘Po’ betyder inget, vi bara lägger till det!" },
  { es: "Chile tiene más de 600 volcanes activos.", sv: "Chile har över 600 aktiva vulkaner." },
  { es: "‘Cachai?’ betyder ungefär ‘fattar du?’", sv: "‘Cachai?’ = ‘förstår du?’" }
];

document.getElementById("juan-img").addEventListener("click", () => {
  const fact = juanFacts[Math.floor(Math.random() * juanFacts.length)];
  addMessage(`${fact.es} (${fact.sv})`);
});

// ==== Lärarpanel ====
const teacherPanel = document.getElementById("teacher-panel");
const teacherPassword = "condor123";

document.getElementById("teacher-login").addEventListener("click", () => {
  const passwordPrompt = prompt("Skriv lärarlösenord, po:");
  if (passwordPrompt === teacherPassword) {
    teacherPanel.innerHTML = `
      <h3>Lärarpanel</h3>
      <textarea id="teacher-note" placeholder="Skriv instruktion till Juan Antonio..."></textarea>
      <button id="save-note">Spara</button>
      <p id="status"></p>
    `;
    document.getElementById("save-note").addEventListener("click", async () => {
      const newNote = document.getElementById("teacher-note").value;
      const res = await fetch("/api/updateConfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newNote })
      });
      const data = await res.json();
      document.getElementById("status").textContent = data.message || data.error;
    });
  } else {
    alert("Fel lösenord, po 😅");
  }
});
