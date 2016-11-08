myapp.service("AngularServicesHome", function ($http) {
    this.CheckLogin = function (username, password) {
        return $http({
            method: "post",
            url: "LoginRegister/CheckLogin",
            params: {
                username: username,
                password: password
            }
        }).success(function (result) {
            return result.data;
        });
        
    }
});