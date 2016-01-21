(function () {
	'use strict';

	/* ngInject */
 	function MainController($q, $rootScope, $scope, $geolocation, Config) {
 		var ctl = this;
 		var map = null;
 		var vis = null;

 		initialize();

 		function initialize() {
 			ctl.onGeolocateClicked = onGeolocateClicked;
 			
 			$scope.$on('map.ready', onVisReady);

            $('#enteraddress').click(function(){
                $(".leaflet-pelias-control").toggleClass("leaflet-pelias-expanded").find("input").focus();
            });

 		}

		function onVisReady(event, newVis, newMap) {
            vis = newVis;
            map = newMap;
            var geocoder = L.control.geocoder(Config.mapzen.key).addTo(map);

            map.on('click', function(e){
                var coords = [e.latlng.lat, e.latlng.lng];
                queryCartoDB(coords);
            });

        }

        function onAddressClicked() {
            //TODO: Ideally want the click to be in Angular, not JQuery
        }

        function onGeolocateClicked() {
        	$geolocation.getCurrentPosition({
        		enableHighAccuracy: true,
        		maximumAge: 0
        	}).then(function(position){
        		var coords = [position.coords.latitude, position.coords.longitude];
        		map.setView(coords, 16);
                
                //Add function for querying coords to CartoDB
                queryCartoDB(coords);
        	}).catch(function (e){
        		console.log("Sorry, could not geolocate you!");
        	});
        }

        function queryCartoDB(coords){
            //Query CartoDB for data at point location, of visible layers
            var popupText = [];
            var sql = cartodb.SQL({user: Config.cartodb.visAccount});
            //Query Wards
            sql.execute("SELECT * FROM wards_2010 WHERE ST_Intersects(the_geom, CDB_LatLng(" + coords +"))")
                .done(function(data){
                    if (data){
                        data = data.rows[0];
                        popupText.push('ward': data.rows[0].ward);
                    }
                })
                .error(function(e){
                    console.log(e);
                });

            //Query Munis
            sql.execute("SELECT * FROM stlmunis WHERE ST_Intersects(the_geom, CDB_LatLng(" + coords +"))")
                .done(function(data){
                    if (data) {
                        data = data.rows[0];
                        popupText.push({
                            'code': data.code,
                            'county': data.county,
                            'municipality': data.municipality_name,
                        });
                    }              
                })
                .error(function(e){
                    console.log(e);
                });

            //Add marker with info in popup window
            L.marker(coords).bindPopup("nada ahora").addTo(map);
        }

 	}

	angular.module('stl.views.main')
	  .controller('MainController', MainController);
})();