'use strict';
angular.module('mainApp').controller('Login',
    ['$scope', '$rootScope', '$state', '$http', 'cfpLoadingBar', 'AuthService',
        function ($scope, $rootScope, $state, $http, cfpLoadingBar, AuthService) {

    $scope.login = function (loginForm) {

        if (loginForm.$valid) {
            var credential = {
                username: $scope.username,
                password: $scope.password
            }

            AuthService.login(credential).then(function (response) {
                // login is successful, redirect to default route
                $rootScope.isTrainer = false;
                $state.go('');
            }, function (response) {
                $scope.errorMessage = response.data.message;
            });
        }

        
        
    }
    
}]);
