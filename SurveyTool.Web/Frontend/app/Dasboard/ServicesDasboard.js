
myapp.service("AngularServicesDasboard", function ($http, configApi) {
    this.GetAllSurvey = function (userName) {
        return $http({
            method: "get",
            url: configApi.hostApi+ "managesurvey/getallsurvey",
            params: {
                UserName: userName
            }
        }).success(function (sur) {
            return sur.data;
        });
    }
    this.DeleteSurvey=function(Id)
    {
        return $http({
            method: "post",
            url: configApi.hostApi+ "managesurvey/deletesurvey",
            params: {
                IdSurvey: Id
            }
        }).success(function (result) {
            return result.data;
        });
    }
    this.GetResultAnswer=function(IdSurvey)
    {
        return $http({
            method: "get",
            url: configApi.hostApi+ "loadingdatasurvey/GetListAnswerBySurvey",
            params: {
                IdSurvey: IdSurvey
            }

        }).success(function (result) {
            return result.data;
        });
    }
    this.GetListQuestionType = function () {
        var data = $http({
            method: "get",
            url: configApi.hostApi+ "loadingdatasurvey/GetListQuestionType",
            params: {
            }
        })
        return data.success(function (result) {
            return result;
        });
    }
    this.GetDataSurveyInfo = function (IdSurvey) {
        return $http({
            method: "get",
            url: configApi.hostApi+ "loadingdatasurvey/GetInformationSurvey",
            params: {
                IdSurvey: IdSurvey
            }
        })
        return data.success(function (result) {
            return result;
        });
    }
    this.GetNumberQuestion = function (IdSurvey) {
        return $http({
            method: "get",
            url: configApi.hostApi+ "loadingdatasurvey/GetNumberQuestion",
            params: {
                IdSurvey: IdSurvey
            }
        })
        return data.success(function (result) {
            return result;
        });
    }
    this.GetNumberSection = function (IdSurvey) {
        return $http({
            method: "get",
            url: configApi.hostApi+ "loadingdatasurvey/GetNumberSection",
            params: {
                IdSurvey: IdSurvey
            }
        })
        return data.success(function (result) {
            return result;
        });
    }

});