(function() {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('main', {
            url: '/',
            templateUrl: 'scripts/views/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
        });
    }

    angular.module('stl.views.main', [
        'ui.router',
        'stl.map'
    ])
    .config(StateConfig);
})();
