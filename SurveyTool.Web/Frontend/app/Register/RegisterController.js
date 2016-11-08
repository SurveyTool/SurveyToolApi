myapp.controller('RegisterController', function (AngularServicesRegister, $scope, $location, $cookieStore, $rootScope, $http, $mdDialog) {
    checkKeepLogin = function () {
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
            $location.path("/home")
        }

    }
    checkKeepLogin();

    $scope.checkPassword = function () {
        if ($scope.pass == $scope.cpass) {
            $scope.checkPass = "";
        }
        else {
            $scope.checkPass = "Not match";
        }

    }
    $scope.checkEmail = function () {
        if ($scope.email == $scope.remail) {
            $scope.checkemail = "";
        }
        else {
            $scope.checkemail = "Not match";
        }

    }


    $scope.genders = ('Female Male').split(' ').map(function (gender) {
        return { abbrev: gender };
    });
    $scope.checkExistsUerName = function () {
        var username = $scope.uname;
        var getData = AngularServicesRegister.checkExistsUserName(username);
        getData.success(function (result) {

            $scope.checkbien = result;
            if ($scope.checkbien == true) {
                $scope.varibaleCheckExistsUserName = "Username was used";
                /////
            }
            else {
                $scope.varibaleCheckExistsUserName = "";
            }
        });
    }
    $scope.checkExistsEmail = function () {
        var email = $scope.email;
        var getData = AngularServicesRegister.checkExistsEmail(email);
        getData.success(function (result) {

            $scope.checkbien = result;
            if ($scope.checkbien == true) {
                $scope.varibaleCheckExistsEmail = "Email was used";
                /////
            }
            else {
                $scope.varibaleCheckExistsEmail = "";
            }
        });
    }
    $scope.SubmitRegisterAccount = function (ev) {
        var firstname = $scope.fname;
        var lastname = $scope.lname;
        var fullname = lastname + " " + firstname;
        var username = $scope.uname;
        var password = $scope.pass;
        var repassword = $scope.cpass;
        var email = $scope.email;
        var reemail = $scope.remail;
        var phone = $scope.phone;
        var company = $scope.company;
        var datetime = $scope.birthday;
        var gender = $scope.gender;

        if (firstname == undefined) {
            $scope.statusRegister = "Not enter firstname";
            return '';
        }
        if (lastname == undefined) {
            $scope.statusRegister = "Not enter lastname";
            return '';
        }
        if (username == undefined) {
            $scope.statusRegister = "Not enter UserName";
            return '';
        }
        if (email == undefined) {
            $scope.statusRegister = "Not enter Email";
            return '';
        }
        if (reemail == undefined) {
            $scope.statusRegister = "Not enter Re-Email";
            return '';

        }
        if (phone == undefined) {
            $scope.statusRegister = "Not enter Phone";
            return '';
        }
        if (password != repassword) {
            $scope.statusRegister = "Password not matched";
            return '';
        }
        if (gender == undefined) {
            $scope.statusRegister = "Not choice gender";
            return;
        }
        if (datetime == undefined) {
            $scope.statusRegister = "Not enter bithday";
            return;
        }
        var date = $scope.birthday.getDate();
        var month = $scope.birthday.getMonth() + 1;
        var year = $scope.birthday.getYear() + 1900;
        var birthday = month + "/" + date + "/" + year;

        AngularServicesRegister.checkExistsUserName(username).success(function (result) {

            $scope.checkbien = result;
            if ($scope.checkbien == true) {
                $scope.statusRegister = "Username was used";
                return;
            }
            AngularServicesRegister.checkExistsEmail(email).success(function (result) {

                $scope.checkbien = result;
                if ($scope.checkbien == true) {
                    $scope.statusRegister = "Email was used";
                    return;
                }
                var getData = AngularServicesRegister.SubmitUser(fullname, username, password, email, phone, birthday, gender, company);
                getData.success(function (result) {
                    $scope.checkbien = result;

                    ///////

                    // Appending dialog to document.body to cover sidenav in docs app
                    var confirm = $mdDialog.confirm()
                          .title('You have successfully registered')
                          .textContent('Back to Home and login')
                          .ariaLabel('')
                          .targetEvent(ev)
                          .ok('OK')
                          .cancel();

                    $mdDialog.show(confirm).then(function () {
                        $location.path("/home");
                    }, function () {

                    });




                })
            });

        });
    }
});