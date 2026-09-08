const { initVideoPlayer } = require('../js/ff-videoplayer');

function arrangeVideoPlayer(playButtonClass) {
	document.body.innerHTML = `
		<video id="movie"></video>
		<button id="play-pause" class="${playButtonClass || ''}" type="button"></button>
	`;

	return {
		video: document.getElementById('movie'),
		playBtn: document.getElementById('play-pause')
	};
}

describe('initVideoPlayer', function () {
	it('does nothing when the page does not have a video player', function () {
		document.body.innerHTML = '<main></main>';

		expect(function () {
			initVideoPlayer();
		}).not.toThrow();
	});

	it('plays the video when the play button is clicked', function () {
		const { video } = arrangeVideoPlayer();

		video.play = vi.fn();

		initVideoPlayer();

		document.getElementById('play-pause').click();

		expect(video.play).toHaveBeenCalled();
	});

	it('plays the video when the video is clicked while paused', function () {
		const { video } = arrangeVideoPlayer();

		Object.defineProperty(video, 'paused', {
			value: true
		});
		video.play = vi.fn();

		initVideoPlayer();

		video.click();

		expect(video.play).toHaveBeenCalled();
	});

	it('pauses the video when the video is clicked during playback', function () {
		const { video } = arrangeVideoPlayer();

		Object.defineProperty(video, 'paused', {
			value: false
		});
		video.pause = vi.fn();

		initVideoPlayer();

		video.click();

		expect(video.pause).toHaveBeenCalled();
	});

	it('hides and shows the play button when video playback changes', function () {
		const { video, playBtn } = arrangeVideoPlayer();

		Object.defineProperty(video, 'duration', {
			value: 10
		});
		video.play = vi.fn();

		initVideoPlayer();

		video.dispatchEvent(new Event('play'));

		expect(playBtn.classList.contains('is-hidden')).toBe(true);

		video.currentTime = 4;
		video.dispatchEvent(new Event('pause'));

		expect(playBtn.classList.contains('is-hidden')).toBe(false);
	});

	it('resets the video and play button when playback ends', function () {
		const { video, playBtn } = arrangeVideoPlayer('is-hidden');

		video.pause				= vi.fn();
		video.currentTime	= 7;

		initVideoPlayer();

		video.dispatchEvent(new Event('ended'));

		expect(video.pause).toHaveBeenCalled();
		expect(video.currentTime).toBe(0);
		expect(playBtn.classList.contains('is-hidden')).toBe(false);
	});
});
