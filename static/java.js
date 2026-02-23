function init() {
    // Colorado bounding box in lat/lon
    var minlon = -106.96744;
    var minlat = 38.8776;
    var maxlon = -106.92461;
    var maxlat = 38.92480;

    var fromProjection = new OpenLayers.Projection("EPSG:4326");
    var toProjection   = new OpenLayers.Projection("EPSG:900913");

    // Transform bounds
    var bounds = new OpenLayers.Bounds(minlon, minlat, maxlon, maxlat)
                        .transform(fromProjection, toProjection);

    // Initialize map with standard zoom levels
    var map = new OpenLayers.Map("demoMap", {
        projection: toProjection,
        displayProjection: fromProjection,
        restrictedExtent: bounds,
        maxExtent: bounds
    });

    // OpenTopoMap tiles
    var topoLayer = new OpenLayers.Layer.XYZ(
        "OpenTopoMap",
        "https://a.tile.opentopomap.org/${z}/${x}/${y}.png",
        {
            sphericalMercator: true,
            wrapDateLine: true,
            numZoomLevels: 18, // OpenTopoMap standard
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/">OSM</a>, <a href="https://opentopomap.org/">OpenTopoMap</a>'
        }
    );
    map.addLayer(topoLayer);

    // Determine minZoom that fits bounding box
    var size = map.getSize();
    var minZoom = map.getZoomForExtent(bounds, true); // fit bounds exactly
    map.setCenter(bounds.getCenterLonLat(), minZoom);

    // Lock zoom bar at minZoom
    map.events.register("zoomend", map, function() {
        if (map.getZoom() < minZoom) {
            map.zoomTo(minZoom);
        }
    });

    // --- Marker Layer ---
    var markerLayer = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markerLayer);

    // --- HARD CODED LOCATION ---
    var noteLon = -106.950944;
    var noteLat = 38.922139;

    var noteLL = new OpenLayers.LonLat(noteLon, noteLat)
                        .transform(fromProjection, toProjection);

    var iconSize = new OpenLayers.Size(32, 32);
    var iconOffset = new OpenLayers.Pixel(-(iconSize.w/2), -iconSize.h);

    var icon = new OpenLayers.Icon(
        "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize,
        iconOffset
    );

    var marker = new OpenLayers.Marker(noteLL, icon);
    markerLayer.addMarker(marker);

    marker.events.register("mousedown", marker, function(evt) {
        var popupContent =
            '<div class="note-popup">' +
            '<b>VALVE 1 PumpHouse</b><br>' +
            '<textarea id="valve1noteBox" rows="4" style="width:95%"></textarea><br><br>' +
            '<button onclick="alert(document.getElementById(\'valve1noteBox\').value)">Save</button><br>' +
            '<b>Last state change: </b><br>'+
            '<b>Last Snowmaker That made change: </b><br>'+
            '<b>Time of change:  </b><br>'+
            '<b>Last Note Made: </b><br>'+
            '</div>';

        var popup = new OpenLayers.Popup.FramedCloud(
            "notePopup",
            noteLL,
            null,
            popupContent,
            null,
            true
        );

        map.addPopup(popup);
        OpenLayers.Event.stop(evt);
    });



    // Add zoom controls
    map.addControl(new OpenLayers.Control.PanZoomBar());

    // Mouse wheel zoom only
    map.addControl(new OpenLayers.Control.MouseDefaults());
    map.addControl(new OpenLayers.Control.MouseWheelZoom({
        wheelAction: function(evt) {
            var zoom = map.getZoom();
            if (evt.detail > 0 && zoom < map.getNumZoomLevels() - 1) map.zoomIn();
            else if (evt.detail < 0 && zoom > minZoom) map.zoomOut();
            OpenLayers.Event.stop(evt);
        }
    }));
}
