const faceDetectFilter = () => {
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
            CVD.ctx.strokeStyle = 'yellow';
        },

        // called at each render iteration (drawing loop):
        callbackTrack: function (detectState) {
            if (detectState.detected > 0.8) {
                // draw a border around the face:
                const faceCoo = CVD.getCoordinates(detectState);
                CVD.ctx.clearRect(0, 0, CVD.canvas.width, CVD.canvas.height);
                CVD.ctx.strokeRect(faceCoo.x, faceCoo.y, faceCoo.w, faceCoo.h);

                CVD.ctx.lineWidth = 2;
                CVD.ctx.setLineDash([2, 2]);

                CVD.update_canvasTexture();
            }
            CVD.draw();
        }
    });
}