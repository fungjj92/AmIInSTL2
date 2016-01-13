(function () {
	'use strict';

	/* ngInject */
 	function MainController($scope) {
 		var ctl = this;
 		var map = null;
 		var vis = null;

 		initialize();

 		function initialize() {
 			
 			$scope.$on('map.ready', onVisReady);
 		}

		function onVisReady(event, newVis, newMap) {
            vis = newVis;
            map = newMap;
        }

 	}

	angular.module('stl.views.main')
	  .controller('MainController', MainController);
})();