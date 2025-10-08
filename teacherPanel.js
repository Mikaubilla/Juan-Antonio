const slangList = document.getElementById("slangList");
const newSlang = document.getElementById("newSlang");
const addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", () => {
  const text = newSlang.value.trim();
  if (text) {
    const li = document.createElement("li");
    li.textContent = text;
    slangList.appendChild(li);
    newSlang.value = "";
  }
});
