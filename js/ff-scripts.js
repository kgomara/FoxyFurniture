/*global bootstrap, document, window: false */

const SHARED_LAYOUT_VERSION = 'v3.3.2a2';

window.addEventListener('load', function() {
	initSharedLayout().catch(function (error) { console.error(error); });
	initDownloadPlans();
	initCarousels();
});

async function initSharedLayout() {
	const mainHeader 	= document.querySelector('#header');
	const mainFooter 	= document.querySelector('#footer');

	const injectSharedHtml = async function (container, href) {
		if (!container || container.children.length) {
			return;
		}

		const response = await fetch(href);

		if (!response.ok) {
			throw new Error('Unable to load ' + href);
		}

		container.innerHTML = await response.text();

		container.querySelectorAll('script').forEach(function (script) {
			const executableScript = document.createElement('script');

			Array.from(script.attributes).forEach(function (attribute) {
				executableScript.setAttribute(attribute.name, attribute.value);
			});

			executableScript.textContent = script.textContent;
			script.replaceWith(executableScript);
		});
	};

	await Promise.all([
		injectSharedHtml(mainHeader, 'js/shared/header.html?v=' + SHARED_LAYOUT_VERSION),
		injectSharedHtml(mainFooter, 'js/shared/footer.html?v=' + SHARED_LAYOUT_VERSION)
	]);
}

function initCarousels() {
	document.querySelectorAll('.carousel').forEach(function (carousel) {
		renderCarouselSlides(carousel);
		initCarouselIndicators(carousel);
		initCarouselControls(carousel);

		/*
			Work-around for a bug in the Bootstrap 5 carousel. Controls are "lazy loaded", hence swipe gestures don't initially work.
			This code initializes the carousel instance(s) during the page load process.
		*/
		bootstrap.Carousel.getOrCreateInstance(carousel, {
			interval: false,
			touch: true
		});
	});
}

function renderCarouselSlides(carousel) {
	const carouselKey			= carousel.dataset.productCarousel;
	const carouselSlides	= carouselKey && window.ffProductCarousels ? window.ffProductCarousels[carouselKey] : null;
	const inner						= carousel.querySelector('.carousel-inner');

	if (!inner || !carouselSlides || inner.children.length) {
		return;
	}

	inner.replaceChildren(...carouselSlides.map(function (carouselSlide, index) {
		const item				= document.createElement('div');
		const img					= document.createElement('img');
		const caption			= document.createElement('div');
		const captionText	= document.createElement('p');

		item.className = index === 0 ? 'carousel-item active' : 'carousel-item';
		img.src = carouselSlide.src;
		img.alt = carouselSlide.alt;
		if (carouselSlide.imgClass) {
			img.className = carouselSlide.imgClass;
		}
		caption.className = carouselSlide.captionClass ? 'carousel-caption ' + carouselSlide.captionClass : 'carousel-caption';
		captionText.textContent = carouselSlide.caption;

		caption.appendChild(captionText);
		item.append(img, caption);

		return item;
	}));
}

function initCarouselIndicators(carousel) {
	const indicators = carousel.querySelector('.carousel-indicators');
	const slides = Array.from(carousel.querySelectorAll('.carousel-item'));

	if (!indicators || indicators.children.length || !slides.length || !carousel.id) {
		return;
	}

	indicators.replaceChildren(...slides.map(function (_slide, index) {
		const indicator = document.createElement('button');

		indicator.type							= 'button';
		indicator.dataset.bsTarget	= '#' + carousel.id;
		indicator.dataset.bsSlideTo	= index.toString();
		indicator.setAttribute('aria-label', 'Slide ' + (index + 1));

		if (index === 0) {
			indicator.className = 'active';
			indicator.setAttribute('aria-current', 'true');
		}

		return indicator;
	}));
}

function initCarouselControls(carousel) {
	const controls = carousel.querySelector('[data-carousel-controls]');

	if (!controls || controls.children.length || !carousel.id) {
		return;
	}

	controls.append(
		createCarouselControl(carousel.id, 'prev', 'Previous'),
		createCarouselControl(carousel.id, 'next', 'Next')
	);
}

function createCarouselControl(carouselId, direction, label) {
	const control	= document.createElement('button');
	const icon		= document.createElement('span');
	const text		= document.createElement('span');

	control.className					= 'carousel-control-' + direction;
	control.type							= 'button';
	control.dataset.bsTarget	= '#' + carouselId;
	control.dataset.bsSlide		= direction;

	icon.className = 'carousel-control-' + direction + '-icon';
	icon.setAttribute('aria-hidden', 'true');

	text.className		= 'visually-hidden';
	text.textContent	= label;

	control.append(icon, text);

	return control;
}

if (typeof module !== 'undefined') {
	module.exports = {
		SHARED_LAYOUT_VERSION,
		createCarouselControl,
		initCarousels,
		initCarouselControls,
		initDownloadPlans,
		initCarouselIndicators,
		initSharedLayout,
		renderCarouselSlides
	};
}

function initDownloadPlans() {
	document.querySelectorAll('[data-download-event]').forEach(function (link) {
		if (link.dataset.downloadInitialized) return;
		link.dataset.downloadInitialized = 'true';
		link.addEventListener('click', function () {
			if (typeof window.sa_event === 'function') {
				window.sa_event(link.dataset.downloadEvent, {
					filename: link.getAttribute('href').split('/').pop()
				});
			}
		});
	});

	if (document.querySelector('a[target="ffDownloadFrame"]') && !document.querySelector('iframe[name="ffDownloadFrame"]')) {
		const downloadFrame = document.createElement('iframe');
		downloadFrame.name = 'ffDownloadFrame';
		downloadFrame.title = 'Download';
		downloadFrame.hidden = true;
		document.body.appendChild(downloadFrame);
	}
}

// Native details/summary works without JavaScript. Add the familiar dropdown
// keyboard shortcuts and outside-click dismissal when JavaScript is available.
// Back/Forward can restore the whole page, including an open details element.
window.addEventListener('pageshow', function () {
	document.querySelectorAll('[data-site-menu][open]').forEach(function (menu) {
		menu.open = false;
	});
});

document.addEventListener('click', function (event) {
	const link = event.target.closest && event.target.closest('a[href]');
	document.querySelectorAll('[data-site-menu][open]').forEach(function (menu) {
		if (!menu.contains(event.target) || (link && menu.contains(link))) menu.open = false;
	});
});

document.addEventListener('keydown', function (event) {
	const menu = event.target.closest && event.target.closest('[data-site-menu]');
	if (!menu) return;
	const summary = menu.querySelector('summary');
	if (event.key === 'Escape' && menu.open) {
		event.preventDefault();
		menu.open = false;
		summary.focus();
		return;
	}
	if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
	if (event.target !== summary && !event.target.closest('.dropdown-item')) return;
	event.preventDefault();
	menu.open = true;
	const links = Array.from(menu.querySelectorAll('.dropdown-item'));
	const current = links.indexOf(document.activeElement);
	let index;
	if (event.key === 'Home') index = 0;
	else if (event.key === 'End') index = links.length - 1;
	else if (current === -1) index = event.key === 'ArrowUp' ? links.length - 1 : 0;
	else index = Math.max(0, Math.min(links.length - 1, current + (event.key === 'ArrowDown' ? 1 : -1)));
	if (links[index]) links[index].focus();
});

document.addEventListener('keyup', function (event) {
	if (event.key !== 'Tab') return;
	document.querySelectorAll('[data-site-menu][open]').forEach(function (menu) {
		if (!menu.contains(document.activeElement)) menu.open = false;
	});
});
