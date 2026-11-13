const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
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

	// Fake dependency test: the gallery only needs Bootstrap's modal shape, not real Bootstrap.
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

afterEach(function () {
	// Test isolation: each test gets clean page markup, fake dependencies, and global data.
	document.body.replaceChildren();
	delete global.bootstrap;
	delete window.ffGalleryItems;
});

describe('calculateScaledImageSize', function () {
	it('scales an image down to fit inside the maximum size', function () {
		// Pure-function test: simple inputs, simple output, no DOM setup needed.
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
		// Guard-clause test: impossible image dimensions should return a clear no-result value.
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

		// Idempotence test: existing author-provided markup should not be duplicated or replaced.
		renderGalleryItems(galleryList);

		const items = galleryList.querySelectorAll('li');

		expect(items).toHaveLength(1);
		expect(items[0].dataset.existing).toBe('true');
	});

	it('does not render gallery detail images when gallery data is unavailable', function () {
		window.ffGalleryItems = {};
		document.body.innerHTML = '<ul data-gallery="missing"></ul>';

		const galleryList = document.querySelector('[data-gallery]');

		// Data-availability guard: unknown gallery keys should leave the list empty.
		renderGalleryItems(galleryList);

		expect(galleryList.querySelectorAll('li')).toHaveLength(0);
	});
});

describe('initGallery', function () {
	it('enhances existing image links once without replacing their content', function () {
		const { show } = installFakeBootstrapModal();
		document.body.innerHTML = fs.readFileSync(path.join(root, 'gallery-home-dungeon.html'), 'utf8');
		const list = document.querySelector('[data-gallery]');
		const images = Array.from(list.querySelectorAll('img'));
		const link = list.querySelector('a');
		initGallery();
		initGallery();
		images[0].click();
		expect(Array.from(list.querySelectorAll('img'))).toEqual(images);
		expect(list.querySelector('a')).toBe(link);
		expect(list.querySelectorAll('img')).toHaveLength(4);
		expect(document.querySelectorAll('#ffGalleryModal')).toHaveLength(1);
		expect(show).toHaveBeenCalledOnce();
		expect(document.querySelector('#ffGalleryCounter').textContent).toBe('1 / 4');
	});

	it('returns focus to the opening image link when the modal closes', function () {
		installFakeBootstrapModal();
		const { thumbs } = arrangeCrissCrossGallery();
		thumbs[1].click();
		const modal = document.querySelector('#ffGalleryModal');
		modal.focus();
		modal.dispatchEvent(new Event('hidden.bs.modal'));
		expect(document.activeElement).toBe(thumbs[1].closest('a'));
		expect(modal.getAttribute('aria-label')).toBe('Image gallery');
	});

	it('leaves direct image links usable when Bootstrap is unavailable', function () {
		document.body.innerHTML = fs.readFileSync(path.join(root, 'gallery-home-dungeon.html'), 'utf8');
		initGallery();
		const link = document.querySelector('[data-gallery] a');
		const event = new Event('click', {bubbles: true, cancelable: true});
		link.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(false);
		expect(link.getAttribute('href')).toBe('img/gallery/hd/DCP_1948.jpg');
		expect(link.getAttribute('role')).toBeNull();
		expect(document.querySelector('#ffGalleryModal')).toBeNull();
	});

	it('preserves modified-click behavior for opening the original image separately', function () {
		const { show } = installFakeBootstrapModal();
		const { thumbs } = arrangeCrissCrossGallery();
		const event = new Event('click', {bubbles: true, cancelable: true});
		event.ctrlKey = true;
		thumbs[0].dispatchEvent(event);
		expect(event.defaultPrevented).toBe(false);
		expect(show).not.toHaveBeenCalled();
	});
	it('does nothing when the page does not have a gallery list', function () {
		document.body.innerHTML = '<main></main>';

		// Guard-clause test: shared scripts should be safe on pages that do not use this feature.
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
		expect(thumbs[0].closest('a').getAttribute('role')).toBe('button');
		expect(thumbs[0].closest('a').tabIndex).toBe(0);

		thumbs[0].click();

		const modal = document.getElementById('ffGalleryModal');

		// Integration-style DOM test: one click wires together rendering, modal state, and Bootstrap.
		expect(modal).not.toBeNull();
		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/first.jpg');
		expect(document.getElementById('ffGalleryImage').getAttribute('alt')).toBe('First Criss Cross');
		expect(document.getElementById('ffGalleryPrev').disabled).toBe(true);
		expect(document.getElementById('ffGalleryNext').disabled).toBe(false);
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('1 / 2');
		expect(getOrCreateInstance).toHaveBeenCalledWith(modal);
		expect(show).toHaveBeenCalled();
	});

	it('opens a focused thumbnail when Enter is pressed', function () {
		const { show }		= installFakeBootstrapModal();
		const { thumbs }	= arrangeCrissCrossGallery();
		const enterEvent	= new KeyboardEvent('keydown', {
			key: 'Enter'
		});

		// Keyboard-accessibility test: focused thumbnails should open without a mouse.
		thumbs[1].closest('a').dispatchEvent(enterEvent);

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/second.jpg');
		expect(document.getElementById('ffGalleryPrev').disabled).toBe(false);
		expect(document.getElementById('ffGalleryNext').disabled).toBe(true);
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('2 / 2');
		expect(show).toHaveBeenCalled();
	});

	it('opens a focused thumbnail when Space is pressed', function () {
		const { show }		= installFakeBootstrapModal();
		const { thumbs }	= arrangeCrissCrossGallery();
		const spaceEvent	= new KeyboardEvent('keydown', {
			key:				' ',
			cancelable:	true
		});

		// Default-action test: Space opens the modal and prevents the browser's normal page scroll.
		thumbs[1].closest('a').dispatchEvent(spaceEvent);

		expect(spaceEvent.defaultPrevented).toBe(true);
		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/second.jpg');
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('2 / 2');
		expect(show).toHaveBeenCalled();
	});

	it('does not open a focused thumbnail when another key is pressed', function () {
		const { show }		= installFakeBootstrapModal();
		const { thumbs }	= arrangeCrissCrossGallery();

		// Negative event test: keys we do not handle should not open the modal.
		thumbs[1].closest('a').dispatchEvent(new KeyboardEvent('keydown', {
			key: 'Escape'
		}));

		expect(document.getElementById('ffGalleryModal')).toBeNull();
		expect(show).not.toHaveBeenCalled();
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
	});

	it('moves between modal images with arrow keys', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		document.querySelector('[data-gallery] img').click();

		const modal = document.getElementById('ffGalleryModal');

		// Event-driven test: dispatch the same key events the modal listens for.
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
	});

	it('moves to the next modal image after a left swipe', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		document.querySelector('[data-gallery] img').click();

		const modal				= document.getElementById('ffGalleryModal');
		const touchStart	= createTouchEvent('touchstart', 200, 100);
		const touchEnd		= createTouchEvent('touchend', 100, 110);

		// Gesture test: simulate only the touch data the swipe logic actually reads.
		modal.dispatchEvent(touchStart);
		modal.dispatchEvent(touchEnd);

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/second.jpg');
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('2 / 2');
	});

	it('moves to the previous modal image after a right swipe', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		document.querySelectorAll('[data-gallery] img')[1].click();

		const modal				= document.getElementById('ffGalleryModal');
		const touchStart	= createTouchEvent('touchstart', 100, 100);
		const touchEnd		= createTouchEvent('touchend', 200, 110);

		// Gesture test: the sign of deltaX determines whether the gallery moves forward or back.
		modal.dispatchEvent(touchStart);
		modal.dispatchEvent(touchEnd);

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/first.jpg');
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('1 / 2');
	});

	it('stays on the current modal image after a short swipe', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		document.querySelector('[data-gallery] img').click();

		const modal				= document.getElementById('ffGalleryModal');
		const touchStart	= createTouchEvent('touchstart', 200, 100);
		const touchEnd		= createTouchEvent('touchend', 160, 100);

		// Gesture guard test: short movement should not count as intentional image navigation.
		modal.dispatchEvent(touchStart);
		modal.dispatchEvent(touchEnd);

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/first.jpg');
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('1 / 2');
	});

	it('stays on the current modal image after a mostly vertical swipe', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		document.querySelector('[data-gallery] img').click();

		const modal				= document.getElementById('ffGalleryModal');
		const touchStart	= createTouchEvent('touchstart', 200, 100);
		const touchEnd		= createTouchEvent('touchend', 120, 220);

		// Gesture guard test: mostly vertical movement should behave like page scroll, not image nav.
		modal.dispatchEvent(touchStart);
		modal.dispatchEvent(touchEnd);

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/first.jpg');
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('1 / 2');
	});

	it('stays on the first modal image when previous is requested at the beginning', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		// Boundary test: asking for an image before the first one should leave state unchanged.
		document.querySelector('[data-gallery] img').click();
		document.getElementById('ffGalleryPrev').click();

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/first.jpg');
		expect(document.getElementById('ffGalleryPrev').disabled).toBe(true);
		expect(document.getElementById('ffGalleryNext').disabled).toBe(false);
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('1 / 2');
	});

	it('stays on the last modal image when next is requested at the end', function () {
		installFakeBootstrapModal();
		arrangeCrissCrossGallery();

		// Boundary test: asking for an image after the last one should leave state unchanged.
		document.querySelectorAll('[data-gallery] img')[1].click();
		document.getElementById('ffGalleryNext').click();

		expect(document.getElementById('ffGalleryImage').getAttribute('src')).toBe('img/gallery/cc/second.jpg');
		expect(document.getElementById('ffGalleryPrev').disabled).toBe(false);
		expect(document.getElementById('ffGalleryNext').disabled).toBe(true);
		expect(document.getElementById('ffGalleryCounter').textContent).toBe('2 / 2');
	});
});

describe('gallery content published without JavaScript', function () {
	const context = {window: {}};
	vm.runInNewContext(fs.readFileSync(path.join(root, 'js/ff-gallery-data.js'), 'utf8'), context);
	const data = context.window.ffGalleryItems;
	const pages = ['gallery.html', 'gallery-home-dungeon.html', 'gallery-criss-cross.html', 'gallery-versahorse.html', 'gallery-pandoras-chest.html', 'gallery-powerpole.html'];

	it.each(pages)('%s contains its heading, existing images, and ordinary links', function (file) {
		const html = fs.readFileSync(path.join(root, file), 'utf8');
		const page = new DOMParser().parseFromString(html, 'text/html');
		expect(page.querySelectorAll('h1')).toHaveLength(1);
		expect(page.querySelector('h1').textContent).toContain('Gallery');
		expect(page.querySelector('script[src*="ff-gallery-data"]')).toBeNull();
		const list = page.querySelector('[data-gallery], [data-gallery-index]');
		const key = list.dataset.gallery || 'index';
		const images = Array.from(list.querySelectorAll('img'));
		const links = Array.from(list.querySelectorAll('a'));
		expect(images.map(function (img) { return {src: img.getAttribute('src'), alt: img.alt}; })).toEqual(data[key].map(function (item) { return {src: item.src, alt: item.alt}; }));
		expect(links.map(function (link) { return link.getAttribute('href'); })).toEqual(data[key].map(function (item) { return item.href || item.src; }));
		images.forEach(function (img) { expect(fs.existsSync(path.join(root, img.getAttribute('src')))).toBe(true); });
		if (key !== 'index') {
			expect(list.classList.contains('ff-gallery-grid')).toBe(true);
			images.forEach(function (img) { expect(img.getAttribute('loading')).toBe('lazy'); });
		} else {
			expect(Array.from(list.querySelectorAll('p'), function (p) { return p.textContent; })).toEqual(data.index.map(function (item) { return item.title; }));
		}
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

		// Idempotence test: an already-rendered index should not be rebuilt over existing content.
		initGalleryIndex();

		const existing			= document.querySelector('[data-existing="true"]');
		const galleryCards	= document.querySelectorAll('.ff-gallery-img');

		expect(existing).not.toBeNull();
		expect(galleryCards).toHaveLength(0);
	});

	it('does not render gallery index links when index data is unavailable', function () {
		window.ffGalleryItems = {};
		document.body.innerHTML = '<div data-gallery-index></div>';

		// Data-availability guard: the placeholder can exist even when index data is absent.
		initGalleryIndex();

		expect(document.querySelectorAll('.ff-gallery-img')).toHaveLength(0);
	});
});
