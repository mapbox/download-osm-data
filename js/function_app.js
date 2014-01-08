
var url_data='';

function download_ways(locations, newer, user, way_type) {

    var dir = "http://127.0.0.1:8111/";

    var query = '<bbox-query s="' + locations[2] + '" n="' + locations[0] + '" w="' + locations[1] + '" e="' + locations[3] + '"/>' +
        '<recurse type="node-way"/>' +
        '<query type="way">' +
        '<item/>' +
        newer + user + way_type +
        '</query><union><item/>' +
        '<recurse type="down"/>' +
        '</union><print mode="meta"/>';

    // var query2 = '<bbox-query s="' + locations[2] + '" n="' + locations[0] + '" w="' + locations[1] + '" e="' + locations[3] + '"/> <recurse type="node-way"/><query type="way"><item/><newer than="2013-11-26T00:00:00Z"/><user name="Rub21_nycbuildings"/></query><union><item/><recurse type="down"/></union><print mode="meta"/>';
    console.log(query);
    $.get(dir + "import", {
        url: 'http://overpass-api.de/api/interpreter?data=' + query
    }).error(function() {
        alert("Error: Enable JOSM remote!")
    }).success(function() {
        e.dialog("close")
    });
};

function download_nodes(locations, newer, user, from_type) {

    var dir = "http://127.0.0.1:8111/";

    var query = '<query type="node">' +
        newer + user + from_type +
        '<bbox-query s="' + locations[2] + '" n="' + locations[0] + '" w="' + locations[1] + '" e="' + locations[3] + '"/>' +
        '</query>' +
        '<print mode="meta"/>';

    console.log(query);
    $.get(dir + "import", {
        url: 'http://overpass-api.de/api/interpreter?data=' + query


    }).error(function() {
        alert("Error: Enable JOSM remote!")
    }).success(function() {
        e.dialog("close")
    });
};


function download_json_nodes(locations, newer, user) {

    var query = '[out:json];node(newer:"' + newer + '")(user:"' + user + '")(' + locations[2] + ',' + locations[1] + ',' + locations[0] + ',' + locations[3] + ');out meta;';
    var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=' + query;

    url_data = query;

    $.getJSON(url, {
        format: "json"
    }).done(function(data) {
        var geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        var v1 = 0;
        var vx = 0;

        $.each(data.elements, function(i, item) {
            var d = {
                "geometry": {
                    "type": "Point",
                    "coordinates": [item.lon, item.lat]
                },
                "type": "Feature",
                "properties": {

                    "timestamp": moment(item.timestamp.replace('T', ' ').replace('Z', '')).unix(),
                    "version": item.version,
                    "user": item.user
                }
            };
            if (item.version == 1) {
                console.log(item.version)
                v1++;
            } else {
                vx++;
            }
            geojson.features.push(d);

        });

        //web site
         $('#osm_user').text($('#imput_user').val());
        $('#v1').text(v1);
        $('#vx').text(vx);

        createfile(geojson);
        maping_progress(geojson);
    });
};



function maping_progress(geojson) {


    var zoom = map.getZoom();
    var locations = (map.getExtent() + '').split(',');
    var lat = (parseFloat(locations[2]) + parseFloat(locations[0])) / 2;
    var lon = (parseFloat(locations[1]) + parseFloat(locations[3])) / 2;

    var myIcon_v1 = L.icon({
        iconUrl: 'https://dl.dropboxusercontent.com/u/43116811/osm/markerv1_2x2.jpg',
        iconSize: [2, 2]
    });

    var myIcon_vx = L.icon({
        iconUrl: 'https://dl.dropboxusercontent.com/u/43116811/osm/markerv2_2x2.jpg',
        iconSize: [2, 2]

    });

    var map_p = L.mapbox.map('progress_map', 'ruben.gnfifcn3');
    map_p.setView([lat, lon], zoom);

    map_p.legendControl.addLegend(document.getElementById('legend').innerHTML);

    // Set a custom icon on each marker based on feature properties
    map_p.markerLayer.on('layeradd', function(e) {
        var marker = e.layer,
            feature = marker.feature;

        if (feature.properties.version === 1) {
            marker.setIcon(myIcon_v1);
        } else {
            marker.setIcon(myIcon_vx);
        }
    });

    map_p.markerLayer.setGeoJSON(geojson);
};

function createfile(d) {
    var Base64 = {
        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        // public method for encoding
        encode: function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode: function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode: function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    }

    var axx = document.getElementById("download_file");
    axx.download = 'osm.geojson';
    axx.href = 'data:text/json;base64,' + Base64.encode(JSON.stringify(d));
    $('#progress_map').removeClass('loading');
    $('#progress_detaill').removeClass('loading');

    $('#download_file').removeAttr('disabled');
    $('#view_map').removeAttr('disabled');

    var zoom = map.getZoom();
    var locations = (map.getExtent() + '').split(',');
    var lat = (parseFloat(locations[2]) + parseFloat(locations[0])) / 2;
    var lon = (parseFloat(locations[1]) + parseFloat(locations[3])) / 2;
    $('#view_map').attr('target', '_blank');
    $('#view_map').attr('href', 'map2.html#/' + zoom + '/' + lat + '/' + lon + '?' + url_data);
};