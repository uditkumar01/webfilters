function sunglassesFilter() {
    let THREECAMERA = null;


    // callback: launched if a face is detected or lost.
    function detect_callback(faceIndex, isDetected) {
        if (isDetected) {
            console.debug('INFO in detect_callback(): DETECTED');
        } else {
            console.debug('INFO in detect_callback(): LOST');
        }
    }


    // build the 3D. called once when Jeeliz Face Filter is OK:
    function init_threeScene(spec) {
        const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);

        // improve WebGLRenderer settings:
        threeStuffs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        threeStuffs.renderer.outputEncoding = THREE.sRGBEncoding;

        // CREATE THE GLASSES AND ADD THEM
        const r = JeelizThreeGlassesCreator({
            envMapURL: getExtensionUrl("assets/images/envMap.jpg"),
            frameMeshURL: getExtensionUrl("assets/js/filters/sunglasses/models3D/glassesFramesBranchesBent.json"),
            lensesMeshURL: getExtensionUrl("assets/js/filters/sunglasses/models3D/glassesLenses.json"),
            occluderURL: getExtensionUrl("assets/js/filters/sunglasses/models3D/face.json")
        });

        // vertical offset:
        const dy = 0.07;

        // create and add the occluder:
        r.occluder.rotation.set(0.3, 0, 0);
        r.occluder.position.set(0, 0.03 + dy, -0.04);
        r.occluder.scale.multiplyScalar(0.0084);
        threeStuffs.faceObject.add(r.occluder);

        // create and add the glasses mesh:
        const threeGlasses = r.glasses;
        //threeGlasses.rotation.set(-0.15,0,0); / /X neg -> rotate branches down
        threeGlasses.position.set(0, dy, 0.4);
        threeGlasses.scale.multiplyScalar(0.006);
        threeStuffs.faceObject.add(threeGlasses);

        // add a debug cube:
        /* const sc = 0.1;
        const debugCube = new THREE.Mesh(new THREE.BoxGeometry(sc,sc,sc), new THREE.MeshNormalMaterial());
        threeStuffs.faceObject.add(debugCube); //*/

        // CREATE THE CAMERA:
        THREECAMERA = JeelizThreeHelper.create_camera();
    } // end init_threeScene()


    // entry point:
    function init_Filter() {
        init_faceFilter();
    }


    function init_faceFilter(videoSettings) {
        JEELIZFACEFILTER.init({
            followZRot: true,
            canvasId: CANVAS_ID,
            NNCPath: getExtensionUrl("assets/neuralNets/"), // path of NN_DEFAULT.json file
            maxFacesDetected: 1,
            callbackReady: function (errCode, spec) {
                if (errCode) {
                    console.error('AN ERROR HAPPENS. ERR =', errCode);
                    return;
                }

                console.debug('INFO: JEELIZFACEFILTER IS READY');
                init_threeScene(spec);
            },

            // called at each render iteration (drawing loop):
            callbackTrack: function (detectState) {
                JeelizThreeHelper.render(detectState, THREECAMERA);
            }
        }); //end JEELIZFACEFILTER.init call
    }

    init_Filter();
}