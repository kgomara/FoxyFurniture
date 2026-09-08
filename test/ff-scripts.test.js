const {
	SHARED_LAYOUT_VERSION,
	createCarouselControl,
	initCarousels,
	initCarouselControls,
	initDownloadPlans,
	initCarouselIndicators,
	initSharedLayout,
	renderCarouselSlides
} = require('../js/ff-scripts');

function installFakeBootstrapCarousel() {
	const getOrCreateInstance = vi.fn();

	global.bootstrap = {
		Carousel: {
			getOrCreateInstance
		}
	};

	return getOrCreateInstance;
}

function arrangeHomeCarouselData() {
	window.ffProductCarousels = {
		home: [
			{
				src:			'img/home/first.jpg',
				alt:			'First slide',
				caption:	'First caption'
			},
			{
				src:			'img/home/second.jpg',
				alt:			'Second slide',
				caption:	'Second caption',
				imgClass:	'd-block mx-auto',
				captionClass:	'carousel-caption-darker-color'
			}
		]
	};
}

function arrangeCarousel(html) {
	document.body.innerHTML = html;

	return document.getElementById('carousel-hm') || document.querySelector('.carousel');
}

function arrangeDownloadPlans(productKey) {
	document.body.innerHTML = '<div class="ff-download-plans" data-download-plans="' + productKey + '"></div>';

	initDownloadPlans();

	return document.querySelector('.ff-download-plans');
}

function installSuccessfulSharedLayoutFetch() {
	global.fetch = vi.fn(function (href) {
		return Promise.resolve({
			ok: true,
			text: function () {
				if (href.includes('header')) {
					return Promise.resolve('<header>Header content</header>');
				}

				return Promise.resolve('<footer>Footer content</footer>');
			}
		});
	});
}

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

describe('initCarousels', function () {
	it('renders and initializes each carousel on the page', function () {
		const getOrCreateInstance = installFakeBootstrapCarousel();

		arrangeHomeCarouselData();
		const carousel = arrangeCarousel(`
			<div id="carousel-hm" class="carousel" data-product-carousel="home">
				<div class="carousel-indicators"></div>
				<div class="carousel-inner"></div>
				<div data-carousel-controls></div>
			</div>
		`);

		initCarousels();

		expect(carousel.querySelectorAll('.carousel-item')).toHaveLength(2);
		expect(carousel.querySelectorAll('.carousel-indicators button')).toHaveLength(2);
		expect(carousel.querySelectorAll('[data-carousel-controls] button')).toHaveLength(2);
		expect(getOrCreateInstance).toHaveBeenCalledWith(carousel, {
			interval: false,
			touch: true
		});

		delete global.bootstrap;
	});
});

describe('initSharedLayout', function () {
	it('loads shared header and footer HTML into page placeholders', async function () {
		installSuccessfulSharedLayoutFetch();
		document.body.innerHTML = `
			<div id="header"></div>
			<div id="footer"></div>
		`;

		await initSharedLayout();

		expect(document.querySelector('#header header').textContent).toBe('Header content');
		expect(document.querySelector('#footer footer').textContent).toBe('Footer content');
		expect(fetch).toHaveBeenCalledWith('js/shared/header.html?v=' + SHARED_LAYOUT_VERSION);
		expect(fetch).toHaveBeenCalledWith('js/shared/footer.html?v=' + SHARED_LAYOUT_VERSION);

		delete global.fetch;
	});

	it('reports a failed shared layout fetch', async function () {
		global.fetch = vi.fn(function () {
			return Promise.resolve({
				ok: false
			});
		});
		document.body.innerHTML = '<div id="header"></div>';

		await expect(initSharedLayout()).rejects.toThrow('Unable to load js/shared/header.html?v=' + SHARED_LAYOUT_VERSION);

		delete global.fetch;
	});

	it('skips shared layout sections that are not on the page', async function () {
		installSuccessfulSharedLayoutFetch();
		document.body.innerHTML = '<div id="header"></div>';

		await initSharedLayout();

		expect(document.querySelector('#header header').textContent).toBe('Header content');
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith('js/shared/header.html?v=' + SHARED_LAYOUT_VERSION);

		delete global.fetch;
	});
});

describe('initCarouselIndicators', function () {
	it('creates one indicator button for each carousel slide', function () {
		const carousel = arrangeCarousel(`
			<div id="carousel-hm" class="carousel">
				<div class="carousel-indicators"></div>
				<div class="carousel-item active"></div>
				<div class="carousel-item"></div>
				<div class="carousel-item"></div>
			</div>
		`);

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
		const carousel = arrangeCarousel(`
			<div id="carousel-hm" class="carousel">
				<div class="carousel-indicators">
					<button type="button" data-existing="true"></button>
				</div>
				<div class="carousel-item active"></div>
			</div>
		`);

		initCarouselIndicators(carousel);

		const indicators = carousel.querySelectorAll('.carousel-indicators button');

		expect(indicators).toHaveLength(1);
		expect(indicators[0].dataset.existing).toBe('true');
	});
});

describe('initCarouselControls', function () {
	it('adds previous and next controls to a carousel', function () {
		const carousel = arrangeCarousel(`
			<div id="carousel-hm" class="carousel">
				<div data-carousel-controls></div>
			</div>
		`);

		initCarouselControls(carousel);

		const controls = carousel.querySelectorAll('[data-carousel-controls] button');

		expect(controls).toHaveLength(2);
		expect(controls[0].className).toBe('carousel-control-prev');
		expect(controls[0].dataset.bsTarget).toBe('#carousel-hm');
		expect(controls[0].dataset.bsSlide).toBe('prev');
		expect(controls[0].textContent).toBe('Previous');
		expect(controls[1].className).toBe('carousel-control-next');
		expect(controls[1].dataset.bsTarget).toBe('#carousel-hm');
		expect(controls[1].dataset.bsSlide).toBe('next');
		expect(controls[1].textContent).toBe('Next');
	});

	it('does not replace controls that already exist', function () {
		const carousel = arrangeCarousel(`
			<div id="carousel-hm" class="carousel">
				<div data-carousel-controls>
					<button type="button" data-existing="true"></button>
				</div>
			</div>
		`);

		initCarouselControls(carousel);

		const controls = carousel.querySelectorAll('[data-carousel-controls] button');

		expect(controls).toHaveLength(1);
		expect(controls[0].dataset.existing).toBe('true');
	});
});

describe('renderCarouselSlides', function () {
	it('renders carousel slides from product carousel data', function () {
		arrangeHomeCarouselData();
		const carousel = arrangeCarousel(`
			<div class="carousel" data-product-carousel="home">
				<div class="carousel-inner"></div>
			</div>
		`);

		renderCarouselSlides(carousel);

		const slides		= carousel.querySelectorAll('.carousel-item');
		const images		= carousel.querySelectorAll('.carousel-item img');
		const captions	= carousel.querySelectorAll('.carousel-caption p');

		expect(slides).toHaveLength(2);
		expect(slides[0].className).toBe('carousel-item active');
		expect(slides[1].className).toBe('carousel-item');
		expect(images[0].getAttribute('src')).toBe('img/home/first.jpg');
		expect(images[0].getAttribute('alt')).toBe('First slide');
		expect(images[1].className).toBe('d-block mx-auto');
		expect(captions[0].textContent).toBe('First caption');
		expect(captions[1].parentElement.className).toBe('carousel-caption carousel-caption-darker-color');
		expect(captions[1].textContent).toBe('Second caption');
	});

	it('does not replace slides that already exist', function () {
		window.ffProductCarousels = {
			home: [
				{
					src: 'img/home/first.jpg',
					alt: 'First slide',
					caption: 'First caption'
				}
			]
		};
		const carousel = arrangeCarousel(`
			<div class="carousel" data-product-carousel="home">
				<div class="carousel-inner">
					<div class="carousel-item" data-existing="true"></div>
				</div>
			</div>
		`);

		renderCarouselSlides(carousel);

		const slides = carousel.querySelectorAll('.carousel-item');

		expect(slides).toHaveLength(1);
		expect(slides[0].dataset.existing).toBe('true');
	});
});

describe('initDownloadPlans', function () {
	it('renders download buttons and a buy link for products that can be purchased', function () {
		const container			= arrangeDownloadPlans('crissCross');
		const links					= container.querySelectorAll('a');
		const downloadFrame	= document.querySelector('iframe[name="ffDownloadFrame"]');

		expect(container.querySelector('h4').textContent).toBe('Download Free Plans!');
		expect(links).toHaveLength(3);
		expect(links[0].getAttribute('href')).toBe('plans/criss-cross-dwgs.zip');
		expect(links[0].textContent).toBe('Drawings');
		expect(links[1].getAttribute('href')).toBe('plans/criss-cross-pdfs.zip');
		expect(links[1].textContent).toBe('PDFs');
		expect(links[2].getAttribute('href')).toBe('https://fetishfurniture.org/');
		expect(links[2].getAttribute('target')).toBe('_blank');
		expect(downloadFrame.hidden).toBe(true);
	});

	it('does not render a buy link for products without a purchase URL', function () {
		const container	= arrangeDownloadPlans('pandorasChest');
		const links			= container.querySelectorAll('a');

		expect(links).toHaveLength(2);
		expect(links[0].getAttribute('href')).toBe('plans/pandoras-chest-dwgs.zip');
		expect(links[1].getAttribute('href')).toBe('plans/pandoras-chest-pdfs.zip');
		expect(container.textContent).not.toContain("If you'd rather buy...");
	});

	it('tracks download clicks when analytics is available', function () {
		const events = [];

		window.sa_event = function (eventName, eventData) {
			events.push({
				eventName,
				eventData
			});
		};
		arrangeDownloadPlans('powerPole');

		document.querySelector('a[href="plans/power-pole-pdfs.zip"]').click();

		expect(events).toEqual([
			{
				eventName: 'download_pp_pdfs',
				eventData: {
					filename: 'power-pole-pdfs.zip'
				}
			}
		]);

		delete window.sa_event;
	});
});
