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
