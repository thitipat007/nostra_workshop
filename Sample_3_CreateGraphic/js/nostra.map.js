
try {

    $(document).ready(function () {
        let basemap, speialLayer,
            locations = [], latCurrent,
            lonCurrent, pointLayer, 
            gpMarkerPoint = null,
            enableMapClick = false;

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

            initGraphicLayer();
           
            map.events.click = function (evt) {
                handleAddLocation(evt.mapPoint.getLatitude(), evt.mapPoint.getLongitude());          
            }
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

        document.getElementById("btnCreateLocation").onclick = function () {
            document.getElementById("createPinPanal").style.display = "block";
            document.getElementById("btnCreateLocation").style.display = "none";
            document.getElementById("locationNameInput").value = "";
            document.getElementById("descriptionInput").value = "";
            enableMapClick = true;
        }

        document.getElementById("btnAddLocation").onclick = function () {
            document.getElementById("createPinPanal").style.display = "none";
            document.getElementById("btnCreateLocation").style.display = "block";

            var name = document.getElementById("locationNameInput").value;
            var desc = document.getElementById("descriptionInput").value;

            enableMapClick = false;
            pointLayer.removeGraphic(gpMarkerPoint);
            gpMarkerPoint = null;

            var callout = new nostra.maps.CustomCallout({
                content: name,
                width: 100,
                height: 100,
                // color: arrCallout[i].color,
                // fontSize: arrCallout[i].fontSize,
                // fontColor: arrCallout[i].fontColor,
                // fontFamily: arrCallout[i].fontFamily,
                // showShadow: true
            })

            var marker = new nostra.maps.symbols.Marker({
                url: "https://png.pngtree.com/png-clipart/20190516/original/pngtree-vector-location-icon-png-image_3778133.jpg",
                width: 60,
                height: 60,
                draggable: false,
                customCallout: callout
            });
            var locaitonMarker = pointLayer.addMarker(latCurrent, lonCurrent, marker);

            var obj = {
                id: locations.length + 1,
                name: name,
                description: desc,
                lat: latCurrent,
                lon: lonCurrent,
                gpMaker: locaitonMarker
            }
            locations.push(obj);
            createLocationList();
        }

        function createLocationList() {
            var mainDiv = document.getElementById("locationList");
            mainDiv.innerHTML = "";

            locations.map(function (location, index) {
                var divMain = document.createElement("div");
                divMain.className = "row list-location"

                var divNumber = document.createElement("div");
                divNumber.className = "col-md-2";
                divNumber.innerHTML = index + 1;
                divMain.appendChild(divNumber);

                var divName = document.createElement("div");
                divName.className = "col-md-8";
                divName.innerHTML = location.name;
                divMain.appendChild(divName);

                var divRemove = document.createElement("div");
                divRemove.className = "col-md-2";
                divMain.appendChild(divRemove);

                var btnRemove = document.createElement("button");
                btnRemove.className = "btn btn-danger btn-sm";
                btnRemove.innerHTML = "X";
                divRemove.appendChild(btnRemove);

                btnRemove.onclick = function () {
                    removeLocation(index)
                }

                mainDiv.appendChild(divMain);
            });
        }

        function removeLocation(index) {
            pointLayer.removeGraphic(locations[index].gpMaker);
            locations = locations.filter(function (obj, findex) {
                return index != findex
            })
            createLocationList();
        }

        function initGraphicLayer() {
            pointLayer = new nostra.maps.layers.GraphicsLayer(map, {
                id: "pointLayer"
            });
            map.addLayer(pointLayer);
        }

        function identifyLocationAndCreatePin() {
            var key = "GOxQQtdmC5KMtuUxe(KnbpBxyLXlWIRuJU1e(Wz0nfHiBIeRipI)oKCFHvA)4d9asslulelApKSbw8i(CuGkqb0=====2";
            var url = "https://api.nostramap.com/Service/V2/Location/Identify?key=" + key + "&lat=" + latCurrent + "&lon=" + lonCurrent

            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: function (res) {
                    if(res != null){
                        document.getElementById("locationNameInput").value = res.results[0].Name_L;
                    }
                },
                error: function (err) {
                    console.log("nostra identify error: ", err);
                }
            });

            var pointMarker = new nostra.maps.symbols.Marker({
                width: 60,
                height: 60,
                draggable: true
            });

            var gp = pointLayer.addMarker(latCurrent, lonCurrent, pointMarker);
            gpMarkerPoint = gp;
        }

        function handleAddLocation(lat, lon) {
            if (gpMarkerPoint == null && enableMapClick) {
                latCurrent = lat;
                lonCurrent = lon;

                identifyLocationAndCreatePin();
            }
        }

    })


} catch (e) {
    console.log(e)
}