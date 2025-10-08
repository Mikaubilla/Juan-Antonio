const chatBox = document.querySelector("#chat-box");
const inputField = document.querySelector("#user-input");
const sendBtn = document.querySelector("#send-btn");

async function sendMessage() {
  const message = inputField.value.trim();
  if (!message) return;

  // Visa elevens meddelande
  appendMessage("user", message);
  inputField.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error("Serverfel");
    const data = await res.json();
    appendMessage("juan", data.reply);
  } catch (err) {
    appendMessage("juan", "Fel vid kontakt med servern, po 😅");
  }
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = sender === "user" ? "user-msg" : "juan-msg";
  div.innerHTML =
    sender === "juan"
      ? `<img src="public/Juan Antonio (1).webp" class="avatar"/> <p>${text}</p>`
      : `<p>${text}</p>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Hälsning när sidan laddas
window.onload = () => {
  appendMessage(
    "juan",
    "¡Hola! Soy Juan Antonio, tu amigo cóndor. Jag är här för att hjälpa dig med spanskan. ¿Cómo te llamas y en qué curso estás?"
  );
};
