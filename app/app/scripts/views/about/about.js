(function() {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('about', {
            url: '/about',
            templateUrl: 'scripts/views/about/about.html',
            controller: 'AboutController',
            controllerAs: 'about'
        });
    }

    angular.module('stl.views.about', [
        'ui.router',
    ])
    .config(StateConfig);
})();
