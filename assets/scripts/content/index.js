const loadStylesheet = (src) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL(src);

    document.head.appendChild(link);
}

const loadAllStylesheets = (stylesheets) => {
    stylesheets.forEach((stylesheet) => {
        loadStylesheet(stylesheet);
    });
}


const loadScript = ({
    src,
    priority = "auto"
}) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.addEventListener("load", () => {
            resolve();
        })
        script.addEventListener("error", () => {
            reject();
        });
        script.setAttribute("crossorigin", "anonymous")
        script.setAttribute("fetchpriority", priority);
        script.setAttribute("src", chrome.runtime.getURL(src));

        const parentHead = document.head || document.documentElement;
        const parentBody = document.body || document.documentElement;

        switch (priority) {
            case "high":
                parentHead.insertBefore(script, parentHead.firstChild);
                break;
            default:
                parentBody.appendChild(script);
                break;
        }
    });
};

const loadAllScripts = async (scripts) => {
    for (const script of scripts) {
        await loadScript(script);
    }

    console.debug("scripts are loaded");
}

const main = async () => {
    await loadAllScripts(scriptsWithPriorities);
    loadAllStylesheets(stylesheets);
}

main();


// make a global var for baseURL to be used in other client scripts
document.addEventListener("DOMContentLoaded", function () {
    const chromeextid = chrome.runtime.id;
    document.body.setAttribute("data-ext-id", chromeextid);
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const extId = sender.id;

    switch (request.type) {
        case "installfilter":
            const filterName = request.filterName || "normal";

            const customEvent = new CustomEvent("loadfilter", {
                detail: {
                    filterName: filterName.replace(" ", "").trim().toLowerCase(),
                    extId: extId
                }
            });

            document.dispatchEvent(customEvent);
            break;
        case "miniplayertoggle":
            const isVisible = request.isVisible;
            const hiddenCanvas = document.getElementById("hcanvas");

            if (hiddenCanvas !== null) {
                if (isVisible) {
                    hiddenCanvas.classList.remove("hidden");
                } else {
                    hiddenCanvas.classList.add("hidden");
                }
            }

            break;
        case "setresolution":
            const resolution = request.resolution;

            const customEventForRes = new CustomEvent("setresolution", {
                detail: {
                    resolution: resolution,
                    extId: extId
                }
            });

            document.dispatchEvent(customEventForRes);
            break;
        default:
            break;
    }

    sendResponse({ done: true });
});