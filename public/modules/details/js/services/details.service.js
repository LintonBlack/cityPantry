'use strict';

angular.module('details').factory('DetailsService', [function () {

    return {
        getDummyText: function(){
            return 'dummyText';
        }
    };

}]);
