/* ----------------------------------------------------------------------------- 1 */
let animList = document.querySelector(".animation-list");
/* ----------------------------------------------------------------------------- 2 */
const group_list = document.querySelector(".groupbar");
/* ----------------------------------------------------------------------------- 3 */
const filters = document.querySelectorAll(".filter-button");
const filter_all = document.querySelector("#f-all");
const other_filters = [...filters].filter(btn => btn !== filter_all);
/* ----------------------------------------------------------------------------- 4 */
const viewer = document.querySelector("#viewer");
const size_button = document.getElementById("viewer-size-button");
const hide_button = document.getElementById("viewer-hide-button");

/* ----------------------------------------------------------------------------- 1 */
animList.addEventListener("click", (e) => {
  if (e.target.closest(".anim-button")) {
    const active = animList.querySelector(".anim-button.active");
    if (active) active.classList.remove("active");
    e.target.closest(".anim-button").classList.add("active");
  }
});
/* ----------------------------------------------------------------------------- 2 */
group_list.addEventListener("click", (e) => {
  if (e.target.closest(".group-button")) {
    const active = group_list.querySelector(".group-button.active");
    if (active) active.classList.remove("active");
    e.target.closest(".group-button").classList.add("active");
  }
});
/* ----------------------------------------------------------------------------- 3 */
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn === filter_all) {
      // Нажали "All" → сбрасываем всё и активируем только All
      filters.forEach(b => b.classList.remove("active"));
      filter_all.classList.add("active");
    } else {
      // Нажали на отдельный фильтр
      btn.classList.toggle("active");
      filter_all.classList.remove("active");
      
      const activeOthers = other_filters.filter(b => b.classList.contains("active"));

      if (activeOthers.length === 0) {
        // Все сняты вручную → включаем All
        filter_all.classList.add("active");
      }
      // Проверка: если выбраны все отдельные фильтры → сбросить на All
      if (activeOthers.length === other_filters.length) {
        other_filters.forEach(b => b.classList.remove("active"));
        filter_all.classList.add("active");
      }
    }
  });
});
/* ----------------------------------------------------------------------------- 4 */
size_button.addEventListener("click", () => {
  const expanded = viewer.classList.toggle("expanded");
  viewer.style.flexGrow = expanded ? 8 : 1;

  size_button.querySelector(".icon-expand").classList.toggle("hidden", expanded);
  size_button.querySelector(".icon-collapse").classList.toggle("hidden", !expanded);
});

hide_button.addEventListener("click", () => {
  viewer.style.flexGrow = 0;
  viewer.classList.remove("expanded");
  size_button.querySelector(".icon-expand").classList.remove("hidden");
  size_button.querySelector(".icon-collapse").classList.add("hidden");
});

/* ----------------------------------------------------------------------------- */
document.getElementsByClassName("canvas-holder")[0]
                .getElementsByTagName("img")[0]
                .src = "./test-assets/1.jpg";

function checkSubmitInput(event, id){
    if (event.key == 'Enter')
        showInViewer(id);
}

function showInViewer(id){
    document.getElementById("canvas-holder")
    .getElementsByTagName("img")[0]
    .src = id.getElementsByTagName("img")[0].src;

    const flexGrow = window.getComputedStyle(viewer).flexGrow;

  if (parseFloat(flexGrow) === 0)
      viewer.style.flexGrow = 1;
}