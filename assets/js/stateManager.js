class WFStateManager {
    #state = {}
    constructor() {
        this.#state = {
            showMiniCanvas: true,
            currentFilter: "normal",
            canvasDims: {
                width: 1920,
                height: 1080
            },
        };
    }

    setState(param) {

        switch (typeof param) {
            case "function":
                this.#state = this.setStateCallback(this.#state);
                break;
            case "object":
                this.#state = { ...this.#state, ...param };
                break;
            default:
                break;
        }
    }

    getState() {
        return this.#state;
    }

    getKey(key) {
        if (typeof key === "undefined") throw new Error(`Key ${key} is not defined [STATE MANAGER]`);
        const value = this.#state?.[key];
        return value;
    }
}

const GLOBAL_STATE = new WFStateManager();
const CANVAS_ID = "hcanvas";
const getExtensionUrl = (path) => {
    const EXT_ID = document.body.getAttribute("data-ext-id");
    return `chrome-extension://${EXT_ID}/${path}`;
};

// const CANVAS_DIMENSIONS = {
//     width: 640,
//     height: 480
// }

// const CANVAS_DIMENSIONS = {
//     width: 1920,
//     height: 1080
// }