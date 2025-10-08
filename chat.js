// === chat.js (FRONTEND) ===
// Hanterar chattens knappar, inmatning och animationer

const chatContainer = document.getElementById("chat-container");
const inputField = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const condorImg = document.getElementById("juan-antonio-img");

// Enkel minneshantering för denna session
let chatHistory = [];
let studentData = { namn: "", arskurs: "", mal: "" };

// Liten databas för chilenska uttryck
const chileanSlang = [
  { word: "po", meaning: "Ett typiskt chilenskt ord som inte betyder något särskilt – som att säga 'liksom'." },
  { word: "bacán", meaning: "Betyder 'coolt!' eller 'grymt!' – används ofta när något är bra." },
  { word: "cachai", meaning: "Betyder 'förstår du?' – används i vardagligt talspråk." },
  { word: "al tiro", meaning: "Betyder 'på en gång!' eller 'direkt'." }
];

// === Klick på Juan Antonio-bilden för att visa ett slumpat slangord ===
if (condorImg) {
  condorImg.addEventListener("click", () => {
    const random = chileanSlang[Math.floor(Math.random() * chileanSlang.length)];
    alert(`${random.word.toUpperCase()}: ${random.meaning}`);
  });
}

// === Skicka meddelande ===
if (sendButton) {
  sendButton.addEventListener("click", sendMessage);
}

inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  inputField.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: buildPrompt(userMessage) }),
    });

    const data = await response.json();
    if (data.reply) {
      addMessage("bot", data.reply);

      // Om svaret innehåller "bra jobbat" eller liknande → visa firar-animation
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

// === Skapa meddelande-element ===
function addMessage(sender, text) {
  const message = document.createElement("div");
  message.classList.add("message", sender);

  const avatar = document.createElement("img");
  avatar.src = sender === "bot" ? "Juan Antonio (1).webp" : "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  avatar.classList.add("avatar");

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.innerText = text;

  message.appendChild(avatar);
  message.appendChild(bubble);
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// === Skapa prompt med elevens uppgifter ===
function buildPrompt(userInput) {
  if (!studentData.namn || !studentData.arskurs || !studentData.mal) {
    const parts = userInput.match(/heter\s+(\w+)|(\d+an)|öva\s+på\s+(\w+)/gi);
    if (parts) {
      parts.forEach((p) => {
        if (p.includes("heter")) studentData.namn = p.split("heter")[1].trim();
        if (p.includes("an")) studentData.arskurs = p.trim();
        if (p.includes("öva")) studentData.mal = p.split("öva på")[1].trim();
      });
    }
  }

  const intro = `Elev: ${studentData.namn || "okänd"}, årskurs ${studentData.arskurs || "?"}, vill öva på ${studentData.mal || "spanska"}.`;
  return `${intro}\n${userInput}`;
}

// === Fira-animation när eleven klarat något ===
function showCelebration() {
  const confetti = document.createElement("div");
  confetti.innerHTML = "🎉 ¡Bacán! 🎉";
  confetti.style.position = "fixed";
  confetti.style.top = "40%";
  confetti.style.left = "50%";
  confetti.style.transform = "translate(-50%, -50%)";
  confetti.style.fontSize = "2rem";
  confetti.style.animation = "fadeOut 2s forwards";
  document.body.appendChild(confetti);

  setTimeout(() => confetti.remove(), 2000);
}
