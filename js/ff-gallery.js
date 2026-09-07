/*global bootstrap, document, window: false */

document.addEventListener('DOMContentLoaded', function () {
	initGalleryIndex();
	initGallery();
});

function initGalleryIndex() {
	const galleryIndex = document.querySelector('[data-gallery-index]');
	const galleryItems = window.ffGalleryItems ? window.ffGalleryItems.index : null;

	if (!galleryIndex || !galleryItems || galleryIndex.children.length) {
		return;
	}

	galleryIndex.replaceChildren(...galleryItems.map(function (galleryItem) {
		const item = document.createElement('div');
		const link = document.createElement('a');
		const img = document.createElement('img');
		const title = document.createElement('p');

		item.className = 'ff-gallery-img';
		link.href = galleryItem.href;
		img.src = galleryItem.src;
		img.className = 'img-fluid col-12';
		img.alt = galleryItem.alt;
		title.className = 'text-center';
		title.textContent = galleryItem.title;

		link.append(img, title);
		item.appendChild(link);

		return item;
	}));
}

function calculateScaledImageSize(naturalWidth, naturalHeight, maxWidth, maxHeight) {
	if (!naturalWidth || !naturalHeight) {
		return null;
	}

	const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight);

	return {
		width: 	Math.floor(naturalWidth * scale),
		height: Math.floor(naturalHeight * scale)
	};
}

function renderGalleryItems(galleryList) {
	const galleryKey		= galleryList.dataset.gallery;
	const galleryItems	= galleryKey && window.ffGalleryItems ? window.ffGalleryItems[galleryKey] : null;

	if (!galleryItems || galleryList.children.length) {
		return;
	}

	galleryList.replaceChildren(...galleryItems.map(function (galleryItem) {
		const item	= document.createElement('li');
		const img		= document.createElement('img');

		img.src = galleryItem.src;
		img.alt = galleryItem.alt;
		item.appendChild(img);

		return item;
	}));
}

function initGallery() {
	const galleryLists 	= document.querySelectorAll('[data-gallery]');
	let currentItems 		= [];
	let currentIndex 		= 0;
	let touchStartX 		= 0;
	let touchStartY 		= 0;

	if (!galleryLists.length) {
		return;
	}

	function ensureModal() {
		let modal = document.getElementById('ffGalleryModal');

		if (modal) {
			return modal;
		}

		modal 					= document.createElement('div');
		modal.className = 'modal fade';
		modal.id 				= 'ffGalleryModal';
		modal.tabIndex 	= -1;
		modal.setAttribute('aria-hidden', 'true');
		modal.innerHTML = `
			<div class="modal-dialog ff-gallery-modal-dialog">
				<div class="modal-content ff-gallery-modal-content">
					<div class="modal-body ff-gallery-modal-body">
						<button type="button" class="btn-close ff-gallery-close" data-bs-dismiss="modal" aria-label="Close"></button>
						<button type="button" id="ffGalleryPrev" class="ff-gallery-nav ff-gallery-prev" aria-label="Previous image"><span aria-hidden="true">&lsaquo;</span></button>
						<img id="ffGalleryImage" class="ff-gallery-modal-img" alt="">
						<button type="button" id="ffGalleryNext" class="ff-gallery-nav ff-gallery-next" aria-label="Next image"><span aria-hidden="true">&rsaquo;</span></button>
						<div id="ffGalleryCounter" class="ff-gallery-counter" aria-live="polite"></div>
					</div>
				</div>
			</div>
		`;
		document.body.appendChild(modal);

		document.getElementById('ffGalleryPrev').addEventListener('click', function () {
			showImage(currentIndex - 1);
		});

		document.getElementById('ffGalleryNext').addEventListener('click', function () {
			showImage(currentIndex + 1);
		});

		window.addEventListener('resize', function () {
			const modalImg = document.getElementById('ffGalleryImage');

			if (modalImg && modalImg.complete) {
				sizeModalImage(modalImg);
			}
		});

		modal.addEventListener('keydown', function (event) {
			if (event.key === 'ArrowLeft') {
				showImage(currentIndex - 1);
			}

			if (event.key === 'ArrowRight') {
				showImage(currentIndex + 1);
			}
		});

		modal.addEventListener('touchstart', function (event) {
			const touch = event.changedTouches[0];

			touchStartX = touch.clientX;
			touchStartY = touch.clientY;
		}, {
			passive: true
		});

		modal.addEventListener('touchend', function (event) {
			const touch = event.changedTouches[0];
			const deltaX = touch.clientX - touchStartX;
			const deltaY = touch.clientY - touchStartY;

			if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) {
				return;
			}

			if (deltaX > 0) {
				showImage(currentIndex - 1);
			} else {
				showImage(currentIndex + 1);
			}
		}, {
			passive: true
		});

		return modal;
	}

	function sizeModalImage(modalImg) {
		const viewportHeight	= window.visualViewport ? window.visualViewport.height : window.innerHeight;
		const maxWidth				= window.innerWidth - 16;
		const maxHeight				= viewportHeight - 16;
		const naturalWidth		= modalImg.naturalWidth;
		const naturalHeight		= modalImg.naturalHeight;
		const scaledSize			= calculateScaledImageSize(naturalWidth, naturalHeight, maxWidth, maxHeight);

		if (!scaledSize) {
			return;
		}

		modalImg.style.width	= scaledSize.width + 'px';
		modalImg.style.height = scaledSize.height + 'px';
	}

	function showImage(index) {
		const modalImg 	= document.getElementById('ffGalleryImage');
		const prevBtn		= document.getElementById('ffGalleryPrev');
		const nextBtn 	= document.getElementById('ffGalleryNext');
		const counter 	= document.getElementById('ffGalleryCounter');
		const img 			= currentItems[index];

		if (!img) {
			return;
		}

		currentIndex = index;
		modalImg.style.width	= '';
		modalImg.style.height	= '';
		modalImg.onload				= function () {
			sizeModalImage(modalImg);
		};
		modalImg.src = img.getAttribute('src');
		modalImg.alt = img.getAttribute('alt') || '';
		if (modalImg.complete) {
			sizeModalImage(modalImg);
		}
		prevBtn.disabled = currentIndex === 0;
		nextBtn.disabled = currentIndex === currentItems.length - 1;
		counter.textContent = (currentIndex + 1) + ' / ' + currentItems.length;
	}

	galleryLists.forEach(function (galleryList) {
		renderGalleryItems(galleryList);

		const items = Array.from(galleryList.querySelectorAll('li'));

		galleryList.classList.add('ff-gallery-grid');

		items.forEach(function (item, index) {
			const img = item.querySelector('img');

			item.classList.add('ff-gallery-grid-item');

			if (!img) {
				return;
			}

			img.classList.remove('btn-thumbnail', 'img-thumbnail', 'ff-gallery-btn');
			img.classList.add('ff-gallery-thumb');
			img.loading		= 'lazy';
			img.decoding	= 'async';
			img.setAttribute('role', 'button');
			img.tabIndex	= 0;

			function openGallery() {
				const modal	= ensureModal();
				currentItems = items.map(function (galleryItem) {
					return galleryItem.querySelector('img');
				}).filter(Boolean);
				currentIndex = currentItems.indexOf(img);
				showImage(currentIndex);
				bootstrap.Modal.getOrCreateInstance(modal).show();
			}

			img.addEventListener('click', openGallery);
			img.addEventListener('keydown', function (event) {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					openGallery();
				}
			});
		});
	});
}

if (typeof module !== 'undefined') {
	module.exports = {
		calculateScaledImageSize,
		initGallery,
		initGalleryIndex,
		renderGalleryItems
	};
}
