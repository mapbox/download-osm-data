var url = document.URL;
var url_data = url.substring(url.indexOf("?") + 1);

var cord=url.substring(url.indexOf("#")+2 ,url.indexOf("?") );

cord=cord.split("/");

//console.log(cord);

console.log(url_data);

var map = L.mapbox.map('map', 'ruben.gnfifcn3')
	.setView([cord[1], cord[2]], cord[0]);

map.legendControl.addLegend('<img src="https://dl.dropboxusercontent.com/u/43116811/osm/leyenda.png"></img>');

var geojson = {
	"type": "FeatureCollection",
	"features": []
};


$.getJSON(url_data, {
	format: "json"
}).done(function(data) {
	/*console.log(data);
                console.log(data.elements);*/
	console.log(data.elements.length)
	$.each(data.elements, function(i, item) {
		// console.log(item)
		var d = {
			"geometry": {
				"type": "Point",
				"coordinates": [item.lon, item.lat]
			},
			"type": "Feature",
			"properties": {

				"timestamp": item.timestamp.replace('T', ' ').replace('Z', ''),
				"version": item.version,
				"user": item.user
			}
		};


		geojson.features.push(d);

	});

	map_marker();
});


function map_marker() {

	var myIcon_v1 = L.icon({
		iconUrl: 'https://dl.dropboxusercontent.com/u/43116811/osm/markerv1_2x2.jpg',
		iconSize: [2, 2]
	});

	var myIcon_vx = L.icon({
		iconUrl: 'https://dl.dropboxusercontent.com/u/43116811/osm/markerv2_2x2.jpg',
		iconSize: [2, 2]

	});

	map.markerLayer.on('layeradd', function(e) {
		var marker = e.layer,
			feature = marker.feature;

		if (feature.properties.version === 1) {
			marker.setIcon(myIcon_v1);
		} else {
			marker.setIcon(myIcon_vx);
		}



	});

	map.markerLayer.setGeoJSON(geojson);

};