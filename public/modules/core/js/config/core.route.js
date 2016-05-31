'use strict';

angular.module('core')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state("root",
            {
                views: {
                    "": {
                        template: '<div ui-view=""></div>'
                    }
                }
            })
            .state("home",
            {
                parent: "root",
                url: "/",
                views: {
                    "": {
                        controller: "CoreCtrl",
                        templateUrl: "modules/core/views/index.html"
                    }
                }
            });
    }]).run(['$state', function ($state) {
        $state.transitionTo('home');
    }]);