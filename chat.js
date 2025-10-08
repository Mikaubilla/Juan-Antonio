// === CHAT FRONTEND ===
const chatContainer = document.getElementById("chat-container");
const input = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const juanImage = document.getElementById("juan-image");
const teacherBtn = document.getElementById("teacher-btn");
const teacherPanel = document.getElementById("teacher-panel");
const loginBtn = document.getElementById("login-btn");
const passwordInput = document.getElementById("password");
const teacherContent = document.getElementById("teacher-content");
const notesInput = document.getElementById("teacher-notes");
const saveBtn = document.getElementById("save-notes");
const savedMsg = document.getElementById("saved-msg");

// === Fakta & slang ===
const juanData = {
  slang: [
    { word: "bacán", meaning: "betyder 'superbra' eller 'cool' på chilenska" },
    { word: "po", meaning: "läggs till i slutet av meningar, ungefär som 'du vet'" },
    { word: "cachai", meaning: "betyder 'fattar du?' eller 'hänger du med?'" },
    { word: "al tiro", meaning: "betyder 'direkt' eller 'på en gång'" }
  ],
  facts: [
    "Chile är världens längsta land från norr till söder 🇨🇱",
    "Påskön tillhör Chile och är känd för sina stenstatyer 🗿",
    "Chilenare älskar 'asado' – grillkvällar med familjen 🔥",
    "I Chile säger man ofta 'po' i slutet av meningar, cachai?"
  ]
};

// === Klick på bilden ===
juanImage.addEventListener("click", () => {
  const randomType = Math.random() < 0.5 ? "slang" : "facts";
  const list = juanData[randomType];
  const item = list[Math.floor(Math.random() * list.length)];
  const msg = randomType === "slang"
    ? `💬 <b>${item.word}</b>: ${item.meaning}`
    : `📘 ${item}`;
  addMessage("Juan Antonio", msg);
});

// === Lärarpanel ===
teacherBtn.addEventListener("click", () => teacherPanel.classList.remove("hidden"));
loginBtn.addEventListener("click", () => {
  if (passwordInput.value === "mika") {
    teacherContent.classList.remove("hidden");
  } else {
    alert("Fel lösenord!");
  }
});

saveBtn.addEventListener("click", () => {
  localStorage.setItem("teacherNotes", notesInput.value);
  savedMsg.classList.remove("hidden");
  setTimeout(() => savedMsg.classList.add("hidden"), 2000);
});

window.addEventListener("load", () => {
  const saved = localStorage.getItem("teacherNotes");
  if (saved) notesInput.value = saved;
});

// === Meddelandefunktion ===
function addMessage(sender, text) {
  const bubble = document.createElement("div");
  bubble.classList.add("message", sender === "user" ? "user" : "bot");

  const content = document.createElement("div");
  content.classList.add("text");
  content.innerHTML = text;
  bubble.appendChild(content);
  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

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
  } catch {
    addMessage("Juan Antonio", "Oj! Något gick fel, po 😅 Försök igen.");
  }
}

sendButton.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
