(function () {
	'use strict';

	/* ngInject */
 	function MainController($rootScope, $scope, $geolocation, Config) {
 		var ctl = this;
 		var map = null;
 		var vis = null;

        var tables = [
            'stlwards',
            'stlmunis',
            'stlhoods2013'
        ];

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
                console.log(e.latlng);
                var coords = [e.latlng.lat, e.latlng.lng];
                queryCartoDB(coords);
            });
        }

        function onAddressClicked() {
            //Ideally want the click to be in Angular, not JQuery
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
            //TODO: query CartoDB for data at location of layers that are turned on; add marker
            var sql = cartodb.SQL({user: Config.cartodb.visAccount});
            console.log(coords);
            sql.execute("SELECT * FROM stlwards WHERE ST_Intersects(the_geom, CDB_LatLng(" + coords +"))")
                .done(function(data){
                    console.log(data.rows);
                    L.marker(coords).bindPopup("TODO: Bind CartoDB SQL text" + data.rows).addTo(map);
                })
                .error(function(e){
                    console.log(e);
                });
        }

 	}

	angular.module('stl.views.main')
	  .controller('MainController', MainController);
})();