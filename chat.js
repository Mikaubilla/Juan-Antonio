const chatBox = document.getElementById("chatBox");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const juanImage = document.getElementById("juanImage");
const teacherPanelBtn = document.getElementById("teacherPanelBtn");

// 🔸 Hämtar global fokus från servern (simulerat just nu)
let globalFocus = localStorage.getItem("focusAreas") || "Inga särskilda fokus just nu.";

// 🔸 Minnesdata för aktuell elev (lagras bara under denna chatt)
let student = JSON.parse(sessionStorage.getItem("student")) || null;

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// 🔸 Startar chatten med första fråga om elevens namn och årskurs
window.addEventListener("load", () => {
  if (!student) {
    addMessage("juan", "¡Hola! Vad heter du, vilken årskurs går du i och vad vill du öva på idag?");
  } else {
    addMessage("juan", `¡Hola de nuevo ${student.name}! Hur går det i åk ${student.grade}?`);
  }
});

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

  const celebrateWords = ["klart", "färdig", "yay", "¡listo!", "rätt"];
  if (celebrateWords.some((w) => text.toLowerCase().includes(w))) {
    showCelebration();
  }
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";

  // 🔸 Om ingen elevdata finns – försök tolka svaret som introduktion
  if (!student) {
    const match = text.match(/([A-Za-zåäöÅÄÖ]+).*?(?:åk|årskurs)?\s*(\d+)/i);
    if (match) {
      student = {
        name: match[1],
        grade: match[2],
        topic: text.split(" ").slice(2).join(" ") || "spanska generellt"
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
        focus: globalFocus
      }),
    });

    const data = await res.json();

    if (data.reply) {
      addMessage("juan", data.reply);
    } else {
      addMessage("juan", "Oj, något gick fel po 😅 Försök igen snart.");
    }
  } catch (err) {
    console.error("Fel:", err);
    addMessage("juan", "Servern verkar sova just nu po 😴");
  }
}

// 🔸 Slang + fakta
juanImage.addEventLi
