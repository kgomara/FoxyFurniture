const { createCarouselControl } = require('../js/ff-scripts');

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
