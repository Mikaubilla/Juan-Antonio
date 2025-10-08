const slangList = document.getElementById("slangList");
const newSlang = document.getElementById("newSlang");
const addBtn = document.getElementById("addBtn");

// 🔸 Ladda sparade slanguttryck vid start
window.addEventListener("load", () => {
  const saved = JSON.parse(localStorage.getItem("slangList")) || [];
  saved.forEach((item) => addSlangItem(item));
});

// 🔸 Lägg till nytt slangord
addBtn.addEventListener("click", () => {
  const text = newSlang.value.trim();
  if (text) {
    addSlangItem(text);
    saveSlangList();
    newSlang.value = "";
  }
});

// 🔸 Funktion för att skapa listobjekt
function addSlangItem(text) {
  const li = document.createElement("li");
  li.textContent = text;

  // knapp för att ta bort
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

// 🔸 Spara listan i localStorage
function saveSlangList() {
  const items = Array.from(slangList.children).map((li) =>
    li.firstChild.textContent
  );
  localStorage.setItem("slangList", JSON.stringify(items));
}
