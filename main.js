/* ----------------------------------------------------------------------------- 1 */
const skeletonDropdownButton = document.querySelector('.anim-skeleton-drop-button');
const skeletonMenu = document.querySelector(".dropdown-menu");
const animationList = document.querySelector(".animation-list");
const metricsPanel = document.querySelector(".metrics-panel");
const metricsButton = document.querySelector(".metrics-button");
const metricsList = document.querySelector(".metrics-list");
const interactionSwitcher = document.querySelector(".viewport-interaction-switch");
/* ----------------------------------------------------------------------------- 2 */
const display_type_list = document.querySelector(".displayingbar");
const display_type_list1 = document.querySelector(".displayingbar.side");
const gallery_styles = ["perfect-grid", "adaptive-flex", "cardfall"];
let currentDisplayType = localStorage.getItem("displayType") || gallery_styles[0];
/* ----------------------------------------------------------------------------- 3 */
const filters = document.querySelectorAll(".filter-button");
const filters1 = document.querySelectorAll(".filter-button1");
const filter_all = document.querySelector("#f-all");
const filter_all1 = document.querySelector("#f-all1");
const other_filters = [...filters].filter(btn => btn !== filter_all);
const filterState = { categories: new Set(["all"]), interactive: false };
const interactiveFilter = document.querySelector(".switcher-interactive");
const interactiveFilter1 = document.querySelector(".switcher-interactive.side");
/* ----------------------------------------------------------------------------- 4 */
const guide_button = document.querySelector(".guide-button");
const guide_panel = document.querySelector(".guide-panel");
const info_button = document.querySelector(".info-button");
const info_panel = document.querySelector(".info-panel");
const guide_button1 = document.querySelector(".guide-button.side");
const guide_panel1 = document.querySelector(".guide-panel.side");
const info_button1 = document.querySelector(".info-button.side");
const info_panel1 = document.querySelector(".info-panel.side");
/* ----------------------------------------------------------------------------- 5 */
const sidebar_button = document.querySelector('.burger-button');
const sidebar_close_button = document.querySelector('.sidebar-close-button');
const sidebar = document.querySelector('.sidebar');
/* ----------------------------------------------------------------------------- 6 */
const viewer = document.querySelector("#viewer");
const size_button = document.getElementById("viewer-size-button");
const hide_button = document.getElementById("viewer-hide-button");
const viewer_states = ["closed", "minimized", "maximized"];
let currentViewerState = viewer_states[0];

const buttons = document.querySelectorAll('.bg-palette-button');
const spinePalBtn = document.getElementById('spine-bg');
const pickerPalBtn = document.getElementById('picker-bg');
const transparentPalBtn = document.getElementById('transparent-bg');
const colorPicker = document.querySelector('.picker-btn');

const debugList = document.getElementById("debug-list");

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
metricsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    metricsButton.classList.toggle('icon-rotate');
    metricsList.classList.toggle('open');
    metricsPanel.classList.toggle('open');
});
interactionSwitcher.addEventListener('click', (e) => {
    interactionSwitcher.classList.toggle("active");
    switchInteractionMode(interactionSwitcher.classList.contains("active"));
    hintContainer.visible = false;
});
interactionSwitcher.addEventListener('pointerdown', () => {
    hintContainer.visible = true;
});
interactionSwitcher.addEventListener('pointerup', () => {
    hintContainer.visible = false;
});
interactionSwitcher.addEventListener('pointerupoutside', () => {
    hintContainer.visible = false;
});
interactionSwitcher.addEventListener('mouseover', () => {
    hintContainer.visible = true;
});
interactionSwitcher.addEventListener('mouseleave', () => {
    hintContainer.visible = false;
});
interactionSwitcher.addEventListener('contextmenu', e => e.preventDefault());

/* ----------------------------------------------------------------------------- 2 */
display_type_list.addEventListener("click", (e) => {
    const button = e.target.closest(".display-type-button");
    if (!button) return;

    const cards = [...gallery_grid.children];
    const firstRects = new Map(cards.map(el => [el, el.getBoundingClientRect()]));

    const active = display_type_list.querySelector(".display-type-button.active");
    if (active) { 
        active.classList.remove("active");
        display_type_list1.querySelector(`${active.dataset.twin}`).classList.remove("active");
    }
    button.classList.add("active");
    display_type_list1.querySelector(`${button.dataset.twin}`).classList.add("active");

    const displayType = button.id.replace("-button", "");
    currentDisplayType = displayType;
    localStorage.setItem("displayType", currentDisplayType);

    gallery_styles.forEach(stl => gallery_grid.classList.remove(stl));
    gallery_grid.classList.add(displayType);

    floatingCards(cards, firstRects);
});
display_type_list1.addEventListener("click", (e) => {
    const button = e.target.closest(".display-type-button");
    if (!button) return;
    
    const cards = [...gallery_grid.children];
    const firstRects = new Map(cards.map(el => [el, el.getBoundingClientRect()]));

    const active = display_type_list1.querySelector(".display-type-button.active");
    if (active) { 
        active.classList.remove("active");
        display_type_list.querySelector(`${active.dataset.twin}`).classList.remove("active");
    }
    button.classList.add("active");
    display_type_list.querySelector(`${button.dataset.twin}`).classList.add("active");

    const displayType = button.id.replace("-button1", "");
    currentDisplayType = displayType;
    localStorage.setItem("displayType", currentDisplayType);

    gallery_styles.forEach(stl => gallery_grid.classList.remove(stl));
    gallery_grid.classList.add(displayType);

    floatingCards(cards, firstRects);
});

function applyDisplayType(displayType) {
    const active = display_type_list.querySelector(".display-type-button.active");
    if (active) active.classList.remove("active");
    const button = document.querySelector(`#${displayType}-button`);
    button.classList.add("active");
    document.querySelector(`${button.dataset.twin}`).classList.add("active");

    gallery_styles.forEach(stl => gallery_grid.classList.remove(stl));
    gallery_grid.classList.add(displayType);
}
applyDisplayType(currentDisplayType);

function floatingCards(cards, firstRects) {
    const lastRects = new Map(cards.map(el => [el, el.getBoundingClientRect()]));
    cards.forEach(el => {
        const first = firstRects.get(el);
        const last = lastRects.get(el);
        const dx = first.left - last.left;
        const dy = first.top - last.top;

        const mover = el.querySelector('.card');
        // оптимизация галереи
        // - перемещение содержимого элемента сетки, а не самого элемента

        mover.style.transition = 'none';
        mover.style.transform = `translate(${dx}px, ${dy}px)`;

        mover.getBoundingClientRect(); 

        requestAnimationFrame(() => {
            mover.style.transition = 'transform 0.4s ease';
            mover.style.transform = 'translate(0, 0)';
        });
    });
}

/* ----------------------------------------------------------------------------- 3 */
filters1.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(`${btn.dataset.twin}`).click();
    });
});

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        const type = btn.dataset.filter;

        if (btn === filter_all) {
            filterState.categories = new Set(["all"]);

            filters.forEach(b => {
                b.classList.remove("active");
                document.querySelector(`${b.dataset.twin}`).classList.remove("active");
            });
            filter_all.classList.add("active");
            filter_all1.classList.add("active");
        } else {
            filterState.categories.delete("all");
            if (filterState.categories.has(type)) {
                filterState.categories.delete(type);
            } else {
                filterState.categories.add(type);
            }

            btn.classList.toggle("active");
            document.querySelector(`${btn.dataset.twin}`).classList.toggle("active");
            filter_all.classList.remove("active");
            filter_all1.classList.remove("active");

            const activeOthers = other_filters.filter(b => b.classList.contains("active"));
          
            if (activeOthers.length === 0) {
                filterState.categories.add("all");

                filter_all.classList.add("active");
                filter_all1.classList.add("active");
            }
            // Проверка: если выбраны все отдельные фильтры → сбросить на All
            if (activeOthers.length === other_filters.length) {
                filterState.categories = new Set(["all"]);

                other_filters.forEach(b => {
                    b.classList.remove("active");
                    document.querySelector(`${b.dataset.twin}`).classList.remove("active");
                });
                filter_all.classList.add("active");
                filter_all1.classList.add("active");
            }
        }

        updateGallery();
    });
});

interactiveFilter.addEventListener("click", () => {
    filterState.interactive = !filterState.interactive;
    interactiveFilter.classList.toggle("active", filterState.interactive);
    interactiveFilter1.classList.toggle("active", filterState.interactive);

    updateGallery();
});
interactiveFilter1.addEventListener("click", () => {
    interactiveFilter.click();
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

        card.style.display = visible ? "flex" : "none";
    });

    floatingCards(cards, firstRects);
}

/* ----------------------------------------------------------------------------- 4 */
guide_button.addEventListener("click", e => {
    e.stopPropagation();
    guide_button.classList.toggle("active");
    guide_panel.classList.toggle("visible");
});
info_button.addEventListener("click", e => {
    e.stopPropagation();
    info_button.classList.toggle("active");
    info_panel.classList.toggle("visible");
});
document.addEventListener("click", e => {
    if (!info_button.contains(e.target) && !info_panel.contains(e.target)) {
        info_button.classList.remove("active");
        info_panel.classList.remove("visible");
    }
    if (!guide_button.contains(e.target) && !guide_panel.contains(e.target)) {
        guide_button.classList.remove("active");
        guide_panel.classList.remove("visible");
    }
});
guide_button1.addEventListener('click', e => {
    e.stopPropagation();
    guide_button1.classList.toggle("active");
    guide_panel1.classList.toggle("visible");
});
info_button1.addEventListener('click', e => {
    e.stopPropagation();
    info_button1.classList.toggle("active");
    info_panel1.classList.toggle("visible");
});

/* ----------------------------------------------------------------------------- 5 */
sidebar_button.addEventListener('click', () => { sidebar.classList.add("open"); });
sidebar_close_button.addEventListener('click', () => { sidebar.classList.remove("open"); });

/* ----------------------------------------------------------------------------- 6 */
size_button.addEventListener("click", () => {
    const expanded = (currentViewerState === viewer_states[1]);
    setViewerSize(expanded ? viewer_states[2] : viewer_states[1]);

    size_button.querySelector(".icon-expand").classList.toggle("hidden", expanded);
    size_button.querySelector(".icon-collapse").classList.toggle("hidden", !expanded);
});
hide_button.addEventListener("click", () => {
    setViewerSize(viewer_states[0]);

    size_button.querySelector(".icon-expand").classList.remove("hidden");
    size_button.querySelector(".icon-collapse").classList.add("hidden");

    setTimeout(() => {
        unloadCurrentProject();
    }, 250);
});

spinePalBtn.addEventListener('click', () => {
    setBackground(spinePalBtn, 'texture');
});
pickerPalBtn.addEventListener('click', () => {
    setBackground(pickerPalBtn, 'color', colorPicker.value);
});
colorPicker.addEventListener('input', (e) => {
    const currentColor = e.target.value;
    setBackground(pickerPalBtn, 'color', currentColor);
});
transparentPalBtn.addEventListener('click', () => {
    setBackground(transparentPalBtn, 'transparent');
});

function getLightnessFromHex(hex) {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const brightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return +(brightness * 100).toFixed(2);
}

debugList.addEventListener('click', (e) => {
    const debugBtn = e.target.closest(".debug-item");
    if (!debugBtn) return;

    debugBtn.classList.toggle('active');
    const isActive = debugBtn.classList.contains('active');
    const checkON = debugBtn.querySelector('.check-on');
    const checkOFF = debugBtn.querySelector('.check-off');

    if (isActive) {
        checkON.classList.add('visible');
        checkOFF.classList.remove('visible');
    } else {
        checkOFF.classList.add('visible');
        checkON.classList.remove('visible');
    }

    const index = parseInt(debugBtn.id.replace('sk_', '')) - 1;
    const option = debugOptions[index];

    currentSpines.forEach(spine => {
        if (Array.isArray(option)) {
            option.forEach(opt => spine[opt] = isActive);
        } else {
            spine[option] = isActive;
        }
    }); 
});

function clearDebug() {
    debugList.querySelectorAll('.debug-item').forEach(element => {
        element.classList.remove('active');
        element.querySelector('.check-on').classList.remove('visible');
        element.querySelector('.check-off').classList.add('visible');
    });
}

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
                metrics: proj.metrics,
                boundsDimensions: proj.bounds,
                path: `./projects/${assetAuthor}/${proj.id}`,
                thumbnail: `./projects/${assetAuthor}/${proj.id}/${proj.projectName}${proj.imagePostfix}`
            });
        });
    }

    return projects;
}

loadProjects().then((projects) => {
    // console.log("Всего проектов:", projects.length);
    // console.table(projects);

    projects.forEach(project => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("card-wrapper");

        wrapper.dataset.tags = project.tags;
        wrapper.dataset.assetAuthor = project.assetAuthor;

        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("tabindex", "0");
        card.dataset.projectId = project.id;

        const img = document.createElement("img");
        img.src = `${project.path}/${project.projectName}${project.imagePostfix}`;
        img.classList.add("card-img");
        img.draggable = false;
        img.loading = "lazy";

        const label = document.createElement("div");
        label.innerHTML = project.projectName;
        label.classList.add("card-label");

        // Добавление в DOM
        card.appendChild(img);
        card.appendChild(label);
        wrapper.appendChild(card);
        gallery_grid.appendChild(wrapper);

        if (project.tags.includes("interactive")) {
            const int_icon = document.createElement("div");
            int_icon.classList.add("card-int-icon");
            int_icon.innerHTML = '<svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><path fill="#00d9fa" d="M52,75A17.63,17.63,0,0,1,68.24,50.64h0A17.44,17.44,0,0,1,75,52l28,11.54c0-.34,0-.68,0-1A40.5,40.5,0,1,0,62.5,103c.35,0,.69,0,1,0Z"/><path fill="currentColor" d="M68.35,114.67a53.75,53.75,0,0,1-5.85.33A52.5,52.5,0,1,1,115,62.5a53.75,53.75,0,0,1-.33,5.85l9.56,4a63.32,63.32,0,0,0,.77-9.8A62.5,62.5,0,1,0,62.5,125a63.32,63.32,0,0,0,9.8-.77Z"/><path fill="currentColor" d="M122.26,125.24,109,156.57a5.62,5.62,0,0,1-10.37,0L63.08,70.42a5.62,5.62,0,0,1,7.34-7.34l86.1,35.52a5.62,5.62,0,0,1,0,10.37l-31.33,13.29A5.57,5.57,0,0,0,122.26,125.24Z"/></svg>';
            card.appendChild(int_icon);
        }

        // Обработчик клика
        card.addEventListener("click", () => {
            if (isLoading) return;
            showInViewer(project);
        });

        // Обработчик клавиш (Enter)
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (isLoading) return;
                showInViewer(project);
            }
        });
    });
});

/* --------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------- CANVAS */

const holder = document.getElementById("canvas-holder");
const fullSizeViewport = { x: 2832, y: 1836 };
const worldSize = { x: fullSizeViewport.x * 8, y: fullSizeViewport.y * 8 };
const worldCenter = { x: worldSize.x / 2, y: worldSize.y / 2 };

const app = new PIXI.Application({
    resizeTo: holder,
    transparent: true,
    antialias: true,
    resolution: window.devicePixelRatio || 1
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
app.ticker.maxFPS = 80;
/* ------------------------------------------------- hint container over viewport */
const hintContainer = new PIXI.Container();
hintContainer.visible = false;
const handStroke = PIXI.Sprite.from('./icon/interactStroke.svg');
const handTouch = PIXI.Sprite.from('./icon/interactClick.svg');
/* ------------------------------------------------- particle container over Viewport */
const particleLayer = new PIXI.Container();
app.stage.addChild(particleLayer);
/* ----------------------------------------------------------------------------------------- */
viewport
    .drag({ mouseButtons: ['right', 'left'],
        ignoreKeyToPressOnTouch: false
     })
    .wheel({
        smooth: 50,
        percent: 0.05
    })
    .decelerate({ friction: 0.85 })
    .clamp({
        direction: 'all',
        underflow: 'center'
    })
    .clampZoom({
        minScale: adjustToScale(0.15),
        maxScale: adjustToScale(4)
});
viewport.plugins.remove('pinch');

holder.addEventListener("wheel", e => {
    if (e.target === app.view) {
      e.preventDefault();
    }
}, { passive: false });
app.view.addEventListener('contextmenu', e => e.preventDefault());

/* ----------------------------------------------------------------------------------------- */
const bgTexture = PIXI.Texture.from("./images/viewport_spine_BG.png");
const tiledBackground = new PIXI.TilingSprite(bgTexture, worldSize.x, worldSize.y);
bgTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
tiledBackground.tilePosition.set(worldSize.x % 100 / 2, worldSize.y % 100 / 2); // centering against axis0
const axisMarker = new PIXI.Graphics()
    .lineStyle(2, 0x111111)
    .moveTo(worldCenter.x, 0).lineTo(worldCenter.x, worldSize.y)
    .moveTo(0, worldCenter.y).lineTo(worldSize.x, worldCenter.y);

setBackground(spinePalBtn, "texture");

function setBackground(targetBtn, type, color = null) {
    buttons.forEach(btn => btn.classList.remove('active'));
    targetBtn.classList.add('active');

    const oldBg = viewport.children.find(child => child.__isBackground);
    const oldSecondaryBg = viewport.children.find(child => child.__isSecondaryBackground);
    if (oldBg) viewport.removeChild(oldBg);
    if (oldSecondaryBg) viewport.removeChild(oldSecondaryBg);

    let newBg = null;
    let newSecondaryBg = null;
    
    switch (type) {
        case "texture": {
            newBg = tiledBackground;
            newSecondaryBg = axisMarker;
            break;
        }
        case "color": {
            newBg = new PIXI.Graphics();
            newBg.beginFill(PIXI.utils.string2hex(color || '#ffffff'));
            newBg.drawRect(0, 0, worldSize.x, worldSize.y);
            newBg.endFill();
            pickerPalBtn.setAttribute('style', `color: ${getLightnessFromHex(color) > 60 ? "black" : "white"}`);
            break;
        }
        case "transparent":
            break;
        default:
            break;
    }

    if (newBg) {
        newBg.__isBackground = true;
        viewport.addChildAt(newBg, 0);
    }
    if (newSecondaryBg) {
        newSecondaryBg.__isSecondaryBackground = true;
        viewport.addChildAt(newSecondaryBg, 1);
    }
}

viewport.moveCenter(worldCenter.x, worldCenter.y);

/* ------------------------------------------------------------------------------------------- responsive viewport */

function updateResolution() {
    const ratio = window.devicePixelRatio || 1;
    app.renderer.resolution = ratio;

    const interaction = app.renderer.plugins.interaction;
    interaction.resolution = ratio;

    viewport
    .clampZoom({
        minScale: adjustToScale(0.15),
        maxScale: adjustToScale(4)
    });
}

function adjustToScale(value) {
    return value / app.renderer.resolution;
}

let resizeTimeout;

const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimeout);

    app.stop();

    const { clientWidth, clientHeight } = holder;
    const viewportCenter = viewport.toWorld(viewport.screenWidth / 2, viewport.screenHeight / 2);
    
    updateResolution();
    app.renderer.resize(clientWidth, clientHeight);
    viewport.resize(clientWidth, clientHeight, worldSize.x, worldSize.y);
    viewport.moveCenter(viewportCenter.x, viewportCenter.y);
    
    app.render();
    app.start();
});
resizeObserver.observe(holder);

function unwrapViewport(){
    if (currentViewerState === viewer_states[0]) {
        setViewerSize(viewer_states[1]);
        return true;
    }
    return false;
}

function setViewerSize(state) {
    viewer.classList.remove(currentViewerState);
    viewer.classList.add(state);

    currentViewerState = state;

    const isViewerOpen = (currentViewerState === viewer_states[0]) ? false : true;
    if (isViewerOpen) document.querySelector("header").classList.add("hide");
    else document.querySelector("header").classList.remove("hide");
}


/* ---------------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------------------- */

let currentSpines = [];
let interactiveBounds = [];
let activeTickers = [];
let isLoading = false;
let isInteractiveMode = false;
let isPonterDown = false;
let isAnimationPlaying = false;

const debugOptions = ['drawBones','drawRegionAttachments','drawClipping',['drawMeshHull', 'drawMeshTriangles'],'drawPaths','drawBoundingBoxes'];

function unloadCurrentProject(nextProject = null) {
    clearTickers();
    app.stage.removeAllListeners();
    app.stage.interactive = false;
    currentSpines.forEach(spine => {
        viewport.removeChild(spine);
        spine.destroy({ children: true, texture: false, baseTexture: false });
    });

    currentSpines = [];
    interactiveBounds = [];
    isAnimationPlaying = false;

    resetInteractionMode();
    clearDebug();
    createHintLayer(false);

    PIXI.utils.clearTextureCache();

    skeletonMenu.innerHTML = "";
    animationList.innerHTML = "";
    metricsList.innerHTML = "";
    skeletonDropdownButton.innerHTML = `${svgDropdownIcon}${nextProject ? nextProject.skeletons[0] : "Skeleton"}`;
}

function addTicker(fn) {
    if (!activeTickers.includes(fn)) {
        app.ticker.add(fn);
        activeTickers.push(fn);
    }
}
function clearTickers() {
    for (const fn of activeTickers) {
        app.ticker.remove(fn);
    }
    activeTickers.length = 0;
}

function showInViewer(project) {
    const loaderElement = document.getElementById("loading-indicator");
    loaderElement.classList.remove("hidden");
    isLoading = true;

    const justUnwrapped = unwrapViewport();
    unloadCurrentProject(project);

    const loader = new PIXI.Loader();
    const basePath = project.path;
    currentSpines = [];
    interactiveBounds = [];

    skeletonMenu.innerHTML = "";
    animationList.innerHTML = "";
    metricsList.innerHTML = "";

    const isInteractive = project.tags.includes("interactive");
    if (!isInteractive) interactionSwitcher.classList.add("unavaliable");

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

            spine.drawDebug = true;

            /* ------------------------------------------------------------------------------- */
            if (isInteractive) {
                for (let slot of spine.skeleton.slots) {
                    const attachment = slot.getAttachment();
                    
                    if (attachment && attachment.constructor && attachment.constructor.name === 'BoundingBoxAttachment') {
                        // console.log('Bounding box найден:', attachment.name, 'в слоте', slot.data.name);
                    
                        let type = null;
                        let linkedBone = null;
                        if (attachment.name.startsWith('drag_')) {
                            type = 'drag';
                            const targetBoneName = 'int_' + attachment.name.substring(5);
                            linkedBone = spine.skeleton.findBone(targetBoneName);
                            /* if (linkedBone) {
                                console.log(`Для области ${attachment.name} найдена связанная кость: ${linkedBone.data.name}`);
                            } else {
                                console.warn(`Для области ${attachment.name} не найдена кость ${targetBoneName}`);
                            } */
                        }
                        else if (attachment.name.startsWith('touch_')) {
                            type = 'touch';

                        }
                    
                        const boundSize = project.boundsDimensions[attachment.name];

                        interactiveBounds.push({
                            name: attachment.name,
                            type: type,
                            slot: slot,
                            attachment: attachment,
                            spine: spine,
                            bone: linkedBone,
                            w: boundSize.w || 50,
                            h: boundSize.h || 50
                        });
                    }
                }

                /* if (interactiveBounds.length === 0) {
                    console.log('В проекте не найдено Bounding Box областей.');
                } else {
                    console.log('Список найденных областей:', interactiveBounds);
                } */
            /* ------------------------------------------------------------------------------- */
                app.stage.interactive = true;
                app.stage.removeAllListeners();

                let dragData = null;
                const MOVE_SPEED = 0.3;
                const RETURN_SPEED = 0.1;

                app.stage.on('pointerdown', onClick);
                app.stage.on('pointerup', onPointerUp);
                app.stage.on('pointerupoutside', onPointerUp);
                app.stage.on('pointermove', onPointerMove);

                addTicker(updateBones);

                function updateBones() {
                    if (!dragData) return;

                    const { bone, targetX, targetY } = dragData;
                    bone.x += (targetX - bone.x) * MOVE_SPEED;
                    bone.y += (targetY - bone.y) * MOVE_SPEED;
                }

                function onClick(event) {
                    if (!isInteractiveMode) return;
                    if (event.data.button !== 0) return;
                    const clickPos = event.data.global;
                    isPonterDown = true;
                    playClickVFX(clickPos.x, clickPos.y);
                    if (isAnimationPlaying) return;
                    const mouse = event.data.getLocalPosition(spine);

                    // Проходим по слотам
                    for (const bound of interactiveBounds) {
                        const { attachment, slot, bone, type, spine, name } = bound;
                        const worldVertices = [];
                        attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, worldVertices, 0, 2);
                    
                        // Проверяем попадание курсора
                        if (pointInPolygon(worldVertices, mouse.x, mouse.y)) {
                            if (type === "drag" && bone) {                               
                                const parent1 = bone.parent;
                                const parent2 = parent1 ? parent1.parent : null;
                                if (!parent1 || !parent2) {
                                    // console.warn('Недостаточный уровень родителей для ограничения.');
                                    continue;
                                }

                                const boneWorldPos = new PIXI.Point();
                                boneWorldPos.x = bone.worldX;
                                boneWorldPos.y = bone.worldY;
                                const boneLocalPos = parent2.worldToLocal(boneWorldPos);                
                                
                                const localMouse = clampInRect(parent2.worldToLocal(new PIXI.Point(mouse.x, mouse.y)), boneLocalPos, bound.w, bound.h);

                                dragData = {
                                    bound,
                                    bone,
                                    parent1,
                                    parent2,
                                    startLocalX: bone.x,
                                    startLocalY: bone.y,
                                    startMouse: mouse,
                                    boundsCenter: boneLocalPos,
                                    boundsWidth: bound.w,
                                    boundsHeight: bound.h,
                                    targetX: localMouse.x,
                                    targetY: localMouse.y
                                };

                                playInteraction(spine, name);
                            } else if (type === "touch") {
                                playTouchInteraction(spine, name);
                            }
                            break;
                        }
                    }                  
                }

                function onPointerMove(event) {
                    if (!isInteractiveMode) return;
                    if (isPonterDown) { 
                        const clickPos = event.data.global;
                        updateTrail(clickPos.x, clickPos.y);
                    }
                    if (!dragData) return;

                    const mouse = event.data.getLocalPosition(spine);
                    const { bone, parent1, parent2, boundsCenter, boundsWidth, boundsHeight } = dragData;

                    const localMouse = new PIXI.Point(mouse.x, mouse.y);
                    parent2.worldToLocal(localMouse);

                    const clamped = clampInRect(localMouse, boundsCenter, boundsWidth, boundsHeight);

                    const worldClamped = new PIXI.Point(clamped.x, clamped.y);
                    parent2.localToWorld(worldClamped);

                    const localInParent1 = new PIXI.Point(worldClamped.x, worldClamped.y);
                    parent1.worldToLocal(localInParent1);

                    dragData.targetX = localInParent1.x;
                    dragData.targetY = localInParent1.y;
                }

                function onPointerUp() {
                    isPonterDown = false;
                    if (!isInteractiveMode) return;
                    if (dragData) {   
                        const { bone, startLocalX, startLocalY } = dragData;

                        const returnTicker = new PIXI.Ticker();

                        returnTicker.add(() => {
                            bone.x += (startLocalX - bone.x) * RETURN_SPEED;
                            bone.y += (startLocalY - bone.y) * RETURN_SPEED;

                            if (Math.abs(bone.x - startLocalX) < 0.5 && Math.abs(bone.y - startLocalY) < 0.5) {
                                bone.x = startLocalX;
                                bone.y = startLocalY;
                                returnTicker.stop();
                                returnTicker.destroy();
                            }
                        });
                        returnTicker.start();
                    
                        stopInteraction(dragData.bound.spine);

                        dragData = null;
                    }
                }

                function pointInPolygon(polygon, x, y) {
                    let inside = false;
                    for (let i = 0, j = polygon.length - 2; i < polygon.length; i += 2) {
                        const xi = polygon[i], yi = polygon[i + 1];
                        const xj = polygon[j], yj = polygon[j + 1];
                        const intersect = ((yi > y) !== (yj > y)) &&
                                          (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
                        if (intersect) inside = !inside;
                        j = i;
                    }
                    return inside;
                }
                function clampInRect(point, center, width, height) {
                    const halfW = width / 2;
                    const halfH = height / 2;
                    return {
                        x: Math.max(center.x - halfW, Math.min(center.x + halfW, point.x)),
                        y: Math.max(center.y - halfH, Math.min(center.y + halfH, point.y))
                    };
                }
            }
            /* ------------------------------------------------------------------------------- */

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
        
        pushMetrics("Asset author", project.assetAuthor);
        Object.entries(project.metrics).forEach(([name, value]) => {
            pushMetrics(name, value);
        });

        loader.reset();

        createHintLayer(true);

        const offsetTimer = justUnwrapped ? 250 : 0;
            setTimeout(() => {
                focusOnSpines(viewport, loadedSkeletons, {
                    padding: 0.5,
                    duration: 500
                });
                loaderElement.classList.add("hidden");
                isLoading = false;
            }, offsetTimer);
    });
}

function pushMetrics(name, value) {
    const li = document.createElement("li");
        const mi = document.createElement("div");
        const mn = document.createElement("div");
        const md = document.createElement("div");

        mi.className = "metrics-item";

        mn.textContent = name;
        md.textContent = value;

        mi.appendChild(mn);
        mi.appendChild(md);
        li.appendChild(mi);
        metricsList.appendChild(li);
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

    const sortedAnims = [...spine.spineData.animations].map(a => a.name).filter(name => !name.startsWith("int_")).sort(a => a === "-default" ? -1 : 1);

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
function toggleAnimation(button, skeleton, shouldToggle = true) {
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
    if (button.dataset.state === "playing" && shouldToggle) {
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
        // state.tracks.forEach(track => track.timeScale = 1);
        state.tracks[0].timeScale = 1;
    } else {
        state.setAnimation(0, animName, true);
        // state.timeScale = 1;
    }
}

function pauseAnimation(skeleton, animName) {
    const spineObj = currentSpines.find(s => s.name === skeleton.name);
    if (spineObj) {
        // spineObj.state.tracks.forEach(track => track.timeScale = 0);
        spineObj.state.tracks[0].timeScale = 0;
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
        viewport.moveCenter(curX, curY);
        viewport.setZoom(curScale, true);
        
        if (t < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function focusCamera() {
    focusOnSpines(viewport, currentSpines, isInteractiveMode ? 
        { padding: 0.1, duration: 200 } 
        : { padding: 0.5, duration: 500 });
}

/* ---------------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------------------- */

function createHintLayer(isCreation) {
    if (isCreation) {
        viewport.addChild(hintContainer);
        const hintBG = new PIXI.Graphics(); // demi-transparent background
        hintBG.beginFill(0x000000);
        hintBG.alpha = 0.3;
        hintBG.drawRect(0, 0, viewport.worldWidth, viewport.worldHeight);
        hintContainer.addChild(hintBG);

        for (const bound of interactiveBounds) {
            const worldVertices = new Float32Array(bound.attachment.worldVerticesLength);
            bound.attachment.computeWorldVertices(bound.slot, 0, bound.attachment.worldVerticesLength, worldVertices, 0, 2);
            const center = getBoundingBoxCenter(worldVertices, bound.spine);

            const icon = bound.type === "touch"
            ? handTouch
            : handStroke;
            icon.anchor.set(0.5);
            icon.position.set(center.x, center.y);
            hintContainer.addChild(icon);  
        }
    } else {
        hintContainer.removeChildren();
        viewport.removeChild(hintContainer);
    }
}

function getBoundingBoxCenter(vertices, container) {
    let sumX = 0, sumY = 0, count = vertices.length / 2;
    for (let i = 0; i < vertices.length; i += 2) {
        const p = new PIXI.Point(vertices[i], vertices[i + 1]);
        const gp = container.toGlobal(p);
        const vp = viewport.toLocal(gp);
        sumX += vp.x;
        sumY += vp.y;
    }
    return { x: sumX / count, y: sumY / count };
}

function playInteraction(spine, areaName) {
    const trackIndex = 1;
    const animName = "int_" + areaName.slice(areaName.indexOf("_") + 1);
    const state = spine.state;
    const anim = state.data.skeletonData.findAnimation(animName);
    if (!anim) return;

    const mixTime = 0.2;
    state.clearTrack(trackIndex);

    const entry = state.setAnimation(trackIndex, animName, false);
    entry.mixDuration = mixTime;
    entry.alpha = 1.0;
    spine._interactionEntry = entry;
}

function stopInteraction(spine) {
    const entry = spine._interactionEntry;
    if (!entry) return;

    const trackIndex = 1;
    const state = spine.state;
    const current = state.getCurrent(trackIndex);
    if (!current) return;

    const fadeDuration = 0.1;
    const fadeStep = 1 / (fadeDuration * 60);

    let fading = true;
    const ticker = (delta) => {
        if (!fading) return;

        entry.alpha -= fadeStep * delta;
        if (entry.alpha <= 0) {
            entry.alpha = 0;
            spine.state.clearTrack(1);
            PIXI.Ticker.shared.remove(ticker);
            fading = false;
        }
    };

    PIXI.Ticker.shared.add(ticker);
}

function playTouchInteraction(spine, areaName) {
    const trackIndex = 1; // Наложение поверх базового трека
    const animName = "int_" + areaName.slice(areaName.indexOf("_") + 1);

    const state = spine.state;
    const anim = state.data.skeletonData.findAnimation(animName);
    if (!anim) {
        // console.warn(`Анимация ${animName} не найдена.`);
        return;
    }

    isAnimationPlaying = true;

    const entry = state.setAnimation(trackIndex, animName, false);
    entry.alpha = 1.0;
    entry.mixDuration = 0.2;
    entry.mixTime = 0;

    entry.listener = {
        complete: () => {
            isAnimationPlaying = false;
            state.clearTrack(trackIndex);
        },
        end: () => {
            isAnimationPlaying = false;
        }
    };
}

function switchInteractionMode(isActive) {
    if (isActive) {
        document.querySelectorAll(".hideable").forEach(element => {
            element.style.display = "none";
            isInteractiveMode = true;
            viewport.drag({ mouseButtons: 'right' });
            const animBtn = animationList.querySelector('[data-anim="idle"]');
            currentSpines.forEach(spine => {
                toggleAnimation(animBtn, spine, false);
            });
        });
    } else {
        document.querySelectorAll(".hideable").forEach(element => {
            element.style.display = "";
            isInteractiveMode = false;
            currentSpines.forEach(spine => {
                stopInteraction(spine);
            });
            viewport.drag( { mouseButtons: ['right', 'left'] } );
        });
    }
    focusCamera();
}

function resetInteractionMode() {
    interactionSwitcher.classList.remove("active");
    interactionSwitcher.classList.remove("unavaliable");
    switchInteractionMode(false);
}

/* ---------------------------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------- VFX ------------------------------------------------------------------------------ */

function playClickVFX(x, y) {
    spawnClickParticle(x, y);
    spawnTriangleParticles(x, y);
    spawnArc(x, y);
    spawnArc(x, y);
}

function spawnClickParticle(x, y) {
    const emitter = new PIXI.particles.Emitter(
        particleLayer,
        {
            lifetime: {
                min: 0.2,
                max: 0.2
            },
            frequency: 0.19,
            emitterLifetime: 0.2,
            maxParticles: 1,
            pos: { x: x, y: y },
            autoUpdate: true,
            behaviors: [
                {
                    type: 'alpha',
                    config: {
                        alpha: {
                            list: [
                                { value: 1, time: 0 },
                                { value: 0.74, time: 1 }
                            ]
                        }
                    }
                },
                {
                    type: 'blendMode',
                    config: {
                        "blendMode": 'add'
                    }
                },
                {
                    type: 'color',
                    config: {
                        color: {
                            list: [
                                { value: "ffffff", time: 0 },
                                { value: "125DAB", time: 1 }
                                // { value: "399aff", time: 1 }
                            ],
                            ease: x => 1 - Math.pow(1 - x, 5)
                        },
                  }
                },
                {
                    type: 'scale',
                    config: {
                        scale: {
                            list: [
                                { value: adjustToScale(0.33), time: 0 },
                                { value: adjustToScale(0.8), time: 1 }
                            ],
                            minimumScaleMultiplier: 1,
                            ease: x => 1 - Math.pow(1 - x, 3)
                        }
                    }
                },
                { type: 'textureSingle', config: { texture: './particles/mainGlowing.png' } },
            ],
        }
    );

    try {
        emitter.playOnceAndDestroy(() => {
            emitter.destroy();
        });
    } catch (e) {
        // console.warn('playOnceAndDestroy failed, fallback to manual stop:', e);
        emitter.emit = true;
        emitter.autoUpdate = true;
        setTimeout(() => {
            emitter.emit = false;
            emitter.destroy();
        }, 200);
    }
}
function spawnTriangleParticles(x, y) {
    const emitter = new PIXI.particles.Emitter(
        particleLayer,
        {
            lifetime: {
                min: 0.53,
                max: 0.53
            },
            frequency: 0.05,
            emitterLifetime: 0.53,
            maxParticles: 4,
            spawnChance: 1,
            pos: { x, y },
            particlesPerWave: 4,
            behaviors: [
                {
                    type: "spawnShape",
                    config: {
                        type: 'torus',
                        data: {
                            radius: adjustToScale(45),
                            innerRadius: adjustToScale(25),
                            affectRotation: true
                        }
                    }
                },
                {
                    type: "noRotation",
                    config: { "rotation": true }
                },
                {
                    type: 'alpha',
                    config: {
                        alpha: {
                            list: [
                                { value: 1, time: 0 },
                                { value: 1, time: 0.3 },
                                { value: 0, time: 0.39 },
                                { value: 0.8, time: 0.48 },
                                { value: 0, time: 0.57 },
                                { value: 0.7, time: 0.69 },
                                { value: 0, time: 0.81 },
                                { value: 0.6, time: 0.9 },
                                { value: 0, time: 1 }
                            ]
                        }
                    }
                },
                {
                    type: 'blendMode',
                    config: {
                        "blendMode": 'screen'
                    }
                },
                {
                    type: 'color',
                    config: {
                        color: {
                            list: [
                                { value: 'ffffff', time: 0 },
                                { value: 'ffffff', time: 0.3 },
                                { value: '51F4FF', time: 0.39 },
                                { value: 'B9FAFF', time: 0.48 },
                                { value: '51F4FF', time: 0.57 },
                                { value: '77E9F3', time: 0.69 },
                                { value: '51F4FF', time: 0.81 },
                                { value: '77E9F3', time: 0.9 },
                                { value: '51F4FF', time: 1 }
                            ]
                        },
                  }
                },
                {
                    type: 'scale',
                    config: {
                        scale: {
                            list: [
                                { value: adjustToScale(0.0), time: 0 },
                                { value: adjustToScale(0.5), time: 0.21 },
                                { value: adjustToScale(0.2), time: 1.0 }
                            ],
                            minimumScaleMultiplier: 1
                        }
                    }
                },
                {
                    type: 'moveSpeed',
                    config: {
                        speed: {
                            list: [
                                { value: adjustToScale(150), time: 0 },
                                { value: adjustToScale(40), time: 1 }
                            ],
                            ease: x => Math.sin((x * Math.PI) / 2)
                        }
                    }
                },
                {
                    type: 'textureRandom',
                    config: {
                        textures: [
                            './particles/triangleParticle.png',
                            './particles/triangleParticleInvert.png'
                        ]
                    }
                },
            ]
        }
    );

    emitter.playOnceAndDestroy(() => {
        emitter.destroy();
    });
}


class SingleArcEffect {
    constructor(x, y, options = {}) {
        this.container = new PIXI.Container();
        this.container.x = x;
        this.container.y = y;

        this.duration = options.duration || 1.0;
        this.elapsed = 0;

        // --- основные настройки ---
        this.color = options.color || 0xFFFFFF;
        this.lineWidth = options.lineWidth || 3;

        this.rotationTotal = options.rotationTotal ?? (Math.PI);
        this.startRotation = options.startRotation ?? (Math.random() * Math.PI * 2);
        this.radiusRange = options.radiusRange || [40, 60];
        this.baseRadius = this.randomRange(this.radiusRange[0], this.radiusRange[1]);
        this.radiusGrow = options.radiusGrow ?? 1.15;

        this.arcLengthList = options.arcLengthList || [
            { time: 0, value: 0.05 },
            { time: 0.24, value: 0.9 },
            { time: 1, value: 0.05 },
        ];
        this.alphaList = options.alphaList || [
            { time: 0, value: 1 },
            { time: 1, value: 1 },
        ];
        this.scaleList = options.scaleList || [
            { time: 0, value: 1 },
            { time: 1, value: this.radiusGrow },
        ];

        // this.ease = t => 1 - Math.pow(1 - t, 3);
        this.ease = t => Math.sin((t * Math.PI) / 2);

        this.arc = new PIXI.Graphics();
        this.arc.alpha = 1;
        this.arc.blendMode = options.blendMode || PIXI.BLEND_MODES.NORMAL;
        this.container.addChild(this.arc);
    }

    randomRange(min, max) {
        return min + Math.random() * (max - min);
    }

    getValueFromList(list, t) {
        if (t <= list[0].time) return list[0].value;
        if (t >= list[list.length - 1].time) return list[list.length - 1].value;
        for (let i = 0; i < list.length - 1; i++) {
            const a = list[i];
            const b = list[i + 1];
            if (t >= a.time && t <= b.time) {
                const k = (t - a.time) / (b.time - a.time);
                return a.value + (b.value - a.value) * this.ease(k);
            }
        }
    }

    update(dt) {
        this.elapsed += dt;
        const t = Math.min(this.elapsed / this.duration, 1);

        const arcFraction = this.getValueFromList(this.arcLengthList, t);
        const alpha = this.getValueFromList(this.alphaList, t);
        const scale = this.getValueFromList(this.scaleList, t);

        const radius = this.baseRadius * scale;
        const arcAngle = Math.PI * 2 * arcFraction;
        const rotProgress = this.rotationTotal * t;

        this.arc.rotation = this.startRotation - rotProgress;
        this.arc.alpha = alpha;

        // рисуем дугу
        this.arc.clear();
        this.arc.lineStyle(this.lineWidth, this.color, 1);
        this.arc.arc(0, 0, radius, 0, arcAngle);
    }

    get isAlive() {
        return this.elapsed < this.duration;
    }

    destroy() {
        this.arc.destroy();
        this.container.destroy({ children: true });
    }
}

const activeArcs = [];

function spawnArc(x, y, options = {}) {
    const arc = new SingleArcEffect(x, y, {
        duration: 0.53,
        color: 0xB8EEFF,
        lineWidth: adjustToScale(3),
        rotationTotal: Math.PI,
        radiusRange: [adjustToScale(30), adjustToScale(34)],
        radiusGrow: 2.4,
        blendMode: PIXI.BLEND_MODES.ADD,
        ...options
    });
    app.stage.addChild(arc.container);
    activeArcs.push(arc);
}

const trail = new PIXI.Graphics(), trailBlur = new PIXI.Graphics();
trail.blendMode = PIXI.BLEND_MODES.ADD;

blurFilter = new PIXI.filters.BlurFilter();
blurFilter.blendMode = PIXI.BLEND_MODES.ADD;
blurFilter.blur = 6;
blurFilter.padding = 80;
trailBlur.filters = [blurFilter];
app.stage.addChild(trailBlur);
app.stage.addChild(trail);
const points = [];
const maxLength = 20;
const baseThickness = 6;
let idleTimer = 0; 


function updateTrail(x, y) {
    points.push({ x, y });
    if (points.length > maxLength) {
        points.shift();
    }
    idleTimer = 0;
}

let fadeTimer = 0;
app.ticker.add((delta) => {
    // vfx arks
    const dt = delta / 60;
    for (let i = activeArcs.length - 1; i >= 0; i--) {
        const arc = activeArcs[i];
        arc.update(dt);
        if (!arc.isAlive) {
            arc.destroy();
            activeArcs.splice(i, 1);
        }
    }

    // vfx trail
    idleTimer += dt;
    // если курсор не двигается, постепенно обрезать хвост
    if (idleTimer > 0.01 && points.length > 0) {
        points.shift();
        idleTimer = 0;
    }

    trailBlur.clear();
    trail.clear();

    // прорисовка шлейфа от головы к хвосту
    for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const t = i / points.length;

        // толщина уменьшается к хвосту
        const thickness = adjustToScale(baseThickness * t);
        trailBlur.lineStyle(thickness, 0x249BFF, 1);
        trail.lineStyle(thickness, 0x008CFF, 1);

        trailBlur.moveTo(p0.x, p0.y);
        trailBlur.lineTo(p1.x, p1.y);
        trail.moveTo(p0.x, p0.y);
        trail.lineTo(p1.x, p1.y);
    }
});



// ===================
// ТОЛЬКО ТАЧ
// ===================
let lastDist = 0;
let lastMid = null;
let isTwoFinger = false;
let singleTouchStart = null;

const el = app.view;

// touchstart
el.addEventListener('touchstart', (ev) => {
    if (ev.touches.length === 1) {
        // один палец → ЛКМ
        isTwoFinger = false;
        singleTouchStart = {
            x: ev.touches[0].clientX,
            y: ev.touches[0].clientY,
            time: performance.now()
        };
    }

    if (ev.touches.length === 2) {
        isTwoFinger = true;
        lastDist = getDist(ev);
        lastMid = getMid(ev);
        singleTouchStart = null; // один палец больше не считается
    }
}, { passive: false });

// touchmove
el.addEventListener('touchmove', (ev) => {
    // Если два пальца — окно не скроллим
    if (ev.touches.length === 2) ev.preventDefault();

    if (isTwoFinger && ev.touches.length === 2) {
        const dist = getDist(ev);
        const mid = getMid(ev);

        // масштаб
        const scale = viewport.scale.x * (dist / lastDist);
        viewport.setZoom(scale, true);

        // панорамирование камеры
        viewport.x += mid.x - lastMid.x;
        viewport.y += mid.y - lastMid.y;

        lastDist = dist;
        lastMid = mid;
    }
}, { passive: false });

// touchend
el.addEventListener('touchend', (ev) => {
    // Если это окончание одиночного касания — генерируем ЛКМ-клик
    if (!isTwoFinger && singleTouchStart) {
        const dt = performance.now() - singleTouchStart.time;

        // минимальное движение ⇒ клик
        const dx = (ev.changedTouches[0].clientX - singleTouchStart.x);
        const dy = (ev.changedTouches[0].clientY - singleTouchStart.y);
        const moved = Math.hypot(dx, dy);

        if (moved < 10 && dt < 300) {
            // создаём synthetic left mouse click
            const rect = el.getBoundingClientRect();
            const x = singleTouchStart.x - rect.left;
            const y = singleTouchStart.y - rect.top;

            const down = new PointerEvent("pointerdown", {
                pointerType: "mouse",
                button: 0,
                clientX: singleTouchStart.x,
                clientY: singleTouchStart.y
            });
            const up = new PointerEvent("pointerup", {
                pointerType: "mouse",
                button: 0,
                clientX: singleTouchStart.x,
                clientY: singleTouchStart.y
            });

            el.dispatchEvent(down);
            el.dispatchEvent(up);
        }
    }

    // сброс
    if (ev.touches.length === 0) {
        isTwoFinger = false;
        singleTouchStart = null;
    }
});

// ------------------
// УТИЛИТЫ
// ------------------

function getDist(ev) {
    const t1 = ev.touches[0], t2 = ev.touches[1];
    return Math.hypot(
        t1.clientX - t2.clientX,
        t1.clientY - t2.clientY
    );
}

function getMid(ev) {
    const t1 = ev.touches[0], t2 = ev.touches[1];
    return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2
    };
}
