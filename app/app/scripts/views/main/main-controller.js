(function () {
	'use strict';

	/* ngInject */
 	function MainController() {
 		var ctl = this;

 		initialize();

 		function initialize() {

 			ctl.random = printRandom;

 			console.log("MainCtrl paging Houston. This IS working.");
 		}


		function printRandom() {
			console.log("Daresay, cowsay");
		};

 	}

	angular.module('stl.views.main')
	  .controller('MainController', MainController);
})();