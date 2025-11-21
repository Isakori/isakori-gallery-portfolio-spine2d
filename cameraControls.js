function setupTouchControls(viewport, app) {
    let lastTouch = null;
    let lastDist = 0;
    let twoFinger = false;

    const el = app.view; // сам canvas

    // touchstart
    el.addEventListener('touchstart', (ev) => {
        if (ev.touches.length === 1) {
            twoFinger = false;

            lastTouch = {
                x: ev.touches[0].clientX,
                y: ev.touches[0].clientY
            };
        }

        if (ev.touches.length === 2) {
            twoFinger = true;

            lastDist = getDist(ev);
            lastMid = getMid(ev);
        }
    }, { passive: false });


    // touchmove
    el.addEventListener('touchmove', (ev) => {
        ev.preventDefault();

        // два пальца → zoom + pan
        if (twoFinger && ev.touches.length === 2) {
            const dist = getDist(ev);
            const mid = getMid(ev);

            const scale = viewport.scale.x * (dist / lastDist);

            // clampZoom
            const clamped = Math.min(5, Math.max(0.25, scale));
            const ratio = clamped / viewport.scale.x;

            zoomToCenter(viewport, ratio);

            // двухпальцевый pan
            viewport.x += mid.x - lastMid.x;
            viewport.y += mid.y - lastMid.y;

            lastDist = dist;
            lastMid = mid;

            return;
        }

        // один палец → drag
        if (!twoFinger && lastTouch) {
            const nx = ev.touches[0].clientX;
            const ny = ev.touches[0].clientY;

            const dx = nx - lastTouch.x;
            const dy = ny - lastTouch.y;

            viewport.x += dx;
            viewport.y += dy;

            lastTouch.x = nx;
            lastTouch.y = ny;
        }

    }, { passive: false });


    el.addEventListener('touchend', () => {
        lastTouch = null;
        twoFinger = false;
    });
}



// Утилиты
function getDist(ev) {
    const t1 = ev.touches[0], t2 = ev.touches[1];
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
}

function getMid(ev) {
    const t1 = ev.touches[0], t2 = ev.touches[1];
    return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2
    };
}


// Зум к центру вьюпорта
function zoomToCenter(viewport, ratio) {
    const center = {
        x: viewport.screenWidth / 2,
        y: viewport.screenHeight / 2
    };

    const before = viewport.toWorld(center.x, center.y);

    viewport.scale.x *= ratio;
    viewport.scale.y *= ratio;

    const after = viewport.toWorld(center.x, center.y);

    viewport.x += (before.x - after.x) * viewport.scale.x;
    viewport.y += (before.y - after.y) * viewport.scale.y;
}
