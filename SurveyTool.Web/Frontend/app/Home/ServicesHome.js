myapp.service("AngularServicesHome", function ($http, configApi) {
    this.CheckLogin = function (username, password) {
        return $http({
            method: "post",
            url: configApi.hostApi+ "LoginRegister/CheckLogin",
            params: {
                username: username,
                password: password
            }
        }).success(function (result) {
            return result.data;
        });
        
    }
});