const PASSWORD = "mika"; // ditt lösenord

const panel = document.createElement("div");
panel.className = "teacher-panel";
panel.innerHTML = `
  <div id="login-section">
    <h3>Lärarpanel</h3>
    <input type="password" id="password" placeholder="Lösenord">
    <button id="login-btn">Logga in</button>
  </div>
  <div id="panel-content" style="display:none;">
    <h3>Inställningar</h3>
    <label>Fokusera extra på:</label><br/>
    <textarea id="focus-area" rows="4" cols="40" placeholder="Ex: Perfekt, ordföljd, artighetsfraser..."></textarea><br/>
    <button id="save-btn">Spara</button>
    <p id="saved-msg" style="color:green; display:none;">Sparat!</p>
  </div>
`;
document.body.appendChild(panel);

document.getElementById("login-btn").addEventListener("click", () => {
  const pw = document.getElementById("password").value;
  if (pw === PASSWORD) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("panel-content").style.display = "block";
  } else {
    alert("Fel lösenord, po 😅");
  }
});

document.getElementById("save-btn").addEventListener("click", () => {
  const focus = document.getElementById("focus-area").value;
  localStorage.setItem("teacherFocus", focus);
  document.getElementById("saved-msg").style.display = "block";
  setTimeout(() => (document.getElementById("saved-msg").style.display = "none"), 2000);
});

// Skicka fokusinfo till chatten när sidan laddas
window.addEventListener("load", () => {
  const focus = localStorage.getItem("teacherFocus");
  if (focus) {
    appendMessage("juan", `Mikaela har sagt att jag ska fokusera extra på: ${focus}. Vamos, po! 💪`);
  }
});
