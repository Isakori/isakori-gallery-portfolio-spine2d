/* ----------------------------------------------------------------------------- 0 */
const dropButton = document.querySelector('.anim-skeleton-drop-button');
const dropMenu = document.querySelector('.dropdown-menu');
/* ----------------------------------------------------------------------------- 1 */
const animList = document.querySelector(".animation-list");
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

const gallery_grid = document.getElementById("gallery-grid");
const loader = PIXI.Loader.shared;

/* ------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- 0 */
dropButton.addEventListener('click', (e) => {
    e.stopPropagation();
    dropButton.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!dropButton.contains(e.target)) {
        dropButton.classList.remove('open');
    }
});
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

    setTimeout(() => {
        unloadCurrentProject();
    }, 250);
});

/* ---------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- Loading projects */

async function loadProjects() {
    const response = await fetch("./projects/manifest.json");
    const manifest = await response.json();

    const projects = [];

    for (const assetAuthor in manifest) {
        const assetAuthorProjects = manifest[assetAuthor];
        assetAuthorProjects.forEach((proj) => {
            projects.push({
                assetAuthor,
                id: proj.id,
                projectName: proj.projectName,
                imagePostfix: proj.imagePostfix,
                skeletons: proj.skeletons,
                tags: proj.tags,
                path: `./projects/${assetAuthor}/${proj.id}`,
                thumbnail: `./projects/${assetAuthor}/${proj.id}/${proj.projectName}${proj.imagePostfix}`
            });
        });
    }

    return projects;
}

loadProjects().then((projects) => {
    console.log("Всего проектов:", projects.length);
    console.table(projects);

    projects.forEach(project => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("card-wrapper");

        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("tabindex", "0"); // для фокуса через Tab
        card.dataset.projectId = project.id; // удобно хранить id

        const img = document.createElement("img");
        img.src = `${project.path}/${project.projectName}${project.imagePostfix}`;
        img.classList.add("card-img");
        img.draggable = false;

        // Добавляем в DOM
        card.appendChild(img);
        wrapper.appendChild(card);
        gallery_grid.appendChild(wrapper);

        // 🔹 Обработчик клика
        card.addEventListener("click", () => {
            showInViewer(project);
        });

        // 🔹 Обработчик клавиш (Enter)
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                showInViewer(project);
            }
        });
    });
});

/* --------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------- CANVAS */

const holder = document.getElementById("canvas-holder");
const fullSizeVieport = { x: 2832, y: 1836 };
const worldSize = { x: fullSizeVieport.x * 8, y: fullSizeVieport.y * 8 };
const worldCenter = { x: worldSize.x / 2, y: worldSize.y / 2 };

const app = new PIXI.Application({
    resizeTo: holder,
    transparent: true,
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
viewport
    .drag(/* { mouseButtons: 'right' } */)
    .wheel({ /* масштабирование колесом */
        smooth: 50,
        percent: 0.05
    })
    .pinch({ /* масштабирование пальцами */
        factor: 1.4,
        percent: 1
    })
    .decelerate({ friction: 0.85 })
    .clamp({
        direction: 'all',
        underflow: 'center'
    })
    .clampZoom({
        minScale: 0.15,
        maxScale: 4
    })
;

holder.addEventListener("wheel", e => {
    if (e.target === app.view) {
      e.preventDefault();
    }
}, { passive: false });
app.view.addEventListener('contextmenu', e => e.preventDefault());

/* ----------------------------------------------------------------------------------------- */
const bgTexture = PIXI.Texture.from("./images/viewport_spine_BG.png");
const tiledBackground = new PIXI.TilingSprite(bgTexture, worldSize.x, worldSize.y);
tiledBackground.tilePosition.set(worldSize.x % 100 / 2, worldSize.y % 100 / 2); // centering against axis0
viewport.addChildAt(tiledBackground, 0);

const axisMarker = new PIXI.Graphics()
    .lineStyle(2, 0x111111)
    .moveTo(worldCenter.x, 0).lineTo(worldCenter.x, worldSize.y)
    .moveTo(0, worldCenter.y).lineTo(worldSize.x, worldCenter.y);
viewport.addChild(axisMarker);

viewport.moveCenter(worldCenter.x, worldCenter.y);

/* ----------------------------------------------------------------------------------------- */
/* const worldBorder = new PIXI.Graphics();
worldBorder.lineStyle(16, 0xFFFFFF, 1);
worldBorder.drawRect(0, 0, worldSize.x, worldSize.y);
worldBorder.endFill();
viewport.addChild(worldBorder); */
/* ------------------------------------------------------------------------------------------- responsive viewport */

const resizeObserver = new ResizeObserver(() => {
    const { clientWidth, clientHeight } = holder;
    const viewportCenter = viewport.toWorld(
        viewport.screenWidth / 2,
        viewport.screenHeight / 2
    );

    app.renderer.resize(clientWidth, clientHeight);
    viewport.resize(clientWidth, clientHeight, worldSize.x, worldSize.y);
    app.render();
    app.stop();
    resizeTimeout = setTimeout(() => {
        app.start();
    }, 250);

    viewport.moveCenter(viewportCenter.x, viewportCenter.y);
});
resizeObserver.observe(holder);

/* ---------------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------------------- */

function unwrapViewport(){
    const flexGrow = window.getComputedStyle(viewer).flexGrow;
    if (parseFloat(flexGrow) === 0) {
        viewer.style.flexGrow = 1;
        return true;
    }
    return false;
}

let currentProject = null;
let currentSpines = [];

function unloadCurrentProject() {
    currentSpines.forEach(spine => {
        viewport.removeChild(spine);
        spine.destroy({ children: true, texture: false, baseTexture: false });
    });

    currentSpines = [];
    currentProject = null;

    PIXI.utils.clearTextureCache();
}

function showInViewer(project) {
    justUnwrapped = unwrapViewport();

    // Удаляем старый проект, если он есть
    unloadCurrentProject();

    currentProject = project;
    console.log(`Загрузка проекта "${project.projectName}"...`);

    const loader = new PIXI.Loader();
    const basePath = project.path;

    project.skeletons.forEach(name => {
        loader.add(name, `${basePath}/${name}.json`);
    });

    loader.load((_, resources) => {
        const name = project.skeletons[0];
        const base = `${project.path}/${name}.json`;

        let loadedSkeletons = [];

        project.skeletons.forEach((name, index) => {
            const resource = resources[name];
            if (!resource || !resource.spineData) return;

            const spine = new PIXI.spine.Spine(resource.spineData);

            // позиционирование каждого скелета
            spine.scale.set(1);
            spine.x = worldCenter.x;
            spine.y = worldCenter.y;

            viewport.addChild(spine);
            currentSpines.push(spine);

            // выводим список анимаций в консоль
            console.log(`${name} animations:`, spine.spineData.animations.map(a => a.name));

            // можно сразу запустить первую анимацию (пример)
            if (spine.state && spine.spineData.animations.length > 0) {
              spine.state.setAnimation(0, spine.spineData.animations[0].name, true);
            }

            const bounds = getWorldBounds(spine);
            console.log(bounds.x, bounds.y, bounds.width, bounds.height);
            
            /* viewport.moveCenter(
                bounds.x + bounds.width / 2,
                bounds.y + bounds.height / 2
            ); */
            loadedSkeletons.push(spine);
        });

        console.log(`Проект "${project.projectName}" успешно загружен.`);
        loader.reset();

        const offsetTimer = justUnwrapped ? 250 : 0;
            setTimeout(() => {
                focusOnSpines(viewport, loadedSkeletons, {
                    padding: 0.5,   // на сколько отступить от краёв
                    duration: 500  // скорость анимации в мс
                });
            }, offsetTimer);
    });
}

/* ---------------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------------------- */

function getWorldBounds(spine) {
    spine.updateTransform();

    const local = spine.getLocalBounds(); // локальные границы (учитывают scale самого spine)
    const corners = [
        new PIXI.Point(local.x, local.y),
        new PIXI.Point(local.x + local.width, local.y),
        new PIXI.Point(local.x, local.y + local.height),
        new PIXI.Point(local.x + local.width, local.y + local.height)
    ];

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (const p of corners) {
        // 1) локальная точка -> глобальные (на экран, в пикселях)
        const global = spine.toGlobal(p);

        // 2) глобальные (screen) -> координаты мира viewport
        const worldPoint = viewport.toWorld(global.x, global.y);

        minX = Math.min(minX, worldPoint.x);
        minY = Math.min(minY, worldPoint.y);
        maxX = Math.max(maxX, worldPoint.x);
        maxY = Math.max(maxY, worldPoint.y);
    }

    return new PIXI.Rectangle(minX, minY, maxX - minX, maxY - minY);
}

function focusOnSpines(viewport, spinesArray, opts = {}) {
    const { padding = 0.18, duration = 700 } = opts;
    if (!spinesArray || spinesArray.length === 0) return;

    // Собираем общий bounds (в координатах мира viewport)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const s of spinesArray) {
        const b = getWorldBounds(s, viewport, app);
        minX = Math.min(minX, b.x);
        minY = Math.min(minY, b.y);
        maxX = Math.max(maxX, b.x + b.width);
        maxY = Math.max(maxY, b.y + b.height);
    }
    const bounds = new PIXI.Rectangle(minX, minY, maxX - minX, maxY - minY);

    // если bounds пустой — безопасно выйти
    if (!(bounds.width > 0 && bounds.height > 0)) return;

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    // вычисляем целевой масштаб, учитывая padding
    const targetWorldW = bounds.width * (1 + padding);
    const targetWorldH = bounds.height * (1 + padding);
    const scaleX = viewport.screenWidth / targetWorldW;
    const scaleY = viewport.screenHeight / targetWorldH;
    const targetScale = Math.min(scaleX, scaleY);

    // запоминаем стартовые параметры
    const startScale = viewport.scale.x;
    const startCenter = viewport.center.clone ? viewport.center.clone() : { x: viewport.center.x, y: viewport.center.y };
    const startTime = performance.now();

    // easing (easeInOutQuad)
    function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

    function animate() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(1, elapsed / duration);
        const e = ease(t);
        
        const curScale = startScale + (targetScale - startScale) * e;
        const curX = startCenter.x + (centerX - startCenter.x) * e;
        const curY = startCenter.y + (centerY - startCenter.y) * e;
        
        // применяем плавно
        viewport.setZoom(curScale, true);
        viewport.moveCenter(curX, curY);
        
        if (t < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}
