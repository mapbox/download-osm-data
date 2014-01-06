    // Set up map
    var map = mapbox.map('map');

    /*******************************capa de Mapbox******************/

    /* map.addLayer(mapbox.layer().id('ruben.map-hly0tebv'));
         
     */
    /*******************************capa de osm******************/

    var layer_osm = new MM.Layer(new MM.MapProvider(function(coord) {
        var img = parseInt(coord.zoom) + '/' + parseInt(coord.column) + '/' + parseInt(coord.row) + '.png';
        return "http://a.tile.openstreetmap.org/" + img,
            "http://b.tile.openstreetmap.org/" + img,
            "http://c.tile.openstreetmap.org/" + img;
    }));


    map.addLayer(layer_osm);
    //map.addLayer(mapbox.layer().id('ruben.us-over'));

    map.setZoomRange(3, 18);
    map.centerzoom({
        lat: 41.474,
        lon: -101.034
    }, 4);
    map.ui.zoomer.add();
    map.ui.zoombox.add();
    map.ui.hash.add();
    map.ui.attribution.add().content('<a href="http://www.openstreetmap.org/copyright">(c) OpenStreetMap contributors</a>');



    (function() {


        $('#map').removeClass('loading');


        $('#datetimepicker').datetimepicker({
            format: 'MM/dd/yyyy hh:mm:ss',
            pick12HourFormat: true
        });


        //ENABLE OR DISABLE DATE
        $("#select-date input[name='date']").click(function() {
            if ($('input:radio[name=date]:checked').val() == "spec-date") {
                $("#imput_date").prop('disabled', false);
            }

            if ($('input:radio[name=date]:checked').val() == "all-date") {
                $("#imput_date").prop('disabled', true);
            }
        });

        //ENABLE OR DISABLE USER
        $("#select-user input[name='user']").click(function() {
            if ($('input:radio[name=user]:checked').val() == "spec-user") {
                $("#imput_user").prop('disabled', false);
            }

            if ($('input:radio[name=user]:checked').val() == "all-user") {
                $("#imput_user").prop('disabled', true);
            }
        });



        $('#josm').click(function() {


            //MAP
            var mapzoom = map.getZoom();

            if (mapzoom >= 6) {



                var locations = (map.getExtent() + '').split(',');



                //FECHA
                var date_hour = $('#datetimepicker input').attr('value');
                var date = date_hour.substring(0, 10).split("/");
                var hour = date_hour.substring(11, 19).split(":");
                //11/27/2013 09:52:52
                //2013-04-24T13:00:00Z
                var newer = date[2] + "-" + date[0] + "-" + date[1] + "T" + date_hour.substring(11, 19) + "Z";



                console.log($('input:radio[name=user]:checked').val());

                if ($('input:radio[name=date]:checked').val() == "spec-date") {

                    newer = '<newer than="' + newer + '"/> ';
                } else {

                    newer = '';
                }



                //USER
                var user = $('#imput_user').val();


                console.log($('input:radio[name=user]:checked').val());

                if ($('input:radio[name=user]:checked').val() == "spec-user") {

                    user = '<user name="' + user + '"/> ';
                } else {

                    user = '';
                }



                //Tipo
                var tipo = $('input:radio[name=tipo]:checked').val();

                //alert(tipo);

                var way_type = "";

                var from_type = "";

                console.log(user);
                console.log(newer);
                console.log(tipo);

                if (tipo == 'highway') {

                    way_type = '<has-kv k="highway" />';
                    download_ways(locations, newer, user, way_type);

                } else if (tipo == 'buildings') {

                    way_type = '<has-kv k="building" v="yes"/>';
                    download_ways(locations, newer, user, way_type);


                } else if (tipo == 'all-ways') {
                    way_type = '';
                    download_ways(locations, newer, user, way_type);

                } else if (tipo == 'node-high') {
                    from_type = '  <has-kv k="highway" /> ';

                    download_nodes(locations, newer, user, from_type);

                } else if (tipo == 'all-node') {

                    from_type = '';

                    download_nodes(locations, newer, user, from_type);



                }



            } else {
                alert("zoom in a little so we don't have to load a huge area from the API.")
            }

        });

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


        $('#json').click(function() {


            //Tipo
            var tipo = $('input:radio[name=tipo]:checked').val();

            if (tipo == 'all-node') {
                download_json_nodes();
            } else if (tipo == 'highway') {

                download_json_ways();

            }
        });



        function download_json_nodes() {
            $('#btn-full-with').trigger('click');
            //FECHA
            var date_hour = $('#datetimepicker input').attr('value');
            var date = date_hour.substring(0, 10).split("/");
            var hour = date_hour.substring(11, 19).split(":");
            var newer = date[2] + "-" + date[0] + "-" + date[1] + "T" + date_hour.substring(11, 19) + "Z";

            //console.log(newer);
            var user = $('#imput_user').val();
            //console.log(user)
            var locations = (map.getExtent() + '').split(',');
            //console.log(locations[2] + ',' + locations[1] + ',' + locations[0] + ',' + locations[3]);
            var query = '[out:json];node(newer:"' + newer + '")(user:"' + user + '")(' + locations[2] + ',' + locations[1] + ',' + locations[0] + ',' + locations[3] + ');out meta;';

            // console.log(query);

            var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=' + query;
            console.log(url)
            $.getJSON(url, {
                format: "json"
            }).done(function(data) {
                /*console.log(data);
                console.log(data.elements);*/
                var geojson = {
                    "type": "FeatureCollection",
                    "features": []
                };
                $.each(data.elements, function(i, item) {
                    // console.log(item)
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
                    geojson.features.push(d);

                });
                createfile(geojson);

            });
        };



        function download_json_ways() {
            $('#btn-full-with').trigger('click');
            //FECHA
            var date_hour = $('#datetimepicker input').attr('value');
            var date = date_hour.substring(0, 10).split("/");
            var hour = date_hour.substring(11, 19).split(":");
            var newer = date[2] + "-" + date[0] + "-" + date[1] + "T" + date_hour.substring(11, 19) + "Z";

            //console.log(newer);
            var user = $('#imput_user').val();
            //console.log(user)
            var locations = (map.getExtent() + '').split(',');
            //console.log(locations[2] + ',' + locations[1] + ',' + locations[0] + ',' + locations[3]);
            var query = '[out:json];node(' + locations[2] + ',' + locations[1] + ',' + locations[0] + ',' + locations[3] + ');way(bn);way._  (newer:"' + newer + '") (user:"' + user + '") ["highway"];(._; >;);out meta;';


            var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=' + query;
            console.log(url)


            $.ajax({
                url: url,
                success: function(data) {
                    $("result").html(data);
                    console.log(data);
                }
            }).done(function(data) {


                var geojson = {
                    "type": "FeatureCollection",
                    "features": []
                };
                $.each(data.elements, function(i, item) {

                    //console.log(item)
                    if (item.type === "way") {
                        //  console.log(item)
                        var d = {
                            "geometry": {
                                "type": "LineString",
                                "coordinates": []
                            },
                            "type": "Feature",
                            "properties": {
                                "timestamp": moment(item.timestamp.replace('T', ' ').replace('Z', '')).unix(),
                                "version": item.version,
                                "highway": item.tags.highway,
                                "user": item.user
                            }
                        };

                       /* _.find(item.nodes, function(id_nodes) {

                            _.find(item.nodes, function(nodes) {
                                return num % 2 == 0;

                            });
                        });*/

                        console.log(item.nodes.length)

                        console.log(item.nodes)


                        // console.log(d);
                        geojson.features.push(d);

                    }


                });



                //console.log(data.elements);

                /*for (var i = data.elements.length - 1; i >= 0; i--) {
                    if (data.elements[i].type == 'way');
                    console.log(data.elements[i]);
                };
*/
                createfile(geojson);
            });

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

            var axx = document.getElementById("osm");
            axx.download = 'osm.geojson';
            axx.href = 'data:text/json;base64,' + Base64.encode(JSON.stringify(d));
            $('.row').removeClass('loading');
            $('#osm').removeAttr('disabled');
        };

    })();