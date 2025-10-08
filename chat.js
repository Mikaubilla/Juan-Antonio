const chatBox = document.getElementById("chatBox");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const juanImage = document.getElementById("juanImage");
const teacherPanelBtn = document.getElementById("teacherPanelBtn");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
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
    msg.appendChild(icon.cloneNode(true)); // liten spegelvänd ikon
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
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

// 🔸 Slang och fakta på klick
juanImage.addEventListener("click", () => {
  const slump = Math.random();
  if (slump < 0.5) {
    const slang = [
      "¡Qué bacán! – betyder 'så coolt!' 😎",
      "¡La raja! – betyder 'superbra!'",
      "¡Po! – används för att förstärka, typ 'ju'.",
      "¡Cachai! – betyder 'fattar du?'.",
      "¡Fome! – betyder 'tråkigt'.",
      "¡Al tiro! – betyder 'på en gång!'"
    ];
    addMessage("juan", slang[Math.floor(Math.random() * slang.length)]);
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

// 🔸 Lärarpanel
teacherPanelBtn.addEventListener("click", () => {
  const password = prompt("Ange lärarlösenord:");
  if (password === "mika") {
    window.location.href = "teacherPanel.html";
  } else {
    alert("Fel lösenord, po 😅");
  }
});
