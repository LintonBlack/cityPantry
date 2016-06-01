'use strict';

angular.module('details').config(['$stateProvider', function($stateProvider) {
    $stateProvider.
        state("details",
        {
            parent: "root",
            url: "/details",
            views: {
                "": {
                    controller: "DetailsCtrl as viewModel",
                    templateUrl: "modules/details/views/index.html"
                }
            }
        });
}]);
