const { calculateScaledImageSize } = require('../js/ff-gallery');

describe('calculateScaledImageSize', function () {
	it('scales an image down to fit inside the maximum size', function () {
		const scaledSize = calculateScaledImageSize(1000, 500, 500, 400);

		expect(scaledSize).toEqual({
			width:	500,
			height: 250
		});
	});

	it('uses the limiting dimension when height is the tighter fit', function () {
		const scaledSize = calculateScaledImageSize(1000, 500, 900, 200);

		expect(scaledSize).toEqual({
			width: 	400,
			height: 200
		});
	});

	it('returns null when the natural image size is not available', function () {
		const scaledSize = calculateScaledImageSize(0, 500, 900, 200);

		expect(scaledSize).toBeNull();
	});
});
