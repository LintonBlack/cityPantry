'use strict';

angular.module('search').directive('searchDirective', [function () {

  return {
     restrict: 'E',
     replace: true,
	   scope : {
	        searchOptions : "=searchOptions",
	        packagesList : "=packagesList",
	        dietaryRequirements : "=dietaryRequirements",
	        search : "=search",	       
	        changeQte : "=changeQte",
	        errorCount : "=errorCount"
	    },
	 templateUrl: "modules/search/views/panelsearch.html",
	  link: function (scope, element, attrs, model) {
	 	
	 }
  };

}]);
