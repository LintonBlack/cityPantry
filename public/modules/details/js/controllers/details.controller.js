'use strict';

//Populate Data
/*
arr = [];
*/

function _errorMessage(messages, copy) {
    messages[0] =copy;
}
function _createPackages(arr, target, ctn, options, messages) {
    angular.forEach(arr, function(packageItem) {                     
                        // Default and Upgrade items
                        switch (packageItem.isUpgrade) {
                            case false:
                            ctn += packageItem.item.options.length;
                            target.selected.push(packageItem.item);
                            break;
                            default:                           
                            target.unselected.push(packageItem.item);
                        }                                            
                    });
    _createOptionsQte(target.selected, options, ctn, messages);
 }
 
 //
 function _createOptionsQte(arr, options, counterTotal, messages) {
    var dietaryRequirements = options.dietaryRequirements;
    if(dietaryRequirements.length === 0) {
        _createOptionsQteNoDietaryRequirements(arr, options, counterTotal,messages);
       } else {
        _createOptionsQteDietaryRequirements(arr, options, counterTotal, messages);
       }
 }

function _createOptionsQteDietaryRequirements(arr, options, counterTotal, messages) {
    console.log(counterTotal);
    var dietaryRequirements = options.dietaryRequirements;
    var minimumQuantity = Math.floor(options.headCount/counterTotal);
    var reminder = options.headCount%counterTotal;
    var ctn = 0;
    var total = 0;
    var totalOptions = 0;
   
        for(var i = 0; i< dietaryRequirements.length; i++) {  
            var qte =  dietaryRequirements[i].quantity;
            var doit = true;
            total = total + qte;
            var name =  dietaryRequirements[i].name; 
           var param = false;
            while(doit) {
                ctn = 0;

               (function() {               
                
                    angular.forEach(arr, function(item) { 
                    for(var k = 0; k < item.options.length; k++) {
                        //Requirements                        
                        if(item.options[k].dietaryRequirements.length != 0) {
                            
                            var dt = item.options[k].dietaryRequirements;
                            angular.forEach(dt, function(diet) { 
                                
                                if(name === diet.name) {
                                    if(!item.options[k].quantity) {
                                       item.options[k].quantity = 0; 
                                       item.options[k].incremented = true;
                                       totalOptions = totalOptions + 1;
                                    }

                                     item.options[k].quantity++;
                                     qte = qte - 1;
                                     param = true;
                                     console.log(param)
                                }
                            })
                        } 
                        
                        if(qte === 0 || ctn === item.options.length && param=== false) {
                            doit = false;
                            if(!param) {
                                _errorMessage(messages, 'the requirements could not be fullfilled');
                                
                            }
                            return
                        } else {
                          if(k === item.options.length - 1) {
                               k = 0; 
                                }  
                        }

                     ctn++;                    
                        
                    }
                })
               })(ctn);                
            }                      
        }
    
        
        _createOptionsQteNoDietaryRequirements(arr, options, counterTotal, total, totalOptions);
       /* angular.forEach(arr, function(item) { 
        debugger                       
                            for(var i = 0; i< item.options.length; i++) {
                                counterTotal--;
                                if(counterTotal !=0) {
                                    if(ctn < (options.headCount - reminder)) {
                                        item.options[i].quantity = minimumQuantity;
                                        ctn += minimumQuantity;
                                    }
                                } else {                                    
                                     if(ctn < (options.headCount)) {
                                        item.options[i].quantity = options.headCount - ctn;
                                        ctn = options.headCount;
                                    } else {
                                       item.options[i].quantity = 0; 
                                    }
                                }                             
                                               
                            }
                      });*/
 }
 
 function _createOptionsQteNoDietaryRequirements(arr, options, counterTotal, alreadyIncremented, totalOptions) {
   
    if(totalOptions) {
            counterTotal = counterTotal - totalOptions;
    }

    if(alreadyIncremented) {
        options.headCount = options.headCount - alreadyIncremented;
    }
    
    var minimumQuantity = Math.floor(options.headCount/counterTotal);
    var reminder = options.headCount%counterTotal;
    var ctn = 0;
        angular.forEach(arr, function(item) {                        
                            for(var i = 0; i< item.options.length; i++) {
                                
                                if(item.options[i].incremented) {

                                } else {
                                    counterTotal--;
                                    if(counterTotal !=0) {
                                        if(ctn < (options.headCount - reminder)) {
                                            item.options[i].quantity = minimumQuantity;
                                            ctn += minimumQuantity;
                                            }
                                    } else {                                    
                                         if(ctn < (options.headCount)) {
                                            item.options[i].quantity = options.headCount - ctn;
                                            ctn = options.headCount;
                                        } else {
                                           item.options[i].quantity = 0; 
                                        }
                                    } 
                                }                                                           
                                               
                            }
                      });
 }                     

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
                    var packageItems = packages.packageItems; 
                    var headCount;
                    var counterTotalOptions = 0;
                    var DietaryRequirements = [];
                    var i = 0;
                    // Package Infos
                    $scope.packageInfos = {};                    
                    $scope.packageInfos.image = packages.images[0].medium;
                    $scope.packageInfos.pricePerPerson = '£'+packages.pricePerPerson;
                    $scope.packageInfos.name = packages.name;
                    $scope.packageInfos.description = packages.description;
                    //Message
                    $scope.messages = [];                    
                    //
                    $scope.detailsPackages = packageItems; 
                    $scope.itemsSelection = {}; 
                    $scope.itemsSelection.selected = []; 
                    $scope.itemsSelection.unselected = []; 

                    
                    // Requirements Check
                    /** 1: headCount*/
                    headCount = parseInt($scope.searchOptions.headCount);                                   
                    
                    if(headCount > parseInt(packages.maxPeople))
                    {
                        $scope.messages.push("Sorry, But this vendor provide catering for a maximum of"+packages.maxPeople);
                        return;
                    }
                    if(headCount < parseInt(packages.minPeople))
                         {
                        $scope.messages.push("Sorry, But this vendor provide catering for a minimum of"+packages.minPeople);
                        return;
                    }                 
                    //
                    _createPackages(
                        packageItems,
                        $scope.itemsSelection,
                        counterTotalOptions,
                        $scope.searchOptions,
                        $scope.messages)
                    //
                    
        

                } else {
                   //No Results
                }
              
            }, function(error) {
             // errors
           
        });
        }

        $scope.search();
}]);
