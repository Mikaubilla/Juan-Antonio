// === LÄRARPANEL ===
const teacherPanel = document.getElementById("teacher-panel");
const loginInput = document.getElementById("teacher-password");
const loginButton = document.getElementById("teacher-login");
const panelContent = document.getElementById("panel-content");

const focusInput = document.getElementById("focus-input");
const phraseInput = document.getElementById("phrase-input");
const slangInput = document.getElementById("slang-input");
const saveButton = document.getElementById("save-btn");

let teacherData = {
  focusAreas: "Träna på verb och ordförråd.",
  teacherPhrases: "Mikaela skulle säga 'Cristo bendito!' 😂",
  slangList: ["bacán", "po", "cachai", "al tiro"]
};

// === Logga in-lösenord ===
loginButton.addEventListener("click", () => {
  if (loginInput.value.trim().toLowerCase() === "mika") {
    teacherPanel.style.display = "none";
    panelContent.style.display = "block";
    loadTeacherData();
  } else {
    alert("Fel lösenord, po 😅");
  }
});

// === Ladda sparade inställningar ===
function loadTeacherData() {
  focusInput.value = teacherData.focusAreas;
  phraseInput.value = teacherData.teacherPhrases;
  slangInput.value = teacherData.slangList.join(", ");
}

// === Spara nya inställningar ===
saveButton.addEventListener("click", () => {
  teacherData.focusAreas = focusInput.value.trim();
  teacherData.teacherPhrases = phraseInput.value.trim();
  teacherData.slangList = slangInput.value.split(",").map(s => s.trim());
  alert("Uppdaterat! 👏 Juan Antonio kommer använda dessa nästa gång sidan laddas.");
  localStorage.setItem("juanTeacherData", JSON.stringify(teacherData));
});

// === Ladda data om det finns sparat ===
const saved = localStorage.getItem("juanTeacherData");
if (saved) {
  teacherData = JSON.parse(saved);
}
