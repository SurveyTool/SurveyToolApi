myapp.service("AngularServicesRegister", function ($http) {
    this.checkExistsUserName = function (username) {
        return $http({
            method: "post",
            url: "LoginRegister/CheckExistsUserNameInRegister",
            params: {
                username: username
            }
        }).success(function (result) {
            return result.data;
        });

    }
    this.checkExistsEmail = function (email) {
        return $http({
            method: "post",
            url: "LoginRegister/CheckExistsEmailInRegister",
            params: {
                email: email
            }
        }).success(function (result) {
            return result.data;
        });

    }
    this.SubmitUser=function(fullname, username, password, email, phone, birthday, gender, company)
    {
        return $http({
            method: "post",
            url: "LoginRegister/SubmitUser",
            params: {
                fullname: fullname,
                username: username,
                password: password,
                email: email,
                phone: phone,
                birthday: birthday,
                gender: gender,
                company: company
            }
        }).success(function (result) {
            return result.data;
        });
    }
});