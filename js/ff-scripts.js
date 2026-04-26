/*global $, jQuery, alert, document: false */

$(document).ready(function () {
	$('ul.first').bsPhotoGallery({
		"classes" : "col-md-3 col-sm-4 col-xs-6 col-xxs-12",
		"hasModal" : true
	});
});


window.addEventListener('load', function() {
	
	const mainHeader 	= document.querySelector('#header');
	const mainFooter 	= document.querySelector('#footer');
	const navBar		= document.querySelector('#navBar');

    mainHeader.innerHTML = `
		<header class="col-md-12 col-xs-12">
			<div class="row">
				<div class="col-md-4 col-xs-12">
					<a href="index.html"><img alt="Foxy Furniture Logo" src="img/head/logo_color.png" class="img-responsive"></a>
				</div>
				<div class="col-md-8 col-xs-12 center-text">
					<h3>Dungeon Furnishings <i>Hidden in Plain Sight</i)</h3>
				</div>
			</div>
		</header>
    `;
		
	mainFooter.innerHTML = `
		<footer class="col-md-12 col-xs-12 footer-div">
			<div class="row">
				<div class="pull-left">
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
<!--
				<div class="center-block col-md-2">
					 <a href="https://www.counters-free.net/">Visitors</a> <script type="text/javascript" src="https://www.freevisitorcounters.com/auth.php?id=5ec466a285c95c15edb8e5a7fd5423619c2a66a0"></script>
<script type="text/javascript" src="https://www.freevisitorcounters.com/en/home/counter/1525814/t/2"></script>
				</div>
-->
				<div class="pull-right col">
					<p class="text-center"><small >©2005-2026 Foxy Furniture</small></p>
				</div>
			</div>					
		</footer>
    `;
    
    navBar.innerHTML = `
    	<navbar class="col-md-12 col-xs-12 navbar-div">
			<div class="collapse navbar-collapse">
				<ul class="nav navbar-nav">
					<li class="enabled">
						<a href="index.html"><span class="glyphicon glyphicon-home" aria-hidden="true"></span></a>
					</li>
					<li class="enabled">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Plans<span class="caret hidden-xs"></span></a>
						<ul class="dropdown-menu">
							<li class="enabled">
								<a href="criss-cross.html">Criss Cross</a>
							</li>
							<li class="enabled">
								<a href="pandoras-chest.html">Pandora's Chest</a>
							</li>
							<li class="enabled">
								<a href="versahorse.html">VersaHorse</a>
							</li>
							<li class="enabled">
								<a href="powerpole.html">Power Pole</a>
							</li>
						</ul>
					</li>
					<li class="enabled">
						<a href="gallery.html">Gallery</a>
					</li>
					<li class="enabled">
						<a href="about-us.html">About</a>
					</li>
				</ul>
			</div>
		</navbar>
    `;
});



