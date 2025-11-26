document.addEventListener("DOMContentLoaded", () => {
  const gridBtn = document.getElementById("gridViewBtn");
  const listBtn = document.getElementById("listViewBtn");
  const container = document.getElementById("projectsContainer");

  function setGrid() {
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
    container.classList.remove("projects-list");
    container.classList.add("projects-grid");
  }

  function setList() {
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
    container.classList.remove("projects-grid");
    container.classList.add("projects-list");
  }

  gridBtn.addEventListener("click", setGrid);
  listBtn.addEventListener("click", setList);
});
