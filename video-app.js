window.createPlayer = (function (){
    return function createPlayer(container, onLoadCallback){
        const videoElement = document.createElement('video');
        videoElement.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
        // videoElement.style = 'width:90%';
        videoElement.controls = true;
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.addEventListener('playing', onLoadCallback);
        container.appendChild(videoElement);
    }
}());