const overrideGetUserMedia = function () {

    navigator.mediaDevices.getUserMedia = ((gum) => {
        return async function (...args) {
            console.debug(args);
            try {
                if (typeof gum !== "function") {
                    console.error("success callback for getUserMedia is not defined");
                    return () => null;
                }

                const oldStream = await gum.apply(this, args);

                if (args[1] === "src") return oldStream;

                return editStream(oldStream);
            } catch (error) {
                return Promise.reject(error);
            }
        };
    })(navigator.mediaDevices.getUserMedia);

}