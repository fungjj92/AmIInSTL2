(function () {
    'use strict';

    /* ngInject */
    function VisController($scope, Config) {
        var ctl = this;
        var map;
        var url;

        initialize();

        function initialize() {
            ctl.visId = Config.cartodb.visId;
            ctl.visAccount = Config.cartodb.visAccount;
            url = 'https://' + ctl.visAccount + '.cartodb.com/api/v2/viz/' + ctl.visId + '/viz.json';

            cartodb.createVis('map', url, {
                center_lat: 38.671899,
                center_lon: -90.417648,
                zoom: 11,
                shareable: false,
            }).done(function(vis){
                map = vis.getNativeMap();
                $scope.$emit('map.ready', vis, map);
            }).error(function(e){
                console.log(e);
            });
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
            bindToController: true
        };
        return module;
    }

    angular.module('stl.map')
    .controller('VisController', VisController)
    .directive('cartodbVis', CartoDBVis);

})();