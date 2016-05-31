'use strict';

angular.module('details')
    .controller('DetailsCtrl', ['$scope','CoreService', function($scope, CoreService){
        

    	$scope.searchOptions = CoreService.getSearchOptions();
        $scope.messages = CoreService.getErrorMessage();
        $scope.search = function() {
            // Get packages 
            
        CoreService.apiGet('packages/' + $scope.searchOptions.selectedHumanId.packageId, null,
            function (results) {                
                if (results.data.success) {
                    var packages = results.data.package
                    // Package Infos
                    $scope.packageInfos = {};                    
                    $scope.packageInfos.image = packages.images[0].medium;
                    $scope.packageInfos.pricePerPerson = '£'+packages.pricePerPerson;
                    $scope.packageInfos.name = packages.name;
                    $scope.packageInfos.description = packages.description;
                    //Initialize error message
                    $scope.messages = [];
                    // Results
                    /** 1: headCount*/
                    if(parseInt($scope.searchOptions.headCount) > parseInt(packages.maxPeople))
                    {
                        $scope.messages.push("Sorry, But this vendor provide catering for a maximum of"+packages.maxPeople);
                        return;
                    }
                    if(parseInt($scope.searchOptions.headCount) < parseInt(packages.minPeople))
                         {
                        $scope.messages.push("Sorry, But this vendor provide catering for a minimum of"+packages.minPeople);
                        return;
                    }

                                   
                    /** 2 : dietary*/
                    var packageItems = packages.packageItems; 

                    $scope.detailsPackages = packageItems; 
                    $scope.itemsSelection = {}; 
                    $scope.itemsSelection.selected = []; 
                    $scope.itemsSelection.unselected = []; 

                    var counterTotalOptions = 0;
                    var DietaryRequirements = [];
                    var i = 0;
                    angular.forEach(packageItems, function(packageItem) {                     
                        // Default and Upgrade items
                        switch (packageItem.isUpgrade) {
                            case false:
                            counterTotalOptions += packageItem.item.options.length;
                            $scope.itemsSelection.selected.push(packageItem.item);
                            break;
                            default:                           
                            $scope.itemsSelection.unselected.push(packageItem.item);
                        }                                            
                    });

                    var minimumQuantity = Math.floor($scope.searchOptions.headCount/counterTotalOptions);
                    var reminder = $scope.searchOptions.headCount%counterTotalOptions;
                    var counter = 0;
                    var counterTotalOptionsSd = counterTotalOptions;
                    
                      angular.forEach($scope.itemsSelection.selected, function(item) {
                        
                            for(var i = 0; i< item.options.length; i++) {
                                counterTotalOptionsSd--;
                                if(counterTotalOptionsSd !=0) {
                                    if(counter < ($scope.searchOptions.headCount - reminder)) {
                                        item.options[i].quantity = minimumQuantity;
                                        counter += minimumQuantity;
                                    }
                                } else {                                    
                                     if(counter < ($scope.searchOptions.headCount)) {
                                        item.options[i].quantity = $scope.searchOptions.headCount - counter;
                                        counter = $scope.searchOptions.headCount;
                                    } else {
                                       item.options[i].quantity = 0; 
                                    }
                                }
                                

                                                
                            }
                      });

                } else {
                   //No Results
                }
              
            }, function(error) {
             // errors
           
        });
        }

        $scope.search();
}]);
