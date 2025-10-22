/* ----------------------------------------------------------------------------- 1 */
const skeletonDropdownButton = document.querySelector('.anim-skeleton-drop-button');
const skeletonMenu = document.querySelector(".dropdown-menu");
const animationList = document.querySelector(".animation-list");
/* ----------------------------------------------------------------------------- 2 */
const display_type_list = document.querySelector(".displayingbar");
const gallery_styles = ["perfect-grid", "adaptive-flex", "cardfall"];
/* ----------------------------------------------------------------------------- 3 */
const filters = document.querySelectorAll(".filter-button");
const filter_all = document.querySelector("#f-all");
const other_filters = [...filters].filter(btn => btn !== filter_all);
const filterState = { categories: new Set(["all"]), interactive: false };
const interactiveFilter = document.querySelector("#switcher-interactive");
/* ----------------------------------------------------------------------------- 4 */
const viewer = document.querySelector("#viewer");
const size_button = document.getElementById("viewer-size-button");
const hide_button = document.getElementById("viewer-hide-button");

const gallery_grid = document.getElementById("gallery-grid");
const loader = PIXI.Loader.shared;

/* ------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- 1 */
skeletonDropdownButton.addEventListener('click', (e) => {
    e.stopPropagation();
    skeletonDropdownButton.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!skeletonDropdownButton.contains(e.target)) {
        skeletonDropdownButton.classList.remove('open');
    }
});
/* ----------------------------------------------------------------------------- 2 */
display_type_list.addEventListener("click", (e) => {
    const button = e.target.closest(".display-type-buton");
    if (!button) return;

    // for smooth cards' translate, getting initial positions
    const cards = [...gallery_grid.children];
    const firstRects = new Map(cards.map(el => [el, el.getBoundingClientRect()]));

    const active = display_type_list.querySelector(".display-type-buton.active");
    if (active) active.classList.remove("active");
    button.classList.add("active");

    const displayType = button.id.replace("-button", "");
    gallery_styles.forEach(stl => gallery_grid.classList.remove(stl));
    gallery_grid.classList.add(displayType);

    // moving the cards to their new position after DOM changing
    floatingCards(cards, firstRects);
});

function floatingCards(cards, firstRects) {
    const lastRects = new Map(cards.map(el => [el, el.getBoundingClientRect()]));
    cards.forEach(el => {
        const first = firstRects.get(el);
        const last = lastRects.get(el);
        const dx = first.left - last.left;
        const dy = first.top - last.top;

        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.transition = 'transform 0s';

        requestAnimationFrame(() => {
            el.style.transition = 'transform 0.4s ease';
            el.style.transform = 'translate(0, 0)';
        });
    });
}
/* ----------------------------------------------------------------------------- 3 */
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        const type = btn.dataset.filter;

        if (btn === filter_all) {
            filterState.categories = new Set(["all"]);

            filters.forEach(b => b.classList.remove("active"));
            filter_all.classList.add("active");
        } else {
            filterState.categories.delete("all");
            if (filterState.categories.has(type)) {
                filterState.categories.delete(type);
            } else {
                filterState.categories.add(type);
            }

            btn.classList.toggle("active");
            filter_all.classList.remove("active");

            const activeOthers = other_filters.filter(b => b.classList.contains("active"));
          
            if (activeOthers.length === 0) {
                filterState.categories.add("all");

                filter_all.classList.add("active");
            }
            // Проверка: если выбраны все отдельные фильтры → сбросить на All
            if (activeOthers.length === other_filters.length) {
                filterState.categories = new Set(["all"]);

                other_filters.forEach(b => b.classList.remove("active"));
                filter_all.classList.add("active");
            }
        }

        updateGallery();
    });
});

interactiveFilter.addEventListener("click", () => {
    filterState.interactive = !filterState.interactive;
    interactiveFilter.classList.toggle("active", filterState.interactive);

    updateGallery();
});

function updateGallery() {
    const allCards = document.querySelectorAll(".card-wrapper");

    const cards = [...gallery_grid.children];
    const firstRects = new Map(cards.map(el => [el, el.getBoundingClientRect()]));

    allCards.forEach(card => {
        const tags = card.dataset.tags.split(",");
        let visible = false;

        if (filterState.categories.has("all")) {
            visible = true;
        } else {
            visible = [...filterState.categories].some(c => tags.includes(c));
        }

        if (filterState.interactive && !tags.includes("interactive")) {
            visible = false;
        }

        card.style.display = visible ? "" : "none";
    });

    floatingCards(cards, firstRects);
}

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

        wrapper.dataset.tags = project.tags;

        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("tabindex", "0");
        card.dataset.projectId = project.id;

        const img = document.createElement("img");
        img.src = `${project.path}/${project.projectName}${project.imagePostfix}`;
        img.classList.add("card-img");
        img.draggable = false;

        const label = document.createElement("div");
        label.innerHTML = project.projectName;
        label.classList.add("card-label");

        // Добавляем в DOM
        card.appendChild(img);
        card.appendChild(label);
        wrapper.appendChild(card);
        gallery_grid.appendChild(wrapper);

        // Обработчик клика
        card.addEventListener("click", () => {
            showInViewer(project);
        });

        // Обработчик клавиш (Enter)
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
        noDrag: true,
        factor: 1,
        percent: 0.5,
        // center: {x: viewport.screenWidth / 2, y: viewport.screenHeight / 2}
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

function unwrapViewport(){
    const flexGrow = window.getComputedStyle(viewer).flexGrow;
    if (parseFloat(flexGrow) === 0) {
        viewer.style.flexGrow = 1;
        return true;
    }
    return false;
}

/* ---------------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------------------- */

let currentSpines = [];

function unloadCurrentProject(nextProject = null) {
    currentSpines.forEach(spine => {
        viewport.removeChild(spine);
        spine.destroy({ children: true, texture: false, baseTexture: false });
    });

    currentSpines = [];

    PIXI.utils.clearTextureCache();

    skeletonMenu.innerHTML = "";
    animationList.innerHTML = "";
    skeletonDropdownButton.innerHTML = `${svgDropdownIcon}${nextProject ? nextProject.skeletons[0] : "Skeleton"}`;
}

function showInViewer(project) {
    const loaderElement = document.getElementById("loading-indicator");
    loaderElement.classList.remove("hidden");

    justUnwrapped = unwrapViewport();
    unloadCurrentProject(project);

    const loader = new PIXI.Loader();
    const basePath = project.path;
    currentSpines = [];

    skeletonMenu.innerHTML = "";
    animationList.innerHTML = "";

    project.skeletons.forEach(name => {
        loader.add(name, `${basePath}/${name}.json`);
    });

    loader.load((_, resources) => {
        let loadedSkeletons = [];

        project.skeletons.forEach((name, index) => {
            const resource = resources[name];
            if (!resource || !resource.spineData) return;

            const spine = new PIXI.spine.Spine(resource.spineData);
            spine.name = name;

            spine.scale.set(1);
            spine.x = worldCenter.x;
            spine.y = worldCenter.y;

            viewport.addChild(spine);
            currentSpines.push(spine);

            if (spine.state && spine.spineData.animations.length > 0) {
              spine.state.setAnimation(0, spine.spineData.animations[0].name, true);
            }
            loadedSkeletons.push(spine);

            // === Создание кнопки скелета в меню ===
            const li = document.createElement("li");
            const btn = document.createElement("button");
            btn.className = "dropdown-item";
            btn.innerHTML = `${svgSkeletonIcon}${name}`;
            btn.addEventListener("click", () => selectSkeleton(spine));
            li.appendChild(btn);
            skeletonMenu.appendChild(li);

            // Первый скелет активен по умолчанию
            if (index === 0) selectSkeleton(spine);
        });

        loader.reset();


        const offsetTimer = justUnwrapped ? 250 : 0;
            setTimeout(() => {
                focusOnSpines(viewport, loadedSkeletons, {
                    padding: 0.5,
                    duration: 500
                });
                loaderElement.classList.add("hidden");
            }, offsetTimer);
    });
}

function selectSkeleton(spine) {
    // Обновление активности в меню
    skeletonMenu.querySelectorAll(".dropdown-item").forEach(btn => btn.classList.remove("active"));
    const activeBtn = Array.from(skeletonMenu.children).find(li => li.textContent.trim() === spine.name);
    if (activeBtn) activeBtn.querySelector("button").classList.add("active");

    // Обновление надписи на главной кнопке
    skeletonDropdownButton.innerHTML = `
    ${svgDropdownIcon}
    ${spine.name}`;

    // Очистка старых анимаций
    animationList.innerHTML = "";

    const sortedAnims = [...spine.spineData.animations].map(a => a.name).sort(a => a === "-default" ? -1 : 1);

    sortedAnims.forEach((anim, index) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.className = "anim-button";
        btn.dataset.anim = anim;
        btn.dataset.state = "stopped";

        const playIcon = svgPlay;
        btn.innerHTML = `${playIcon}${anim}`;

        btn.addEventListener("click", () => toggleAnimation(btn, spine));
        li.appendChild(btn);
        animationList.appendChild(li);

        if (index === 0) {
            btn.classList.add("active");
            playAnimation(spine, anim);
            btn.dataset.state = "playing";
            btn.innerHTML = `${svgDefaultStop}${anim}`;
        }
    });
}

// Триггер кнопки анимации
function toggleAnimation(button, skeleton) {
    const currentAnim = button.dataset.anim;
    const isDefault = currentAnim === "-default";

    const allButtons = document.querySelectorAll(".anim-button");
    allButtons.forEach(b => {
        if (b !== button) {
            b.dataset.state = "stopped";
            b.classList.remove("active");
            const anim = b.dataset.anim;
            b.innerHTML = `${(anim === "-default" ? svgDefaultPlay : svgPlay)}${anim}`;
        }
    });

    // Логика переключения состояний
    if (button.dataset.state === "playing") {
        pauseAnimation(skeleton, currentAnim);
        button.dataset.state = "paused";
        button.innerHTML = `${(isDefault ? svgDefaultPlay : svgPlay)}${currentAnim}`;
    } else {
        playAnimation(skeleton, currentAnim);
        button.dataset.state = "playing";
        button.classList.add("active");
        button.innerHTML = `${(isDefault ? svgDefaultStop : svgStop)}${currentAnim}`;
    }
}

// SVG шаблоны
const svgSkeletonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7.157 2.207c.066 2.004 1.454 3.117 4.221 3.55c2.345.368 4.46.181 5.151-1.829C17.874.01 14.681.985 11.915.55S7.051-1.013 7.157 2.207m.831 8.23c.257 1.497 1.652 2.355 3.786 2.297c2.135-.059 3.728-.892 3.949-2.507c.409-2.988-1.946-1.832-4.08-1.774c-2.136.059-4.161-.952-3.655 1.984m2.778 6.852c.424 1.117 1.587 1.589 3.159 1.253c1.569-.335 2.656-.856 2.568-2.129c-.159-2.357-1.713-1.616-3.283-1.279c-1.571.333-3.272-.039-2.444 2.155m1.348 5.221c.123.943.939 1.5 2.215 1.49c1.279-.011 2.248-.515 2.412-1.525c.308-1.871-1.123-1.175-2.4-1.165c-1.28.01-2.47-.65-2.227 1.2"/></svg>`;
const svgDropdownIcon = `<svg class="dropdown-icon" focusable="false" role="img" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>`;
const svgDefaultPlay = `<svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path stroke="currentColor" fill="none" d="M5.008 12.897a.644.644 0 0 1-.91-.227.719.719 0 0 1-.098-.364V3.693C4 3.31 4.296 3 4.662 3a.64.64 0 0 1 .346.103l6.677 4.306a.713.713 0 0 1 0 1.182l-6.677 4.306z"/></svg>`;
const svgDefaultStop = `<svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path stroke="currentColor" fill="none" d="M4.667 3h6.666C12.253 3 13 3.746 13 4.667v6.666c0 .92-.746 1.667-1.667 1.667H4.667C3.747 13 3 12.254 3 11.333V4.667C3 3.747 3.746 3 4.667 3z"/></svg>`;
const svgPlay = `<svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path stroke="currentColor" fill="currentColor" d="M5.008 12.897a.644.644 0 0 1-.91-.227.719.719 0 0 1-.098-.364V3.693C4 3.31 4.296 3 4.662 3a.64.64 0 0 1 .346.103l6.677 4.306a.713.713 0 0 1 0 1.182l-6.677 4.306z"/></svg>`;
const svgStop = `<svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path stroke="currentColor" fill="currentColor" d="M4.667 3h6.666C12.253 3 13 3.746 13 4.667v6.666c0 .92-.746 1.667-1.667 1.667H4.667C3.747 13 3 12.254 3 11.333V4.667C3 3.747 3.746 3 4.667 3z"/></svg>`;

// Вспомогательные функции для Spine
function playAnimation(skeleton, animName) {
    const spineObj = currentSpines.find(s => s.name === skeleton.name);
    if (!spineObj) return;

    const state = spineObj.state;
    const currentTrack = state.getCurrent(0);

    if (currentTrack && currentTrack.animation.name === animName) {
        state.tracks.forEach(track => track.timeScale = 1);
    } else {
        state.setAnimation(0, animName, true);
        // state.timeScale = 1;
    }
}

function pauseAnimation(skeleton, animName) {
    const spineObj = currentSpines.find(s => s.name === skeleton.name);
    if (spineObj) {
        spineObj.state.tracks.forEach(track => track.timeScale = 0);
    }
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

