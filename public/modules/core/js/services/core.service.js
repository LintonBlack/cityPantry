'use strict';

angular.module('core').factory('CoreService', [
            '$http', '$q', '$cacheFactory', '$window', '$location',
            function ($http, $q, $cacheFactory, $window, $location) {

    //	https://api.citypantry.com/packages/<humanId>
	//  https://api.citypantry.com/dietary-requirements
    var apiPath = 'https://api.citypantry.com/';
    var searchOptions = {};
    var messageArray = [];


    function getErrorMessage() {
		return messageArray;
	};

	function getSearchOptions() {
		return searchOptions;
	};

	function apiGet(uri, data, success, failure, always) {
              $window.urlReferer = $location.$$path;
	            $http.get(apiPath + uri, data)
	                .then(function (result) {                   
	                    success(result);
	                    if (always != null)
	                        always();
	                }, function (result) {
	                    if (failure != null) {
	                        failure(result);
	                    }
	                    else {
	                        var errorMessage = result.status + ':' + result.statusText;
	                        if (result.data != null && result.data.Message != null)
	                            errorMessage += ' - ' + result.data.Message;
	                        self.modelErrors = [errorMessage];
	                        self.modelIsValid = false;
	                    }
	                    if (always != null)
	                        always();
	                });
        }

    return {
    	getSearchOptions: getSearchOptions,
    	getErrorMessage:getErrorMessage,
        searchOptions : searchOptions,
        messageArray : messageArray,
        apiGet: apiGet
    };

}]);