
try {

    $(document).ready(function () {
        var basemap, speialLayer,
            locations = [], latCurrent,
            lonCurrent, pointLayer, routeLayer,
            gpMarkerPoint = null,
            enableMapClick = false,
            routeOption =


                nostra.onready = function () {
                    nostra.config.Language.setLanguage(nostra.language.L);

                    routeOption = {
                        impedance: nostra.services.network.impedance.TIME,
                        mode: nostra.services.network.mode.CAR,
                        tollroad: false,
                        findBestSequence: false,
                        preserveLastStop: false,
                        tollroad: false
                    }

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
                    initYourLocation();

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

        document.getElementById("btnRoute").onclick = function () {
            direction();
        }

        document.getElementById("btnCar").onclick = function () {
            routeOption.mode = nostra.services.network.mode.CAR;
            direction();
        }

        document.getElementById("btnBicycle").onclick = function () {
            routeOption.mode = nostra.services.network.mode.BICYCLE;
            direction();
        }

        document.getElementById("btnWalk").onclick = function () {
            routeOption.mode = nostra.services.network.mode.WALK;
            direction();
        }

        document.getElementById("btnMotercycle").onclick = function () {
            routeOption.mode = nostra.services.network.mode.MOTORCYCLE;
            direction();
        }

        document.getElementById("switchFindBestSeq").onchange = function (evt) {
            routeOption.findBestSequence = evt.target.checked;
            direction();
        }

        document.getElementById("switchPreserveLastStop").onchange = function (evt) {
            routeOption.preserveLastStop = evt.target.checked;
            direction();
        }

        document.getElementById("switchTollRoad").onchange = function (evt) {
            routeOption.tollroad = evt.target.checked;
            direction();
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

                if (index != 0) {
                    var btnRemove = document.createElement("button");
                    btnRemove.className = "btn btn-danger btn-sm";
                    btnRemove.innerHTML = "X";
                    divRemove.appendChild(btnRemove);

                    btnRemove.onclick = function () {
                        removeLocation(index)
                    }
                }
                mainDiv.appendChild(divMain);
            });
        }

        function removeLocation(index) {
            pointLayer.removeGraphic(locations[index].gpMaker);
            locations = locations.filter(function (obj, findex) {
                return index != findex
            })
            routeLayer.clear();
            createLocationList();
        }

        function initGraphicLayer() {
            routeLayer = new nostra.maps.layers.GraphicsLayer(map, {
                id: "routeLayer"
            });
            map.addLayer(routeLayer);

            pointLayer = new nostra.maps.layers.GraphicsLayer(map, {
                id: "pointLayer"
            });
            map.addLayer(pointLayer);
        }

        function handleAddLocation(lat, lon) {
            if (gpMarkerPoint == null && enableMapClick) {
                latCurrent = lat;
                lonCurrent = lon;

                callIdentifyService();

                var pointMarker = new nostra.maps.symbols.Marker({
                    width: 60,
                    height: 60,
                    draggable: true
                });

                pointMarker.onDragEnd = function (point) {
                    latCurrent = point.lat;
                    lonCurrent = point.lon;
                    callIdentifyService(point.lat, point.lon);
                }

                var gp = pointLayer.addMarker(latCurrent, lonCurrent, pointMarker);
                gpMarkerPoint = gp;
            }
        }

        function callIdentifyService() {
            locationTextLoading(true);
            var key = "GOxQQtdmC5KMtuUxe(KnbpBxyLXlWIRuJU1e(Wz0nfHiBIeRipI)oKCFHvA)4d9asslulelApKSbw8i(CuGkqb0=====2";
            var url = "https://api.nostramap.com/Service/V2/Location/Identify?key=" + key + "&lat=" + latCurrent + "&lon=" + lonCurrent

            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: function (res) {
                    locationTextLoading(false);
                    if (res != null) {
                        document.getElementById("locationNameInput").value = res.results[0].Name_L;
                    }
                },
                error: function (err) {
                    locationTextLoading(false);
                    console.log("nostra identify error: ", err);
                }
            });
        }

        function initYourLocation() {
            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(function (position) {

                    var marker = new nostra.maps.symbols.Marker({
                        url: "https://png.pngtree.com/png-clipart/20190516/original/pngtree-vector-location-icon-png-image_3778133.jpg",
                        width: 60,
                        height: 60,
                        draggable: false,
                        label: "Start Location"
                    });
                    var locaitonMarker = pointLayer.addMarker(position.coords.latitude, position.coords.longitude, marker);

                    var obj = {
                        id: locations.length + 1,
                        name: "Your location",
                        description: "",
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        gpMaker: locaitonMarker
                    }
                    locations.push(obj);
                    createLocationList();
                });
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }

        function direction() {
            routeLayer.clear();

            var route = new nostra.services.network.route();
            route.clearStopPoint();
            route.country = "TH";
            route.returnedRouteDetail = true;
            route.preserveFirstStop = true;

            route.impedance = routeOption.impedance;
            route.mode = routeOption.mode;
            route.tollroad = routeOption.tollroad;
            route.findBestSequence = routeOption.findBestSequence;
            route.preserveLastStop = routeOption.preserveLastStop;

            locations.map(function (location, index) {
                var stop = new nostra.services.network.stopPoint({
                    name: location.name,
                    lat: location.lat,
                    lon: location.lon
                });
                route.addStopPoint(stop);
            });

            route.solve(function (solveResult) {
                if (solveResult.errorMessage == null) {
                    routeLayer.addRoute(solveResult, '#007aff', 1);
                    console.log(solveResult);
                    // console.log(solveResultใnostraResults.useTollRoad);
                    // totalLength: 36758.381931642594
                    // totalTime: 47.201888244599104
                    reOrderLocaitons(solveResult.nostraResults.stops);
                    showRouteResult(solveResult.nostraResults.totalLength, solveResult.nostraResults.totalTime);
                }
            });
        }

        function reOrderLocaitons(stops) {
            var newLocations = [];
            stops.map(function (stop) {
                var result = locations.filter(function (location) {
                    return location.id == stop.sequence
                });
                newLocations.push(result[0]);
            });
            locations = newLocations;
            createLocationList();
        }

        function locationTextLoading(isLoad) {
            document.getElementById("locationNameInput").value = "";
            document.getElementById("locationNameInput").placeholder = (isLoad) ? "name of location loading..." : "";
        }

        function showRouteResult(distance, time) {
            var calTime = parseFloat((time / 60)).toFixed(0) + " hr. " + parseFloat((time % 60)).toFixed(0) + " min.";
            var calDistance = parseFloat(distance / 1000).toFixed(2) + ' Km';
            var calFuelConsumption = (parseFloat((distance / 1000) / 14)).toFixed(2) + " L.";
            var calEstFuelCost = "฿" + (parseFloat(((distance / 1000) / 14) * 35.36).toFixed(2)); 
            //14 
            document.getElementById("divTime").innerText = calTime;
            document.getElementById("divDistance").innerText = calDistance;
            document.getElementById("divFuelConsumption").innerText = calFuelConsumption;
            document.getElementById("divEstFuelCost").innerText = calEstFuelCost;

        }
    })
} catch (e) {
    console.log(e)
}