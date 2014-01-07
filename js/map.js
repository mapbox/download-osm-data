var url = document.URL;
var hash = url.substring(url.indexOf("#") + 1);
//console.log(hash);


var json = jQuery.parseJSON(hash);
console.log(json);
/*
$.getJSON(hash, {
	format: "json"
}).done(function(data) {
	console.log(data);
	console.log(data.elements);
});*/
var myIcon_v1 = L.icon({
	iconUrl: 'https://dl.dropboxusercontent.com/u/43116811/osm/markerv1_2x2.jpg',
	iconSize: [2, 2]
});

var myIcon_vx = L.icon({
	iconUrl: 'https://dl.dropboxusercontent.com/u/43116811/osm/markerv2_2x2.jpg',
	iconSize: [2, 2]

});


var map = L.mapbox.map('map', 'ruben.gnfifcn3')
	.setView([34.75887, -77.35057], 18);

map.legendControl.addLegend('<img src="https://dl.dropboxusercontent.com/u/43116811/osm/leyenda.png"></img>');


// Set a custom icon on each marker based on feature properties
map.markerLayer.on('layeradd', function(e) {
	var marker = e.layer,
		feature = marker.feature;

	if (feature.properties.version === 1) {
		marker.setIcon(myIcon_v1);
	} else {
		marker.setIcon(myIcon_vx);
	}



});

// Add features to the map
map.markerLayer.setGeoJSON(json);

user: "ediyes"
version: 1

//'http://overpass.osm.rambler.ru/cgi/interpreter?data=[out:json];node(newer:%222014-01-05T08:36:46Z%22)(user:%22ediyes%22)(%2034.761,%20-77.364,34.773,%20-77.336);out%20meta;'