'use strict';

angular.module('mainApp')
.factory('AuthService', [ '$http', '$rootScope', '$cookieStore', 'USER_ROLES',
function($http, $rootScope, $cookieStore, USER_ROLES) {

    var authService = {};

    authService.login = function (credentials) {
        return $http.post('Home/Login', credentials)
            .then(function (response) {
                // if login succeeds, user information is returned 
                // in response.data.data
                authService.setCredential(response.data.data);
            });
    };

    authService.logout = function () {
        return $http.post('Home/Logout', {})
            .then(function (response) {
                authService.clearCredential();
            });
    }

    authService.setCredential = function (user) {
        localStorage.setItem('user', JSON.stringify(user));
        $rootScope.authenticated = true;
        
        var splitedFullNameArray = user.FullName.trim().split(" ");
        user.FirstName = splitedFullNameArray[splitedFullNameArray.length-1];
        $rootScope.currentUser = user;
    }

    authService.clearCredential = function () {
        localStorage.removeItem('user');
        $rootScope.authenticated = false;
        $rootScope.currentUser = null;
    }

    authService.isAuthenticated = function() {
        return ($rootScope.currentUser != null);
    };

    authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }

        if (authorizedRoles && authorizedRoles.length > 0) {
            if (authorizedRoles.indexOf(USER_ROLES.ANONYMOUS) >= 0)
                return true;

            if (!authService.isAuthenticated())
                return false;

            var intersectedRoles = authorizedRoles.filter(function (role) {
                return $rootScope.currentUser.SystemRoles.indexOf(role) != -1
            });
            
            return (intersectedRoles.length > 0);
        } else {
            // only allow authenticaticated user by default if no role spcified
            return authService.isAuthenticated();
        }        
    }

    return authService;
} ]);