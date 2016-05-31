'use strict';

var dependencies = require('../test.dependencies');

var objectToTest = 'DetailsRouterConfig';

describe(objectToTest, function () {
    var rootScope,
        state,
        location;

    dependencies.configureDepencencies();

    beforeEach(inject(function ($rootScope, $state, $location) {
        rootScope = $rootScope;
        state = $state;
        location = $location;
    }));

    it('should respond details state', function() {
        expect(state.href('details')).toEqual('#/details');
    });

    it('redirects to otherwise page after locationChangeSuccess', function() {
        location.path('/details');
        rootScope.$emit("$locationChangeSuccess");
        expect(location.path()).toBe("/details");
    });
});
