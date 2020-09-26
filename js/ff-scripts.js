/*global $, jQuery, alert, document: false */

$(document).ready(function () {
    /*
     * setup the widths of the various accessory-list scollers
     */
    var container_width = 170 * $("#home-accessory-list a").length;
    $("#home-accessory-list").css("width", container_width);

    container_width = 170 * $("#bcd-accessory-list a").length;
    $("#bcd-accessory-list").css("width", container_width);

    container_width = 170 * $("#cc-accessory-list a").length;
    $("#cc-accessory-list").css("width", container_width);

    container_width = 170 * $("#fb-accessory-list a").length;
    $("#fb-accessory-list").css("width", container_width);

    container_width = 170 * $("#pc-accessory-list a").length;
    $("#pc-accessory-list").css("width", container_width);

    container_width = 170 * $("#vh-accessory-list a").length;
    $("#vh-accessory-list").css("width", container_width);

    container_width = 170 * $("#pp-accessory-list a").length;
    $("#pp-accessory-list").css("width", container_width);

    container_width = 170 * $("#sb-accessory-list a").length;
    $("#sb-accessory-list").css("width", container_width);


	$('ul.first').bsPhotoGallery({
		"classes" : "col-md-2 col-sm-3 col-xs-4 col-xxs-12",
		"hasModal" : true
	});
});



