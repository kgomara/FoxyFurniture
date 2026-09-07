const {
	calculateScaledImageSize,
	initGalleryIndex,
	renderGalleryItems
} = require('../js/ff-gallery');

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

describe('renderGalleryItems', function () {
	it('renders gallery detail images from gallery data', function () {
		window.ffGalleryItems = {
			crissCross: [
				{
					src: 'img/gallery/cc/first.jpg',
					alt: 'First Criss Cross'
				},
				{
					src: 'img/gallery/cc/second.jpg',
					alt: 'Second Criss Cross'
				}
			]
		};
		document.body.innerHTML = '<ul data-gallery="crissCross"></ul>';

		const galleryList = document.querySelector('[data-gallery]');

		renderGalleryItems(galleryList);

		const items = galleryList.querySelectorAll('li');
		const images = galleryList.querySelectorAll('img');

		expect(items).toHaveLength(2);
		expect(images[0].getAttribute('src')).toBe('img/gallery/cc/first.jpg');
		expect(images[0].getAttribute('alt')).toBe('First Criss Cross');
		expect(images[1].getAttribute('src')).toBe('img/gallery/cc/second.jpg');
		expect(images[1].getAttribute('alt')).toBe('Second Criss Cross');
	});

	it('does not replace gallery detail images that already exist', function () {
		window.ffGalleryItems = {
			crissCross: [
				{
					src: 'img/gallery/cc/first.jpg',
					alt: 'First Criss Cross'
				}
			]
		};
		document.body.innerHTML = `
			<ul data-gallery="crissCross">
				<li data-existing="true"></li>
			</ul>
		`;

		const galleryList = document.querySelector('[data-gallery]');

		renderGalleryItems(galleryList);

		const items = galleryList.querySelectorAll('li');

		expect(items).toHaveLength(1);
		expect(items[0].dataset.existing).toBe('true');
	});
});

describe('initGalleryIndex', function () {
	it('renders gallery index links from gallery data', function () {
		window.ffGalleryItems = {
			index: [
				{
					href:		'gallery-home-dungeon.html',
					src:		'img/gallery/hd-button.jpg',
					alt:		'Home Dungeon',
					title:	'Home Dungeon'
				},
				{
					href:		'gallery-criss-cross.html',
					src:		'img/gallery/cc-button.jpg',
					alt:		'Black Criss Cross',
					title:	'Criss Cross'
				}
			]
		};
		document.body.innerHTML = '<div data-gallery-index></div>';

		initGalleryIndex();

		const galleryCards	= document.querySelectorAll('.ff-gallery-img');
		const links					= document.querySelectorAll('[data-gallery-index] a');
		const images				= document.querySelectorAll('[data-gallery-index] img');
		const titles				= document.querySelectorAll('[data-gallery-index] p');

		expect(galleryCards).toHaveLength(2);
		expect(links[0].getAttribute('href')).toBe('gallery-home-dungeon.html');
		expect(images[0].getAttribute('src')).toBe('img/gallery/hd-button.jpg');
		expect(images[0].getAttribute('alt')).toBe('Home Dungeon');
		expect(images[0].className).toBe('img-fluid col-12');
		expect(titles[0].className).toBe('text-center');
		expect(titles[0].textContent).toBe('Home Dungeon');
		expect(links[1].getAttribute('href')).toBe('gallery-criss-cross.html');
		expect(titles[1].textContent).toBe('Criss Cross');
	});

	it('does not replace gallery index content that already exists', function () {
		window.ffGalleryItems = {
			index: [
				{
					href:		'gallery-home-dungeon.html',
					src:		'img/gallery/hd-button.jpg',
					alt:		'Home Dungeon',
					title:	'Home Dungeon'
				}
			]
		};
		document.body.innerHTML = `
			<div data-gallery-index>
				<div data-existing="true"></div>
			</div>
		`;

		initGalleryIndex();

		const existing			= document.querySelector('[data-existing="true"]');
		const galleryCards	= document.querySelectorAll('.ff-gallery-img');

		expect(existing).not.toBeNull();
		expect(galleryCards).toHaveLength(0);
	});
});
