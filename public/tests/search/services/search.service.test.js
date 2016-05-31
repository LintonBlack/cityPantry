'use strict';

var dependencies = require('../test.dependencies');

var objectToTest = 'SearchService';

describe(objectToTest, function () {
    var service;

    dependencies.configureDepencencies();

    beforeEach(inject(function (SearchService) {
        service = SearchService;
    }));

    it('can get an instance of my factory', function() {
        expect(service).toBeDefined();
    });

    it('can get a correct value from getDummyText', function() {
        expect(service.getDummyText()).toBe('dummyText');
    });
});
