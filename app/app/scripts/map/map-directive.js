(function () {
    'use strict';

    /* ngInject */
    function VisController($attrs, $scope, Config) {
        var ctl = this;
        var map;
        var url;
        var layers;

        initialize();

        function initialize() {
            ctl.visId = Config.cartodb.visId;
            ctl.visAccount = Config.cartodb.visAccount;
            url = 'https://' + ctl.visAccount + '.cartodb.com/api/v2/viz/' + ctl.visId + '/viz.json';
            ctl.sublayers = [];
            ctl.checkbox = [true, true, true];
            ctl.onSublayerClicked = onSublayerClicked;
            ctl.tables = [
                'stlhoods2013',
                'stlmunis',
                'stlwards'
            ];

            //Initialize map from Cartodb.js
            cartodb.createVis('map', url, {
                center_lat: Config.mapzen.lat,
                center_lon: Config.mapzen.lon,
                zoom: 11,
                shareable: false,
                legends: false,
                search: false,
                scrollwheel: true,
            }).done(function (vis) {
                map = vis.getNativeMap();
                //Add cartodb layers to map
                layers = vis.getLayers();
                ctl.sublayers = layers[1].getSubLayers();
                //Add mapzen search
                var geocoder = L.control.geocoder(Config.mapzen.key).addTo(map);
                $scope.$apply();
                $scope.$emit('map.ready', vis, map);
            }).error(function(e){
                console.log("Error creating your map:" + e);
            });
        }

        function onSublayerClicked(sublayer, index) {
            sublayer.toggle();
        }

    }

    function CartoDBVis() {
        var module = {
            restrict: 'E',
            scope: {
                visId: '@',
                visAccount: '@'
            },
            templateUrl: 'scripts/map/map.html',
            controller: 'VisController',
            controllerAs: 'vis',
            bindToController: true,
            link: link
        };
        return module;

        function link(scope, element, attrs, ctrlarray) {
        }
    }

    angular.module('stl.map')
    .controller('VisController', VisController)
    .directive('cartodbVis', CartoDBVis);

})();