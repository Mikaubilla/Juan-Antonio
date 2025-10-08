// === chat.js (FRONTEND) ===
// Hanterar chatt, klick på Juan Antonio, lärarhälsning och animationer

const chatContainer = document.getElementById("chat-container");
const inputField = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const condorImg = document.getElementById("juan-antonio-img");

// Minneshantering per session
let chatHistory = [];
let studentData = { namn: "", arskurs: "", fokus: "" };

// Liten databas för chilenska uttryck
const chileanSlang = [
  { word: "po", meaning: "Ett typiskt chilenskt ord som inte betyder något särskilt – som 'liksom'." },
  { word: "bacán", meaning: "Betyder 'coolt!' eller 'grymt!' – används ofta när något är bra." },
  { word: "cachai", meaning: "Betyder 'förstår du?' – vanligt i vardagligt talspråk." },
  { word: "al tiro", meaning: "Betyder 'på en gång!' eller 'direkt'." }
];

// === Klick på Juan Antonio-bilden: slumpmässig slang/fakta ===
if (condorImg) {
  condorImg.addEventListener("click", () => {
    const random = chileanSlang[Math.floor(Math.random() * chileanSlang.length)];
    addMessage("bot", `💬 <b>${random.word}</b>: ${random.meaning}`);
  });
}
// Fakta och uttryck som Juan Antonio säger slumpmässigt
const juanFacts = [
  { es: "¿Sabías que el cóndor puede volar hasta 7000 metros de altura?", sv: "Visste du att kondoren kan flyga upp till 7000 meter högt?" },
  { es: "En Chile decimos 'bacán' för något som är coolt.", sv: "I Chile säger vi 'bacán' när något är coolt." },
  { es: "La palabra 'familia' viene del latín.", sv: "Ordet 'familia' kommer från latin." },
  { es: "¿Cachai? Det betyder typ 'förstår du?'", sv: "‘Cachai?’ betyder ungefär ‘fattar du?’" },
  { es: "Chile tiene más de 600 volcanes activos.", sv: "Chile har över 600 aktiva vulkaner." },
  { es: "‘Po’ betyder inget egentligen – vi bara lägger till det, po 😄", sv: "‘Po’ betyder inget, vi bara säger det!" }
];

// Funktion för slumpmässigt faktameddelande
function randomJuanFact() {
  const fact = juanFacts[Math.floor(Math.random() * juanFacts.length)];
  addMessage(`${fact.es} (${fact.sv})`, "bot");
}

// Aktivera klick på bilden
document.querySelector("#juan-img").addEventListener("click", randomJuanFact);
// === Startmeddelande när sidan laddas ===
window.addEventListener("load", () => {
  setTimeout(() => {
    addMessage("bot", "¡Hola! Soy Juan Antonio, tu amigo cóndor. Jag är här för att hjälpa dig med spanskan. ¿Cómo te llamas y en qué curso estás?");
  }, 600);
})
sendButton.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  inputField.value = "";

  // Analysera elevens svar för namn, årskurs eller fokus
  updateStudentData(userMessage);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: buildPrompt(userMessage) }),
    });

    const data = await response.json();
    if (data.reply) {
      addMessage("bot", data.reply);
      if (data.reply.toLowerCase().includes("bra jobbat") || data.reply.toLowerCase().includes("rätt")) {
        showCelebration();
      }
    } else {
      addMessage("bot", "Oj! Något gick fel, po 😅 Försök igen.");
    }
  } catch (error) {
    console.error(error);
    addMessage("bot", "Fel vid kontakt med servern, po 😅");
  }
}

// === Lagra meddelanden ===
function addMessage(sender, text) {
  const message = document.createElement("div");
  message.classList.add("message", sender);

  const avatar = document.createElement("img");
  avatar.src =
    sender === "bot"
      ? "Juan Antonio (1).webp"
      : "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  avatar.classList.add("avatar");

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.innerHTML = text;

  message.appendChild(avatar);
  message.appendChild(bubble);
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// === Identifiera namn, årskurs och fokus från elevens text ===
function updateStudentData(text) {
  const nameMatch = text.match(/jag heter\s+([A-Za-zÅÄÖåäö]+)/i);
  const yearMatch = text.match(/årskurs\s*(\d+)/i);
  const focusMatch = text.match(/öva\s+(?:på\s+)?([A-Za-zÅÄÖåäö\s]+)/i);

  if (nameMatch) studentData.namn = nameMatch[1];
  if (yearMatch) studentData.arskurs = yearMatch[1];
  if (focusMatch) studentData.fokus = focusMatch[1].trim();
}

// === Bygg prompt till OpenAI (inkl. elevdata) ===
function buildPrompt(userInput) {
  const intro = `
Elev: ${studentData.namn || "okänd"}, årskurs ${studentData.arskurs || "?"}.
Vill öva på ${studentData.fokus || "spanska generellt"}.
`;

  const instruktioner = `
Du är Juan Antonio, en varm, humoristisk chilensk handledare som undervisar spanska för svenska högstadieelever (åk 6–9). 
Du svarar delvis på svenska och blandar in spanska ord och uttryck naturligt. 
Du rättar elevens spanska, förklarar varför något är rätt eller fel, och föreslår alltid en kort övning kopplad till det eleven vill träna på. 
Om eleven börjar prata om något orelaterat, led tillbaka med humor, t.ex. “Haha, det där är inte español, po 😅 ska vi prata om verb istället?”.
`;

  return `${instruktioner}\n${intro}\nElevens meddelande: ${userInput}`;
}

// === Fira-animation när eleven klarar något ===
function showCelebration() {
  const confetti = document.createElement("div");
  confetti.innerHTML = "🎉 ¡Excelente! 🎉";
  confetti.style.position = "fixed";
  confetti.style.top = "40%";
  confetti.style.left = "50%";
  confetti.style.transform = "translate(-50%, -50%)";
  confetti.style.fontSize = "2rem";
  confetti.style.animation = "fadeOut 2s forwards";
  document.body.appendChild(confetti);

  setTimeout(() => confetti.remove(), 2000);
}
// Hantering av lärarpanelen
const teacherPanel = document.getElementById("teacher-panel");
const teacherPassword = "condor123"; // Byt till eget lösenord

document.getElementById("teacher-login").addEventListener("click", async () => {
  const password = document.getElementById("teacher-password").value;
  if (password === teacherPassword) {
    teacherPanel.innerHTML = `
      <h3>Lärarpanel</h3>
      <textarea id="teacher-note" placeholder="Skriv instruktion till Juan Antonio..."></textarea>
      <button id="save-note">Spara</button>
      <p id="status"></p>
    `;
    document.getElementById("save-note").addEventListener("click", async () => {
      const newNote = document.getElementById("teacher-note").value;
      const response = await fetch("/api/updateConfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newNote }),
      });
      const data = await response.json();
      document.getElementById("status").textContent = data.message || data.error;
    });
  } else {
    alert("Fel lösenord, po 😅");
  }
});
