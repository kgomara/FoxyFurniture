/*global document, window: false */

window.addEventListener('load', function () {
	const video 	= document.getElementById('movie');
	const playBtn = document.getElementById('play-pause');

	if (!video || !playBtn) {
		return;
	}

	function playVideo() {
		video.play();
	}

	function resetVideo() {
		video.currentTime = 0;
		playBtn.classList.remove('is-hidden');
	}

	video.addEventListener('click', function () {
		if (video.paused) {
			playVideo();
		} else {
			video.pause();
		}
	});

	playBtn.addEventListener('click', playVideo);

	video.addEventListener('play', function () {
		playBtn.classList.add('is-hidden');
	});

	video.addEventListener('pause', function () {
		if (video.currentTime < video.duration) {
			playBtn.classList.remove('is-hidden');
		}
	});

	video.addEventListener('ended', resetVideo);
});
