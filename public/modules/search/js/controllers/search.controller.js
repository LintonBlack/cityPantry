'use strict';

//Dummy data
var DummyData = [
            {   
                packageId : 2104,
                label : 'Example package 2104'
            },
            {   
                packageId : 913,
                label : 'Example package 913'
            },
            {   
                packageId : 6595,
                label : 'Example package 6595'
            },
            {   
                packageId : 4767,
                label : 'Example package 4767'
            }
        ];

//dietaryRequirementOptions {}
//id : String, 
//name : String,
//quantity : Number
function dietaryRequirementOptions(id, name,quantity ) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
}


angular.module('search')
    .controller('SearchCtrl', ['$scope', 'CoreService', function($scope , CoreService) {
    	var urlSearch = '';
        var viewModel = this;
        viewModel.ModuleTest = "Modify me in search Module";
        viewModel.errorCount = false;
        //Hard coded HumanIds 
        viewModel.packagesList = DummyData;

        //Default searchOptions 
        viewModel.searchOptions = CoreService.searchOptions;
        viewModel.searchOptions.selectedHumanId = viewModel.packagesList[2];
   		viewModel.searchOptions.budget = 0;
   		viewModel.searchOptions.headCount = 1;
        viewModel.searchOptions.dietaryRequirements =[];
        viewModel.searchOptions.allDietaryRequirements =[];

        // Return dietary requirements
        // Might be put in a service        
        CoreService.apiGet('dietary-requirements', null,
            function (results) {                
                if (results.data.count === 0) {
                	// No Results                

                } else {
                var dietaryArray = results.data.dietaryRequirements
                viewModel.searchOptions.allDietaryRequirements = dietaryArray;
                //populate dietary options
                viewModel.dietaryRequirements = [];
                angular.forEach(dietaryArray, function(item) {                     
                    item.isActive ? this.push(item) : '';
                }, viewModel.dietaryRequirements);
                
                
                //Default selectedDietaryRequirement
        		viewModel.selectedDietaryRequirement = viewModel.dietaryRequirements[0];
        		console.log(viewModel.dietaryRequirements);
                }
              
            }, function(error) {
             // errors
             
        });

        //Requirement Change Qte
        viewModel.changeQte = function(dietary) {
            
            var found = false,
                index = 0,
                i = 0,
                dietaryArray = viewModel.searchOptions.dietaryRequirements;

                  for(i; i < dietaryArray.length; i++) {
                           //
                        if(dietaryArray[i].id === dietary.id) {
                           dietaryArray[i].quantity = dietary.quantity;
                           found = true;                                                       
                            }                        
                    };  
                if(!found) {
                    viewModel.searchOptions.dietaryRequirements.push(dietary);
                }
                //Always initialize totalOptionsRequirements
                viewModel.totalOptionsRequirements = 0;
                //check number
                angular.forEach(viewModel.searchOptions.dietaryRequirements, function(requirements) { 
                //Populate totalOptionsRequirements 
                    viewModel.totalOptionsRequirements = viewModel.totalOptionsRequirements + requirements.quantity;                                          
                }); 
                    
        }


        // watch totalOptionsRequirements
        $scope.$watchCollection('[viewModel.totalOptionsRequirements,viewModel.searchOptions.headCount]',
             function() {
        //Compare viewModel.totalOptionsRequirements to viewModel.searchOptions.headCount
         if(viewModel.totalOptionsRequirements > viewModel.searchOptions.headCount) {
               viewModel.errorCount = true;
            } else {
                viewModel.errorCount = false;
            }
    }, true);

       

}]);
