(function () {
    'use strict';

     /* ngInject */
    function DefaultRoutingConfig($locationProvider, $urlRouterProvider, Config) {

        $locationProvider.html5Mode(Config.html5Mode.enabled);
        $locationProvider.hashPrefix(Config.html5Mode.prefix);

        $urlRouterProvider.otherwise('/');
    }


    /**
     * @ngdoc overview
     * @name stl
     * @description
     * # stl
     *
     * Main module of the application.
     */
    angular.module('stl', [
        'stl.config',
        'stl.views.main',
        'stl.views.about'
    ])
    .config(DefaultRoutingConfig);
})();
