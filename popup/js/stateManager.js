class PopUpStateManager {
    #state = {}
    constructor() {
        this.#state = {
            currentFilterId: "filter-0",
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

var popUpStateManager = new PopUpStateManager();