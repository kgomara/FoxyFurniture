/*global $, document, window: false */

window.addEventListener('load', function() {
    const 	video 			= document.getElementById('movie');
    const 	progressBar		= document.getElementById('progressBar');
    const 	playBtn 		= document.getElementById('play-pause');
	var 	icon 			= document.getElementById('icon');
//     const fullScreenBtn = document.querySelector('#full-screen');

    // Play/Pause toggle
	playBtn.addEventListener("click", () => {
	  video.paused ? video.play() : video.pause();
	});
	
	video.addEventListener("play", () => {
	  playBtn.innerHTML = '<img src="./img/icons/pause.svg" alt="Bootstrap">';
	});
	
	video.addEventListener("pause", () => {
	  playBtn.innerHTML = '<img src="./img/icons/play.svg" alt="Bootstrap">';
	});
	
    // Full Screen using the Fullscreen API
/*
    fullScreenBtn.onclick = () => {
        if (video.requestFullscreen) 
        	video.requestFullscreen();
        else if (video.webkitRequestFullscreen) 
        	video.webkitRequestFullscreen(); 	// Safari/Chrome
        else if (video.msRequestFullscreen) 
        	video.msRequestFullscreen(); 		// IE/Edge
    };
*/

    // Update progress bar as video plays
    video.ontimeupdate = () => {
        percentage = (video.currentTime / video.duration) * 100;
        if (percentage >= 100.0) {
	        // we are at the end of the video, reset UI to be ready to play again
        	percentage = 0;
        	video.currentTime = 0;
        }
        progressBar.value = percentage || 0;
    };

    // Seek video when slider is moved
    progressBar.oninput = () => {
        const time = video.duration * (progressBar.value / 100);
        video.currentTime = time;
    };

});

