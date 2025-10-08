const slangList = document.getElementById("slangList");
const newSlang = document.getElementById("newSlang");
const addBtn = document.getElementById("addBtn");
const focusArea = document.getElementById("focusArea");
const saveFocus = document.getElementById("saveFocus");

// 🔸 Ladda sparat innehåll
window.addEventListener("load", () => {
  const savedSlang = JSON.parse(localStorage.getItem("slangList")) || [];
  savedSlang.forEach((item) => addSlangItem(item));
  focusArea.value = localStorage.getItem("focusAreas") || "";
});

// 🔸 Lägg till slang
addBtn.addEventListener("click", () => {
  const text = newSlang.value.trim();
  if (text) {
    addSlangItem(text);
    saveSlangList();
    newSlang.value = "";
  }
});

// 🔸 Lägg till listobjekt
function addSlangItem(text) {
  const li = document.createElement("li");
  li.textContent = text;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "❌";
  removeBtn.classList.add("remove-btn");
  removeBtn.onclick = () => {
    li.remove();
    saveSlangList();
  };

  li.appendChild(removeBtn);
  slangList.appendChild(li);
}

// 🔸 Spara slang i localStorage
function saveSlangList() {
  const items = Array.from(slangList.children).map((li) =>
    li.firstChild.textContent
  );
  localStorage.setItem("slangList", JSON.stringify(items));
}

// 🔸 Spara fokusområde
saveFocus.addEventListener("click", () => {
  const focus = focusArea.value.trim();
  localStorage.setItem("focusAreas", focus);
  alert("Fokusområden uppdaterade, po! 😎");
});
