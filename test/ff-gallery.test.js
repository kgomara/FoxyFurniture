const {
	calculateScaledImageSize,
	initGallery,
	initGalleryIndex,
	renderGalleryItems
} = require('../js/ff-gallery');

function installFakeBootstrapModal() {
	const show = vi.fn();
	const getOrCreateInstance = vi.fn(function () {
		return {
			show
		};
	});

	global.bootstrap = {
		Modal: {
			getOrCreateInstance
		}
	};

	return {
		getOrCreateInstance,
		show
	};
}

function arrangeCrissCrossGallery() {
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

	initGallery();

	return {
		galleryList: document.querySelector('[data-gallery]'),
		thumbs:			 document.querySelectorAll('[data-gallery] img')
	};
}

function createTouchEvent(type, clientX, clientY) {
	const event = new Event(type);

	event.changedTouches = [
		{
			clientX,
			clientY
		}
	];

	return event;
}

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

	it('does not render gallery detail images when gallery data is unavailable', function () {
		window.ffGalleryItems = {};
		document.body.innerHTML = '<ul data-gallery="missing"></ul>';

		const galleryList = document.querySelector('[data-gallery]');

		renderGalleryItems(galleryList);

		expect(galleryList.querySelectorAll('li')).toHaveLength(0);
	});
});

describe('initGallery', function () {
	it('does nothing when the page does not have a gallery list', function () {
		document.body.innerHTML = '<main></main>';

		expect(function () {
			initGallery();
		}).not.toThrow();
	});

	it('prepares gallery thumbnails and opens the clicked image in a modal', function () {
		const { getOrCreateInstance, show }	= installFakeBootstrapModal();
		const { galleryList, thumbs }				= arrangeCrissCrossGallery();

		expect(galleryList.classList.contains('ff-gallery-grid')).toBe(true);
		expect(thumbs).toHaveLength(2);
		expect(thumbs[0].classList.contains('ff-gallery-thumb')).toBe(true);
		expect(thumbs[0].loading).toBe('lazy');
		expect(thumbs[0].decoding).toBe('async');
		expect(thumbs[0].getAttribute('role')).toBe('button');
		expect(thumbs[0].tabIndex).toBe(0);

		thumbs[0].click();

		const modal = document.getElementById('ffGalleryModal');

		expect(modal).not.toBeNull();
		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/first.jpg');
		expect(document.getElementById('ffGalleryImage').getAttribute('alt')).toBe('First Criss Cross');
		expect(document.getElementById('ffGalleryPrev').disabled).toBe(true);
		expect(document.getElementById('ffGalleryNext').disabled).toBe(false);
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('1 / 2');
		expect(getOrCreateInstance).toHaveBeenCalledWith(modal);
		expect(show).toHaveBeenCalled();

		delete global.bootstrap;
	});

	it('opens a focused thumbnail when Enter is pressed', function () {
		const { show }		= installFakeBootstrapModal();
		const { thumbs }	= arrangeCrissCrossGallery();
		const enterEvent	= new KeyboardEvent('keydown', {
			key: 'Enter'
		});

		thumbs[1].dispatchEvent(enterEvent);

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/second.jpg');
		expect(document.getElementById('ffGalleryPrev').disabled).toBe(false);
		expect(document.getElementById('ffGalleryNext').disabled).toBe(true);
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('2 / 2');
		expect(show).toHaveBeenCalled();

		delete global.bootstrap;
	});

	it('moves to the next image from the modal next button', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		document.querySelector('[data-gallery] img').click();
		document.getElementById('ffGalleryNext').click();

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/second.jpg');
		expect(document.getElementById('ffGalleryImage').getAttribute('alt')).toBe('Second Criss Cross');
		expect(document.getElementById('ffGalleryPrev').disabled).toBe(false);
		expect(document.getElementById('ffGalleryNext').disabled).toBe(true);
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('2 / 2');

		delete global.bootstrap;
	});

	it('moves between modal images with arrow keys', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		document.querySelector('[data-gallery] img').click();

		const modal = document.getElementById('ffGalleryModal');

		modal.dispatchEvent(new KeyboardEvent('keydown', {
			key: 'ArrowRight'
		}));

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/second.jpg');
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('2 / 2');

		modal.dispatchEvent(new KeyboardEvent('keydown', {
			key: 'ArrowLeft'
		}));

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/first.jpg');
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('1 / 2');

		delete global.bootstrap;
	});

	it('moves to the next modal image after a left swipe', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		document.querySelector('[data-gallery] img').click();

		const modal				= document.getElementById('ffGalleryModal');
		const touchStart	= createTouchEvent('touchstart', 200, 100);
		const touchEnd		= createTouchEvent('touchend', 100, 110);

		modal.dispatchEvent(touchStart);
		modal.dispatchEvent(touchEnd);

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/second.jpg');
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('2 / 2');

		delete global.bootstrap;
	});

	it('stays on the current modal image after a mostly vertical swipe', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		document.querySelector('[data-gallery] img').click();

		const modal				= document.getElementById('ffGalleryModal');
		const touchStart	= createTouchEvent('touchstart', 200, 100);
		const touchEnd		= createTouchEvent('touchend', 120, 220);

		modal.dispatchEvent(touchStart);
		modal.dispatchEvent(touchEnd);

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/first.jpg');
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('1 / 2');

		delete global.bootstrap;
	});

	it('stays on the first modal image when previous is requested at the beginning', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		document.querySelector('[data-gallery] img').click();
		document.getElementById('ffGalleryPrev').click();

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/first.jpg');
		expect(document.getElementById('ffGalleryPrev').disabled).toBe(true);
		expect(document.getElementById('ffGalleryNext').disabled).toBe(false);
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('1 / 2');

		delete global.bootstrap;
	});

	it('stays on the last modal image when next is requested at the end', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		document.querySelectorAll('[data-gallery] img')[1].click();
		document.getElementById('ffGalleryNext').click();

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/second.jpg');
		expect(document.getElementById('ffGalleryPrev').disabled).toBe(false);
		expect(document.getElementById('ffGalleryNext').disabled).toBe(true);
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('2 / 2');

		delete global.bootstrap;
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

	it('does not render gallery index links when index data is unavailable', function () {
		window.ffGalleryItems = {};
		document.body.innerHTML = '<div data-gallery-index></div>';

		initGalleryIndex();

		expect(document.querySelectorAll('.ff-gallery-img')).toHaveLength(0);
	});
});
