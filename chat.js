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

