/*global $, jQuery, alert, document: false */

window.addEventListener('load', function() {
    const 	video 		= document.getElementById('movie');
    const 	seekBar 	= document.getElementById('seek-bar');
    const 	playBtn 	= document.querySelector('#play-pause');
	var 	icon 		= document.getElementById("icon");
//     const fullScreenBtn = document.querySelector('#full-screen');

    // Play/Pause toggle
    playBtn.onclick = () => {
        if (video.paused) {
            video.play();
			icon.classList.remove("glyphicon-play");
			icon.classList.add("glyphicon-pause");
        } else {
            video.pause();
			icon.classList.remove("glyphicon-pause");
			icon.classList.add("glyphicon-play");
        }
    };
    
    // Video ended
	video.addEventListener('ended', (event) => {
	  	console.log('The video has ended!');
	  	// Add your callback logic here (e.g., show a replay button)
		icon.classList.remove("glyphicon-pause");
		icon.classList.add("glyphicon-play");
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
        seekBar.value = percentage || 0;
    };

    // Seek video when slider is moved
    seekBar.oninput = () => {
        const time = video.duration * (seekBar.value / 100);
        video.currentTime = time;
    };

});


