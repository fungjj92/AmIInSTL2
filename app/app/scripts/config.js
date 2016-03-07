(function() {
    'use strict';

    /**
     * Configuration for STL app
     * @type {Object}
     */
     var config = {
        //CartoDB map information
        cartodb: {
            visAccount: 'fungjj92',
            visId: '010f3abe-b488-11e5-ba54-0e5db1731f59'
        },
        //Config for html5 mode
 	    html5Mode: {
	        enabled: false,
	        prefix: ''
        },
        mapzen: {
            key: 'search-SttONrY',
            lat: 38.628499,
            lon: -90.453098,
            radius: 50
        }
     };

     angular.module('stl.config', [])
     .constant('Config', config);

})();