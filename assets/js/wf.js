function injectStream() {
  overrideGetUserMedia();
}

injectStream();

const handleCamPermitChange = (permitStatus) => {
  if (permitStatus === 'granted') {
    initFilterCanvas();
  }
}

const main = async () => {

  const permit = await navigator.permissions.query({ name: 'camera' });

  let hiddenCanvas = document.getElementById(CANVAS_ID);

  permit.addEventListener('change', () => {
    handleCamPermitChange(permit.state);
  });

  handleCamPermitChange(permit.state);

  document.addEventListener('loadfilter', (ev) => {
    let { filterName } = ev.detail;

    GLOBAL_STATE.setState({ currentFilter: filterName });
    setWebFilter(filterName);
  });

  document.addEventListener('setresolution', (ev) => {
    let { resolution } = ev.detail;

    GLOBAL_STATE.setState({ canvasDims: resolution });

    if (hiddenCanvas === null) hiddenCanvas = document.getElementById(CANVAS_ID);

    if (hiddenCanvas !== null) {
      hiddenCanvas.width = resolution.width;
      hiddenCanvas.height = resolution.height;
    }

    setWebFilter(GLOBAL_STATE.getKey("currentFilter"));
  });

  console.debug("All DONE!!!");

};

window.addEventListener('load', main);