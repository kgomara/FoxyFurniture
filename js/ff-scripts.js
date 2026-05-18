/*global bootstrap, document, window: false */

window.addEventListener('load', function() {
	
	const mainHeader 	= document.querySelector('#header');
	const mainFooter 	= document.querySelector('#footer');
	const navBar		= document.querySelector('#navBar');

    mainHeader.innerHTML = `
		<header class="col-md-12 col-12">
			<div class="row align-items-center">
				<div class="col-md-4 col-12">
					<a href="index.html"><img alt="Foxy Furniture Logo" src="img/head/logo_color.png" class="img-fluid"></a>
				</div>
				<div class="col-md-8 col-12 text-center text-md-start">
					<h3 class="mb-0">Dungeon Furnishings <i>Hidden in Plain Sight</i)</h3>
				</div>
			</div>
		</header>
    `;
		
	mainFooter.innerHTML = `
		<footer class="col-md-12 col-12 footer-div">
			<div class="row">
				<div class="col-md-6 col-12">
					<div class="text-center">
						<a class="a2a_dd" href="https://www.addtoany.com/share?linkurl=www.foxyfurniture.com&amp;linkname=">
							<img src="img/share_save_171_16.png" width="171" height="16" class="ff-share-img" alt="Share"/>
						</a>
						<script>
							var a2a_config = a2a_config || {};
							a2a_config.linkurl = "www.foxyfurniture.com";
						</script>
						<script async src="https://static.addtoany.com/menu/page.js"></script>
					</div>
				</div>
				<div class="col-md-6 col-12">
					<p class="text-center"><small>©2005-2026 Foxy Furniture</small></p>
				</div>
			</div>					
		</footer>
    `;
    
    navBar.innerHTML = `
    	<nav class="col-md-12 col-12 navbar navbar-expand navbar-div">
			<div class="collapse navbar-collapse show">
				<ul class="navbar-nav">
					<li class="nav-item enabled">
						<a class="nav-link" href="index.html"> <img src="./img/icons/house.svg" alt="Bootstrap" width="16" height="16"></a>
					</li>
					<li class="nav-item dropdown enabled">
						<a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Plans</a>
						<ul class="dropdown-menu">
							<li class="enabled">
								<a class="dropdown-item" href="criss-cross.html">Criss Cross</a>
							</li>
							<li class="enabled">
								<a class="dropdown-item" href="pandoras-chest.html">Pandora's Chest</a>
							</li>
							<li class="enabled">
								<a class="dropdown-item" href="versahorse.html">VersaHorse</a>
							</li>
							<li class="enabled">
								<a class="dropdown-item" href="powerpole.html">Power Pole</a>
							</li>
						</ul>
					</li>
					<li class="nav-item enabled">
						<a class="nav-link" href="gallery.html">Gallery</a>
					</li>
					<li class="nav-item enabled">
						<a class="nav-link" href="about-us.html">About</a>
					</li>
				</ul>
			</div>
		</nav>
    `;

	document.querySelectorAll('.carousel').forEach(function (carousel) {
		/*
			Work-around for bug in BootStrap 5 carousel.  Controls are "lazy loaded", hence swipe gestures don't initially work.
			This code initializes the carousel instance(s) during the page load process.
		*/
		bootstrap.Carousel.getOrCreateInstance(carousel, {
			interval: false,
			touch: true
		});
	});

	const getDownloadPlans = function (pageName) {
		switch (pageName) {
		case 'criss-cross.html':
			return {
				drawingsHref: 'plans/criss-cross-dwgs.zip',
				pdfsHref: 'plans/criss-cross-pdfs.zip'
			};
		case 'pandoras-chest.html':
			return {
				drawingsHref: 'plans/pandoras-chest-dwgs.zip',
				pdfsHref: 'plans/pandoras-chest-pdfs.zip'
			};
		case 'powerpole.html':
			return {
				drawingsHref: 'plans/power-pole-dwgs.zip',
				pdfsHref: 'plans/power-pole-pdfs.zip'
			};
		case 'versahorse.html':
			return {
				drawingsHref: 'plans/versahorse-dwgs.zip',
				pdfsHref: 'plans/versahorse-pdfs.zip'
			};
		default:
			return null;
		}
	};
	const currentPage = window.location.pathname.split('/').pop();
	const downloadPlans = getDownloadPlans(currentPage);

	document.querySelectorAll('.ff-download-plans').forEach(function (container) {
		const trackDownload = function (href, label) {
			const eventName = label === 'Drawings' ? 'download_drawings' : 'download_pdfs';

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
			link.className = 'btn btn-primary btn-lg d-block w-100 mx-auto ff-download-btn';
			link.href = href;
			link.download = '';
			link.target = 'ffDownloadFrame';
			link.textContent = label;
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

		const heading = document.createElement('h4');
		const drawingsText = document.createElement('p');
		const drawingsStrong = document.createElement('strong');
		const spacer = document.createElement('br');
		const pdfsText = document.createElement('p');
		const pdfsStrong = document.createElement('strong');

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
	});

	if (document.querySelector('a[target="ffDownloadFrame"]')) {
		const downloadFrame = document.createElement('iframe');

		downloadFrame.name = 'ffDownloadFrame';
		downloadFrame.title = 'Download';
		downloadFrame.hidden = true;
		document.body.appendChild(downloadFrame);
	}
});
