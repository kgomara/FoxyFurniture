/*global document, window: false */

window.addEventListener('load', function () {
	initVideoPlayer();
});

function initVideoPlayer() {
	const video 	= document.getElementById('movie');
	const playBtn = document.getElementById('play-pause');

	if (!video || !playBtn) {
		return;
	}

	const icon = playBtn.querySelector('img');
	function togglePlayback() {
		if (video.paused) {
			video.play()?.catch(function () {});
		} else {
			video.pause();
		}
	}

	function updateButton(playing) {
		playBtn.classList.toggle('is-playing', playing);
		playBtn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
		if (icon) icon.src = playing ? './img/icons/pause.svg' : './img/icons/play.svg';
	}

	video.addEventListener('click', togglePlayback);
	playBtn.addEventListener('click', togglePlayback);
	video.addEventListener('play', function () { updateButton(true); });
	video.addEventListener('pause', function () {
		if (video.currentTime < video.duration) {
			updateButton(false);
		}
	});
	video.addEventListener('ended', function () {
		video.pause();
		video.currentTime = 0;
		updateButton(false);
	});

	video.controls = false;
	playBtn.hidden = false;
}

if (typeof module !== 'undefined') {
	module.exports = {
		initVideoPlayer
	};
}
