(function () {
    'use strict';

    /* ngInject */
    function MapController($scope, Config) {
        var ctl = this;
        var map;
        var url;

        initialize();

        function initialize() {
            ctl.visId = Config.cartodb.visId;
            ctl.visAccount = Config.cartodb.visAccount;
            url = 'https://' + ctl.visAccount + '.cartodb.com/api/v2/viz/' + ctl.visId + '/viz.json';

            cartodb.createVis('map', url, {
                center_lat:
                center_lon:
                zoom: 10
            })
        }

    }

    function CartoDBVis() {
        var module = {
            restrict: 'E',
            scope: {
                visId: '@',
                visAccount: '@',
                visOptions: '=',
                visFullscreen: '=',
                visFullscreenOnToggle: '&'
                // attrs
                // visFullscreenClass: 'string', class to use for the fullscreen map class
                //                     default: 'map-expanded'
                // demographics: bool, should the demographics layers be shown on the map
                //                     default: false
            },
            templateUrl: 'scripts/map/map.html',
            controller: 'MapController',
            controllerAs: 'map',
            bindToController: true
        };
        return module;
    }

    angular.module('stl.map')
    .controller('MapController', MapController)
    .directive('cartodbVis', CartoDBVis);

})();