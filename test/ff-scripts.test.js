const {
	createCarouselControl,
	initCarouselIndicators
} = require('../js/ff-scripts');

describe('createCarouselControl', function () {
	it('creates a Bootstrap carousel control button', function () {
		const control = createCarouselControl('carousel-hm', 'next', 'Next');

		expect(control.tagName).toBe('BUTTON');
		expect(control.type).toBe('button');
		expect(control.className).toBe('carousel-control-next');
		expect(control.dataset.bsTarget).toBe('#carousel-hm');
		expect(control.dataset.bsSlide).toBe('next');
		expect(control.children).toHaveLength(2);
	});
});

describe('initCarouselIndicators', function () {
	it('creates one indicator button for each carousel slide', function () {
		document.body.innerHTML = `
			<div id="carousel-hm" class="carousel">
				<div class="carousel-indicators"></div>
				<div class="carousel-item active"></div>
				<div class="carousel-item"></div>
				<div class="carousel-item"></div>
			</div>
		`;

		const carousel = document.getElementById('carousel-hm');

		initCarouselIndicators(carousel);

		const indicators = carousel.querySelectorAll('.carousel-indicators button');

		expect(indicators).toHaveLength(3);
		expect(indicators[0].className).toBe('active');
		expect(indicators[0].dataset.bsTarget).toBe('#carousel-hm');
		expect(indicators[0].dataset.bsSlideTo).toBe('0');
		expect(indicators[0].getAttribute('aria-current')).toBe('true');
		expect(indicators[0].getAttribute('aria-label')).toBe('Slide 1');
		expect(indicators[2].dataset.bsSlideTo).toBe('2');
		expect(indicators[2].getAttribute('aria-label')).toBe('Slide 3');
	});

	it('does not replace indicators that already exist', function () {
		document.body.innerHTML = `
			<div id="carousel-hm" class="carousel">
				<div class="carousel-indicators">
					<button type="button" data-existing="true"></button>
				</div>
				<div class="carousel-item active"></div>
			</div>
		`;

		const carousel = document.getElementById('carousel-hm');

		initCarouselIndicators(carousel);

		const indicators = carousel.querySelectorAll('.carousel-indicators button');

		expect(indicators).toHaveLength(1);
		expect(indicators[0].dataset.existing).toBe('true');
	});
});
