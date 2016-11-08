myapp.controller('HomeController', function ($rootScope, $cookieStore, $http, $scope, AngularServicesHome, myShareServices, AuthenticationService, $mdDialog, $mdMedia, $location) {
    $scope.status = '  ';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    //////////////////Keep login if have account in cookies
    checkKeepLogin=function()
    {
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
            myShareServices.setStatusLogin(true);
            myShareServices.setFullName($rootScope.globals.currentUser.username);
            myShareServices.prepForBroadcast();
        }
     
    }
    checkKeepLogin();
    $scope.showLoadingLogin = false;



    showDialogLogin=function(ev)
    {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'dialog1.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        })
        .then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function () {
            $scope.status = 'You cancelled the dialog.';
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    }
    $scope.showAdvanced = function (ev) {
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $location.path("/dasboard");
        }
        else {
            showDialogLogin(ev);
        }
    };
    $scope.$on("ShowDialogLogin", function () {
        showDialogLogin(myShareServices.eventDialog)
    });
});

function DialogController($scope, AngularServicesHome, myShareServices, AuthenticationService, $mdDialog, $location) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.checkPassword = function () {
        $scope.nhn = "kgkdslkfsd";
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.goRegister=function()
    {
        $mdDialog.cancel();
        $location.path("register")
    }
    $scope.login = function () {
        $scope.showLoadingLogin = true;
        var username = $scope.username;
        var password = $scope.password;
        var getData = AngularServicesHome.CheckLogin(username, password);
       
        getData.success(function (result) {

            $scope.checkbien = result.check;
            if ($scope.checkbien == true) {
                AuthenticationService.SetCredentials(username, password);
                myShareServices.setStatusLogin(result.check);
                myShareServices.setFullName(result.fullname);
                myShareServices.prepForBroadcast();
                $location.path('/dasboard');
                $mdDialog.hide();
                $mdDialog.cancel();
                $scope.showLoadingLogin = false;
            }
            else {
                $scope.errorLogin = "Not match username or password";
                $scope.showLoadingLogin = false;
            }
        });
        
    };
}