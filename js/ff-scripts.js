/*global bootstrap, document, window: false */

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
		injectSharedHtml(mainHeader, 'js/shared/header.html'),
		injectSharedHtml(mainFooter, 'js/shared/footer.html')
	]);
}

function initCarousels() {
	document.querySelectorAll('.carousel').forEach(function (carousel) {
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

function initDownloadPlans() {
	const getDownloadPlans = function (pageName) {
		switch (pageName) {
		case 'criss-cross.html':
			return {
				buyHref: 			'https://fetishfurniture.org/',
				drawingsHref: 'plans/criss-cross-dwgs.zip',
				pdfsHref: 		'plans/criss-cross-pdfs.zip',
				prodAbbr: 		'cc'
			};
		case 'pandoras-chest.html':
			return {
				drawingsHref: 'plans/pandoras-chest-dwgs.zip',
				pdfsHref: 		'plans/pandoras-chest-pdfs.zip',
				prodAbbr: 		'pc'
			};
		case 'powerpole.html':
			return {
				drawingsHref: 'plans/power-pole-dwgs.zip',
				pdfsHref: 		'plans/power-pole-pdfs.zip',
				prodAbbr: 		'pp'
			};
		case 'versahorse.html':
			return {
				buyHref: 			'https://fetishfurniture.org/',
				drawingsHref: 'plans/versahorse-dwgs.zip',
				pdfsHref: 		'plans/versahorse-pdfs.zip',
				prodAbbr: 		'vh'
			};
		default:
			return null;
		}
	};

	const currentPage 	= window.location.pathname.split('/').pop();
	const downloadPlans = getDownloadPlans(currentPage);

	document.querySelectorAll('.ff-download-plans').forEach(function (container) {
		const trackDownload = function (href, label) {
			const eventName = label === 'Drawings' ? ('download_' + downloadPlans.prodAbbr + '_drawings') : ('download_' + downloadPlans.prodAbbr + '_pdfs');

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
		const drawingsText 		= document.createElement('p');
		const drawingsStrong 	= document.createElement('strong');
		const spacer 					= document.createElement('br');
		const pdfsText 				= document.createElement('p');
		const pdfsStrong 			= document.createElement('strong');
		const buySpacer				= document.createElement('br');

		heading.textContent = 'Download Free Plans!';

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

	if (document.querySelector('a[target="ffDownloadFrame"]')) {
		const downloadFrame = document.createElement('iframe');

		downloadFrame.name 		= 'ffDownloadFrame';
		downloadFrame.title 	= 'Download';
		downloadFrame.hidden 	= true;
		document.body.appendChild(downloadFrame);
	}
}
