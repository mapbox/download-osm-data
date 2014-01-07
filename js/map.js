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
var myIcon = L.icon({
    iconUrl: 'https://dl.dropboxusercontent.com/u/43116811/osm/marker.jpg',
    iconSize: [20, 20]
            /*  iconAnchor: [22, 94],
             popupAnchor: [-3, -76],
             shadowUrl: 'my-icon-shadow.png',
             shadowRetinaUrl: '[email blocked]',
             shadowSize: [68, 95],
             shadowAnchor: [22, 94]*/
});

var map = L.mapbox.map('map', 'examples.map-9ijuk24y')
	.setView([34.75887, -77.35057], 18);


// Set a custom icon on each marker based on feature properties
map.markerLayer.on('layeradd', function(e) {
    var marker = e.layer,
        feature = marker.feature;

   marker.setIcon(myIcon);
});

// Add features to the map
map.markerLayer.setGeoJSON(json);

//'http://overpass.osm.rambler.ru/cgi/interpreter?data=[out:json];node(newer:%222014-01-05T08:36:46Z%22)(user:%22ediyes%22)(%2034.761,%20-77.364,34.773,%20-77.336);out%20meta;'