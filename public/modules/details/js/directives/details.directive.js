'use strict';

angular.module('details').directive('detailsDirective', [function () {

  return {
     restrict: 'E',
     replace: true,
	    scope : {
	        itemsSelection : "=itemsSelection",
	        packageInfos : "=packageInfos"
	    },
	  templateUrl: "modules/details/views/paneldetails.html"

  };

}]);

