const setWebFilter = async function (filterName, isInit = false) {

    await installFilter(filterName);

    if (!isInit) {
        try {
            await JEELIZFACEFILTER.destroy();
        } catch (err) {
            console.error("No facefilter to destroy");
        }
    }

    if (filterName === "facedetect") {
        faceDetectFilter();
    } else if (filterName === "anonymous") {
        anonymousFilter();
    } else if (filterName === "helmet") {
        helmetFilter();
    } else if (filterName === "sunglasses") {
        sunglassesFilter();
    } else if (filterName === "dogface") {
        dogfaceFilter();
    } else {
        normalFilter();
    }

}

const initFilterCanvas = () => {
    const canvasDims = GLOBAL_STATE.getKey("canvasDims");
    createCanvas(canvasDims.width, canvasDims.height);

    setWebFilter(GLOBAL_STATE.getKey("currentFilter"), true);

    console.debug("all filters are loaded");
}

