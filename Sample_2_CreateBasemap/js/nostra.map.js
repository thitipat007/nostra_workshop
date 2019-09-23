
try {

    $(document).ready(function () {
        let basemap, speialLayer;

        nostra.onready = function () {
            nostra.config.Language.setLanguage(nostra.language.L);
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
        };
        
        document.getElementById("btnStreetMap").onclick = function () {
            basemap = new nostra.maps.layers.StreetMap(map);
            map.addLayer(basemap);
        }

        document.getElementById("btnImagery").onclick = function () {
            basemap = new nostra.maps.layers.Imagery(map);
            map.addLayer(basemap);
        }
        document.getElementById("btnOpenStreetMap").onclick = function () {
            basemap = new nostra.maps.layers.OpenStreetMap(map);
            map.addLayer(basemap);
        }

        document.getElementById("btnNOSTRAGuide").onclick = function () {
            speialLayer = new nostra.maps.layers.NOSTRAGuide(map);
            map.addLayer(speialLayer);
        }

        document.getElementById("btnNOSTRATraffic").onclick = function () {
            speialLayer = new nostra.maps.layers.NOSTRATraffic(map);
            map.addLayer(speialLayer);
        }

        document.getElementById("btnWeatherForecast").onclick = function () {
            speialLayer = new nostra.maps.layers.WeatherForecast(map);
            map.addLayer(speialLayer);
        }
    })
} catch (e) {
    console.log(e)
}