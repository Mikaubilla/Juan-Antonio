const focusArea = document.getElementById("focusArea");
const saveFocus = document.getElementById("saveFocus");
const newSlang = document.getElementById("newSlang");
const addBtn = document.getElementById("addBtn");
const slangList = document.getElementById("slangList");

let slangArray = [];

// Läs in aktuella värden
async function loadData() {
  const res = await fetch("/api/config");
  if (!res.ok) return;
  const data = await res.json();
  focusArea.value = data.focusAreas;
  slangArray = data.slangList || [];
  renderSlang();
}

function renderSlang() {
  slangList.innerHTML = "";
  slangArray.forEach((s, i) => {
    const li = document.createElement("li");
    li.textContent = s;
    const x = document.createElement("button");
    x.textContent = "❌";
    x.onclick = () => {
      slangArray.splice(i, 1);
      renderSlang();
    };
    li.appendChild(x);
    slangList.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  const text = newSlang.value.trim();
  if (text) {
    slangArray.push(text);
    renderSlang();
    newSlang.value = "";
  }
});

saveFocus.addEventListener("click", async () => {
  const body = {
    focusAreas: focusArea.value.trim(),
    slangList: slangArray,
  };
  const res = await fetch("/api/updateConfig", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  alert(res.ok ? "Uppdaterat för alla elever! 🌎" : "Något gick fel 😅");
});

loadData();
