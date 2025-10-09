document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const juanImg = document.getElementById("juanAntonioImage");

  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Hälsning vid start
  appendMessage(
    "bot",
    "¡Hola! Soy Juan Antonio, tu amigo cóndor. Jag är här för att hjälpa dig med spanskan. ¿Cómo te llamas y en qué curso estás?"
  );

  // Skicka meddelande
  sendBtn.addEventListener("click", async () => {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage("user", text);
    userInput.value = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      appendMessage("bot", data.reply);
    } catch {
      appendMessage("bot", "Oj, fel vid kontakt med servern, po 😅");
    }
  });

  // Klick på bilden för slumpfakta
  const facts = [
    "En cóndor kan flyga över 200 km utan att flaxa med vingarna!",
    "Chile har över 6 000 km kustlinje.",
    "På spanska betyder 'bacán' något som är riktigt coolt eller bra.",
    "Andesbergen sträcker sig genom sju länder!",
    "Empanadas är en klassisk chilensk maträtt – fyllda med kött, ägg och oliver."
  ];

  juanImg.addEventListener("click", () => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    appendMessage("bot", "🦅 Sabías que... " + randomFact);
  });
});
