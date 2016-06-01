'use strict';

//Populate Data
/*
isUpgrade = Boolean;
quantity = Number;
defaultPrice = Number;
name = String;
hasDietaryRequirement = Boolean;
dietaryRequirements = [];
*/
                   
function Dish(isUpgrade, quantity, defaultPrice, name, hasDietaryRequirement, dietaryRequirements) {
    this.quantity = quantity;
    this.isUpgrade = isUpgrade;
    this.defaultPrice = defaultPrice;
    this.name =name;
    this.hasDietaryRequirement = hasDietaryRequirement;
    this.dietaryRequirements = dietaryRequirements;
    //new Property
   if(hasDietaryRequirement) {
        for(var i = 0; i < dietaryRequirements.length; i++ ) {
          var key = dietaryRequirements[i].name;
            this[key] = true;
       }
   }
}

//Create Package
/*arr = [];
//obj = new Dish {}
*/
function _createPackages(arr, obj) {
  arr.push(obj);
}

//Check if Option has dietary requirements
/*arr = [];
*/
function _hasDietaryRequirement(arr) {
    var hasDietaryRequirement = false;

    if(arr.length > 0) {
      hasDietaryRequirement = true;
    } 

    return hasDietaryRequirement; 
}

//Dispatch to define quantity for each options
/*arr = [];
/*options = {};
*/
function _Dispatch(arr, options,messages) {
  var dietaryRequirements = options.dietaryRequirements;
  if(dietaryRequirements.length) {
    _DispatchWithDietary(arr, options,messages);
  } else {
    _DispatchNoDietary(arr, options,messages);
  }
}

function _DispatchWithDietary(arr, options,messages) {
  var dietaryRequirements = options.dietaryRequirements;
  var headCount = options.headCount;
  var canProvideRequirement;  
  var requirementCount = 0;
  var stop = false;
  var ctn;
  var existingItemWithNoRequirement = false;
  var i = 0;
  while(headCount > 0) {
      // if dietaryRequirement options
      if(dietaryRequirements.length != 0 && dietaryRequirements.length != i) {
        //
        for(i ; i < dietaryRequirements.length; i++) {          
          //
          canProvideRequirement = false;
          while(dietaryRequirements[i].quantity > 0) {
            //
            ctn = 0;          
            angular.forEach(arr, function(item) {
                if(item.hasDietaryRequirement && item[dietaryRequirements[i].name]) {
                  item.quantity++;
                  canProvideRequirement = true;
                  dietaryRequirements[i].quantity = dietaryRequirements[i].quantity -1;
                  headCount = headCount -1;                
                } 
                ctn++;
            });

            if(ctn === arr.length && !canProvideRequirement) {
                messages.push("the requirements "+ dietaryRequirements[i].quantity +" Meal(s) "+ dietaryRequirements[i].name +" could not be fullfilled");           
                dietaryRequirements[i].quantity = 0;
              }

          };
          requirementCount++;
        }
      } else {
        //                   
            angular.forEach(arr, function(item) {
               if(headCount === 0) {
                return;
              }  
          // increment options with no requirements              
              if(!item.hasDietaryRequirement) {
               
                  item.quantity++;
                  headCount = headCount -1;
                  existingItemWithNoRequirement = true;             
             } 
          // All some options have dietary requirement and an requirement can't be fullfilled so I increment all of them
             if(item.hasDietaryRequirement && !canProvideRequirement && !existingItemWithNoRequirement) {              
                  
                  item.quantity++;
                  headCount = headCount -1; 
             }
            // All some options have dietary requirement and an requirement can't be fullfilled so I increment all of them
             if(item.hasDietaryRequirement && !canProvideRequirement && existingItemWithNoRequirement) {              
                  
                  item.quantity++;
                  headCount = headCount -1; 
             }  
          // All some options have dietary requirement
             if(item.hasDietaryRequirement && !existingItemWithNoRequirement) {            
                  item.quantity++;
                  headCount = headCount -1; 
             }  

            });
      }
    }
}

function _DispatchNoDietary(arr, options,messages) {
  var dietaryRequirements = options.dietaryRequirements;
  var headCount = options.headCount;
  var ctn;
  var i = 0;
  var existingItemWithNoRequirement = false;
  while(headCount > 0) {
        //                   
            angular.forEach(arr, function(item) {
               if(headCount === 0) {
                return;
              }  
                  item.quantity++;
                  headCount = headCount -1;
                  existingItemWithNoRequirement = true;             
            });
    }
}

//Dispatch to define quantity for each options
/*Budget, packagePrice = Number;(or float that'll depend what we will be the acceptance criteria)
/*defaultItems, upgradeItems = [];
*/
function _BudgetCheck(defaultPrice, Budget, defaultItems, upgradeItems) {
  var newItems = {};
  var order = defaultPrice;
  var total = 0;
  var i = 0;
  var index;
  var newUpgradeItems = [];
  //add upgrade Items while budget > order 
    
    for(i; i < upgradeItems.length; i++) {
      (function() {
      total = order + upgradeItems[i].defaultPrice;
      if(total < Budget) {
        order = total;
        index = upgradeItems.indexOf(upgradeItems[i]);
        defaultItems.push(upgradeItems[i]);       
      } else {
        newUpgradeItems.push(upgradeItems[i]); 
      }
      })(order);
     
    }

    //setup new array
    newItems.upgradeItems = newUpgradeItems;
    newItems.defaultItems = defaultItems;
    return newItems;
}

function Infos() {

}

angular.module('details')
    .controller('DetailsCtrl', ['$scope','CoreService','$location', function($scope, CoreService, $location){
        
        var viewModel = this;

        viewModel.searchOptions = CoreService.getSearchOptions();
        viewModel.messages = CoreService.getErrorMessage();



        viewModel.search = function() {
            // Get packages

        CoreService.apiGet('packages/' + viewModel.searchOptions.selectedHumanId.packageId, null,
            function (results) {  
            var hasDietaryRequirement;              
                if (results.data.success) {
                   var arr = results.data;
                   var packages = arr.package
                   var headCount;
                   var packageItemQuantity = 0;

                   viewModel.packageInfos = {};
                   viewModel.selectedItems = [];
                   viewModel.unSelectedItems = [];
                   // Package Infos                                      
                   viewModel.packageInfos.image = packages.images[0].medium;
                   viewModel.packageInfos.pricePerPerson = packages.pricePerPerson;
                   viewModel.packageInfos.name = packages.name;
                   viewModel.packageInfos.description = packages.description;
                   
                   //Message
                   viewModel.messages = []; 

                   // Requirements Check
                    /** 1: headCount*/
                    headCount = parseInt(viewModel.searchOptions.headCount);                                  
                    if(headCount > parseInt(packages.maxPeople))
                    {
                        viewModel.messages.push("Sorry, But this vendor provide catering for a maximum of "+packages.maxPeople + "persons");
                        return;
                    };

                    if(headCount < parseInt(packages.minPeople))
                         {
                        viewModel.messages.push("Sorry, But this vendor provide catering for a minimum of "+packages.minPeople + "persons");
                        return;
                    }; 

                    //create a fn [TODO need refactoring] 
                   angular.forEach(arr, function(things) {
                        var packageItems = things.packageItems;
                        angular.forEach(packageItems, function(packageItem) {
                            //Price, Qte
                            for (var key in packageItem) {
                                if (!packageItem.hasOwnProperty(key)) continue;
                                if(key=== 'item')
                                {
                                  var options =  packageItem[key].options;
                                  angular.forEach(options, function(option) {
                                    var dietaryRequirements = option.dietaryRequirements;
                                    //Dietaryrequirements
                                      hasDietaryRequirement = _hasDietaryRequirement(dietaryRequirements);                                   
                                      
                                      debugger
                                      //selected or unselected
                                      if(!packageItem.isUpgrade) {                                        
                                        _createPackages(viewModel.selectedItems,new Dish(packageItem.isUpgrade, packageItemQuantity, packageItem.price, option.name,hasDietaryRequirement, dietaryRequirements))                                        
                                      
                                      } else {                                        
                                         _createPackages(viewModel.unSelectedItems,new Dish(packageItem.isUpgrade, packageItemQuantity, packageItem.price, option.name,hasDietaryRequirement, dietaryRequirements))                                           
                                       
                                      } 
                                    })  
                                }      
                            }
                        })
                   })
                var createdArrays = {};

                //Check Price and add to selecteditem array to create new arrays
                if(viewModel.packageInfos.pricePerPerson < viewModel.searchOptions.budget) {
                  createdArrays = _BudgetCheck(viewModel.packageInfos.pricePerPerson, viewModel.searchOptions.budget, viewModel.selectedItems, viewModel.unSelectedItems)
                  
                  viewModel.selectedItems = createdArrays.defaultItems;
                  viewModel.unSelectedItems = createdArrays.upgradeItems;

                };

                //Dispatch if requirements
                _Dispatch(viewModel.selectedItems,viewModel.searchOptions,viewModel.messages);

                //selected Items
                viewModel.packageInfos.selected = viewModel.selectedItems;

                //unSelected Items
                viewModel.packageInfos.unSelected = viewModel.unSelectedItems;
              
                } else {
                   //No Results
                }
            }, function(error) {
             // errors
           
        });
        }
        //redirect if no search (should use localstorafge to store the last search)
        if(viewModel.searchOptions.selectedHumanId) {
           viewModel.search();
         } else {
            $location.path('/search');
         }
       
}]);
