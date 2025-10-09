// ===========================
// 🎓 Juan Antonio Chat
// ===========================

const chatBox = document.querySelector("#chat-box");
const inputField = document.querySelector("#user-input");
const sendBtn = document.querySelector("#send-btn");

// Spara lärarens fokusområde i localStorage
let teacherFocus = localStorage.getItem("teacherFocus") || "";

// Hälsning när sidan öppnas
window.onload = () => {
  appendMessage(
    "juan",
    "¡Hola! Soy Juan Antonio, tu amigo cóndor. Jag är här för att hjälpa dig med spanskan. ¿Cómo te llamas y en qué curso estás?"
  );
};

// ===========================
// 💬 Chatfunktion
// ===========================
async function sendMessage() {
  const message = inputField.value.trim();
  if (!message) return;

  appendMessage("user", message);
  inputField.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `${message}\n\nFokusområde: ${teacherFocus}`
      })
    });

    if (!res.ok) throw new Error("Serverfel");
    const data = await res.json();
    appendMessage("juan", data.reply);
  } catch (err) {
    appendMessage("juan", "Ay, no puedo hablar con el servidor, po 😅");
  }
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = sender === "user" ? "user-msg" : "juan-msg";
  div.innerHTML =
    sender === "juan"
      ? `<div class="msg-container"><img src="Juan Antonio (1).webp" class="avatar" /><p>${text}</p></div>`
      : `<div class="msg-container user"><p>${text}</p></div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// ===========================
// 🪶 Klick på Juan Antonio
// ===========================

const chileFacts = [
  "Chile är det längsta landet i världen från norr till söder, cachai?",
  "Chilenare säger ofta 'po' i slutet av meningar – det betyder bara 'pues'.",
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

// Klick på bilden (även dynamiskt skapade bilder)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("avatar")) {
    randomChileInfo();
  }
});

// ===========================
// 🧑‍🏫 Lärarpanel
// ===========================

const panel = document.createElement("div");
panel.className = "teacher-panel";
panel.innerHTML = `
  <button id="open-panel">Lärarpanel</button>
  <div id="panel-content" class="hidden">
    <h3>Lärarpanel</h3>
    <input type="password" id="teacher-password" placeholder="Lösenord">
    <button id="login-btn">Logga in</button>
    <div id="settings" class="hidden">
      <label for="focus-area">Fokusera extra på:</label><br>
      <textarea id="focus-area" rows="4" cols="35" placeholder="Ex: reflexiva verb, artighetsfraser..."></textarea><br>
      <button id="save-btn">Spara</button>
      <p id="saved-msg" style="display:none; color:green;">Sparat!</p>
    </div>
  </div>
`;
document.body.appendChild(panel);

document.getElementById("open-panel").addEventListener("click", () => {
  document.getElementById("panel-content").classList.toggle("hidden");
});

document.getElementById("login-btn").addEventListener("click", () => {
  const password = document.getElementById("teacher-password").value;
  if (password === "mika") {
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("teacher-password").style.display = "none";
    document.getElementById("settings").classList.remove("hidden");
  } else {
    alert("Fel lösenord, po 😅");
  }
});

document.getElementById("save-btn").addEventListener("click", () => {
  const focus = document.getElementById("focus-area").value.trim();
  if (focus) {
    localStorage.setItem("teacherFocus", focus);
    teacherFocus = focus;
    document.getElementById("saved-msg").style.display = "block";
    setTimeout(() => (document.getElementById("saved-msg").style.display = "none"), 1500);
    appendMessage("juan", `Mikaela har sagt att jag ska fokusera extra på: ${focus}. Vamos, po! 💪`);
  }
});
