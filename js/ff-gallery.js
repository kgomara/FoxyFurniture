/*global bootstrap, document: false */

document.addEventListener('DOMContentLoaded', function () {
	const galleryLists = document.querySelectorAll('ul.first');
	let currentItems = [];
	let currentIndex = 0;

	if (!galleryLists.length) {
		return;
	}

	function ensureModal() {
		let modal = document.getElementById('ffGalleryModal');

		if (modal) {
			return modal;
		}

		modal = document.createElement('div');
		modal.className = 'modal fade';
		modal.id = 'ffGalleryModal';
		modal.tabIndex = -1;
		modal.setAttribute('aria-hidden', 'true');
		modal.innerHTML = `
			<div class="modal-dialog modal-dialog-centered ff-gallery-modal-dialog">
				<div class="modal-content ff-gallery-modal-content">
					<div class="modal-body position-relative p-3">
						<button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-2" data-bs-dismiss="modal" aria-label="Close"></button>
						<img id="ffGalleryImage" class="ff-gallery-modal-img img-fluid d-block mx-auto" alt="">
						<div class="d-flex justify-content-between align-items-center mt-3">
							<button type="button" id="ffGalleryPrev" class="btn btn-light btn-sm">&laquo; prev</button>
							<button type="button" id="ffGalleryNext" class="btn btn-light btn-sm">next &raquo;</button>
						</div>
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

		modal.addEventListener('keydown', function (event) {
			if (event.key === 'ArrowLeft') {
				showImage(currentIndex - 1);
			}

			if (event.key === 'ArrowRight') {
				showImage(currentIndex + 1);
			}
		});

		return modal;
	}

	function getImageSrc(img) {
		return img.getAttribute('data-bsp-large-src') || img.getAttribute('src');
	}

	function showImage(index) {
		const modalImg = document.getElementById('ffGalleryImage');
		const prevBtn = document.getElementById('ffGalleryPrev');
		const nextBtn = document.getElementById('ffGalleryNext');
		const img = currentItems[index];

		if (!img) {
			return;
		}

		currentIndex = index;
		modalImg.src = getImageSrc(img);
		modalImg.alt = img.getAttribute('alt') || '';
		prevBtn.disabled = currentIndex === 0;
		nextBtn.disabled = currentIndex === currentItems.length - 1;
	}

	galleryLists.forEach(function (galleryList) {
		const items = Array.from(galleryList.querySelectorAll('li'));

		galleryList.classList.add('row');

		items.forEach(function (item, index) {
			const img = item.querySelector('img');

			item.classList.add('col-md-3', 'col-sm-4', 'col-6');

			if (!img) {
				return;
			}

			img.classList.add('img-fluid');
			img.setAttribute('role', 'button');
			img.tabIndex = 0;

			function openGallery() {
				const modal = ensureModal();
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
});
