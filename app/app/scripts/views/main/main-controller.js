(function () {
	'use strict';

	/* ngInject */
 	function MainController($rootScope, $scope, $geolocation) {
 		var ctl = this;
 		var map = null;
 		var vis = null;
 		

 		initialize();

 		function initialize() {
 			ctl.onGeolocateClicked = onGeolocateClicked;
 			
 			$scope.$on('map.ready', onVisReady);

 		}

		function onVisReady(event, newVis, newMap) {
            vis = newVis;
            map = newMap;

        }

        function onGeolocateClicked() {
        	$geolocation.getCurrentPosition({
        		enableHighAccuracy: true,
        		maximumAge: 0
        	}).then(function(position){
        		console.log(position);
        		map.setView([
        			position.coords.latitude, position.coords.longitude], 16);
        		//TODO: query CartoDB for data at location of layers that are turned on
        	}).catch(function (e){
        		console.log("Sorry, could not geolocate you!");
        	});
        }

 	}

	angular.module('stl.views.main')
	  .controller('MainController', MainController);
})();