myapp.config(function ($routeProvider) {
    $routeProvider
    .when("/register", {
        templateUrl: "/Frontend/App/Register/Register.html",
       
    })
    .when("/home", {
        templateUrl: "/Frontend/App/Home/Home.html",
        
    })
    .when("/dasboard", {
        templateUrl: "/Frontend/App/Dasboard/Dasboard.html",
        
    })
    .when("/createsurvey", {
        templateUrl: "/Frontend/App/CreateSurvey/CreateSurvey.html"
    })
    .when("/editsurvey", {
        templateUrl: "/Frontend/App/CreateSurvey/CreateSurvey.html"
    })
    .when("/conductionsurvey", {
        templateUrl: "/Frontend/App/ConductionSurvey/ConductionSurvey.html"
    })
    .when("/resultsurvey", {
        templateUrl: "/Frontend/App/ResultSurvey/ResultSurvey.html"
    })
    .otherwise({
        templateUrl: "/Frontend/App/Home/Home.html",
        
    });


});