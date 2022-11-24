const isScriptLoaded = (src) => {
    return document.querySelector(`script[src="${getExtensionUrl(src)}"]`) !== null;
}