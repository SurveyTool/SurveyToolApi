angular.module('mainApp').directive('validationErrors', function (ErrorMessages) {
  	return {
  		restrict: "A",
  		scope: {
            name:"@",
            type:"@",
  		    parameters: "=",
  			errorClass: "@"
  		},
  		controller: function ($scope) {
  		    $scope.errorMessage = function () {
  		        return ErrorMessages.error(this.name, this.type, this.parameters || null);
  		    };
  		    $scope.buildErrorClass = function () { return this.errorClass || "validate-message"; }
  		},
  		template: "<span ng-class='buildErrorClass()'>{{errorMessage()}}</span>"
  	};
  });