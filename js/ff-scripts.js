/*global bootstrap, document, window: false */

const SHARED_LAYOUT_VERSION = 'v3.2.3';

window.addEventListener('load', async function() {
	await initSharedLayout();
	initCarousels();
	initDownloadPlans();
});

async function initSharedLayout() {
	const mainHeader 	= document.querySelector('#header');
	const mainFooter 	= document.querySelector('#footer');

	const injectSharedHtml = async function (container, href) {
		if (!container) {
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
	const downloadPlansByKey = {
		crissCross: {
			buyHref: 			'https://fetishfurniture.org/',
			buildPackHref: 'plans/crisscross-build-pack.zip',
			revisionDate: '2026-10-29',
			revisionLabel: 'October 29, 2026',
			models: [
				{
					label: 'Working & Playing',
					image: 'img/cc/models/working.png',
					href: 'https://app.sketchup.com/share/tc/northAmerica/kdVacVyOuW4?source=desktop&stoken=gADJmRdy1rPqoQNS2yn9pYWdgP-mHICtdfLEyZAXI0tr2vh1jedfCiUHs7eTF5e_&rtc-engine-version=21'
				}
			],
			prodAbbr: 		'cc'
		},
		pandorasChest: {
			drawingsHref: 'plans/pandoras-chest-dwgs.zip',
			pdfsHref: 		'plans/pandoras-chest-pdfs.zip',
			prodAbbr: 		'pc'
		},
		powerPole: {
			drawingsHref: 'plans/power-pole-dwgs.zip',
			pdfsHref: 		'plans/power-pole-pdfs.zip',
			prodAbbr: 		'pp'
		},
		versaHorse: {
			buyHref: 				'https://fetishfurniture.org/',
			buildPackHref: 	'plans/versahorse-build-pack.zip',
			revisionDate: 	'2026-10-25',
			revisionLabel: 	'October 25, 2026',
			models: [
				{
					label: 	'Chest Rest',
					image: 	'img/vh/models/chest-rest-working.png',
					href: 	'https://app.sketchup.com/share/tc/northAmerica/VLbDbSqafpw?source=desktop&stoken=T9fbZ8R4D_X6TJH-T51qa3JNjvm05vV12HwA2yQZbsEWLfGQL_kIHcSR28EQh0Xf&rtc-engine-version=21'
				},
				{
					label: 	'Pegasus Bench',
					image: 	'img/vh/models/pegasus-bench-working.png',
					href: 	'https://app.sketchup.com/share/tc/northAmerica/Qh_9RlPO-hY?source=desktop&stoken=FRRL7hCPxDwaHeXDjecbcW6wkao6KG8z1PDfzD4uolOKokz-2EpliWIgM9WaY_DZ&rtc-engine-version=21'
				},
				{
					label: 	'Pillory & Stock',
					image: 	'img/vh/models/pillory-stock-working.png',
					href: 	'https://app.sketchup.com/share/tc/northAmerica/iG_kwpRfIMc?source=desktop&stoken=EvpO3aYyuqlya8IN6wYIYrmyElDulm3h5OGp_udoPWebQFr70cZXWefj6re3s3gs&rtc-engine-version=21'
				}
			],
			prodAbbr: 	'vh'
		}
	};

	document.querySelectorAll('.ff-download-plans').forEach(function (container) {
		const downloadPlans = downloadPlansByKey[container.dataset.downloadPlans];

		const trackDownload = function (href, label) {
			const eventSuffix = label === 'Build-Pack' ? 'build_pack' : label === 'Drawings' ? 'drawings' : 'pdfs';
			const eventName 	= 'download_' + downloadPlans.prodAbbr + '_' + eventSuffix;

			if (typeof window.sa_event === 'function') {
				window.sa_event(eventName, {
					filename: href.split('/').pop()
				});
			}
		};

		const createDownloadButton = function (href, label) {
			const wrapper = document.createElement('div');
			const link = document.createElement('a');

			wrapper.className = 'text-center';
			link.className 		= 'btn btn-primary btn-lg d-block w-100 mx-auto ff-download-btn';
			link.href 				= href;
			link.download 		= '';
			link.target 			= 'ffDownloadFrame';
			link.textContent 	= label;
			link.addEventListener('click', function () {
				trackDownload(href, label);
			});
			wrapper.appendChild(link);

			return wrapper;
		};

		if (!downloadPlans) {
			return;
		}

		container.replaceChildren();

		const heading 				= document.createElement('h4');
		const drawingsText 	= document.createElement('p');
		const drawingsStrong = document.createElement('strong');
		const spacer 					= document.createElement('br');
		const pdfsText 				= document.createElement('p');
		const pdfsStrong 			= document.createElement('strong');
		const buySpacer				= document.createElement('br');

		heading.textContent = 'Download Free Plans!';

		if (downloadPlans.buildPackHref) {
			drawingsText.textContent 	= 'Use the ';
			drawingsStrong.textContent	= 'Build-Pack';
			drawingsText.append(drawingsStrong, ' button to download Instructions, BOM, cutting diagrams and original dimensioned drawings.');

			const revision 						= document.createElement('p');
			const date 								= document.createElement('time');
			revision.className 				= 'ff-build-pack-revision';
			date.dateTime 						= downloadPlans.revisionDate;
			date.textContent 					= downloadPlans.revisionLabel;
			revision.append('Revised ', date);

			const modelHeading 				= document.createElement('h4');
			modelHeading.className 		= 'ff-model-heading';
			modelHeading.textContent	= 'Explore in 3D';
			const models 							= document.createElement('ul');
			models.className 					= 'ff-model-links';

			downloadPlans.models.forEach(function (model) {
				const item 	= document.createElement('li');
				const link 	= document.createElement('a');
				const image = document.createElement('img');
				const label = document.createElement('span');

				link.href 	= model.href;
				link.target = '_blank';
				link.rel 		= 'noopener';
				link.setAttribute('aria-label', 'View ' + model.label + ' model in 3D (opens in a new tab)');

				image.src 				= model.image;
				image.alt 				= '';
				image.width 			= 100;
				image.height 			= 100;
				image.decoding 		= 'async';

				label.textContent = model.label;
				link.append(image, label);
				item.appendChild(link);
				models.appendChild(item);
			});

			const modelText 			= document.createElement('p');
			modelText.className 	= 'ff-model-description';
			modelText.textContent = 'View in your browser. No account required. Models supplement the build documents.';
			container.append(heading, drawingsText, createDownloadButton(downloadPlans.buildPackHref, 'Build-Pack'), revision, modelHeading, models, modelText);
		}
		else {
			drawingsText.append('Use the ');
			drawingsStrong.textContent = 'Drawings';
			drawingsText.append(drawingsStrong, ' button to download plans you can modify. They are in AutoCAD (.dwg) format.');

			pdfsText.append('Use the ');
			pdfsStrong.textContent = 'PDFs';
			pdfsText.append(pdfsStrong, ' button to download PDFs of the plans.');

			container.append(
				heading,
				drawingsText,
				createDownloadButton(downloadPlans.drawingsHref, 'Drawings'),
				spacer,
				pdfsText,
				createDownloadButton(downloadPlans.pdfsHref, 'PDFs')
			);
		}

		if (downloadPlans.buyHref) {
			const buyHeading 	= document.createElement('h2');
			const buyText 		= document.createElement('p');
			const buyLink 		= document.createElement('a');

			buyHeading.textContent 	= "If you'd rather buy...";
			buyLink.href 						= downloadPlans.buyHref;
			buyLink.target					= '_blank';
			buyLink.rel 						= 'noopener';
			buyLink.textContent 		= 'Fetish Furniture';
			buyText.append(buyLink, ' builds the VersaHorse and Criss-Cross designs.');

			container.append(buySpacer, buyHeading, buyText);
		}
	});

	if (document.querySelector('a[target="ffDownloadFrame"]') && !document.querySelector('iframe[name="ffDownloadFrame"]')) {
		const downloadFrame = document.createElement('iframe');

		downloadFrame.name 		= 'ffDownloadFrame';
		downloadFrame.title 	= 'Download';
		downloadFrame.hidden 	= true;
		document.body.appendChild(downloadFrame);
	}
}
