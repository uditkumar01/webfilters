// var getStreamInfo = function (stream) {
//     const firstVideoTrack = stream.getVideoTracks()?.[0];

//     if (!firstVideoTrack) return null;

//     return {
//         deviceId: firstVideoTrack.getSettings().deviceId,
//         frameRate: firstVideoTrack.getSettings().frameRate,
//         height: firstVideoTrack.getSettings().height,
//         width: firstVideoTrack.getSettings().width,
//         frameRate: firstVideoTrack.getSettings().frameRate
//     }
// }

const editStream = function (stream) {
    const canvasDims = GLOBAL_STATE.getKey("canvasDims");
    const hiddenCanvas = createCanvas(canvasDims.width, canvasDims.height);
    const canvasStream = hiddenCanvas.captureStream(30);
    const audioTracks = stream.getAudioTracks();
    const videoTracks = canvasStream.getVideoTracks();

    const newStream = new MediaStream([...videoTracks, ...audioTracks]);

    return newStream;
};