'use strict';

angular.module('search').config(['$stateProvider', function($stateProvider) {
    $stateProvider.
        state("search",
        {
            parent: "root",
            url: "/search",
            views: {
                "": {
                    controller: "SearchCtrl as viewModel",
                    templateUrl: "modules/search/views/index.html"
                }
            }
        });
}]);
