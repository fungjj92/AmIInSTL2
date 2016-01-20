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

            cartodb.createVis('map', url, {
                center_lat: 38.671899,
                center_lon: -90.417648,
                zoom: 11,
                shareable: false,
                legends: false,
                search: false,
                scrollwheel: true,
            }).done(function(vis){
                map = vis.getNativeMap();
                layers = vis.getLayers();
                ctl.sublayers = layers[1].layers;
                $scope.$apply();
                $scope.$emit('map.ready', vis, map);
            }).error(function(e){
                console.log("Error creating your map:" + e);
            });
        }

        function onSublayerClicked(sublayer, index) {
            console.log(sublayer);
            if (sublayer.visible){
                console.log(sublayer);
                sublayer.hide();
            } else {
                sublayer.show();
            }
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
            console.log(ctrlarray);
        }
    }

    angular.module('stl.map')
    .controller('VisController', VisController)
    .directive('cartodbVis', CartoDBVis);

})();