myapp.controller('MasterController', function ($mdDialog, myShareServices, AuthenticationService, $scope, $location) {
    $scope.notLogin = true;
    $scope.Logged = false;
    $scope.$on("handleBroadcast", function () {
        if (myShareServices.showStatusLogin == true) {
            $scope.nameUser = myShareServices.FullName;
            $scope.notLogin = false;
            $scope.Logged = true;
        }
        else {
            $scope.notLogin = true;
            $scope.Logged = false;
        }
    });
    $scope.showLogin = function (ev) {
        myShareServices.setEventLogin(ev);
        myShareServices.NotifyShowDialogLogin();
    }
    $scope.logoutUser = function () {
        myShareServices.setStatusLogin(false);
        myShareServices.prepForBroadcast();
        AuthenticationService.ClearCredentials();
        $location.path("/home");
    }
});