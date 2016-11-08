'use strict';
angular.module('mainApp')
    .controller('Application', ['$scope', '$rootScope', '$http', 'cfpLoadingBar',
        '$state', 'AuthService', 'AUTH_EVENTS', '$window', 'USER_ROLES', 'ModalService','$interval',
function ($scope, $rootScope, $http, cfpLoadingBar, $state, AuthService, AUTH_EVENTS, $window, USER_ROLES, ModalService, $interval) {

    init();
    function init() {
        $scope.menuRoute = $state.current.name;
        $rootScope.isTrainer = false;
        $http.get("Class/isTrainer")
                       .success(function (response) {
                           if (response.success) {
                               $rootScope.isTrainer = response.data;
                           } else {
                               ModalService.showModal({}, {
                                   headerText: 'Error',
                                   bodyText: response.message
                               });
                           }
                       }).error(function (response) {
                           
                       });

        $http.get("Course/GetDropdownList")
        .success(function (response) {
            if (response.success) {
                $rootScope.trainingMethods = response.data.trainingMethods;
                $rootScope.assessmentMethods = response.data.assessmentMethods;
            }
        }).error(function (response) {
         
        });
    }

    $scope.logout = function () {
        AuthService.logout().then(function (response) {
            //$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            $rootScope.isTrainer = false;
            $state.go('login');
            $rootScope.selectedDomainId = null;
        });
    };

    $scope.searchCourses = function ($viewValue) {
        return $http.get('Course/SearchCourses', {
            params: {
                keyword: $viewValue
            }
        }).then(function (response) {
            return response.data.data;
        });
    };

    $scope.onSearchCourse = function ($item, $model, $label) {
        if ($item.IsDomain) {
            $rootScope.selectedDomainId = $item.Id;

            if ($state.current.name == "coursecatalog") {
                $scope.$broadcast('eventGetDomain', {});
            }

            $state.go('coursecatalog');
        } else {
            $state.go('viewcourse', { 'id': $item.Id });
        }
    };

    $scope.hasViewPermission = function () {
        return AuthService.isAuthorized([USER_ROLES.MANAGER]);
    }

    $scope.isAdminOrTTC = function () {
        return AuthService.isAuthorized([USER_ROLES.ADMIN, USER_ROLES.TTC_USER,
                                         USER_ROLES.TTC_MANAGER, USER_ROLES.TTC_CORDINATOR]);
    }

    var updateClock = function () {
        $rootScope.currentDateTime = new Date();
    };

   
    $interval(function() {
        updateClock()
    }, 1000);

    updateClock();

}]);
