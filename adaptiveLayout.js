const galleryDisplayMq = window.matchMedia("(max-width: 1042px)");

function adaptiveController() {
    if (galleryDisplayMq.matches) {
        const activeType = display_type_list.querySelector("#adaptive-flex-button.active");

        if (activeType) {
            activeType.classList.remove("active");
            display_type_list1.querySelector(`${activeType.dataset.twin}`).classList.remove("active");
            
            const newActiveType = display_type_list.querySelector('#perfect-grid-button');
            newActiveType.classList.add("active");
            display_type_list1.querySelector(`${newActiveType.dataset.twin}`).classList.add("active");
            
            const displayType = 'perfect-grid';
            currentDisplayType = displayType;
            localStorage.setItem("displayType", currentDisplayType);
            
            gallery_styles.forEach(stl => gallery_grid.classList.remove(stl));
            gallery_grid.classList.add(displayType);
        }
    }
}

window.addEventListener("resize", adaptiveController);
window.addEventListener("DOMContentLoaded", adaptiveController);