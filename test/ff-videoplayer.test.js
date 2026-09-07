const { initVideoPlayer } = require('../js/ff-videoplayer');

describe('initVideoPlayer', function () {
	it('plays the video when the play button is clicked', function () {
		document.body.innerHTML = `
			<video id="movie"></video>
			<button id="play-pause" type="button"></button>
		`;

		const video = document.getElementById('movie');

		video.play = vi.fn();

		initVideoPlayer();

		document.getElementById('play-pause').click();

		expect(video.play).toHaveBeenCalled();
	});

	it('hides and shows the play button when video playback changes', function () {
		document.body.innerHTML = `
			<video id="movie"></video>
			<button id="play-pause" type="button"></button>
		`;

		const video		= document.getElementById('movie');
		const playBtn	= document.getElementById('play-pause');

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
		document.body.innerHTML = `
			<video id="movie"></video>
			<button id="play-pause" class="is-hidden" type="button"></button>
		`;

		const video		= document.getElementById('movie');
		const playBtn	= document.getElementById('play-pause');

		video.pause				= vi.fn();
		video.currentTime	= 7;

		initVideoPlayer();

		video.dispatchEvent(new Event('ended'));

		expect(video.pause).toHaveBeenCalled();
		expect(video.currentTime).toBe(0);
		expect(playBtn.classList.contains('is-hidden')).toBe(false);
	});
});
