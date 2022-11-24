const createTrustedScriptURL = (url) => {
    if (!window.trustedTypes) {
        return url;
    }

    const scriptPolicy = window.trustedTypes?.createPolicy('scriptPolicy', {
        createScriptURL: (url) => url
    });

    return scriptPolicy?.createScriptURL(url);
}

const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.addEventListener("load", () => {
            resolve();
        })
        script.addEventListener("error", () => {
            reject();
        });
        script.setAttribute("crossorigin", "anonymous")
        script.setAttribute("fetchpriority", "auto");
        script.setAttribute("src", createTrustedScriptURL(getExtensionUrl(src)));

        const parentBody = document.body || document.documentElement;

        parentBody.appendChild(script);

    });
};

const loadAllScripts = async (scripts) => {
    for (const scriptSrc of scripts) {
        if (!isScriptLoaded(scriptSrc)) {
            await loadScript(scriptSrc);
        }
    }
}