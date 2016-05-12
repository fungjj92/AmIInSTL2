'use strict';

describe('stl.map', function () {

    var $compile;
    var $httpBackend;
    var $rootScope;

    beforeEach(inject(function (_$compile_, _$httpBackend_, _$rootScope_) {
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    it('should load directive', function () {
        var $scope = $rootScope.$new();
        var element = $compile('<div id="map"></div>')($scope);
        $rootScope.$apply();

        expect(element.find('.leaflet-tile-pane').length).toEqual(1);
    });
});
