const normalFilter = () => {
    let CVD = null; // return of Canvas2DDisplay

    JEELIZFACEFILTER.init({
        canvasId: CANVAS_ID,
        NNCPath: getExtensionUrl("assets/neuralNets/"), // root of NN_DEFAULT.json file
        callbackReady: function (errCode, spec) {
            if (errCode) {
                console.error('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
                return;
            }

            console.debug('INFO: JEELIZFACEFILTER IS READY');
            CVD = JeelizCanvas2DHelper(spec);
        },

        // called at each render iteration (drawing loop):
        callbackTrack: function () {
            CVD.draw();
        }
    });
}