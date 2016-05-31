'use strict';

var dependencies = require('../test.dependencies');

var objectToTest = 'SearchRouterConfig';

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

    it('should respond search state', function() {
        expect(state.href('search')).toEqual('#/search');
    });

    it('redirects to otherwise page after locationChangeSuccess', function() {
        location.path('/search');
        rootScope.$emit("$locationChangeSuccess");
        expect(location.path()).toBe("/search");
    });
});
