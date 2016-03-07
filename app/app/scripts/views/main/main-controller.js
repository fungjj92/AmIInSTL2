(function () {
	'use strict';

	/* ngInject */
 	function MainController($q, $rootScope, $scope, $geolocation, Config) {
 		var ctl = this;
 		var map = null;
 		var vis = null;

 		initialize();

 		function initialize() {
            ctl.error = null;
            ctl.popupText;
 			ctl.onGeolocateClicked = onGeolocateClicked;
 			
 			$scope.$on('map.ready', onVisReady);

            $('#enteraddress').click(function(){
                $(".leaflet-pelias-control").toggleClass("leaflet-pelias-expanded").find("input").focus();
            });

 		}

		function onVisReady(event, newVis, newMap) {
            vis = newVis;
            map = newMap;
            var clicks = 0;
            var timer = null;

            //Query and add marker on single click, delay to distinguish double-click
            map.on('click', function(e){
                clicks ++;
                if (clicks === 1){
                    timer = setTimeout(function(){
                        clicks = 0;
                        var coords = [e.latlng.lat, e.latlng.lng];
                        queryCartoDB(coords);
                    }, 700);
                } else {
                    clearTimeout(timer);
                    clicks = 0;
                }
            });
 
        }

        function onGeolocateClicked() {
        	$geolocation.getCurrentPosition({
        		enableHighAccuracy: true,
        		maximumAge: 0
        	}).then(function(position){
        		var coords = [position.coords.latitude, position.coords.longitude];
        		map.setView(coords, 16);
                queryCartoDB(coords);
        	}).catch(function (e){
        		ctl.error = "Sorry, could not geolocate you!";
        	});
        }

        function queryCartoDB(coords){
            //Query CartoDB for data at point location, of visible layers
            ctl.popupText = null;
            $scope.website = null;
            var sql = cartodb.SQL({user: Config.cartodb.visAccount});
            var dfdNbhoods = $q.defer();
            var dfdWards = $q.defer();
            var dfdMunis = $q.defer();

            function getNhds(coords){
                sql.execute("SELECT * FROM stlhoods2013 WHERE ST_Intersects(the_geom, CDB_LatLng(" + coords +"))")
                .done(function(data){
                    dfdNbhoods.resolve(data);
                }).error(function(e){ 
                    dfdNbhoods.reject(e);
                });
                return dfdNbhoods.promise;
            }

            function getWards(coords){
                sql.execute("SELECT * FROM wards_2010 WHERE ST_Intersects(the_geom, CDB_LatLng(" + coords +"))")
                .done(function(data){
                    dfdWards.resolve(data);
                }).error(function(e){ 
                    dfdWards.reject(e);
                });
                return dfdWards.promise;
            }

            function getMunis(coords){
                sql.execute("SELECT * FROM stlmunis WHERE ST_Intersects(the_geom, CDB_LatLng(" + coords +"))")
                .done(function(data){
                    dfdMunis.resolve(data);
                }).error(function(e){ 
                    dfdMunis.reject(e);
                });
                return dfdMunis.promise;
            }

            return $q.all([getWards(coords), getNhds(coords), getMunis(coords)])
            .then(function (data){
                console.log(data);
                return sortData(data);
            }).then(function(result){
                addMarker(coords, result);
            }).catch(function (e){
                ctl.error = e;
            });
        }

        function sortData(data){
            var popupText = {};

            //handle ward data
            if (data[0].rows.length){
                var wardData = data[0].rows[0];
                _.extend(popupText, {
                    'Ward': wardData.ward
                });
            }

            //handle neighborhood data
            if (data[1].rows.length){
                var nhdData = data[1].rows[0];
                _.extend(popupText, {
                    'Neighborhood': nhdData.nhd_name,
                    'Neighborhood #': nhdData.nhd_num
                });
            }

            //handle muni data
            if (data[2].rows.length){
                var muniData = data[2].rows[0];
                _.extend(popupText, {
                    'Code': muniData.code,
                    'County': muniData.county,
                    'Municipality': muniData.municipality_name
                });
                $scope.website = 'Website: <a href="http://www.stlouisco.com/YourGovernment/Municipalities/' +
                    muniData.county + '/' + muniData.municipality_name + '" target="_blank">Link</a>';
            }
            return popupText;
        }            

        function addMarker(coords, text){
            L.marker(coords).addTo(map).on('click', showInfo(text));
        }

        function showInfo(text){
            ctl.popupText = text;
        }
    }

	angular.module('stl.views.main')
	.controller('MainController', MainController);

})();