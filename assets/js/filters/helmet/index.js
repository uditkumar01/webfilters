function helmetFilter() {
    // SETTINGS of this demo:
    let SETTINGS = {
        gltfModelURL: getExtensionUrl('assets/js/filters/helmet/models/DamagedHelmet.gltf'),
        cubeMapURL: getExtensionUrl('assets/js/filters/helmet/cubeMap/'),
        offsetYZ: [0.3, 0], // offset of the model in 3D along vertical and depth axis
        scale: 2.5
    };

    let THREECAMERA = null;


    // build the 3D. called once when Jeeliz Face Filter is OK
    function init_threeScene(spec) {
        const threeStuffs = JeelizThreeHelper.init(spec, null);

        // CREATE THE ENVMAP:
        const path = SETTINGS.cubeMapURL;
        const format = '.jpg';
        const envMap = new THREE.CubeTextureLoader().load([
            path + 'posx' + format, path + 'negx' + format,
            path + 'posy' + format, path + 'negy' + format,
            path + 'posz' + format, path + 'negz' + format
        ]);

        // IMPORT THE GLTF MODEL:
        // from https://threejs.org/examples/#webgl_loader_gltf
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load(SETTINGS.gltfModelURL, function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.material.envMap = envMap;
                }
            });
            gltf.scene.frustumCulled = false;

            // center and scale the object:
            const bbox = new THREE.Box3().expandByObject(gltf.scene);

            // center the model:
            const centerBBox = bbox.getCenter(new THREE.Vector3());
            gltf.scene.position.add(centerBBox.multiplyScalar(-1));
            gltf.scene.position.add(new THREE.Vector3(0, SETTINGS.offsetYZ[0], SETTINGS.offsetYZ[1]));

            // scale the model according to its width:
            const sizeX = bbox.getSize(new THREE.Vector3()).x;
            gltf.scene.scale.multiplyScalar(SETTINGS.scale / sizeX);

            // dispatch the model:
            threeStuffs.faceObject.add(gltf.scene);
        }); //end gltfLoader.load callback

        //CREATE THE CAMERA
        THREECAMERA = JeelizThreeHelper.create_camera();
    } //end init_threeScene()


    //entry point:
    function init_Filter() {
        // JeelizThreeHelper.update_camera(THREECAMERA);
        startHelmetFilter();
    }


    function startHelmetFilter() {
        JEELIZFACEFILTER.init({
            followZRot: true,
            canvasId: CANVAS_ID,
            NNCPath: getExtensionUrl("assets/neuralNets/"), //root of NN_DEFAULT.json file
            callbackReady: function (errCode, spec) {
                if (errCode) {
                    console.error('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
                    return;
                }

                console.debug('INFO: JEELIZFACEFILTER IS READY');
                init_threeScene(spec);
            }, //end callbackReady()

            // called at each render iteration (drawing loop):
            callbackTrack: function (detectState) {
                JeelizThreeHelper.render(detectState, THREECAMERA);
            }
        }); //end JEELIZFACEFILTER.init call
    } //end start()

    init_Filter();
}