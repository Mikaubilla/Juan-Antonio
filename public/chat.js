document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("user-input");
  const btn = document.getElementById("send-btn");
  alert("✅ chat.js laddades korrekt!");

  btn.addEventListener("click", () => {
    alert("Du skrev: " + input.value);
  });
});
