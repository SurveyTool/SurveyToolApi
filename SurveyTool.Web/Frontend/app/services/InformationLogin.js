myapp.factory.$inject = ['$rootScope', '$cookieStore'];
myapp.factory("InformationLogin", function ($rootScope, $cookieStore) {
    var sharedService = {};
    sharedService.username = '';
    sharedService.authodata = '';
    sharedService.checkLogin = false;
    sharedService.getUserName=function()
    {
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
            this.username = $rootScope.globals.currentUser.username;
        }
    }
  
});