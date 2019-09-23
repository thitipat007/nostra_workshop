var map,layerMarker, gLayer, routeLayer, stopPoint, points, route;

$(document).ready(function(){

    nostra.onready = function () {
        nostra.config.Language.setLanguage(nostra.language.L);
        initialize();
    };
})

function initialize() {
    map = new nostra.maps.Map("divMap", {
        id: "mapTest",
        logo: true,
        scalebar: true,
        basemap: "streetmap",
        slider: true,
        level: 10,
        lat: 13.7262435,
        lon: 100.5373896
    });
}