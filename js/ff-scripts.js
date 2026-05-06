/*global bootstrap, document, window: false */

/* dummy change to force github pages to re-load */

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
				<div class="col-md-8 col-12 text-center">
					<h3 class="mb-0">Dungeon Furnishings <i>Hidden in Plain Sight</i)</h3>
				</div>
			</div>
		</header>
    `;
		
	mainFooter.innerHTML = `
		<footer class="col-md-12 col-12 footer-div">
			<div class="row">
				<div class="col-md-4 col-sm-4 col-6">
					<div class="text-center">
						<a class="a2a_dd" href="https://www.addtoany.com/share?linkurl=www.foxyfurniture.com&amp;linkname=">
							<img src="img/share_save_171_16.png" width="171" height="16" style="border:0" alt="Share"/>
						</a>
						<script>
							var a2a_config = a2a_config || {};
							a2a_config.linkurl = "www.foxyfurniture.com";
						</script>
						<script async src="https://static.addtoany.com/menu/page.js"></script>
					</div>
				</div>
				<div class="col-md-4 col-sm-3 col-6 text-center">
					<a href='https://www.counter12.com'>
						<img src='https://www.counter12.com/img-z0AB8Z3B5dwWb48C-29.gif' border='0' alt='free counter'>
					</a>
					Visitors
					<script type='text/javascript' src='https://www.counter12.com/ad.js?id=z0AB8Z3B5dwWb48C'></script>
					<a href='https://meuip.page/qual-e-o-meu-ip/' target='_blank'>
						<img src='https://img.meuip.page/selo-aZa1Z7W50d3b7CwD.gif' alt='IP' border='0'>
					</a>
				</div>
				<div class="col-md-4 col-sm-5 col-12">
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
});
