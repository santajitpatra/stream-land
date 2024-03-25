const userVideo = document.getElementById('user-video');
const startButton = document.getElementById('start-btn');

const state = {media: null};
const socket = io();

startButton.addEventListener('click', () => {
    const mediaRecorder = new MediaRecorder(state.media, {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 128000,
        fraamerate: 25
        
    });
    mediaRecorder.ondataavailable = (e) => {
        console.log("Binary Stream Available",e.data);
        socket.emit('binarystream', e.data);
    };

    mediaRecorder.start(25);
});


window.addEventListener('load', async (e) => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });
    state.media = stream;
    userVideo.srcObject = stream;
});

