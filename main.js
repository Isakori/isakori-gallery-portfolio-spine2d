/* ----------------------------------------------------------------------------- 1 */
let animList = document.querySelector(".animation-list");
/* ----------------------------------------------------------------------------- 2 */
const display_type_list = document.querySelector(".displayingbar");
/* ----------------------------------------------------------------------------- 3 */
const filters = document.querySelectorAll(".filter-button");
const filter_all = document.querySelector("#f-all");
const other_filters = [...filters].filter(btn => btn !== filter_all);
/* ----------------------------------------------------------------------------- 4 */
const viewer = document.querySelector("#viewer");
const size_button = document.getElementById("viewer-size-button");
const hide_button = document.getElementById("viewer-hide-button");

/* ------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- 1 */
animList.addEventListener("click", (e) => {
    if (e.target.closest(".anim-button")) {
        const active = animList.querySelector(".anim-button.active");
        if (active) active.classList.remove("active");
        e.target.closest(".anim-button").classList.add("active");
    }
});
/* ----------------------------------------------------------------------------- 2 */
display_type_list.addEventListener("click", (e) => {
    if (e.target.closest(".display_type_buton")) {
        const active = display_type_list.querySelector(".display_type_buton.active");
        if (active) active.classList.remove("active");
        e.target.closest(".display_type_buton").classList.add("active");
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

/* ----------------------------------------------------------------------------- Unwrapping viewport */
function showInViewer(id){
    const flexGrow = window.getComputedStyle(viewer).flexGrow;
    if (parseFloat(flexGrow) === 0) viewer.style.flexGrow = 1;
}
/* ---------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- Loading projects */



/* --------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------- CANVAS */

const holder = document.getElementById("canvas-holder");
const fullSizeVieport = { x: 2832, y: 1836 };
const worldSize = { x: fullSizeVieport.x * 4, y: fullSizeVieport.y * 4 };
const worldCenter = { x: worldSize.x / 2, y: worldSize.y / 2 };

const app = new PIXI.Application({
    resizeTo: holder,
    transparent: true,
    // backgroundColor: 0x3CAFFF
    antialias: true
});
holder.appendChild(app.view);
/* ----------------------------------------------------------------------------------------- */
const viewport = new PIXI.Viewport({
    screenWidth: holder.clientWidth,
    screenHeight: holder.clientHeight,
    worldWidth: worldSize.x,
    worldHeight: worldSize.y,
    threshold: 5,
    interaction: app.renderer.plugins.interaction
});
app.stage.addChild(viewport);
/* ----------------------------------------------------------------------------------------- */
const bgTexture = PIXI.Texture.from("./images/viewport_spine_BG.png");
const tiledBackground = new PIXI.TilingSprite(bgTexture, worldSize.x, worldSize.y);
tiledBackground.tilePosition.set(worldSize.x % 100 / 2, worldSize.y % 100 / 2); // centering against axis0
viewport.addChildAt(tiledBackground, 0);

const axisMarker = new PIXI.Graphics()
    .lineStyle(2, 0x222222)
    .moveTo(worldCenter.x, 0).lineTo(worldCenter.x, worldSize.y)
    .moveTo(0, worldCenter.y).lineTo(worldSize.x, worldCenter.y);
viewport.addChild(axisMarker);

viewport.moveCenter(worldCenter.x, worldCenter.y);

/* ----------------------------------------------------------------------------------------- */
const worldBorder = new PIXI.Graphics();
worldBorder.lineStyle(16, 0xFFFFFF, 1);
worldBorder.drawRect(0, 0, worldSize.x, worldSize.y);
worldBorder.endFill();
viewport.addChild(worldBorder);

// const box = new PIXI.Graphics();
// box.beginFill(0xff5050);
// box.drawRect(-50, -50, 100, 100);
// box.endFill();
// box.x = worldCenter.x;
// box.y = worldCenter.y;
// viewport.addChild(box);
/* ----------------------------------------------------------------------------------------- */

const resizeObserver = new ResizeObserver(() => {
    const { clientWidth, clientHeight } = holder;
    app.renderer.resize(clientWidth, clientHeight);
    viewport.resize(clientWidth, clientHeight, worldSize.x, worldSize.y);
    app.render();
    app.stop();
    resizeTimeout = setTimeout(() => {
        app.start();
    }, 250);
    viewport.moveCenter(worldCenter.x, worldCenter.y - 1000);
});
resizeObserver.observe(holder);

viewport
    .drag(/* { mouseButtons: 'right' } */)
    .wheel({ /* масштабирование колесом */
        smooth: 25,
        percent: 0.1
    })
    .pinch({ /* масштабирование пальцами */
        factor: 1.4,
        percent: 0.2
    })
    .decelerate({ friction: 0.85 })
    .clamp({
        direction: 'all',
        underflow: 'center'
    })
    .clampZoom({
        minScale: 0.1,
        maxScale: 3
    })
;

holder.addEventListener("wheel", e => {
    if (e.target === app.view) {
      e.preventDefault();
    }
}, { passive: false });
app.view.addEventListener('contextmenu', e => e.preventDefault());

/* ------------------------------------------------------------------------------------------- setting up animation */

let loader = PIXI.loader.add('junko', './projects/original/1/Junko.json');

loader.load((loader,res)=>{
    let junko = new PIXI.spine.Spine(res.junko.spineData)
        options = [''];
    // Junko -----------------------------------
    junko.scale.set(1);
    junko.state.setAnimation(0, 'reaction', true);
    junko.x = worldCenter.x;
    junko.y = worldCenter.y;
    junko.drawDebug = false;

    viewport.addChild(junko);
});