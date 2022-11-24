const installFilter = async (filterName) => {
    let deps = FILTERS_DEPS?.[filterName];

    if (typeof deps === "undefined") {
        console.log(`No dependencies for filter "${filterName}" [installFilter]`);
        filterName = "normal";
        deps = FILTERS_DEPS?.[filterName];
    }

    await loadAllScripts(deps);

    const filterIndexSrc = `assets/js/filters/${filterName}/index.js`;

    await loadAllScripts([filterIndexSrc]);

    console.debug(`Filter ${filterName} is installed`);
}