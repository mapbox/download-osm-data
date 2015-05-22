    // Set up map
    var map = mapbox.map('map');
    var layer_osm = new MM.Layer(new MM.MapProvider(function(coord) {
        var img = parseInt(coord.zoom) + '/' + parseInt(coord.column) + '/' + parseInt(coord.row) + '.png';
        return "http://a.tile.openstreetmap.org/" + img,
            "http://b.tile.openstreetmap.org/" + img,
            "http://c.tile.openstreetmap.org/" + img;
    }));

    map.addLayer(layer_osm);
    map.addLayer(mapbox.layer().id('ruben.us-over'));

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


        window.setTimeout(function() {
            $('#map').removeClass('loading');
        }, 500);


        var url_data = '';

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
            if (mapzoom >= 2) {
                var locations = (map.getExtent() + '').split(',');
                //FECHA
                var date_hour = $('#datetimepicker input').attr('value');
                var date = date_hour.substring(0, 10).split("/");
                var hour = date_hour.substring(11, 19).split(":");
                var newer = date[2] + "-" + date[0] + "-" + date[1] + "T" + date_hour.substring(11, 19) + "Z";
                //console.log($('input:radio[name=user]:checked').val());
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
                var way_type = "";
                var from_type = "";

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



                } else if (tipo == 'hamlets') {
                    from_type = '';
                    download_hamlets(locations, newer, user, from_type);



                }
                else if (tipo == 'kanada') {
                    from_type = '';
                    download_kanada_tamel_name(locations, newer, user, from_type);



                }




            } else {
                alert("zoom in a little so we don't have to load a huge area from the API.")
            }

        });



        $('#json').click(function() {

            var locations = (map.getExtent() + '').split(',');
            var date_hour = $('#datetimepicker input').attr('value');
            var date = date_hour.substring(0, 10).split("/");
            var hour = date_hour.substring(11, 19).split(":");
            var newer = date[2] + "-" + date[0] + "-" + date[1] + "T" + date_hour.substring(11, 19) + "Z";
            var user = $('#imput_user').val();



            //Tipo
            var tipo = $('input:radio[name=tipo]:checked').val();



            if (tipo == 'all-node') {

                //web site
                // $('#btn-full-with').trigger('click');
                 $('#osm_user').empty();
                $('#v1').empty();
                $('#vx').empty();
                

                $('#download_file').attr("disabled", true);


                $('#backdrop').fadeIn(200);
                $('#progress_map').show(200);
                $('#close').show(200);
                $('#progress_detail').css('display', 'block');
                $('.progress_detail').addClass('loading');

                download_json_nodes(locations, newer, user);

            } else {
                alert('tenga paciencia , estamos implementando...');
            }
        });



        $('#view_map').click(function() {
            var axx = document.getElementById("download_file");
            var ancla_data = axx.href;
            //console.log(ancla_data);
        });


        $('#modal').click(function() {
            $('#backdrop').fadeIn(200);
            $('#progress_map').show(200);
            $('#close').show(200);


        });
        $('#close').click(function(e) {
            e.preventDefault();
            $('#backdrop').fadeOut(200);
            $('#progress_map').hide(200);
            $('#progress_map').empty();
            $('#progress_detail').hide(200);
           // $('#progress_detail').empty();
            $('#close').hide(200);

        });

    })();
