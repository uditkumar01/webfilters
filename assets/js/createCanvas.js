const createCanvas = (width, height, cvid = '') => {
    if (cvid === '') {
        cvid = CANVAS_ID;
    }

    let canvas = document.getElementById(cvid);

    if (canvas) return canvas;

    const showMiniCanvas = GLOBAL_STATE.getKey("showMiniCanvas");

    canvas = document.createElement('canvas');
    canvas.setAttribute('id', CANVAS_ID);
    canvas.width = width;
    canvas.height = height;
    if (!showMiniCanvas) { canvas.classList.add("hidden"); }
    document.body.appendChild(canvas);

    return canvas;
}