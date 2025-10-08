const chatBox = document.getElementById("chatBox");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const juanImage = document.getElementById("juanImage");
const teacherPanelBtn = document.getElementById("teacherPanelBtn");

let student = JSON.parse(sessionStorage.getItem("student")) || null;

// klicka/skriv
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// hämtar fokus/slang globalt från servern (Edge Config via vårt API)
async function getGlobalSettings() {
  const res = await fetch("/api/config");
  if (!res.ok) return { slangList: [], focusAreas: "", teacherPhrases: "" };
  return await res.json();
}

// start
window.addEventListener("load", async () => {
  const data = await getGlobalSettings();
  window.globalData = data;

  if (!student) {
    addMessage("juan", "¡Hola! Vad heter du, vilken årskurs går du i och vad vill du öva på idag?");
  } else {
    addMessage("juan", `¡Hola de nuevo ${student.name}! Hur går det i åk ${student.grade}?`);
  }
});

// meddelande
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  const icon = document.createElement("img");
  icon.src = "Juan Antonio (1).webp";
  icon.classList.add("icon");

  const content = document.createElement("div");
  content.textContent = text;

  if (sender === "juan") {
    msg.appendChild(icon);
    msg.appendChild(content);
  } else {
    msg.appendChild(content);
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  addMessage("user", text);
  input.value = "";

  if (!student) {
    const match = text.match(/([A-Za-zåäöÅÄÖ]+).*?(?:åk|årskurs)?\s*(\d+)/i);
    if (match) {
      student = {
        name: match[1],
        grade: match[2],
        topic: text.split(" ").slice(2).join(" ") || "spanska generellt",
      };
      sessionStorage.setItem("student", JSON.stringify(student));
      addMessage("juan", `Encantado, ${student.name}! 😄 Du går i åk ${student.grade}, jag hjälper dig gärna med ${student.topic}.`);
      return;
    } else {
      addMessage("juan", "Förlåt po, jag tror jag missade – vad heter du och vilken årskurs går du i?");
      return;
    }
  }

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${student.name} i åk ${student.grade} säger: ${text}`,
      }),
    });
    const data = await res.json();
    addMessage("juan", data.reply || "Oj, något gick fel po 😅");
  } catch (err) {
    addMessage("juan", "Servern verkar sova just nu po 😴");
  }
}

// 🔸 Klick på bilden
juanImage.addEventListener("click", async () => {
  const { slangList } = window.globalData || { slangList: [] };
  const slump = Math.random();

  if (slump < 0.5 && slangList.length > 0) {
    const randomSlang = slangList[Math.floor(Math.random() * slangList.length)];
    addMessage("juan", `${randomSlang}`);
  } else {
    const fakta = [
      "Visste du att Chile har världens längsta kustlinje?",
      "I Spanien äter man middag runt klockan 22!",
      "Selena Gomez har mexikanska rötter 🇲🇽",
      "Shakira började sjunga som barn i Colombia 🎤",
      "Lionel Messi pratar spanska med argentinsk dialekt 🇦🇷",
      "I Peru ligger Machu Picchu – ett underverk!"
    ];
    addMessage("juan", fakta[Math.floor(Math.random() * fakta.length)]);
  }
});

teacherPanelBtn.addEventListener("click", () => {
  const password = prompt("Ange lärarlösenord:");
  if (password === "mika") {
    window.location.href = "teacherPanel.html";
  } else {
    alert("Fel lösenord, po 😅");
  }
});
// === CHAT FRONTEND ===
const chatContainer = document.getElementById("chat-container");
const input = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const juanImage = document.getElementById("juan-image");

// 🔹 Lista på fakta och slang
const juanData = {
  slang: [
    { word: "bacán", meaning: "betyder 'superbra' eller 'cool' på chilenska" },
    { word: "po", meaning: "läggs till i slutet av meningar, ungefär som 'du vet'" },
    { word: "cachai", meaning: "betyder 'fattar du?' eller 'hänger du med?'" },
    { word: "al tiro", meaning: "betyder 'direkt' eller 'på en gång'" }
  ],
  facts: [
    "Chile är världens längsta land från norr till söder 🇨🇱",
    "I Chile dricker man mycket mate – en sorts örtte ☕️",
    "Påskön (Isla de Pascua) tillhör Chile och är känd för sina stora stenstatyer 🗿",
    "Chile har över 500 vulkaner, varav många fortfarande är aktiva 🌋",
    "Chilenare älskar fotboll och grill – 'asado' är heligt! ⚽🔥"
  ]
};

// 🔹 Visa fakta eller slang slumpmässigt när man klickar på bilden
juanImage.addEventListener("click", () => {
  const randomType = Math.random() < 0.5 ? "slang" : "facts";
  const list = juanData[randomType];
  const randomItem = list[Math.floor(Math.random() * list.length)];

  const message =
    randomType === "slang"
      ? `💬 <b>${randomItem.word}</b>: ${randomItem.meaning}`
      : `📘 ${randomItem}`;

  addMessage("Juan Antonio", message);
});

// === Funktion för att visa meddelanden i chatten ===
function addMessage(sender, text) {
  const bubble = document.createElement("div");
  bubble.classList.add("message", sender === "user" ? "user" : "bot");

  // Lägg till bild vid varje meddelande från Juan Antonio
  if (sender === "Juan Antonio") {
    const avatar = document.createElement("img");
    avatar.src = "Juan Antonio (1).webp";
    avatar.classList.add("avatar");
    bubble.appendChild(avatar);
  }

  const content = document.createElement("div");
  content.classList.add("text");
  content.innerHTML = text;
  bubble.appendChild(content);

  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// === Skicka användarens text till API ===
async function sendMessage() {
  const prompt = input.value.trim();
  if (!prompt) return;

  addMessage("user", prompt);
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    addMessage("Juan Antonio", data.reply);
  } catch (error) {
    addMessage("Juan Antonio", "Oj! Något gick fel, po 😅 Försök igen.");
  }
}

sendButton.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
